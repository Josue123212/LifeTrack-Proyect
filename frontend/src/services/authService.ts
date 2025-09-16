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
      // Mapear el campo email a email_or_username que espera el backend
      const backendLoginData = {
        email_or_username: loginData.email,
        password: loginData.password
      };
      
      const response = await api.post('/users/auth/login/', backendLoginData);
      
      // Mapear la respuesta del backend al formato esperado por el frontend
      const backendData = response.data.data;
      
      return {
        user: {
          id: backendData.user.id.toString(),
          email: backendData.user.email,
          firstName: backendData.user.first_name || backendData.user.email.split('@')[0],
          lastName: backendData.user.last_name || '',
          phone: backendData.user.phone || '',
          role: backendData.user.role || 'client',
          isActive: backendData.user.is_active || true,
          dateJoined: backendData.user.date_joined || new Date().toISOString(),
          lastLogin: backendData.user.last_login || undefined,
          avatar: backendData.user.avatar || undefined
        },
        accessToken: backendData.access,
        refreshToken: backendData.refresh,
        expiresIn: 3600 // 1 hora por defecto
      };
    } catch (error: any) {
      console.error('Error en authService.login:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'Error al iniciar sesión';
      
      throw new Error(errorMessage);
    }
  },

  /**
   * Registrar nuevo usuario
   */
  register: async (registerData: RegisterData): Promise<AuthResponse> => {
    try {
      console.log('🚀 Datos de registro recibidos:', registerData);
      
      // Mapear los datos del frontend al formato que espera el backend
      const backendData = {
        username: registerData.email, // Usar email como username
        email: registerData.email,
        first_name: registerData.firstName,
        last_name: registerData.lastName,
        password: registerData.password,
        password_confirm: registerData.confirmPassword,
        phone: registerData.phone || '',
        date_of_birth: null,
        address: ''
      };
      
      console.log('📤 Datos enviados al backend:', backendData);
      
      const response = await api.post('/users/auth/register/', backendData);
      console.log('✅ Respuesta del backend:', response.data);
      
      // Mapear la respuesta del backend al formato del frontend
      const backendResponse = response.data;
      
      return {
        user: {
          id: backendResponse.user.id,
          username: backendResponse.user.username,
          email: backendResponse.user.email,
          firstName: backendResponse.user.first_name,
          lastName: backendResponse.user.last_name,
          phone: backendResponse.user.phone || '',
          role: backendResponse.user.role || 'client',
          isActive: backendResponse.user.is_active || true,
          dateJoined: backendResponse.user.created_at || new Date().toISOString(),
          lastLogin: backendResponse.user.updated_at || undefined,
          avatar: backendResponse.user.avatar || undefined
        },
        accessToken: backendResponse.tokens.access,
        refreshToken: backendResponse.tokens.refresh,
        expiresIn: 3600 // 1 hora por defecto
      };
    } catch (error: any) {
      console.error('❌ Error en authService.register:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      
      // Manejar errores específicos del backend
      let errorMessage = 'Error al registrar usuario';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Si hay errores de validación específicos
        if (errorData.username) {
          errorMessage = `Username: ${errorData.username[0]}`;
        } else if (errorData.email) {
          errorMessage = `Email: ${errorData.email[0]}`;
        } else if (errorData.password) {
          errorMessage = `Contraseña: ${errorData.password[0]}`;
        } else if (errorData.password_confirm) {
          errorMessage = `Confirmación: ${errorData.password_confirm[0]}`;
        } else if (errorData.non_field_errors) {
          errorMessage = errorData.non_field_errors[0];
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      }
      
      throw new Error(errorMessage);
    }
  },

  /**
   * Cerrar sesión
   */
  logout: async (): Promise<void> => {
    try {
      await api.post('/users/auth/logout/');
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
      const response = await api.post<AuthResponse>('/users/auth/refresh/', {
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
      const response = await api.get<User>('/users/profile/');
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
      const response = await api.patch<User>('/users/profile/', profileData);
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
      await api.post('/users/change-password/', passwordData);
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
      await api.post('/users/auth/verify/', { token });
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