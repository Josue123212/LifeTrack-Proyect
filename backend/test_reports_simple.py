#!/usr/bin/env python
"""
Script simple para probar los endpoints de reportes
"""

import os
import sys
import django
from django.conf import settings

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from django.contrib.auth import get_user_model
from django.test import Client
from django.urls import reverse
from apps.patients.models import Patient
from apps.doctors.models import Doctor
from apps.appointments.models import Appointment
from datetime import date, time
import json

User = get_user_model()

def create_test_data():
    """Crear datos de prueba"""
    print("🔧 Creando datos de prueba...")
    
    # Crear usuario admin
    admin_user, created = User.objects.get_or_create(
        username='admin',
        defaults={
            'email': 'admin@test.com',
            'first_name': 'Admin',
            'last_name': 'User',
            'is_staff': True,
            'is_superuser': True
        }
    )
    if created:
        admin_user.set_password('admin123')
        admin_user.save()
        print("✅ Usuario admin creado")
    
    # Crear usuarios para pacientes
    user_patient1, created = User.objects.get_or_create(
        username='patient1',
        defaults={
            'email': 'patient1@test.com',
            'first_name': 'Juan',
            'last_name': 'Pérez'
        }
    )
    
    user_patient2, created = User.objects.get_or_create(
        username='patient2',
        defaults={
            'email': 'patient2@test.com',
            'first_name': 'María',
            'last_name': 'García'
        }
    )
    
    # Crear pacientes
    patient1, created = Patient.objects.get_or_create(
        user=user_patient1,
        defaults={
            'date_of_birth': date(1990, 1, 1),
            'gender': 'M',
            'phone_number': '123456789',
            'address': 'Calle 123'
        }
    )
    
    patient2, created = Patient.objects.get_or_create(
        user=user_patient2,
        defaults={
            'date_of_birth': date(1985, 5, 15),
            'gender': 'F',
            'phone_number': '987654321',
            'address': 'Avenida 456'
        }
    )
    
    # Crear usuarios para doctores
    user_doctor1, created = User.objects.get_or_create(
        username='doctor1',
        defaults={
            'email': 'doctor1@test.com',
            'first_name': 'Dr. Carlos',
            'last_name': 'Rodríguez'
        }
    )
    
    user_doctor2, created = User.objects.get_or_create(
        username='doctor2',
        defaults={
            'email': 'doctor2@test.com',
            'first_name': 'Dra. Ana',
            'last_name': 'López'
        }
    )
    
    # Crear doctores
    doctor1, created = Doctor.objects.get_or_create(
        user=user_doctor1,
        defaults={
            'license_number': 'LIC001',
            'specialization': 'Cardiología',
            'experience_years': 10,
            'consultation_fee': 100.00,
            'bio': 'Especialista en cardiología'
        }
    )
    
    doctor2, created = Doctor.objects.get_or_create(
        user=user_doctor2,
        defaults={
            'license_number': 'LIC002',
            'specialization': 'Pediatría',
            'experience_years': 8,
            'consultation_fee': 80.00,
            'bio': 'Especialista en pediatría'
        }
    )
    
    # Crear citas
    appointments_data = [
        (patient1, doctor1, 'confirmed'),
        (patient1, doctor2, 'confirmed'),
        (patient2, doctor1, 'confirmed'),
        (patient2, doctor1, 'cancelled'),
        (patient1, doctor1, 'pending'),
    ]
    
    for patient, doctor, status in appointments_data:
        Appointment.objects.get_or_create(
            patient=patient,
            doctor=doctor,
            date=date.today(),
            time=time(10, 0),
            defaults={'status': status}
        )
    
    print("✅ Datos de prueba creados")
    return admin_user

def test_endpoints():
    """Probar los endpoints de reportes"""
    print("\n🧪 Probando endpoints de reportes...")
    
    # Crear cliente de prueba
    client = Client()
    
    # Crear datos de prueba
    admin_user = create_test_data()
    
    # Login del usuario
    client.force_login(admin_user)
    
    # Probar endpoints
    endpoints = [
        '/api/reports/basic-stats/',
        '/api/reports/appointments-by-period/',
        '/api/reports/popular-doctors/',
        '/api/reports/cancellation-metrics/',
        '/api/reports/dashboard-summary/',
    ]
    
    for endpoint in endpoints:
        print(f"\n📊 Probando: {endpoint}")
        try:
            response = client.get(endpoint)
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"   ✅ Respuesta exitosa")
                print(f"   📄 Datos: {json.dumps(data, indent=2, ensure_ascii=False)[:200]}...")
            else:
                print(f"   ❌ Error: {response.content.decode()}")
                
        except Exception as e:
            print(f"   ❌ Excepción: {str(e)}")

if __name__ == '__main__':
    print("🚀 Iniciando pruebas de endpoints de reportes")
    test_endpoints()
    print("\n✅ Pruebas completadas")