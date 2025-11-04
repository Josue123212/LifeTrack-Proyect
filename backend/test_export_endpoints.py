#!/usr/bin/env python
"""
🧪 SCRIPT DE PRUEBA - ENDPOINTS DE EXPORTACIÓN CSV

🎯 OBJETIVO: Demostrar las funcionalidades de exportación de datos
implementadas en la Fase 8.2 del desarrollo.

💡 CONCEPTO: Este script prueba todos los endpoints de exportación
CSV y muestra ejemplos de uso con diferentes filtros.
"""

import os
import sys
import django
from datetime import datetime, timedelta

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from django.test import Client
from django.contrib.auth import get_user_model
from apps.users.models import User
from apps.patients.models import Patient
from apps.doctors.models import Doctor
from apps.appointments.models import Appointment
from django.utils import timezone

def create_sample_data():
    """
    Crear datos de muestra para probar las exportaciones
    """
    print("📊 Creando datos de muestra para exportación...")
    
    # Crear usuarios de prueba si no existen
    try:
        # Doctor
        doctor_user, created = User.objects.get_or_create(
            email='doctor_export@test.com',
            defaults={
                'username': 'doctor_export',
                'first_name': 'Dr. Juan',
                'last_name': 'Pérez',
                'phone': '+1234567890',
                'role': 'admin'
            }
        )
        if created:
            doctor_user.set_password('testpass123')
            doctor_user.save()
        
        doctor, created = Doctor.objects.get_or_create(
            user=doctor_user,
            defaults={
                'license_number': 'DOC001',
                'specialization': 'Cardiología',
                'experience_years': 10,
                'consultation_fee': 150.00,
                'bio': 'Especialista en cardiología con 10 años de experiencia',
                'is_available': True
            }
        )
        
        # Paciente
        patient_user, created = User.objects.get_or_create(
            email='patient_export@test.com',
            defaults={
                'username': 'patient_export',
                'first_name': 'María',
                'last_name': 'González',
                'phone': '+0987654321',
                'role': 'client'
            }
        )
        if created:
            patient_user.set_password('testpass123')
            patient_user.save()
        
        patient, created = Patient.objects.get_or_create(
            user=patient_user,
            defaults={
                'date_of_birth': datetime(1990, 5, 15).date(),
                'gender': 'F',
                'address': 'Calle Principal 123, Ciudad',
                'emergency_contact': 'Pedro González',
                'emergency_phone': '+1122334455',
                'medical_history': 'Sin antecedentes relevantes',
                'allergies': 'Ninguna conocida'
            }
        )
        
        # Crear algunas citas de muestra
        today = timezone.now().date()
        
        # Cita completada
        Appointment.objects.get_or_create(
            patient=patient,
            doctor=doctor,
            date=today - timedelta(days=7),
            time=datetime.strptime('10:00', '%H:%M').time(),
            defaults={
                'status': 'completed',
                'reason': 'Consulta de rutina',
                'notes': 'Paciente en buen estado general'
            }
        )
        
        # Cita programada
        Appointment.objects.get_or_create(
            patient=patient,
            doctor=doctor,
            date=today + timedelta(days=3),
            time=datetime.strptime('14:30', '%H:%M').time(),
            defaults={
                'status': 'scheduled',
                'reason': 'Control cardiológico',
                'notes': ''
            }
        )
        
        # Cita cancelada
        Appointment.objects.get_or_create(
            patient=patient,
            doctor=doctor,
            date=today - timedelta(days=2),
            time=datetime.strptime('09:00', '%H:%M').time(),
            defaults={
                'status': 'cancelled',
                'reason': 'Consulta de emergencia',
                'notes': 'Cancelada por el paciente'
            }
        )
        
        print("✅ Datos de muestra creados exitosamente")
        
    except Exception as e:
        print(f"❌ Error creando datos de muestra: {e}")

