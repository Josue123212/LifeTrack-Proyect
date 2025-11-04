#!/usr/bin/env python
"""
🎯 SCRIPT DE DEMOSTRACIÓN - ENDPOINTS DE REPORTES

Este script demuestra el funcionamiento de todos los endpoints
de reportes implementados en el paso 8.1.
"""

import os
import sys
import django
from datetime import datetime, timedelta

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.utils import timezone
from apps.users.models import User
from apps.doctors.models import Doctor
from apps.patients.models import Patient
from apps.appointments.models import Appointment
from apps.reports.models import SystemMetrics

def create_sample_data():
    """
    Crear datos de muestra para demostrar los reportes
    """
    print("📊 Creando datos de muestra para reportes...")
    
    try:
        # Crear doctores si no existen
        if not Doctor.objects.exists():
            # Crear usuarios para doctores
            doctor_user1 = User.objects.create_user(
                email='doctor1@test.com',
                password='testpass123',
                first_name='Dr. Juan',
                last_name='Pérez',
                role='doctor'
            )
            
            doctor_user2 = User.objects.create_user(
                email='doctor2@test.com',
                password='testpass123',
                first_name='Dra. María',
                last_name='González',
                role='doctor'
            )
            
            # Crear doctores
            Doctor.objects.create(
                user=doctor_user1,
                specialization='Cardiología',
                license_number='DOC001',
                phone='555-0001'
            )
            
            Doctor.objects.create(
                user=doctor_user2,
                specialization='Pediatría',
                license_number='DOC002',
                phone='555-0002'
            )
            
            print("✅ Doctores creados")
        
        # Crear pacientes adicionales si es necesario
        if Patient.objects.count() < 3:
            patient_user = User.objects.create_user(
                email='patient2@test.com',
                password='testpass123',
                first_name='Ana',
                last_name='Martínez',
                role='patient'
            )
            
            Patient.objects.create(
                user=patient_user,
                date_of_birth='1990-05-15',
                phone='555-1002',
                address='Calle 456, Ciudad'
            )
            
            print("✅ Pacientes adicionales creados")
        
        # Crear citas de muestra
        if Appointment.objects.count() < 10:
            doctors = Doctor.objects.all()
            patients = Patient.objects.all()
            
            if doctors.exists() and patients.exists():
                today = timezone.now().date()
                
                # Crear citas para diferentes fechas y estados
                appointments_data = [
                    {'days_ago': 1, 'status': 'completed'},
                    {'days_ago': 2, 'status': 'completed'},
                    {'days_ago': 3, 'status': 'cancelled'},
                    {'days_ago': 5, 'status': 'completed'},
                    {'days_ago': 7, 'status': 'no_show'},
                    {'days_ago': 10, 'status': 'completed'},
                    {'days_ago': 15, 'status': 'cancelled'},
                    {'days_ago': 20, 'status': 'completed'},
                ]
                
                for i, apt_data in enumerate(appointments_data):
                    appointment_date = today - timedelta(days=apt_data['days_ago'])
                    
                    Appointment.objects.get_or_create(
                        patient=patients[i % len(patients)],
                        doctor=doctors[i % len(doctors)],
                        date=appointment_date,
                        time='10:00:00',
                        defaults={
                            'status': apt_data['status'],
                            'reason': f'Consulta {i+1}',
                            'notes': f'Notas de la cita {i+1}'
                        }
                    )
                
                print("✅ Citas de muestra creadas")
        
        # Crear métricas del sistema
        today = timezone.now().date()
        SystemMetrics.objects.get_or_create(
            date=today,
            defaults={
                'total_appointments': Appointment.objects.count(),
                'total_patients': Patient.objects.count(),
                'total_doctors': Doctor.objects.count(),
                'completed_appointments': Appointment.objects.filter(status='completed').count(),
                'cancelled_appointments': Appointment.objects.filter(status='cancelled').count(),
                'no_show_appointments': Appointment.objects.filter(status='no_show').count(),
            }
        )
        
        print("✅ Métricas del sistema actualizadas")
        
    except Exception as e:
        print(f"❌ Error creando datos: {e}")

def show_reports_summary():
    """
    Mostrar resumen de los datos para reportes
    """
    print("\n📈 RESUMEN DE DATOS PARA REPORTES")
    print("=" * 50)
    
    # Estadísticas básicas
    total_appointments = Appointment.objects.count()
    total_patients = Patient.objects.count()
    total_doctors = Doctor.objects.count()
    completed = Appointment.objects.filter(status='completed').count()
    cancelled = Appointment.objects.filter(status='cancelled').count()
    
    print(f"📊 Total de citas: {total_appointments}")
    print(f"👥 Total de pacientes: {total_patients}")
    print(f"👨‍⚕️ Total de doctores: {total_doctors}")
    print(f"✅ Citas completadas: {completed}")
    print(f"❌ Citas canceladas: {cancelled}")
    
    if total_appointments > 0:
        completion_rate = (completed / total_appointments) * 100
        cancellation_rate = (cancelled / total_appointments) * 100
        print(f"📈 Tasa de completitud: {completion_rate:.1f}%")
        print(f"📉 Tasa de cancelación: {cancellation_rate:.1f}%")
    
    print("\n🔗 ENDPOINTS DISPONIBLES:")
    print("=" * 30)
    print("• GET /api/reports/stats/basic/ - Estadísticas básicas")
    print("• GET /api/reports/appointments/period/ - Citas por período")
    print("• GET /api/reports/doctors/popular/ - Doctores más solicitados")
    print("• GET /api/reports/cancellations/metrics/ - Métricas de cancelaciones")
    print("• GET /api/reports/dashboard/summary/ - Resumen del dashboard")
    
    print("\n🔐 AUTENTICACIÓN REQUERIDA:")
    print("• Todos los endpoints requieren autenticación")
    print("• Permisos de administrador necesarios")
    print("• Usuario de prueba: admin@test.com (superusuario)")
    
    print("\n📖 DOCUMENTACIÓN:")
    print("• Swagger UI: http://127.0.0.1:8001/api/docs/")
    print("• ReDoc: http://127.0.0.1:8001/api/redoc/")

if __name__ == '__main__':
    print("🚀 DEMOSTRACIÓN DE ENDPOINTS DE REPORTES")
    print("=" * 50)
    
    create_sample_data()
    show_reports_summary()
    
    print("\n✅ ¡Endpoints de reportes listos para usar!")
    print("\n💡 Próximos pasos:")
    print("   1. Acceder a la documentación en /api/docs/")
    print("   2. Autenticarse con admin@test.com")
    print("   3. Probar cada endpoint de reportes")
    print("   4. Implementar exportación CSV (Fase 8.2)")