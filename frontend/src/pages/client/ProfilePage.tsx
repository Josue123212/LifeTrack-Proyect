// 👤 Página Mi Perfil - Cliente
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../../services/authService';
import { dashboardService } from '../../services/dashboardService';
import type { User, UpdateProfileData } from '../../types/auth';

// 🎨 Componentes UI
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Layout from '../../components/layout/Layout';

// 🎯 Iconos
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Heart, 
  AlertTriangle,
  Edit3,
  Save,
  X,
  Loader2
} from 'lucide-react';

/**
 * 👤 PÁGINA MI PERFIL - CLIENTE
 * 
 * Permite al cliente ver y editar su información personal:
 * - Datos básicos (nombre, email, teléfono)
 * - Información médica (alergias, condiciones)
 * - Estadísticas de citas
 */
const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UpdateProfileData>>({});
  const queryClient = useQueryClient();

  // 📊 Consulta del perfil del usuario
  const { data: user, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ['user-profile'],
    queryFn: authService.getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // 📊 Consulta de estadísticas del dashboard
  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ['client-dashboard'],
    queryFn: dashboardService.getClientDashboard,
    staleTime: 5 * 60 * 1000,
  });

  // 🔄 Mutación para actualizar perfil
  const updateProfileMutation = useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      setIsEditing(false);
      setEditForm({});
    },
    onError: (error: any) => {
      console.error('Error al actualizar perfil:', error);
    }
  });

  // 🎯 Handlers
  const handleEditClick = () => {
    setIsEditing(true);
    setEditForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      address: user?.address || '',
      emergencyContact: user?.emergencyContact || '',
      allergies: user?.allergies || '',
      medicalConditions: user?.medicalConditions || '',
    });
  };

  const handleSave = () => {
    if (editForm) {
      updateProfileMutation.mutate(editForm);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({});
  };

  const handleInputChange = (field: keyof UpdateProfileData, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  // 🔄 Estados de carga
  if (userLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Cargando perfil...</span>
        </div>
      </Layout>
    );
  }

  if (userError || !user) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar perfil</h2>
            <p className="text-gray-600">No se pudo cargar la información del perfil.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
      {/* 📋 Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
          <p className="text-gray-600">Gestiona tu información personal y médica</p>
        </div>
        
        {!isEditing ? (
          <Button onClick={handleEditClick} className="flex items-center gap-2">
            <Edit3 className="h-4 w-4" />
            Editar Perfil
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button 
              onClick={handleSave} 
              disabled={updateProfileMutation.isPending}
              className="flex items-center gap-2"
            >
              {updateProfileMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Guardar
            </Button>
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancelar
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 👤 Información Personal */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  {isEditing ? (
                    <Input
                      value={editForm.firstName || ''}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="Nombre"
                    />
                  ) : (
                    <p className="text-gray-900">{user.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido
                  </label>
                  {isEditing ? (
                    <Input
                      value={editForm.lastName || ''}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Apellido"
                    />
                  ) : (
                    <p className="text-gray-900">{user.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    Email
                  </label>
                  <p className="text-gray-900">{user.email}</p>
                  <p className="text-xs text-gray-500">El email no se puede modificar</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    Teléfono
                  </label>
                  {isEditing ? (
                    <Input
                      value={editForm.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Teléfono"
                    />
                  ) : (
                    <p className="text-gray-900">{user.phone || 'No especificado'}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Dirección
                  </label>
                  {isEditing ? (
                    <Input
                      value={editForm.address || ''}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Dirección completa"
                    />
                  ) : (
                    <p className="text-gray-900">{user.address || 'No especificada'}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contacto de Emergencia
                  </label>
                  {isEditing ? (
                    <Input
                      value={editForm.emergencyContact || ''}
                      onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                      placeholder="Nombre y teléfono del contacto de emergencia"
                    />
                  ) : (
                    <p className="text-gray-900">{user.emergencyContact || 'No especificado'}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 🏥 Información Médica */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Información Médica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alergias
                </label>
                {isEditing ? (
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    value={editForm.allergies || ''}
                    onChange={(e) => handleInputChange('allergies', e.target.value)}
                    placeholder="Describe cualquier alergia conocida..."
                  />
                ) : (
                  <p className="text-gray-900">{user.allergies || 'Ninguna alergia registrada'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Condiciones Médicas
                </label>
                {isEditing ? (
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    value={editForm.medicalConditions || ''}
                    onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
                    placeholder="Describe condiciones médicas relevantes..."
                  />
                ) : (
                  <p className="text-gray-900">{user.medicalConditions || 'Ninguna condición registrada'}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 📊 Panel Lateral - Estadísticas */}
        <div className="space-y-6">
          {/* 🏷️ Estado de la Cuenta */}
          <Card>
            <CardHeader>
              <CardTitle>Estado de la Cuenta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rol:</span>
                  <Badge variant="secondary">{user.role}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Estado:</span>
                  <Badge variant={user.isActive ? "default" : "destructive"}>
                    {user.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Miembro desde:
                  </span>
                  <span className="text-sm text-gray-900">
                    {new Date(user.dateJoined).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 📈 Estadísticas de Citas */}
          {dashboardData && (
            <Card>
              <CardHeader>
                <CardTitle>Mis Estadísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total de citas:</span>
                    <span className="text-lg font-semibold text-blue-600">
                      {dashboardData.totalAppointments || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Próximas citas:</span>
                    <span className="text-lg font-semibold text-green-600">
                      {dashboardData.upcomingAppointments || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Citas completadas:</span>
                    <span className="text-lg font-semibold text-gray-600">
                      {dashboardData.completedAppointments || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;