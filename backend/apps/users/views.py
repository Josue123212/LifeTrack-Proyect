from rest_framework import status, generics, permissions, viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from django.contrib.auth import logout
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q

from .models import User
from .serializers import (
    CustomTokenObtainPairSerializer,
    UserRegistrationSerializer,
    UserSerializer,
    UserProfileSerializer,
    ChangePasswordSerializer
)


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Vista personalizada para obtener tokens JWT.
    Permite login con email o username.
    """
    serializer_class = CustomTokenObtainPairSerializer
    
    def post(self, request, *args, **kwargs):
        """
        Manejar el login del usuario.
        """
        serializer = self.get_serializer(data=request.data)
        
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return Response(
                {
                    'error': 'Credenciales inválidas',
                    'detail': str(e)
                },
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        return Response(
            {
                'message': 'Login exitoso',
                'data': serializer.validated_data
            },
            status=status.HTTP_200_OK
        )


class CustomTokenRefreshView(TokenRefreshView):
    """
    Vista personalizada para refrescar tokens JWT.
    """
    
    def post(self, request, *args, **kwargs):
        """
        Manejar el refresh del token.
        """
        serializer = self.get_serializer(data=request.data)
        
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])
        
        return Response(
            {
                'message': 'Token refrescado exitosamente',
                'data': serializer.validated_data
            },
            status=status.HTTP_200_OK
        )


class LogoutView(APIView):
    """
    Vista para cerrar sesión del usuario.
    Blacklistea el refresh token.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """
        Manejar el logout del usuario.
        """
        try:
            refresh_token = request.data.get('refresh_token')
            
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            # Cerrar sesión de Django (si se usa session authentication)
            logout(request)
            
            return Response(
                {'message': 'Logout exitoso'},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {
                    'error': 'Error al cerrar sesión',
                    'detail': str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )


class UserRegistrationView(generics.CreateAPIView):
    """
    Vista para registrar nuevos usuarios.
    """
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        """
        Crear un nuevo usuario.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.save()
        
        # Generar tokens para el usuario recién creado
        refresh = RefreshToken.for_user(user)
        
        return Response(
            {
                'message': 'Usuario registrado exitosamente',
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            },
            status=status.HTTP_201_CREATED
        )


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    Vista para ver y actualizar el perfil del usuario.
    """
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        """
        Retornar el usuario actual.
        """
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        """
        Actualizar el perfil del usuario.
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.save()
        
        return Response(
            {
                'message': 'Perfil actualizado exitosamente',
                'user': serializer.data
            },
            status=status.HTTP_200_OK
        )


class ChangePasswordView(APIView):
    """
    Vista para cambiar la contraseña del usuario.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """
        Cambiar la contraseña del usuario.
        """
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'message': 'Contraseña cambiada exitosamente'},
                status=status.HTTP_200_OK
            )
        
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class UserListView(generics.ListAPIView):
    """
    Vista para listar usuarios (solo para administradores).
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        Filtrar usuarios según el rol del usuario actual.
        """
        user = self.request.user
        
        # Solo superadmin puede ver todos los usuarios
        if user.is_superuser or user.role == 'superadmin':
            return User.objects.all().order_by('-created_at')
        
        # Admin puede ver usuarios que no sean superadmin
        elif user.is_staff or user.role == 'admin':
            return User.objects.exclude(
                role='superadmin'
            ).exclude(
                is_superuser=True
            ).order_by('-created_at')
        
        # Usuarios normales solo pueden ver su propio perfil
        else:
            return User.objects.filter(id=user.id)


