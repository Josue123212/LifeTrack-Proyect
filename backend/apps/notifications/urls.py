from django.urls import path
from . import views

app_name = 'notifications'

urlpatterns = [
    # Listar notificaciones
    path('', views.NotificationListView.as_view(), name='list'),
    
    # Actualizar notificación específica
    path('<int:pk>/', views.NotificationUpdateView.as_view(), name='update'),
    
    # Conteo de notificaciones no leídas
    path('count/', views.notification_count, name='count'),
    
    # Marcar todas como leídas
    path('mark-all-read/', views.mark_all_as_read, name='mark_all_read'),
    
    # Crear notificación (para testing)
    path('create/', views.create_notification, name='create'),
]