def test_export_endpoints():
    """
    Probar todos los endpoints de exportación CSV
    """
    print("\n🧪 PROBANDO ENDPOINTS DE EXPORTACIÓN CSV")
    print("=" * 50)
    
    # Crear cliente de prueba
    client = Client()
    
    # Obtener usuario administrador
    try:
        admin_user = User.objects.filter(email='admin@test.com').first()
        if not admin_user:
            print("❌ No se encontró usuario administrador. Creando uno...")
            admin_user = User.objects.create_user(
                username='admin_export',
                email='admin_export@test.com',
                password='testpass123',
                first_name='Admin',
                last_name='Sistema',
                role='superadmin',
                is_staff=True,
                is_superuser=True
            )
        
        # Hacer login
        login_success = client.login(username=admin_user.username, password='testpass123')
        if not login_success:
            print("❌ Error en login del administrador")
            return
        
        print(f"✅ Login exitoso como: {admin_user.email}")
        
    except Exception as e:
        print(f"❌ Error configurando usuario administrador: {e}")
        return
    
    # Lista de endpoints a probar
    endpoints = [
        {
            'name': '📋 Exportar Citas',
            'url': '/api/reports/export/appointments/',
            'description': 'Exporta todas las citas del sistema'
        },
        {
            'name': '📋 Exportar Citas (Filtradas)',
            'url': '/api/reports/export/appointments/?status=completed',
            'description': 'Exporta solo citas completadas'
        },
        {
            'name': '👥 Exportar Pacientes',
            'url': '/api/reports/export/patients/',
            'description': 'Exporta todos los pacientes registrados'
        },
        {
            'name': '👨‍⚕️ Exportar Doctores',
            'url': '/api/reports/export/doctors/',
            'description': 'Exporta todos los doctores registrados'
        },
        {
            'name': '📊 Reporte Completo',
            'url': '/api/reports/export/full-report/',
            'description': 'Exporta reporte completo del sistema'
        }
    ]
    
    # Probar cada endpoint
    for endpoint in endpoints:
        print(f"\n🔍 Probando: {endpoint['name']}")
        print(f"📝 Descripción: {endpoint['description']}")
        print(f"🔗 URL: {endpoint['url']}")
        
        try:
            response = client.get(endpoint['url'])
            
            if response.status_code == 200:
                print(f"✅ Respuesta exitosa (200)")
                print(f"📄 Content-Type: {response.get('Content-Type', 'N/A')}")
                
                # Verificar que es un archivo CSV
                if 'text/csv' in response.get('Content-Type', ''):
                    print(f"📊 Archivo CSV generado correctamente")
                    
                    # Mostrar información del archivo
                    content_disposition = response.get('Content-Disposition', '')
                    if 'filename=' in content_disposition:
                        filename = content_disposition.split('filename=')[1].strip('"')
                        print(f"📁 Nombre del archivo: {filename}")
                    
                    # Mostrar primeras líneas del CSV
                    content = response.content.decode('utf-8')
                    lines = content.split('\n')[:5]  # Primeras 5 líneas
                    print(f"📋 Primeras líneas del CSV:")
                    for i, line in enumerate(lines, 1):
                        if line.strip():
                            print(f"   {i}: {line[:80]}{'...' if len(line) > 80 else ''}")
                else:
                    print(f"⚠️  Respuesta no es CSV: {response.get('Content-Type')}")
                    
            else:
                print(f"❌ Error en respuesta: {response.status_code}")
                if hasattr(response, 'content'):
                    print(f"📄 Contenido: {response.content.decode('utf-8')[:200]}")
                    
        except Exception as e:
            print(f"❌ Error probando endpoint: {e}")
    
    print("\n" + "=" * 50)
    print("🎯 PRUEBAS DE EXPORTACIÓN COMPLETADAS")

def show_available_filters():
    """
    Mostrar filtros disponibles para exportación
    """
    print("\n📋 FILTROS DISPONIBLES PARA EXPORTACIÓN DE CITAS")
    print("=" * 50)
    
    filters = [
        {
            'parameter': 'start_date',
            'format': 'YYYY-MM-DD',
            'description': 'Fecha de inicio para filtrar citas',
            'example': '2024-01-01'
        },
        {
            'parameter': 'end_date',
            'format': 'YYYY-MM-DD',
            'description': 'Fecha de fin para filtrar citas',
            'example': '2024-12-31'
        },
        {
            'parameter': 'doctor_id',
            'format': 'Integer',
            'description': 'ID del doctor específico',
            'example': '1'
        },
        {
            'parameter': 'patient_id',
            'format': 'Integer',
            'description': 'ID del paciente específico',
            'example': '1'
        },
        {
            'parameter': 'status',
            'format': 'String',
            'description': 'Estado de la cita',
            'example': 'completed, cancelled, scheduled, confirmed, no_show'
        }
    ]
    
    for filter_info in filters:
        print(f"\n🔧 {filter_info['parameter']}")
        print(f"   📝 Descripción: {filter_info['description']}")
        print(f"   📋 Formato: {filter_info['format']}")
        print(f"   💡 Ejemplo: {filter_info['example']}")
    
    print("\n📌 EJEMPLOS DE USO:")
    print("   /api/reports/export/appointments/?start_date=2024-01-01&end_date=2024-12-31")
    print("   /api/reports/export/appointments/?status=completed")
    print("   /api/reports/export/appointments/?doctor_id=1&status=scheduled")

def main():
    """
    Función principal del script de prueba
    """
    print("🚀 INICIANDO PRUEBAS DE EXPORTACIÓN CSV")
    print("=" * 50)
    
    # Crear datos de muestra
    create_sample_data()
    
    # Mostrar filtros disponibles
    show_available_filters()
    
    # Probar endpoints
    test_export_endpoints()
    
    print("\n🎉 TODAS LAS PRUEBAS COMPLETADAS")
    print("\n📚 PRÓXIMOS PASOS:")
    print("   1. Probar endpoints desde el navegador o Postman")
    print("   2. Verificar permisos de administrador")
    print("   3. Probar diferentes combinaciones de filtros")
    print("   4. Validar formato y contenido de archivos CSV")

if __name__ == '__main__':
    main()