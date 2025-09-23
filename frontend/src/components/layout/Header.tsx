import React, { useState, useRef, useEffect } from 'react';
import { Bars3Icon, BellIcon, UserCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';

/**
 * 🎯 HEADER COMPONENT
 * 
 * Header responsive con logo, navegación y acciones de usuario.
 * Incluye botón hamburguesa para móvil y notificaciones.
 */

interface HeaderProps {
  onMenuClick: () => void;
  showMenuButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, showMenuButton = true }) => {
  const { user, logout } = useAuth();
  const { unreadCount, hasUnread, markAllAsRead } = useNotifications();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdowns al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <header 
      className="shadow-sm border-b"
      style={{ 
        backgroundColor: 'var(--surface)', 
        borderColor: 'var(--border)' 
      }}
    >
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          {showMenuButton && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md transition-colors duration-200"
              style={{ 
                color: 'var(--text-secondary)',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.backgroundColor = 'var(--primary-light)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              aria-label="Abrir menú"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          )}
        </div>
        
        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 rounded-md transition-colors duration-200 relative"
              style={{ 
                color: 'var(--text-secondary)',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.backgroundColor = 'var(--primary-light)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              aria-label="Notificaciones"
            >
              <BellIcon className="h-6 w-6" />
              {/* Notification Badge */}
              {hasUnread && (
                <span 
                  className="absolute -top-1 -right-1 h-4 w-4 rounded-full text-xs flex items-center justify-center text-white font-medium"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <div 
                className="absolute right-0 mt-2 w-80 rounded-lg shadow-lg border z-50"
                style={{ 
                  backgroundColor: 'var(--surface)', 
                  borderColor: 'var(--border)' 
                }}
              >
                <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      Notificaciones
                    </h3>
                    {hasUnread && (
                      <button
                        onClick={markAllAsRead}
                        className="text-sm transition-colors duration-200"
                        style={{ color: 'var(--primary)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--primary-dark)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--primary)';
                        }}
                      >
                        Marcar todas como leídas
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {hasUnread ? (
                    <div className="p-4">
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Tienes {unreadCount} notificación{unreadCount !== 1 ? 'es' : ''} sin leer
                      </p>
                      <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                        Las notificaciones se cargarán automáticamente...
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        No tienes notificaciones nuevas
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* User Menu Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg transition-all duration-200"
              style={{ 
                color: 'var(--text-secondary)',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.backgroundColor = 'var(--primary-light)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              aria-label="Menú de usuario"
            >
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                {user?.firstName?.charAt(0) || 'U'}
              </div>
              <ChevronDownIcon 
                className={`h-4 w-4 transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`} 
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg py-2 z-50"
                style={{ 
                  backgroundColor: 'var(--surface)', 
                  border: '1px solid var(--border)' 
                }}
              >
                {/* User Info */}
                <div 
                  className="px-4 py-3 border-b"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <p 
                    className="text-sm font-medium"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p 
                    className="text-xs"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {user?.email}
                  </p>
                  <p 
                    className="text-xs capitalize mt-1"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {user?.role || 'Usuario'}
                  </p>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <Link
                    to="/client/profile"
                    className="flex items-center px-4 py-2 text-sm transition-colors duration-200"
                    style={{ color: 'var(--text-primary)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--primary-light)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <UserCircleIcon className="h-4 w-4 mr-3" />
                    Mi Perfil
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm transition-colors duration-200"
                    style={{ color: 'var(--error)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#fef2f2';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <span className="material-icons text-base mr-3">logout</span>
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;