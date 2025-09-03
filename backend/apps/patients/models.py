from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import RegexValidator

User = get_user_model()


class Patient(models.Model):
    """
    Modelo de Paciente que extiende la información del usuario
    para incluir datos médicos y de contacto de emergencia.
    """
    
    GENDER_CHOICES = [
        ('M', 'Masculino'),
        ('F', 'Femenino'),
        ('O', 'Otro'),
    ]
    
    # Relación con el usuario
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='patient_profile',
        verbose_name='Usuario'
    )
    
    # Información personal adicional
    date_of_birth = models.DateField(
        verbose_name='Fecha de nacimiento'
    )
    
    gender = models.CharField(
        max_length=1,
        choices=GENDER_CHOICES,
        verbose_name='Género'
    )
    
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="El número de teléfono debe estar en formato: '+999999999'. Hasta 15 dígitos permitidos."
    )
    
    phone_number = models.CharField(
        validators=[phone_regex],
        max_length=17,
        verbose_name='Número de teléfono'
    )
    
    address = models.TextField(
        verbose_name='Dirección'
    )
    
    # Información médica
    blood_type = models.CharField(
        max_length=3,
        blank=True,
        null=True,
        verbose_name='Tipo de sangre'
    )
    
    allergies = models.TextField(
        blank=True,
        null=True,
        verbose_name='Alergias'
    )
    
    medical_conditions = models.TextField(
        blank=True,
        null=True,
        verbose_name='Condiciones médicas'
    )
    
    medications = models.TextField(
        blank=True,
        null=True,
        verbose_name='Medicamentos actuales'
    )
    
    # Contacto de emergencia
    emergency_contact_name = models.CharField(
        max_length=100,
        verbose_name='Nombre del contacto de emergencia'
    )
    
    emergency_contact_phone = models.CharField(
        validators=[phone_regex],
        max_length=17,
        verbose_name='Teléfono del contacto de emergencia'
    )
    
    emergency_contact_relationship = models.CharField(
        max_length=50,
        verbose_name='Relación con el contacto de emergencia'
    )
    
    # Metadatos
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Fecha de creación'
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Fecha de actualización'
    )
    
    class Meta:
        app_label = 'patients'
        verbose_name = 'Paciente'
        verbose_name_plural = 'Pacientes'
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.user.get_full_name()} - Paciente"
    
    @property
    def full_name(self):
        """Retorna el nombre completo del paciente"""
        return self.user.get_full_name()
    
    @property
    def age(self):
        """Calcula la edad del paciente basada en su fecha de nacimiento"""
        from datetime import date
        today = date.today()
        return today.year - self.date_of_birth.year - (
            (today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day)
        )
    
    def get_medical_summary(self):
        """Retorna un resumen médico del paciente"""
        summary = {
            'blood_type': self.blood_type or 'No especificado',
            'allergies': self.allergies or 'Ninguna conocida',
            'medical_conditions': self.medical_conditions or 'Ninguna conocida',
            'medications': self.medications or 'Ninguna'
        }
        return summary
