import React from 'react';
import { TrendingUp, Users, Calendar, DollarSign, Activity, Target } from 'lucide-react';
import KPICard from './components/KPICard';
import TrendsChart from './components/TrendsChart';
import PerformanceMetrics from './components/PerformanceMetrics';
import ExecutiveSummary from './components/ExecutiveSummary';

// 🎯 PROPUESTA 3: DASHBOARD EJECUTIVO MINIMALISTA
// Enfoque: Vista ejecutiva con KPIs principales y tendencias
// Características: Métricas de alto nivel, diseño limpio, insights estratégicos

const ExecutiveDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-light text-gray-900 mb-3">
              Dashboard Ejecutivo
            </h1>
            <p className="text-lg text-gray-600">
              Métricas clave del sistema de citas médicas
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Último actualizado</div>
            <div className="text-lg font-medium text-gray-900">
              15 Nov 2024, 14:30
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <KPICard
          title="Ingresos Mensuales"
          value="$127,450"
          change="+12.5%"
          changeType="positive"
          icon={<DollarSign className="h-8 w-8" />}
          trend={[65, 78, 82, 95, 88, 92, 100]}
          color="emerald"
        />
        
        <KPICard
          title="Citas Completadas"
          value="1,247"
          change="+8.3%"
          changeType="positive"
          icon={<Calendar className="h-8 w-8" />}
          trend={[45, 52, 48, 61, 55, 67, 73]}
          color="blue"
        />
        
        <KPICard
          title="Pacientes Activos"
          value="3,892"
          change="+15.2%"
          changeType="positive"
          icon={<Users className="h-8 w-8" />}
          trend={[30, 35, 42, 38, 45, 48, 52]}
          color="purple"
        />
        
        <KPICard
          title="Tasa de Ocupación"
          value="87.5%"
          change="-2.1%"
          changeType="negative"
          icon={<Activity className="h-8 w-8" />}
          trend={[85, 88, 92, 89, 87, 85, 87]}
          color="orange"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Trends Chart - Takes 2 columns */}
        <div className="lg:col-span-2">
          <TrendsChart />
        </div>
        
        {/* Performance Metrics */}
        <div>
          <PerformanceMetrics />
        </div>
      </div>

      {/* Executive Summary */}
      <ExecutiveSummary />

      {/* Strategic Insights */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-green-100 rounded-xl mr-4">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Crecimiento
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-2xl font-bold text-green-600 mb-1">+23%</div>
              <div className="text-sm text-gray-600">Nuevos pacientes este mes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 mb-1">+18%</div>
              <div className="text-sm text-gray-600">Ingresos vs mes anterior</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-blue-100 rounded-xl mr-4">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Objetivos
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Meta mensual</span>
                <span className="text-sm font-medium text-gray-900">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: '92%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Satisfacción</span>
                <span className="text-sm font-medium text-gray-900">96%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{width: '96%'}}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-purple-100 rounded-xl mr-4">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Eficiencia
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-2xl font-bold text-purple-600 mb-1">22 min</div>
              <div className="text-sm text-gray-600">Tiempo promedio por cita</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600 mb-1">4.8/5</div>
              <div className="text-sm text-gray-600">Calificación promedio</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;

// 💡 CARACTERÍSTICAS PRINCIPALES:
// ✅ Diseño minimalista y elegante
// ✅ KPIs con micro-gráficos de tendencia
// ✅ Métricas de alto nivel para ejecutivos
// ✅ Gráficos de tendencias estratégicas
// ✅ Resumen ejecutivo con insights
// ✅ Indicadores de progreso hacia objetivos
// ✅ Colores sutiles y profesionales
// ✅ Espaciado generoso y tipografía clara