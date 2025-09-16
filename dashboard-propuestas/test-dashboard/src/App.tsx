import React, { useState } from 'react';
import AdminDashboard from './dashboards/admin/AdminDashboard';
import DoctorDashboard from './dashboards/doctor/DoctorDashboard';
import ExecutiveDashboard from './dashboards/executive/ExecutiveDashboard';

type DashboardType = 'admin' | 'doctor' | 'executive';

function App() {
  const [activeDashboard, setActiveDashboard] = useState<DashboardType>('admin');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const dashboards = {
    admin: {
      component: <AdminDashboard />,
      title: 'Dashboard',
      description: 'Resumen general del sistema',
      icon: 'dashboard',
      color: 'emerald'
    },
    doctor: {
      component: <DoctorDashboard />,
      title: 'Mis Citas',
      description: 'Gestión personal de consultas',
      icon: 'event',
      color: 'emerald'
    },
    executive: {
      component: <ExecutiveDashboard />,
      title: 'Equipo Médico',
      description: 'Directorio de profesionales',
      icon: 'local_hospital',
      color: 'emerald'
    }
  };

  const getColorClasses = (isActive: boolean) => {
    return isActive 
      ? 'text-white font-medium' 
      : 'text-gray-600 hover:bg-gray-50';
  };

  const getActiveStyle = (isActive: boolean) => {
    return isActive ? { backgroundColor: 'rgba(0, 206, 209, 0.8)', color: 'white' } : {};
  };

  return (
    <div className="flex h-screen bg-white" style={{fontFamily: 'Inter, sans-serif'}}>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 flex flex-col transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="p-8 border-b border-gray-50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{backgroundColor: 'rgba(0, 206, 209, 0.8)'}}>
              <span className="material-icons text-white text-xl">local_hospital</span>
            </div>
            <div>
              <h2 className="text-xl font-light text-gray-800">Clínica Nova</h2>
              <p className="text-sm text-gray-500">Sistema de citas</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-2">
          {Object.entries(dashboards).map(([key, dashboard]) => {
            const isActive = activeDashboard === key;
            
            return (
              <button
                key={key}
                onClick={() => {
                  setActiveDashboard(key as DashboardType);
                  // Cerrar sidebar en móvil al seleccionar dashboard
                  if (window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }}
                className={`w-full flex items-center p-4 rounded-2xl transition-all duration-300 ${
                  getColorClasses(isActive)
                }`}
                style={getActiveStyle(isActive)}
              >
                <span className="material-icons text-xl mr-4">{dashboard.icon}</span>
                <span className="text-base font-light">{dashboard.title}</span>
              </button>
            );
          })}
          
          {/* Additional Menu Item */}
          <button className="w-full flex items-center p-4 rounded-2xl transition-all duration-300 text-gray-600 hover:bg-gray-50">
            <span className="material-icons text-xl mr-4">settings</span>
            <span className="text-base font-light">Configuración</span>
          </button>
        </nav>


      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-50 px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="material-icons text-gray-600">
                {sidebarOpen ? 'close' : 'menu'}
              </span>
            </button>
            
            <div className="flex-1 lg:flex-none">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-light text-gray-800">
                {dashboards[activeDashboard].title}
              </h1>
              <p className="text-sm sm:text-base text-gray-500 mt-1 lg:mt-2">
                {dashboards[activeDashboard].description}
              </p>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button className="hidden sm:block p-2 hover:bg-gray-100 rounded-lg">
                <span className="material-icons text-gray-600">content_copy</span>
              </button>
              <div className="flex items-center space-x-2">
                <span className="hidden sm:block text-sm text-gray-600">Hola, Josué</span>
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">JC</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto">
          {dashboards[activeDashboard].component}
        </main>
      </div>
    </div>
  );
}

export default App;