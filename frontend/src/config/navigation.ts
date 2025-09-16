import { ReactNode } from 'react';

// Google Icons - Material Design Icons
// Usamos strings para los iconos de Google Material Icons
export interface NavigationItem {
  name: string;
  href: string;
  icon: string; // Google Material Icon name
  description?: string;
  badge?: string | number;
  disabled?: boolean;
}

export interface NavigationConfig {
  [role: string]: NavigationItem[];
}

// 🎯 Configuración de Navegación por Roles
export const navigationConfig: NavigationConfig = {
  // 👤 Cliente/Paciente - Navegación simplificada
  client: [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: 'dashboard',
      description: 'Panel principal'
    },
    {
      name: 'Mis Citas',
      href: '/appointments',
      icon: 'event',
      description: 'Ver y gestionar mis citas médicas'
    },
    {
      name: 'Mi Perfil',
      href: '/profile',
      icon: 'person',
      description: 'Información personal y configuración'
    },
    {
      name: 'Historial Médico',
      href: '/medical-history',
      icon: 'history',
      description: 'Historial de consultas y tratamientos'
    }
  ],

  // 👨‍⚕️ Doctor - Gestión de pacientes y citas
  doctor: [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: 'dashboard',
      description: 'Panel principal'
    },
    {
      name: 'Agenda',
      href: '/schedule',
      icon: 'schedule',
      description: 'Mi agenda de citas'
    },
    {
      name: 'Pacientes',
      href: '/patients',
      icon: 'people',
      description: 'Gestión de pacientes'
    },
    {
      name: 'Consultas',
      href: '/consultations',
      icon: 'medical_services',
      description: 'Historial de consultas'
    },
    {
      name: 'Mi Perfil',
      href: '/profile',
      icon: 'person',
      description: 'Información profesional'
    }
  ],

  // 🏥 Administrador - Gestión completa del sistema
  admin: [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: 'dashboard',
      description: 'Panel de control administrativo'
    },
    {
      name: 'Citas',
      href: '/appointments',
      icon: 'event',
      description: 'Gestión de todas las citas'
    },
    {
      name: 'Pacientes',
      href: '/patients',
      icon: 'people',
      description: 'Gestión de pacientes'
    },
    {
      name: 'Doctores',
      href: '/doctors',
      icon: 'local_hospital',
      description: 'Gestión de personal médico'
    },
    {
      name: 'Reportes',
      href: '/reports',
      icon: 'analytics',
      description: 'Reportes y estadísticas'
    },
    {
      name: 'Configuración',
      href: '/settings',
      icon: 'settings',
      description: 'Configuración del sistema'
    }
  ],

  // 👑 Super Administrador - Control total
  superadmin: [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: 'dashboard',
      description: 'Panel de control principal'
    },
    {
      name: 'Gestión de Usuarios',
      href: '/users',
      icon: 'admin_panel_settings',
      description: 'Administración de usuarios y roles'
    },
    {
      name: 'Centros Médicos',
      href: '/medical-centers',
      icon: 'business',
      description: 'Gestión de centros médicos'
    },
    {
      name: 'Doctores',
      href: '/doctors',
      icon: 'local_hospital',
      description: 'Gestión global de doctores'
    },
    {
      name: 'Pacientes',
      href: '/patients',
      icon: 'people',
      description: 'Gestión global de pacientes'
    },
    {
      name: 'Reportes Globales',
      href: '/global-reports',
      icon: 'assessment',
      description: 'Reportes del sistema completo'
    },
    {
      name: 'Logs del Sistema',
      href: '/system-logs',
      icon: 'bug_report',
      description: 'Logs y auditoría del sistema'
    },
    {
      name: 'Configuración Global',
      href: '/global-settings',
      icon: 'tune',
      description: 'Configuración avanzada del sistema'
    }
  ],

  // 📞 Recepcionista - Gestión de citas y pacientes
  receptionist: [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: 'dashboard',
      description: 'Panel de recepción'
    },
    {
      name: 'Agenda',
      href: '/schedule',
      icon: 'schedule',
      description: 'Agenda general de citas'
    },
    {
      name: 'Nueva Cita',
      href: '/appointments/new',
      icon: 'add_circle',
      description: 'Programar nueva cita'
    },
    {
      name: 'Pacientes',
      href: '/patients',
      icon: 'people',
      description: 'Registro de pacientes'
    },
    {
      name: 'Check-in',
      href: '/checkin',
      icon: 'how_to_reg',
      description: 'Registro de llegada de pacientes'
    }
  ]
};

// 🔧 Utilidades para navegación
export const getNavigationForRole = (role: string): NavigationItem[] => {
  return navigationConfig[role] || navigationConfig.client;
};

export const getNavigationItem = (role: string, href: string): NavigationItem | undefined => {
  const navigation = getNavigationForRole(role);
  return navigation.find(item => item.href === href);
};

export const isRouteAccessible = (role: string, href: string): boolean => {
  const navigation = getNavigationForRole(role);
  return navigation.some(item => item.href === href && !item.disabled);
};

// 🎨 Configuración de iconos para Google Material Icons
export const iconConfig = {
  size: 'text-xl', // Tamaño base de iconos
  activeColor: 'text-primary', // Color activo (turquesa)
  inactiveColor: 'text-gray-500', // Color inactivo
  hoverColor: 'group-hover:text-primary', // Color en hover
};

// 📱 Configuración responsive
export const navigationStyles = {
  desktop: {
    container: 'hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0',
    item: 'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200',
    activeItem: 'bg-primary/10 text-primary border-r-2 border-primary',
    inactiveItem: 'text-gray-700 hover:bg-gray-50 hover:text-primary'
  },
  mobile: {
    container: 'lg:hidden',
    overlay: 'fixed inset-0 bg-black bg-opacity-50 z-40',
    sidebar: 'fixed inset-y-0 left-0 z-50 w-72 bg-white transform transition-transform duration-300',
    item: 'flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200'
  }
};

export default navigationConfig;