import React from 'react';
import { Calendar, Users, FileText, Settings, Clock, UserPlus } from 'lucide-react';
import { ActionButton } from '../ActionButton';

interface DoctorQuickActionsProps {
  onAction?: (action: string) => void;
}

const DoctorQuickActions: React.FC<DoctorQuickActionsProps> = ({ onAction }) => {
  const actions = [
    {
      id: 'view-schedule',
      title: 'Ver Agenda',
      description: 'Revisar citas programadas',
      icon: Calendar,
      color: 'blue',
      onClick: () => onAction?.('view-schedule')
    },
    {
      id: 'manage-patients',
      title: 'Mis Pacientes',
      description: 'Gestionar pacientes',
      icon: Users,
      color: 'green',
      onClick: () => onAction?.('manage-patients')
    },
    {
      id: 'medical-records',
      title: 'Historiales',
      description: 'Revisar expedientes',
      icon: FileText,
      color: 'purple',
      onClick: () => onAction?.('medical-records')
    },
    {
      id: 'availability',
      title: 'Disponibilidad',
      description: 'Configurar horarios',
      icon: Clock,
      color: 'orange',
      onClick: () => onAction?.('availability')
    },
    {
      id: 'new-patient',
      title: 'Nuevo Paciente',
      description: 'Registrar paciente',
      icon: UserPlus,
      color: 'indigo',
      onClick: () => onAction?.('new-patient')
    },
    {
      id: 'profile-settings',
      title: 'Mi Perfil',
      description: 'Configurar perfil',
      icon: Settings,
      color: 'gray',
      onClick: () => onAction?.('profile-settings')
    }
  ];

  return (
    <div className="bg-background rounded-xl p-6 shadow-sm border-border">
      <h3 className="text-lg font-semibold text-text-primary mb-6">
        Acciones Rápidas
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {actions.map((action) => (
          <ActionButton
            key={action.id}
            title={action.title}
            description={action.description}
            icon={<action.icon className="w-6 h-6" />}
            onClick={action.onClick}
            variant="secondary"
          />
        ))}
      </div>
    </div>
  );
};

export default DoctorQuickActions;