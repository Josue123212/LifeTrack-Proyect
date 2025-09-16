import React from 'react';
import { Bars3Icon, BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

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
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          {showMenuButton && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
              aria-label="Abrir menú"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          )}
          
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 206, 209, 1) 0%, rgba(0, 150, 199, 1) 100%)'
              }}
            >
              <span>M</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              MediCitas
            </span>
          </Link>
        </div>
        
        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button 
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200 relative"
            aria-label="Notificaciones"
          >
            <BellIcon className="h-6 w-6" />
            {/* Notification Badge */}
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full text-xs flex items-center justify-center text-white font-medium"
                  style={{backgroundColor: 'rgba(0, 206, 209, 1)'}}>
              3
            </span>
          </button>
          
          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">Dr. Juan Pérez</p>
              <p className="text-xs text-gray-500">Administrador</p>
            </div>
            <button 
              className="p-1 rounded-full text-gray-600 hover:text-gray-900 transition-colors duration-200"
              aria-label="Perfil de usuario"
            >
              <UserCircleIcon className="h-8 w-8" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;