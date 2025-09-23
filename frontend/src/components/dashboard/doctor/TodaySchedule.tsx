import React from 'react';
import { Clock, User, MapPin, Phone } from 'lucide-react';
import type { DoctorAppointment } from '../../../types';

interface TodayScheduleProps {
  appointments?: DoctorAppointment[];
  isLoading?: boolean;
}

const TodaySchedule: React.FC<TodayScheduleProps> = ({ appointments = [], isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-background rounded-xl p-6 shadow-sm border-border">
        <div className="h-6 bg-secondary-200 rounded w-1/3 mb-4 animate-pulse"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-4 bg-secondary-50 rounded-lg animate-pulse">
              <div className="w-12 h-12 bg-secondary-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-secondary-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-secondary-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'pending':
        return 'Pendiente';
      case 'in_progress':
        return 'En Progreso';
      case 'completed':
        return 'Completada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  return (
    <div className="bg-background rounded-xl p-6 shadow-sm border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">
          Agenda de Hoy
        </h3>
        <span className="text-sm text-text-secondary">
          {appointments.length} citas programadas
        </span>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <p className="text-text-secondary">No tienes citas programadas para hoy</p>
          <p className="text-sm text-text-muted mt-1">¡Disfruta tu día libre!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-start space-x-4 p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors"
            >
              {/* Time */}
              <div className="flex-shrink-0 text-center">
                <div className="text-sm font-medium text-text-primary">
                  {appointment.time}
                </div>
                <div className="text-xs text-text-secondary">
                  {appointment.duration || '30min'}
                </div>
              </div>

              {/* Patient Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="w-4 h-4 text-text-muted" />
                  <h4 className="text-sm font-medium text-text-primary truncate">
                    {appointment.patient_name}
                  </h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(appointment.status)}`}>
                    {getStatusText(appointment.status)}
                  </span>
                </div>

                <div className="space-y-1">
                  {appointment.reason && (
                    <p className="text-sm text-text-secondary">
                      <strong>Motivo:</strong> {appointment.reason}
                    </p>
                  )}
                  
                  {appointment.patient_phone && (
                    <div className="flex items-center space-x-1 text-xs text-text-secondary">
                      <Phone className="w-3 h-3" />
                      <span>{appointment.patient_phone}</span>
                    </div>
                  )}

                  {appointment.consultation_type && (
                    <div className="flex items-center space-x-1 text-xs text-text-secondary">
                      <MapPin className="w-3 h-3" />
                      <span>
                        {appointment.consultation_type === 'in_person' ? 'Presencial' : 'Virtual'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex-shrink-0">
                {appointment.status === 'confirmed' && (
                  <button className="text-primary hover:text-primary-hover text-sm font-medium">
                    Iniciar
                  </button>
                )}
                {appointment.status === 'pending' && (
                  <button className="text-success hover:text-success-hover text-sm font-medium">
                    Confirmar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {appointments.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <button className="w-full text-center text-primary hover:text-primary-hover text-sm font-medium">
            Ver agenda completa
          </button>
        </div>
      )}
    </div>
  );
};

export default TodaySchedule;