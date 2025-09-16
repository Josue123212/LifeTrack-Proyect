import React from 'react';
import { Clock, User, Calendar, MoreVertical } from 'lucide-react';

// Datos de ejemplo para citas recientes
const recentAppointments = [
  {
    id: 1,
    patient: 'María González',
    doctor: 'Dr. Rodríguez',
    time: '09:00',
    date: 'Hoy',
    status: 'confirmada',
    type: 'Consulta General'
  },
  {
    id: 2,
    patient: 'Carlos Mendoza',
    doctor: 'Dra. López',
    time: '10:30',
    date: 'Hoy',
    status: 'pendiente',
    type: 'Cardiología'
  },
  {
    id: 3,
    patient: 'Ana Martínez',
    doctor: 'Dr. García',
    time: '14:00',
    date: 'Hoy',
    status: 'completada',
    type: 'Dermatología'
  },
  {
    id: 4,
    patient: 'Luis Herrera',
    doctor: 'Dra. Ruiz',
    time: '11:00',
    date: 'Mañana',
    status: 'confirmada',
    type: 'Neurología'
  },
  {
    id: 5,
    patient: 'Sofia Vargas',
    doctor: 'Dr. Torres',
    time: '15:30',
    date: 'Mañana',
    status: 'pendiente',
    type: 'Pediatría'
  }
];

const RecentAppointments: React.FC = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmada':
        return 'bg-green-100 text-green-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'completada':
        return 'bg-blue-100 text-blue-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmada':
        return 'Confirmada';
      case 'pendiente':
        return 'Pendiente';
      case 'completada':
        return 'Completada';
      case 'cancelada':
        return 'Cancelada';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Citas Recientes
          </h3>
          <p className="text-sm text-gray-600">
            Últimas actividades del sistema
          </p>
        </div>
        <Calendar className="h-6 w-6 text-gray-400" />
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {recentAppointments.map((appointment) => (
          <div 
            key={appointment.id} 
            className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {/* Left Side - Patient Info */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">
                  {appointment.patient}
                </h4>
                <p className="text-sm text-gray-600">
                  {appointment.doctor} • {appointment.type}
                </p>
              </div>
            </div>

            {/* Right Side - Time & Status */}
            <div className="flex items-center space-x-3">
              {/* Time */}
              <div className="text-right">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  {appointment.time}
                </div>
                <div className="text-xs text-gray-500">
                  {appointment.date}
                </div>
              </div>

              {/* Status Badge */}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                {getStatusText(appointment.status)}
              </span>

              {/* Actions Menu */}
              <button className="p-1 hover:bg-gray-100 rounded">
                <MoreVertical className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
          Ver todas las citas →
        </button>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-lg font-bold text-green-600">12</div>
          <div className="text-xs text-green-600">Hoy</div>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <div className="text-lg font-bold text-yellow-600">8</div>
          <div className="text-xs text-yellow-600">Mañana</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-lg font-bold text-blue-600">45</div>
          <div className="text-xs text-blue-600">Esta semana</div>
        </div>
      </div>
    </div>
  );
};

export default RecentAppointments;