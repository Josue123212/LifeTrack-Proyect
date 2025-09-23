import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import LoadingSpinner from '../ui/LoadingSpinner';
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  DocumentTextIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import type { 
  Appointment, 
  CreateAppointmentData, 
  UpdateAppointmentData 
} from '../../types/appointment';
import { doctorService } from '../../services/doctorService';
import { appointmentService } from '../../services/appointmentService';

// 🎯 OBJETIVO: Formulario reutilizable para crear y editar citas
// 💡 CONCEPTO: Form con validación, selección de doctor y horarios disponibles

// 📋 Schema de validación con Zod
const appointmentSchema = z.object({
  patient: z.number().min(1, 'Selecciona un paciente'),
  doctor: z.number().min(1, 'Selecciona un doctor'),
  date: z.string().min(1, 'Selecciona una fecha'),
  time: z.string().min(1, 'Selecciona una hora'),
  reason: z.string().min(10, 'El motivo debe tener al menos 10 caracteres'),
  notes: z.string().optional()
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  appointment?: Appointment;
  onSubmit: (data: CreateAppointmentData | UpdateAppointmentData) => void;
  onCancel: () => void;
  loading?: boolean;
  error?: string;
  mode: 'create' | 'edit';
  preselectedPatient?: number;
  preselectedDoctor?: number;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  appointment,
  onSubmit,
  onCancel,
  loading = false,
  error,
  mode,
  preselectedPatient,
  preselectedDoctor
}) => {
  // 🔧 Estados locales
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(
    preselectedDoctor || appointment?.doctor || null
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    appointment?.date || ''
  );
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  // 📝 Configuración del formulario
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patient: preselectedPatient || appointment?.patient || 0,
      doctor: preselectedDoctor || appointment?.doctor || 0,
      date: appointment?.date || '',
      time: appointment?.time || '',
      reason: appointment?.reason || '',
      notes: appointment?.notes || ''
    }
  });

  // 👀 Observar cambios en doctor y fecha
  const watchedDoctor = watch('doctor');
  const watchedDate = watch('date');

  // 👨‍⚕️ Query para obtener doctores disponibles
  const { data: doctorsData, isLoading: doctorsLoading } = useQuery({
    queryKey: ['doctors', 'public'],
    queryFn: () => doctorService.getPublicDoctors(),
    staleTime: 10 * 60 * 1000 // 10 minutos
  });

  // 🕐 Efecto para cargar horarios disponibles
  useEffect(() => {
    const loadAvailableSlots = async () => {
      if (selectedDoctor && selectedDate) {
        try {
          const slots = await appointmentService.getAvailableSlots(
            selectedDoctor, 
            selectedDate
          );
          setAvailableSlots(slots.available_slots);
        } catch (error) {
          console.error('Error loading available slots:', error);
          setAvailableSlots([]);
        }
      } else {
        setAvailableSlots([]);
      }
    };

    loadAvailableSlots();
  }, [selectedDoctor, selectedDate]);

  // 🔄 Efecto para sincronizar estados
  useEffect(() => {
    if (watchedDoctor !== selectedDoctor) {
      setSelectedDoctor(watchedDoctor);
    }
  }, [watchedDoctor]);

  useEffect(() => {
    if (watchedDate !== selectedDate) {
      setSelectedDate(watchedDate);
    }
  }, [watchedDate]);

  // 📅 Obtener fecha mínima (hoy)
  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // 📝 Manejar envío del formulario
  const onFormSubmit = (data: AppointmentFormData) => {
    const formattedData = {
      ...data,
      time: data.time.length === 5 ? `${data.time}:00` : data.time
    };

    onSubmit(formattedData);
  };

  // 🎨 Render del componente
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">
            {mode === 'create' ? 'Nueva Cita Médica' : 'Editar Cita'}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="p-2"
          >
            <XMarkIcon className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* ⚠️ Error general */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* 👨‍⚕️ Selección de Doctor */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <UserIcon className="h-4 w-4" />
              <span>Doctor</span>
            </label>
            <select
              {...register('doctor', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading || doctorsLoading}
            >
              <option value={0}>Selecciona un doctor</option>
              {doctorsData?.results.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  Dr. {doctor.user.firstName} {doctor.user.lastName} - {doctor.specialization}
                </option>
              ))}
            </select>
            {errors.doctor && (
              <p className="text-red-600 text-sm">{errors.doctor.message}</p>
            )}
          </div>

          {/* 📅 Selección de Fecha */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <CalendarIcon className="h-4 w-4" />
              <span>Fecha</span>
            </label>
            <Input
              type="date"
              {...register('date')}
              min={getMinDate()}
              disabled={loading}
              className="w-full"
            />
            {errors.date && (
              <p className="text-red-600 text-sm">{errors.date.message}</p>
            )}
          </div>

          {/* 🕐 Selección de Hora */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <ClockIcon className="h-4 w-4" />
              <span>Hora</span>
            </label>
            {availableSlots.length > 0 ? (
              <select
                {...register('time')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="">Selecciona una hora</option>
                {availableSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {new Date(`2000-01-01T${slot}`).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </option>
                ))}
              </select>
            ) : selectedDoctor && selectedDate ? (
              <div className="flex items-center justify-center py-8 text-gray-500">
                <LoadingSpinner size="sm" />
                <span className="ml-2">Cargando horarios disponibles...</span>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
                Selecciona un doctor y fecha para ver horarios disponibles
              </div>
            )}
            {errors.time && (
              <p className="text-red-600 text-sm">{errors.time.message}</p>
            )}
          </div>

          {/* 📝 Motivo de la consulta */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <DocumentTextIcon className="h-4 w-4" />
              <span>Motivo de la consulta</span>
            </label>
            <textarea
              {...register('reason')}
              rows={3}
              placeholder="Describe el motivo de la consulta..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={loading}
            />
            {errors.reason && (
              <p className="text-red-600 text-sm">{errors.reason.message}</p>
            )}
          </div>

          {/* 📋 Notas adicionales */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Notas adicionales (opcional)
            </label>
            <textarea
              {...register('notes')}
              rows={2}
              placeholder="Información adicional relevante..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={loading}
            />
          </div>

          {/* 🔧 Botones de acción */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || availableSlots.length === 0}
              className="flex items-center space-x-2"
            >
              {loading && <LoadingSpinner size="sm" />}
              <span>
                {mode === 'create' ? 'Crear Cita' : 'Guardar Cambios'}
              </span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AppointmentForm;

// 📋 EXPLICACIÓN:
// 1. **Validación Robusta**: Usa Zod para validación de tipos y reglas
// 2. **React Hook Form**: Manejo eficiente de formularios con menos re-renders
// 3. **Horarios Dinámicos**: Carga horarios disponibles según doctor y fecha
// 4. **Modo Dual**: Funciona para crear y editar citas
// 5. **UX Optimizada**: Estados de carga, errores y validación en tiempo real
// 6. **Accesible**: Labels apropiados y navegación por teclado
// 7. **Responsive**: Se adapta a diferentes tamaños de pantalla

// 🚀 PRÓXIMOS PASOS:
// - Agregar selección de paciente para admins
// - Implementar autocompletado para búsqueda
// - Añadir validación de conflictos de horarios
// - Integrar notificaciones de confirmación