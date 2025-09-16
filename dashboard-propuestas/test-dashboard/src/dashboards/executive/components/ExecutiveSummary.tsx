import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, Users, DollarSign, Calendar } from 'lucide-react';

const ExecutiveSummary: React.FC = () => {
  const insights = [
    {
      id: 1,
      type: 'success',
      title: 'Crecimiento Sostenido',
      description: 'Las citas han aumentado 23% este trimestre, superando proyecciones.',
      impact: 'Alto',
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'green'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Capacidad Limitada',
      description: 'Algunos especialistas están al 95% de capacidad en horarios pico.',
      impact: 'Medio',
      icon: <AlertTriangle className="h-5 w-5" />,
      color: 'orange'
    },
    {
      id: 3,
      type: 'info',
      title: 'Oportunidad Digital',
      description: 'Las teleconsultas representan solo el 15% del total de citas.',
      impact: 'Medio',
      icon: <Clock className="h-5 w-5" />,
      color: 'blue'
    },
    {
      id: 4,
      type: 'success',
      title: 'Satisfacción Excelente',
      description: 'NPS de 78, el más alto en los últimos 2 años.',
      impact: 'Alto',
      icon: <CheckCircle className="h-5 w-5" />,
      color: 'green'
    }
  ];

  const recommendations = [
    {
      id: 1,
      priority: 'Alta',
      action: 'Contratar 2 especialistas adicionales',
      timeline: '30 días',
      impact: 'Reducir tiempos de espera 40%',
      icon: <Users className="h-4 w-4" />
    },
    {
      id: 2,
      priority: 'Media',
      action: 'Implementar sistema de recordatorios automáticos',
      timeline: '15 días',
      impact: 'Reducir no-shows 25%',
      icon: <Calendar className="h-4 w-4" />
    },
    {
      id: 3,
      priority: 'Media',
      action: 'Expandir horarios de teleconsulta',
      timeline: '7 días',
      impact: 'Aumentar ingresos 15%',
      icon: <DollarSign className="h-4 w-4" />
    }
  ];

  const getInsightColors = (color: string) => {
    const colors = {
      green: {
        bg: 'bg-green-50',
        text: 'text-green-600',
        border: 'border-green-200'
      },
      orange: {
        bg: 'bg-orange-50',
        text: 'text-orange-600',
        border: 'border-orange-200'
      },
      blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        border: 'border-blue-200'
      }
    };
    return colors[color as keyof typeof colors];
  };

  const getPriorityColors = (priority: string) => {
    const colors = {
      'Alta': 'bg-red-100 text-red-800',
      'Media': 'bg-yellow-100 text-yellow-800',
      'Baja': 'bg-green-100 text-green-800'
    };
    return colors[priority as keyof typeof colors];
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Resumen Ejecutivo
        </h3>
        <p className="text-gray-600">
          Insights estratégicos y recomendaciones
        </p>
      </div>

      {/* Key Insights */}
      <div className="mb-8">
        <h4 className="font-semibold text-gray-900 mb-4">
          Insights Clave
        </h4>
        <div className="space-y-4">
          {insights.map((insight) => {
            const colors = getInsightColors(insight.color);
            
            return (
              <div 
                key={insight.id} 
                className={`p-4 rounded-lg border ${colors.border} ${colors.bg}`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-1 rounded ${colors.text}`}>
                    {insight.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">
                        {insight.title}
                      </h5>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        insight.impact === 'Alto' ? 'bg-red-100 text-red-800' :
                        insight.impact === 'Medio' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        Impacto {insight.impact}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div className="mb-8">
        <h4 className="font-semibold text-gray-900 mb-4">
          Recomendaciones Estratégicas
        </h4>
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <div className="text-gray-600">
                    {rec.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">
                      {rec.action}
                    </h5>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      getPriorityColors(rec.priority)
                    }`}>
                      {rec.priority}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Timeline:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {rec.timeline}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Impacto:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {rec.impact}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strategic Metrics */}
      <div className="mb-8">
        <h4 className="font-semibold text-gray-900 mb-4">
          Métricas Estratégicas
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">ROI Trimestral</p>
                <p className="text-2xl font-bold text-blue-900">24.5%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xs text-blue-700 mt-2">
              +3.2% vs trimestre anterior
            </p>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600 font-medium">Eficiencia</p>
                <p className="text-2xl font-bold text-emerald-900">92%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <p className="text-xs text-emerald-700 mt-2">
              Meta: 90% (Superada)
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors font-medium">
          Generar Reporte Completo
        </button>
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors text-sm font-medium">
            Programar Revisión
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors text-sm font-medium">
            Exportar Datos
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveSummary;