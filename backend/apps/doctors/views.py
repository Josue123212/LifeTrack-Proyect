from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Count, Avg
from django.utils import timezone
from datetime import datetime, timedelta, time
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Doctor
from .serializers import (
    DoctorSerializer,
    DoctorCreateSerializer,
    DoctorUpdateSerializer,
    DoctorListSerializer,
    DoctorPublicSerializer
)
from apps.appointments.filters import DoctorFilter
from apps.appointments.models import Appointment


class DoctorViewSet(viewsets.ModelViewSet):
    """
    ViewSet completo para gestión de doctores.
    
    Proporciona operaciones CRUD completas para doctores:
    - list: Listar doctores (con filtros y búsqueda)
    - create: Crear nuevo doctor
    - retrieve: Obtener doctor específico
    - update: Actualizar doctor completo
    - partial_update: Actualizar doctor parcial
    - destroy: Eliminar doctor (soft delete)
    
    Acciones personalizadas:
    - available_slots: Obtener horarios disponibles del doctor
    - schedule: Obtener agenda del doctor
    - statistics: Estadísticas del doctor
    - toggle_availability: Cambiar disponibilidad del doctor
    - public_profile: Perfil público del doctor
    
    Filtros disponibles:
    - name: Búsqueda por nombre o apellido
    - specialization: Filtro por especialización
    - is_available: Filtro por disponibilidad
    - experience_min, experience_max: Filtros por años de experiencia
    
    Búsqueda disponible en:
    - Nombre y apellido del doctor
    - Especialización
    - Número de licencia médica
    
    Ordenamiento disponible por:
    - first_name, last_name, specialization, years_experience, is_available
    """
    
    queryset = Doctor.objects.select_related('user').all()
    serializer_class = DoctorSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    # Configuración de filtros
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = DoctorFilter
    
    # Configuración de búsqueda
    search_fields = [
        'user__first_name',
        'user__last_name',
        'specialization',
        'license_number',
    ]
    
    # Configuración de ordenamiento
    ordering_fields = [
        'user__first_name', 
        'user__last_name', 
        'specialization', 
        'years_experience', 
        'is_available',
        'created_at'
    ]
    ordering = ['user__last_name', 'user__first_name']  # Ordenamiento por defecto: alfabético por apellido
    
    def get_serializer_class(self):
        """
        Retorna la clase de serializer apropiada según la acción.
        """
        if self.action == 'create':
            return DoctorCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return DoctorUpdateSerializer
        elif self.action == 'list':
            return DoctorListSerializer
        elif self.action == 'public_profile':
            return DoctorPublicSerializer
        return DoctorSerializer
    
    def get_permissions(self):
        """
        Instancia y retorna la lista de permisos requeridos para esta vista.
        """
        if self.action in ['list', 'retrieve', 'public_profile', 'available_slots']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated]
        
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        """
        Retorna el queryset filtrado según los parámetros de búsqueda.
        """
        queryset = Doctor.objects.select_related('user').prefetch_related('appointments')
        
        # Filtro por búsqueda general
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(user__first_name__icontains=search) |
                Q(user__last_name__icontains=search) |
                Q(specialization__icontains=search) |
                Q(license_number__icontains=search)
            )
        
        # Filtro por especialización
        specialization = self.request.query_params.get('specialization', None)
        if specialization:
            queryset = queryset.filter(specialization__icontains=specialization)
        
        # Filtro por disponibilidad
        is_available = self.request.query_params.get('is_available', None)
        if is_available is not None:
            queryset = queryset.filter(is_available=is_available.lower() == 'true')
        
        # Filtro por rango de tarifa de consulta
        min_fee = self.request.query_params.get('min_fee', None)
        max_fee = self.request.query_params.get('max_fee', None)
        
        if min_fee:
            try:
                queryset = queryset.filter(consultation_fee__gte=float(min_fee))
            except ValueError:
                pass
        
        if max_fee:
            try:
                queryset = queryset.filter(consultation_fee__lte=float(max_fee))
            except ValueError:
                pass
        
        # Filtro por años de experiencia
        min_experience = self.request.query_params.get('min_experience', None)
        if min_experience:
            try:
                queryset = queryset.filter(experience_years__gte=int(min_experience))
            except ValueError:
                pass
        
        return queryset.order_by('-created_at')
    
    def create(self, request, *args, **kwargs):
        """
        Crear un nuevo doctor.
        """
        serializer = self.get_serializer(data=request.data)
        
        try:
            serializer.is_valid(raise_exception=True)
            doctor = serializer.save()
            
            return Response(
                {
                    'message': 'Doctor creado exitosamente',
                    'data': DoctorSerializer(doctor).data
                },
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {
                    'error': 'Error al crear doctor',
                    'detail': str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def update(self, request, *args, **kwargs):
        """
        Actualizar doctor completo o parcial.
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        try:
            serializer.is_valid(raise_exception=True)
            doctor = serializer.save()
            
            return Response(
                {
                    'message': 'Doctor actualizado exitosamente',
                    'data': DoctorSerializer(doctor).data
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {
                    'error': 'Error al actualizar doctor',
                    'detail': str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def partial_update(self, request, *args, **kwargs):
        """
        Actualizar doctor parcial.
        """
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        """
        Eliminar doctor (soft delete).
        """
        instance = self.get_object()
        
        # Verificar si tiene citas futuras
        future_appointments = Appointment.objects.filter(
            doctor=instance,
            date__gte=timezone.now().date(),
            status__in=['scheduled', 'confirmed']
        ).exists()
        
        if future_appointments:
            return Response(
                {
                    'error': 'No se puede eliminar el doctor',
                    'detail': 'El doctor tiene citas futuras programadas'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Soft delete: desactivar el usuario asociado
            instance.user.is_active = False
            instance.user.save()
            
            return Response(
                {
                    'message': 'Doctor eliminado exitosamente'
                },
                status=status.HTTP_204_NO_CONTENT
            )
        except Exception as e:
            return Response(
                {
                    'error': 'Error al eliminar doctor',
                    'detail': str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['get'], permission_classes=[permissions.AllowAny], url_path='available-slots')
    def available_slots(self, request, pk=None):
        """
        Obtener horarios disponibles del doctor para una fecha específica.
        """
        doctor = self.get_object()
        
        # Verificar si el doctor está disponible
        if not doctor.is_available:
            return Response(
                {
                    'error': 'Doctor no disponible',
                    'detail': 'El doctor no está aceptando citas en este momento'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Obtener fecha del query parameter
        date_str = request.query_params.get('date', None)
        if not date_str:
            return Response(
                {
                    'error': 'Fecha requerida',
                    'detail': 'Debe proporcionar una fecha en formato YYYY-MM-DD'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            appointment_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {
                    'error': 'Formato de fecha inválido',
                    'detail': 'Use el formato YYYY-MM-DD'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verificar que la fecha no sea en el pasado
        if appointment_date < timezone.now().date():
            return Response(
                {
                    'error': 'Fecha inválida',
                    'detail': 'No se pueden agendar citas en fechas pasadas'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Generar horarios disponibles (9:00 AM - 5:00 PM, cada 30 minutos)
        available_slots = []
        start_time = time(9, 0)  # 9:00 AM
        end_time = time(17, 0)   # 5:00 PM
        
        current_time = datetime.combine(appointment_date, start_time)
        end_datetime = datetime.combine(appointment_date, end_time)
        
        # Obtener citas existentes para esa fecha
        existing_appointments = Appointment.objects.filter(
            doctor=doctor,
            date=appointment_date,
            status__in=['scheduled', 'confirmed']
        ).values_list('time', flat=True)
        
        while current_time < end_datetime:
            slot_time = current_time.time()
            
            # Verificar si el horario no está ocupado
            if slot_time not in existing_appointments:
                available_slots.append({
                    'time': slot_time.strftime('%H:%M'),
                    'datetime': current_time.isoformat(),
                    'available': True
                })
            
            # Incrementar 30 minutos
            current_time += timedelta(minutes=30)
        
        return Response(
            {
                'message': 'Horarios disponibles obtenidos exitosamente',
                'data': {
                    'doctor': {
                        'id': doctor.id,
                        'name': doctor.full_name,
                        'specialization': doctor.specialization
                    },
                    'date': appointment_date.isoformat(),
                    'available_slots': available_slots,
                    'total_slots': len(available_slots)
                }
            },
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['get'], url_path='schedule')
    def schedule(self, request, pk=None):
        """
        Obtener la agenda del doctor para un rango de fechas.
        """
        doctor = self.get_object()
        
        # Obtener parámetros de fecha
        date_from = request.query_params.get('date_from', timezone.now().date().isoformat())
        date_to = request.query_params.get('date_to', (timezone.now().date() + timedelta(days=7)).isoformat())
        
        try:
            start_date = datetime.strptime(date_from, '%Y-%m-%d').date()
            end_date = datetime.strptime(date_to, '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {
                    'error': 'Formato de fecha inválido',
                    'detail': 'Use el formato YYYY-MM-DD'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Obtener citas en el rango de fechas
        appointments = Appointment.objects.filter(
            doctor=doctor,
            date__range=[start_date, end_date]
        ).select_related('patient__user').order_by('date', 'time')
        
        from apps.appointments.serializers import AppointmentListSerializer
        appointments_data = AppointmentListSerializer(appointments, many=True).data
        
        return Response(
            {
                'message': 'Agenda obtenida exitosamente',
                'data': {
                    'doctor': {
                        'id': doctor.id,
                        'name': doctor.full_name,
                        'specialization': doctor.specialization
                    },
                    'date_range': {
                        'from': start_date.isoformat(),
                        'to': end_date.isoformat()
                    },
                    'appointments': appointments_data,
                    'total_appointments': appointments.count()
                }
            },
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['get'], url_path='statistics')
    def statistics(self, request, pk=None):
        """
        Obtener estadísticas del doctor.
        """
        doctor = self.get_object()
        
        # Estadísticas de citas
        appointments = Appointment.objects.filter(doctor=doctor)
        
        # Citas por estado
        appointments_by_status = appointments.values('status').annotate(
            count=Count('id')
        ).order_by('status')
        
        # Citas por mes (últimos 12 meses)
        twelve_months_ago = timezone.now().date() - timedelta(days=365)
        monthly_appointments = appointments.filter(
            date__gte=twelve_months_ago
        ).extra(
            select={'month': "strftime('%%Y-%%m', date)"}
        ).values('month').annotate(
            count=Count('id')
        ).order_by('month')
        
        # Pacientes únicos atendidos
        unique_patients = appointments.values('patient').distinct().count()
        
        # Ingresos estimados (solo citas completadas)
        completed_appointments = appointments.filter(status='completed').count()
        estimated_revenue = completed_appointments * doctor.consultation_fee
        
        statistics = {
            'doctor_info': {
                'full_name': doctor.full_name,
                'specialization': doctor.specialization,
                'experience_years': doctor.experience_years,
                'consultation_fee': doctor.consultation_fee,
                'is_available': doctor.is_available
            },
            'appointments_summary': {
                'total': appointments.count(),
                'by_status': list(appointments_by_status),
                'monthly_trend': list(monthly_appointments),
                'unique_patients': unique_patients
            },
            'financial_summary': {
                'completed_appointments': completed_appointments,
                'estimated_revenue': estimated_revenue,
                'average_per_appointment': doctor.consultation_fee
            },
            'availability': {
                'is_available': doctor.is_available,
                'next_available_date': timezone.now().date() + timedelta(days=1) if doctor.is_available else None
            }
        }
        
        return Response(
            {
                'message': 'Estadísticas obtenidas exitosamente',
                'data': statistics
            },
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'], url_path='toggle-availability')
    def toggle_availability(self, request, pk=None):
        """
        Cambiar el estado de disponibilidad del doctor.
        """
        doctor = self.get_object()
        
        # Verificar que el usuario autenticado sea el doctor o un admin
        if request.user != doctor.user and not request.user.is_staff:
            return Response(
                {
                    'error': 'Sin permisos',
                    'detail': 'Solo el doctor o un administrador puede cambiar la disponibilidad'
                },
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            doctor.toggle_availability()
            
            return Response(
                {
                    'message': f'Disponibilidad cambiada a {"disponible" if doctor.is_available else "no disponible"}',
                    'data': {
                        'is_available': doctor.is_available,
                        'doctor_name': doctor.full_name
                    }
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {
                    'error': 'Error al cambiar disponibilidad',
                    'detail': str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['get'], permission_classes=[permissions.AllowAny], url_path='public-profile')
    def public_profile(self, request, pk=None):
        """
        Obtener el perfil público del doctor (información básica sin datos sensibles).
        """
        doctor = self.get_object()
        
        # Solo mostrar doctores disponibles en el perfil público
        if not doctor.is_available:
            return Response(
                {
                    'error': 'Doctor no disponible',
                    'detail': 'Este doctor no está aceptando citas en este momento'
                },
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = DoctorPublicSerializer(doctor)
        
        # Agregar estadísticas públicas
        total_appointments = Appointment.objects.filter(
            doctor=doctor,
            status='completed'
        ).count()
        
        years_practicing = doctor.experience_years
        
        public_data = serializer.data
        public_data.update({
            'statistics': {
                'total_appointments_completed': total_appointments,
                'years_practicing': years_practicing,
                'specialization': doctor.specialization
            }
        })
        
        return Response(
            {
                'message': 'Perfil público obtenido exitosamente',
                'data': public_data
            },
            status=status.HTTP_200_OK
        )
