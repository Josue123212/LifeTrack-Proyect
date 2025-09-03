from django.apps import AppConfig


class PatientsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'patients'
    verbose_name = 'Pacientes'
    
    def ready(self):
        """Importar signals cuando la app esté lista"""
        try:
            import patients.signals  # noqa F401
        except ImportError:
            pass