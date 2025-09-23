import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * 🔄 HOOK DE REDIRECCIÓN POR ROL
 * 
 * Hook personalizado que maneja la redirección automática
 * de usuarios según su rol después del login.
 * 
 * Características:
 * - Redirección automática según rol
 * - Preserva la URL de destino original si existe
 * - Maneja casos especiales para diferentes roles
 */

interface RoleRedirectConfig {
  /** Ruta por defecto para cada rol */
  defaultRoutes: Record<string, string>;
  /** Rutas permitidas para cada rol */
  allowedRoutes: Record<string, string[]>;
}

const defaultConfig: RoleRedirectConfig = {
  defaultRoutes: {
    superadmin: '/admin/dashboard',
    admin: '/admin/dashboard',
    doctor: '/doctor/dashboard',
    secretary: '/secretary/dashboard',
    client: '/client/dashboard',
  },
  allowedRoutes: {
    superadmin: [
      '/admin/dashboard',
      '/admin/users',
      '/admin/doctors',
      '/admin/patients',
      '/admin/appointments',
      '/admin/reports',
      '/admin/settings',
      '/profile',
    ],
    admin: [
      '/admin/dashboard',
      '/admin/doctors',
      '/admin/patients',
      '/admin/appointments',
      '/admin/reports',
      '/profile',
    ],
    doctor: [
      '/doctor/dashboard',
      '/doctor/appointments',
      '/doctor/patients',
      '/doctor/schedule',
      '/profile',
    ],
    secretary: [
      '/secretary/dashboard',
      '/secretary/appointments',
      '/secretary/patients',
      '/secretary/calendar',
      '/profile',
    ],
    client: [
      '/client/dashboard',
      '/client/appointments',
      '/client/book-appointment',
      '/client/profile',
      '/client/medical-history',
    ],
  },
};

/**
 * Hook para redirección automática según rol
 */
export const useRoleRedirect = (config: RoleRedirectConfig = defaultConfig) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // No hacer nada si está cargando o no está autenticado
    if (isLoading || !isAuthenticated || !user) {
      return;
    }

    const userRole = user.role;
    const currentPath = location.pathname;
    
    // Obtener la URL de destino desde el state (si viene de login)
    const intendedDestination = location.state?.from?.pathname;

    // Si hay una URL de destino y el usuario tiene permisos para acceder
    if (intendedDestination && isRouteAllowed(userRole, intendedDestination, config)) {
      navigate(intendedDestination, { replace: true });
      return;
    }

    // Si está en la raíz o en una ruta no permitida, redirigir a la ruta por defecto
    if (currentPath === '/' || !isRouteAllowed(userRole, currentPath, config)) {
      const defaultRoute = getDefaultRoute(userRole, config);
      navigate(defaultRoute, { replace: true });
    }
  }, [user, isAuthenticated, isLoading, location, navigate, config]);

  return {
    getDefaultRoute: (role: string) => getDefaultRoute(role, config),
    isRouteAllowed: (role: string, path: string) => isRouteAllowed(role, path, config),
    getAllowedRoutes: (role: string) => getAllowedRoutes(role, config),
  };
};

/**
 * Obtiene la ruta por defecto para un rol específico
 */
export const getDefaultRoute = (role: string, config: RoleRedirectConfig = defaultConfig): string => {
  return config.defaultRoutes[role] || '/dashboard';
};

/**
 * Verifica si una ruta está permitida para un rol específico
 */
export const isRouteAllowed = (
  role: string, 
  path: string, 
  config: RoleRedirectConfig = defaultConfig
): boolean => {
  const allowedRoutes = config.allowedRoutes[role] || [];
  
  // Verificar coincidencia exacta
  if (allowedRoutes.includes(path)) {
    return true;
  }
  
  // Verificar coincidencia de prefijo (para rutas dinámicas)
  return allowedRoutes.some(route => {
    // Si la ruta termina con /*, verificar prefijo
    if (route.endsWith('/*')) {
      const prefix = route.slice(0, -2);
      return path.startsWith(prefix);
    }
    
    // Verificar rutas con parámetros dinámicos
    if (route.includes(':')) {
      const routePattern = route.replace(/:[^/]+/g, '[^/]+');
      const regex = new RegExp(`^${routePattern}$`);
      return regex.test(path);
    }
    
    return false;
  });
};

/**
 * Obtiene todas las rutas permitidas para un rol
 */
export const getAllowedRoutes = (
  role: string, 
  config: RoleRedirectConfig = defaultConfig
): string[] => {
  return config.allowedRoutes[role] || [];
};

/**
 * Hook simplificado para obtener la ruta de redirección después del login
 */
export const useLoginRedirect = () => {
  const { user } = useAuth();
  
  const getRedirectPath = (): string => {
    if (!user) return '/login';
    return getDefaultRoute(user.role);
  };
  
  return { getRedirectPath };
};

/**
 * Utilidad para verificar permisos de ruta en componentes
 */
export const useRoutePermissions = () => {
  const { user } = useAuth();
  
  const canAccessRoute = (path: string): boolean => {
    if (!user) return false;
    return isRouteAllowed(user.role, path);
  };
  
  const getAccessibleRoutes = (): string[] => {
    if (!user) return [];
    return getAllowedRoutes(user.role);
  };
  
  return {
    canAccessRoute,
    getAccessibleRoutes,
    userRole: user?.role,
  };
};

export default useRoleRedirect;