from django.urls import path
from . import views


# 🔄 CONFIGURACIÓN DE URLs PARA REPORTES
# Estas rutas proporcionan acceso a todos los endpoints de reportes y analytics

app_name = 'reports'

urlpatterns = [
    # 📊 Estadísticas básicas del sistema
    path(
        'stats/basic/',
        views.basic_stats,
        name='basic_stats'
    ),
    
    # 📅 Reporte de citas por período
    path(
        'appointments/period/',
        views.appointments_by_period,
        name='appointments_by_period'
    ),
    
    # 👨‍⚕️ Doctores más populares/solicitados
    path(
        'doctors/popular/',
        views.popular_doctors,
        name='popular_doctors'
    ),
    
    # ❌ Métricas de cancelaciones
    path(
        'cancellations/metrics/',
        views.cancellation_metrics,
        name='cancellation_metrics'
    ),
    
    # 🎯 Resumen ejecutivo para dashboard
    path(
        'dashboard/summary/',
        views.dashboard_summary,
        name='dashboard_summary'
    ),
    
    # =============================================================================
    # 📥 ENDPOINTS DE EXPORTACIÓN CSV
    # =============================================================================
    
    # 📋 Exportar citas a CSV con filtros
    path(
        'export/appointments/',
        views.export_appointments_csv,
        name='export_appointments_csv'
    ),
    
    # 👥 Exportar pacientes a CSV
    path(
        'export/patients/',
        views.export_patients_csv,
        name='export_patients_csv'
    ),
    
    # 👨‍⚕️ Exportar doctores a CSV
    path(
        'export/doctors/',
        views.export_doctors_csv,
        name='export_doctors_csv'
    ),
    
    # 📊 Exportar reporte completo del sistema
    path(
        'export/full-report/',
        views.export_full_report_csv,
        name='export_full_report_csv'
    ),
]


# 📋 DOCUMENTACIÓN DE ENDPOINTS:
"""
🔗 RUTAS DISPONIBLES:

1. /api/reports/stats/basic/
   - Método: GET
   - Permisos: Admin/SuperAdmin
   - Descripción: Estadísticas generales del sistema
   - Parámetros: Ninguno

2. /api/reports/appointments/period/
   - Método: GET
   - Permisos: Admin/SuperAdmin
   - Descripción: Reporte de citas agrupadas por fecha
   - Parámetros: start_date, end_date, doctor_id (opcionales)

3. /api/reports/doctors/popular/
   - Método: GET
   - Permisos: Admin/SuperAdmin
   - Descripción: Ranking de doctores por número de citas
   - Parámetros: start_date, end_date (opcionales)

4. /api/reports/cancellations/metrics/
   - Método: GET
   - Permisos: Admin/SuperAdmin
   - Descripción: Análisis detallado de cancelaciones
   - Parámetros: start_date, end_date (opcionales)

5. /api/reports/dashboard/summary/
   - Método: GET
   - Permisos: Admin/SuperAdmin
   - Descripción: Resumen ejecutivo para dashboard
   - Parámetros: Ninguno

🔒 SEGURIDAD:
- Todos los endpoints requieren autenticación
- La mayoría requieren permisos de administrador
- Los filtros de fecha son validados automáticamente

📊 EJEMPLOS DE USO:
- GET /api/reports/stats/basic/
- GET /api/reports/appointments/period/?start_date=2024-01-01&end_date=2024-01-31
- GET /api/reports/doctors/popular/?start_date=2024-01-01
- GET /api/reports/cancellations/metrics/
- GET /api/reports/dashboard/summary/
"""