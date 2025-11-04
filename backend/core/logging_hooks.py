import logging
from datetime import datetime
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver
from django.contrib.auth.signals import user_logged_in, user_logged_out, user_login_failed

User = get_user_model()
logger = logging.getLogger(__name__)


class SystemLogger:
    """
    Clase para centralizar el logging de acciones importantes del sistema.
    Proporciona métodos para registrar diferentes tipos de eventos.
    """
    
    @staticmethod
    def log_user_action(user, action, details=None, level='info'):
        """
        Registra acciones de usuario en el sistema.
        
        Args:
            user: Instancia del usuario
            action: Descripción de la acción realizada
            details: Detalles adicionales (opcional)
            level: Nivel de logging (info, warning, error)
        """
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        user_info = f"{user.username} ({user.email})" if user.is_authenticated else "Usuario anónimo"
        
        log_message = f"👤 [ACCIÓN USUARIO] {timestamp} - {user_info} - {action}"
        if details:
            log_message += f" - Detalles: {details}"
        
        getattr(logger, level)(log_message)
    
    @staticmethod
    def log_security_event(event_type, details, user=None, level='warning'):
        """
        Registra eventos de seguridad del sistema.
        
        Args:
            event_type: Tipo de evento de seguridad
            details: Detalles del evento
            user: Usuario relacionado (opcional)
            level: Nivel de logging
        """
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        user_info = f" - Usuario: {user.username} ({user.email})" if user else ""
        
        log_message = f"🔒 [SEGURIDAD] {timestamp} - {event_type} - {details}{user_info}"
        getattr(logger, level)(log_message)
    
    @staticmethod
    def log_system_event(event_type, details, level='info'):
        """
        Registra eventos generales del sistema.
        
        Args:
            event_type: Tipo de evento del sistema
            details: Detalles del evento
            level: Nivel de logging
        """
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        log_message = f"⚙️ [SISTEMA] {timestamp} - {event_type} - {details}"
        getattr(logger, level)(log_message)
    
    @staticmethod
    def log_data_change(model_name, object_id, action, user=None, changes=None):
        """
        Registra cambios en los datos del sistema.
        
        Args:
            model_name: Nombre del modelo afectado
            object_id: ID del objeto modificado
            action: Acción realizada (CREATE, UPDATE, DELETE)
            user: Usuario que realizó el cambio (opcional)
            changes: Diccionario con los cambios realizados (opcional)
        """
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        user_info = f" por {user.username}" if user else ""
        
        log_message = f"📊 [DATOS] {timestamp} - {action} en {model_name} ID:{object_id}{user_info}"
        if changes:
            log_message += f" - Cambios: {changes}"
        
        logger.info(log_message)


# Signals para eventos de autenticación
@receiver(user_logged_in)
def log_user_login(sender, request, user, **kwargs):
    """
    Hook que registra cuando un usuario inicia sesión.
    """
    try:
        ip_address = request.META.get('REMOTE_ADDR', 'IP desconocida')
        user_agent = request.META.get('HTTP_USER_AGENT', 'User-Agent desconocido')[:100]
        
        SystemLogger.log_security_event(
            event_type="LOGIN_EXITOSO",
            details=f"IP: {ip_address}, User-Agent: {user_agent}",
            user=user,
            level='info'
        )
        
        # Actualizar último login si no se hace automáticamente
        user.last_login = datetime.now()
        user.save(update_fields=['last_login'])
        
    except Exception as e:
        logger.error(f"❌ Error al registrar login de usuario {user.username}: {str(e)}")


@receiver(user_logged_out)
def log_user_logout(sender, request, user, **kwargs):
    """
    Hook que registra cuando un usuario cierra sesión.
    """
    try:
        if user:
            ip_address = request.META.get('REMOTE_ADDR', 'IP desconocida')
            
            SystemLogger.log_security_event(
                event_type="LOGOUT",
                details=f"IP: {ip_address}",
                user=user,
                level='info'
            )
        
    except Exception as e:
        logger.error(f"❌ Error al registrar logout: {str(e)}")


