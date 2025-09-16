from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenVerifyView

from .views import (
    UserViewSet,
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    LogoutView,
    UserRegistrationView,
    UserProfileView,
    ChangePasswordView,
    UserListView,
    UserDetailView,
    user_info,
    check_email_availability,
    check_username_availability,
    PasswordResetRequestView,
    PasswordResetVerifyView,
    PasswordResetConfirmView,
)

# Router para ViewSets
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

app_name = 'users'

urlpatterns = [
    # Router de DRF (ViewSet) - Rutas principales
    path('', include(router.urls)),
    
    # Autenticación JWT
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('auth/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    
    # Registro y gestión de usuarios
    path('auth/register/', UserRegistrationView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    
    # Recuperación de contraseña
    path('auth/password-reset/request/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('auth/password-reset/verify/', PasswordResetVerifyView.as_view(), name='password_reset_verify'),
    path('auth/password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    
    # Información del usuario
    path('me/', user_info, name='user_info'),
    
    # Gestión de usuarios (para administradores) - Rutas legacy
    path('legacy/', UserListView.as_view(), name='user_list'),
    path('legacy/<int:pk>/', UserDetailView.as_view(), name='user_detail'),
    
    # Utilidades
    path('check-email/', check_email_availability, name='check_email'),
    path('check-username/', check_username_availability, name='check_username'),
]

"""
Estructura de URLs resultante:

# ViewSet Routes (Principales)
/api/users/                     - GET (list), POST (create)
/api/users/{id}/                - GET (retrieve), PUT (update), PATCH (partial_update), DELETE (destroy)
/api/users/{id}/profile/        - GET, PUT, PATCH (acción personalizada)
/api/users/{id}/change_password/ - POST (acción personalizada)
/api/users/check_email/         - POST (acción personalizada)
/api/users/check_username/      - POST (acción personalizada)

# Authentication Routes
/auth/login/                    - POST (obtener tokens)
/auth/refresh/                  - POST (refrescar token)
/auth/verify/                   - POST (verificar token)
/auth/logout/                   - POST (logout)
/auth/register/                 - POST (registro)

# Profile & Utilities
/profile/                       - GET, PUT, PATCH (perfil del usuario)
/change-password/               - POST (cambiar contraseña)
/me/                           - GET (información del usuario)
/check-email/                  - POST (verificar email)
/check-username/               - POST (verificar username)

# Legacy Routes (Compatibilidad)
/legacy/                       - GET (lista de usuarios)
/legacy/{id}/                  - GET, PUT, PATCH, DELETE (detalle de usuario)
"""