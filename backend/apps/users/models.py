from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Modelo de usuario personalizado que extiende AbstractUser.
    Incluye campos adicionales para el sistema de citas médicas.
    """
    ROLE_CHOICES = [
        ('client', 'Cliente'),
        ('admin', 'Administrador'),
        ('superadmin', 'Super Administrador'),
    ]
    
    # Hacer email único y requerido
    email = models.EmailField(unique=True, verbose_name='Correo electrónico')
    
    # Campos adicionales
    phone = models.CharField(
        max_length=15, 
        blank=True, 
        verbose_name='Teléfono',
        help_text='Número de teléfono del usuario'
    )
    
    role = models.CharField(
        max_length=20, 
        choices=ROLE_CHOICES, 
        default='client',
        verbose_name='Rol',
        help_text='Rol del usuario en el sistema'
    )
    
    # Campos de perfil adicionales
    date_of_birth = models.DateField(
        null=True, 
        blank=True, 
        verbose_name='Fecha de nacimiento'
    )
    
    address = models.TextField(
        blank=True, 
        verbose_name='Dirección',
        help_text='Dirección completa del usuario'
    )
    
    # Campos de auditoría
    created_at = models.DateTimeField(
        auto_now_add=True, 
        verbose_name='Fecha de creación'
    )
    
    updated_at = models.DateTimeField(
        auto_now=True, 
        verbose_name='Fecha de actualización'
    )
    
    # Configuración del modelo
    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.get_full_name() or self.username} ({self.get_role_display()})"
    
    def get_full_name(self):
        """
        Retorna el nombre completo del usuario.
        """
        return f"{self.first_name} {self.last_name}".strip()
    
    def is_admin(self):
        """
        Verifica si el usuario es administrador o super administrador.
        """
        return self.role in ['admin', 'superadmin']
    
    def is_superadmin(self):
        """
        Verifica si el usuario es super administrador.
        """
        return self.role == 'superadmin'
    
    def is_client(self):
        """
        Verifica si el usuario es cliente.
        """
        return self.role == 'client'
