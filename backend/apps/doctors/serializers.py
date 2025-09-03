from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Doctor
from decimal import Decimal


class DoctorSerializer(serializers.ModelSerializer):
    """
    Serializer principal para el modelo Doctor.
    Incluye información del usuario relacionado y campos calculados.
    """
    # Campos del usuario relacionado
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    
    # Campos calculados
    full_name = serializers.CharField(read_only=True)
    
    # Serializer anidado para citas
    appointments = serializers.SerializerMethodField()
    appointments_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Doctor
        fields = [
            'id',
            'user',
            'first_name',
            'last_name', 
            'email',
            'full_name',
            'license_number',
            'specialization',
            'experience_years',
            'consultation_fee',
            'bio',
            'is_available',
            'appointments',
            'appointments_count',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_license_number(self, value):
        """
        Valida que el número de licencia sea único y tenga formato válido.
        """
        if not value or len(value.strip()) < 5:
            raise serializers.ValidationError(
                "El número de licencia debe tener al menos 5 caracteres."
            )
        
        # Verificar unicidad excluyendo la instancia actual en caso de actualización
        queryset = Doctor.objects.filter(license_number=value)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)
        
        if queryset.exists():
            raise serializers.ValidationError(
                "Ya existe un doctor con este número de licencia."
            )
        
        return value.strip().upper()

    def validate_consultation_fee(self, value):
        """
        Valida que la tarifa de consulta sea un valor positivo razonable.
        """
        if value < Decimal('0.00'):
            raise serializers.ValidationError(
                "La tarifa de consulta no puede ser negativa."
            )
        
        if value > Decimal('10000.00'):
            raise serializers.ValidationError(
                "La tarifa de consulta parece excesivamente alta."
            )
        
        return value

    def validate_experience_years(self, value):
        """
        Valida que los años de experiencia sean razonables.
        """
        if value < 0:
            raise serializers.ValidationError(
                "Los años de experiencia no pueden ser negativos."
            )
        
        if value > 70:
            raise serializers.ValidationError(
                "Los años de experiencia parecen excesivos."
            )
        
        return value

    def get_appointments(self, obj):
        """Retorna las próximas citas del doctor (próximas 10 citas)"""
        from apps.appointments.serializers import AppointmentListSerializer
        from django.utils import timezone
        
        appointments = obj.appointments.filter(
            status__in=['scheduled', 'confirmed'],
            date__gte=timezone.now().date()
        ).order_by('date', 'time')[:10]
        return AppointmentListSerializer(appointments, many=True).data
    
    def get_appointments_count(self, obj):
        """Retorna el conteo de citas por estado"""
        from django.utils import timezone
        
        return {
            'total': obj.appointments.count(),
            'scheduled': obj.appointments.filter(status='scheduled').count(),
            'confirmed': obj.appointments.filter(status='confirmed').count(),
            'upcoming': obj.appointments.filter(
                status__in=['scheduled', 'confirmed'],
                date__gte=timezone.now().date()
            ).count(),
            'completed_this_month': obj.appointments.filter(
                status='completed',
                date__year=timezone.now().year,
                date__month=timezone.now().month
            ).count()
        }


class DoctorCreateSerializer(serializers.ModelSerializer):
    """
    Serializer para crear nuevos doctores.
    Incluye validaciones específicas para la creación.
    """
    user_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Doctor
        fields = [
            'user_id',
            'license_number',
            'specialization',
            'experience_years',
            'consultation_fee',
            'bio',
            'is_available'
        ]

    def validate_user_id(self, value):
        """
        Valida que el usuario exista y no esté ya asociado a otro doctor.
        """
        try:
            user = User.objects.get(id=value)
        except User.DoesNotExist:
            raise serializers.ValidationError(
                "El usuario especificado no existe."
            )
        
        # Verificar que el usuario no esté ya asociado a otro doctor
        if Doctor.objects.filter(user=user).exists():
            raise serializers.ValidationError(
                "Este usuario ya está asociado a un doctor."
            )
        
        return value

    def create(self, validated_data):
        """
        Crea un nuevo doctor con el usuario especificado.
        """
        user_id = validated_data.pop('user_id')
        user = User.objects.get(id=user_id)
        
        doctor = Doctor.objects.create(
            user=user,
            **validated_data
        )
        
        return doctor


class DoctorUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer para actualizar doctores existentes.
    Excluye campos que no deberían modificarse después de la creación.
    """
    class Meta:
        model = Doctor
        fields = [
            'specialization',
            'experience_years',
            'consultation_fee',
            'bio',
            'is_available'
        ]
        # license_number y user no se pueden modificar después de la creación


class DoctorListSerializer(serializers.ModelSerializer):
    """
    Serializer optimizado para listados de doctores.
    Incluye solo los campos esenciales para mejorar performance.
    """
    full_name = serializers.CharField(read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = Doctor
        fields = [
            'id',
            'full_name',
            'email',
            'specialization',
            'experience_years',
            'consultation_fee',
            'is_available'
        ]


class DoctorPublicSerializer(serializers.ModelSerializer):
    """
    Serializer para información pública de doctores.
    Excluye información sensible como email completo.
    """
    full_name = serializers.CharField(read_only=True)
    
    class Meta:
        model = Doctor
        fields = [
            'id',
            'full_name',
            'specialization',
            'experience_years',
            'bio',
            'is_available'
        ]