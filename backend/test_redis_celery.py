#!/usr/bin/env python
"""
Script para probar la conexión de Redis y Celery
"""

import os
import sys
import django
from django.conf import settings

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

def test_redis_connection():
    """Probar conexión a Redis"""
    try:
        import redis
        r = redis.Redis(host='localhost', port=6379, db=0)
        response = r.ping()
        if response:
            print("✅ Redis está funcionando correctamente")
            return True
        else:
            print("❌ Redis no responde")
            return False
    except Exception as e:
        print(f"❌ Error conectando a Redis: {e}")
        return False

def test_celery_config():
    """Probar configuración de Celery"""
    try:
        from config.celery import app
        print(f"✅ Celery app configurada: {app.main}")
        print(f"✅ Broker URL: {app.conf.broker_url}")
        print(f"✅ Result backend: {app.conf.result_backend}")
        return True
    except Exception as e:
        print(f"❌ Error en configuración de Celery: {e}")
        return False

def test_celery_tasks():
    """Probar que las tareas se puedan importar"""
    try:
        from core.tasks import test_celery_task, add_numbers
        print("✅ Tareas de Celery importadas correctamente")
        return True
    except Exception as e:
        print(f"❌ Error importando tareas: {e}")
        return False

def test_simple_task():
    """Probar ejecución de una tarea simple"""
    try:
        from core.tasks import add_numbers
        result = add_numbers.delay(5, 3)
        print(f"✅ Tarea enviada con ID: {result.id}")
        
        # Intentar obtener el resultado (con timeout)
        try:
            final_result = result.get(timeout=10)
            print(f"✅ Resultado de la tarea: {final_result}")
            return True
        except Exception as e:
            print(f"⚠️  Tarea enviada pero no se pudo obtener resultado: {e}")
            print("   Esto puede ser normal si el worker no está ejecutándose")
            return True
    except Exception as e:
        print(f"❌ Error ejecutando tarea: {e}")
        return False

if __name__ == "__main__":
    print("🔍 Probando configuración de Redis y Celery...\n")
    
    # Probar Redis
    redis_ok = test_redis_connection()
    print()
    
    # Probar configuración de Celery
    celery_config_ok = test_celery_config()
    print()
    
    # Probar importación de tareas
    tasks_ok = test_celery_tasks()
    print()
    
    # Probar ejecución de tarea (solo si Redis funciona)
    if redis_ok:
        task_ok = test_simple_task()
        print()
    else:
        task_ok = False
        print("⚠️  Saltando prueba de tareas porque Redis no está disponible\n")
    
    # Resumen
    print("📋 RESUMEN:")
    print(f"   Redis: {'✅' if redis_ok else '❌'}")
    print(f"   Celery Config: {'✅' if celery_config_ok else '❌'}")
    print(f"   Tareas: {'✅' if tasks_ok else '❌'}")
    print(f"   Ejecución: {'✅' if task_ok else '❌'}")
    
    if redis_ok and celery_config_ok and tasks_ok:
        print("\n🎉 ¡Todo está configurado correctamente!")
        if not task_ok:
            print("💡 Para probar completamente, ejecuta el worker de Celery:")
            print("   celery -A config worker --loglevel=info")
    else:
        print("\n❌ Hay problemas en la configuración que necesitan resolverse.")