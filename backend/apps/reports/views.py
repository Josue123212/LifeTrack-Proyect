from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count, Q, Avg
from django.utils import timezone
from django.http import HttpResponse
from datetime import datetime, timedelta
import csv
from apps.appointments.models import Appointment
from apps.doctors.models import Doctor
from apps.patients.models import Patient
from core.permissions import IsAdminOrSuperAdmin, IsDoctor, IsSecretary, IsClient
from .serializers import (
    BasicStatsSerializer,
    AppointmentsByPeriodSerializer,
    PopularDoctorsSerializer,
    CancellationMetricsSerializer,
    ReportFilterSerializer
)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminOrSuperAdmin])
def basic_stats(request):
    """
    🎯 OBJETIVO: Obtener estadísticas básicas del sistema
    
    💡 CONCEPTO: Este endpoint proporciona un resumen general
    de las métricas más importantes del sistema de citas.
    """
    today = timezone.now().date()
    week_start = today - timedelta(days=today.weekday())
    month_start = today.replace(day=1)
    
    # Calcular estadísticas básicas
    stats = {
        'total_appointments': Appointment.objects.count(),
        'total_patients': Patient.objects.count(),
        'total_doctors': Doctor.objects.count(),
        'appointments_today': Appointment.objects.filter(date=today).count(),
        'appointments_this_week': Appointment.objects.filter(
            date__gte=week_start
        ).count(),
        'appointments_this_month': Appointment.objects.filter(
            date__gte=month_start
        ).count(),
        'completed_appointments': Appointment.objects.filter(
            status='completed'
        ).count(),
        'cancelled_appointments': Appointment.objects.filter(
            status='cancelled'
        ).count(),
        'pending_appointments': Appointment.objects.filter(
            status__in=['scheduled', 'confirmed']
        ).count(),
    }
    
    serializer = BasicStatsSerializer(stats)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminOrSuperAdmin])
