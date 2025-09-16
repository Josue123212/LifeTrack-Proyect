import React from 'react';
import { UserCheck, Phone, Mail, Clock, Star } from 'lucide-react';

// Datos de ejemplo para doctores
const doctors = [
  {
    id: 1,
    name: 'Dr. Carlos Rodríguez',
    specialty: 'Cardiología',
    status: 'disponible',
    nextAppointment: '10:30',
    rating: 4.8,
    patients: 12,
    phone: '+1 234-567-8901',
    email: 'c.rodriguez@hospital.com'
  },
  {
    id: 2,
    name: 'Dra. María López',
    specialty: 'Neurología',
    status: 'ocupado',
    nextAppointment: '11:00',
    rating: 4.9,
    patients: 8,
    phone: '+1 234-567-8902',
    email: 'm.lopez@hospital.com'
  },
  {
    id: 3,
    name: 'Dr. Antonio García',
    specialty: 'Dermatología',
    status: 'disponible',
    nextAppointment: '14:00',
    rating: 4.7,
    patients: 15,
    phone: '+1 234-567-8903',
    email: 'a.garcia@hospital.com'
  },
  {
    id: 4,
    name: 'Dra. Elena Ruiz',
    specialty: 'Pediatría',
    status: 'descanso',
    nextAppointment: '15:30',
    rating: 4.9,
    patients: 6,
    phone: '+1 234-567-8904',
    email: 'e.ruiz@hospital.com'
  }
];

const DoctorsList: React.FC = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponible':
        return 'bg-green-100 text-green-800';
      case 'ocupado':
        return 'bg-red-100 text-red-800';
      case 'descanso':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'disponible':
        return 'Disponible';
      case 'ocupado':
        return 'Ocupado';
      case 'descanso':
        return 'En descanso';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'disponible':
        return '🟢';
      case 'ocupado':
        return '🔴';
      case 'descanso':
        return '🟡';
      default:
        return '⚪';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Estado de Doctores
          </h3>
          <p className="text-sm text-gray-600">
            Disponibilidad y próximas citas
          </p>
        </div>
        <UserCheck className="h-6 w-6 text-gray-400" />
      </div>

      {/* Doctors List */}
      <div className="space-y-4">
        {doctors.map((doctor) => (
          <div 
            key={doctor.id} 
            className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            {/* Doctor Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {doctor.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {doctor.specialty}
                  </p>
                </div>
              </div>
              
              {/* Status Badge */}
              <div className="flex items-center space-x-2">
                <span className="text-sm">{getStatusIcon(doctor.status)}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doctor.status)}`}>
                  {getStatusText(doctor.status)}
                </span>
              </div>
            </div>

            {/* Doctor Info Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              {/* Next Appointment */}
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Próxima:</span>
                <span className="font-medium text-gray-900">
                  {doctor.nextAppointment}
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="font-medium text-gray-900">
                  {doctor.rating}
                </span>
                <span className="text-gray-600">rating</span>
              </div>

              {/* Patients Today */}
              <div className="flex items-center space-x-2">
                <UserCheck className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Pacientes hoy:</span>
                <span className="font-medium text-gray-900">
                  {doctor.patients}
                </span>
              </div>

              {/* Contact Actions */}
              <div className="flex items-center space-x-2">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Phone className="h-4 w-4 text-gray-400 hover:text-blue-600" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Mail className="h-4 w-4 text-gray-400 hover:text-blue-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-green-600">12</div>
            <div className="text-xs text-gray-600">Disponibles</div>
          </div>
          <div>
            <div className="text-lg font-bold text-red-600">4</div>
            <div className="text-xs text-gray-600">Ocupados</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-600">2</div>
            <div className="text-xs text-gray-600">En descanso</div>
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="mt-4">
        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
          Ver todos los doctores →
        </button>
      </div>
    </div>
  );
};

export default DoctorsList;