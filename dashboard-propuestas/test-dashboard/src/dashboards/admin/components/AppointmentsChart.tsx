import React from 'react';
import { BarChart3 } from 'lucide-react';

// Datos de ejemplo para el gráfico
const chartData = [
  { day: 'Lun', citas: 12, completadas: 10 },
  { day: 'Mar', citas: 19, completadas: 16 },
  { day: 'Mié', citas: 15, completadas: 14 },
  { day: 'Jue', citas: 22, completadas: 20 },
  { day: 'Vie', citas: 18, completadas: 15 },
  { day: 'Sáb', citas: 8, completadas: 7 },
  { day: 'Dom', citas: 5, completadas: 5 }
];

const AppointmentsChart: React.FC = () => {
  const maxValue = Math.max(...chartData.map(d => d.citas));

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Citas de la Semana
          </h3>
          <p className="text-sm text-gray-600">
            Comparación de citas programadas vs completadas
          </p>
        </div>
        <BarChart3 className="h-6 w-6 text-gray-400" />
      </div>

      {/* Chart */}
      <div className="space-y-4">
        {chartData.map((item, index) => {
          const citasHeight = (item.citas / maxValue) * 100;
          const completadasHeight = (item.completadas / maxValue) * 100;
          
          return (
            <div key={index} className="flex items-end space-x-2">
              {/* Day Label */}
              <div className="w-12 text-xs text-gray-600 font-medium">
                {item.day}
              </div>
              
              {/* Bars Container */}
              <div className="flex-1 flex items-end space-x-1 h-16">
                {/* Citas Programadas Bar */}
                <div className="flex-1 bg-gray-100 rounded-t relative">
                  <div 
                    className="bg-blue-500 rounded-t transition-all duration-300"
                    style={{ height: `${citasHeight}%` }}
                  ></div>
                </div>
                
                {/* Citas Completadas Bar */}
                <div className="flex-1 bg-gray-100 rounded-t relative">
                  <div 
                    className="bg-green-500 rounded-t transition-all duration-300"
                    style={{ height: `${completadasHeight}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Values */}
              <div className="w-16 text-xs text-gray-600">
                <div className="text-blue-600 font-medium">{item.citas}</div>
                <div className="text-green-600 font-medium">{item.completadas}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-xs text-gray-600">Programadas</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-xs text-gray-600">Completadas</span>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total esta semana:</span>
          <span className="font-medium text-gray-900">
            {chartData.reduce((acc, item) => acc + item.citas, 0)} citas
          </span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-gray-600">Tasa de completación:</span>
          <span className="font-medium text-green-600">
            {Math.round(
              (chartData.reduce((acc, item) => acc + item.completadas, 0) /
               chartData.reduce((acc, item) => acc + item.citas, 0)) * 100
            )}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsChart;