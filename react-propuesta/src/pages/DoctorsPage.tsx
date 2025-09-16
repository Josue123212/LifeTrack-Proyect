import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Stethoscope, Phone, Mail, Calendar, Clock, Search, Star } from 'lucide-react'

export function DoctorsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-secondary-900">Gestión de Doctores</h1>
        <Button className="bg-success-600 hover:bg-success-700">
          Nuevo Doctor
        </Button>
      </div>

      {/* Búsqueda y filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
              <Input
                placeholder="Buscar doctores por nombre, especialidad o email..."
                className="pl-10"
              />
            </div>
            <select className="px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-success-500">
              <option>Todas las especialidades</option>
              <option>Cardiología</option>
              <option>Dermatología</option>
              <option>Pediatría</option>
              <option>Neurología</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de doctores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            id: 1,
            name: 'Dr. Juan Pérez',
            specialty: 'Cardiología',
            email: 'juan.perez@hospital.com',
            phone: '+1 234 567 8900',
            experience: '15 años',
            rating: 4.8,
            schedule: 'Lun-Vie 8:00-17:00',
            patients: 156,
            status: 'Disponible'
          },
          {
            id: 2,
            name: 'Dra. María López',
            specialty: 'Pediatría',
            email: 'maria.lopez@hospital.com',
            phone: '+1 234 567 8901',
            experience: '12 años',
            rating: 4.9,
            schedule: 'Lun-Vie 9:00-18:00',
            patients: 203,
            status: 'Disponible'
          },
          {
            id: 3,
            name: 'Dr. Carlos García',
            specialty: 'Dermatología',
            email: 'carlos.garcia@hospital.com',
            phone: '+1 234 567 8902',
            experience: '8 años',
            rating: 4.7,
            schedule: 'Mar-Sáb 10:00-19:00',
            patients: 89,
            status: 'En consulta'
          },
          {
            id: 4,
            name: 'Dra. Ana Martínez',
            specialty: 'Neurología',
            email: 'ana.martinez@hospital.com',
            phone: '+1 234 567 8903',
            experience: '20 años',
            rating: 4.9,
            schedule: 'Lun-Jue 8:00-16:00',
            patients: 134,
            status: 'Disponible'
          },
          {
            id: 5,
            name: 'Dr. Roberto Silva',
            specialty: 'Traumatología',
            email: 'roberto.silva@hospital.com',
            phone: '+1 234 567 8904',
            experience: '10 años',
            rating: 4.6,
            schedule: 'Lun-Vie 7:00-15:00',
            patients: 98,
            status: 'Vacaciones'
          },
          {
            id: 6,
            name: 'Dra. Carmen Ruiz',
            specialty: 'Ginecología',
            email: 'carmen.ruiz@hospital.com',
            phone: '+1 234 567 8905',
            experience: '14 años',
            rating: 4.8,
            schedule: 'Mar-Sáb 9:00-17:00',
            patients: 167,
            status: 'Disponible'
          }
        ].map((doctor) => (
          <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-success-100 rounded-full">
                    <Stethoscope className="h-5 w-5 text-success-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{doctor.name}</CardTitle>
                    <p className="text-sm text-success-600 font-medium">{doctor.specialty}</p>
                  </div>
                </div>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  doctor.status === 'Disponible' ? 'bg-green-100 text-green-800' :
                  doctor.status === 'En consulta' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {doctor.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-secondary-400" />
                  <span className="text-sm text-secondary-600">{doctor.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-secondary-400" />
                  <span className="text-sm text-secondary-600">{doctor.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-secondary-400" />
                  <span className="text-sm text-secondary-600">{doctor.schedule}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-secondary-400" />
                  <span className="text-sm text-secondary-600">{doctor.experience} de experiencia</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{doctor.rating}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-secondary-600">{doctor.patients} pacientes</p>
                </div>
              </div>
              
              <div className="pt-3 space-y-2">
                <Button size="sm" className="w-full bg-success-600 hover:bg-success-700">
                  Ver Agenda
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline">
                    Editar
                  </Button>
                  <Button size="sm" variant="outline">
                    Contactar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-success-600">8</div>
              <p className="text-sm text-secondary-600">Total Doctores</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">6</div>
              <p className="text-sm text-secondary-600">Disponibles</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">1</div>
              <p className="text-sm text-secondary-600">En Consulta</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">1</div>
              <p className="text-sm text-secondary-600">No Disponible</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}