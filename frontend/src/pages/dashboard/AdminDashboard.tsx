import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '../../components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { dashboardService } from '../../services/dashboardService';
import type { AdminDashboardStats } from '../../services/dashboardService';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  // 🔄 Obtener datos del dashboard desde la API
  const { 
    data: dashboardData, 
    isLoading, 
    error 
  } = useQuery<AdminDashboardStats>({
    queryKey: ['admin-dashboard'],
    queryFn: () => dashboardService.getAdminDashboard(),
    refetchInterval: 30000, // Refrescar cada 30 segundos
    staleTime: 10000 // Considerar datos frescos por 10 segundos
  });

  // 🔄 Estados de carga y error
  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-medium">Error al cargar el dashboard</h3>
            <p className="text-red-600 text-sm mt-1">
              {error instanceof Error ? error.message : 'Error desconocido'}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // 🔄 Mapear datos del backend a la estructura esperada por el frontend
  const mappedStats = dashboardData ? {
    total_users: dashboardData.total_users || 0,
    total_doctors: dashboardData.total_doctors || 0,
    total_patients: dashboardData.total_patients || 0,
    appointments_today: dashboardData.appointments_today || 0,
    appointments_this_month: dashboardData.appointments_this_month || 0,
    new_registrations_today: dashboardData.new_registrations_today || 0,
    completion_rate: dashboardData.completion_rate || 0
  } : {};

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            ¡Bienvenido, {user?.first_name || 'Administrador'}!
          </h1>
          <p className="text-gray-600 mt-2">Panel de administración del sistema</p>
          <p className="text-xs text-gray-500 mt-1">
            Última actualización: {new Date().toLocaleString()}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Usuarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {mappedStats.total_users?.toLocaleString() || '0'}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Nuevos hoy: {mappedStats.new_registrations_today || 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Doctores Activos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {mappedStats.total_doctors || '0'}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Pacientes: {mappedStats.total_patients || 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Citas Este Mes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {mappedStats.appointments_this_month?.toLocaleString() || '0'}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Hoy: {mappedStats.appointments_today || 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Tasa de Completitud
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                mappedStats.completion_rate >= 90 ? 'text-emerald-600' :
                mappedStats.completion_rate >= 70 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {mappedStats.completion_rate}%
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Citas completadas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Tasa de Completitud
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-green-600">
                {dashboardData?.completion_rate || 0}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Tasa de Cancelación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-red-600">
                {dashboardData?.cancellation_rate || 0}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Tasa de No Show
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-orange-600">
                {dashboardData?.no_show_rate || 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Doctors */}
        {dashboardData?.top_doctors?.length && (
          <Card>
            <CardHeader>
              <CardTitle>Doctores Destacados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.top_doctors.slice(0, 5).map((doctor) => (
                  <div key={doctor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{doctor.name}</p>
                      <p className="text-sm text-gray-600">{doctor.specialization}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {doctor.total_appointments} citas totales
                      </p>
                      <p className="text-xs text-gray-500">
                        {doctor.appointments_completed} completadas
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;