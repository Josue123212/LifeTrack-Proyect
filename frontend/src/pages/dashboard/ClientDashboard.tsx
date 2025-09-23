import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Layout } from '../../components/layout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { dashboardService } from '../../services/dashboardService';
import type { ClientDashboardStats } from '../../services/dashboardService';


const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 🔄 Obtener datos del dashboard desde la API
  const { 
    data: dashboardData, 
    isLoading, 
    error 
  } = useQuery<ClientDashboardStats>({
    queryKey: ['client-dashboard'],
    queryFn: () => dashboardService.getClientDashboard(),
    refetchInterval: 60000, // Refrescar cada minuto
    staleTime: 30000 // Considerar datos frescos por 30 segundos
  });

  // 🔄 Estados de carga
  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6 lg:space-y-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-8">
              <div className="lg:col-span-2 h-96 bg-gray-200 rounded"></div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
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

  return (
    <Layout>
      <div className="space-y-6 lg:space-y-8">

        
        {/* Welcome Section */}
        <div 
          className="rounded-xl lg:rounded-2xl shadow-sm border p-6 lg:p-8"
          style={{ 
            backgroundColor: 'var(--surface)', 
            borderColor: 'var(--border)' 
          }}
        >
          <h1 
            className="text-2xl lg:text-3xl font-light mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            Bienvenido, {user?.first_name || 'Cliente'}
          </h1>
          <p 
            className="text-base lg:text-lg"
            style={{ color: 'var(--text-secondary)' }}
          >
            Gestiona tus citas médicas desde tu panel personal
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {/* Próxima Cita */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Próxima Cita</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData?.upcoming_appointments && dashboardData.upcoming_appointments.length > 0 ? (
                    <>
                      <div 
                        className="text-xl lg:text-2xl font-semibold"
                        style={{ color: 'var(--primary)' }}
                      >
                        {dashboardData.upcoming_appointments[0].date} - {dashboardData.upcoming_appointments[0].time}
                      </div>
                      <div 
                        className="text-base lg:text-lg"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {dashboardData.upcoming_appointments[0].doctor_name}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={{ 
                            backgroundColor: dashboardData.upcoming_appointments[0].status === 'confirmed' 
                              ? 'var(--success-light)' 
                              : 'var(--warning-light)', 
                            color: dashboardData.upcoming_appointments[0].status === 'confirmed' 
                              ? 'var(--success)' 
                              : 'var(--warning)' 
                          }}
                        >
                          {dashboardData.upcoming_appointments[0].status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <div 
                        className="text-lg"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        No tienes citas programadas
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Total Citas */}
          <Card>
            <CardHeader>
              <CardTitle>Total Citas</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="text-3xl lg:text-4xl font-light mb-2"
                style={{ color: 'var(--success)' }}
              >
                {dashboardData?.appointments?.total || 0}
              </div>
              <div 
                className="text-sm lg:text-base"
                style={{ color: 'var(--text-secondary)' }}
              >
                Citas programadas
              </div>
            </CardContent>
          </Card>

          {/* Citas Próximas */}
          <Card>
            <CardHeader>
              <CardTitle>Próximas</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="text-3xl lg:text-4xl font-light mb-2"
                style={{ color: 'var(--primary)' }}
              >
{dashboardData?.appointments?.upcoming || 0}
              </div>
              <div 
                className="text-sm lg:text-base"
                style={{ color: 'var(--text-secondary)' }}
              >
                Este mes
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Lista de Citas - Ocupa 2 columnas en pantallas grandes */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Mis Citas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData?.upcoming_appointments && dashboardData.upcoming_appointments.length > 0 ? (
                    dashboardData.upcoming_appointments.map(appointment => (
                      <div 
                        key={appointment.id} 
                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 lg:p-6 rounded-xl transition-all duration-200 hover:shadow-md"
                        style={{ 
                          backgroundColor: 'var(--primary-light)',
                          border: '1px solid var(--border)'
                        }}
                      >
                        <div className="space-y-2 sm:space-y-1">
                          <div 
                            className="font-medium text-lg"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            {appointment.doctor_name}
                          </div>
                          <div 
                            className="text-sm lg:text-base"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            {appointment.date} a las {appointment.time}
                          </div>
                          {appointment.specialization && (
                            <div 
                              className="text-xs"
                              style={{ color: 'var(--text-secondary)' }}
                            >
                              {appointment.specialization}
                            </div>
                          )}
                        </div>
                        <div className="mt-3 sm:mt-0">
                          <span 
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              appointment.status === 'confirmed' 
                                ? 'text-green-700' 
                                : 'text-yellow-700'
                            }`}
                            style={{ 
                              backgroundColor: appointment.status === 'confirmed' 
                                ? 'var(--success-light)' 
                                : 'var(--warning-light)',
                              color: appointment.status === 'confirmed' 
                                ? 'var(--success)' 
                                : 'var(--warning)'
                            }}
                          >
                            {appointment.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div 
                        className="text-lg font-medium mb-2"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        No tienes citas programadas
                      </div>
                      <div 
                        className="text-sm"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        Programa tu primera cita médica
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Acciones Rápidas */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <button 
                    className="w-full p-4 rounded-xl text-left transition-all duration-200 hover:shadow-md"
                    style={{ 
                      backgroundColor: 'var(--primary)',
                      color: 'white'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div className="font-medium">Nueva Cita</div>
                    <div className="text-sm opacity-90">Programar una nueva cita médica</div>
                  </button>
                  
                  <button 
                    className="w-full p-4 rounded-xl text-left transition-all duration-200 hover:shadow-md"
                    style={{ 
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)'
                    }}
                    onClick={() => navigate('/client/profile')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--primary-light)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--surface)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div className="font-medium">Mi Perfil</div>
                    <div 
                      className="text-sm"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Actualizar información personal
                    </div>
                  </button>
                  
                  <button 
                    className="w-full p-4 rounded-xl text-left transition-all duration-200 hover:shadow-md"
                    style={{ 
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)'
                    }}
                    onClick={() => navigate('/client/medical-history')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--primary-light)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--surface)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div className="font-medium">Historial Médico</div>
                    <div 
                      className="text-sm"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Ver historial de citas anteriores
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ClientDashboard;