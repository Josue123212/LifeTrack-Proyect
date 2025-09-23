import axios from 'axios';

// 🎯 OBJETIVO: Cliente HTTP centralizado para comunicación con el backend Django
// 💡 CONCEPTO: Axios instance con configuración base y interceptores para autenticación

// Crear instancia de Axios con configuración base
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // URL base del backend Django
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Timeout de 10 segundos
});

// 🔧 INTERCEPTOR DE REQUEST: Agregar token de autenticación automáticamente
api.interceptors.request.use(
  (config) => {
    // Obtener token del localStorage (corregido para usar 'accessToken')
    const token = localStorage.getItem('accessToken');
    
    // Si existe token, agregarlo al header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log para desarrollo (solo en modo desarrollo)
    if (import.meta.env.DEV) {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// 🔧 INTERCEPTOR DE RESPONSE: Manejar respuestas y errores globalmente
api.interceptors.response.use(
  (response) => {
    // Log para desarrollo
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', {
        status: response.status,
        data: response.data,
      });
    }
    
    return response;
  },
  (error) => {
    // Manejar errores comunes
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Token expirado o inválido
          console.warn('🔒 Token expirado o inválido');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          // Nota: En un entorno real, esto debería manejarse con React Router
          // Por ahora comentamos la redirección para evitar errores en desarrollo
          // window.location.href = '/login';
          break;
          
        case 403:
          console.warn('🚫 Acceso denegado');
          break;
          
        case 404:
          console.warn('🔍 Recurso no encontrado');
          break;
          
        case 500:
          console.error('💥 Error interno del servidor');
          break;
          
        default:
          console.error('❌ Error de API:', { status, data });
      }
    } else if (error.request) {
      // Error de red
      console.error('🌐 Error de conexión:', error.message);
    } else {
      // Error de configuración
      console.error('⚙️ Error de configuración:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// 📊 TIPOS TYPESCRIPT para respuestas de API
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

export interface PaginatedResponse<T = any> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}

// 🚀 FUNCIONES HELPER para operaciones comunes
export const apiHelpers = {
  // GET request con tipado
  get: <T = unknown>(url: string, params?: Record<string, unknown>): Promise<T> => {
    return api.get(url, { params }).then(response => response.data);
  },
  
  // POST request con tipado
  post: <T = unknown>(url: string, data?: unknown): Promise<T> => {
    return api.post(url, data).then(response => response.data);
  },
  
  // PUT request con tipado
  put: <T = unknown>(url: string, data?: unknown): Promise<T> => {
    return api.put(url, data).then(response => response.data);
  },
  
  // PATCH request con tipado
  patch: <T = unknown>(url: string, data?: unknown): Promise<T> => {
    return api.patch(url, data).then(response => response.data);
  },
  
  // DELETE request con tipado
  delete: <T = unknown>(url: string): Promise<T> => {
    return api.delete(url).then(response => response.data);
  },
  
  // Upload de archivos
  upload: <T = unknown>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    }).then(response => response.data);
  },
};

// Exportar la instancia de Axios por defecto
export default api;

// 📋 EXPLICACIÓN:
// 1. Creamos una instancia de Axios con configuración base
// 2. Agregamos interceptores para manejar tokens automáticamente
// 3. Incluimos manejo de errores centralizado
// 4. Proporcionamos helpers tipados para operaciones comunes
// 5. Agregamos soporte para upload de archivos
// 6. Todo está preparado para trabajar con Django REST Framework