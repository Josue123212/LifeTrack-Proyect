import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  isLoading?: boolean;
  description?: string;
  onClick?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'primary',
  isLoading = false,
  description,
  onClick
}) => {
  // Clases base usando variables CSS del tema
  const baseClasses = "bg-white rounded-lg shadow-sm border border-secondary transition-all duration-300 p-6";
  
  // Colores usando variables CSS del tema
  const colorClasses = {
    primary: {
      icon: "text-primary",
      value: "text-text-primary",
      bg: "bg-primary-light",
      border: "border-primary"
    },
    secondary: {
      icon: "text-secondary",
      value: "text-text-primary", 
      bg: "bg-secondary-50",
      border: "border-secondary"
    },
    success: {
      icon: "text-green-600",
      value: "text-text-primary",
      bg: "bg-green-50",
      border: "border-green-200"
    },
    warning: {
      icon: "text-yellow-600", 
      value: "text-text-primary",
      bg: "bg-yellow-50",
      border: "border-yellow-200"
    },
    error: {
      icon: "text-red-600",
      value: "text-text-primary", 
      bg: "bg-red-50",
      border: "border-red-200"
    },
    info: {
      icon: "text-blue-600",
      value: "text-text-primary",
      bg: "bg-blue-50", 
      border: "border-blue-200"
    }
  };

  const currentColors = colorClasses[color];
  const Component = onClick ? 'button' : 'div';
  const clickableClasses = onClick ? 'cursor-pointer hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2' : '';

  // Estado de carga
  if (isLoading) {
    return (
      <div className={`${baseClasses} animate-pulse`}>
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-6 h-6 bg-secondary-200 rounded"></div>
          <div className="h-4 bg-secondary-200 rounded w-24"></div>
        </div>
        <div className="h-8 bg-secondary-200 rounded w-16 mb-2"></div>
        {description && <div className="h-3 bg-secondary-200 rounded w-32"></div>}
      </div>
    );
  }

  return (
    <Component
      onClick={onClick}
      className={`${baseClasses} ${clickableClasses}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-4">
            {icon && (
              <div className={`flex-shrink-0 ${currentColors.icon}`}>
                {icon}
              </div>
            )}
            <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide">
              {title}
            </h3>
          </div>
          
          <div className={`text-3xl font-bold ${currentColors.value} mb-2`}>
            {value}
          </div>
          
          {(subtitle || description) && (
            <p className="text-sm text-text-secondary">
              {subtitle || description}
            </p>
          )}
        </div>
        
        {trend && (
          <div className="flex-shrink-0 ml-4">
            <div className={`flex items-center space-x-1 text-sm font-medium ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              <svg 
                className={`w-4 h-4 ${
                  trend.isPositive ? 'rotate-0' : 'rotate-180'
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
              </svg>
              <span>{Math.abs(trend.value)}%</span>
            </div>
            <div className="text-xs text-text-secondary mt-1">
              {trend.label}
            </div>
          </div>
        )}
      </div>
      
      {onClick && (
        <div className="mt-4 flex items-center text-sm text-primary font-medium">
          <span>Ver detalles</span>
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </Component>
  );
};

export { StatsCard };