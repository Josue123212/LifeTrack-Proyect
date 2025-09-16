import React from 'react';
import { Plus, FileText, Calendar, Users, Stethoscope, Pill, Phone, Mail } from 'lucide-react';

const QuickActions: React.FC = () => {
  const actions = [
    {
      id: 1,
      title: 'Nueva Cita',
      description: 'Programar consulta',
      icon: <Plus className="h-6 w-6" />,
      color: 'bg-blue-500 hover:bg-blue-600',
      textColor: 'text-white'
    },
    {
      id: 2,
      title: 'Crear Receta',
      description: 'Prescripción médica',
      icon: <Pill className="h-6 w-6" />,
      color: 'bg-green-500 hover:bg-green-600',
      textColor: 'text-white'
    },
    {
      id: 3,
      title: 'Nota Médica',
      description: 'Agregar observación',
      icon: <FileText className="h-6 w-6" />,
      color: 'bg-purple-500 hover:bg-purple-600',
      textColor: 'text-white'
    },
    {
      id: 4,
      title: 'Ver Agenda',
      description: 'Calendario completo',
      icon: <Calendar className="h-6 w-6" />,
      color: 'bg-orange-500 hover:bg-orange-600',
      textColor: 'text-white'
    },
    {
      id: 5,
      title: 'Buscar Paciente',
      description: 'Historial médico',
      icon: <Users className="h-6 w-6" />,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      textColor: 'text-white'
    },
    {
      id: 6,
      title: 'Examen Físico',
      description: 'Registro de signos',
      icon: <Stethoscope className="h-6 w-6" />,
      color: 'bg-teal-500 hover:bg-teal-600',
      textColor: 'text-white'
    }
  ];

  const emergencyActions = [
    {
      id: 1,
      title: 'Llamada Urgente',
      icon: <Phone className="h-5 w-5" />,
      color: 'bg-red-100 hover:bg-red-200',
      textColor: 'text-red-700'
    },
    {
      id: 2,
      title: 'Consulta Virtual',
      icon: <Mail className="h-5 w-5" />,
      color: 'bg-blue-100 hover:bg-blue-200',
      textColor: 'text-blue-700'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Acciones Rápidas
          </h3>
          <p className="text-sm text-gray-600">
            Herramientas frecuentes
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <button
              key={action.id}
              className={`p-4 rounded-lg transition-all duration-200 transform hover:scale-105 ${action.color} ${action.textColor} group`}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="p-2 bg-white bg-opacity-20 rounded-lg group-hover:bg-opacity-30 transition-all">
                  {action.icon}
                </div>
                <div>
                  <h4 className="font-medium text-sm">
                    {action.title}
                  </h4>
                  <p className="text-xs opacity-90">
                    {action.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Emergency Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Acceso Rápido
          </h3>
          <p className="text-sm text-gray-600">
            Comunicación directa
          </p>
        </div>

        <div className="space-y-3">
          {emergencyActions.map((action) => (
            <button
              key={action.id}
              className={`w-full p-3 rounded-lg transition-all ${action.color} ${action.textColor} flex items-center space-x-3`}
            >
              {action.icon}
              <span className="font-medium text-sm">
                {action.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Today's Summary */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-sm p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">
          Resumen del Día
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm opacity-90">Citas completadas:</span>
            <span className="font-bold">6/8</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm opacity-90">Tiempo promedio:</span>
            <span className="font-bold">25 min</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm opacity-90">Próxima cita:</span>
            <span className="font-bold">10:30</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-white border-opacity-20">
          <div className="flex items-center justify-between">
            <span className="text-sm opacity-90">Progreso del día:</span>
            <span className="font-bold">75%</span>
          </div>
          <div className="mt-2 bg-white bg-opacity-20 rounded-full h-2">
            <div className="bg-white rounded-full h-2 w-3/4 transition-all duration-300"></div>
          </div>
        </div>
      </div>

      {/* Quick Notes */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Notas Rápidas
        </h3>
        
        <textarea
          placeholder="Agregar nota del día..."
          className="w-full h-24 p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        ></textarea>
        
        <button className="mt-3 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors text-sm font-medium">
          Guardar Nota
        </button>
      </div>
    </div>
  );
};

export default QuickActions;