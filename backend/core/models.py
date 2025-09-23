"""
Modelos del core del sistema.

Este módulo contiene modelos compartidos y de auditoría.
"""

from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class AuditLog(models.Model):
    """
    Modelo para registrar todas las acciones del sistema.
    
    Este modelo almacena un registro detallado de todas las acciones
    realizadas por los usuarios en el sistema, incluyendo:
    - Qué usuario realizó la acción
    - Qué acción se realizó
    - En qué recurso
    - Cuándo se realizó
    - Desde qué IP
    - Con qué resultado
    """
    user = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        verbose_name="Usuario",
        help_text="Usuario que realizó la acción"
    )
    action = models.CharField(
        max_length=100,
        verbose_name="Acción",
        help_text="Tipo de acción realizada (create, update, delete, view)"
    )
    resource = models.CharField(
        max_length=100,
        verbose_name="Recurso",
        help_text="Tipo de recurso afectado (appointments, patients, users, etc.)"
    )
    resource_id = models.CharField(
        max_length=50, 
        null=True, 
        blank=True,
        verbose_name="ID del Recurso",
        help_text="ID específico del recurso afectado"
    )
    method = models.CharField(
        max_length=10,
        verbose_name="Método HTTP",
        help_text="Método HTTP utilizado (GET, POST, PUT, DELETE)"
    )
    path = models.CharField(
        max_length=500,
        verbose_name="Ruta",
        help_text="Ruta completa de la petición"
    )
    ip_address = models.GenericIPAddressField(
        verbose_name="Dirección IP",
        help_text="Dirección IP desde donde se realizó la petición"
    )
    user_agent = models.TextField(
        blank=True,
        verbose_name="User Agent",
        help_text="Información del navegador/cliente"
    )
    request_data = models.JSONField(
        null=True, 
        blank=True,
        verbose_name="Datos de la Petición",
        help_text="Datos enviados en la petición (sin información sensible)"
    )
    response_status = models.IntegerField(
        null=True, 
        blank=True,
        verbose_name="Estado de la Respuesta",
        help_text="Código de estado HTTP de la respuesta"
    )
    timestamp = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Fecha y Hora",
        help_text="Momento en que se realizó la acción"
    )
    
    class Meta:
        db_table = 'audit_logs'
        ordering = ['-timestamp']
        verbose_name = "Log de Auditoría"
        verbose_name_plural = "Logs de Auditoría"
        indexes = [
            models.Index(fields=['user', 'timestamp'], name='audit_user_time_idx'),
            models.Index(fields=['action', 'timestamp'], name='audit_action_time_idx'),
            models.Index(fields=['resource', 'timestamp'], name='audit_resource_time_idx'),
            models.Index(fields=['ip_address', 'timestamp'], name='audit_ip_time_idx'),
        ]

    def __str__(self):
        user_info = self.user.username if self.user else "Usuario Anónimo"
        return f"{user_info} - {self.action} {self.resource} - {self.timestamp.strftime('%Y-%m-%d %H:%M:%S')}"

    @property
    def user_role(self):
        """Obtener el rol del usuario que realizó la acción."""
        return getattr(self.user, 'role', 'unknown') if self.user else 'anonymous'

    @property
    def is_admin_action(self):
        """Verificar si es una acción administrativa."""
        return self.user_role in ['admin', 'superadmin'] if self.user else False

    @property
    def is_critical_action(self):
        """Verificar si es una acción crítica que requiere atención especial."""
        critical_actions = ['delete', 'create']
        critical_resources = ['users', 'admin', 'system']
        
        return (
            self.action in critical_actions or 
            self.resource in critical_resources or
            self.is_admin_action
        )


class SystemMetrics(models.Model):
    """
    Modelo para almacenar métricas del sistema.
    
    Almacena estadísticas agregadas del sistema para monitoreo
    y análisis de rendimiento.
    """
    metric_name = models.CharField(
        max_length=100,
        verbose_name="Nombre de la Métrica",
        help_text="Nombre identificativo de la métrica"
    )
    metric_value = models.FloatField(
        verbose_name="Valor de la Métrica",
        help_text="Valor numérico de la métrica"
    )
    metric_unit = models.CharField(
        max_length=50,
        blank=True,
        verbose_name="Unidad",
        help_text="Unidad de medida de la métrica"
    )
    category = models.CharField(
        max_length=50,
        verbose_name="Categoría",
        help_text="Categoría de la métrica (performance, security, usage, etc.)"
    )
    timestamp = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Fecha y Hora",
        help_text="Momento en que se registró la métrica"
    )
    
    class Meta:
        db_table = 'system_metrics'
        ordering = ['-timestamp']
        verbose_name = "Métrica del Sistema"
        verbose_name_plural = "Métricas del Sistema"
        indexes = [
            models.Index(fields=['metric_name', 'timestamp'], name='metrics_name_time_idx'),
            models.Index(fields=['category', 'timestamp'], name='metrics_category_time_idx'),
        ]

    def __str__(self):
        return f"{self.metric_name}: {self.metric_value} {self.metric_unit} ({self.timestamp.strftime('%Y-%m-%d %H:%M')})"