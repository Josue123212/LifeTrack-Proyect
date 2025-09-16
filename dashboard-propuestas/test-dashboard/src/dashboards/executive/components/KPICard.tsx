import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ReactNode;
  trend: number[];
  color: 'emerald' | 'blue' | 'purple' | 'orange';
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  changeType,
  icon,
  trend,
  color
}) => {
  const colorClasses = {
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      line: 'stroke-emerald-500'
    },
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      line: 'stroke-blue-500'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      line: 'stroke-purple-500'
    },
    orange: {
      bg: 'bg-orange-50',
      text: 'text-orange-600',
      line: 'stroke-orange-500'
    }
  };

  const colors = colorClasses[color];

  // Generate SVG path for trend line
  const generatePath = (data: number[]) => {
    const width = 80;
    const height = 30;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className={`p-3 rounded-xl ${colors.bg}`}>
          <div className={colors.text}>
            {icon}
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {changeType === 'positive' ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <span className={`text-sm font-medium ${
            changeType === 'positive' ? 'text-green-600' : 'text-red-600'
          }`}>
            {change}
          </span>
        </div>
      </div>

      {/* Value */}
      <div className="mb-4">
        <h3 className="text-3xl font-bold text-gray-900 mb-2">
          {value}
        </h3>
        <p className="text-sm text-gray-600 font-medium">
          {title}
        </p>
      </div>

      {/* Trend Chart */}
      <div className="flex items-end justify-between">
        <div className="text-xs text-gray-500">
          Últimos 7 días
        </div>
        <div className="w-20 h-8">
          <svg width="80" height="30" className="overflow-visible">
            <path
              d={generatePath(trend)}
              fill="none"
              className={`${colors.line} stroke-2`}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Data points */}
            {trend.map((value, index) => {
              const width = 80;
              const height = 30;
              const max = Math.max(...trend);
              const min = Math.min(...trend);
              const range = max - min || 1;
              const x = (index / (trend.length - 1)) * width;
              const y = height - ((value - min) / range) * height;
              
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="2"
                  className={`${colors.line.replace('stroke-', 'fill-')}`}
                />
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default KPICard;