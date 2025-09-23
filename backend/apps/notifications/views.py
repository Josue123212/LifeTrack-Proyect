from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q
from .models import Notification
from .serializers import NotificationSerializer, NotificationUpdateSerializer


class NotificationListView(generics.ListAPIView):
    """Lista las notificaciones del usuario autenticado"""
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Notification.objects.filter(user=self.request.user)
        
        # Filtro por estado de lectura
        is_read = self.request.query_params.get('is_read', None)
        if is_read is not None:
            is_read_bool = is_read.lower() == 'true'
            queryset = queryset.filter(is_read=is_read_bool)
        
        # Filtro por tipo
        notification_type = self.request.query_params.get('type', None)
        if notification_type:
            queryset = queryset.filter(type=notification_type)
        
        # Límite de resultados
        limit = self.request.query_params.get('limit', None)
        if limit:
            try:
                limit = int(limit)
                queryset = queryset[:limit]
            except ValueError:
                pass
        
        return queryset


class NotificationUpdateView(generics.UpdateAPIView):
    """Actualiza una notificación específica (principalmente para marcar como leída)"""
    serializer_class = NotificationUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def notification_count(request):
    """Obtiene el conteo de notificaciones no leídas"""
    unread_count = Notification.objects.filter(
        user=request.user,
        is_read=False
    ).count()
    
    return Response({
        'unread_count': unread_count
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_all_as_read(request):
    """Marca todas las notificaciones del usuario como leídas"""
    updated_count = Notification.objects.filter(
        user=request.user,
        is_read=False
    ).update(is_read=True)
    
    return Response({
        'message': f'{updated_count} notificaciones marcadas como leídas',
        'updated_count': updated_count
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_notification(request):
    """Crea una nueva notificación (para testing)"""
    data = request.data.copy()
    data['user'] = request.user.id
    
    serializer = NotificationSerializer(data=data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)