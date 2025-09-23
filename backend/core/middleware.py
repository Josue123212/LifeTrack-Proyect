"""Middleware personalizado para el sistema de gestión médica.

Este módulo contiene middleware para:
1. Logging de acciones por rol
2. Rate limiting por rol
3. Audit trail para acciones administrativas
"""

import json
import time
import logging
from datetime import datetime, timedelta
from django.core.cache import cache
from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth import get_user_model
from django.conf import settings
from .models import AuditLog

User = get_user_model()

# Configurar logger específico para auditoría
audit_logger = logging.getLogger('audit')
action_logger = logging.getLogger('actions')

# Obtener configuraciones desde settings
def get_rate_limit_settings():
    return getattr(settings, 'RATE_LIMIT_SETTINGS', {})

def get_audit_settings():
    return getattr(settings, 'AUDIT_SETTINGS', {})

def get_security_headers():
    return getattr(settings, 'SECURITY_HEADERS', {})

def get_middleware_logging_settings():
    return getattr(settings, 'MIDDLEWARE_LOGGING', {})


class RoleBasedLoggingMiddleware(MiddlewareMixin):
    """
    Middleware para logging de acciones específicas por rol.
    """
    
    # Acciones que requieren logging especial por rol
    LOGGED_ACTIONS = {
        'doctor': [
            '/api/appointments/',
            '/api/patients/',
            '/api/doctors/me/',
        ],
        'secretary': [
            '/api/appointments/',
            '/api/patients/',
            '/api/secretaries/',
        ],
        'admin': [
            '/api/admin/',
            '/api/users/',
            '/api/reports/',
        ],
        'superadmin': [
            '/api/admin/',
            '/api/users/',
            '/api/system/',
        ]
    }

    def process_request(self, request):
        """
        Procesar la petición entrante y registrar información relevante.
        """
        request.start_time = time.time()
        request.audit_data = {
            'ip_address': self.get_client_ip(request),
            'user_agent': request.META.get('HTTP_USER_AGENT', ''),
            'method': request.method,
            'path': request.path,
        }
        return None

    def process_response(self, request, response):
        """
        Procesar la respuesta y crear logs de auditoría si es necesario.
        """
        audit_settings = get_audit_settings()
        
        # Verificar si el audit está habilitado
        if not audit_settings.get('ENABLED', True):
            return response
            
        # Determinar si loggear usuarios anónimos
        if not hasattr(request, 'user') or not request.user.is_authenticated:
            if audit_settings.get('LOG_ANONYMOUS_USERS', True):
                self.create_audit_log(request, response)
            return response
            
        user_role = getattr(request.user, 'role', None)
        
        # Verificar si loggear requests GET
        if request.method == 'GET' and not audit_settings.get('LOG_GET_REQUESTS', False):
            return response
            
        # Verificar si esta acción debe ser loggeada para este rol
        if self.should_log_action(request.path, user_role, audit_settings):
            self.create_audit_log(request, response)
            
        # Log especial para acciones administrativas
        if user_role in ['admin', 'superadmin'] and request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            self.create_admin_audit_log(request, response)

        return response

    def should_log_action(self, path, user_role, audit_settings):
        """
        Determinar si una acción debe ser loggeada para un rol específico.
        """
        # Siempre loggear acciones críticas
        critical_resources = audit_settings.get('CRITICAL_RESOURCES', [])
        if any(resource in path for resource in critical_resources):
            return True
            
        if not user_role or user_role not in self.LOGGED_ACTIONS:
            return False
            
        logged_paths = self.LOGGED_ACTIONS[user_role]
        return any(path.startswith(logged_path) for logged_path in logged_paths)

    def create_audit_log(self, request, response):
        """
        Crear registro de auditoría para la acción.
        """
        try:
            audit_settings = get_audit_settings()
            
            # Extraer datos de la petición de forma segura
            request_data = None
            if request.method in ['POST', 'PUT', 'PATCH'] and audit_settings.get('LOG_SENSITIVE_DATA', False):
                try:
                    if hasattr(request, 'body') and request.body:
                        request_data = json.loads(request.body.decode('utf-8'))
                        # Remover datos sensibles según configuración
                        if isinstance(request_data, dict):
                            sensitive_fields = audit_settings.get('SENSITIVE_FIELDS', [])
                            for field in sensitive_fields:
                                request_data.pop(field, None)
                except (json.JSONDecodeError, UnicodeDecodeError):
                    request_data = {'error': 'Could not parse request data'}

            # Crear log de auditoría
            AuditLog.objects.create(
                user=request.user,
                action=self.get_action_name(request),
                resource=self.get_resource_name(request.path),
                resource_id=self.get_resource_id(request.path),
                method=request.method,
                path=request.path,
                ip_address=request.audit_data['ip_address'],
                user_agent=request.audit_data['user_agent'],
                request_data=request_data,
                response_status=response.status_code,
            )
            
            # Log adicional para el sistema de logging
            action_logger.info(
                f"User {request.user.username} ({request.user.role}) "
                f"performed {request.method} on {request.path} "
                f"from {request.audit_data['ip_address']} "
                f"- Status: {response.status_code}"
            )
            
        except Exception as e:
            # No fallar la petición por errores de logging
            audit_logger.error(f"Error creating audit log: {str(e)}")

    def create_admin_audit_log(self, request, response):
        """
        Crear log especial para acciones administrativas críticas.
        """
        try:
            audit_logger.warning(
                f"ADMIN ACTION: {request.user.username} ({request.user.role}) "
                f"performed {request.method} on {request.path} "
                f"from {request.audit_data['ip_address']} "
                f"- Status: {response.status_code} "
                f"- Time: {datetime.now().isoformat()}"
            )
        except Exception as e:
            audit_logger.error(f"Error creating admin audit log: {str(e)}")

    def get_action_name(self, request):
        """
        Extraer el nombre de la acción basado en el método y path.
        """
        method_actions = {
            'GET': 'view',
            'POST': 'create',
            'PUT': 'update',
            'PATCH': 'partial_update',
            'DELETE': 'delete',
        }
        return method_actions.get(request.method, 'unknown')

    def get_resource_name(self, path):
        """
        Extraer el nombre del recurso del path.
        """
        path_parts = path.strip('/').split('/')
        if len(path_parts) >= 2 and path_parts[0] == 'api':
            return path_parts[1]
        return 'unknown'

    def get_resource_id(self, path):
        """
        Extraer el ID del recurso si está presente en el path.
        """
        path_parts = path.strip('/').split('/')
        for part in path_parts:
            if part.isdigit():
                return part
        return None

    def get_client_ip(self, request):
        """
        Obtener la IP real del cliente considerando proxies.
        """
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class RoleBasedRateLimitMiddleware(MiddlewareMixin):
    """
    Middleware para implementar rate limiting basado en roles.
    """
    
    # Endpoints que no tienen rate limiting
    EXEMPT_PATHS = [
        '/api/auth/login/',
        '/api/auth/refresh/',
        '/api/health/',
        '/admin/',
    ]

    def process_request(self, request):
        """
        Verificar rate limiting antes de procesar la petición.
        """
        rate_limit_settings = get_rate_limit_settings()
        
        # Verificar si rate limiting está habilitado
        if not rate_limit_settings.get('ENABLED', True):
            return None
            
        # Verificar si el path está exento
        exempt_paths = rate_limit_settings.get('EXEMPT_PATHS', self.EXEMPT_PATHS)
        if any(request.path.startswith(exempt) for exempt in exempt_paths):
            return None

        # Obtener el rol del usuario
        user_role = self.get_user_role(request)
        
        # Obtener límite para el rol desde configuración
        rate_limits = rate_limit_settings.get('RATE_LIMITS', {})
        rate_limit = rate_limits.get(user_role, rate_limits.get('anonymous', 20))
        
        # Crear clave única para el cache
        cache_key = self.get_cache_key(request, user_role)
        
        # Verificar rate limit
        if self.is_rate_limited(cache_key, rate_limit):
            return JsonResponse({
                'error': 'Rate limit exceeded',
                'message': f'Too many requests. Limit: {rate_limit} per minute for role: {user_role}',
                'retry_after': 60
            }, status=429)

        return None

    def get_user_role(self, request):
        """
        Obtener el rol del usuario actual.
        """
        if hasattr(request, 'user') and request.user.is_authenticated:
            return getattr(request.user, 'role', 'client')
        return 'anonymous'

    def get_cache_key(self, request, user_role):
        """
        Generar clave única para el cache basada en usuario/IP y rol.
        """
        if hasattr(request, 'user') and request.user.is_authenticated:
            identifier = f"user_{request.user.id}"
        else:
            identifier = f"ip_{self.get_client_ip(request)}"
        
        return f"rate_limit_{identifier}_{user_role}"

    def is_rate_limited(self, cache_key, rate_limit):
        """
        Verificar si se ha excedido el rate limit.
        """
        current_time = int(time.time())
        window_start = current_time - 60  # Ventana de 1 minuto
        
        # Obtener peticiones en la ventana actual
        requests = cache.get(cache_key, [])
        
        # Filtrar peticiones dentro de la ventana de tiempo
        requests = [req_time for req_time in requests if req_time > window_start]
        
        # Verificar si se excede el límite
        if len(requests) >= rate_limit:
            return True
        
        # Agregar la petición actual
        requests.append(current_time)
        
        # Guardar en cache por 60 segundos
        cache.set(cache_key, requests, 60)
        
        return False

    def get_client_ip(self, request):
        """
        Obtener la IP real del cliente considerando proxies.
        """
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class SecurityHeadersMiddleware(MiddlewareMixin):
    """
    Middleware para agregar headers de seguridad.
    """
    
    def process_response(self, request, response):
        """
        Agregar headers de seguridad a todas las respuestas.
        """
        # Obtener configuración de headers de seguridad desde settings
        security_headers = getattr(settings, 'SECURITY_HEADERS', {})
        
        # Aplicar headers de seguridad
        for header_name, header_value in security_headers.items():
            if header_value:  # Solo aplicar si el valor no está vacío
                response[header_name] = header_value
        
        return response