import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon,
  color
}) => {
  const colorClasses = {
    blue: 'bg-blue-500 text-blue-600 bg-blue-50',
    green: 'bg-green-500 text-green-600 bg-green-50',
    purple: 'bg-purple-500 text-purple-600 bg-purple-50',
    orange: 'bg-orange-500 text-orange-600 bg-orange-50'
  };

  const [bgColor, textColor, lightBg] = colorClasses[color].split(' ');

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      {/* Header with Icon */}
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${lightBg}`}>
          <div className={textColor}>
            {icon}
          </div>
        </div>
        <div className="flex items-center text-sm">
          {changeType === 'positive' ? (
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
          )}
          <span className={changeType === 'positive' ? 'text-green-600' : 'text-red-600'}>
            {change}
          </span>
        </div>
      </div>

      {/* Content */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">
          {value}
        </h3>
        <p className="text-sm text-gray-600">
          {title}
        </p>
      </div>
    </div>
  );
};

export default StatsCard;