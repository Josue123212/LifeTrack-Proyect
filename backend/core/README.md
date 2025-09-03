# 🔐 Sistema de Permisos Personalizados

Este módulo contiene las clases de permisos personalizados para el sistema de citas médicas.

## 📋 Permisos Disponibles

### 1. `IsOwnerOrAdmin`
**Uso:** Permite acceso al propietario del objeto o a administradores.

```python
from core.permissions import IsOwnerOrAdmin

class UserProfileViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
```

**Lógica:**
- ✅ Usuarios con rol `admin` o `superadmin`
- ✅ Propietario del objeto (obj.user == request.user)
- ❌ Otros usuarios

### 2. `IsAdminOrSuperAdmin`
**Uso:** Solo administradores y superadministradores.

```python
from core.permissions import IsAdminOrSuperAdmin

class AdminOnlyViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsAdminOrSuperAdmin]
```

**Lógica:**
- ✅ Usuarios con rol `admin` o `superadmin`
- ❌ Usuarios con rol `client`

### 3. `IsSuperAdmin`
**Uso:** Solo superadministradores.

```python
from core.permissions import IsSuperAdmin

class SuperAdminViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsSuperAdmin]
```

**Lógica:**
- ✅ Usuarios con rol `superadmin`
- ❌ Todos los demás usuarios

### 4. `IsPatientOwner`
**Uso:** Paciente propietario de sus datos o administradores.

```python
from core.permissions import IsPatientOwner

class PatientViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsPatientOwner]
```

**Lógica:**
- ✅ Usuarios con rol `admin` o `superadmin`
- ✅ Paciente propietario (patient.user == request.user)
- ❌ Otros pacientes

### 5. `IsDoctorOwner`
**Uso:** Doctor propietario de sus datos o administradores.

```python
from core.permissions import IsDoctorOwner

class DoctorViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsDoctorOwner]
```

**Lógica:**
- ✅ Usuarios con rol `admin` o `superadmin`
- ✅ Doctor propietario (doctor.user == request.user)
- ❌ Otros doctores

### 6. `IsAppointmentParticipant`
**Uso:** Participantes de una cita (paciente o doctor) o administradores.

```python
from core.permissions import IsAppointmentParticipant

class AppointmentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsAppointmentParticipant]
```

**Lógica:**
- ✅ Usuarios con rol `admin` o `superadmin`
- ✅ Paciente de la cita (appointment.patient.user == request.user)
- ✅ Doctor de la cita (appointment.doctor.user == request.user)
- ❌ Otros usuarios

### 7. `IsReadOnlyOrAdmin`
**Uso:** Lectura para todos, escritura solo para administradores.

```python
from core.permissions import IsReadOnlyOrAdmin

class PublicDataViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsReadOnlyOrAdmin]
```

**Lógica:**
- ✅ GET, HEAD, OPTIONS: Todos los usuarios autenticados
- ✅ POST, PUT, PATCH, DELETE: Solo `admin` o `superadmin`

## 🎯 Ejemplos de Uso Combinado

### Ejemplo 1: Vista de Perfil de Usuario
```python
class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    
    def get_queryset(self):
        if self.request.user.role in ['admin', 'superadmin']:
            return User.objects.all()
        return User.objects.filter(id=self.request.user.id)
```

### Ejemplo 2: Vista de Citas Médicas
```python
class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated, IsAppointmentParticipant]
    
    def get_queryset(self):
        user = self.request.user
        if user.role in ['admin', 'superadmin']:
            return Appointment.objects.all()
        elif hasattr(user, 'patient'):
            return Appointment.objects.filter(patient=user.patient)
        elif hasattr(user, 'doctor'):
            return Appointment.objects.filter(doctor=user.doctor)
        return Appointment.objects.none()
```

### Ejemplo 3: Vista de Solo Lectura para Especialidades
```python
class SpecializationViewSet(viewsets.ModelViewSet):
    serializer_class = SpecializationSerializer
    permission_classes = [IsAuthenticated, IsReadOnlyOrAdmin]
    queryset = Specialization.objects.all()
```

## 🔧 Personalización de Permisos

Puedes combinar múltiples permisos usando operadores lógicos:

```python
from rest_framework.permissions import BasePermission

class CustomPermission(BasePermission):
    def has_permission(self, request, view):
        # Lógica personalizada
        return True

# Uso con múltiples permisos
class MyViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, (IsOwnerOrAdmin | IsReadOnlyOrAdmin)]
```

## 🧪 Testing

Para probar los permisos, ejecuta:

```bash
python test_permissions.py
```

Este script verifica que todas las clases de permisos se importen correctamente y tengan los métodos necesarios.

## 📝 Notas Importantes

1. **Siempre incluir `IsAuthenticated`** como primer permiso
2. **Los permisos se evalúan en orden** - el primer permiso que falle denegará el acceso
3. **Usar `has_permission`** para permisos a nivel de vista
4. **Usar `has_object_permission`** para permisos a nivel de objeto
5. **Los administradores siempre tienen acceso completo** en estos permisos

## 🔗 Referencias

- [Django REST Framework Permissions](https://www.django-rest-framework.org/api-guide/permissions/)
- [Custom Permissions](https://www.django-rest-framework.org/api-guide/permissions/#custom-permissions)