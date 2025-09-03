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
from core.permissions import IsAdminOrSuperAdmin
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
