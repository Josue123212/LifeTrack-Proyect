import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, Phone, Calendar, Stethoscope } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    password: '',
    confirmPassword: '',
    userType: 'patient',
    acceptTerms: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
    console.log('Register:', formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    })
  }

  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo - Branding */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-success-600 via-success-700 to-success-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <Stethoscope className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold font-heading">MediCare</h1>
          </div>
          
          <div className="text-center max-w-md">
            <h2 className="text-4xl font-bold mb-4 font-heading">
              Únete a Nuestra
              <span className="block text-success-200">Comunidad Médica</span>
            </h2>
            <p className="text-xl text-success-100 leading-relaxed">
              Crea tu cuenta y accede a la mejor plataforma de gestión médica del mercado.
            </p>
          </div>
          
          <div className="mt-12 space-y-4 text-left">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-success-200 rounded-full"></div>
              <span className="text-success-100">Gestión completa de citas</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-success-200 rounded-full"></div>
              <span className="text-success-100">Historial médico digitalizado</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-success-200 rounded-full"></div>
              <span className="text-success-100">Comunicación directa con doctores</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-success-200 rounded-full"></div>
              <span className="text-success-100">Reportes y análisis avanzados</span>
            </div>
          </div>
        </div>
        
        {/* Elementos decorativos */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      </div>

      {/* Panel derecho - Formulario */}
      <div className="flex-1 flex items-center justify-center p-8 bg-secondary-50">
        <div className="w-full max-w-lg">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-heading">Crear Cuenta</CardTitle>
              <CardDescription className="text-base">
                Completa tus datos para registrarte en el sistema
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Tipo de usuario */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Tipo de usuario
                  </label>
                  <select
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-success-500 focus:border-transparent transition-colors duration-200"
                  >
                    <option value="patient">Paciente</option>
                    <option value="doctor">Doctor</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>

                {/* Nombres */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
                    <Input
                      type="text"
                      name="firstName"
                      placeholder="Nombre"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="pl-10"
                      required
                    />
                  </div>
                  <Input
                    type="text"
                    name="lastName"
                    placeholder="Apellido"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Email y teléfono */}
                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
                    <Input
                      type="email"
                      name="email"
                      placeholder="correo@ejemplo.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10"
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
                    <Input
                      type="tel"
                      name="phone"
                      placeholder="Teléfono"
                      value={formData.phone}
                      onChange={handleChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Fecha de nacimiento */}
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
                  <Input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>

                {/* Contraseñas */}
                <div className="space-y-4">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Contraseña"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="Confirmar contraseña"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Términos y condiciones */}
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="mt-1 rounded border-secondary-300 text-success-600 focus:ring-success-500"
                    required
                  />
                  <label className="text-sm text-secondary-600 leading-relaxed">
                    Acepto los{' '}
                    <Link to="/terms" className="text-success-600 hover:text-success-700 font-medium">
                      términos y condiciones
                    </Link>
                    {' '}y la{' '}
                    <Link to="/privacy" className="text-success-600 hover:text-success-700 font-medium">
                      política de privacidad
                    </Link>
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-success-600 hover:bg-success-700 focus:ring-success-500"
                  size="lg"
                  isLoading={isLoading}
                  disabled={!formData.acceptTerms}
                >
                  {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-secondary-600">
                  ¿Ya tienes una cuenta?{' '}
                  <Link to="/login" className="text-success-600 hover:text-success-700 font-medium">
                    Inicia sesión aquí
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}