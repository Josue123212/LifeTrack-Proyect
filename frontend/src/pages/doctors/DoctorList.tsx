// 🏥 Lista de Doctores - Gestión y Visualización

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { doctorService } from '../../services';
import type { DoctorFilters } from '../../types';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/Badge';
import { 
  UserIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

/**
 * 🎯 OBJETIVO: Lista completa de doctores con filtros y búsqueda
 * 
 * 💡 CONCEPTO: Página de gestión que permite:
 * - Ver todos los doctores del sistema
 * - Filtrar por especialización, disponibilidad, etc.
 * - Buscar por nombre o especialización
 * - Ver detalles básicos de cada doctor
 * - Acceder al perfil completo
 */

const DoctorList: React.FC = () => {
  // ==========================================
  // HOOKS
  // ==========================================
  const navigate = useNavigate();

  // ==========================================
  // ESTADO LOCAL
  // ==========================================
  const [filters, setFilters] = useState<DoctorFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // ==========================================
  // QUERIES
  // ==========================================
  const { 
    data: doctorsResponse, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['doctors', filters, searchTerm],
    queryFn: () => doctorService.getPublicDoctors({
      ...filters,
      search: searchTerm || undefined
    }),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // ==========================================
  // HANDLERS
  // ==========================================
  const updateFilters = (newFilters: Partial<DoctorFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // ==========================================
  // UTILIDADES
  // ==========================================
  const getAvailabilityBadge = (isAvailable: boolean) => {
    return isAvailable ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        <CheckCircleIcon className="h-3 w-3 mr-1" />
        Disponible
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-red-100 text-red-800">
        <XCircleIcon className="h-3 w-3 mr-1" />
        No disponible
      </Badge>
    );
  };

  const formatWorkDays = (workDays: string[]) => {
    const dayNames: Record<string, string> = {
      'monday': 'Lun',
      'tuesday': 'Mar',
      'wednesday': 'Mié',
      'thursday': 'Jue',
      'friday': 'Vie',
      'saturday': 'Sáb',
      'sunday': 'Dom'
    };
    
    return workDays.map(day => dayNames[day] || day).join(', ');
  };

  // ==========================================
  // RENDER
  // ==========================================
  if (error) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600">Error al cargar los doctores</p>
            <Button onClick={() => refetch()} className="mt-4">
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Doctores</h1>
          <p className="text-gray-600 mt-1">
            {doctorsResponse?.count || 0} doctores registrados
          </p>
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nombre o especialización..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Botón de filtros */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <FunnelIcon className="h-4 w-4" />
              <span>Filtros</span>
            </Button>

            {/* Limpiar filtros */}
            {(Object.keys(filters).length > 0 || searchTerm) && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-gray-600"
              >
                Limpiar
              </Button>
            )}
          </div>

          {/* Panel de filtros */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Filtro por especialización */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Especialización
                </label>
                <Input
                  type="text"
                  placeholder="Ej: Cardiología"
                  value={filters.specialization || ''}
                  onChange={(e) => updateFilters({ specialization: e.target.value || undefined })}
                />
              </div>

              {/* Filtro por disponibilidad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Disponibilidad
                </label>
                <select
                  value={filters.is_available?.toString() || ''}
                  onChange={(e) => updateFilters({ 
                    is_available: e.target.value ? e.target.value === 'true' : undefined 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos</option>
                  <option value="true">Disponibles</option>
                  <option value="false">No disponibles</option>
                </select>
              </div>

              {/* Filtro por experiencia mínima */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experiencia mínima (años)
                </label>
                <Input
                  type="number"
                  min="0"
                  placeholder="Ej: 5"
                  value={filters.min_experience || ''}
                  onChange={(e) => updateFilters({ 
                    min_experience: e.target.value ? parseInt(e.target.value) : undefined 
                  })}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de doctores */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctorsResponse?.results.map((doctor) => (
            <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        Dr. {doctor.user.firstName} {doctor.user.lastName}
                      </CardTitle>
                      <p className="text-sm text-gray-600">{doctor.specialization}</p>
                    </div>
                  </div>
                  {getAvailabilityBadge(doctor.is_available)}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Experiencia */}
                  <div className="flex items-center text-sm text-gray-600">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    <span>{doctor.years_experience} años de experiencia</span>
                  </div>

                  {/* Tarifa */}
                  <div className="flex items-center text-sm text-gray-600">
                    <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                    <span>${doctor.consultation_fee} por consulta</span>
                  </div>

                  {/* Horario */}
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span>{formatWorkDays(doctor.work_days)}</span>
                  </div>

                  {/* Horario de trabajo */}
                  <div className="text-sm text-gray-600">
                    <span>{doctor.work_start_time} - {doctor.work_end_time}</span>
                  </div>

                  {/* Bio (truncada) */}
                  {doctor.bio && (
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {doctor.bio}
                    </p>
                  )}

                  {/* Acciones */}
                  <div className="pt-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full flex items-center justify-center space-x-2"
                      onClick={() => navigate(`/dev/doctors/${doctor.id}`)}
                    >
                      <EyeIcon className="h-4 w-4" />
                      <span>Ver perfil</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Estado vacío */}
      {!isLoading && doctorsResponse?.results.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron doctores
            </h3>
            <p className="text-gray-600">
              {searchTerm || Object.keys(filters).length > 0
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'No hay doctores registrados en el sistema'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DoctorList;

// 📋 EXPLICACIÓN:
// 
// 🎯 Funcionalidades implementadas:
// 1. Lista completa de doctores con información básica
// 2. Búsqueda por nombre o especialización
// 3. Filtros por especialización, disponibilidad y experiencia
// 4. Diseño responsive con cards
// 5. Estados de carga y error
// 6. Badges de disponibilidad
// 7. Información detallada de cada doctor
// 
// 🔧 Características técnicas:
// - Integración con doctorService
// - React Query para cache y estados
// - Filtros reactivos
// - UI accesible con Heroicons
// - Responsive design
// 
// 🚀 Próximos pasos:
// 1. Implementar navegación al perfil del doctor
// 2. Agregar paginación
// 3. Crear DoctorProfile.tsx
// 4. Agregar más filtros avanzados