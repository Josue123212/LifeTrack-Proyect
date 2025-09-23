// 🏥 Página de Historial Médico del Cliente
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  Activity, 
  Heart,
  Pill,
  AlertTriangle,
  TrendingUp,
  Filter,
  Download,
  Search
} from 'lucide-react';

import { appointmentService } from '../../services/appointmentService';
import { dashboardService } from '../../services/dashboardService';
import { useAuth } from '../../contexts/AuthContext';
import type { Appointment, ExtendedPatientAppointmentHistory, MedicalHistoryAppointment } from '../../types/appointment';
import type { DashboardData } from '../../types/dashboard';

// 🎨 Componentes UI
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Layout from '../../components/layout/Layout';

/**
 * 🏥 PÁGINA HISTORIAL MÉDICO - CLIENTE
 * 
 * Permite al cliente ver su historial médico completo:
 * - Estadísticas de salud
 * - Historial de citas
 * - Diagnósticos y tratamientos
 * - Medicamentos prescritos
 * - Exportar historial
 */
const MedicalHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');

  // 📊 Consulta del historial médico
  const { 
    data: medicalHistory, 
    isLoading: isLoadingHistory, 
    error: historyError 
  } = useQuery({
    queryKey: ['medical-history', user?.patient_profile_id, selectedYear, selectedSpecialty],
    queryFn: () => {
      if (!user?.patient_profile_id) throw new Error('Perfil de paciente no encontrado');
      return appointmentService.getPatientHistory(user.patient_profile_id, {
        date_from: selectedYear ? `${selectedYear}-01-01` : undefined,
        date_to: selectedYear ? `${selectedYear}-12-31` : undefined,
      });
    },
    enabled: !!user?.patient_profile_id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // 📈 Consulta de datos del dashboard
  const { 
    data: dashboardData, 
    isLoading: isLoadingDashboard 
  } = useQuery({
    queryKey: ['client-dashboard'],
    queryFn: dashboardService.getClientDashboard,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });

  // 🎯 Handlers
  const handleExportHistory = () => {
    // TODO: Implementar exportación de historial
    console.log('Exportar historial médico');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedYear(new Date().getFullYear().toString());
    setSelectedSpecialty('');
  };

  // 🔄 Estados de carga
  if (isLoadingHistory || isLoadingDashboard) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
          <span className="ml-2">Cargando historial médico...</span>
        </div>
      </Layout>
    );
  }

  if (historyError) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar historial</h2>
            <p className="text-gray-600">No se pudo cargar el historial médico.</p>
          </div>
        </div>
      </Layout>
    );
  }

  // 🔍 Filtrar citas por término de búsqueda
  const filteredAppointments = medicalHistory?.appointments?.filter(appointment => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      appointment.doctor_name?.toLowerCase().includes(searchLower) ||
      appointment.specialty?.toLowerCase().includes(searchLower) ||
      appointment.diagnosis?.toLowerCase().includes(searchLower) ||
      appointment.treatment?.toLowerCase().includes(searchLower)
    );
  }) || [];

  // 📊 Estadísticas calculadas
  const totalAppointments = medicalHistory?.appointments?.length || 0;
  const completedAppointments = medicalHistory?.appointments?.filter(apt => apt.status === 'completed').length || 0;
  const uniqueSpecialties = new Set(medicalHistory?.appointments?.map(apt => apt.specialty)).size || 0;
  const uniqueDoctors = new Set(medicalHistory?.appointments?.map(apt => apt.doctor_name)).size || 0;

  return (
    <Layout>
      <div className="space-y-6">
      {/* 📋 Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Historial Médico</h1>
          <p className="text-gray-600">Tu historial médico completo</p>
        </div>
        <Button onClick={handleExportHistory} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exportar Historial
        </Button>
      </div>

      {/* 📊 Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Citas</p>
                <p className="text-2xl font-bold text-gray-900">{totalAppointments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completadas</p>
                <p className="text-2xl font-bold text-gray-900">{completedAppointments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Especialidades</p>
                <p className="text-2xl font-bold text-gray-900">{uniqueSpecialties}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Heart className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Doctores</p>
                <p className="text-2xl font-bold text-gray-900">{uniqueDoctors}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 🔍 Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar en historial..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Año */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los años</option>
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                );
              })}
            </select>

            {/* Especialidad */}
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las especialidades</option>
              {Array.from(new Set(medicalHistory?.appointments?.map(apt => apt.specialty) || [])).map(specialty => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>

            {/* Limpiar filtros */}
            <Button variant="outline" onClick={clearFilters}>
              Limpiar filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 📋 Historial de Citas */}
      {filteredAppointments.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay registros</h3>
            <p className="text-gray-600">
              {totalAppointments === 0 
                ? 'Aún no tienes historial médico.' 
                : 'No se encontraron registros con los filtros aplicados.'
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
                      <Badge className="bg-blue-100 text-blue-800">
                        {appointment.specialty}
                      </Badge>
                      {appointment.status === 'completed' && (
                        <Badge className="bg-green-100 text-green-800">
                          Completada
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
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
                    </div>

                    {/* Diagnóstico */}
                    {appointment.diagnosis && (
                      <div className="mb-3">
                        <h4 className="font-medium text-gray-900 mb-1">Diagnóstico:</h4>
                        <p className="text-sm text-gray-700">{appointment.diagnosis}</p>
                      </div>
                    )}

                    {/* Tratamiento */}
                    {appointment.treatment && (
                      <div className="mb-3">
                        <h4 className="font-medium text-gray-900 mb-1">Tratamiento:</h4>
                        <p className="text-sm text-gray-700">{appointment.treatment}</p>
                      </div>
                    )}

                    {/* Medicamentos */}
                    {appointment.medications && appointment.medications.length > 0 && (
                      <div className="mb-3">
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <Pill className="h-4 w-4" />
                          Medicamentos:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {appointment.medications.map((medication, index) => (
                            <Badge key={index} className="bg-purple-100 text-purple-800">
                              {medication}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notas */}
                    {appointment.notes && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Notas:</h4>
                        <p className="text-sm text-gray-600">{appointment.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 📊 Resumen del Año */}
      {medicalHistory?.summary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Resumen del Año {selectedYear}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{medicalHistory.summary.total_visits}</p>
                <p className="text-sm text-gray-600">Visitas Totales</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{medicalHistory.summary.preventive_care}</p>
                <p className="text-sm text-gray-600">Cuidado Preventivo</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{medicalHistory.summary.follow_ups}</p>
                <p className="text-sm text-gray-600">Seguimientos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      </div>
    </Layout>
  );
};

export default MedicalHistoryPage;