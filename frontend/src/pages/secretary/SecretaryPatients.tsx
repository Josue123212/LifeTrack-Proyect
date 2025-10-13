import React, { useState } from 'react';
import { Layout } from '../../components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Phone, 
  Mail, 
  Calendar,
  MapPin,
  FileText,
  UserPlus,
  Clock
} from 'lucide-react';

// 🎭 Mocks realistas basados en la estructura del backend
const mockPatients = [
  {
    id: 1,
    user: {
      firstName: "María",
      lastName: "González",
      email: "maria.gonzalez@email.com",
      phone: "+1234567890"
    },
    date_of_birth: "1985-03-15",
    gender: "female",
    address: "Calle Principal 123, Ciudad",
    emergency_contact_name: "Carlos González",
    emergency_contact_phone: "+1234567899",
    medical_history: "Hipertensión arterial",
    allergies: "Penicilina",
    blood_type: "O+",
    created_at: "2023-06-15T10:30:00Z",
    last_appointment: "2024-01-10",
    total_appointments: 8,
    status: "active"
  },
  {
    id: 2,
    user: {
      firstName: "Juan",
      lastName: "Pérez",
      email: "juan.perez@email.com",
      phone: "+1234567891"
    },
    date_of_birth: "1990-07-22",
    gender: "male",
    address: "Avenida Central 456, Ciudad",
    emergency_contact_name: "Ana Pérez",
    emergency_contact_phone: "+1234567898",
    medical_history: "Diabetes tipo 2",
    allergies: "Ninguna conocida",
    blood_type: "A+",
    created_at: "2023-08-20T14:15:00Z",
    last_appointment: "2024-01-12",
    total_appointments: 12,
    status: "active"
  },
  {
    id: 3,
    user: {
      firstName: "Carmen",
      lastName: "López",
      email: "carmen.lopez@email.com",
      phone: "+1234567892"
    },
    date_of_birth: "1978-11-08",
    gender: "female",
    address: "Plaza Mayor 789, Ciudad",
    emergency_contact_name: "Luis López",
    emergency_contact_phone: "+1234567897",
    medical_history: "Asma bronquial",
    allergies: "Polen, ácaros",
    blood_type: "B-",
    created_at: "2023-12-05T09:45:00Z",
    last_appointment: "2024-01-08",
    total_appointments: 3,
    status: "active"
  },
  {
    id: 4,
    user: {
      firstName: "Roberto",
      lastName: "Silva",
      email: "roberto.silva@email.com",
      phone: "+1234567893"
    },
    date_of_birth: "1965-05-30",
    gender: "male",
    address: "Barrio Norte 321, Ciudad",
    emergency_contact_name: "Elena Silva",
    emergency_contact_phone: "+1234567896",
    medical_history: "Cardiopatía isquémica",
    allergies: "Aspirina",
    blood_type: "AB+",
    created_at: "2022-03-10T16:20:00Z",
    last_appointment: "2023-12-20",
    total_appointments: 25,
    status: "inactive"
  },
  {
    id: 5,
    user: {
      firstName: "Ana",
      lastName: "Martín",
      email: "ana.martin@email.com",
      phone: "+1234567894"
    },
    date_of_birth: "1995-09-12",
    gender: "female",
    address: "Calle Nueva 654, Ciudad",
    emergency_contact_name: "Pedro Martín",
    emergency_contact_phone: "+1234567895",
    medical_history: "Ninguna",
    allergies: "Ninguna conocida",
    blood_type: "O-",
    created_at: "2024-01-10T11:00:00Z",
    last_appointment: null,
    total_appointments: 0,
    status: "new"
  }
];

const statusConfig = {
  active: { label: 'Activo', color: 'bg-green-100 text-green-800' },
  inactive: { label: 'Inactivo', color: 'bg-gray-100 text-gray-800' },
  new: { label: 'Nuevo', color: 'bg-blue-100 text-blue-800' }
};

const SecretaryPatients: React.FC = () => {
  const [patients] = useState(mockPatients);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar pacientes
  const filteredPatients = patients.filter(patient => {
    const matchesStatus = selectedStatus === 'all' || patient.status === selectedStatus;
    const matchesSearch = searchTerm === '' || 
      patient.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.user.phone.includes(searchTerm);
    
    return matchesStatus && matchesSearch;
  });

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleCallPatient = (phone: string) => {
    console.log('Llamar a:', phone);
    // Aquí iría la lógica real de llamada
  };

  const handleEmailPatient = (email: string) => {
    console.log('Enviar email a:', email);
    // Aquí iría la lógica real de email
  };

  const handleScheduleAppointment = (patientId: number) => {
    console.log('Programar cita para paciente:', patientId);
    // Aquí iría la lógica real de programación de cita
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Pacientes</h1>
            <p className="text-gray-600 mt-2">Administra la información de los pacientes</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="w-4 h-4 mr-2" />
            Nuevo Paciente
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Pacientes</p>
                  <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <UserPlus className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pacientes Activos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {patients.filter(p => p.status === 'active').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pacientes Nuevos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {patients.filter(p => p.status === 'new').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Users className="w-6 h-6 text-gray-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Inactivos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {patients.filter(p => p.status === 'inactive').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
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
                    placeholder="Buscar por nombre, email o teléfono..."
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
                  <option value="active">Activos</option>
                  <option value="new">Nuevos</option>
                  <option value="inactive">Inactivos</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patients List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Pacientes ({filteredPatients.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => {
                  const statusInfo = statusConfig[patient.status as keyof typeof statusConfig];
                  
                  return (
                    <div key={patient.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-medium">
                                  {patient.user.firstName[0]}{patient.user.lastName[0]}
                                </span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-900 text-lg">
                                  {patient.user.firstName} {patient.user.lastName}
                                </span>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`px-2 py-1 text-xs rounded-full ${statusInfo?.color}`}>
                                    {statusInfo?.label}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    {calculateAge(patient.date_of_birth)} años
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{patient.user.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              <span className="truncate">{patient.user.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>Nacimiento: {patient.date_of_birth}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span className="truncate">{patient.address}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              <span>Tipo: {patient.blood_type}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{patient.total_appointments} citas</span>
                            </div>
                          </div>
                          
                          <div className="text-sm">
                            {patient.medical_history && (
                              <p className="text-gray-700 mb-1">
                                <strong>Historial:</strong> {patient.medical_history}
                              </p>
                            )}
                            {patient.allergies && patient.allergies !== "Ninguna conocida" && (
                              <p className="text-red-600">
                                <strong>Alergias:</strong> {patient.allergies}
                              </p>
                            )}
                            {patient.last_appointment && (
                              <p className="text-gray-600">
                                <strong>Última cita:</strong> {patient.last_appointment}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-4">
                          <Button 
                            size="sm" 
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => handleScheduleAppointment(patient.id)}
                          >
                            <Calendar className="w-4 h-4 mr-1" />
                            Cita
                          </Button>
                          
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-green-300 text-green-600 hover:bg-green-50"
                            onClick={() => handleCallPatient(patient.user.phone)}
                          >
                            <Phone className="w-4 h-4 mr-1" />
                            Llamar
                          </Button>
                          
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-purple-300 text-purple-600 hover:bg-purple-50"
                            onClick={() => handleEmailPatient(patient.user.email)}
                          >
                            <Mail className="w-4 h-4 mr-1" />
                            Email
                          </Button>
                          
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-gray-300 text-gray-600 hover:bg-gray-50"
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
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <div className="text-lg font-medium text-gray-600 mb-2">
                    No se encontraron pacientes
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

export default SecretaryPatients;