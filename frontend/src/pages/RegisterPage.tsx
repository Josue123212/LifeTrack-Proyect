import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useFormValidation } from '../lib/hooks/useFormValidation';
import { registerSchema, type RegisterFormData } from '../lib/validations';
import { useAuth } from '@/contexts/AuthContext';

/**
 * 📝 Página de Registro de Usuario
 * 
 * Características:
 * - Formulario con React Hook Form + Zod
 * - Validación en tiempo real
 * - Confirmación de contraseña
 * - Términos y condiciones
 * - Integración con toast notifications
 */
export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isLoading } = useAuth();

  // 🎯 Hook de validación con React Hook Form + Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset
  } = useFormValidation(registerSchema);

  /**
   * 🔐 Maneja el envío del formulario de registro
   */
  const handleRegister = async (data: RegisterFormData) => {
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        acceptTerms: data.acceptTerms
      });
      
      // Redirigir al dashboard después del registro exitoso
      navigate('/dashboard');
    } catch (error) {
      // El error ya se maneja en el AuthContext con toast
      console.error('Error en registro:', error);
    }
  };

  /**
   * 👁️ Toggle para mostrar/ocultar contraseña
   */
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  /**
   * 👁️ Toggle para mostrar/ocultar confirmación de contraseña
   */
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  /**
   * 🎨 Maneja el registro con Google (placeholder)
   */
  const handleGoogleRegister = () => {
    toast.info('Registro con Google próximamente');
  };

  /**
   * 🧹 Limpia el formulario
   */
  const handleClearForm = () => {
    reset();
    toast.success('Formulario limpiado');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
              <span className="text-white text-xl font-bold">📝</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Crear Cuenta
            </h1>
            <p className="text-gray-600 text-sm">
              Únete a nuestra plataforma médica
            </p>
          </CardHeader>
          
          <form onSubmit={handleSubmit(handleRegister)}>
            <CardContent className="space-y-4">
              {/* Nombre */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Tu nombre"
                  {...register('firstName')}
                  error={errors.firstName?.message}
                  disabled={isLoading}
                />
              </div>

              {/* Apellido */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido
                </label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Tu apellido"
                  {...register('lastName')}
                  error={errors.lastName?.message}
                  disabled={isLoading}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  {...register('email')}
                  error={errors.email?.message}
                  disabled={isLoading}
                />
              </div>

              {/* Contraseña */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('password')}
                    error={errors.password?.message}
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('confirmPassword')}
                    error={errors.confirmPassword?.message}
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Términos y Condiciones */}
              <div className="flex items-start space-x-2">
                <input
                  id="acceptTerms"
                  type="checkbox"
                  {...register('acceptTerms')}
                  disabled={isLoading}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                  Acepto los{' '}
                  <Link to="/terms" className="text-blue-600 hover:text-blue-800 underline">
                    términos y condiciones
                  </Link>
                  {' '}y la{' '}
                  <Link to="/privacy" className="text-blue-600 hover:text-blue-800 underline">
                    política de privacidad
                  </Link>
                </label>
              </div>
              {errors.acceptTerms && (
                <p className="text-red-500 text-xs mt-1">{errors.acceptTerms.message}</p>
              )}

              {/* Quick Access Buttons */}
              <div className="flex gap-2 justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleGoogleRegister}
                  disabled={isLoading}
                >
                  🌐 Google
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearForm}
                  disabled={isLoading}
                >
                  🧹 Limpiar
                </Button>
              </div>
            </CardContent>
            
            <div className="px-6 pb-6">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoading || !isValid}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creando cuenta...
                  </>
                ) : (
                  'Crear Cuenta'
                )}
              </Button>
              
              <div className="text-center text-sm text-gray-600 mt-4">
                ¿Ya tienes cuenta?{' '}
                <Link 
                  to="/login" 
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Inicia sesión aquí
                </Link>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;