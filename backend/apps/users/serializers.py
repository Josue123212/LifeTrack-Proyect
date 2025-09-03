from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from .models import User


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Serializer personalizado para obtener tokens JWT.
    Permite login con email o username.
    """
    username_field = 'email_or_username'
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields[self.username_field] = serializers.CharField()
        self.fields['password'] = serializers.CharField()
    
    def validate(self, attrs):
        email_or_username = attrs.get('email_or_username')
        password = attrs.get('password')
        
        if email_or_username and password:
            # Intentar autenticar con email
            if '@' in email_or_username:
                try:
                    user = User.objects.get(email=email_or_username)
                    username = user.username
                except User.DoesNotExist:
                    username = None
            else:
                username = email_or_username
            
            if username:
                user = authenticate(
                    request=self.context.get('request'),
                    username=username,
                    password=password
                )
                
                if user:
                    if not user.is_active:
                        raise serializers.ValidationError(
                            'La cuenta de usuario está desactivada.'
                        )
                    
                    # Actualizar el campo username para el token
                    attrs['username'] = user.username
                    
                    # Llamar al método padre para generar el token
                    data = super().validate(attrs)
                    
                    # Agregar información adicional del usuario
                    data['user'] = {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'role': user.role,
                        'is_staff': user.is_staff,
                        'is_superuser': user.is_superuser,
                    }
                    
                    return data
                else:
                    raise serializers.ValidationError(
                        'No se pudo autenticar con las credenciales proporcionadas.'
                    )
            else:
                raise serializers.ValidationError(
                    'Email o nombre de usuario no válido.'
                )
        else:
            raise serializers.ValidationError(
                'Debe incluir email/username y contraseña.'
            )


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