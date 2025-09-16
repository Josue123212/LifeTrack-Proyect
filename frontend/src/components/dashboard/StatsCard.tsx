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
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  onClick?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
  onClick
}) => {
  const baseClasses = "bg-white rounded-xl lg:rounded-2xl shadow-sm border transition-all duration-300 p-4 sm:p-6";
  
  const variantClasses = {
    default: "border-gray-100 hover:border-gray-200 hover:shadow-md",
    primary: "border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50",
    success: "border-green-200 bg-gradient-to-br from-green-50 to-emerald-50",
    warning: "border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50",
    danger: "border-red-200 bg-gradient-to-br from-red-50 to-rose-50"
  };
  
  const iconColors = {
    default: "text-gray-600",
    primary: "text-teal-600",
    success: "text-green-600",
    warning: "text-yellow-600",
    danger: "text-red-600"
  };
  
  const valueColors = {
    default: "text-gray-800",
    primary: "text-teal-800",
    success: "text-green-800",
    warning: "text-yellow-800",
    danger: "text-red-800"
  };

  const Component = onClick ? 'button' : 'div';
  const clickableClasses = onClick ? 'cursor-pointer hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2' : '';

  return (
    <Component
      onClick={onClick}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${clickableClasses}
      `.replace(/\s+/g, ' ').trim()}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            {icon && (
              <div className={`flex-shrink-0 ${iconColors[variant]}`}>
                {icon}
              </div>
            )}
            <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              {title}
            </h3>
          </div>
          
          <div className={`text-2xl sm:text-3xl font-light ${valueColors[variant]} mb-1`}>
            {value}
          </div>
          
          {subtitle && (
            <p className="text-sm text-gray-500">
              {subtitle}
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
            <div className="text-xs text-gray-500 mt-1">
              {trend.label}
            </div>
          </div>
        )}
      </div>
      
      {onClick && (
        <div className="mt-4 flex items-center text-sm text-teal-600 font-medium">
          <span>Ver detalles</span>
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </Component>
  );
};

export default StatsCard;