from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator
from decimal import Decimal

User = get_user_model()


class Doctor(models.Model):
    """
    Modelo para representar un doctor en el sistema.
    Extiende la información del usuario base con datos específicos del doctor.
    """
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE,
        verbose_name="Usuario",
        help_text="Usuario asociado al doctor"
    )
    license_number = models.CharField(
        max_length=50, 
        unique=True,
        verbose_name="Número de Licencia",
        help_text="Número único de licencia médica"
    )
    specialization = models.CharField(
        max_length=100,
        verbose_name="Especialización",
        help_text="Especialidad médica del doctor"
    )
    experience_years = models.PositiveIntegerField(
        validators=[MinValueValidator(0)],
        verbose_name="Años de Experiencia",
        help_text="Años de experiencia profesional"
    )
    consultation_fee = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))],
        verbose_name="Tarifa de Consulta",
        help_text="Costo de la consulta médica"
    )
    bio = models.TextField(
        verbose_name="Biografía",
        help_text="Información adicional sobre el doctor"
    )
    is_available = models.BooleanField(
        default=True,
        verbose_name="Disponible",
        help_text="Indica si el doctor está disponible para citas"
    )
    
    # Campos de auditoría
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Fecha de Creación"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Fecha de Actualización"
    )
    
    class Meta:
        app_label = 'doctors'
        verbose_name = "Doctor"
        verbose_name_plural = "Doctores"
        ordering = ['user__last_name', 'user__first_name']
        
    def __str__(self):
        return f"Dr. {self.user.get_full_name()} - {self.specialization}"
    
    def get_full_name(self):
        """Retorna el nombre completo del doctor con título."""
        return f"Dr. {self.user.get_full_name()}"
    
    @property
    def full_name(self):
        """Propiedad para acceder al nombre completo."""
        return self.get_full_name()
    
    @property
    def email(self):
        """Propiedad para acceder al email del usuario."""
        return self.user.email
    
    def toggle_availability(self):
        """Cambia el estado de disponibilidad del doctor."""
        self.is_available = not self.is_available
        self.save(update_fields=['is_available', 'updated_at'])
        return self.is_available
