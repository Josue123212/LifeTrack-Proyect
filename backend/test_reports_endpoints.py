#!/usr/bin/env python
"""
🧪 SCRIPT DE PRUEBA PARA ENDPOINTS DE REPORTES

Este script prueba todos los endpoints de reportes implementados
en la Fase 8.1 del sistema de citas médicas.

🎯 OBJETIVO: Verificar que todos los endpoints funcionen correctamente
💡 CONCEPTO: Pruebas automatizadas de la API de reportes
"""

import os
import sys
import django
from datetime import datetime, timedelta
import json

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
from rest_framework_simplejwt.tokens import RefreshToken


class ReportsEndpointTester:
    """
    Clase para probar todos los endpoints de reportes.
    """
    
    def __init__(self):
        self.client = Client()
        self.admin_user = None
        self.admin_token = None
        self.setup_test_data()
    
    def setup_test_data(self):
        """
        Crear datos de prueba necesarios para los reportes.
        """
        print("🔧 Configurando datos de prueba...")
        
        # Crear usuario administrador
        try:
            self.admin_user = User.objects.get(email='admin@test.com')
        except User.DoesNotExist:
            self.admin_user = User.objects.create_user(
                username='admin_reports',
                email='admin@test.com',
                password='admin123',
                first_name='Admin',
                last_name='Reports',
                role='admin'
            )
        
        # Generar token JWT
        refresh = RefreshToken.for_user(self.admin_user)
        self.admin_token = str(refresh.access_token)
        
        # Configurar headers de autenticación
        self.client.defaults['HTTP_AUTHORIZATION'] = f'Bearer {self.admin_token}'
        
        print(f"✅ Usuario admin creado: {self.admin_user.email}")
        print(f"✅ Token generado: {self.admin_token[:20]}...")
    
    def test_basic_stats(self):
        """
        Probar endpoint de estadísticas básicas.
        """
        print("\n📊 Probando endpoint de estadísticas básicas...")
        
        response = self.client.get('/api/reports/stats/basic/')
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Estadísticas básicas obtenidas exitosamente:")
            print(f"   - Total de citas: {data.get('total_appointments', 0)}")
            print(f"   - Total de pacientes: {data.get('total_patients', 0)}")
            print(f"   - Total de doctores: {data.get('total_doctors', 0)}")
            print(f"   - Citas hoy: {data.get('appointments_today', 0)}")
            print(f"   - Citas esta semana: {data.get('appointments_this_week', 0)}")
            print(f"   - Citas completadas: {data.get('completed_appointments', 0)}")
            return True
        else:
            print(f"❌ Error en estadísticas básicas: {response.content.decode()}")
            return False
    
    def test_appointments_by_period(self):
        """
        Probar endpoint de citas por período.
        """
        print("\n📅 Probando endpoint de citas por período...")
        
        # Probar sin parámetros (último mes por defecto)
        response = self.client.get('/api/reports/appointments/period/')
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Reporte de citas por período obtenido exitosamente:")
            print(f"   - Período: {data.get('period', {})}")
            print(f"   - Registros encontrados: {len(data.get('data', []))}")
            
            # Probar con parámetros específicos
            today = timezone.now().date()
            start_date = today - timedelta(days=7)
            
            response2 = self.client.get(
                f'/api/reports/appointments/period/?start_date={start_date}&end_date={today}'
            )
            
            if response2.status_code == 200:
                print("✅ Filtros de fecha funcionando correctamente")
                return True
            else:
                print(f"❌ Error con filtros: {response2.content.decode()}")
                return False
        else:
            print(f"❌ Error en reporte por período: {response.content.decode()}")
            return False
    
    def test_popular_doctors(self):
        """
        Probar endpoint de doctores populares.
        """
        print("\n👨‍⚕️ Probando endpoint de doctores populares...")
        
        response = self.client.get('/api/reports/doctors/popular/')
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Reporte de doctores populares obtenido exitosamente:")
            print(f"   - Período: {data.get('period', {})}")
            print(f"   - Doctores encontrados: {len(data.get('data', []))}")
            
            # Mostrar algunos doctores si existen
            doctors = data.get('data', [])
            for i, doctor in enumerate(doctors[:3]):
                print(f"   - {i+1}. {doctor.get('doctor_name')} ({doctor.get('specialization')})")
                print(f"      Citas totales: {doctor.get('total_appointments')}")
            
            return True
        else:
            print(f"❌ Error en doctores populares: {response.content.decode()}")
            return False
    
    def test_cancellation_metrics(self):
        """
        Probar endpoint de métricas de cancelaciones.
        """
        print("\n❌ Probando endpoint de métricas de cancelaciones...")
        
        response = self.client.get('/api/reports/cancellations/metrics/')
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            metrics = data.get('metrics', {})
            print("✅ Métricas de cancelaciones obtenidas exitosamente:")
            print(f"   - Total de cancelaciones: {metrics.get('total_cancellations', 0)}")
            print(f"   - Tasa de cancelación: {metrics.get('cancellation_rate', 0)}%")
            print(f"   - Cancelaciones por mes: {len(metrics.get('cancellations_by_month', []))} registros")
            print(f"   - Cancelaciones por doctor: {len(metrics.get('cancellations_by_doctor', []))} registros")
            
            return True
        else:
            print(f"❌ Error en métricas de cancelaciones: {response.content.decode()}")
            return False
    
    def test_dashboard_summary(self):
        """
        Probar endpoint de resumen del dashboard.
        """
        print("\n🎯 Probando endpoint de resumen del dashboard...")
        
        response = self.client.get('/api/reports/dashboard/summary/')
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            quick_stats = data.get('quick_stats', {})
            print("✅ Resumen del dashboard obtenido exitosamente:")
            print(f"   - Citas hoy: {quick_stats.get('appointments_today', 0)}")
            print(f"   - Citas pendientes: {quick_stats.get('pending_appointments', 0)}")
            print(f"   - Total pacientes: {quick_stats.get('total_patients', 0)}")
            print(f"   - Doctores activos: {quick_stats.get('active_doctors', 0)}")
            print(f"   - Citas próxima semana: {data.get('upcoming_appointments', 0)}")
            print(f"   - Tendencia semanal: {data.get('weekly_trend', 0)}")
            
            return True
        else:
            print(f"❌ Error en resumen del dashboard: {response.content.decode()}")
            return False
    
    def test_authentication_required(self):
        """
        Probar que los endpoints requieren autenticación.
        """
        print("\n🔒 Probando que los endpoints requieren autenticación...")
        
        # Crear cliente sin autenticación
        unauth_client = Client()
        
        endpoints = [
            '/api/reports/stats/basic/',
            '/api/reports/appointments/period/',
            '/api/reports/doctors/popular/',
            '/api/reports/cancellations/metrics/',
        ]
        
        all_protected = True
        for endpoint in endpoints:
            response = unauth_client.get(endpoint)
            if response.status_code != 401:
                print(f"❌ Endpoint {endpoint} no está protegido (status: {response.status_code})")
                all_protected = False
            else:
                print(f"✅ Endpoint {endpoint} requiere autenticación")
        
        return all_protected
    
    def run_all_tests(self):
        """
        Ejecutar todas las pruebas de endpoints de reportes.
        """
        print("🚀 INICIANDO PRUEBAS DE ENDPOINTS DE REPORTES")
        print("=" * 60)
        
        tests = [
            ('Autenticación requerida', self.test_authentication_required),
            ('Estadísticas básicas', self.test_basic_stats),
            ('Citas por período', self.test_appointments_by_period),
            ('Doctores populares', self.test_popular_doctors),
            ('Métricas de cancelaciones', self.test_cancellation_metrics),
            ('Resumen del dashboard', self.test_dashboard_summary),
        ]
        
        results = []
        for test_name, test_func in tests:
            try:
                result = test_func()
                results.append((test_name, result))
            except Exception as e:
                print(f"❌ Error en {test_name}: {str(e)}")
                results.append((test_name, False))
        
        # Resumen final
        print("\n" + "=" * 60)
        print("📋 RESUMEN DE PRUEBAS:")
        
        passed = 0
        for test_name, result in results:
            status = "✅ PASÓ" if result else "❌ FALLÓ"
            print(f"   {test_name}: {status}")
            if result:
                passed += 1
        
        print(f"\n🎯 RESULTADO FINAL: {passed}/{len(results)} pruebas pasaron")
        
        if passed == len(results):
            print("🎉 ¡Todos los endpoints de reportes funcionan correctamente!")
            return True
        else:
            print("⚠️  Algunos endpoints necesitan revisión")
            return False


if __name__ == '__main__':
    print("🧪 INICIANDO PRUEBAS DE ENDPOINTS DE REPORTES")
    print("Este script verifica que todos los endpoints implementados funcionen correctamente.\n")
    
    tester = ReportsEndpointTester()
    success = tester.run_all_tests()
    
    if success:
        print("\n✅ Todos los endpoints de reportes están funcionando correctamente.")
        print("🚀 El sistema está listo para la Fase 8.1!")
        sys.exit(0)
    else:
        print("\n❌ Algunos endpoints necesitan corrección.")
        print("🔧 Revisa los errores mostrados arriba.")
        sys.exit(1)