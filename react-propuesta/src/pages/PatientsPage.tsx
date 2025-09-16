import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { User, Phone, Mail, Calendar, Search } from 'lucide-react'

export function PatientsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-secondary-900">Gestión de Pacientes</h1>
        <Button className="bg-success-600 hover:bg-success-700">
          Nuevo Paciente
        </Button>
      </div>

      {/* Búsqueda y filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
              <Input
                placeholder="Buscar pacientes por nombre, email o teléfono..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              Filtros Avanzados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de pacientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            id: 1,
            name: 'María González',
            email: 'maria.gonzalez@email.com',
            phone: '+1 234 567 8900',
            birthDate: '1985-03-15',
            lastVisit: '2024-01-15',
            status: 'Activo'
          },
          {
            id: 2,
            name: 'Carlos Rodríguez',
            email: 'carlos.rodriguez@email.com',
            phone: '+1 234 567 8901',
            birthDate: '1978-07-22',
            lastVisit: '2024-01-10',
            status: 'Activo'
          },
          {
            id: 3,
            name: 'Ana Martínez',
            email: 'ana.martinez@email.com',
            phone: '+1 234 567 8902',
            birthDate: '1992-11-08',
            lastVisit: '2023-12-20',
            status: 'Inactivo'
          },
          {
            id: 4,
            name: 'Luis Fernández',
            email: 'luis.fernandez@email.com',
            phone: '+1 234 567 8903',
            birthDate: '1965-05-30',
            lastVisit: '2024-01-12',
            status: 'Activo'
          },
          {
            id: 5,
            name: 'Carmen López',
            email: 'carmen.lopez@email.com',
            phone: '+1 234 567 8904',
            birthDate: '1988-09-14',
            lastVisit: '2024-01-08',
            status: 'Activo'
          },
          {
            id: 6,
            name: 'Roberto Silva',
            email: 'roberto.silva@email.com',
            phone: '+1 234 567 8905',
            birthDate: '1975-12-03',
            lastVisit: '2023-11-25',
            status: 'Inactivo'
          }
        ].map((patient) => (
          <Card key={patient.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-success-100 rounded-full">
                    <User className="h-5 w-5 text-success-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{patient.name}</CardTitle>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      patient.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {patient.status}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-secondary-400" />
                  <span className="text-sm text-secondary-600">{patient.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-secondary-400" />
                  <span className="text-sm text-secondary-600">{patient.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-secondary-400" />
                  <span className="text-sm text-secondary-600">Nacimiento: {patient.birthDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-secondary-400" />
                  <span className="text-sm text-secondary-600">Última visita: {patient.lastVisit}</span>
                </div>
              </div>
              
              <div className="pt-3 border-t space-y-2">
                <Button size="sm" className="w-full bg-success-600 hover:bg-success-700">
                  Ver Historial
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline">
                    Editar
                  </Button>
                  <Button size="sm" variant="outline">
                    Nueva Cita
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Paginación */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-secondary-600">
              Mostrando 6 de 245 pacientes
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Anterior
              </Button>
              <Button variant="outline" size="sm">
                1
              </Button>
              <Button size="sm" className="bg-success-600 hover:bg-success-700">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                Siguiente
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}