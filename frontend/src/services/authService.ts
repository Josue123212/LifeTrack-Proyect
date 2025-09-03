// 🔐 Servicio de Autenticación

import api from './api';
import type {
  User,
  LoginData,
  RegisterData,
  AuthResponse,
  UpdateProfileData,
  ChangePasswordData
} from '@/types/auth';

/**
 * Servicio para manejar todas las operaciones de autenticación
 */
export const authService = {
  /**
   * Iniciar sesión
   */
  login: async (loginData: LoginData): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/users/auth/login/', loginData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  },

  /**
   * Registrar nuevo usuario
   */
  register: async (registerData: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/register/', registerData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al registrar usuario');
    }
  },

  /**
   * Cerrar sesión
   */
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout/');
    } catch (error: any) {
      // Incluso si falla la llamada al servidor, limpiamos el token local
      console.warn('Error al cerrar sesión en el servidor:', error.message);
    }
  },

  /**
   * Renovar token de acceso
   */
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/refresh/', {
        refresh: refreshToken
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al renovar token');
    }
  },

  /**
   * Obtener perfil del usuario actual
   */
  getProfile: async (): Promise<User> => {
    try {
      const response = await api.get<User>('/auth/profile/');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener perfil');
    }
  },

  /**
   * Actualizar perfil del usuario
   */
  updateProfile: async (profileData: UpdateProfileData): Promise<User> => {
    try {
      const response = await api.patch<User>('/auth/profile/', profileData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al actualizar perfil');
    }
  },

  /**
   * Cambiar contraseña
   */
  changePassword: async (passwordData: ChangePasswordData): Promise<void> => {
    try {
      await api.post('/auth/change-password/', passwordData);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al cambiar contraseña');
    }
  },

  /**
   * Solicitar restablecimiento de contraseña
   */
  forgotPassword: async (email: string): Promise<void> => {
    try {
      await api.post('/auth/forgot-password/', { email });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al solicitar restablecimiento');
    }
  },

  /**
   * Restablecer contraseña con token
   */
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    try {
      await api.post('/auth/reset-password/', {
        token,
        password: newPassword
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al restablecer contraseña');
    }
  },

  /**
   * Verificar si el token es válido
   */
  verifyToken: async (token: string): Promise<boolean> => {
    try {
      await api.post('/auth/verify-token/', { token });
      return true;
    } catch (error) {
      return false;
    }
  }
};

/**
 * Utilidades para manejo de tokens
 */
export const tokenUtils = {
  /**
   * Guardar tokens en localStorage
   */
  saveTokens: (accessToken: string, refreshToken: string): void => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },

  /**
   * Obtener token de acceso
   */
  getAccessToken: (): string | null => {
    return localStorage.getItem('accessToken');
  },

  /**
   * Obtener token de refresco
   */
  getRefreshToken: (): string | null => {
    return localStorage.getItem('refreshToken');
  },

  /**
   * Limpiar todos los tokens
   */
  clearTokens: (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  /**
   * Verificar si hay tokens guardados
   */
  hasTokens: (): boolean => {
    return !!(tokenUtils.getAccessToken() && tokenUtils.getRefreshToken());
  }
};