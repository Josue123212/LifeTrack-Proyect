import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';

// Components
import { ProtectedRoute, PublicRoute } from '@/components/auth/ProtectedRoute';

// Test Components (para desarrollo)
import TestComponent from '@/components/TestComponent';
import UILibrariesTest from '@/components/UILibrariesTest';
import UIComponentsTest from '@/components/UIComponentsTest';
import ReactQueryTest from '@/components/ReactQueryTest';

/**
 * 🚀 APLICACIÓN PRINCIPAL
 * 
 * Configuración del router principal con rutas protegidas y públicas.
 * Incluye páginas principales del sistema de citas médicas.
 */
function App() {
  return (
    <BrowserRouter>
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
          
          {/* 🛡️ RUTAS PROTEGIDAS - Requieren autenticación */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          
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
    </BrowserRouter>
  );
}

export default App
