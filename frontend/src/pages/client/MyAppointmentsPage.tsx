// 📅 Página de Mis Citas para Cliente

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { appointmentService } from '../../services/appointmentService';
import { useAuth } from '../../contexts/AuthContext';
import type { AppointmentFilters, Appointment } from '../../types/appointment';

// 🎨 Componentes UI
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Layout from '../../components/layout/Layout';

// 🎯 Iconos
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Phone,
  Search,
  Filter,
  X,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';

/**
 * 📅 PÁGINA MIS CITAS - CLIENTE
 * 
 * Permite al cliente ver y gestionar sus citas médicas:
 * - Ver historial de citas
 * - Filtrar por estado y fecha
 * - Cancelar citas futuras
 * - Ver detalles de cada cita
 */
const MyAppointmentsPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<AppointmentFilters>({});
  const [searchTerm, setSearchTerm] = useState('');

  // 📊 Consulta de citas del usuario
  const { 
    data: appointments, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['my-appointments', filters],
    queryFn: () => appointmentService.getMyAppointments(filters),
    staleTime: 2 * 60 * 1000, // 2 minutos
  });

  // 🔄 Mutación para cancelar cita
  const cancelAppointmentMutation = useMutation({
    mutationFn: appointmentService.cancelAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-appointments'] });
    },
    onError: (error: any) => {
      console.error('Error al cancelar cita:', error);
    }
  });

  // 🎯 Handlers
  const handleFilterChange = (key: keyof AppointmentFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const handleCancelAppointment = (appointmentId: number) => {
    if (window.confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
      cancelAppointmentMutation.mutate(appointmentId);
    }
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  // 🎨 Función para obtener el color del estado
  const getStatusColor = (status: string) => {
    const statusColors = {
      'scheduled': 'blue',
      'confirmed': 'green',
      'completed': 'gray',
      'cancelled': 'red',
      'no_show': 'red'
    };
    return statusColors[status as keyof typeof statusColors] || 'gray';
  };

  // 🎨 Función para obtener el badge del estado
  const getStatusBadge = (appointment: Appointment) => {
    const color = getStatusColor(appointment.status);
    const colorClasses = {
      'green': 'bg-green-100 text-green-800',
      'blue': 'bg-blue-100 text-blue-800',
      'yellow': 'bg-yellow-100 text-yellow-800',
      'red': 'bg-red-100 text-red-800',
      'gray': 'bg-gray-100 text-gray-800'
    };

    return (
      <Badge className={colorClasses[color as keyof typeof colorClasses]}>
        {appointment.status_display}
      </Badge>
    );
  };

  // 🔄 Estados de carga
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
          <span className="ml-2">Cargando citas...</span>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar citas</h2>
            <p className="text-gray-600">No se pudieron cargar las citas médicas.</p>
          </div>
        </div>
      </Layout>
    );
  }

  // 🔍 Filtrar citas por término de búsqueda
  const filteredAppointments = appointments?.results?.filter(appointment => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      appointment.doctor_name?.toLowerCase().includes(searchLower) ||
      appointment.specialty?.toLowerCase().includes(searchLower) ||
      appointment.reason?.toLowerCase().includes(searchLower)
    );
  }) || [];

  return (
    <Layout>
      <div className="space-y-6">
      {/* 📋 Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Citas</h1>
          <p className="text-gray-600">Gestiona tus citas médicas</p>
        </div>
        <div className="text-sm text-gray-500">
          Total: {filteredAppointments.length} citas
        </div>
      </div>

      {/* 🔍 Filtros y Búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por doctor, especialidad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Estado */}
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="scheduled">Programada</option>
              <option value="confirmed">Confirmada</option>
              <option value="completed">Completada</option>
              <option value="cancelled">Cancelada</option>
            </select>

            {/* Fecha desde */}
            <Input
              type="date"
              value={filters.date_from || ''}
              onChange={(e) => handleFilterChange('date_from', e.target.value)}
              placeholder="Fecha desde"
            />

            {/* Fecha hasta */}
            <Input
              type="date"
              value={filters.date_to || ''}
              onChange={(e) => handleFilterChange('date_to', e.target.value)}
              placeholder="Fecha hasta"
            />
          </div>

          {/* Limpiar filtros */}
          {(Object.keys(filters).length > 0 || searchTerm) && (
            <div className="mt-4">
              <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Limpiar filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 📅 Lista de Citas */}
      {filteredAppointments.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay citas</h3>
            <p className="text-gray-600">
              {appointments?.length === 0 
                ? 'Aún no tienes citas programadas.' 
                : 'No se encontraron citas con los filtros aplicados.'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Dr. {appointment.doctor_name}
                      </h3>
                      {getStatusBadge(appointment)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {format(parseISO(appointment.date), 'EEEE, d MMMM yyyy', { locale: es })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{appointment.time}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{appointment.specialty}</span>
                      </div>

                      {appointment.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{appointment.location}</span>
                        </div>
                      )}
                    </div>

                    {appointment.reason && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-700">
                          <strong>Motivo:</strong> {appointment.reason}
                        </p>
                      </div>
                    )}

                    {appointment.notes && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          <strong>Notas:</strong> {appointment.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-col gap-2 ml-4">
                    {appointment.status === 'scheduled' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelAppointment(appointment.id)}
                        disabled={cancelAppointmentMutation.isPending}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700"
                      >
                        <XCircle className="h-4 w-4" />
                        Cancelar
                      </Button>
                    )}

                    {appointment.status === 'confirmed' && (
                      <div className="flex items-center gap-2 text-green-600 text-sm">
                        <CheckCircle className="h-4 w-4" />
                        Confirmada
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      </div>
    </Layout>
  );
};

export default MyAppointmentsPage;