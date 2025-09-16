#!/usr/bin/env python
"""
Script de prueba para verificar el envío de emails con Gmail SMTP
"""
import os
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from django.core.mail import send_mail
from django.conf import settings

def test_gmail_email():
    """Prueba el envío de email usando Gmail SMTP"""
    
    print("🔧 Configuración de Email:")
    print(f"   Backend: {settings.EMAIL_BACKEND}")
    print(f"   Host: {settings.EMAIL_HOST}")
    print(f"   Puerto: {settings.EMAIL_PORT}")
    print(f"   TLS: {settings.EMAIL_USE_TLS}")
    print(f"   Usuario: {settings.EMAIL_HOST_USER}")
    print(f"   Contraseña: {'*' * len(settings.EMAIL_HOST_PASSWORD)}")
    print()
    
    try:
        print("📧 Enviando email de prueba...")
        
        # Enviar email de prueba
        result = send_mail(
            subject='🔐 Prueba de Sistema de Recuperación de Contraseña',
            message='''
¡Hola!

Este es un email de prueba del sistema de recuperación de contraseña.

Si recibes este mensaje, significa que la configuración de Gmail SMTP está funcionando correctamente.

🎉 ¡Todo listo para enviar emails reales!

Saludos,
Sistema de Citas Médicas
            ''',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.EMAIL_HOST_USER],  # Enviar a ti mismo
            fail_silently=False,
        )
        
        if result == 1:
            print("✅ ¡Email enviado exitosamente!")
            print(f"📬 Revisa tu bandeja de entrada: {settings.EMAIL_HOST_USER}")
            print()
            print("🚀 Ahora puedes probar la recuperación de contraseña en:")
            print("   Frontend: http://localhost:5173/forgot-password")
            print("   Backend: http://localhost:8000/api/users/auth/password-reset/request/")
        else:
            print("❌ Error: No se pudo enviar el email")
            
    except Exception as e:
        print(f"❌ Error al enviar email: {e}")
        print()
        print("🔍 Posibles soluciones:")
        print("   1. Verifica que la contraseña de aplicación sea correcta")
        print("   2. Asegúrate de que la verificación en 2 pasos esté activada")
        print("   3. Revisa que el email sea correcto")

if __name__ == "__main__":
    test_gmail_email()