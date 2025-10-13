import React, { useState } from 'react';
import { Layout } from '../../components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  User, 
  Plus,
  Filter,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

// 🎭 Mocks realistas para el calendario
const mockCalendarAppointments = [
  {
    id: 1,
    patient: { firstName: "María", lastName: "González" },
    doctor: { firstName: "Dr. Carlos", lastName: "Rodríguez", specialization: "Cardiología" },
    date: "2024-01-15",
    time: "09:00",
    duration: 30,
    status: "confirmed",
    reason: "Consulta de rutina",
    type: "consultation"
  },
  {
    id: 2,
    patient: { firstName: "Juan", lastName: "Pérez" },
    doctor: { firstName: "Dra. Ana", lastName: "Martínez", specialization: "Dermatología" },
    date: "2024-01-15",
    time: "10:30",
    duration: 45,
    status: "pending_confirmation",
    reason: "Revisión de lunares",
    type: "checkup"
  },
  {
    id: 3,
    patient: { firstName: "Carmen", lastName: "López" },
    doctor: { firstName: "Dr. Luis", lastName: "García", specialization: "Pediatría" },
    date: "2024-01-15",
    time: "14:00",
    duration: 30,
    status: "scheduled",
    reason: "Consulta pediátrica",
    type: "consultation"
  },
  {
    id: 4,
    patient: { firstName: "Roberto", lastName: "Silva" },
    doctor: { firstName: "Dr. Carlos", lastName: "Rodríguez", specialization: "Cardiología" },
    date: "2024-01-16",
    time: "11:00",
    duration: 60,
    status: "confirmed",
    reason: "Seguimiento post-operatorio",
    type: "followup"
  },
  {
    id: 5,
    patient: { firstName: "Ana", lastName: "Martín" },
    doctor: { firstName: "Dra. Elena", lastName: "Torres", specialization: "Ginecología" },
    date: "2024-01-16",
    time: "15:30",
    duration: 30,
    status: "scheduled",
    reason: "Control ginecológico",
    type: "checkup"
  },
  {
    id: 6,
    patient: { firstName: "Pedro", lastName: "Ruiz" },
    doctor: { firstName: "Dr. Miguel", lastName: "Fernández", specialization: "Traumatología" },
    date: "2024-01-17",
    time: "09:30",
    duration: 45,
    status: "confirmed",
    reason: "Revisión de fractura",
    type: "followup"
  }
];

const statusConfig = {
  scheduled: { label: 'Programada', color: 'bg-blue-500', textColor: 'text-blue-700', bgColor: 'bg-blue-50' },
  confirmed: { label: 'Confirmada', color: 'bg-green-500', textColor: 'text-green-700', bgColor: 'bg-green-50' },
  pending_confirmation: { label: 'Pendiente', color: 'bg-yellow-500', textColor: 'text-yellow-700', bgColor: 'bg-yellow-50' },
  in_progress: { label: 'En Curso', color: 'bg-purple-500', textColor: 'text-purple-700', bgColor: 'bg-purple-50' },
  completed: { label: 'Completada', color: 'bg-gray-500', textColor: 'text-gray-700', bgColor: 'bg-gray-50' },
  cancelled: { label: 'Cancelada', color: 'bg-red-500', textColor: 'text-red-700', bgColor: 'bg-red-50' }
};

const typeConfig = {
  consultation: { label: 'Consulta', icon: User },
  checkup: { label: 'Revisión', icon: CheckCircle },
  followup: { label: 'Seguimiento', icon: Clock },
  emergency: { label: 'Emergencia', icon: AlertCircle }
};

const SecretaryCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [appointments] = useState(mockCalendarAppointments);

  // Generar días del mes
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Días del mes anterior
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({
        date: prevDate.getDate(),
        isCurrentMonth: false,
        fullDate: prevDate.toISOString().split('T')[0]
      });
    }
    
    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const fullDate = new Date(year, month, day).toISOString().split('T')[0];
      days.push({
        date: day,
        isCurrentMonth: true,
        fullDate
      });
    }
    
    // Días del mes siguiente para completar la grilla
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({
        date: day,
        isCurrentMonth: false,
        fullDate: nextDate.toISOString().split('T')[0]
      });
    }
    
    return days;
  };

  const getAppointmentsForDate = (date: string) => {
    return appointments.filter(apt => apt.date === date);
  };

  const getFilteredAppointments = () => {
    if (selectedStatus === 'all') return appointments;
    return appointments.filter(apt => apt.status === selectedStatus);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const formatTime = (time: string) => {
    return time;
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const days = getDaysInMonth(currentDate);
  const filteredAppointments = getFilteredAppointments();

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calendario de Citas</h1>
            <p className="text-gray-600 mt-2">Gestiona y visualiza las citas médicas</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Cita
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth('prev')}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth('next')}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Days of week header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {dayNames.map(day => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, index) => {
                    const dayAppointments = getAppointmentsForDate(day.fullDate);
                    const isSelected = selectedDate === day.fullDate;
                    const isToday = day.fullDate === new Date().toISOString().split('T')[0];
                    
                    return (
                      <div
                        key={index}
                        className={`
                          min-h-[80px] p-1 border border-gray-200 cursor-pointer transition-colors
                          ${day.isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 text-gray-400'}
                          ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
                          ${isToday ? 'bg-blue-100' : ''}
                        `}
                        onClick={() => setSelectedDate(day.fullDate)}
                      >
                        <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : ''}`}>
                          {day.date}
                        </div>
                        <div className="space-y-1">
                          {dayAppointments.slice(0, 2).map(apt => {
                            const statusInfo = statusConfig[apt.status as keyof typeof statusConfig];
                            return (
                              <div
                                key={apt.id}
                                className={`text-xs p-1 rounded ${statusInfo.bgColor} ${statusInfo.textColor} truncate`}
                                title={`${apt.time} - ${apt.patient.firstName} ${apt.patient.lastName}`}
                              >
                                {apt.time} {apt.patient.firstName}
                              </div>
                            );
                          })}
                          {dayAppointments.length > 2 && (
                            <div className="text-xs text-gray-500 text-center">
                              +{dayAppointments.length - 2} más
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-blue-500" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado de Citas
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <option value="all">Todos los estados</option>
                      <option value="pending_confirmation">Pendientes</option>
                      <option value="confirmed">Confirmadas</option>
                      <option value="scheduled">Programadas</option>
                      <option value="completed">Completadas</option>
                      <option value="cancelled">Canceladas</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Selected Date Appointments */}
            {selectedDate && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    Citas del {new Date(selectedDate).toLocaleDateString('es-ES')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getAppointmentsForDate(selectedDate).length > 0 ? (
                      getAppointmentsForDate(selectedDate).map(apt => {
                        const statusInfo = statusConfig[apt.status as keyof typeof statusConfig];
                        const TypeIcon = typeConfig[apt.type as keyof typeof typeConfig]?.icon || User;
                        
                        return (
                          <div key={apt.id} className="border border-gray-200 rounded-lg p-3">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <TypeIcon className="w-4 h-4 text-gray-500" />
                                <span className="font-medium text-sm">
                                  {apt.time}
                                </span>
                              </div>
                              <span className={`px-2 py-1 text-xs rounded-full ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                                {statusInfo.label}
                              </span>
                            </div>
                            
                            <div className="text-sm space-y-1">
                              <p className="font-medium text-gray-900">
                                {apt.patient.firstName} {apt.patient.lastName}
                              </p>
                              <p className="text-gray-600">
                                {apt.doctor.firstName} {apt.doctor.lastName}
                              </p>
                              <p className="text-gray-500 text-xs">
                                {apt.reason}
                              </p>
                            </div>
                            
                            <div className="flex gap-1 mt-3">
                              <Button size="sm" variant="outline" className="text-xs">
                                <Eye className="w-3 h-3 mr-1" />
                                Ver
                              </Button>
                              <Button size="sm" variant="outline" className="text-xs">
                                <Edit className="w-3 h-3 mr-1" />
                                Editar
                              </Button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-4">
                        <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">
                          No hay citas programadas
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Today's Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  Resumen de Hoy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(statusConfig).map(([status, config]) => {
                    const count = filteredAppointments.filter(apt => 
                      apt.status === status && apt.date === new Date().toISOString().split('T')[0]
                    ).length;
                    
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${config.color}`}></div>
                          <span className="text-sm text-gray-600">{config.label}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SecretaryCalendar;