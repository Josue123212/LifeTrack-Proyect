import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import UnauthorizedPage from '@/pages/UnauthorizedPage';
import ClientDashboard from '@/pages/dashboard/ClientDashboard';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';

// Components
import { ProtectedRoute, PublicRoute } from '@/components/auth/ProtectedRoute';
import { useRoleRedirect } from '@/lib/hooks/useRoleRedirect';

// Test Components (para desarrollo)
import TestComponent from '@/components/TestComponent';
import UILibrariesTest from '@/components/UILibrariesTest';
import UIComponentsTest from '@/components/UIComponentsTest';
import ReactQueryTest from '@/components/ReactQueryTest';
import RoleTestComponent from '@/components/RoleTestComponent';

/**
 * 🚀 APLICACIÓN PRINCIPAL
 * 
 * Configuración del router principal con rutas protegidas y públicas.
 * Incluye páginas principales del sistema de citas médicas.
 * 
 * Características:
 * - Rutas protegidas por rol
 * - Redirección automática según permisos
 * - Manejo de acceso no autorizado
 */
function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

/**
 * Componente interno para manejar las rutas con hooks
 */
const AppRoutes: React.FC = () => {
  // Hook para redirección automática según rol
  useRoleRedirect();

  return (
    <div className="App">
      {/* Configuración de Rutas */}
      <Routes>
          {/* 🏠 RUTA PRINCIPAL - Página de inicio */}
          <Route path="/" element={<HomePage />} />
          
          {/* 🔐 RUTAS PÚBLICAS - Solo accesibles sin autenticación */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            } 
          />
          
          <Route 
            path="/forgot-password" 
            element={
              <PublicRoute>
                <ForgotPasswordPage />
              </PublicRoute>
            } 
          />
          
          <Route 
            path="/reset-password" 
            element={
              <PublicRoute>
                <ResetPasswordPage />
              </PublicRoute>
            } 
          />
          
          {/* 🛡️ RUTAS PROTEGIDAS - Requieren autenticación */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          
          {/* 🔐 RUTAS PROTEGIDAS POR ROL - SuperAdmin y Admin */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute requiredRole={['superadmin', 'admin']}>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute requiredRole={['superadmin']}>
                <div className="p-8">Gestión de Usuarios (Solo SuperAdmin)</div>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/doctors" 
            element={
              <ProtectedRoute requiredRole={['superadmin', 'admin']}>
                <div className="p-8">Gestión de Doctores</div>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/patients" 
            element={
              <ProtectedRoute requiredRole={['superadmin', 'admin']}>
                <div className="p-8">Gestión de Pacientes</div>
              </ProtectedRoute>
            } 
          />
          
          {/* 👨‍⚕️ RUTAS PARA DOCTORES */}
          <Route 
            path="/doctor/dashboard" 
            element={
              <ProtectedRoute requiredRole={['doctor']}>
                <div className="p-8">Dashboard del Doctor</div>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/doctor/appointments" 
            element={
              <ProtectedRoute requiredRole={['doctor']}>
                <div className="p-8">Citas del Doctor</div>
              </ProtectedRoute>
            } 
          />
          
          {/* 👩‍💼 RUTAS PARA SECRETARIAS */}
          <Route 
            path="/secretary/dashboard" 
            element={
              <ProtectedRoute requiredRole={['secretary']}>
                <div className="p-8">Dashboard de Secretaria</div>
              </ProtectedRoute>
            } 
          />
          
          {/* 👤 RUTAS PARA CLIENTES */}
          <Route 
            path="/client/dashboard" 
            element={
              <ProtectedRoute requiredRole={['client']}>
                <ClientDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/client/appointments" 
            element={
              <ProtectedRoute requiredRole={['client']}>
                <div className="p-8">Mis Citas</div>
              </ProtectedRoute>
            } 
          />
          
          {/* 🚫 PÁGINA DE ACCESO NO AUTORIZADO */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          
          {/* 🧪 RUTAS DE DESARROLLO - Para testing de componentes */}
          <Route 
            path="/dev" 
            element={
              <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                  <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                      🧪 Página de Desarrollo
                    </h1>
                    <p className="text-lg text-gray-600">
                      Componentes de prueba y desarrollo
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <TestComponent />
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <UILibrariesTest />
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <UIComponentsTest />
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <ReactQueryTest />
                    </div>
                  </div>
                </div>
              </div>
            } 
          />
          <Route path="/dev/roles" element={<RoleTestComponent />} />
          
          {/* 🔄 RUTA DE REDIRECCIÓN - Para rutas no encontradas */}
          <Route 
            path="*" 
            element={
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
                  <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                    Página no encontrada
                  </h2>
                  <p className="text-gray-600 mb-8">
                    La página que buscas no existe o ha sido movida.
                  </p>
                  <a 
                    href="/" 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    ← Volver al inicio
                  </a>
                </div>
              </div>
            } 
          />
        </Routes>
        
        {/* Toaster configurado en main.tsx */}
      </div>
    );
}

export default App
