from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    time_ago = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            'id', 
            'type', 
            'type_display',
            'title', 
            'message', 
            'is_read', 
            'created_at',
            'time_ago'
        ]
        read_only_fields = ['id', 'created_at', 'type_display', 'time_ago']

    def get_time_ago(self, obj):
        """Calcula el tiempo transcurrido desde la creación"""
        from django.utils import timezone
        from datetime import timedelta
        
        now = timezone.now()
        diff = now - obj.created_at
        
        if diff.days > 0:
            return f"hace {diff.days} día{'s' if diff.days > 1 else ''}"
        elif diff.seconds > 3600:
            hours = diff.seconds // 3600
            return f"hace {hours} hora{'s' if hours > 1 else ''}"
        elif diff.seconds > 60:
            minutes = diff.seconds // 60
            return f"hace {minutes} minuto{'s' if minutes > 1 else ''}"
        else:
            return "hace un momento"


class NotificationUpdateSerializer(serializers.ModelSerializer):
    """Serializer para actualizar solo el estado de lectura"""
    
    class Meta:
        model = Notification
        fields = ['is_read']