import React from 'react';
import LoadingSpinner from '../ui/LoadingSpinner';

interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
}

interface RecentActivityProps {
  appointments?: Appointment[];
  isLoading?: boolean;
}

const RecentActivity: React.FC<RecentActivityProps> = ({
  appointments = [],
  isLoading = false
}) => {
  const getActivityIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'confirmed':
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case 'pending':
        return (
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'cancelled':
        return (
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const getActivityText = (appointment: Appointment) => {
    switch (appointment.status) {
      case 'completed':
        return `Cita completada con ${appointment.doctor}`;
      case 'confirmed':
        return `Cita confirmada con ${appointment.doctor}`;
      case 'pending':
        return `Cita pendiente con ${appointment.doctor}`;
      case 'cancelled':
        return `Cita cancelada con ${appointment.doctor}`;
      default:
        return `Actividad con ${appointment.doctor}`;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace menos de 1 hora';
    if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
    
    return date.toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center h-48">
          <LoadingSpinner size="md" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-light text-gray-800 mb-1">
            Actividad Reciente
          </h2>
          <p className="text-sm text-gray-500">
            Últimas actualizaciones
          </p>
        </div>
        
        <button className="text-teal-600 hover:text-teal-700 text-sm font-medium transition-colors duration-200">
          Ver todo
        </button>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">
            No hay actividad reciente
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.slice(0, 5).map((appointment, index) => (
            <div
              key={appointment.id}
              className="group flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer"
            >
              <div className="flex-shrink-0">
                {getActivityIcon(appointment.status)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 group-hover:text-gray-900 transition-colors duration-200">
                      {getActivityText(appointment)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {appointment.specialty}
                    </p>
                  </div>
                  
                  <div className="flex-shrink-0 ml-4">
                    <p className="text-xs text-gray-400">
                      {getTimeAgo(appointment.date)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
          
          {appointments.length > 5 && (
            <div className="pt-4 border-t border-gray-100">
              <button className="w-full text-center text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors duration-200">
                Ver {appointments.length - 5} actividades más
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;