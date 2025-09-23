// 🏥 Servicio para operaciones de Doctores

import { apiHelpers } from './api';
import type {
  DoctorProfile,
  DoctorProfileData,
  DoctorBasicInfo,
  DoctorSchedule,
  DoctorStats,
  DoctorAppointment,
  UpdateAppointmentData,
  DoctorAvailability,
  DoctorsListResponse,
  DoctorFilters
} from '../types/doctor';

/**
 * Servicio para manejar todas las operaciones relacionadas con doctores
 */
export const doctorService = {
  // ==========================================
  // ENDPOINTS PÚBLICOS (sin autenticación)
  // ==========================================

  /**
   * Obtener lista de doctores (público)
   * GET /api/doctors/
   */
  getPublicDoctors: async (filters?: DoctorFilters): Promise<DoctorsListResponse> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }

    return apiHelpers.get<DoctorsListResponse>(`/doctors/?${params.toString()}`);
  },

  /**
   * Obtener detalle de un doctor específico (público)
   * GET /api/doctors/{id}/
   */
  getDoctorDetail: async (doctorId: number): Promise<DoctorBasicInfo> => {
    return apiHelpers.get<DoctorBasicInfo>(`/doctors/${doctorId}/`);
  },

  /**
   * Obtener horarios disponibles de un doctor (público)
   * GET /api/doctors/{id}/schedule/
   */
  getDoctorSchedule: async (doctorId: number, date?: string): Promise<DoctorSchedule> => {
    const params = date ? `?date=${date}` : '';
    return apiHelpers.get<DoctorSchedule>(`/doctors/${doctorId}/schedule/${params}`);
  },

  // ==========================================
  // ENDPOINTS PRIVADOS (requieren autenticación como doctor)
  // ==========================================

  /**
   * Obtener perfil del doctor autenticado
   * GET /api/doctors/me/
   */
  getMyProfile: async (): Promise<DoctorProfile> => {
    return apiHelpers.get<DoctorProfile>('/doctors/me/');
  },

  /**
   * Actualizar perfil del doctor autenticado
   * PUT /api/doctors/me/
   */
  updateMyProfile: async (profileData: DoctorProfileData): Promise<DoctorProfile> => {
    return apiHelpers.put<DoctorProfile>('/doctors/me/', profileData);
  },

  /**
   * Obtener estadísticas del doctor
   * GET /api/doctors/me/stats/
   */
  getMyStats: async (): Promise<DoctorStats> => {
    return apiHelpers.get<DoctorStats>('/doctors/me/stats/');
  },

  /**
   * Obtener citas del doctor autenticado
   * GET /api/doctors/me/appointments/
   */
  getMyAppointments: async (params?: {
    date_from?: string;
    date_to?: string;
    status?: string;
    page?: number;
  }): Promise<{
    count: number;
    next: string | null;
    previous: string | null;
    results: DoctorAppointment[];
  }> => {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const queryString = queryParams.toString();
    const url = queryString ? `/doctors/me/appointments/?${queryString}` : '/doctors/me/appointments/';
    
    return apiHelpers.get(url);
  },

  /**
   * Obtener una cita específica del doctor
   * GET /api/doctors/me/appointments/{id}/
   */
  getMyAppointment: async (appointmentId: number): Promise<DoctorAppointment> => {
    return apiHelpers.get<DoctorAppointment>(`/doctors/me/appointments/${appointmentId}/`);
  },

  /**
   * Actualizar una cita del doctor
   * PATCH /api/doctors/me/appointments/{id}/
   */
  updateMyAppointment: async (
    appointmentId: number, 
    updateData: UpdateAppointmentData
  ): Promise<DoctorAppointment> => {
    return apiHelpers.patch<DoctorAppointment>(
      `/doctors/me/appointments/${appointmentId}/`, 
      updateData
    );
  },

  /**
   * Confirmar una cita
   * POST /api/doctors/me/appointments/{id}/confirm/
   */
  confirmAppointment: async (appointmentId: number): Promise<DoctorAppointment> => {
    return apiHelpers.post<DoctorAppointment>(
      `/doctors/me/appointments/${appointmentId}/confirm/`
    );
  },

  /**
   * Cancelar una cita
   * POST /api/doctors/me/appointments/{id}/cancel/
   */
  cancelAppointment: async (
    appointmentId: number, 
    reason?: string
  ): Promise<DoctorAppointment> => {
    return apiHelpers.post<DoctorAppointment>(
      `/doctors/me/appointments/${appointmentId}/cancel/`,
      { reason }
    );
  },

  /**
   * Marcar cita como completada
   * POST /api/doctors/me/appointments/{id}/complete/
   */
  completeAppointment: async (
    appointmentId: number,
    completionData: {
      diagnosis?: string;
      treatment?: string;
      prescription?: string;
      notes?: string;
    }
  ): Promise<DoctorAppointment> => {
    return apiHelpers.post<DoctorAppointment>(
      `/doctors/me/appointments/${appointmentId}/complete/`,
      completionData
    );
  },

  /**
   * Obtener horario del doctor autenticado
   * GET /api/doctors/me/schedule/
   */
  getMySchedule: async (date?: string): Promise<DoctorSchedule> => {
    const params = date ? `?date=${date}` : '';
    return apiHelpers.get<DoctorSchedule>(`/doctors/me/schedule/${params}`);
  },

  /**
   * Actualizar disponibilidad del doctor
   * PUT /api/doctors/me/availability/
   */
  updateAvailability: async (availability: DoctorAvailability): Promise<DoctorProfile> => {
    return apiHelpers.put<DoctorProfile>('/doctors/me/availability/', availability);
  },

  /**
   * Cambiar estado de disponibilidad rápido
   * PATCH /api/doctors/me/availability/toggle/
   */
  toggleAvailability: async (): Promise<{ is_available: boolean }> => {
    return apiHelpers.patch<{ is_available: boolean }>('/doctors/me/availability/toggle/');
  },

  // ==========================================
  // ENDPOINTS PARA REPORTES Y ANÁLISIS
  // ==========================================

  /**
   * Obtener reporte de citas por período
   * GET /api/doctors/me/reports/appointments/
   */
  getAppointmentsReport: async (params: {
    date_from: string;
    date_to: string;
    format?: 'json' | 'csv' | 'pdf';
  }): Promise<{
    total_appointments: number;
    completed_appointments: number;
    cancelled_appointments: number;
    no_show_appointments: number;
    period_data: Array<{
      date: string;
      appointments: number;
      completed: number;
      cancelled: number;
      no_show: number;
    }>;
    patient_stats?: {
      total_patients: number;
      new_patients: number;
      returning_patients: number;
    };
  }> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    return apiHelpers.get(`/doctors/me/reports/appointments/?${queryParams.toString()}`);
  },

  /**
   * Obtener reporte de ingresos
   * GET /api/doctors/me/reports/revenue/
   */
  getRevenueReport: async (params: {
    date_from: string;
    date_to: string;
    group_by?: 'day' | 'week' | 'month';
  }): Promise<{
    total_revenue: number;
    period_data: Array<{
      period: string;
      revenue: number;
      appointments_count: number;
    }>;
  }> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    return apiHelpers.get(`/doctors/me/reports/revenue/?${queryParams.toString()}`);
  },

  /**
   * Obtener lista de pacientes del doctor
   * GET /api/doctors/me/patients/
   */
  getMyPatients: async (params?: {
    search?: string;
    page?: number;
  }): Promise<{
    count: number;
    next: string | null;
    previous: string | null;
    results: Array<{
      id: number;
      user: {
        first_name: string;
        last_name: string;
        email: string;
        phone?: string;
      };
      total_appointments: number;
      last_appointment?: string;
      next_appointment?: string;
    }>;
  }> => {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const queryString = queryParams.toString();
    const url = queryString ? `/doctors/me/patients/?${queryString}` : '/doctors/me/patients/';
    
    return apiHelpers.get(url);
  },

  // ==========================================
  // UTILIDADES
  // ==========================================

  /**
   * Buscar doctores por especialización
   */
  searchBySpecialization: async (specialization: string): Promise<DoctorBasicInfo[]> => {
    const response = await doctorService.getPublicDoctors({ specialization });
    return response.results;
  },

  /**
   * Obtener doctores disponibles para una fecha específica
   */
  getAvailableDoctors: async (): Promise<DoctorBasicInfo[]> => {
    const response = await doctorService.getPublicDoctors({ 
      is_available: true,
    });
    return response.results;
  },

  /**
   * Validar si un doctor está disponible en un horario específico
   */
  checkAvailability: async (
    doctorId: number, 
    date: string, 
    time: string
  ): Promise<{ is_available: boolean; reason?: string }> => {
    try {
      const schedule = await doctorService.getDoctorSchedule(doctorId, date);
      const requestedSlot = schedule.available_slots.find(
        slot => slot.start_time === time
      );
      
      return {
        is_available: requestedSlot?.is_available || false,
        reason: requestedSlot?.is_available ? undefined : 'Horario no disponible'
      };
    } catch {
      return {
        is_available: false,
        reason: 'Error al verificar disponibilidad'
      };
    }
  }
};

// Exportar por defecto
export default doctorService;