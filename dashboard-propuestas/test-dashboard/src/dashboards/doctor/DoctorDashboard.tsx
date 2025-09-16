import React from 'react';
import { Calendar, Clock, Users, Bell, Stethoscope, FileText } from 'lucide-react';
import TodaySchedule from './components/TodaySchedule';
import PatientQuickAccess from './components/PatientQuickAccess';
import NotificationsPanel from './components/NotificationsPanel';
import QuickActions from './components/QuickActions';

// 🎯 PROPUESTA 2: DASHBOARD MÉDICO ESPECIALIZADO
// Enfoque: Panel optimizado para doctores en su práctica diaria
// Características: Agenda del día, acceso rápido a pacientes, productividad

const DoctorDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Buen día, Dr. Rodríguez
            </h1>
            <p className="text-gray-600 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Miércoles, 15 de Noviembre 2024
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">
                  14:30
                </span>
              </div>
            </div>
            <button className="relative p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">8</h3>
              <p className="text-sm text-gray-600">Citas hoy</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">24</h3>
              <p className="text-sm text-gray-600">Pacientes activos</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg mr-4">
              <Stethoscope className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">6</h3>
              <p className="text-sm text-gray-600">Completadas</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg mr-4">
              <FileText className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">3</h3>
              <p className="text-sm text-gray-600">Pendientes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Today's Schedule - Takes 2 columns */}
        <div className="lg:col-span-2">
          <TodaySchedule />
        </div>
        
        {/* Quick Actions */}
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Quick Access */}
        <PatientQuickAccess />
        
        {/* Notifications */}
        <NotificationsPanel />
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-colors">
        <FileText className="h-6 w-6" />
      </button>
    </div>
  );
};

export default DoctorDashboard;

// 💡 CARACTERÍSTICAS PRINCIPALES:
// ✅ Saludo personalizado con fecha y hora
// ✅ Vista optimizada de agenda del día
// ✅ Acceso rápido a historiales de pacientes
// ✅ Panel de notificaciones médicas
// ✅ Acciones rápidas para consultas
// ✅ Diseño limpio y enfocado en productividad
// ✅ Colores suaves y profesionales
// ✅ Botón flotante para notas rápidas