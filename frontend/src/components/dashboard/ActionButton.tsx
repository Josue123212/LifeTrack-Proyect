import React from 'react';

interface ActionButtonProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  title,
  description,
  icon,
  onClick,
  variant = 'secondary',
  disabled = false
}) => {
  const baseClasses = "group relative w-full p-4 lg:p-6 rounded-xl transition-all duration-300 text-left border focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: `
      gradient-primary
      text-white border-transparent 
      shadow-lg hover:shadow-xl 
      transform hover:-translate-y-1
      focus:ring-primary
    `,
    secondary: `
      bg-white hover:bg-gray-50 
      text-gray-700 border-gray-200 
      hover:border-primary 
      shadow-sm hover:shadow-md
      focus:ring-primary
    `
  };
  
  const disabledClasses = "opacity-50 cursor-not-allowed hover:transform-none hover:shadow-sm";
  
  const iconClasses = variant === 'primary' 
    ? "text-white" 
    : "text-primary group-hover:text-primary-hover";
    
  const titleClasses = variant === 'primary'
    ? "text-white font-medium"
    : "text-gray-800 font-medium group-hover:text-gray-900";
    
  const descriptionClasses = variant === 'primary'
    ? "text-primary-light"
    : "text-gray-500 group-hover:text-gray-600";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${disabled ? disabledClasses : ''}
      `.replace(/\s+/g, ' ').trim()}
    >
      <div className="flex items-start space-x-4">
        <div className={`flex-shrink-0 ${iconClasses}`}>
          {icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm lg:text-base ${titleClasses} mb-1`}>
            {title}
          </h3>
          <p className={`text-xs lg:text-sm ${descriptionClasses} leading-relaxed`}>
            {description}
          </p>
        </div>
      </div>
      
      {/* Hover indicator for secondary variant */}
      {variant === 'secondary' && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </button>
  );
};

export default ActionButton;