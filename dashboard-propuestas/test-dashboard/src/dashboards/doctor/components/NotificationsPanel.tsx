import React from 'react';
import { Bell, AlertTriangle, Info, CheckCircle, Clock } from 'lucide-react';

// Datos de ejemplo para notificaciones
const notifications = [
  {
    id: 1,
    type: 'urgente',
    title: 'Resultado de laboratorio crítico',
    message: 'María González - Glucosa: 280 mg/dl',
    time: '5 min',
    read: false
  },
  {
    id: 2,
    type: 'recordatorio',
    title: 'Cita en 15 minutos',
    message: 'Luis Herrera - Consulta de seguimiento',
    time: '10 min',
    read: false
  },
  {
    id: 3,
    type: 'info',
    title: 'Nuevo mensaje del paciente',
    message: 'Ana Martínez envió una consulta',
    time: '1 hora',
    read: true
  },
  {
    id: 4,
    type: 'completado',
    title: 'Receta enviada',
    message: 'Medicación para Carlos Mendoza',
    time: '2 horas',
    read: true
  },
  {
    id: 5,
    type: 'recordatorio',
    title: 'Actualizar historial',
    message: 'Pendiente: Sofia Vargas',
    time: '3 horas',
    read: false
  }
];

const NotificationsPanel: React.FC = () => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'urgente':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'recordatorio':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'completado':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string, read: boolean) => {
    const baseColor = read ? 'bg-gray-50' : 'bg-white';
    const borderColor = {
      urgente: 'border-l-red-500',
      recordatorio: 'border-l-yellow-500',
      info: 'border-l-blue-500',
      completado: 'border-l-green-500'
    }[type] || 'border-l-gray-500';
    
    return `${baseColor} ${borderColor}`;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Notificaciones
          </h3>
          <p className="text-sm text-gray-600">
            {unreadCount} nuevas notificaciones
          </p>
        </div>
        <div className="relative">
          <Bell className="h-6 w-6 text-gray-400" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 border-l-4 rounded-lg transition-all hover:shadow-sm cursor-pointer ${
              getNotificationColor(notification.type, notification.read)
            } ${!notification.read ? 'ring-1 ring-blue-100' : ''}`}
          >
            <div className="flex items-start space-x-3">
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {getNotificationIcon(notification.type)}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`text-sm font-medium ${
                    notification.read ? 'text-gray-700' : 'text-gray-900'
                  }`}>
                    {notification.title}
                  </h4>
                  <span className="text-xs text-gray-500">
                    {notification.time}
                  </span>
                </div>
                
                <p className={`text-sm ${
                  notification.read ? 'text-gray-500' : 'text-gray-700'
                }`}>
                  {notification.message}
                </p>
                
                {/* Unread indicator */}
                {!notification.read && (
                  <div className="mt-2">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex space-x-2">
          <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Marcar todas como leídas
          </button>
          <button className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            Ver todas
          </button>
        </div>
      </div>

      {/* Priority Summary */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-lg font-bold text-red-600">
            {notifications.filter(n => n.type === 'urgente' && !n.read).length}
          </div>
          <div className="text-xs text-red-600">Urgentes</div>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <div className="text-lg font-bold text-yellow-600">
            {notifications.filter(n => n.type === 'recordatorio' && !n.read).length}
          </div>
          <div className="text-xs text-yellow-600">Recordatorios</div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;