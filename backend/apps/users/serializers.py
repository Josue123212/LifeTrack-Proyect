from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from django.utils import timezone
from .models import User, PasswordResetToken


class CustomTokenObtainPairSerializer(serializers.Serializer):
    """
    Serializer personalizado para obtener tokens JWT.
    Permite login con email o username.
    """
    email_or_username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        try:
            email_or_username = attrs.get('email_or_username')
            password = attrs.get('password')
            
            print(f"Debug - attrs recibidos: {attrs}")
            print(f"Debug - email_or_username: {email_or_username}")
            print(f"Debug - password: {password}")
            
            if email_or_username and password:
                # Debug: imprimir información
                print(f"Intentando autenticar: {email_or_username}")
                print(f"Request en context: {self.context.get('request')}")
                
                # Usar el backend personalizado que maneja email o username
                user = authenticate(
                    request=self.context.get('request'),
                    username=email_or_username,
                    password=password
                )
                
                print(f"Resultado de authenticate: {user}")
                
                if user:
                    if not user.is_active:
                        raise serializers.ValidationError(
                            'La cuenta de usuario está desactivada.'
                        )
                    
                    print("Debug - Generando tokens...")
                    # Generar tokens manualmente
                    refresh = RefreshToken.for_user(user)
                    access_token = refresh.access_token
                    
                    print(f"Debug - Refresh token: {type(refresh)}")
                    print(f"Debug - Access token: {type(access_token)}")
                    
                    # Preparar la respuesta con tokens y datos del usuario
                    data = {
                        'refresh': str(refresh),
                        'access': str(access_token),
                        'user': {
                            'id': user.id,
                            'username': user.username,
                            'email': user.email,
                            'first_name': user.first_name,
                            'last_name': user.last_name,
                            'role': user.role,
                            'is_staff': user.is_staff,
                            'is_superuser': user.is_superuser,
                        }
                    }
                    
                    print(f"Debug - Data preparada: {data}")
                    return data
                else:
                    raise serializers.ValidationError(
                        'No se pudo autenticar con las credenciales proporcionadas.'
                    )
            else:
                raise serializers.ValidationError(
                    'Debe incluir email/username y contraseña.'
                )
        except Exception as e:
            print(f"Debug - Excepción en validate: {type(e).__name__}: {str(e)}")
            import traceback
            traceback.print_exc()
            raise


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer para el registro de nuevos usuarios.
    """
    password = serializers.CharField(
        write_only=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'}
    )
    
    class Meta:
        model = User
        fields = (
            'username', 'email', 'password', 'password_confirm',
            'first_name', 'last_name', 'phone', 'date_of_birth', 'address'
        )
        extra_kwargs = {
            'email': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
        }
    
    def validate_email(self, value):
        """
        Validar que el email sea único.
        """
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                'Ya existe un usuario con este email.'
            )
        return value
    
    def validate_username(self, value):
        """
        Validar que el username sea único.
        """
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                'Ya existe un usuario con este nombre de usuario.'
            )
        return value
    
    def validate(self, attrs):
        """
        Validar que las contraseñas coincidan.
        """
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError(
                {'password_confirm': 'Las contraseñas no coinciden.'}
            )
        return attrs
    
    def create(self, validated_data):
        """
        Crear un nuevo usuario.
        """
        # Remover password_confirm ya que no es parte del modelo
        validated_data.pop('password_confirm')
        
        # Crear el usuario
        user = User.objects.create_user(**validated_data)
        return user


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer para mostrar información del usuario.
    """
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    
    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name', 'full_name',
            'phone', 'role', 'date_of_birth', 'address', 'is_active',
            'is_staff', 'is_superuser', 'created_at', 'updated_at'
        )
        read_only_fields = (
            'id', 'username', 'is_staff', 'is_superuser', 'created_at', 'updated_at'
        )


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer para actualizar el perfil del usuario.
    """
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    
    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name', 'full_name',
            'phone', 'date_of_birth', 'address', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'username', 'created_at', 'updated_at')
    
    def validate_email(self, value):
        """
        Validar que el email sea único (excluyendo el usuario actual).
        """
        user = self.instance
        if User.objects.filter(email=value).exclude(pk=user.pk).exists():
            raise serializers.ValidationError(
                'Ya existe un usuario con este email.'
            )
        return value


class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer para cambiar la contraseña del usuario.
    """
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(
        write_only=True,
        validators=[validate_password]
    )
    new_password_confirm = serializers.CharField(write_only=True)
    
    def validate_old_password(self, value):
        """
        Validar que la contraseña actual sea correcta.
        """
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError(
                'La contraseña actual es incorrecta.'
            )
        return value
    
    def validate(self, attrs):
        """
        Validar que las nuevas contraseñas coincidan.
        """
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError(
                {'new_password_confirm': 'Las contraseñas no coinciden.'}
            )
        return attrs
    
    def save(self, **kwargs):
        """
        Cambiar la contraseña del usuario.
        """
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user


