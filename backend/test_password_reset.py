#!/usr/bin/env python
"""
Script para probar el sistema de recuperación de contraseña.
"""
import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from apps.users.models import User, PasswordResetToken
from apps.users.serializers import PasswordResetRequestSerializer
from django.test import RequestFactory

def test_password_reset():
    """
    Probar el sistema de recuperación de contraseña.
    """
    print("🧪 Iniciando prueba del sistema de recuperación de contraseña...")
    
    # Crear o obtener usuario de prueba
    email = "test@example.com"
    try:
        user = User.objects.get(email=email)
        print(f"✅ Usuario existente encontrado: {user.email}")
    except User.DoesNotExist:
        user = User.objects.create_user(
            email=email,
            username="testuser",
            first_name="Usuario",
            last_name="Prueba",
            password="testpassword123"
        )
        print(f"✅ Usuario de prueba creado: {user.email}")
    
    # Simular request
    factory = RequestFactory()
    request = factory.post('/api/users/auth/password-reset/request/')
    request.META['REMOTE_ADDR'] = '127.0.0.1'
    request.META['HTTP_USER_AGENT'] = 'Test Browser'
    
    # Probar serializer de solicitud de recuperación
    data = {'email': email}
    serializer = PasswordResetRequestSerializer(
        data=data,
        context={'request': request}
    )
    
    if serializer.is_valid():
        result = serializer.save()
        print(f"✅ Solicitud de recuperación procesada: {result}")
        
        # Verificar que se creó el token
        tokens = PasswordResetToken.objects.filter(user=user, used=False)
        if tokens.exists():
            token = tokens.first()
            print(f"✅ Token de recuperación creado: {token.token}")
            print(f"📧 Email enviado a: {user.email}")
            print(f"⏰ Expira en: {token.expires_at}")
            
            # Mostrar URL de recuperación
            reset_url = f"http://localhost:3000/reset-password?token={token.token}"
            print(f"🔗 URL de recuperación: {reset_url}")
            
        else:
            print("❌ No se creó el token de recuperación")
    else:
        print(f"❌ Error en validación: {serializer.errors}")

if __name__ == "__main__":
    test_password_reset()