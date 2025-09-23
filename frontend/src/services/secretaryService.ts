// 👩‍💼 Servicio para operaciones de Secretarias

import { apiHelpers } from './api';
import type {
  SecretaryProfile,
  SecretaryProfileData,
  SecretaryStats,
  SecretaryAppointment,
  CreateAppointmentData,
  UpdateSecretaryAppointmentData,
  SecretaryPatient,
  PatientData,
  AvailableDoctor,
  DoctorAvailableSlots,
  AppointmentFilters,
  PatientFilters,
  SecretaryAppointmentsResponse,
  SecretaryPatientsResponse,
  SecretaryActivityReport
} from '../types/secretary';

/**
 * Servicio para manejar todas las operaciones relacionadas con secretarias
 */
export const secretaryService = {
  // ==========================================
  // PERFIL DE SECRETARIA
  // ==========================================

  /**
   * Obtener perfil de la secretaria autenticada
   * GET /api/secretaries/me/
   */
  getMyProfile: async (): Promise<SecretaryProfile> => {
    return apiHelpers.get<SecretaryProfile>('/secretaries/me/');
  },

  /**
   * Actualizar perfil de la secretaria autenticada
   * PUT /api/secretaries/me/
   */
  updateMyProfile: async (profileData: SecretaryProfileData): Promise<SecretaryProfile> => {
    return apiHelpers.put<SecretaryProfile>('/secretaries/me/', profileData);
  },

  /**
   * Obtener estadísticas del dashboard de secretaria
   * GET /api/secretaries/dashboard/
   */
  getDashboardStats: async (): Promise<SecretaryStats> => {
    return apiHelpers.get<SecretaryStats>('/secretaries/dashboard/');
  },

  // ==========================================
  // GESTIÓN DE CITAS
  // ==========================================

  /**
   * Obtener todas las citas (con filtros)
   * GET /api/secretaries/appointments/
   */
  getAppointments: async (filters?: AppointmentFilters & { page?: number }): Promise<SecretaryAppointmentsResponse> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const queryString = params.toString();
    const url = queryString ? `/secretaries/appointments/?${queryString}` : '/secretaries/appointments/';
    
    return apiHelpers.get<SecretaryAppointmentsResponse>(url);
  },

  /**
   * Obtener una cita específica
   * GET /api/secretaries/appointments/{id}/
   */
  getAppointment: async (appointmentId: number): Promise<SecretaryAppointment> => {
    return apiHelpers.get<SecretaryAppointment>(`/secretaries/appointments/${appointmentId}/`);
  },

  /**
   * Crear nueva cita para un paciente
   * POST /api/secretaries/appointments/
   */
  createAppointment: async (appointmentData: CreateAppointmentData): Promise<SecretaryAppointment> => {
    return apiHelpers.post<SecretaryAppointment>('/secretaries/appointments/', appointmentData);
  },

  /**
   * Actualizar una cita existente
   * PATCH /api/secretaries/appointments/{id}/
   */
  updateAppointment: async (
    appointmentId: number,
    updateData: UpdateSecretaryAppointmentData
  ): Promise<SecretaryAppointment> => {
    return apiHelpers.patch<SecretaryAppointment>(
      `/secretaries/appointments/${appointmentId}/`,
      updateData
    );
  },

  /**
   * Cancelar una cita
   * POST /api/secretaries/appointments/{id}/cancel/
   */
  cancelAppointment: async (
    appointmentId: number,
    reason?: string
  ): Promise<SecretaryAppointment> => {
    return apiHelpers.post<SecretaryAppointment>(
      `/secretaries/appointments/${appointmentId}/cancel/`,
      { reason }
    );
  },

  /**
   * Confirmar una cita
   * POST /api/secretaries/appointments/{id}/confirm/
   */
  confirmAppointment: async (appointmentId: number): Promise<SecretaryAppointment> => {
    return apiHelpers.post<SecretaryAppointment>(
      `/secretaries/appointments/${appointmentId}/confirm/`
    );
  },

  /**
   * Reprogramar una cita
   * POST /api/secretaries/appointments/{id}/reschedule/
   */
  rescheduleAppointment: async (
    appointmentId: number,
    newDateTime: {
      appointment_date: string;
      appointment_time: string;
    }
  ): Promise<SecretaryAppointment> => {
    return apiHelpers.post<SecretaryAppointment>(
      `/secretaries/appointments/${appointmentId}/reschedule/`,
      newDateTime
    );
  },

  // ==========================================
  // GESTIÓN DE PACIENTES
  // ==========================================

  /**
   * Obtener lista de pacientes
   * GET /api/secretaries/patients/
   */
  getPatients: async (filters?: PatientFilters & { page?: number }): Promise<SecretaryPatientsResponse> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const queryString = params.toString();
    const url = queryString ? `/secretaries/patients/?${queryString}` : '/secretaries/patients/';
    
    return apiHelpers.get<SecretaryPatientsResponse>(url);
  },

  /**
   * Obtener un paciente específico
   * GET /api/secretaries/patients/{id}/
   */
  getPatient: async (patientId: number): Promise<SecretaryPatient> => {
    return apiHelpers.get<SecretaryPatient>(`/secretaries/patients/${patientId}/`);
  },

  /**
   * Crear nuevo paciente
   * POST /api/secretaries/patients/
   */
  createPatient: async (patientData: PatientData): Promise<SecretaryPatient> => {
    return apiHelpers.post<SecretaryPatient>('/secretaries/patients/', patientData);
  },

  /**
   * Actualizar información de paciente
   * PATCH /api/secretaries/patients/{id}/
   */
  updatePatient: async (
    patientId: number,
    updateData: Partial<PatientData>
  ): Promise<SecretaryPatient> => {
    return apiHelpers.patch<SecretaryPatient>(
      `/secretaries/patients/${patientId}/`,
      updateData
    );
  },

  /**
   * Obtener historial de citas de un paciente
   * GET /api/secretaries/patients/{id}/appointments/
   */
  getPatientAppointments: async (
    patientId: number,
    filters?: { date_from?: string; date_to?: string }
  ): Promise<SecretaryAppointment[]> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }

    const queryString = params.toString();
    const url = queryString 
      ? `/secretaries/patients/${patientId}/appointments/?${queryString}`
      : `/secretaries/patients/${patientId}/appointments/`;
    
    return apiHelpers.get<SecretaryAppointment[]>(url);
  },

  // ==========================================
  // GESTIÓN DE DOCTORES Y HORARIOS
  // ==========================================

  /**
   * Obtener lista de doctores disponibles
   * GET /api/secretaries/doctors/
   */
  getAvailableDoctors: async (filters?: {
    specialization?: string;
    is_available?: boolean;
    date?: string;
  }): Promise<AvailableDoctor[]> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const queryString = params.toString();
    const url = queryString ? `/secretaries/doctors/?${queryString}` : '/secretaries/doctors/';
    
    return apiHelpers.get<AvailableDoctor[]>(url);
  },

  /**
   * Obtener horarios disponibles de un doctor específico
   * GET /api/secretaries/doctors/{id}/available-slots/
   */
  getDoctorAvailableSlots: async (
    doctorId: number,
    date: string
  ): Promise<DoctorAvailableSlots> => {
    return apiHelpers.get<DoctorAvailableSlots>(
      `/secretaries/doctors/${doctorId}/available-slots/?date=${date}`
    );
  },

  /**
   * Verificar disponibilidad de un doctor en un horario específico
   * GET /api/secretaries/doctors/{id}/check-availability/
   */
  checkDoctorAvailability: async (
    doctorId: number,
    date: string,
    time: string
  ): Promise<{ is_available: boolean; reason?: string }> => {
    return apiHelpers.get(
      `/secretaries/doctors/${doctorId}/check-availability/?date=${date}&time=${time}`
    );
  },

  // ==========================================
  // REPORTES Y ESTADÍSTICAS
  // ==========================================

  /**
   * Obtener reporte de actividades de la secretaria
   * GET /api/secretaries/reports/activity/
   */
  getActivityReport: async (params: {
    date_from: string;
    date_to: string;
  }): Promise<SecretaryActivityReport[]> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      queryParams.append(key, value);
    });

    return apiHelpers.get(`/secretaries/reports/activity/?${queryParams.toString()}`);
  },

  /**
   * Obtener reporte de citas por período
   * GET /api/secretaries/reports/appointments/
   */
  getAppointmentsReport: async (params: {
    date_from: string;
    date_to: string;
    doctor_id?: number;
    status?: string;
    format?: 'json' | 'csv' | 'pdf';
  }): Promise<{
    total_appointments: number;
    completed_appointments: number;
    cancelled_appointments: number;
    no_show_appointments: number;
    period_data: Array<{
      period: string;
      appointments_count: number;
      completed_count: number;
      cancelled_count: number;
    }>;
    doctor_stats?: Array<{
      doctor_id: number;
      doctor_name: string;
      appointments_count: number;
      completion_rate: number;
    }>;
  }> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    return apiHelpers.get(`/secretaries/reports/appointments/?${queryParams.toString()}`);
  },

  /**
   * Obtener estadísticas de pacientes
   * GET /api/secretaries/reports/patients/
   */
  getPatientsReport: async (params: {
    date_from: string;
    date_to: string;
    group_by?: 'day' | 'week' | 'month';
  }): Promise<{
    total_patients: number;
    new_patients: number;
    returning_patients: number;
    period_data: Array<{
      period: string;
      new_patients: number;
      total_appointments: number;
    }>;
  }> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    return apiHelpers.get(`/secretaries/reports/patients/?${queryParams.toString()}`);
  },

  // ==========================================
  // BÚSQUEDAS Y UTILIDADES
  // ==========================================

  /**
   * Buscar pacientes por nombre, email o teléfono
   */
  searchPatients: async (query: string): Promise<SecretaryPatient[]> => {
    const response = await secretaryService.getPatients({ search: query });
    return response.results;
  },

  /**
   * Buscar citas por criterios múltiples
   */
  searchAppointments: async (query: string): Promise<SecretaryAppointment[]> => {
    const response = await secretaryService.getAppointments({ search: query });
    return response.results;
  },

  /**
   * Obtener próximas citas del día
   */
  getTodayAppointments: async (): Promise<SecretaryAppointment[]> => {
    const today = new Date().toISOString().split('T')[0];
    const response = await secretaryService.getAppointments({
      date_from: today,
      date_to: today
    });
    return response.results;
  },

  /**
   * Obtener citas pendientes de confirmación
   */
  getPendingAppointments: async (): Promise<SecretaryAppointment[]> => {
    const response = await secretaryService.getAppointments({
      status: 'scheduled'
    });
    return response.results;
  },

  /**
   * Validar si se puede crear una cita en un horario específico
   */
  validateAppointmentSlot: async (
    doctorId: number,
    date: string,
    time: string
  ): Promise<{
    is_valid: boolean;
    conflicts?: SecretaryAppointment[];
    reason?: string;
  }> => {
    try {
      // Verificar disponibilidad del doctor
      const availability = await secretaryService.checkDoctorAvailability(
        doctorId, 
        date, 
        time
      );

      if (!availability.is_available) {
        return {
          is_valid: false,
          reason: availability.reason || 'Doctor no disponible'
        };
      }

      // Verificar conflictos de citas existentes
      const existingAppointments = await secretaryService.getAppointments({
        doctor_id: doctorId,
        date_from: date,
        date_to: date
      });

      const conflicts = existingAppointments.results.filter(
        apt => apt.appointment_time === time && 
               apt.status !== 'cancelled'
      );

      return {
        is_valid: conflicts.length === 0,
        conflicts: conflicts.length > 0 ? conflicts : undefined,
        reason: conflicts.length > 0 ? 'Horario ya ocupado' : undefined
      };
    } catch {
      return {
        is_valid: false,
        reason: 'Error al validar horario'
      };
    }
  },

  /**
   * Obtener resumen de actividades del día
   */
  getDailySummary: async (date?: string): Promise<{
    date: string;
    total_appointments: number;
    confirmed_appointments: number;
    pending_appointments: number;
    cancelled_appointments: number;
    new_patients: number;
    busy_doctors: number;
    available_doctors: number;
  }> => {
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    // Obtener estadísticas del dashboard
    const stats = await secretaryService.getDashboardStats();
    
    // Obtener citas del día
    const appointments = await secretaryService.getAppointments({
      date_from: targetDate,
      date_to: targetDate
    });

    // Obtener doctores disponibles
    const doctors = await secretaryService.getAvailableDoctors({
      date: targetDate
    });

    return {
      date: targetDate,
      total_appointments: appointments.results.length,
      confirmed_appointments: appointments.results.filter(apt => apt.status === 'confirmed').length,
      pending_appointments: appointments.results.filter(apt => apt.status === 'scheduled').length,
      cancelled_appointments: appointments.results.filter(apt => apt.status === 'cancelled').length,
      new_patients: stats.new_patients_today,
      busy_doctors: doctors.filter(doc => !doc.is_available).length,
      available_doctors: doctors.filter(doc => doc.is_available).length
    };
  }
};

// Exportar por defecto
export default secretaryService;