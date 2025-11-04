#!/usr/bin/env python
"""
Script para probar tareas de email individualmente
"""

import os
import sys
import django
from datetime import datetime, timedelta

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from core.tasks import (
    send_appointment_confirmation_email,
    send_appointment_reminder_email,
    send_appointment_cancellation_email
)

def test_confirmation_task():
    """Probar tarea de confirmación"""
    print("\n🧪 PROBANDO TAREA DE CONFIRMACIÓN")
    print("=" * 50)
    
    appointment_data = {
        'patient_email': 'paciente@ejemplo.com',
        'patient_name': 'Juan Pérez',
        'doctor_name': 'Dr. Carlos Rodríguez',
        'doctor_specialty': 'Cardiología',
        'appointment_date': '2025-01-15',
        'appointment_time': '10:30 AM',
        'clinic_address': 'Av. Principal 123, Ciudad',
        'clinic_phone': '+1 234-567-8900',
        'appointment_notes': 'Traer estudios previos y ayunar 12 horas',
        'reschedule_url': 'https://clinica.com/reprogramar/abc123',
        'cancel_url': 'https://clinica.com/cancelar/abc123',
        'preparation_instructions': 'Ayuno de 12 horas antes del examen'
    }
    
    try:
        result = send_appointment_confirmation_email.delay(appointment_data)
        print(f"✅ Tarea enviada con ID: {result.id}")
        
        # Esperar resultado
        final_result = result.get(timeout=30)
        print(f"📄 Resultado: {final_result}")
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_reminder_task():
    """Probar tarea de recordatorio"""
    print("\n🧪 PROBANDO TAREA DE RECORDATORIO")
    print("=" * 50)
    
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
        'emergency_phone': '+1 234-567-8999'
    }
    
    try:
        result = send_appointment_reminder_email.delay(appointment_data)
        print(f"✅ Tarea enviada con ID: {result.id}")
        
        # Esperar resultado
        final_result = result.get(timeout=30)
        print(f"📄 Resultado: {final_result}")
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_cancellation_task():
    """Probar tarea de cancelación"""
    print("\n🧪 PROBANDO TAREA DE CANCELACIÓN")
    print("=" * 50)
    
    appointment_data = {
        'patient_email': 'paciente@ejemplo.com',
        'patient_name': 'Pedro Martínez',
        'doctor_name': 'Dr. Luis Fernández',
        'doctor_specialty': 'Neurología',
        'appointment_date': '2025-01-17',
        'appointment_time': '11:00 AM',
        'cancellation_date': datetime.now().strftime('%Y-%m-%d'),
        'cancellation_reason': 'Emergencia familiar',
        'cancelled_by_patient': True,
        'refund_info': 'El reembolso se procesará en 3-5 días hábiles',
        'reschedule_url': 'https://clinica.com/reprogramar/ghi789',
        'available_slots_url': 'https://clinica.com/horarios-disponibles'
    }
    
    try:
        result = send_appointment_cancellation_email.delay(appointment_data)
        print(f"✅ Tarea enviada con ID: {result.id}")
        
        # Esperar resultado
        final_result = result.get(timeout=30)
        print(f"📄 Resultado: {final_result}")
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

if __name__ == '__main__':
    print("🚀 INICIANDO PRUEBAS INDIVIDUALES DE TAREAS")
    print("=" * 60)
    
    results = []
    
    # Probar cada tarea individualmente
    results.append(test_confirmation_task())
    results.append(test_reminder_task())
    results.append(test_cancellation_task())
    
    # Resumen
    print("\n📊 RESUMEN DE PRUEBAS")
    print("=" * 30)
    print(f"✅ Exitosas: {sum(results)}")
    print(f"❌ Fallidas: {len(results) - sum(results)}")
    
    if all(results):
        print("\n🎉 ¡Todas las tareas funcionan correctamente!")
    else:
        print("\n⚠️ Algunas tareas fallaron. Revisa los logs del worker.")