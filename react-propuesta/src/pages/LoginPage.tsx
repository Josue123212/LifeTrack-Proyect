import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, Heart, Stethoscope } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
    console.log('Login:', formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
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
              Gestión Médica
              <span className="block text-primary-200">Inteligente</span>
            </h2>
            <p className="text-xl text-primary-100 leading-relaxed">
              Simplifica la gestión de citas, pacientes y doctores con nuestra plataforma moderna y eficiente.
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold">500+</div>
              <div className="text-primary-200 text-sm">Doctores</div>
            </div>
            <div>
              <div className="text-3xl font-bold">10K+</div>
              <div className="text-primary-200 text-sm">Pacientes</div>
            </div>
            <div>
              <div className="text-3xl font-bold">50K+</div>
              <div className="text-primary-200 text-sm">Citas</div>
            </div>
          </div>
        </div>
        
        {/* Elementos decorativos */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      </div>

      {/* Panel derecho - Formulario */}
      <div className="flex-1 flex items-center justify-center p-8 bg-secondary-50">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-8">
              <div className="flex justify-center mb-4 lg:hidden">
                <div className="p-3 bg-primary-100 rounded-full">
                  <Heart className="h-8 w-8 text-primary-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-heading">Iniciar Sesión</CardTitle>
              <CardDescription className="text-base">
                Accede a tu cuenta para gestionar el sistema médico
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
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
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Tu contraseña"
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
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500" />
                    <span className="text-secondary-600">Recordarme</span>
                  </label>
                  <Link to="/forgot-password" className="text-primary-600 hover:text-primary-700 font-medium">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  isLoading={isLoading}
                >
                  {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-secondary-600">
                  ¿No tienes una cuenta?{' '}
                  <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                    Regístrate aquí
                  </Link>
                </p>
              </div>

              {/* Demo credentials */}
              <div className="mt-6 p-4 bg-secondary-50 rounded-lg border border-secondary-200">
                <p className="text-xs text-secondary-600 font-medium mb-2">Credenciales de demostración:</p>
                <div className="text-xs text-secondary-500 space-y-1">
                  <p><strong>Email:</strong> admin@medicare.com</p>
                  <p><strong>Contraseña:</strong> demo123</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}