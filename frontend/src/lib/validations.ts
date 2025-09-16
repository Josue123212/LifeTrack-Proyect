import { z } from 'zod';

// 🔐 Esquemas de Validación para Autenticación

// Schema para Login
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Formato de email inválido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  rememberMe: z
    .boolean()
    .optional()
    .default(false),
});

// Schema para Registro
export const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  lastName: z
    .string()
    .min(1, 'El apellido es requerido')
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres'),
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Formato de email inválido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  confirmPassword: z
    .string()
    .min(1, 'La confirmación de contraseña es requerida'),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[+]?[1-9]\d{1,14}$/.test(val), {
      message: 'Formato de teléfono inválido',
    }),
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, {
      message: 'Debes aceptar los términos y condiciones',
    }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

// Schema para Cambio de Contraseña
export const changePasswordSchema = z.object({
  current_password: z
    .string()
    .min(1, 'La contraseña actual es requerida'),
  new_password: z
    .string()
    .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  confirm_new_password: z
    .string()
    .min(1, 'Confirma tu nueva contraseña'),
}).refine((data) => data.new_password === data.confirm_new_password, {
  message: 'Las contraseñas no coinciden',
  path: ['confirm_new_password'],
});

// Schema para Perfil de Usuario
export const profileSchema = z.object({
  first_name: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  last_name: z
    .string()
    .min(1, 'El apellido es requerido')
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres'),
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Formato de email inválido'),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[+]?[1-9]\d{1,14}$/.test(val), {
      message: 'Formato de teléfono inválido',
    }),
});

// 📅 Esquemas para Citas Médicas

// Schema para Crear/Editar Cita
export const appointmentSchema = z.object({
  doctor: z
    .string()
    .min(1, 'Selecciona un doctor'),
  patient: z
    .string()
    .min(1, 'Selecciona un paciente'),
  date: z
    .string()
    .min(1, 'La fecha es requerida')
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'La fecha no puede ser anterior a hoy'),
  time: z
    .string()
    .min(1, 'La hora es requerida')
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)'),
  reason: z
    .string()
    .min(1, 'El motivo de la cita es requerido')
    .min(10, 'El motivo debe tener al menos 10 caracteres')
    .max(500, 'El motivo no puede exceder 500 caracteres'),
  notes: z
    .string()
    .max(1000, 'Las notas no pueden exceder 1000 caracteres')
    .optional(),
});

// 👥 Esquemas para Pacientes

// Schema para Crear/Editar Paciente
export const patientSchema = z.object({
  first_name: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  last_name: z
    .string()
    .min(1, 'El apellido es requerido')
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres'),
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Formato de email inválido'),
  phone: z
    .string()
    .min(1, 'El teléfono es requerido')
    .regex(/^[+]?[1-9]\d{1,14}$/, 'Formato de teléfono inválido'),
  date_of_birth: z
    .string()
    .min(1, 'La fecha de nacimiento es requerida')
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 0 && age <= 120;
    }, 'Fecha de nacimiento inválida'),
  gender: z
    .enum(['M', 'F', 'O'], {
      errorMap: () => ({ message: 'Selecciona un género válido' }),
    }),
  address: z
    .string()
    .min(1, 'La dirección es requerida')
    .min(10, 'La dirección debe tener al menos 10 caracteres')
    .max(200, 'La dirección no puede exceder 200 caracteres'),
  emergency_contact_name: z
    .string()
    .min(1, 'El contacto de emergencia es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  emergency_contact_phone: z
    .string()
    .min(1, 'El teléfono de emergencia es requerido')
    .regex(/^[+]?[1-9]\d{1,14}$/, 'Formato de teléfono inválido'),
  medical_history: z
    .string()
    .max(2000, 'El historial médico no puede exceder 2000 caracteres')
    .optional(),
  allergies: z
    .string()
    .max(1000, 'Las alergias no pueden exceder 1000 caracteres')
    .optional(),
});

// 👨‍⚕️ Esquemas para Doctores

// Schema para Crear/Editar Doctor
export const doctorSchema = z.object({
  first_name: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  last_name: z
    .string()
    .min(1, 'El apellido es requerido')
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres'),
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Formato de email inválido'),
  phone: z
    .string()
    .min(1, 'El teléfono es requerido')
    .regex(/^[+]?[1-9]\d{1,14}$/, 'Formato de teléfono inválido'),
  license_number: z
    .string()
    .min(1, 'El número de licencia es requerido')
    .min(5, 'El número de licencia debe tener al menos 5 caracteres')
    .max(20, 'El número de licencia no puede exceder 20 caracteres'),
  specialization: z
    .string()
    .min(1, 'La especialización es requerida')
    .min(3, 'La especialización debe tener al menos 3 caracteres')
    .max(100, 'La especialización no puede exceder 100 caracteres'),
  years_of_experience: z
    .number()
    .min(0, 'Los años de experiencia no pueden ser negativos')
    .max(50, 'Los años de experiencia no pueden exceder 50'),
  consultation_fee: z
    .number()
    .min(0, 'La tarifa de consulta no puede ser negativa')
    .max(10000, 'La tarifa de consulta no puede exceder $10,000'),
  bio: z
    .string()
    .max(2000, 'La biografía no puede exceder 2000 caracteres')
    .optional(),
  is_available: z
    .boolean()
    .default(true),
});

// 📊 Tipos TypeScript derivados de los esquemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type AppointmentFormData = z.infer<typeof appointmentSchema>;
export type PatientFormData = z.infer<typeof patientSchema>;
export type DoctorFormData = z.infer<typeof doctorSchema>;

// 🎯 Utilidades de Validación

// Función para validar email en tiempo real
export const validateEmail = (email: string): boolean => {
  return z.string().email().safeParse(email).success;
};

// Función para validar contraseña fuerte
export const validateStrongPassword = (password: string): boolean => {
  return z.string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .safeParse(password).success;
};

// Función para validar teléfono
export const validatePhone = (phone: string): boolean => {
  return z.string()
    .regex(/^[+]?[1-9]\d{1,14}$/)
    .safeParse(phone).success;
};

// Mensajes de error personalizados
export const errorMessages = {
  required: 'Este campo es requerido',
  email: 'Formato de email inválido',
  phone: 'Formato de teléfono inválido',
  password: 'La contraseña debe tener al menos 8 caracteres con mayúscula, minúscula y número',
  passwordMatch: 'Las contraseñas no coinciden',
  minLength: (min: number) => `Debe tener al menos ${min} caracteres`,
  maxLength: (max: number) => `No puede exceder ${max} caracteres`,
  invalidDate: 'Fecha inválida',
  futureDate: 'La fecha no puede ser anterior a hoy',
};