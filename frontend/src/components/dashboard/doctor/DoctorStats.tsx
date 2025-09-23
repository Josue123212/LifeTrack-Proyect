import React from 'react';
import { Calendar, Users, Clock, TrendingUp, Star } from 'lucide-react';
import { StatsCard } from '../StatsCard';
import type { DoctorDashboardData } from '../../../types';

interface DoctorStatsProps {
  stats?: DoctorDashboardData;
  isLoading?: boolean;
}

const DoctorStats: React.FC<DoctorStatsProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-background rounded-xl p-6 shadow-sm border-border animate-pulse">
            <div className="h-4 bg-secondary-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-secondary-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-secondary-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  const statsData = [
    {
      title: 'Citas Hoy',
      value: stats?.metrics?.appointments_today?.value || 0,
      icon: Calendar,
      color: 'blue',
      trend: stats?.metrics?.appointments_today?.change || 0,
      description: stats?.metrics?.appointments_today?.period || 'vs ayer'
    },
    {
      title: 'Pacientes Total',
      value: stats?.metrics?.total_patients?.value || 0,
      icon: Users,
      color: 'green',
      trend: stats?.metrics?.total_patients?.change || 0,
      description: stats?.metrics?.total_patients?.period || 'vs mes anterior'
    },
    {
      title: 'Citas Semana',
      value: stats?.metrics?.appointments_this_week?.value || 0,
      icon: Clock,
      color: 'purple',
      trend: stats?.metrics?.appointments_this_week?.change || 0,
      description: stats?.metrics?.appointments_this_week?.period || 'vs semana anterior'
    },
    {
      title: 'Calificación',
      value: stats?.metrics?.average_rating?.value || 0,
      icon: Star,
      color: 'yellow',
      trend: stats?.metrics?.average_rating?.change || 0,
      description: stats?.metrics?.average_rating?.period || 'vs mes anterior',
      format: 'rating'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={<stat.icon className="w-6 h-6" />}
          color={stat.color}
          trend={stat.trend}
          description={stat.description}
          format={stat.format}
        />
      ))}
    </div>
  );
};

export default DoctorStats;