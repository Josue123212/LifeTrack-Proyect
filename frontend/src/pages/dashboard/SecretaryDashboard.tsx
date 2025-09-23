import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { Layout } from '../../components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { dashboardService } from '../../services/dashboardService';
import type { SecretaryDashboardStats } from '../../services/dashboardService';

const SecretaryDashboard: React.FC = () => {
  const { user } = useAuth();

  // 🔄 Obtener datos del dashboard desde la API
  const { 
    data: dashboardData, 
    isLoading, 
    error 
  } = useQuery<SecretaryDashboardStats>({
    queryKey: ['secretary-dashboard'],
    queryFn: () => dashboardService.getSecretaryDashboard(),
    refetchInterval: 30000, // Refrescar cada 30 segundos (más frecuente para secretaria)
    staleTime: 15000 // Considerar datos frescos por 15 segundos
  });

  // 🔄 Estados de carga
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
            <div className="h-96 bg-gray-200 rounded mt-6"></div>
          </div>
        </div>
      </Layout>
    );
  }

  // 🔄 Estado de error
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
    appointments_today: dashboardData.appointments_today?.total || 0,
    patients_waiting: dashboardData.appointments_today?.scheduled || 0,
    completed_today: dashboardData.appointments_today?.completed || 0,
    pending_confirmations: dashboardData.appointments_this_week?.pending_confirmation || 0
  } : {};

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            ¡Buenos días, {user?.first_name || 'Secretaria'}!
          </h1>
          <p className="text-gray-600 mt-2">Panel de gestión de citas y pacientes</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Citas Hoy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {mappedStats.appointments_today}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pacientes Esperando
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {mappedStats.patients_waiting}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Completadas Hoy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {mappedStats.completed_today}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pendientes Confirmar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {mappedStats.pending_confirmations}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Citas Pendientes de Confirmación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData?.pending_appointments && dashboardData.pending_appointments.length > 0 ? (
                dashboardData.pending_appointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{appointment.patient_name}</p>
                      <p className="text-sm text-gray-600">{appointment.doctor_name}</p>
                      <p className="text-xs text-gray-500">{appointment.reason}</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-900">{appointment.time}</p>
                      <p className="text-xs text-gray-500">{appointment.date}</p>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                      Pendiente
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-lg font-medium text-gray-600 mb-2">
                    No hay citas pendientes de confirmación
                  </div>
                  <div className="text-sm text-gray-500">
                    Las citas pendientes aparecerán aquí
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SecretaryDashboard;