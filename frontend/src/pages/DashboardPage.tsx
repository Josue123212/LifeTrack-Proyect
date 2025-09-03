import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';

/**
 * 📊 PÁGINA DE DASHBOARD
 * 
 * Panel principal del usuario después del login.
 * Muestra resumen de citas, acciones rápidas y navegación.
 */
const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  /**
   * Maneja el logout del usuario
   */
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  /**
   * Datos de demostración para el dashboard
   */
  const mockData = {
    user: {
      name: 'Juan Pérez',
      email: 'juan@example.com',
      role: 'Paciente'
    },
    stats: {
      totalAppointments: 12,
      upcomingAppointments: 2,
      completedAppointments: 8,
      cancelledAppointments: 2
    },
    upcomingAppointments: [
      {
        id: 1,
        doctor: 'Dr. María González',
        specialty: 'Cardiología',
        date: '2024-01-25',
        time: '10:00 AM',
        status: 'Confirmada'
      },
      {
        id: 2,
        doctor: 'Dr. Carlos Rodríguez',
        specialty: 'Dermatología',
        date: '2024-01-28',
        time: '2:30 PM',
        status: 'Pendiente'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                🏥 Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Bienvenido, {mockData.user.name}
              </span>
              <Button variant="outline" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Hola, {mockData.user.name}! 👋
          </h2>
          <p className="text-gray-600">
            Aquí tienes un resumen de tus citas médicas y acciones disponibles.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-2xl">📅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Citas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockData.stats.totalAppointments}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-2xl">⏰</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Próximas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockData.stats.upcomingAppointments}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completadas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockData.stats.completedAppointments}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <span className="text-2xl">❌</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Canceladas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockData.stats.cancelledAppointments}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  📋 <span className="ml-2">Próximas Citas</span>
                </span>
                <Button variant="outline" size="sm">
                  Ver todas
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockData.upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {appointment.doctor}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {appointment.specialty}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {appointment.date} a las {appointment.time}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          appointment.status === 'Confirmada'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                ⚡ <span className="ml-2">Acciones Rápidas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full justify-start"
                  onClick={() => toast.success('Función en desarrollo')}
                >
                  📅 <span className="ml-2">Agendar Nueva Cita</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full justify-start"
                  onClick={() => toast.success('Función en desarrollo')}
                >
                  👨‍⚕️ <span className="ml-2">Ver Doctores Disponibles</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full justify-start"
                  onClick={() => toast.success('Función en desarrollo')}
                >
                  📊 <span className="ml-2">Mi Historial Médico</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full justify-start"
                  onClick={() => toast.success('Función en desarrollo')}
                >
                  ⚙️ <span className="ml-2">Configurar Perfil</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Links */}
        <div className="mt-8 text-center">
          <div className="inline-flex space-x-4">
            <Link to="/">
              <Button variant="ghost">
                ← Volver al inicio
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="ghost">
                🔐 Página de Login
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;