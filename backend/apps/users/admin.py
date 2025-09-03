from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _

from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Configuración del admin para el modelo User personalizado.
    """
    # Campos que se muestran en la lista de usuarios
    list_display = (
        'username', 'email', 'first_name', 'last_name', 
        'role', 'is_active', 'is_staff', 'created_at'
    )
    
    # Campos por los que se puede filtrar
    list_filter = (
        'role', 'is_active', 'is_staff', 'is_superuser', 
        'created_at', 'last_login'
    )
    
    # Campos por los que se puede buscar
    search_fields = ('username', 'email', 'first_name', 'last_name', 'phone')
    
    # Ordenamiento por defecto
    ordering = ('-created_at',)
    
    # Configuración de los fieldsets para el formulario de edición
    fieldsets = (
        (None, {
            'fields': ('username', 'password')
        }),
        (_('Información Personal'), {
            'fields': (
                'first_name', 'last_name', 'email', 'phone', 
                'date_of_birth', 'address'
            )
        }),
        (_('Permisos'), {
            'fields': (
                'role', 'is_active', 'is_staff', 'is_superuser',
                'groups', 'user_permissions'
            ),
        }),
        (_('Fechas Importantes'), {
            'fields': ('last_login', 'date_joined', 'created_at', 'updated_at')
        }),
    )
    
    # Configuración para el formulario de creación de usuario
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'username', 'email', 'password1', 'password2',
                'first_name', 'last_name', 'role'
            ),
        }),
    )
    
    # Campos de solo lectura
    readonly_fields = ('created_at', 'updated_at', 'last_login', 'date_joined')
    
    # Configuración adicional
    filter_horizontal = ('groups', 'user_permissions')
    
    def get_queryset(self, request):
        """
        Optimiza las consultas para el admin.
        """
        return super().get_queryset(request).select_related()
    
    def get_readonly_fields(self, request, obj=None):
        """
        Hace que ciertos campos sean de solo lectura para usuarios no superadmin.
        """
        readonly_fields = list(self.readonly_fields)
        
        # Si el usuario no es superadmin, no puede cambiar el rol de superadmin
        if not request.user.is_superuser and obj and obj.role == 'superadmin':
            readonly_fields.append('role')
            
        return readonly_fields
