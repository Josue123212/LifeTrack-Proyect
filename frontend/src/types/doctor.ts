// 🏥 Tipos para el Sistema de Doctores

import type { User } from './auth';

/**
 * Interface para el perfil de doctor
 */
export interface DoctorProfile {
  id: number;
  user: User;
  medical_license: string;
  specialization: string;
  years_experience: number;
  consultation_fee: number;
  bio: string;
  is_available: boolean;
  work_start_time: string;
  work_end_time: string;
  work_days: string[];
  created_at: string;
  updated_at: string;
}

/**
 * Datos para crear/actualizar perfil de doctor
 */
export interface DoctorProfileData {
  medical_license?: string;
  specialization?: string;
  years_experience?: number;
  consultation_fee?: number;
  bio?: string;
  is_available?: boolean;
  work_start_time?: string;
  work_end_time?: string;
  work_days?: string[];
}

/**
 * Doctor con información básica (para listados públicos)
 */
export interface DoctorBasicInfo {
  id: number;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  specialization: string;
  years_experience: number;
  consultation_fee: number;
  bio: string;
  is_available: boolean;
  work_start_time: string;
  work_end_time: string;
  work_days: string[];
}

/**
 * Horario de trabajo del doctor
 */
export interface DoctorSchedule {
  doctor_id: number;
  date: string;
  available_slots: TimeSlot[];
  booked_slots: TimeSlot[];
}

/**
 * Slot de tiempo para citas
 */
export interface TimeSlot {
  start_time: string;
  end_time: string;
  is_available: boolean;
  appointment_id?: number;
}

/**
 * Estadísticas del doctor
 */
export interface DoctorStats {
  total_appointments: number;
  appointments_today: number;
  appointments_this_week: number;
  appointments_this_month: number;
  total_patients: number;
  average_rating: number;
  total_revenue: number;
  upcoming_appointments: number;
}

/**
 * Cita desde la perspectiva del doctor
 */
export interface DoctorAppointment {
  id: number;
  patient: {
    id: number;
    user: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
    };
    date_of_birth?: string;
    medical_history?: string;
  };
  appointment_date: string;
  appointment_time: string;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  reason: string;
  notes?: string;
  diagnosis?: string;
  treatment?: string;
  prescription?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Datos para actualizar una cita (doctor)
 */
export interface UpdateAppointmentData {
  status?: 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  diagnosis?: string;
  treatment?: string;
  prescription?: string;
}

/**
 * Configuración de disponibilidad del doctor
 */
export interface DoctorAvailability {
  is_available: boolean;
  work_start_time: string;
  work_end_time: string;
  work_days: string[];
  break_start_time?: string;
  break_end_time?: string;
  slot_duration: number; // en minutos
}

/**
 * Respuesta de la API para listado de doctores
 */
export interface DoctorsListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: DoctorBasicInfo[];
}

/**
 * Filtros para búsqueda de doctores
 */
export interface DoctorFilters {
  specialization?: string;
  is_available?: boolean;
  min_experience?: number;
  max_fee?: number;
  work_days?: string[];
  search?: string;
}