from django.contrib import admin
from .models import Patient


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    """
    Configuración del admin para el modelo Patient
    """
    
    list_display = [
        'user',
        'full_name',
        'age',
        'gender',
        'emergency_contact',
        'created_at'
    ]
    
    list_filter = [
        'gender',
        'created_at',
        'updated_at'
    ]
    
    search_fields = [
        'user__username',
        'user__email',
        'user__first_name',
        'user__last_name',
        'emergency_contact'
    ]
    
    readonly_fields = [
        'created_at',
        'updated_at',
        'age'
    ]
    
    fieldsets = (
        ('Información del Usuario', {
            'fields': ('user',)
        }),
        ('Información Personal', {
            'fields': ('date_of_birth', 'gender', 'address')
        }),
        ('Contacto de Emergencia', {
            'fields': ('emergency_contact', 'emergency_phone')
        }),
        ('Información Médica', {
            'fields': ('medical_history', 'allergies'),
            'classes': ('collapse',)
        }),
        ('Metadatos', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    def full_name(self, obj):
        """Muestra el nombre completo del paciente"""
        return obj.full_name
    full_name.short_description = 'Nombre Completo'
    
    def age(self, obj):
        """Muestra la edad del paciente"""
        return f"{obj.age} años"
    age.short_description = 'Edad'
