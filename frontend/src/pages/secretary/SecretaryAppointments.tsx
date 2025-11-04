import React, { useState } from 'react';
import { Layout } from '../../components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Search,
  Filter,
  Plus,
  Eye,
  Edit
} from 'lucide-react';

// 🎭 Mocks realistas basados en la estructura del backend
const mockAppointments = [
  {
    id: 1,
    patient: {
      id: 1,
      user: {
        firstName: "María",
        lastName: "González",
        email: "maria.gonzalez@email.com",
        phone: "+1234567890"
      },
      date_of_birth: "1985-03-15"
    },
    doctor: {
      id: 1,
      user: {
        firstName: "Dr. Carlos",
        lastName: "Rodríguez"
      },
      specialization: "Cardiología"
    },
    appointment_date: "2024-01-15",
    appointment_time: "09:00",
    status: "scheduled",
    reason: "Consulta de rutina cardiológica",
    notes: "Paciente con antecedentes de hipertensión",
    created_at: "2024-01-10T10:00:00Z"
  },
  {
    id: 2,
    patient: {
      id: 2,
      user: {
        firstName: "Juan",
        lastName: "Pérez",
        email: "juan.perez@email.com",
        phone: "+1234567891"
      },
      date_of_birth: "1990-07-22"
    },
    doctor: {
      id: 2,
      user: {
        firstName: "Dra. Ana",
        lastName: "Martínez"
      },
      specialization: "Dermatología"
    },
    appointment_date: "2024-01-15",
    appointment_time: "10:30",
    status: "confirmed",
    reason: "Revisión de lunares",
    notes: "Control anual preventivo",
    created_at: "2024-01-12T14:30:00Z"
  },
  {
    id: 3,
    patient: {
      id: 3,
      user: {
        firstName: "Carmen",
        lastName: "López",
        email: "carmen.lopez@email.com",
        phone: "+1234567892"
      },
      date_of_birth: "1978-11-08"
    },
    doctor: {
      id: 3,
      user: {
        firstName: "Dr. Luis",
        lastName: "García"
      },
      specialization: "Pediatría"
    },
    appointment_date: "2024-01-15",
    appointment_time: "14:00",
    status: "pending_confirmation",
    reason: "Consulta pediátrica para hijo",
    notes: "Primera consulta",
    created_at: "2024-01-14T09:15:00Z"
  },
  {
    id: 4,
    patient: {
      id: 4,
      user: {
        firstName: "Roberto",
        lastName: "Silva",
        email: "roberto.silva@email.com",
        phone: "+1234567893"
      },
      date_of_birth: "1965-05-30"
    },
    doctor: {
      id: 1,
      user: {
        firstName: "Dr. Carlos",
        lastName: "Rodríguez"
      },
      specialization: "Cardiología"
    },
    appointment_date: "2024-01-16",
    appointment_time: "11:00",
    status: "cancelled",
    reason: "Seguimiento post-operatorio",
    notes: "Cancelada por el paciente",
    created_at: "2024-01-13T16:45:00Z"
  }
];

const statusConfig = {
  scheduled: { label: 'Programada', color: 'bg-blue-100 text-blue-800', icon: Calendar },
  confirmed: { label: 'Confirmada', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  pending_confirmation: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
  in_progress: { label: 'En Curso', color: 'bg-purple-100 text-purple-800', icon: Clock },
  completed: { label: 'Completada', color: 'bg-gray-100 text-gray-800', icon: CheckCircle },
  cancelled: { label: 'Cancelada', color: 'bg-red-100 text-red-800', icon: XCircle },
  no_show: { label: 'No Asistió', color: 'bg-orange-100 text-orange-800', icon: XCircle }
};

const SecretaryAppointments: React.FC = () => {
  const [appointments] = useState(mockAppointments);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar citas
  const filteredAppointments = appointments.filter(appointment => {
    const matchesStatus = selectedStatus === 'all' || appointment.status === selectedStatus;
    const matchesSearch = searchTerm === '' || 
      appointment.patient.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patient.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctor.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctor.user.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const handleConfirmAppointment = (appointmentId: number) => {
    console.log('Confirmar cita:', appointmentId);
    // Aquí iría la lógica real de confirmación
  };

  const handleCancelAppointment = (appointmentId: number) => {
    console.log('Cancelar cita:', appointmentId);
    // Aquí iría la lógica real de cancelación
  };

  const handleCallPatient = (phone: string) => {
    console.log('Llamar a:', phone);
    // Aquí iría la lógica real de llamada
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Citas</h1>
            <p className="text-gray-600 mt-2">Administra y confirma las citas médicas</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Cita
          </Button>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar por paciente o doctor..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="all">Todos los estados</option>
                  <option value="pending_confirmation">Pendientes</option>
                  <option value="confirmed">Confirmadas</option>
                  <option value="scheduled">Programadas</option>
                  <option value="completed">Completadas</option>
                  <option value="cancelled">Canceladas</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              Citas ({filteredAppointments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => {
                  const StatusIcon = statusConfig[appointment.status as keyof typeof statusConfig]?.icon || AlertCircle;
                  const statusInfo = statusConfig[appointment.status as keyof typeof statusConfig];
                  
                  return (
                    <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-500" />
                              <span className="font-medium text-gray-900">
                                {appointment.patient.user.firstName} {appointment.patient.user.lastName}
                              </span>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${statusInfo?.color}`}>
                              {statusInfo?.label}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{appointment.appointment_date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{appointment.appointment_time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>{appointment.doctor.user.firstName} {appointment.doctor.user.lastName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{appointment.patient.user.phone}</span>
                            </div>
                          </div>
                          
                          <div className="text-sm">
                            <p className="text-gray-700 mb-1"><strong>Motivo:</strong> {appointment.reason}</p>
                            {appointment.notes && (
                              <p className="text-gray-600"><strong>Notas:</strong> {appointment.notes}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-4">
                          {appointment.status === 'pending_confirmation' && (
                            <>
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleConfirmAppointment(appointment.id)}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Confirmar
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-orange-300 text-orange-600 hover:bg-orange-50"
                                onClick={() => handleCallPatient(appointment.patient.user.phone)}
                              >
                                <Phone className="w-4 h-4 mr-1" />
                                Llamar
                              </Button>
                            </>
                          )}
                          
                          {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="border-blue-300 text-blue-600 hover:bg-blue-50"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Ver
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="border-gray-300 text-gray-600 hover:bg-gray-50"
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Editar
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-red-300 text-red-600 hover:bg-red-50"
                                onClick={() => handleCancelAppointment(appointment.id)}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Cancelar
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <div className="text-lg font-medium text-gray-600 mb-2">
                    No se encontraron citas
                  </div>
                  <div className="text-sm text-gray-500">
                    Intenta ajustar los filtros de búsqueda
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SecretaryAppointments;