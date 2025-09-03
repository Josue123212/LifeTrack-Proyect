// 🔐 Context de Autenticación

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import { authService, tokenUtils } from '@/services/authService';
import type {
  User,
  LoginData,
  RegisterData,
  AuthState,
  UpdateProfileData,
  ChangePasswordData
} from '@/types/auth';

/**
 * Interface del contexto de autenticación
 */
interface AuthContextType {
  // Estado
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Acciones
  login: (loginData: LoginData) => Promise<void>;
  register: (registerData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profileData: UpdateProfileData) => Promise<void>;
  changePassword: (passwordData: ChangePasswordData) => Promise<void>;
  clearError: () => void;
  refreshUserProfile: () => Promise<void>;
}

/**
 * Tipos de acciones para el reducer
 */
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_USER'; payload: User };

/**
 * Estado inicial
 */
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Inicialmente true para verificar sesión existente
  error: null
};

/**
 * Reducer para manejar el estado de autenticación
 */
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null
      };
    
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
    
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload
      };
    
    default:
      return state;
  }
};

/**
 * Crear el contexto
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Props del provider
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provider del contexto de autenticación
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  /**
   * Verificar sesión existente al cargar la aplicación
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = tokenUtils.getAccessToken();
        const refreshToken = tokenUtils.getRefreshToken();
        
        if (accessToken && refreshToken) {
          // Verificar si el token es válido
          const isValid = await authService.verifyToken(accessToken);
          
          if (isValid) {
            // Obtener perfil del usuario
            const user = await authService.getProfile();
            dispatch({ type: 'AUTH_SUCCESS', payload: user });
          } else {
            // Intentar renovar el token
            try {
              const authResponse = await authService.refreshToken(refreshToken);
              tokenUtils.saveTokens(authResponse.accessToken, authResponse.refreshToken);
              dispatch({ type: 'AUTH_SUCCESS', payload: authResponse.user });
            } catch (error) {
              // Token de refresco también expiró
              tokenUtils.clearTokens();
              dispatch({ type: 'AUTH_LOGOUT' });
            }
          }
        } else {
          // No hay tokens guardados
          dispatch({ type: 'AUTH_LOGOUT' });
        }
      } catch (error) {
        console.error('Error al inicializar autenticación:', error);
        tokenUtils.clearTokens();
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    };

    initializeAuth();
  }, []);

  /**
   * Función de login
   */
  const login = async (loginData: LoginData): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const authResponse = await authService.login(loginData);
      
      // Guardar tokens
      tokenUtils.saveTokens(authResponse.accessToken, authResponse.refreshToken);
      
      // Guardar usuario en localStorage para persistencia
      localStorage.setItem('user', JSON.stringify(authResponse.user));
      
      dispatch({ type: 'AUTH_SUCCESS', payload: authResponse.user });
      
      toast.success(`¡Bienvenido/a, ${authResponse.user.firstName}!`);
    } catch (error: any) {
      const errorMessage = error.message || 'Error al iniciar sesión';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  /**
   * Función de registro
   */
  const register = async (registerData: RegisterData): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const authResponse = await authService.register(registerData);
      
      // Guardar tokens
      tokenUtils.saveTokens(authResponse.accessToken, authResponse.refreshToken);
      
      // Guardar usuario en localStorage
      localStorage.setItem('user', JSON.stringify(authResponse.user));
      
      dispatch({ type: 'AUTH_SUCCESS', payload: authResponse.user });
      
      toast.success(`¡Registro exitoso! Bienvenido/a, ${authResponse.user.firstName}!`);
    } catch (error: any) {
      const errorMessage = error.message || 'Error al registrar usuario';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  /**
   * Función de logout
   */
  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.warn('Error al cerrar sesión en el servidor:', error);
    } finally {
      // Limpiar tokens y estado local
      tokenUtils.clearTokens();
      dispatch({ type: 'AUTH_LOGOUT' });
      toast.success('Sesión cerrada exitosamente');
    }
  };

  /**
   * Actualizar perfil
   */
  const updateProfile = async (profileData: UpdateProfileData): Promise<void> => {
    try {
      const updatedUser = await authService.updateProfile(profileData);
      
      // Actualizar usuario en localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      toast.success('Perfil actualizado exitosamente');
    } catch (error: any) {
      const errorMessage = error.message || 'Error al actualizar perfil';
      toast.error(errorMessage);
      throw error;
    }
  };

  /**
   * Cambiar contraseña
   */
  const changePassword = async (passwordData: ChangePasswordData): Promise<void> => {
    try {
      await authService.changePassword(passwordData);
      toast.success('Contraseña cambiada exitosamente');
    } catch (error: any) {
      const errorMessage = error.message || 'Error al cambiar contraseña';
      toast.error(errorMessage);
      throw error;
    }
  };

  /**
   * Limpiar error
   */
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  /**
   * Refrescar perfil del usuario
   */
  const refreshUserProfile = async (): Promise<void> => {
    try {
      const user = await authService.getProfile();
      localStorage.setItem('user', JSON.stringify(user));
      dispatch({ type: 'UPDATE_USER', payload: user });
    } catch (error: any) {
      console.error('Error al refrescar perfil:', error);
    }
  };

  /**
   * Valor del contexto
   */
  const contextValue: AuthContextType = {
    // Estado
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    
    // Acciones
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError,
    refreshUserProfile
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook para usar el contexto de autenticación
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  return context;
};

/**
 * Hook para verificar si el usuario tiene un rol específico
 */
export const useRole = (requiredRole: string | string[]): boolean => {
  const { user } = useAuth();
  
  if (!user) return false;
  
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(user.role);
  }
  
  return user.role === requiredRole;
};

/**
 * Hook para verificar permisos
 */
export const usePermissions = () => {
  const { user } = useAuth();
  
  return {
    isClient: user?.role === 'client',
    isAdmin: user?.role === 'admin',
    isSuperAdmin: user?.role === 'superadmin',
    hasAdminAccess: user?.role === 'admin' || user?.role === 'superadmin',
    canManageUsers: user?.role === 'superadmin',
    canViewReports: user?.role === 'admin' || user?.role === 'superadmin'
  };
};

export default AuthContext;