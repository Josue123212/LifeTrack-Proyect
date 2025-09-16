import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getNavigationForRole, 
  getNavigationItem, 
  isRouteAccessible
} from '@/config/navigation';

// 🧭 Hook para navegación dinámica basada en roles
export const useNavigation = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Obtener rol del usuario (por defecto 'client')
  const userRole = user?.role || 'client';
  
  // Obtener navegación para el rol actual
  const navigationItems = useMemo(() => {
    return getNavigationForRole(userRole);
  }, [userRole]);
  
  // Obtener item de navegación actual
  const currentNavigationItem = useMemo(() => {
    return getNavigationItem(userRole, location.pathname);
  }, [userRole, location.pathname]);
  
  // Verificar si una ruta es accesible
  const checkRouteAccess = (href: string): boolean => {
    return isRouteAccessible(userRole, href);
  };
  
  // Verificar si un item está activo
  const isItemActive = (item: any): boolean => {
    return location.pathname === item.href || 
           (item.href !== '/' && location.pathname.startsWith(item.href));
  };
  
  // Obtener breadcrumbs para la ruta actual
  const breadcrumbs = useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const crumbs: Array<{ name: string; href: string; isLast: boolean }> = [];
    
    // Agregar Home/Dashboard como primer breadcrumb
    crumbs.push({
      name: 'Dashboard',
      href: '/dashboard',
      isLast: false
    });
    
    // Construir breadcrumbs basados en la ruta
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Buscar el item de navegación correspondiente
      const navItem = getNavigationItem(userRole, currentPath);
      
      if (navItem && currentPath !== '/dashboard') {
        crumbs.push({
          name: navItem.name,
          href: currentPath,
          isLast: index === pathSegments.length - 1
        });
      } else if (currentPath !== '/dashboard') {
        // Si no hay item de navegación, usar el segmento formateado
        const formattedName = segment
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        crumbs.push({
          name: formattedName,
          href: currentPath,
          isLast: index === pathSegments.length - 1
        });
      }
    });
    
    // Marcar el último como isLast
    if (crumbs.length > 0) {
      crumbs[crumbs.length - 1].isLast = true;
    }
    
    return crumbs;
  }, [location.pathname, userRole]);
  
  // Obtener items de navegación filtrados (sin items deshabilitados)
  const activeNavigationItems = useMemo(() => {
    return navigationItems.filter(item => !item.disabled);
  }, [navigationItems]);
  
  // Obtener título de página basado en la navegación actual
  const pageTitle = useMemo(() => {
    if (currentNavigationItem) {
      return currentNavigationItem.name;
    }
    
    // Fallback: usar el último segmento de la URL
    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (pathSegments.length > 0) {
      const lastSegment = pathSegments[pathSegments.length - 1];
      return lastSegment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    
    return 'Dashboard';
  }, [currentNavigationItem, location.pathname]);
  
  return {
    // Datos de navegación
    navigationItems: activeNavigationItems,
    currentNavigationItem,
    userRole,
    
    // Estado de navegación
    isItemActive,
    checkRouteAccess,
    
    // Breadcrumbs
    breadcrumbs,
    
    // Utilidades
    pageTitle,
    
    // Métodos de navegación
    getItemByHref: (href: string) => getNavigationItem(userRole, href),
    hasAccess: checkRouteAccess
  };
};

export default useNavigation;