class PasswordResetRequestSerializer(serializers.Serializer):
    """
    Serializer para solicitar recuperación de contraseña.
    """
    email = serializers.EmailField()
    
    def validate_email(self, value):
        """
        Validar que el email exista en el sistema.
        """
        try:
            user = User.objects.get(email=value, is_active=True)
            return value
        except User.DoesNotExist:
            # Por seguridad, no revelamos si el email existe o no
            # Siempre devolvemos éxito para evitar enumeración de usuarios
            return value
    
    def save(self, **kwargs):
        """
        Crear token de recuperación y enviar email.
        """
        email = self.validated_data['email']
        request = self.context.get('request')
        
        try:
            user = User.objects.get(email=email, is_active=True)
            
            # Obtener IP y User Agent del request
            ip_address = None
            user_agent = ''
            
            if request:
                # Obtener IP real considerando proxies
                x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
                if x_forwarded_for:
                    ip_address = x_forwarded_for.split(',')[0].strip()
                else:
                    ip_address = request.META.get('REMOTE_ADDR')
                
                user_agent = request.META.get('HTTP_USER_AGENT', '')
            
            # Crear token de recuperación
            reset_token = PasswordResetToken.create_for_user(
                user=user,
                ip_address=ip_address,
                user_agent=user_agent
            )
            
            # Construir URL de recuperación
            frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
            reset_url = f"{frontend_url}/reset-password?token={reset_token.token}"
            
            # Preparar contexto para el template
            context = {
                'user': user,
                'reset_token': reset_token,
                'reset_url': reset_url,
                'expiry_hours': 24,  # 24 horas de expiración
                'site_name': 'Sistema de Citas Médicas',
            }
            
            # Renderizar templates
            html_message = render_to_string('emails/password_reset.html', context)
            plain_message = render_to_string('emails/password_reset.txt', context)
            
            # Enviar email
            try:
                send_mail(
                    subject='🔐 Recuperación de Contraseña - Sistema de Citas Médicas',
                    message=plain_message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email],
                    html_message=html_message,
                    fail_silently=False,
                )
                
                return {
                    'message': 'Si el email existe, recibirás un enlace de recuperación.',
                    'email_sent': True
                }
                
            except Exception as e:
                # Log del error pero no exponemos detalles al usuario
                print(f"Error enviando email de recuperación: {e}")
                return {
                    'message': 'Si el email existe, recibirás un enlace de recuperación.',
                    'email_sent': False
                }
            
        except User.DoesNotExist:
            # Usuario no existe, pero devolvemos el mismo mensaje por seguridad
            return {
                'message': 'Si el email existe, recibirás un enlace de recuperación.'
            }


class PasswordResetVerifySerializer(serializers.Serializer):
    """
    Serializer para verificar token de recuperación.
    """
    token = serializers.CharField(max_length=64)
    
    def validate_token(self, value):
        """
        Validar que el token sea válido y no haya expirado.
        """
        try:
            reset_token = PasswordResetToken.objects.get(
                token=value,
                used=False,
                expires_at__gt=timezone.now()
            )
            return value
        except PasswordResetToken.DoesNotExist:
            raise serializers.ValidationError(
                'Token inválido o expirado.'
            )


class PasswordResetConfirmSerializer(serializers.Serializer):
    """
    Serializer para confirmar nueva contraseña con token.
    """
    token = serializers.CharField(max_length=64)
    new_password = serializers.CharField(
        write_only=True,
        validators=[validate_password]
    )
    new_password_confirm = serializers.CharField(write_only=True)
    
    def validate_token(self, value):
        """
        Validar que el token sea válido y no haya expirado.
        """
        try:
            reset_token = PasswordResetToken.objects.get(
                token=value,
                used=False,
                expires_at__gt=timezone.now()
            )
            self.reset_token = reset_token  # Guardar para uso posterior
            return value
        except PasswordResetToken.DoesNotExist:
            raise serializers.ValidationError(
                'Token inválido o expirado.'
            )
    
    def validate(self, attrs):
        """
        Validar que las contraseñas coincidan.
        """
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError(
                {'new_password_confirm': 'Las contraseñas no coinciden.'}
            )
        return attrs
    
    def save(self, **kwargs):
        """
        Cambiar la contraseña y marcar el token como usado.
        """
        # Cambiar contraseña del usuario
        user = self.reset_token.user
        user.set_password(self.validated_data['new_password'])
        user.save()
        
        # Marcar token como usado
        self.reset_token.mark_as_used()
        
        return {
            'message': 'Contraseña cambiada exitosamente.',
            'user_id': user.id
        }