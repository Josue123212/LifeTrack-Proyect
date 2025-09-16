import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import WelcomeCard from '@/components/dashboard/WelcomeCard';
import QuickActions from '@/components/dashboard/QuickActions';
import UpcomingAppointments from '@/components/dashboard/UpcomingAppointments';
import RecentActivity from '@/components/dashboard/RecentActivity';

// Simulación de servicios - se reemplazará con servicios reales
const mockAppointmentService = {
  getUserAppointments: async () => {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      {
        id: '1',
        doctor: 'Dr. María González',
        specialty: 'Cardiología',
        date: '2024-01-15',
        time: '10:00',
        status: 'confirmed'
      },
      {
        id: '2',
        doctor: 'Dr. Carlos Ruiz',
        specialty: 'Dermatología',
        date: '2024-01-20',
        time: '14:30',
        status: 'pending'
      }
    ];
  },
  getUpcoming: async (limit: number) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return [
      {
        id: '1',
        doctor: 'Dr. María González',
        specialty: 'Cardiología',
        date: '2024-01-15',
        time: '10:00',
        status: 'confirmed'
      }
    ];
  }
};

const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  
  const { data: appointments, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['user-appointments'],
    queryFn: mockAppointmentService.getUserAppointments
  });
  
  const { data: upcomingAppointments, isLoading: upcomingLoading } = useQuery({
    queryKey: ['upcoming-appointments'],
    queryFn: () => mockAppointmentService.getUpcoming(3)
  });

  return (
    <div className="space-y-8" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Welcome Section */}
      <WelcomeCard user={user} />
      
      {/* Quick Actions */}
      <QuickActions />
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-6">
          <UpcomingAppointments 
            appointments={upcomingAppointments} 
            isLoading={upcomingLoading}
          />
        </div>
        
        {/* Sidebar Content */}
        <div className="space-y-6">
          <RecentActivity 
            appointments={appointments}
            isLoading={appointmentsLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;