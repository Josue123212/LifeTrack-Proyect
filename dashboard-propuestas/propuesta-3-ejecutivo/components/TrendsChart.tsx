import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';

// Datos de ejemplo para tendencias mensuales
const monthlyData = [
  { month: 'Ene', citas: 980, ingresos: 89000, pacientes: 3200 },
  { month: 'Feb', citas: 1050, ingresos: 95000, pacientes: 3350 },
  { month: 'Mar', citas: 1120, ingresos: 102000, pacientes: 3480 },
  { month: 'Abr', citas: 1080, ingresos: 98000, pacientes: 3420 },
  { month: 'May', citas: 1180, ingresos: 108000, pacientes: 3650 },
  { month: 'Jun', citas: 1220, ingresos: 115000, pacientes: 3780 },
  { month: 'Jul', citas: 1150, ingresos: 110000, pacientes: 3690 },
  { month: 'Ago', citas: 1280, ingresos: 122000, pacientes: 3890 },
  { month: 'Sep', citas: 1320, ingresos: 127000, pacientes: 3950 },
  { month: 'Oct', citas: 1250, ingresos: 118000, pacientes: 3820 },
  { month: 'Nov', citas: 1380, ingresos: 135000, pacientes: 4100 }
];

const TrendsChart: React.FC = () => {
  const maxCitas = Math.max(...monthlyData.map(d => d.citas));
  const maxIngresos = Math.max(...monthlyData.map(d => d.ingresos));
  
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Tendencias Anuales
          </h3>
          <p className="text-gray-600">
            Evolución de métricas clave por mes
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Citas</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Ingresos</span>
          </div>
          <BarChart3 className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Chart */}
      <div className="space-y-6">
        {monthlyData.map((item, index) => {
          const citasHeight = (item.citas / maxCitas) * 100;
          const ingresosHeight = (item.ingresos / maxIngresos) * 100;
          
          return (
            <div key={index} className="flex items-end space-x-4">
              {/* Month Label */}
              <div className="w-12 text-sm font-medium text-gray-700">
                {item.month}
              </div>
              
              {/* Bars Container */}
              <div className="flex-1 flex items-end space-x-2 h-16">
                {/* Citas Bar */}
                <div className="flex-1 bg-gray-100 rounded-t-lg relative overflow-hidden">
                  <div 
                    className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-500 ease-out"
                    style={{ height: `${citasHeight}%` }}
                  >
                    <div className="absolute inset-0 bg-white bg-opacity-20"></div>
                  </div>
                </div>
                
                {/* Ingresos Bar */}
                <div className="flex-1 bg-gray-100 rounded-t-lg relative overflow-hidden">
                  <div 
                    className="bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg transition-all duration-500 ease-out"
                    style={{ height: `${ingresosHeight}%` }}
                  >
                    <div className="absolute inset-0 bg-white bg-opacity-20"></div>
                  </div>
                </div>
              </div>
              
              {/* Values */}
              <div className="w-24 text-right text-xs space-y-1">
                <div className="text-blue-600 font-semibold">
                  {item.citas.toLocaleString()}
                </div>
                <div className="text-emerald-600 font-semibold">
                  ${(item.ingresos / 1000).toFixed(0)}k
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {monthlyData[monthlyData.length - 1].citas.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Citas este mes</div>
            <div className="flex items-center justify-center mt-1">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-xs text-green-600">+12.5%</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600 mb-1">
              ${(monthlyData[monthlyData.length - 1].ingresos / 1000).toFixed(0)}k
            </div>
            <div className="text-sm text-gray-600">Ingresos este mes</div>
            <div className="flex items-center justify-center mt-1">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-xs text-green-600">+18.2%</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {((monthlyData[monthlyData.length - 1].ingresos / monthlyData[monthlyData.length - 1].citas)).toFixed(0)}
            </div>
            <div className="text-sm text-gray-600">Valor promedio</div>
            <div className="flex items-center justify-center mt-1">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-xs text-green-600">+5.1%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Projection */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              Proyección Diciembre
            </h4>
            <p className="text-sm text-gray-600">
              Basado en tendencia actual
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">
              1,420 citas
            </div>
            <div className="text-sm text-emerald-600 font-medium">
              $142k ingresos
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendsChart;