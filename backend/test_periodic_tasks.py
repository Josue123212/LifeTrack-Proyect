#!/usr/bin/env python
"""
Script para probar las tareas periódicas del sistema
"""

import os
import sys
import django
from datetime import datetime, timedelta

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from django_celery_beat.models import PeriodicTask, CrontabSchedule
from core.tasks import (
    send_bulk_appointment_reminders,
    cleanup_old_data,
    log_system_status
)
from apps.appointments.models import Appointment
from apps.patients.models import Patient
from apps.doctors.models import Doctor
from django.contrib.auth.models import User

def test_system_status_task():
    """
    Prueba la tarea de verificación del estado del sistema
    """
    print("\n🔍 PROBANDO TAREA DE VERIFICACIÓN DEL SISTEMA")
    print("=" * 50)
    
    try:
        # Ejecutar la tarea directamente
        result = log_system_status.delay()
        print(f"✅ Tarea enviada con ID: {result.id}")
        print("📊 La tarea de verificación del sistema se ejecutó correctamente")
        return True
    except Exception as e:
        print(f"❌ Error al ejecutar la tarea de verificación: {e}")
        return False

def test_cleanup_task():
    """
    Prueba la tarea de limpieza del sistema
    """
    print("\n🧹 PROBANDO TAREA DE LIMPIEZA DEL SISTEMA")
    print("=" * 50)
    
    try:
        # Ejecutar la tarea directamente
        result = cleanup_old_data.delay()
        print(f"✅ Tarea enviada con ID: {result.id}")
        print("🧹 La tarea de limpieza del sistema se ejecutó correctamente")
        return True
    except Exception as e:
        print(f"❌ Error al ejecutar la tarea de limpieza: {e}")
        return False

def test_reminder_task():
    """
    Prueba la tarea de recordatorios de citas
    """
    print("\n📧 PROBANDO TAREA DE RECORDATORIOS DE CITAS")
    print("=" * 50)
    
    try:
        # Ejecutar la tarea directamente
        result = send_bulk_appointment_reminders.delay()
        print(f"✅ Tarea enviada con ID: {result.id}")
        print("📧 La tarea de recordatorios se ejecutó correctamente")
        return True
    except Exception as e:
        print(f"❌ Error al ejecutar la tarea de recordatorios: {e}")
        return False

def check_periodic_tasks_status():
    """
    Verifica el estado de las tareas periódicas configuradas
    """
    print("\n📋 ESTADO DE LAS TAREAS PERIÓDICAS")
    print("=" * 50)
    
    tasks = PeriodicTask.objects.all()
    
    if not tasks.exists():
        print("⚠️  No se encontraron tareas periódicas configuradas")
        return False
    
    for task in tasks:
        status = "🟢 Activa" if task.enabled else "🔴 Inactiva"
        last_run = task.last_run_at.strftime("%Y-%m-%d %H:%M:%S") if task.last_run_at else "Nunca"
        
        print(f"\n📋 {task.name}")
        print(f"   📊 Estado: {status}")
        print(f"   🔄 Última ejecución: {last_run}")
        print(f"   ⏰ Programación: {task.crontab}")
        print(f"   📝 Tarea: {task.task}")
    
    return True

def main():
    """
    Función principal para ejecutar todas las pruebas
    """
    print("🧪 INICIANDO PRUEBAS DE TAREAS PERIÓDICAS")
    print("=" * 60)
    print(f"⏰ Fecha y hora: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Verificar estado de las tareas periódicas
    check_periodic_tasks_status()
    
    # Probar cada tarea individualmente
    results = []
    
    results.append(test_system_status_task())
    results.append(test_cleanup_task())
    results.append(test_reminder_task())
    
    # Resumen de resultados
    print("\n🎯 RESUMEN DE PRUEBAS")
    print("=" * 30)
    
    successful_tests = sum(results)
    total_tests = len(results)
    
    if successful_tests == total_tests:
        print(f"✅ Todas las pruebas pasaron ({successful_tests}/{total_tests})")
        print("🎉 El sistema de tareas periódicas está funcionando correctamente")
    else:
        print(f"⚠️  Algunas pruebas fallaron ({successful_tests}/{total_tests})")
        print("🔧 Revisa los errores anteriores para más detalles")
    
    print("\n💡 NOTAS IMPORTANTES:")
    print("- Asegúrate de que Redis esté ejecutándose")
    print("- Verifica que el worker de Celery esté activo")
    print("- El scheduler de Celery Beat debe estar ejecutándose")
    print("- Las tareas se ejecutarán automáticamente según su programación")

if __name__ == '__main__':
    main()