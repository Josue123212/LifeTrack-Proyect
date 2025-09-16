import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Calendar, Clock, User, Phone } from 'lucide-react'

export function AppointmentsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-secondary-900">Gestión de Citas</h1>
        <Button className="bg-success-600 hover:bg-success-700">
          Nueva Cita
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Fecha</label>
              <input type="date" className="w-full p-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Doctor</label>
              <select className="w-full p-2 border rounded-lg">
                <option>Todos los doctores</option>
                <option>Dr. Pérez</option>
                <option>Dr. López</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Estado</label>
              <select className="w-full p-2 border rounded-lg">
                <option>Todos</option>
                <option>Programada</option>
                <option>Completada</option>
                <option>Cancelada</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                Buscar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de citas */}
      <Card>
        <CardHeader>
          <CardTitle>Citas del Día</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                id: 1,
                patient: 'María González',
                doctor: 'Dr. Pérez',
                time: '10:30 AM',
                type: 'Consulta General',
                status: 'Programada',
                phone: '+1 234 567 8900'
              },
              {
                id: 2,
                patient: 'Carlos Rodríguez',
                doctor: 'Dr. López',
                time: '2:15 PM',
                type: 'Cardiología',
                status: 'Programada',
                phone: '+1 234 567 8901'
              },
              {
                id: 3,
                patient: 'Ana Martínez',
                doctor: 'Dr. García',
                time: '4:00 PM',
                type: 'Dermatología',
                status: 'Completada',
                phone: '+1 234 567 8902'
              }
            ].map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-success-100 rounded-full">
                    <User className="h-5 w-5 text-success-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{appointment.patient}</h3>
                    <p className="text-sm text-secondary-600">{appointment.type}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-secondary-400" />
                        <span className="text-sm text-secondary-600">{appointment.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="h-4 w-4 text-secondary-400" />
                        <span className="text-sm text-secondary-600">{appointment.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{appointment.doctor}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    appointment.status === 'Programada' ? 'bg-blue-100 text-blue-800' :
                    appointment.status === 'Completada' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {appointment.status}
                  </span>
                  <div className="mt-2 space-x-2">
                    <Button size="sm" variant="outline">
                      Editar
                    </Button>
                    <Button size="sm" variant="outline">
                      Cancelar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}