class UserDetailView(generics.RetrieveAPIView):
    """
    Vista para ver detalles de un usuario específico.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        Filtrar usuarios según el rol del usuario actual.
        """
        user = self.request.user
        
        # Solo superadmin puede ver todos los usuarios
        if user.is_superuser or user.role == 'superadmin':
            return User.objects.all()
        
        # Admin puede ver usuarios que no sean superadmin
        elif user.is_staff or user.role == 'admin':
            return User.objects.exclude(
                role='superadmin'
            ).exclude(
                is_superuser=True
            )
        
        # Usuarios normales solo pueden ver su propio perfil
        else:
            return User.objects.filter(id=user.id)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_info(request):
    """
    Endpoint para obtener información del usuario actual.
    """
    serializer = UserSerializer(request.user)
    return Response(
        {
            'user': serializer.data
        },
        status=status.HTTP_200_OK
    )


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def check_email_availability(request):
    """
    Endpoint para verificar si un email está disponible.
    """
    email = request.data.get('email')
    
    if not email:
        return Response(
            {'error': 'Email es requerido'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    is_available = not User.objects.filter(email=email).exists()
    
    return Response(
        {
            'email': email,
            'is_available': is_available
        },
        status=status.HTTP_200_OK
    )


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def check_username_availability(request):
    """
    Endpoint para verificar si un username está disponible.
    """
    username = request.data.get('username')
    
    if not username:
        return Response(
            {'error': 'Username es requerido'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    is_available = not User.objects.filter(username=username).exists()
    
    return Response(
        {
            'username': username,
            'is_available': is_available
        },
        status=status.HTTP_200_OK
    )


# ============================================================================
# VIEWSETS MODERNOS - ENFOQUE DRF RECOMENDADO
# ============================================================================

class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet completo para gestión de usuarios.
    
    Proporciona operaciones CRUD completas para usuarios:
    - list: Listar usuarios (con filtros)
    - create: Crear nuevo usuario (registro)
    - retrieve: Obtener usuario específico
    - update: Actualizar usuario completo
    - partial_update: Actualizar usuario parcial
    - destroy: Eliminar usuario
    
    Acciones personalizadas:
    - profile: Obtener/actualizar perfil del usuario autenticado
    - change_password: Cambiar contraseña
    - check_email: Verificar disponibilidad de email
    - check_username: Verificar disponibilidad de username
    """
    
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        """
        Retorna la clase de serializer apropiada según la acción.
        """
        if self.action == 'create':
            return UserRegistrationSerializer
        elif self.action in ['profile', 'update', 'partial_update']:
            return UserProfileSerializer
        elif self.action == 'change_password':
            return ChangePasswordSerializer
        return UserSerializer
    
    def get_permissions(self):
        """
        Instancia y retorna la lista de permisos requeridos para esta vista.
        """
        if self.action in ['create', 'check_email', 'check_username']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated]
        
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        """
        Retorna el queryset filtrado según los parámetros de búsqueda.
        """
        queryset = User.objects.all()
        
        # Filtro por búsqueda general
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(email__icontains=search) |
                Q(username__icontains=search)
            )
        
        # Filtro por tipo de usuario
        user_type = self.request.query_params.get('user_type', None)
        if user_type:
            queryset = queryset.filter(user_type=user_type)
        
        # Filtro por estado activo
        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        return queryset.order_by('-date_joined')
    
    def create(self, request, *args, **kwargs):
        """
        Crear un nuevo usuario (registro).
        """
        serializer = self.get_serializer(data=request.data)
        
        try:
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            
            return Response(
                {
                    'message': 'Usuario registrado exitosamente',
                    'data': {
                        'user': UserSerializer(user).data,
                        'user_type': user.user_type
                    }
                },
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {
                    'error': 'Error al registrar usuario',
                    'detail': str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def update(self, request, *args, **kwargs):
        """
        Actualizar usuario completo.
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        try:
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            
            return Response(
                {
                    'message': 'Usuario actualizado exitosamente',
                    'data': UserSerializer(user).data
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {
                    'error': 'Error al actualizar usuario',
                    'detail': str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def partial_update(self, request, *args, **kwargs):
        """
        Actualizar usuario parcial.
        """
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)
    
    @action(detail=False, methods=['get', 'put', 'patch'], url_path='profile')
    def profile(self, request):
        """
        Obtener o actualizar el perfil del usuario autenticado.
        
        GET: Retorna el perfil del usuario actual
        PUT/PATCH: Actualiza el perfil del usuario actual
        """
        user = request.user
        
        if request.method == 'GET':
            serializer = UserProfileSerializer(user)
            return Response(
                {
                    'message': 'Perfil obtenido exitosamente',
                    'data': serializer.data
                },
                status=status.HTTP_200_OK
            )
        
        elif request.method in ['PUT', 'PATCH']:
            partial = request.method == 'PATCH'
            serializer = UserProfileSerializer(
                user, 
                data=request.data, 
                partial=partial
            )
            
            try:
                serializer.is_valid(raise_exception=True)
                updated_user = serializer.save()
                
                return Response(
                    {
                        'message': 'Perfil actualizado exitosamente',
                        'data': UserProfileSerializer(updated_user).data
                    },
                    status=status.HTTP_200_OK
                )
            except Exception as e:
                return Response(
                    {
                        'error': 'Error al actualizar perfil',
                        'detail': str(e)
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
    
    @action(detail=False, methods=['post'], url_path='change-password')
    def change_password(self, request):
        """
        Cambiar la contraseña del usuario autenticado.
        """
        user = request.user
        serializer = ChangePasswordSerializer(data=request.data)
        
        try:
            serializer.is_valid(raise_exception=True)
            
            # Verificar contraseña actual
            if not user.check_password(serializer.validated_data['old_password']):
                return Response(
                    {
                        'error': 'La contraseña actual es incorrecta'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Establecer nueva contraseña
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            
            return Response(
                {
                    'message': 'Contraseña cambiada exitosamente'
                },
                status=status.HTTP_200_OK
            )
        
        except Exception as e:
            return Response(
                {
                    'error': 'Error al cambiar contraseña',
                    'detail': str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny], url_path='check-email')
    def check_email(self, request):
        """
        Verificar disponibilidad de email.
        """
        email = request.data.get('email', '')
        
        if not email:
            return Response(
                {
                    'error': 'Email es requerido'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            is_available = not User.objects.filter(email=email).exists()
            
            return Response(
                {
                    'email': email,
                    'is_available': is_available,
                    'message': 'Email disponible' if is_available else 'Email ya está en uso'
                },
                status=status.HTTP_200_OK
            )
        
        except Exception as e:
            return Response(
                {
                    'error': 'Error al verificar disponibilidad del email',
                    'detail': str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny], url_path='check-username')
    def check_username(self, request):
        """
        Verificar disponibilidad de username.
        """
        username = request.data.get('username', '')
        
        if not username:
            return Response(
                {
                    'error': 'Username es requerido'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            is_available = not User.objects.filter(username=username).exists()
            
            return Response(
                {
                    'username': username,
                    'is_available': is_available,
                    'message': 'Username disponible' if is_available else 'Username ya está en uso'
                },
                status=status.HTTP_200_OK
            )
        
        except Exception as e:
            return Response(
                {
                    'error': 'Error al verificar disponibilidad del username',
                    'detail': str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )
