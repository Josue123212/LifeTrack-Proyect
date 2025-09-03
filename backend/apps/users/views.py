from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from django.contrib.auth import logout
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

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
