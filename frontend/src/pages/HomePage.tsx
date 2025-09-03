import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

/**
 * 🏠 PÁGINA DE INICIO
 * 
 * Página principal del sistema de citas médicas.
 * Muestra información general y enlaces de navegación.
 */
const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                🏥 Sistema de Citas Médicas
              </h1>
            </div>
            <nav className="flex space-x-4">
              <Link to="/login">
                <Button variant="outline">Iniciar Sesión</Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="primary">Dashboard</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Bienvenido al Sistema de Citas Médicas
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Gestiona tus citas médicas de manera fácil y eficiente. 
            Nuestro sistema te permite agendar, modificar y hacer seguimiento 
            de todas tus consultas médicas.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                📅 <span className="ml-2">Agendar Citas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Programa tus citas médicas de forma rápida y sencilla. 
                Selecciona el doctor, fecha y hora que mejor te convenga.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                👨‍⚕️ <span className="ml-2">Doctores Especializados</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Accede a una amplia red de doctores especializados. 
                Encuentra el profesional adecuado para tus necesidades.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                📊 <span className="ml-2">Historial Médico</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Mantén un registro completo de tu historial médico. 
                Accede a tus consultas anteriores y resultados.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ¿Listo para comenzar?
            </h3>
            <p className="text-gray-600 mb-6">
              Únete a miles de usuarios que ya confían en nuestro sistema 
              para gestionar sus citas médicas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button variant="primary" size="lg">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="lg">
                  Ver Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-300">
              © 2024 Sistema de Citas Médicas. Desarrollado con React + Django.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;