#!/usr/bin/env python
"""
Script para probar las tareas de email de Celery.
Este script verifica que las tareas de notificación de citas funcionen correctamente.
"""

import os
import sys
import django
from datetime import datetime, timedelta

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from core.tasks import (
    send_appointment_confirmation_email,
    send_appointment_reminder_email,
    send_appointment_cancellation_email,
    send_bulk_appointment_reminders
)
from django.utils import timezone

def test_email_tasks():
    """
    Prueba todas las tareas de email con datos de ejemplo.
    """
    print("🧪 INICIANDO PRUEBAS DE TAREAS DE EMAIL")
    print("=" * 50)
    
    # Datos de ejemplo para las pruebas
    sample_appointment_data = {
        'patient_email': 'paciente@ejemplo.com',
        'patient_name': 'María González',
        'doctor_name': 'Dr. Carlos Rodríguez',
        'doctor_specialty': 'Cardiología',
        'appointment_date': '2024-02-15',
        'appointment_time': '10:30 AM',
        'clinic_address': 'Av. Principal 123, Ciudad',
        'clinic_phone': '+1 234-567-8900',
        'appointment_notes': 'Traer estudios previos y ayunar 12 horas',
        'reschedule_url': 'https://clinica.com/reprogramar/abc123',
        'cancel_url': 'https://clinica.com/cancelar/abc123',
        'preparation_instructions': 'Ayuno de 12 horas antes del examen',
        'fasting_required': True,
        'fasting_hours': 12,
        'fasting_start_time': '10:30 PM',
        'confirm_url': 'https://clinica.com/confirmar/abc123',
        'emergency_phone': '+1 234-567-8911',
        'cancellation_date': timezone.now(),
        'cancellation_reason': 'Emergencia médica del doctor',
        'cancelled_by_patient': False,
        'refund_info': 'El reembolso se procesará en 3-5 días hábiles',
        'available_slots_url': 'https://clinica.com/horarios-disponibles',
        'suggested_dates': ['2024-02-16', '2024-02-17', '2024-02-18'],
        'contact_phone': '+1 234-567-8900',
        'contact_email': 'contacto@clinica.com',
        'feedback_url': 'https://clinica.com/feedback'
    }
    
    try:
        # Test 1: Email de confirmación
        print("\n📧 Prueba 1: Email de Confirmación de Cita")
        print("-" * 40)
        result = send_appointment_confirmation_email.delay(sample_appointment_data)
        print(f"✅ Tarea enviada con ID: {result.id}")
        print(f"📄 Resultado: {result.get(timeout=10)}")
        
        # Test 2: Email de recordatorio
        print("\n📧 Prueba 2: Email de Recordatorio de Cita")
        print("-" * 40)
        result = send_appointment_reminder_email.delay(sample_appointment_data)
        print(f"✅ Tarea enviada con ID: {result.id}")
        print(f"📄 Resultado: {result.get(timeout=10)}")
        
        # Test 3: Email de cancelación
        print("\n📧 Prueba 3: Email de Cancelación de Cita")
        print("-" * 40)
        result = send_appointment_cancellation_email.delay(sample_appointment_data)
        print(f"✅ Tarea enviada con ID: {result.id}")
        print(f"📄 Resultado: {result.get(timeout=10)}")
        
        # Test 4: Recordatorios masivos
        print("\n📧 Prueba 4: Recordatorios Masivos")
        print("-" * 40)
        result = send_bulk_appointment_reminders.delay()
        print(f"✅ Tarea enviada con ID: {result.id}")
        print(f"📄 Resultado: {result.get(timeout=10)}")
        
        print("\n🎉 TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE")
        print("=" * 50)
        print("\n📝 NOTAS IMPORTANTES:")
        print("• Los emails se están enviando a la consola (development mode)")
        print("• Para envío real, configura SMTP en settings/production.py")
        print("• Revisa la consola del worker de Celery para ver los logs")
        print("• Las plantillas HTML se están renderizando correctamente")
        
    except Exception as e:
        print(f"❌ Error durante las pruebas: {str(e)}")
        print("\n🔧 POSIBLES SOLUCIONES:")
        print("• Verifica que Redis esté ejecutándose")
        print("• Inicia el worker de Celery: celery -A config worker --loglevel=info")
        print("• Verifica que las plantillas existan en templates/emails/")
        print("• Revisa la configuración de email en settings")
        return False
    
    return True

def test_template_rendering():
    """
    Prueba que las plantillas se rendericen correctamente sin enviar emails.
    """
    print("\n🎨 PROBANDO RENDERIZADO DE PLANTILLAS")
    print("=" * 50)
    
    from django.template.loader import render_to_string
    
    sample_data = {
        'patient_name': 'María González',
        'doctor_name': 'Dr. Carlos Rodríguez',
        'doctor_specialty': 'Cardiología',
        'appointment_date': '2024-02-15',
        'appointment_time': '10:30 AM',
        'clinic_address': 'Av. Principal 123, Ciudad',
        'clinic_phone': '+1 234-567-8900',
    }
    
    templates = [
        'emails/appointment_confirmation.html',
        'emails/appointment_reminder.html',
        'emails/appointment_cancellation.html'
    ]
    
    for template in templates:
        try:
            html_content = render_to_string(template, sample_data)
            print(f"✅ {template}: Renderizado exitoso ({len(html_content)} caracteres)")
        except Exception as e:
            print(f"❌ {template}: Error - {str(e)}")
            return False
    
    print("\n🎉 Todas las plantillas se renderizaron correctamente")
    return True

if __name__ == '__main__':
    print("🚀 INICIANDO PRUEBAS DEL SISTEMA DE EMAIL")
    print("=" * 60)
    
    # Primero probar el renderizado de plantillas
    if test_template_rendering():
        # Luego probar las tareas de Celery
        test_email_tasks()
    else:
        print("❌ Las pruebas de plantillas fallaron. Revisa la configuración.")
        sys.exit(1)