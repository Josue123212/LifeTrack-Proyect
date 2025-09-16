import React from 'react';
import { Calendar, Users, UserCheck, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import StatsCard from './components/StatsCard';
import AppointmentsChart from './components/AppointmentsChart';
import RecentAppointments from './components/RecentAppointments';
import DoctorsList from './components/DoctorsList';

// 🎯 PROPUESTA 1: DASHBOARD ADMINISTRATIVO COMPLETO
// Enfoque: Panel de control integral para administradores del sistema
// Características: Métricas completas, gestión total, reportes avanzados

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Panel Administrativo
        </h1>
        <p className="text-gray-600">
          Gestión completa del sistema de citas médicas
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Citas Hoy"
          value="24"
          change="+12%"
          changeType="positive"
          icon={<Calendar className="h-6 w-6" />}
          color="blue"
        />
        <StatsCard
          title="Pacientes Activos"
          value="1,247"
          change="+5%"
          changeType="positive"
          icon={<Users className="h-6 w-6" />}
          color="green"
        />
        <StatsCard
          title="Doctores Disponibles"
          value="18"
          change="-2"
          changeType="negative"
          icon={<UserCheck className="h-6 w-6" />}
          color="purple"
        />
        <StatsCard
          title="Ingresos del Mes"
          value="$45,230"
          change="+18%"
          changeType="positive"
          icon={<TrendingUp className="h-6 w-6" />}
          color="orange"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Appointments Chart */}
        <div className="lg:col-span-2">
          <AppointmentsChart />
        </div>
        
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Acciones Rápidas
          </h3>
          <div className="space-y-3">
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Nueva Cita
            </button>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
              Registrar Paciente
            </button>
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
              Agregar Doctor
            </button>
            <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors">
              Generar Reporte
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <RecentAppointments />
        
        {/* Doctors List */}
        <DoctorsList />
      </div>

      {/* Alerts Section */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
          <h4 className="text-sm font-medium text-yellow-800">
            Alertas del Sistema
          </h4>
        </div>
        <ul className="mt-2 text-sm text-yellow-700 space-y-1">
          <li>• 3 citas pendientes de confirmación</li>
          <li>• Dr. García tiene sobrecarga de pacientes</li>
          <li>• Mantenimiento programado para el domingo</li>
        </ul>
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