@receiver(user_login_failed)
def log_failed_login(sender, credentials, request, **kwargs):
    """
    Hook que registra intentos fallidos de inicio de sesión.
    """
    try:
        ip_address = request.META.get('REMOTE_ADDR', 'IP desconocida')
        username = credentials.get('username', 'Usuario desconocido')
        user_agent = request.META.get('HTTP_USER_AGENT', 'User-Agent desconocido')[:100]
        
        SystemLogger.log_security_event(
            event_type="LOGIN_FALLIDO",
            details=f"Usuario: {username}, IP: {ip_address}, User-Agent: {user_agent}",
            level='warning'
        )
        
    except Exception as e:
        logger.error(f"❌ Error al registrar login fallido: {str(e)}")


# Signals para cambios en usuarios
@receiver(post_save, sender=User)
def log_user_changes(sender, instance, created, **kwargs):
    """
    Hook que registra cambios en los usuarios del sistema.
    """
    try:
        action = "CREADO" if created else "ACTUALIZADO"
        
        details = {
            'username': instance.username,
            'email': instance.email,
            'role': instance.role,
            'is_active': instance.is_active,
            'is_staff': instance.is_staff
        }
        
        SystemLogger.log_data_change(
            model_name="User",
            object_id=instance.id,
            action=action,
            changes=details
        )
        
        # Log específico para cambios de rol
        if not created and hasattr(instance, '_original_role'):
            if instance._original_role != instance.role:
                SystemLogger.log_security_event(
                    event_type="CAMBIO_ROL",
                    details=f"Usuario {instance.username} cambió de rol: {instance._original_role} → {instance.role}",
                    user=instance,
                    level='warning'
                )
        
    except Exception as e:
        logger.error(f"❌ Error al registrar cambios de usuario {instance.username}: {str(e)}")


@receiver(pre_save, sender=User)
def track_user_role_changes(sender, instance, **kwargs):
    """
    Hook que rastrea cambios de rol antes de guardar.
    """
    try:
        if instance.pk:
            original = User.objects.get(pk=instance.pk)
            instance._original_role = original.role
    except User.DoesNotExist:
        instance._original_role = None
    except Exception as e:
        logger.error(f"❌ Error al rastrear cambios de rol: {str(e)}")


@receiver(post_delete, sender=User)
def log_user_deletion(sender, instance, **kwargs):
    """
    Hook que registra cuando se elimina un usuario.
    """
    try:
        SystemLogger.log_security_event(
            event_type="USUARIO_ELIMINADO",
            details=f"Usuario eliminado: {instance.username} ({instance.email}) - Rol: {instance.role}",
            level='warning'
        )
        
    except Exception as e:
        logger.error(f"❌ Error al registrar eliminación de usuario: {str(e)}")


# Funciones de utilidad para logging manual
def log_api_access(request, endpoint, method, status_code, response_time=None):
    """
    Función para registrar accesos a la API.
    
    Args:
        request: Objeto request de Django
        endpoint: Endpoint accedido
        method: Método HTTP utilizado
        status_code: Código de respuesta HTTP
        response_time: Tiempo de respuesta en ms (opcional)
    """
    try:
        user = request.user if request.user.is_authenticated else None
        ip_address = request.META.get('REMOTE_ADDR', 'IP desconocida')
        
        details = f"{method} {endpoint} - Status: {status_code} - IP: {ip_address}"
        if response_time:
            details += f" - Tiempo: {response_time}ms"
        
        SystemLogger.log_user_action(
            user=user,
            action="API_ACCESS",
            details=details
        )
        
    except Exception as e:
        logger.error(f"❌ Error al registrar acceso API: {str(e)}")


def log_permission_denied(request, resource, action):
    """
    Función para registrar intentos de acceso denegados.
    
    Args:
        request: Objeto request de Django
        resource: Recurso al que se intentó acceder
        action: Acción que se intentó realizar
    """
    try:
        user = request.user if request.user.is_authenticated else None
        ip_address = request.META.get('REMOTE_ADDR', 'IP desconocida')
        
        SystemLogger.log_security_event(
            event_type="ACCESO_DENEGADO",
            details=f"Recurso: {resource}, Acción: {action}, IP: {ip_address}",
            user=user,
            level='warning'
        )
        
    except Exception as e:
        logger.error(f"❌ Error al registrar acceso denegado: {str(e)}")