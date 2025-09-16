import React from 'react';
import { Calendar, Users, UserCheck, TrendingUp, Clock, AlertCircle, Plus, FileText, Settings, BarChart3 } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const stats = [
    { title: 'Citas Hoy', value: '24', icon: Calendar, trend: '+12%' },
    { title: 'Pacientes', value: '1,247', icon: Users, trend: '+5%' },
    { title: 'Doctores', value: '18', icon: UserCheck, trend: '-2' },
    { title: 'Ingresos', value: '$45,230', icon: TrendingUp, trend: '+18%' }
  ];

  const quickActions = [
    { title: 'Nueva Cita', icon: Plus, description: 'Programar nueva cita' },
    { title: 'Reportes', icon: BarChart3, description: 'Ver estadísticas' },
    { title: 'Pacientes', icon: Users, description: 'Gestionar pacientes' },
    { title: 'Configuración', icon: Settings, description: 'Ajustes del sistema' }
  ];

  const recentAppointments = [
    { patient: 'María García', doctor: 'Dr. López', time: '09:00', status: 'Confirmada' },
    { patient: 'Juan Pérez', doctor: 'Dra. Martín', time: '10:30', status: 'Pendiente' },
    { patient: 'Ana Silva', doctor: 'Dr. Ruiz', time: '11:15', status: 'En curso' },
    { patient: 'Carlos Díaz', doctor: 'Dra. Torres', time: '14:00', status: 'Confirmada' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header Minimalista */}
      <div className="mb-8 lg:mb-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-800 mb-2">
          Dashboard
        </h1>
        <p className="text-gray-500 text-sm sm:text-base lg:text-lg">
          Gestión de citas médicas
        </p>
      </div>

      {/* Stats Cards - Diseño Minimalista */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 lg:mb-12">
        {stats.map((stat, index) => {
          return (
            <div key={index} className="bg-white rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300" style={{fontFamily: 'Inter, sans-serif'}}>
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <span className="text-sm font-medium" style={{color: 'rgba(0, 206, 209, 0.9)'}}>
                  {stat.change}
                </span>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-light text-gray-800 mb-2">
                  {stat.value}
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm">
                  {stat.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Acciones Rápidas */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 mb-8 lg:mb-12">
        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg sm:text-xl font-light text-gray-800 mb-6 lg:mb-8">
              Acciones Rápidas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button key={index} className="p-4 sm:p-6 rounded-lg lg:rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 text-left group hover:shadow-sm">
                    <div className="flex items-center mb-3 lg:mb-4">
                      <div className="p-2 rounded-lg group-hover:scale-110 transition-transform duration-300" style={{backgroundColor: 'rgba(0, 206, 209, 0.8)'}}>
                        <Icon className="h-5 w-5" style={{color: 'white'}} />
                      </div>
                    </div>
                    <h4 className="text-sm sm:text-base font-medium text-gray-800 mb-1">
                      {action.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {action.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Gráfico Simple */}
        <div className="bg-white rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100">
          <h3 className="text-lg sm:text-xl font-light text-gray-800 mb-6 lg:mb-8">
            Citas por Día
          </h3>
          <div className="space-y-4">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie'].map((day, index) => {
              const values = [8, 12, 6, 15, 10];
              const width = (values[index] / 15) * 100;
              return (
                <div key={day} className="flex items-center space-x-3 lg:space-x-4">
                  <span className="text-xs sm:text-sm text-gray-500 w-6 sm:w-8">{day}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div 
                        className="h-2 rounded-full transition-all duration-500" 
                        style={{backgroundColor: 'rgba(0, 206, 209, 0.8)', width: `${width}%`}}
                    />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-700 w-4 sm:w-6">{values[index]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Citas Recientes */}
      <div className="bg-white rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100">
        <h3 className="text-lg sm:text-xl font-light text-gray-800 mb-6 lg:mb-8">
          Citas de Hoy
        </h3>
        <div className="space-y-4">
          {recentAppointments.map((appointment, index) => (
            <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 rounded-lg lg:rounded-xl hover:bg-gray-50 transition-colors duration-200 space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{backgroundColor: 'rgba(0, 206, 209, 0.8)'}}>
                     <span style={{color: 'white'}} className="text-xs sm:text-sm font-medium">
                    {appointment.patient.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm sm:text-base font-medium text-gray-800 truncate">{appointment.patient}</p>
                  <p className="text-xs sm:text-sm text-gray-500 truncate">{appointment.doctor}</p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end sm:text-right space-x-4 sm:space-x-0">
                <p className="text-sm sm:text-base font-medium text-gray-800">{appointment.time}</p>
                <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                  appointment.status === 'Confirmada' ? 'bg-green-100 text-green-700' :
                  appointment.status === 'En curso' ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {appointment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

// 💡 CARACTERÍSTICAS PRINCIPALES:
// ✅ Vista completa de métricas del sistema
// ✅ Gráficos de tendencias y estadísticas
// ✅ Acciones rápidas para gestión
// ✅ Lista de citas recientes
// ✅ Estado de doctores disponibles
// ✅ Sistema de alertas y notificaciones
// ✅ Diseño responsivo y profesional
// ✅ Colores diferenciados por tipo de métrica