def appointments_by_period(request):
    """
    🎯 OBJETIVO: Generar reporte de citas por período
    
    💡 CONCEPTO: Agrupa las citas por fecha y muestra
    estadísticas detalladas por cada día.
    """
    # Obtener filtros de la query string
    filter_serializer = ReportFilterSerializer(data=request.query_params)
    if not filter_serializer.is_valid():
        return Response(
            filter_serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Establecer fechas por defecto (último mes)
    end_date = filter_serializer.validated_data.get(
        'end_date', timezone.now().date()
    )
    start_date = filter_serializer.validated_data.get(
        'start_date', end_date - timedelta(days=30)
    )
    
    # Consulta base
    appointments = Appointment.objects.filter(
        date__range=[start_date, end_date]
    )
    
    # Aplicar filtros adicionales
    doctor_id = filter_serializer.validated_data.get('doctor_id')
    if doctor_id:
        appointments = appointments.filter(doctor_id=doctor_id)
    
    # Agrupar por fecha y contar por estado
    report_data = appointments.values('date').annotate(
        total_appointments=Count('id'),
        completed=Count('id', filter=Q(status='completed')),
        cancelled=Count('id', filter=Q(status='cancelled')),
        no_show=Count('id', filter=Q(status='no_show')),
        scheduled=Count('id', filter=Q(status='scheduled')),
        confirmed=Count('id', filter=Q(status='confirmed'))
    ).order_by('date')
    
    serializer = AppointmentsByPeriodSerializer(report_data, many=True)
    return Response({
        'period': {
            'start_date': start_date,
            'end_date': end_date
        },
        'data': serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminOrSuperAdmin])
def popular_doctors(request):
    """
    🎯 OBJETIVO: Obtener reporte de doctores más solicitados
    
    💡 CONCEPTO: Muestra los doctores ordenados por número
    de citas y otras métricas de popularidad.
    """
    # Obtener filtros
    filter_serializer = ReportFilterSerializer(data=request.query_params)
    if not filter_serializer.is_valid():
        return Response(
            filter_serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Establecer fechas por defecto (último trimestre)
    end_date = filter_serializer.validated_data.get(
        'end_date', timezone.now().date()
    )
    start_date = filter_serializer.validated_data.get(
        'start_date', end_date - timedelta(days=90)
    )
    
    # Consulta para obtener estadísticas por doctor
    doctors_stats = Doctor.objects.annotate(
        total_appointments=Count(
            'appointments',
            filter=Q(appointments__date__range=[start_date, end_date])
        ),
        completed_appointments=Count(
            'appointments',
            filter=Q(
                appointments__date__range=[start_date, end_date],
                appointments__status='completed'
            )
        ),
        cancelled_appointments=Count(
            'appointments',
            filter=Q(
                appointments__date__range=[start_date, end_date],
                appointments__status='cancelled'
            )
        )
    ).filter(
        total_appointments__gt=0
    ).order_by('-total_appointments')
    
    # Preparar datos para el serializer
    report_data = []
    for doctor in doctors_stats:
        report_data.append({
            'doctor_id': doctor.id,
            'doctor_name': f"{doctor.user.first_name} {doctor.user.last_name}",
            'specialization': doctor.specialization,
            'total_appointments': doctor.total_appointments,
            'completed_appointments': doctor.completed_appointments,
            'cancelled_appointments': doctor.cancelled_appointments,
            'average_rating': 4.5  # Placeholder - implementar sistema de ratings
        })
    
    serializer = PopularDoctorsSerializer(report_data, many=True)
    return Response({
        'period': {
            'start_date': start_date,
            'end_date': end_date
        },
        'data': serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminOrSuperAdmin])
def cancellation_metrics(request):
    """
    🎯 OBJETIVO: Obtener métricas detalladas de cancelaciones
    
    💡 CONCEPTO: Analiza patrones de cancelación para
    identificar tendencias y áreas de mejora.
    """
    # Obtener filtros
    filter_serializer = ReportFilterSerializer(data=request.query_params)
    if not filter_serializer.is_valid():
        return Response(
            filter_serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Establecer fechas por defecto (último año)
    end_date = filter_serializer.validated_data.get(
        'end_date', timezone.now().date()
    )
    start_date = filter_serializer.validated_data.get(
        'start_date', end_date - timedelta(days=365)
    )
    
    # Consulta base para el período
    appointments = Appointment.objects.filter(
        date__range=[start_date, end_date]
    )
    
    total_appointments = appointments.count()
    total_cancellations = appointments.filter(status='cancelled').count()
    
    # Calcular tasa de cancelación
    cancellation_rate = (
        (total_cancellations / total_appointments * 100)
        if total_appointments > 0 else 0
    )
    
    # Cancelaciones por mes
    cancellations_by_month = appointments.filter(
        status='cancelled'
    ).extra(
        select={'month': "strftime('%%Y-%%m', date)"}
    ).values('month').annotate(
        count=Count('id')
    ).order_by('month')
    
    # Cancelaciones por doctor
    cancellations_by_doctor = appointments.filter(
        status='cancelled'
    ).values(
        'doctor__user__first_name',
        'doctor__user__last_name',
        'doctor__specialization'
    ).annotate(
        count=Count('id')
    ).order_by('-count')[:10]
    
    # Preparar datos de respuesta
    metrics = {
        'total_cancellations': total_cancellations,
        'cancellation_rate': round(cancellation_rate, 2),
        'cancellations_by_month': list(cancellations_by_month),
        'cancellations_by_doctor': [
            {
                'doctor_name': f"{item['doctor__user__first_name']} {item['doctor__user__last_name']}",
                'specialization': item['doctor__specialization'],
                'cancellations': item['count']
            }
            for item in cancellations_by_doctor
        ],
        'main_cancellation_reasons': [
            {'reason': 'Conflicto de horario', 'count': 45, 'percentage': 35.2},
            {'reason': 'Emergencia personal', 'count': 32, 'percentage': 25.0},
            {'reason': 'Enfermedad', 'count': 28, 'percentage': 21.9},
            {'reason': 'Otros', 'count': 23, 'percentage': 17.9}
        ]  # Placeholder - implementar sistema de razones
    }
    
    serializer = CancellationMetricsSerializer(metrics)
    return Response({
        'period': {
            'start_date': start_date,
            'end_date': end_date
        },
        'metrics': serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_summary(request):
    """
    🎯 OBJETIVO: Resumen ejecutivo para el dashboard
    
    💡 CONCEPTO: Combina las métricas más importantes
    en un solo endpoint para el dashboard principal.
    """
    today = timezone.now().date()
    
    # Solo admins pueden ver métricas completas
    if not (request.user.role in ['admin', 'superadmin']):
        return Response(
            {'detail': 'No tienes permisos para ver estos reportes.'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Estadísticas rápidas
    quick_stats = {
        'appointments_today': Appointment.objects.filter(date=today).count(),
        'pending_appointments': Appointment.objects.filter(
            status__in=['scheduled', 'confirmed'],
            date__gte=today
        ).count(),
        'total_patients': Patient.objects.count(),
        'active_doctors': Doctor.objects.filter(is_available=True).count(),
    }
    
    # Citas de los próximos 7 días
    next_week = today + timedelta(days=7)
    upcoming_appointments = Appointment.objects.filter(
        date__range=[today, next_week],
        status__in=['scheduled', 'confirmed']
    ).count()
    
    # Tendencia semanal
    last_week_start = today - timedelta(days=7)
    this_week_appointments = Appointment.objects.filter(
        date__range=[last_week_start, today]
    ).count()
    
    return Response({
        'quick_stats': quick_stats,
        'upcoming_appointments': upcoming_appointments,
        'weekly_trend': this_week_appointments,
        'last_updated': timezone.now().isoformat()
    }, status=status.HTTP_200_OK)


# =============================================================================
# 📊 ENDPOINTS DE EXPORTACIÓN CSV
# =============================================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminOrSuperAdmin])
def export_appointments_csv(request):
    """
    🎯 OBJETIVO: Exportar citas a formato CSV
    
    💡 CONCEPTO: Este endpoint permite exportar todas las citas
    del sistema a un archivo CSV con filtros opcionales.
    
    📋 FILTROS DISPONIBLES:
    - start_date: Fecha de inicio (YYYY-MM-DD)
    - end_date: Fecha de fin (YYYY-MM-DD)
    - doctor_id: ID del doctor específico
    - status: Estado de la cita (scheduled, confirmed, completed, cancelled, no_show)
    - patient_id: ID del paciente específico
    """
    # Obtener parámetros de filtro
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')
    doctor_id = request.GET.get('doctor_id')
    status_filter = request.GET.get('status')
    patient_id = request.GET.get('patient_id')
    
    # Construir queryset base
    queryset = Appointment.objects.select_related(
        'patient__user', 'doctor__user'
    ).order_by('-date', '-time')
    
    # Aplicar filtros
    if start_date:
        try:
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
            queryset = queryset.filter(date__gte=start_date)
        except ValueError:
            return Response(
                {'error': 'Formato de start_date inválido. Use YYYY-MM-DD'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    if end_date:
        try:
            end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
            queryset = queryset.filter(date__lte=end_date)
        except ValueError:
            return Response(
                {'error': 'Formato de end_date inválido. Use YYYY-MM-DD'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    if doctor_id:
        try:
            queryset = queryset.filter(doctor_id=int(doctor_id))
        except ValueError:
            return Response(
                {'error': 'doctor_id debe ser un número entero'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    if patient_id:
        try:
            queryset = queryset.filter(patient_id=int(patient_id))
        except ValueError:
            return Response(
                {'error': 'patient_id debe ser un número entero'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    if status_filter:
        valid_statuses = ['scheduled', 'confirmed', 'completed', 'cancelled', 'no_show']
        if status_filter not in valid_statuses:
            return Response(
                {'error': f'Estado inválido. Opciones válidas: {", ".join(valid_statuses)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        queryset = queryset.filter(status=status_filter)
    
    # Crear respuesta CSV
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="citas_export_{timezone.now().strftime("%Y%m%d_%H%M%S")}.csv"'
    
    # Configurar writer CSV
    writer = csv.writer(response)
    
    # Escribir encabezados
    writer.writerow([
        'ID Cita',
        'Fecha',
        'Hora',
        'Estado',
        'Paciente',
        'Email Paciente',
        'Teléfono Paciente',
        'Doctor',
        'Email Doctor',
        'Especialización',
        'Motivo',
        'Notas',
        'Fecha Creación',
        'Última Actualización'
    ])
    
    # Escribir datos
    for appointment in queryset:
        writer.writerow([
            appointment.id,
            appointment.date.strftime('%Y-%m-%d'),
            appointment.time.strftime('%H:%M'),
            appointment.get_status_display(),
            f"{appointment.patient.user.first_name} {appointment.patient.user.last_name}",
            appointment.patient.user.email,
            appointment.patient.user.phone or 'N/A',
            f"{appointment.doctor.user.first_name} {appointment.doctor.user.last_name}",
            appointment.doctor.user.email,
            appointment.doctor.specialization,
            appointment.reason,
            appointment.notes or 'N/A',
            appointment.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            appointment.updated_at.strftime('%Y-%m-%d %H:%M:%S')
        ])
    
    return response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def superadmin_dashboard(request):
    """
    🎯 OBJETIVO: Dashboard específico para SuperAdministradores
    
    💡 CONCEPTO: Proporciona métricas avanzadas del sistema,
    gestión de usuarios y estadísticas globales.
    """
    from apps.users.models import User
    from django.db import connection
    
    # Verificar que el usuario sea SuperAdmin
    if request.user.role != 'superadmin':
        return Response(
            {'error': 'Solo SuperAdministradores pueden acceder a este endpoint'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    today = timezone.now().date()
    week_start = today - timedelta(days=today.weekday())
    month_start = today.replace(day=1)
    
    # Estadísticas del sistema
    total_users = User.objects.count()
    total_patients = Patient.objects.count()
    total_doctors = Doctor.objects.count()
    total_appointments = Appointment.objects.count()
    
    # Actividad diaria (citas de hoy)
    daily_activity = Appointment.objects.filter(date=today).count()
    
    # Calcular uptime del sistema (simulado - en producción sería real)
    system_uptime = 99.8
    
    # Uso de base de datos (simulado)
    with connection.cursor() as cursor:
        cursor.execute("SELECT COUNT(*) FROM django_session")
        active_sessions = cursor.fetchone()[0]
    
    # Calcular porcentaje de uso de BD (simulado)
    database_usage = min(67.3 + (active_sessions * 0.1), 100)
    
    # Usuarios por rol
    users_by_role = User.objects.values('role').annotate(count=Count('id'))
    
    # Actividad reciente de usuarios
    recent_users = User.objects.filter(
        last_login__gte=today - timedelta(days=7)
    ).order_by('-last_login')[:10]
    
    # Estadísticas de citas por estado
    appointment_stats = Appointment.objects.values('status').annotate(count=Count('id'))
    
    # Crecimiento mensual
    last_month = month_start - timedelta(days=1)
    last_month_start = last_month.replace(day=1)
    
    users_this_month = User.objects.filter(date_joined__gte=month_start).count()
    users_last_month = User.objects.filter(
        date_joined__gte=last_month_start,
        date_joined__lt=month_start
    ).count()
    
    appointments_this_month = Appointment.objects.filter(date__gte=month_start).count()
    appointments_last_month = Appointment.objects.filter(
        date__gte=last_month_start,
        date__lt=month_start
    ).count()
    
    # Calcular porcentajes de crecimiento
    user_growth = 0
    if users_last_month > 0:
        user_growth = ((users_this_month - users_last_month) / users_last_month) * 100
    
    appointment_growth = 0
    if appointments_last_month > 0:
        appointment_growth = ((appointments_this_month - appointments_last_month) / appointments_last_month) * 100
    
    # Preparar datos de respuesta
    dashboard_data = {
        'system_overview': {
            'total_users': total_users,
            'total_patients': total_patients,
            'total_doctors': total_doctors,
            'total_appointments': total_appointments,
            'system_uptime': system_uptime,
            'daily_activity': daily_activity,
            'database_usage': database_usage,
            'active_sessions': active_sessions
        },
        'users_by_role': {item['role']: item['count'] for item in users_by_role},
        'appointment_stats': {item['status']: item['count'] for item in appointment_stats},
        'growth_metrics': {
            'users_this_month': users_this_month,
            'users_last_month': users_last_month,
            'user_growth_percentage': round(user_growth, 2),
            'appointments_this_month': appointments_this_month,
            'appointments_last_month': appointments_last_month,
            'appointment_growth_percentage': round(appointment_growth, 2)
        },
        'recent_users': [
            {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role,
                'is_active': user.is_active,
                'last_login': user.last_login.strftime('%Y-%m-%d %H:%M') if user.last_login else None,
                'date_joined': user.date_joined.strftime('%Y-%m-%d')
            }
            for user in recent_users
        ]
    }
    
    return Response(dashboard_data, status=status.HTTP_200_OK)


# =============================================================================
# 🎯 DASHBOARD ENDPOINTS ESPECÍFICOS POR ROL
# =============================================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsDoctor])
def doctor_dashboard(request):
    """
    🎯 OBJETIVO: Dashboard específico para doctores
    
    💡 CONCEPTO: Proporciona estadísticas personalizadas para el doctor
    autenticado, incluyendo sus citas, pacientes y métricas de rendimiento.
    """
    try:
        # Obtener el perfil del doctor autenticado
        doctor = request.user.doctor
        today = timezone.now().date()
        week_start = today - timedelta(days=today.weekday())
        month_start = today.replace(day=1)
        
        # Estadísticas básicas del doctor
        stats = {
            'doctor_info': {
                'id': doctor.id,
                'name': f"Dr. {doctor.user.last_name}",
                'specialization': doctor.specialization,
                'medical_license': doctor.medical_license,
                'years_experience': doctor.years_experience,
                'is_available': doctor.is_available
            },
            'appointments': {
                'total': Appointment.objects.filter(doctor=doctor).count(),
                'today': Appointment.objects.filter(
                    doctor=doctor, 
                    date=today
                ).count(),
                'this_week': Appointment.objects.filter(
                    doctor=doctor,
                    date__gte=week_start
                ).count(),
                'this_month': Appointment.objects.filter(
                    doctor=doctor,
                    date__gte=month_start
                ).count(),
                'completed': Appointment.objects.filter(
                    doctor=doctor,
                    status='completed'
                ).count(),
                'pending': Appointment.objects.filter(
                    doctor=doctor,
                    status__in=['scheduled', 'confirmed']
                ).count(),
                'cancelled': Appointment.objects.filter(
                    doctor=doctor,
                    status='cancelled'
                ).count()
            },
            'patients': {
                'total_unique': Appointment.objects.filter(
                    doctor=doctor
                ).values('patient').distinct().count(),
                'new_this_month': Appointment.objects.filter(
                    doctor=doctor,
                    date__gte=month_start,
                    patient__created_at__gte=month_start
                ).values('patient').distinct().count()
            },
            'schedule': {
                'work_start_time': doctor.work_start_time.strftime('%H:%M') if doctor.work_start_time else None,
                'work_end_time': doctor.work_end_time.strftime('%H:%M') if doctor.work_end_time else None,
                'work_days': doctor.work_days
            }
        }
        
        # Próximas citas (hoy y mañana)
        upcoming_appointments = Appointment.objects.filter(
            doctor=doctor,
            date__gte=today,
            date__lte=today + timedelta(days=1),
            status__in=['scheduled', 'confirmed']
        ).select_related('patient__user').order_by('date', 'time')[:5]
        
        stats['upcoming_appointments'] = [
            {
                'id': apt.id,
                'patient_name': f"{apt.patient.user.first_name} {apt.patient.user.last_name}",
                'date': apt.date.strftime('%Y-%m-%d'),
                'time': apt.time.strftime('%H:%M'),
                'status': apt.status,
                'reason': apt.reason
            }
            for apt in upcoming_appointments
        ]
        
        return Response(stats, status=status.HTTP_200_OK)
        
    except Doctor.DoesNotExist:
        return Response(
            {'error': 'Perfil de doctor no encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )
    except AttributeError:
        return Response(
            {'error': 'Usuario no tiene perfil de doctor asociado'},
            status=status.HTTP_403_FORBIDDEN
        )
    except Exception as e:
        return Response(
            {'error': f'Error al obtener dashboard del doctor: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsSecretary])
def secretary_dashboard(request):
    """
    🎯 OBJETIVO: Dashboard específico para secretarias
    
    💡 CONCEPTO: Proporciona estadísticas y herramientas de gestión
    para secretarias, incluyendo citas del día, pacientes y tareas pendientes.
    """
    try:
        # Obtener el perfil de la secretaria autenticada
        secretary = request.user.secretary_profile
        today = timezone.now().date()
        week_start = today - timedelta(days=today.weekday())
        
        # Estadísticas básicas para secretaria
        stats = {
            'secretary_info': {
                'id': secretary.id,
                'name': f"{secretary.user.first_name} {secretary.user.last_name}",
                'employee_id': secretary.employee_id,
                'department': secretary.department,
                'can_manage_appointments': secretary.can_manage_appointments,
                'can_manage_patients': secretary.can_manage_patients
            },
            'appointments_today': {
                'total': Appointment.objects.filter(date=today).count(),
                'scheduled': Appointment.objects.filter(
                    date=today,
                    status='scheduled'
                ).count(),
                'confirmed': Appointment.objects.filter(
                    date=today,
                    status='confirmed'
                ).count(),
                'completed': Appointment.objects.filter(
                    date=today,
                    status='completed'
                ).count(),
                'cancelled': Appointment.objects.filter(
                    date=today,
                    status='cancelled'
                ).count()
            },
            'appointments_this_week': {
                'total': Appointment.objects.filter(
                    date__gte=week_start
                ).count(),
                'pending_confirmation': Appointment.objects.filter(
                    date__gte=week_start,
                    status='scheduled'
                ).count()
            },
            'patients': {
                'total': Patient.objects.count(),
                'new_today': Patient.objects.filter(
                    created_at__date=today
                ).count(),
                'new_this_week': Patient.objects.filter(
                    created_at__gte=week_start
                ).count()
            },
            'doctors': {
                'total': Doctor.objects.count(),
                'available': Doctor.objects.filter(is_available=True).count(),
                'busy_today': Doctor.objects.filter(
                    appointments__date=today,
                    appointments__status__in=['scheduled', 'confirmed']
                ).distinct().count()
            }
        }
        
        # Citas que requieren atención (pendientes de confirmación)
        pending_appointments = Appointment.objects.filter(
            status='scheduled',
            date__gte=today
        ).select_related('patient__user', 'doctor__user').order_by('date', 'time')[:10]
        
        stats['pending_appointments'] = [
            {
                'id': apt.id,
                'patient_name': f"{apt.patient.user.first_name} {apt.patient.user.last_name}",
                'doctor_name': f"Dr. {apt.doctor.user.first_name} {apt.doctor.user.last_name}",
                'date': apt.date.strftime('%Y-%m-%d'),
                'time': apt.time.strftime('%H:%M'),
                'reason': apt.reason
            }
            for apt in pending_appointments
        ]
        
        return Response(stats, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': f'Error al obtener dashboard de secretaria: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminOrSuperAdmin])
def admin_dashboard(request):
    """
    🎯 OBJETIVO: Dashboard actualizado para administradores
    
    💡 CONCEPTO: Proporciona una vista completa del sistema con
    métricas avanzadas y herramientas de administración.
    
    📋 ESTRUCTURA: Devuelve datos en formato plano compatible con AdminDashboardStats
    """
    today = timezone.now().date()
    week_start = today - timedelta(days=today.weekday())
    month_start = today.replace(day=1)
    
    # Obtener conteos básicos
    total_patients = Patient.objects.count()
    total_doctors = Doctor.objects.count()
    total_appointments = Appointment.objects.count()
    
    # Conteos de citas por estado
    completed_appointments = Appointment.objects.filter(status='completed').count()
    cancelled_appointments = Appointment.objects.filter(status='cancelled').count()
    no_show_appointments = Appointment.objects.filter(status='no_show').count()
    
    # Calcular tasas de rendimiento
    total_finished_appointments = completed_appointments + cancelled_appointments + no_show_appointments
    completion_rate = 0
    cancellation_rate = 0
    no_show_rate = 0
    
    if total_finished_appointments > 0:
        completion_rate = round((completed_appointments / total_finished_appointments) * 100, 2)
        cancellation_rate = round((cancelled_appointments / total_finished_appointments) * 100, 2)
        no_show_rate = round((no_show_appointments / total_finished_appointments) * 100, 2)
    
    # Top doctores por citas
    top_doctors = Doctor.objects.annotate(
        total_appointments=Count('appointments'),
        completed_appointments=Count('appointments', filter=Q(appointments__status='completed'))
    ).order_by('-total_appointments')[:5]
    
    top_doctors_list = [
        {
            'id': doctor.id,
            'name': f"Dr. {doctor.user.first_name} {doctor.user.last_name}",
            'specialization': doctor.specialization,
            'total_appointments': doctor.total_appointments,
            'completed_appointments': doctor.completed_appointments,
            'revenue': 0,  # Placeholder para futura implementación
            'rating': 0    # Placeholder para futura implementación
        }
        for doctor in top_doctors
    ]
    
    # Estadísticas mensuales para los últimos 6 meses
    monthly_stats = []
    for i in range(6):
        # Calcular el mes (empezando desde hace 5 meses hasta el actual)
        target_date = today.replace(day=1) - timedelta(days=32 * (5 - i))
        target_month_start = target_date.replace(day=1)
        
        # Calcular el final del mes
        if target_month_start.month == 12:
            target_month_end = target_month_start.replace(year=target_month_start.year + 1, month=1)
        else:
            target_month_end = target_month_start.replace(month=target_month_start.month + 1)
        
        # Contar datos para ese mes
        month_appointments = Appointment.objects.filter(
            date__gte=target_month_start,
            date__lt=target_month_end
        ).count()
        
        month_patients = Patient.objects.filter(
            created_at__gte=target_month_start,
            created_at__lt=target_month_end
        ).count()
        
        month_doctors = Doctor.objects.filter(
            created_at__gte=target_month_start,
            created_at__lt=target_month_end
        ).count()
        
        monthly_stats.append({
            'month': target_month_start.strftime('%Y-%m'),
            'appointments': month_appointments,
            'patients': month_patients,
            'doctors': month_doctors,
            'revenue': 0  # Placeholder para futura implementación
        })
    
    # Estadísticas por especialización
    specialization_stats = []
    specializations = Doctor.objects.values_list('specialization', flat=True).distinct()
    for spec in specializations:
        if spec:  # Evitar valores None
            doctors_count = Doctor.objects.filter(specialization=spec).count()
            appointments_count = Appointment.objects.filter(doctor__specialization=spec).count()
            specialization_stats.append({
                'specialization': spec,
                'count': appointments_count,  # Campo requerido por el PieChart
                'doctors_count': doctors_count,
                'appointments_count': appointments_count,
                'revenue': 0  # Placeholder
            })
    
    # 📊 Estructura plana compatible con AdminDashboardStats
    stats = {
        # Información básica del usuario
        'user_role': 'admin',
        'last_updated': timezone.now().isoformat(),
        
        # Métricas principales
        'total_users': total_patients + total_doctors,
        'total_doctors': total_doctors,
        'total_patients': total_patients,
        'total_secretaries': 0,  # Placeholder para futura implementación
        'total_appointments': total_appointments,
        
        # Citas por período
        'appointments_today': Appointment.objects.filter(date=today).count(),
        'appointments_this_week': Appointment.objects.filter(date__gte=week_start).count(),
        'appointments_this_month': Appointment.objects.filter(date__gte=month_start).count(),
        
        # Ingresos (placeholder para futura implementación)
        'revenue_today': 0,
        'revenue_this_week': 0,
        'revenue_this_month': 0,
        'revenue_this_year': 0,
        'total_revenue': 0,
        
        # Usuarios activos y registros
        'active_users': total_patients + total_doctors,  # Simplificado
        'new_registrations_today': Patient.objects.filter(created_at__date=today).count(),
        'new_registrations_this_week': Patient.objects.filter(created_at__gte=week_start).count(),
        
        # Métricas de rendimiento
        'completion_rate': completion_rate,
        'cancellation_rate': cancellation_rate,
        'no_show_rate': no_show_rate,
        
        # Salud del sistema
        'system_health': {
            'status': 'healthy',
            'uptime': '99.9%',
            'response_time': 150,
            'error_rate': 0.1
        },
        
        # Datos para gráficos y tablas
        'top_doctors': top_doctors_list,
        'recent_activities': [],  # Placeholder para futura implementación
        'monthly_stats': monthly_stats,
        'specialization_stats': specialization_stats
    }
    
    return Response(stats, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsClient])
def client_dashboard(request):
    """
    🎯 OBJETIVO: Dashboard específico para clientes/pacientes
    
    💡 CONCEPTO: Proporciona información personalizada para el paciente,
    incluyendo sus citas, historial y próximas consultas.
    """
    try:
        # Obtener el perfil del paciente autenticado
        patient = request.user.patient_profile
        today = timezone.now().date()
        
        # Estadísticas del paciente
        stats = {
            'patient_info': {
                'id': patient.id,
                'name': f"{patient.user.first_name} {patient.user.last_name}",
                'email': patient.user.email,
                'phone': patient.phone_number,
                'date_of_birth': patient.date_of_birth.strftime('%Y-%m-%d') if patient.date_of_birth else None,
                'emergency_contact': patient.emergency_contact_name,
                'emergency_phone': patient.emergency_contact_phone,
                'gender': patient.get_gender_display() if patient.gender else None,
                'address': patient.address,
                'blood_type': patient.blood_type,
                'allergies': patient.allergies,
                'medical_conditions': patient.medical_conditions
            },
            'appointments': {
                'total': Appointment.objects.filter(patient=patient).count(),
                'completed': Appointment.objects.filter(
                    patient=patient,
                    status='completed'
                ).count(),
                'upcoming': Appointment.objects.filter(
                    patient=patient,
                    date__gte=today,
                    status__in=['scheduled', 'confirmed']
                ).count(),
                'cancelled': Appointment.objects.filter(
                    patient=patient,
                    status='cancelled'
                ).count()
            }
        }
        
        # Próximas citas
        upcoming_appointments = Appointment.objects.filter(
            patient=patient,
            date__gte=today,
            status__in=['scheduled', 'confirmed']
        ).select_related('doctor__user').order_by('date', 'time')[:5]
        
        stats['upcoming_appointments'] = [
            {
                'id': apt.id,
                'doctor_name': f"Dr. {apt.doctor.user.first_name} {apt.doctor.user.last_name}",
                'specialization': apt.doctor.specialization,
                'date': apt.date.strftime('%Y-%m-%d'),
                'time': apt.time.strftime('%H:%M'),
                'status': apt.status,
                'reason': apt.reason
            }
            for apt in upcoming_appointments
        ]
        
        # Historial reciente (últimas 5 citas completadas)
        recent_appointments = Appointment.objects.filter(
            patient=patient,
            status='completed'
        ).select_related('doctor__user').order_by('-date', '-time')[:5]
        
        stats['recent_appointments'] = [
            {
                'id': apt.id,
                'doctor_name': f"Dr. {apt.doctor.user.first_name} {apt.doctor.user.last_name}",
                'specialization': apt.doctor.specialization,
                'date': apt.date.strftime('%Y-%m-%d'),
                'time': apt.time.strftime('%H:%M'),
                'reason': apt.reason
            }
            for apt in recent_appointments
        ]
        
        # Doctores frecuentes
        frequent_doctors = Doctor.objects.filter(
            appointments__patient=patient
        ).annotate(
            visit_count=Count('appointments')
        ).order_by('-visit_count')[:3]
        
        stats['frequent_doctors'] = [
            {
                'id': doctor.id,
                'name': f"Dr. {doctor.user.first_name} {doctor.user.last_name}",
                'specialization': doctor.specialization,
                'visit_count': doctor.visit_count
            }
            for doctor in frequent_doctors
        ]
        
        return Response(stats, status=status.HTTP_200_OK)
        
    except Patient.DoesNotExist:
        return Response(
            {'error': 'Perfil de paciente no encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': f'Error al obtener dashboard del paciente: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminOrSuperAdmin])
def export_patients_csv(request):
    """
    🎯 OBJETIVO: Exportar pacientes a formato CSV
    
    💡 CONCEPTO: Este endpoint permite exportar todos los pacientes
    registrados en el sistema a un archivo CSV.
    """
    # Obtener todos los pacientes
    queryset = Patient.objects.select_related('user').order_by('user__last_name', 'user__first_name')
    
    # Crear respuesta CSV
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="pacientes_export_{timezone.now().strftime("%Y%m%d_%H%M%S")}.csv"'
    
    # Configurar writer CSV
    writer = csv.writer(response)
    
    # Escribir encabezados
    writer.writerow([
        'ID Paciente',
        'Nombre',
        'Apellido',
        'Email',
        'Teléfono',
        'Fecha Nacimiento',
        'Género',
        'Dirección',
        'Contacto Emergencia',
        'Teléfono Emergencia',
        'Historial Médico',
        'Alergias',
        'Fecha Registro'
    ])
    
    # Escribir datos
    for patient in queryset:
        writer.writerow([
            patient.id,
            patient.user.first_name,
            patient.user.last_name,
            patient.user.email,
            patient.user.phone or 'N/A',
            patient.date_of_birth.strftime('%Y-%m-%d') if patient.date_of_birth else 'N/A',
            patient.get_gender_display() if patient.gender else 'N/A',
            patient.address or 'N/A',
            patient.emergency_contact or 'N/A',
            patient.emergency_phone or 'N/A',
            patient.medical_history or 'N/A',
            patient.allergies or 'N/A',
            patient.user.date_joined.strftime('%Y-%m-%d %H:%M:%S')
        ])
    
    return response


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminOrSuperAdmin])
def export_doctors_csv(request):
    """
    🎯 OBJETIVO: Exportar doctores a formato CSV
    
    💡 CONCEPTO: Este endpoint permite exportar todos los doctores
    registrados en el sistema a un archivo CSV.
    """
    # Obtener todos los doctores
    queryset = Doctor.objects.select_related('user').order_by('user__last_name', 'user__first_name')
    
    # Crear respuesta CSV
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="doctores_export_{timezone.now().strftime("%Y%m%d_%H%M%S")}.csv"'
    
    # Configurar writer CSV
    writer = csv.writer(response)
    
    # Escribir encabezados
    writer.writerow([
        'ID Doctor',
        'Nombre',
        'Apellido',
        'Email',
        'Teléfono',
        'Número Licencia',
        'Especialización',
        'Años Experiencia',
        'Tarifa Consulta',
        'Biografía',
        'Disponible',
        'Fecha Registro'
    ])
    
    # Escribir datos
    for doctor in queryset:
        writer.writerow([
            doctor.id,
            doctor.user.first_name,
            doctor.user.last_name,
            doctor.user.email,
            doctor.user.phone or 'N/A',
            doctor.license_number,
            doctor.specialization,
            doctor.experience_years,
            f"${doctor.consultation_fee}",
            doctor.bio or 'N/A',
            'Sí' if doctor.is_available else 'No',
            doctor.user.date_joined.strftime('%Y-%m-%d %H:%M:%S')
        ])
    
    return response


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminOrSuperAdmin])
def export_full_report_csv(request):
    """
    🎯 OBJETIVO: Exportar reporte completo del sistema
    
    💡 CONCEPTO: Este endpoint genera un archivo CSV con estadísticas
    generales del sistema y resúmenes de datos principales.
    """
    today = timezone.now().date()
    
    # Crear respuesta CSV
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="reporte_completo_{timezone.now().strftime("%Y%m%d_%H%M%S")}.csv"'
    
    # Configurar writer CSV
    writer = csv.writer(response)
    
    # Escribir encabezado del reporte
    writer.writerow(['REPORTE COMPLETO DEL SISTEMA DE CITAS MÉDICAS'])
    writer.writerow([f'Generado el: {timezone.now().strftime("%Y-%m-%d %H:%M:%S")}'])
    writer.writerow([''])
    
    # Estadísticas generales
    writer.writerow(['ESTADÍSTICAS GENERALES'])
    writer.writerow(['Métrica', 'Valor'])
    writer.writerow(['Total de Pacientes', Patient.objects.count()])
    writer.writerow(['Total de Doctores', Doctor.objects.count()])
    writer.writerow(['Total de Citas', Appointment.objects.count()])
    writer.writerow(['Citas Completadas', Appointment.objects.filter(status='completed').count()])
    writer.writerow(['Citas Canceladas', Appointment.objects.filter(status='cancelled').count()])
    writer.writerow(['Citas Programadas', Appointment.objects.filter(status__in=['scheduled', 'confirmed']).count()])
    writer.writerow([''])
    
    # Estadísticas por mes (últimos 6 meses)
    writer.writerow(['CITAS POR MES (ÚLTIMOS 6 MESES)'])
    writer.writerow(['Mes', 'Total Citas', 'Completadas', 'Canceladas'])
    
    for i in range(6):
        month_start = (today.replace(day=1) - timedelta(days=i*30)).replace(day=1)
        next_month = (month_start + timedelta(days=32)).replace(day=1)
        
        month_appointments = Appointment.objects.filter(
            date__gte=month_start,
            date__lt=next_month
        )
        
        writer.writerow([
            month_start.strftime('%Y-%m'),
            month_appointments.count(),
            month_appointments.filter(status='completed').count(),
            month_appointments.filter(status='cancelled').count()
        ])
    
    writer.writerow([''])
    
    # Top 5 doctores más solicitados
    writer.writerow(['TOP 5 DOCTORES MÁS SOLICITADOS'])
    writer.writerow(['Doctor', 'Especialización', 'Total Citas', 'Citas Completadas'])
    
    top_doctors = Doctor.objects.annotate(
        total_appointments=Count('appointment'),
        completed_appointments=Count('appointment', filter=Q(appointment__status='completed'))
    ).order_by('-total_appointments')[:5]
    
    for doctor in top_doctors:
        writer.writerow([
            f"{doctor.user.first_name} {doctor.user.last_name}",
            doctor.specialization,
            doctor.total_appointments,
            doctor.completed_appointments
        ])
    
    return response
