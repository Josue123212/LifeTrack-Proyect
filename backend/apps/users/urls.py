from django.urls import path
from rest_framework_simplejwt.views import TokenVerifyView

from .views import (
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
)

app_name = 'users'

urlpatterns = [
    # Autenticación JWT
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('auth/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    
    # Registro y gestión de usuarios
    path('auth/register/', UserRegistrationView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    
    # Información del usuario
    path('me/', user_info, name='user_info'),
    
    # Gestión de usuarios (para administradores)
    path('', UserListView.as_view(), name='user_list'),
    path('<int:pk>/', UserDetailView.as_view(), name='user_detail'),
    
    # Utilidades
    path('check-email/', check_email_availability, name='check_email'),
    path('check-username/', check_username_availability, name='check_username'),
]