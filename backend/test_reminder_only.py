#!/usr/bin/env python
"""
Script para probar solo la tarea de recordatorio y obtener el error exacto
"""

import os
import sys
import django
from datetime import datetime, timedelta

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from core.tasks import send_appointment_reminder_email
from django.template.loader import render_to_string

def test_template_rendering():
    """Probar solo el renderizado del template"""
    print("🧪 PROBANDO RENDERIZADO DEL TEMPLATE DE RECORDATORIO")
    print("=" * 60)
    
    context = {
        'patient_name': 'María González',
        'doctor_name': 'Dr. Ana López',
        'doctor_specialty': 'Dermatología',
        'appointment_date': '2025-01-16',
        'appointment_time': '2:00 PM',
        'clinic_address': 'Calle Salud 456, Ciudad',
        'clinic_phone': '+1 234-567-8901',
        'preparation_instructions': 'No usar cremas 24 horas antes',
        'fasting_required': False,
        'confirm_url': 'https://clinica.com/confirmar/def456',
        'reschedule_url': 'https://clinica.com/reprogramar/def456',
        'cancel_url': 'https://clinica.com/cancelar/def456',
        'emergency_phone': '+1 234-567-8999',
        'show_actions': True
    }
    
    try:
        html_content = render_to_string('emails/appointment_reminder.html', context)
        print(f"✅ Template renderizado exitosamente ({len(html_content)} caracteres)")
        return True
    except Exception as e:
        print(f"❌ Error en renderizado: {str(e)}")
        print(f"Tipo de error: {type(e).__name__}")
        import traceback
        traceback.print_exc()
        return False

def test_task_execution():
    """Probar la ejecución de la tarea"""
    print("\n🧪 PROBANDO EJECUCIÓN DE LA TAREA")
    print("=" * 40)
    
    appointment_data = {
        'patient_email': 'paciente@ejemplo.com',
        'patient_name': 'María González',
        'doctor_name': 'Dr. Ana López',
        'doctor_specialty': 'Dermatología',
        'appointment_date': '2025-01-16',
        'appointment_time': '2:00 PM',
        'clinic_address': 'Calle Salud 456, Ciudad',
        'clinic_phone': '+1 234-567-8901',
        'preparation_instructions': 'No usar cremas 24 horas antes',
        'fasting_required': False,
        'confirm_url': 'https://clinica.com/confirmar/def456',
        'reschedule_url': 'https://clinica.com/reprogramar/def456',
        'cancel_url': 'https://clinica.com/cancelar/def456',
        'emergency_phone': '+1 234-567-8999',
        'show_actions': True
    }
    
    try:
        # Ejecutar la tarea directamente (sin Celery)
        result = send_appointment_reminder_email(appointment_data)
        print(f"✅ Tarea ejecutada directamente: {result}")
        return True
    except Exception as e:
        print(f"❌ Error en ejecución directa: {str(e)}")
        print(f"Tipo de error: {type(e).__name__}")
        import traceback
        traceback.print_exc()
        return False

def test_task_with_celery():
    """Probar la tarea con Celery"""
    print("\n🧪 PROBANDO TAREA CON CELERY")
    print("=" * 35)
    
    appointment_data = {
        'patient_email': 'paciente@ejemplo.com',
        'patient_name': 'María González',
        'doctor_name': 'Dr. Ana López',
        'doctor_specialty': 'Dermatología',
        'appointment_date': '2025-01-16',
        'appointment_time': '2:00 PM',
        'clinic_address': 'Calle Salud 456, Ciudad',
        'clinic_phone': '+1 234-567-8901',
        'preparation_instructions': 'No usar cremas 24 horas antes',
        'fasting_required': False,
        'confirm_url': 'https://clinica.com/confirmar/def456',
        'reschedule_url': 'https://clinica.com/reprogramar/def456',
        'cancel_url': 'https://clinica.com/cancelar/def456',
        'emergency_phone': '+1 234-567-8999',
        'show_actions': True
    }
    
    try:
        result = send_appointment_reminder_email.delay(appointment_data)
        print(f"✅ Tarea enviada con ID: {result.id}")
        
        # Esperar resultado
        final_result = result.get(timeout=30)
        print(f"📄 Resultado: {final_result}")
        return True
        
    except Exception as e:
        print(f"❌ Error con Celery: {str(e)}")
        print(f"Tipo de error: {type(e).__name__}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    print("🚀 DIAGNÓSTICO DETALLADO DE LA TAREA DE RECORDATORIO")
    print("=" * 70)
    
    # Probar paso a paso
    template_ok = test_template_rendering()
    
    if template_ok:
        direct_ok = test_task_execution()
        
        if direct_ok:
            celery_ok = test_task_with_celery()
        else:
            print("\n⚠️ No se puede probar con Celery porque la ejecución directa falló")
    else:
        print("\n⚠️ No se pueden hacer más pruebas porque el template tiene errores")
    
    print("\n📊 DIAGNÓSTICO COMPLETO")
    print("=" * 30)