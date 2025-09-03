from django.apps import AppConfig


class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'
    verbose_name = 'Funcionalidades Core del Sistema'
    
    def ready(self):
        """Importar signals y hooks cuando la app esté lista."""
        import core.logging_hooks  # noqa F401