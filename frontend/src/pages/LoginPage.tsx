import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useFormValidation } from '../lib/hooks/useFormValidation';
import { loginSchema, type LoginFormData } from '../lib/validations';
import { useAuth } from '@/contexts/AuthContext';

/**
 * 🔐 PÁGINA DE LOGIN
 * 
 * Página de autenticación para el sistema de citas médicas.
 * Utiliza React Hook Form con validaciones Zod para una mejor UX.
 */
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const { login, isLoading } = useAuth();

  // 🎯 Hook de formulario con validaciones
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useFormValidation<LoginFormData>({
    schema: loginSchema,
  });

  /**
   * 🔑 Maneja el proceso de login
   */
  const handleLogin = async (data: LoginFormData) => {
    try {
      await login({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe
      });
      
      // Redirigir al dashboard después del login exitoso
      navigate('/dashboard');
    } catch (error) {
      // El error ya se maneja en el AuthContext con toast
      console.error('Error en login:', error);
    }
  };

  /**
   * 🔍 Toggle para mostrar/ocultar contraseña
   */
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  /**
   * 🎨 Maneja el login con Google (placeholder)
   */
  const handleGoogleLogin = () => {
    toast.info('Login con Google próximamente');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🏥 Sistema de Citas
          </h1>
          <p className="text-gray-600">
            Inicia sesión para acceder a tu cuenta
          </p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              Iniciar Sesión
            </CardTitle>
          </CardHeader>
          
          <form onSubmit={handleSubmit(handleLogin)}>
            <CardContent className="space-y-4">
              {/* Email Input */}
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

              {/* Password Input */}
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

              {/* Quick Access Buttons */}
              <div className="flex gap-2 justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  🌐 Google
                </Button>
              </div>
            </CardContent>

            <div className="px-6 pb-6">
              {/* Submit Button */}
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
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>

              {/* Links */}
              <div className="text-center space-y-2 mt-4">
                <p className="text-sm text-gray-600">
                  ¿No tienes una cuenta?{' '}
                  <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                    Regístrate aquí
                  </Link>
                </p>
                <p className="text-sm">
                  <Link to="/" className="text-gray-500 hover:text-gray-700">
                    ← Volver al inicio
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </Card>

        {/* Demo Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            💡 Información de Demostración
          </h3>
          <p className="text-xs text-blue-600">
            Puedes usar los datos de demostración para probar el sistema sin necesidad de registro.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;