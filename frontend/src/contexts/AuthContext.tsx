import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import { authService, tokenUtils } from '@/services/authService';
import type { User, LoginData, RegisterData, UpdateProfileData, ChangePasswordData } from '@/types/auth';

// Tipos del contexto
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (loginData: LoginData) => Promise<void>;
  register: (registerData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  changePassword: (data: ChangePasswordData) => Promise<void>;
  clearError: () => void;
  refreshUserProfile: () => Promise<void>;
}

// Acciones del reducer
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'CLEAR_ERROR' };

// Estado inicial
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Crear contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props del provider
interface AuthProviderProps {
  children: ReactNode;
}

// Provider del contexto
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Inicializar autenticación
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = tokenUtils.getAccessToken();
        const refreshToken = tokenUtils.getRefreshToken();
        
        if (accessToken && refreshToken) {
          const isValid = await authService.verifyToken(accessToken);
          
          if (isValid) {
            const user = await authService.getProfile();
            dispatch({ type: 'AUTH_SUCCESS', payload: user });
          } else {
            try {
              const authResponse = await authService.refreshToken(refreshToken);
              tokenUtils.saveTokens(authResponse.accessToken, authResponse.refreshToken);
              localStorage.setItem('user', JSON.stringify(authResponse.user));
              dispatch({ type: 'AUTH_SUCCESS', payload: authResponse.user });
            } catch (refreshError) {
              tokenUtils.clearTokens();
              localStorage.removeItem('user');
              dispatch({ type: 'LOGOUT' });
            }
          }
        } else {
          const savedUser = localStorage.getItem('user');
          if (savedUser) {
            localStorage.removeItem('user');
          }
          dispatch({ type: 'LOGOUT' });
        }
      } catch (error) {
        console.error('Error al inicializar autenticación:', error);
        tokenUtils.clearTokens();
        localStorage.removeItem('user');
        dispatch({ type: 'LOGOUT' });
      }
    };

    initializeAuth();
  }, []);

  // Función de login
  const login = async (loginData: LoginData): Promise<void> => {
    try {
      console.log('🔐 Iniciando login con:', { email: loginData.email });
      dispatch({ type: 'AUTH_START' });
      
      const authResponse = await authService.login(loginData);
      console.log('✅ Login exitoso, respuesta:', authResponse);
      
      tokenUtils.saveTokens(authResponse.accessToken, authResponse.refreshToken);
      localStorage.setItem('user', JSON.stringify(authResponse.user));
      
      dispatch({ type: 'AUTH_SUCCESS', payload: authResponse.user });
      
      toast.success(`¡Bienvenido/a, ${authResponse.user.firstName}!`);
    } catch (error: any) {
      console.error('❌ Error en login:', error);
      const errorMessage = error.message || 'Error al iniciar sesión';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  // Función de registro
  const register = async (registerData: RegisterData): Promise<void> => {
    try {
      console.log('🔄 Iniciando registro en AuthContext...');
      dispatch({ type: 'AUTH_START' });
      
      const authResponse = await authService.register(registerData);
      console.log('✅ Registro exitoso en AuthContext:', authResponse);
      
      tokenUtils.saveTokens(authResponse.accessToken, authResponse.refreshToken);
      localStorage.setItem('user', JSON.stringify(authResponse.user));
      
      dispatch({ type: 'AUTH_SUCCESS', payload: authResponse.user });
      
      console.log('🎉 Usuario registrado y autenticado exitosamente');
      toast.success(`¡Bienvenido/a, ${authResponse.user.firstName}! Tu cuenta ha sido creada exitosamente.`);
    } catch (error: any) {
      console.error('❌ Error en AuthContext.register:', error);
      
      const errorMessage = error.message || 'Error al registrarse';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  // Función de logout
  const logout = (): void => {
    try {
      authService.logout();
      tokenUtils.clearTokens();
      localStorage.removeItem('user');
      dispatch({ type: 'LOGOUT' });
      toast.success('Sesión cerrada exitosamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      tokenUtils.clearTokens();
      localStorage.removeItem('user');
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Función para actualizar perfil
  const updateProfile = async (data: UpdateProfileData): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const updatedUser = await authService.updateProfile(data);
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      
      toast.success('Perfil actualizado exitosamente');
    } catch (error: any) {
      const errorMessage = error.message || 'Error al actualizar perfil';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  // Función para cambiar contraseña
  const changePassword = async (data: ChangePasswordData): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      await authService.changePassword(data);
      
      dispatch({ type: 'CLEAR_ERROR' });
      toast.success('Contraseña cambiada exitosamente');
    } catch (error: any) {
      const errorMessage = error.message || 'Error al cambiar contraseña';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  };

  // Función para limpiar errores
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Función para refrescar perfil
  const refreshUserProfile = async (): Promise<void> => {
    try {
      const user = await authService.getProfile();
      localStorage.setItem('user', JSON.stringify(user));
      dispatch({ type: 'UPDATE_USER', payload: user });
    } catch (error: any) {
      console.error('Error al refrescar perfil:', error);
    }
  };

  // Valor del contexto
  const contextValue: AuthContextType = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
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

// Hook para usar el contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  return context;
};

// Hook para verificar roles
export const useRole = (requiredRole: string | string[]): boolean => {
  const { user } = useAuth();
  
  if (!user) return false;
  
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(user.role);
  }
  
  return user.role === requiredRole;
};

// Hook para permisos
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

export { AuthContext };