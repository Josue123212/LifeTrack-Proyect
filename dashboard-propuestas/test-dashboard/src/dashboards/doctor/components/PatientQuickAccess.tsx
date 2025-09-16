import React, { useState } from 'react';
import { Search, User, FileText, Clock, Heart, AlertTriangle } from 'lucide-react';

// Datos de ejemplo para pacientes recientes
const recentPatients = [
  {
    id: 1,
    name: 'María González',
    age: 45,
    lastVisit: '2024-11-10',
    condition: 'Hipertensión',
    priority: 'alta',
    nextAppointment: '2024-11-20',
    avatar: 'MG'
  },
  {
    id: 2,
    name: 'Carlos Mendoza',
    age: 32,
    lastVisit: '2024-11-12',
    condition: 'Chequeo rutina',
    priority: 'normal',
    nextAppointment: '2024-12-12',
    avatar: 'CM'
  },
  {
    id: 3,
    name: 'Ana Martínez',
    age: 28,
    lastVisit: '2024-11-14',
    condition: 'Seguimiento',
    priority: 'normal',
    nextAppointment: '2024-11-25',
    avatar: 'AM'
  },
  {
    id: 4,
    name: 'Luis Herrera',
    age: 55,
    lastVisit: '2024-11-08',
    condition: 'Diabetes tipo 2',
    priority: 'alta',
    nextAppointment: '2024-11-18',
    avatar: 'LH'
  },
  {
    id: 5,
    name: 'Sofia Vargas',
    age: 38,
    lastVisit: '2024-11-13',
    condition: 'Evaluación cardiológica',
    priority: 'media',
    nextAppointment: '2024-11-22',
    avatar: 'SV'
  }
];

const PatientQuickAccess: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);

  const filteredPatients = recentPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'media':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'normal':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'alta':
        return <AlertTriangle className="h-4 w-4" />;
      case 'media':
        return <Clock className="h-4 w-4" />;
      case 'normal':
        return <Heart className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  const getDaysUntilAppointment = (dateString: string) => {
    const today = new Date();
    const appointmentDate = new Date(dateString);
    const diffTime = appointmentDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Acceso Rápido a Pacientes
          </h3>
          <p className="text-sm text-gray-600">
            Historiales y próximas citas
          </p>
        </div>
        <User className="h-6 w-6 text-gray-400" />
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar paciente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Patients List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredPatients.map((patient) => {
          const daysUntil = getDaysUntilAppointment(patient.nextAppointment);
          
          return (
            <div
              key={patient.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                selectedPatient === patient.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => setSelectedPatient(selectedPatient === patient.id ? null : patient.id)}
            >
              {/* Patient Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {patient.avatar}
                  </div>
                  
                  {/* Patient Info */}
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {patient.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {patient.age} años • {patient.condition}
                    </p>
                  </div>
                </div>
                
                {/* Priority Badge */}
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getPriorityColor(patient.priority)}`}>
                  {getPriorityIcon(patient.priority)}
                  <span className="capitalize">{patient.priority}</span>
                </div>
              </div>

              {/* Patient Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Última visita:</span>
                  <div className="font-medium text-gray-900">
                    {formatDate(patient.lastVisit)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Próxima cita:</span>
                  <div className={`font-medium ${
                    daysUntil <= 3 ? 'text-red-600' : 
                    daysUntil <= 7 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {daysUntil === 0 ? 'Hoy' : 
                     daysUntil === 1 ? 'Mañana' : 
                     `En ${daysUntil} días`}
                  </div>
                </div>
              </div>

              {/* Expanded Actions */}
              {selectedPatient === patient.id && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex space-x-2">
                    <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <FileText className="h-4 w-4" />
                      <span>Ver Historial</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      <Clock className="h-4 w-4" />
                      <span>Nueva Cita</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-red-600">
              {recentPatients.filter(p => p.priority === 'alta').length}
            </div>
            <div className="text-xs text-gray-600">Alta prioridad</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-600">
              {recentPatients.filter(p => getDaysUntilAppointment(p.nextAppointment) <= 7).length}
            </div>
            <div className="text-xs text-gray-600">Esta semana</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">
              {recentPatients.length}
            </div>
            <div className="text-xs text-gray-600">Total activos</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4">
        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
          Ver todos los pacientes →
        </button>
      </div>
    </div>
  );
};

export default PatientQuickAccess;