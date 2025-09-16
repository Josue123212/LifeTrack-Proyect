import React from 'react';
import { Target, Clock, Star, Users, TrendingUp, AlertCircle } from 'lucide-react';

const PerformanceMetrics: React.FC = () => {
  const metrics = [
    {
      id: 1,
      title: 'Eficiencia Operativa',
      value: 92,
      target: 95,
      unit: '%',
      icon: <Target className="h-5 w-5" />,
      color: 'blue',
      trend: '+2.3%'
    },
    {
      id: 2,
      title: 'Tiempo Promedio',
      value: 22,
      target: 20,
      unit: 'min',
      icon: <Clock className="h-5 w-5" />,
      color: 'orange',
      trend: '-1.5%'
    },
    {
      id: 3,
      title: 'Satisfacción',
      value: 4.8,
      target: 4.5,
      unit: '/5',
      icon: <Star className="h-5 w-5" />,
      color: 'emerald',
      trend: '+0.2'
    },
    {
      id: 4,
      title: 'Retención',
      value: 89,
      target: 85,
      unit: '%',
      icon: <Users className="h-5 w-5" />,
      color: 'purple',
      trend: '+4.1%'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        progress: 'bg-blue-500'
      },
      orange: {
        bg: 'bg-orange-50',
        text: 'text-orange-600',
        progress: 'bg-orange-500'
      },
      emerald: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
        progress: 'bg-emerald-500'
      },
      purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        progress: 'bg-purple-500'
      }
    };
    return colors[color as keyof typeof colors];
  };

  const getProgressPercentage = (value: number, target: number, unit: string) => {
    if (unit === 'min') {
      // For time, lower is better
      return Math.min((target / value) * 100, 100);
    }
    if (unit === '/5') {
      // For ratings, convert to percentage
      return (value / 5) * 100;
    }
    // For percentages, use as is
    return value;
  };

  const isAboveTarget = (value: number, target: number, unit: string) => {
    if (unit === 'min') {
      return value <= target;
    }
    return value >= target;
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Métricas de Rendimiento
        </h3>
        <p className="text-gray-600">
          Indicadores clave de desempeño
        </p>
      </div>

      {/* Metrics List */}
      <div className="space-y-6">
        {metrics.map((metric) => {
          const colors = getColorClasses(metric.color);
          const progressPercentage = getProgressPercentage(metric.value, metric.target, metric.unit);
          const aboveTarget = isAboveTarget(metric.value, metric.target, metric.unit);
          
          return (
            <div key={metric.id} className="space-y-3">
              {/* Metric Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${colors.bg}`}>
                    <div className={colors.text}>
                      {metric.icon}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {metric.title}
                    </h4>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-600">
                        Meta: {metric.target}{metric.unit}
                      </span>
                      {aboveTarget ? (
                        <div className="flex items-center text-green-600">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          <span className="text-xs">Alcanzada</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-orange-600">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          <span className="text-xs">En progreso</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Value and Trend */}
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {metric.value}{metric.unit}
                  </div>
                  <div className={`text-sm font-medium ${
                    metric.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.trend}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0</span>
                  <span>{metric.unit === '/5' ? '5' : '100%'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${colors.progress}`}
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall Performance Score */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="text-center">
          <h4 className="font-semibold text-gray-900 mb-4">
            Puntuación General
          </h4>
          
          {/* Circular Progress */}
          <div className="relative w-24 h-24 mx-auto mb-4">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#3b82f6"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${88 * 2.51} ${100 * 2.51}`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">88%</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600">
            Excelente rendimiento general
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 space-y-2">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium">
          Ver Reporte Detallado
        </button>
        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors text-sm font-medium">
          Configurar Alertas
        </button>
      </div>
    </div>
  );
};

export default PerformanceMetrics;