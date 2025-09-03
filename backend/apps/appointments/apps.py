from django.apps import AppConfig


class AppointmentsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.appointments'
    verbose_name = 'Gestión de Citas'
    
    def ready(self):
        import apps.appointments.signals  # noqa F401
