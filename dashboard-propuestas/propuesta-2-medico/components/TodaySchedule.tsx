import React from 'react';
import { Clock, User, Phone, FileText, CheckCircle } from 'lucide-react';

// Datos de ejemplo para la agenda del día
const todayAppointments = [
  {
    id: 1,
    time: '09:00',
    patient: 'María González',
    age: 45,
    type: 'Consulta de seguimiento',
    status: 'completada',
    notes: 'Control de presión arterial',
    phone: '+1 234-567-8901'
  },
  {
    id: 2,
    time: '09:30',
    patient: 'Carlos Mendoza',
    age: 32,
    type: 'Primera consulta',
    status: 'completada',
    notes: 'Dolor de pecho ocasional',
    phone: '+1 234-567-8902'
  },
  {
    id: 3,
    time: '10:00',
    patient: 'Ana Martínez',
    age: 28,
    type: 'Consulta de rutina',
    status: 'en_progreso',
    notes: 'Chequeo anual',
    phone: '+1 234-567-8903'
  },
  {
    id: 4,
    time: '10:30',
    patient: 'Luis Herrera',
    age: 55,
    type: 'Seguimiento',
    status: 'siguiente',
    notes: 'Resultados de laboratorio',
    phone: '+1 234-567-8904'
  },
  {
    id: 5,
    time: '11:00',
    patient: 'Sofia Vargas',
    age: 38,
    type: 'Consulta especializada',
    status: 'programada',
    notes: 'Evaluación cardiológica',
    phone: '+1 234-567-8905'
  },
  {
    id: 6,
    time: '11:30',
    patient: 'Roberto Silva',
    age: 42,
    type: 'Control',
    status: 'programada',
    notes: 'Medicación hipertensión',
    phone: '+1 234-567-8906'
  }
];

const TodaySchedule: React.FC = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completada':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'en_progreso':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'siguiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'programada':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completada':
        return <CheckCircle className="h-4 w-4" />;
      case 'en_progreso':
        return <Clock className="h-4 w-4 animate-pulse" />;
      case 'siguiente':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completada':
        return 'Completada';
      case 'en_progreso':
        return 'En progreso';
      case 'siguiente':
        return 'Siguiente';
      case 'programada':
        return 'Programada';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            Agenda de Hoy
          </h3>
          <p className="text-sm text-gray-600">
            {todayAppointments.length} citas programadas
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Próxima cita</div>
          <div className="text-lg font-semibold text-primary">
            {todayAppointments.find(apt => apt.status === 'siguiente')?.time || '10:30'}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {todayAppointments.map((appointment, index) => (
          <div key={appointment.id} className="relative">
            {/* Timeline Line */}
            {index < todayAppointments.length - 1 && (
              <div className="absolute left-6 top-16 w-0.5 h-8 bg-gray-200"></div>
            )}
            
            {/* Appointment Card */}
            <div className={`flex items-start space-x-4 p-4 rounded-lg border-2 transition-all hover:shadow-md ${
              appointment.status === 'en_progreso' ? 'ring-2 ring-blue-300' : ''
            } ${getStatusColor(appointment.status)}`}>
              
              {/* Time Circle */}
              <div className="flex-shrink-0">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm ${
                  appointment.status === 'completada' ? 'bg-green-500 text-white' :
                  appointment.status === 'en_progreso' ? 'bg-blue-500 text-white' :
                  appointment.status === 'siguiente' ? 'bg-yellow-500 text-white' :
                  'bg-gray-300 text-gray-700'
                }`}>
                  {appointment.time}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">
                    {appointment.patient}
                  </h4>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(appointment.status)}
                    <span className="text-xs font-medium">
                      {getStatusText(appointment.status)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                  <span className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {appointment.age} años
                  </span>
                  <span>{appointment.type}</span>
                </div>
                
                <p className="text-sm text-gray-700 mb-3">
                  {appointment.notes}
                </p>
                
                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button className="flex items-center space-x-1 px-3 py-1 bg-primary-light text-primary rounded-full text-xs hover:bg-primary-light/80 transition-colors">
                    <FileText className="h-3 w-3" />
                    <span>Historial</span>
                  </button>
                  <button className="flex items-center space-x-1 px-3 py-1 bg-primary-light text-primary rounded-full text-xs hover:bg-primary-light/80 transition-colors">
                    <Phone className="h-3 w-3" />
                    <span>Llamar</span>
                  </button>
                  {appointment.status === 'siguiente' && (
                    <button className="px-3 py-1 bg-primary text-white rounded-full text-xs hover:bg-primary-hover transition-colors">
                      Iniciar consulta
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-green-600">
              {todayAppointments.filter(apt => apt.status === 'completada').length}
            </div>
            <div className="text-xs text-gray-600">Completadas</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">
              {todayAppointments.filter(apt => apt.status === 'en_progreso').length}
            </div>
            <div className="text-xs text-gray-600">En progreso</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-600">
              {todayAppointments.filter(apt => apt.status === 'siguiente').length}
            </div>
            <div className="text-xs text-gray-600">Siguiente</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-600">
              {todayAppointments.filter(apt => apt.status === 'programada').length}
            </div>
            <div className="text-xs text-gray-600">Programadas</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodaySchedule;