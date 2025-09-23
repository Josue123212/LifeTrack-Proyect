import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook personalizado para gestionar notificaciones
 * 
 * 🎯 Objetivo: Centralizar la lógica de notificaciones
 * 💡 Concepto: Estado global + API calls + optimistic updates
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { token } = useAuth();

  // 🔧 Función para obtener notificaciones del backend
  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/notifications/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar notificaciones');
      }

      const data = await response.json();
      setNotifications(data.results || data);
      
      // Calcular notificaciones no leídas
      const unread = (data.results || data).filter(n => !n.is_read).length;
      setUnreadCount(unread);
      
    } catch (err) {
      setError(err.message);
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // 🔧 Marcar notificación como leída
  const markAsRead = useCallback(async (notificationId) => {
    if (!token) return;

    try {
      // Optimistic update - actualizar UI inmediatamente
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));

      const response = await fetch(
        `http://localhost:8000/api/notifications/${notificationId}/mark_read/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error al marcar como leída');
      }

    } catch (err) {
      // Revertir optimistic update en caso de error
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: false }
            : notification
        )
      );
      setUnreadCount(prev => prev + 1);
      setError(err.message);
      console.error('Error marking notification as read:', err);
    }
  }, [token]);

  // 🔧 Marcar todas como leídas
  const markAllAsRead = useCallback(async () => {
    if (!token) return;

    try {
      // Optimistic update
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      );
      setUnreadCount(0);

      const response = await fetch(
        'http://localhost:8000/api/notifications/mark_all_read/',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error al marcar todas como leídas');
      }

    } catch (err) {
      // Recargar notificaciones en caso de error
      fetchNotifications();
      setError(err.message);
      console.error('Error marking all notifications as read:', err);
    }
  }, [token, fetchNotifications]);

  // 🔧 Cargar notificaciones al montar el componente
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // 🔧 Polling para actualizaciones en tiempo real (cada 30 segundos)
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [token, fetchNotifications]);

  return {
    // Estado
    notifications,
    unreadCount,
    loading,
    error,
    
    // Acciones
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    
    // Utilidades
    hasUnread: unreadCount > 0,
    isEmpty: notifications.length === 0,
  };
};

export default useNotifications;