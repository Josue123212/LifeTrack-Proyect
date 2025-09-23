import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import UnauthorizedPage from '../../pages/UnauthorizedPage';

/**
 * 🛡️ COMPONENTE DE RUTA PROTEGIDA
 * 
 * Protege rutas que requieren autenticación.
 * Redirige al login si el usuario no está autenticado.
 * 
 * TODO: Integrar con el contexto de autenticación real cuando esté disponible
 */

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
}



/**
 * Componente de ruta protegida
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Verificando autenticación...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Redirigir al login si no está autenticado
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Verificar roles si se especifican
  if (requiredRole && user && !requiredRole.includes(user.role)) {
    return <UnauthorizedPage />;
  }

  // Si todo está bien, renderizar el contenido protegido
  return <>{children}</>;
};

/**
 * 🔓 COMPONENTE DE RUTA PÚBLICA
 * 
 * Para rutas que solo deben ser accesibles cuando NO estás autenticado
 * (como login, register). Redirige al dashboard si ya estás autenticado.
 */
interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ 
  children, 
  redirectTo = '/dashboard' 
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Si está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Si no está autenticado, mostrar el contenido público
  return <>{children}</>;
};

/**
 * 🔧 UTILIDADES DE AUTENTICACIÓN SIMULADA
 * 
 * Funciones helper para manejar la autenticación simulada
 * TODO: Reemplazar con servicios de autenticación reales
 */
export const authUtils = {
  /**
   * Simula un login exitoso
   */
  login: (email: string, password: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simular login exitoso para cualquier credencial
        localStorage.setItem('demo_token', 'demo_jwt_token_123');
        localStorage.setItem('demo_user', JSON.stringify({
          id: '1',
          name: 'Usuario Demo',
          email: email,
          role: 'patient'
        }));
        resolve(true);
      }, 1000);
    });
  },

  /**
   * Simula un logout
   */
  logout: (): void => {
    localStorage.removeItem('demo_token');
    localStorage.removeItem('demo_user');
  },

  /**
   * Obtiene el usuario actual
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('demo_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('demo_token');
  }
};

export { ProtectedRoute, PublicRoute };
export default ProtectedRoute;