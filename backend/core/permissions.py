from rest_framework import permissions


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Permiso personalizado que permite acceso solo al propietario del objeto
    o a usuarios con rol de administrador o superadministrador.
    """
    
    def has_object_permission(self, request, view, obj):
        # Verificar si el usuario es superadmin o admin
        if request.user.role in ['admin', 'superadmin']:
            return True
        
        # Verificar si el objeto tiene un atributo 'user' y es el propietario
        if hasattr(obj, 'user'):
            return obj.user == request.user
        
        # Verificar si el objeto es el mismo usuario
        if hasattr(obj, 'id') and hasattr(request.user, 'id'):
            return obj.id == request.user.id
        
        return False


class IsAdminOrSuperAdmin(permissions.BasePermission):
    """
    Permiso que permite acceso solo a usuarios con rol de administrador
    o superadministrador.
    """
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role in ['admin', 'superadmin']
        )
    
    def has_object_permission(self, request, view, obj):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role in ['admin', 'superadmin']
        )


class IsSuperAdmin(permissions.BasePermission):
    """
    Permiso que permite acceso solo a usuarios con rol de superadministrador.
    """
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'superadmin'
        )
    
    def has_object_permission(self, request, view, obj):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'superadmin'
        )


class IsPatientOwner(permissions.BasePermission):
    """
    Permiso que permite acceso solo al paciente propietario de sus datos
    o a administradores.
    """
    
    def has_object_permission(self, request, view, obj):
        # Administradores tienen acceso completo
        if request.user.role in ['admin', 'superadmin']:
            return True
        
        # El paciente solo puede acceder a sus propios datos
        if hasattr(obj, 'user'):
            return obj.user == request.user
        
        return False


class IsDoctorOwner(permissions.BasePermission):
    """
    Permiso que permite acceso solo al doctor propietario de sus datos
    o a administradores.
    """
    
    def has_object_permission(self, request, view, obj):
        # Administradores tienen acceso completo
        if request.user.role in ['admin', 'superadmin']:
            return True
        
        # El doctor solo puede acceder a sus propios datos
        if hasattr(obj, 'user'):
            return obj.user == request.user
        
        return False


class IsAppointmentParticipant(permissions.BasePermission):
    """
    Permiso que permite acceso a una cita solo al paciente o doctor
    involucrados en la cita, o a administradores.
    """
    
    def has_object_permission(self, request, view, obj):
        # Administradores tienen acceso completo
        if request.user.role in ['admin', 'superadmin']:
            return True
        
        # Verificar si el usuario es el paciente de la cita
        if hasattr(obj, 'patient') and hasattr(obj.patient, 'user'):
            if obj.patient.user == request.user:
                return True
        
        # Verificar si el usuario es el doctor de la cita
        if hasattr(obj, 'doctor') and hasattr(obj.doctor, 'user'):
            if obj.doctor.user == request.user:
                return True
        
        return False


class IsReadOnlyOrAdmin(permissions.BasePermission):
    """
    Permiso que permite lectura a todos los usuarios autenticados,
    pero escritura solo a administradores.
    """
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        # Lectura permitida para todos los usuarios autenticados
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Escritura solo para administradores
        return request.user.role in ['admin', 'superadmin']


class IsDoctor(permissions.BasePermission):
    """
    Permiso que permite acceso solo a usuarios con rol de doctor.
    """
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'doctor'
        )
    
    def has_object_permission(self, request, view, obj):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'doctor'
        )


class IsSecretary(permissions.BasePermission):
    """
    Permiso que permite acceso solo a usuarios con rol de secretary.
    """
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'secretary'
        )
    
    def has_object_permission(self, request, view, obj):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'secretary'
        )


class IsDoctorOrAdmin(permissions.BasePermission):
    """
    Permiso que permite acceso a usuarios con rol de doctor,
    administrador o superadministrador.
    """
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role in ['doctor', 'admin', 'superadmin']
        )
    
    def has_object_permission(self, request, view, obj):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role in ['doctor', 'admin', 'superadmin']
        )


class IsSecretaryOrAdmin(permissions.BasePermission):
    """
    Permiso que permite acceso a usuarios con rol de secretary,
    administrador o superadministrador.
    """
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role in ['secretary', 'admin', 'superadmin']
        )
    
    def has_object_permission(self, request, view, obj):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role in ['secretary', 'admin', 'superadmin']
        )


class IsClient(permissions.BasePermission):
    """
    Permiso que permite acceso solo a usuarios con rol de client.
    """
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'client'
        )
    
    def has_object_permission(self, request, view, obj):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'client'
        )


class IsStaff(permissions.BasePermission):
    """
    Permiso que permite acceso a usuarios con roles de staff:
    doctor, secretary, admin o superadmin.
    Excluye a los clientes (clients).
    """
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role in ['doctor', 'secretary', 'admin', 'superadmin']
        )
    
    def has_object_permission(self, request, view, obj):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role in ['doctor', 'secretary', 'admin', 'superadmin']
        )


class IsDoctorOwnerOrAdmin(permissions.BasePermission):
    """
    Permiso que permite acceso solo al doctor propietario de sus datos
    o a administradores/superadministradores.
    """
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role in ['doctor', 'admin', 'superadmin']
        )
    
    def has_object_permission(self, request, view, obj):
        # Administradores tienen acceso completo
        if request.user.role in ['admin', 'superadmin']:
            return True
        
        # El doctor solo puede acceder a sus propios datos
        if request.user.role == 'doctor':
            # Si el objeto es un Doctor, verificar que sea el mismo usuario
            if hasattr(obj, 'user'):
                return obj.user == request.user
            # Si el objeto es directamente el usuario
            elif hasattr(obj, 'id') and hasattr(request.user, 'id'):
                return obj.id == request.user.id
        
        return False