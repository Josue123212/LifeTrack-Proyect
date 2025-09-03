# ⚛️ Guía de Desarrollo React Frontend - Sistema de Citas Médicas

## 📋 Lista de Verificación Completa

### 🚀 Fase 1: Configuración Inicial del Proyecto

#### 1.1 Setup del Entorno Node.js
- [x] Verificar Node.js 18+ instalado: `node --version` ✅ v22.15.0
- [x] Verificar npm/yarn instalado: `npm --version` ✅ v10.9.2
- [x] Crear carpeta `frontend/` ✅ Creada
- [x] Navegar a la carpeta: `cd frontend` ✅ Completado

#### 1.2 Creación del Proyecto React
- [x] Crear proyecto con Vite: `npm create vite@latest . -- --template react-ts` ✅ Completado
- [x] Instalar dependencias: `npm install` ✅ Completado
- [x] Probar servidor de desarrollo: `npm run dev` ✅ Servidor funcionando en http://localhost:5173
- [x] Verificar que React funciona en http://localhost:5173 ✅ Verificado
- [x] Limpiar archivos de ejemplo innecesarios ✅ Archivos CSS y SVG de ejemplo eliminados

#### 1.3 Configuración de TypeScript
- [x] Verificar `tsconfig.json` configurado correctamente ✅ Verificado
- [x] Configurar paths absolutos en `tsconfig.json`: ✅ Configurado
  ```json
  {
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@/*": ["src/*"]
      }
    }
  }
  ```
- [x] Configurar Vite para paths absolutos en `vite.config.ts` ✅ Configurado con alias
- [x] Probar imports absolutos ✅ Funcionando correctamente con TestComponent

---

### 🎨 Fase 2: Configuración de Estilos y UI

#### 2.1 Instalación de Tailwind CSS
- [x] Instalar Tailwind: `npm install -D tailwindcss postcss autoprefixer` ✅ Completado
- [x] Inicializar Tailwind: `npx tailwindcss init -p` ✅ Configurado manualmente
- [x] Configurar `tailwind.config.js`: ✅ Configurado con paleta personalizada
  ```javascript
  module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            50: '#eff6ff',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
          }
        }
      },
    },
    plugins: [],
  }
  ```
- [x] Agregar directivas de Tailwind a `src/index.css`: ✅ Completado
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```
- [x] Probar clases de Tailwind en componentes ✅ Verificado en App.tsx y TestComponent.tsx

#### 2.2 Instalación de Librerías UI
- [x] Instalar React Icons: `npm install react-icons` ✅ Instalado
- [x] Instalar Headless UI: `npm install @headlessui/react` ✅ Instalado
- [x] Instalar React Hot Toast: `npm install react-hot-toast` ✅ Instalado
- [x] Probar componentes básicos ✅ Verificado en UILibrariesTest.tsx

#### 2.3 Configuración de Componentes Base
- [x] Crear carpeta `src/components/ui/` ✅ Completado
- [x] Crear componente `Button.tsx`: ✅ Completado con class-variance-authority
  ```typescript
  interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'outline' | 'destructive' | 'ghost' | 'link';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
  }
  ```
- [x] Crear componente `Input.tsx` ✅ Completado con validaciones y estados
- [x] Crear componente `Card.tsx` ✅ Completado con subcomponentes (Header, Title, Content, Footer)
- [x] Crear componente `Modal.tsx` ✅ Completado con Headless UI y animaciones
- [x] Probar todos los componentes base ✅ Verificado en UIComponentsTest.tsx

---

### 🔧 Fase 3: Configuración de Herramientas de Desarrollo

#### 3.1 Gestión de Estado y HTTP
- [x] Instalar React Query: `npm install @tanstack/react-query` ✅ Instalado v5.x
- [x] Instalar Axios: `npm install axios` ✅ Instalado para cliente HTTP
- [x] Configurar cliente HTTP en `src/services/api.ts`: ✅ Completado con interceptores
  ```typescript
  import axios from 'axios';
  
  const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  // Interceptor para token
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  ```
- [x] Configurar React Query Provider en `src/main.tsx` ✅ Configurado con DevTools
- [x] Instalar React Query DevTools: `npm install @tanstack/react-query-devtools` ✅ Para debugging
- [x] Crear componente de prueba ReactQueryTest.tsx ✅ Demo funcional con queries y mutations

#### 3.2 Routing ✅ COMPLETADO
- [x] Instalar React Router: `npm install react-router-dom @types/react-router-dom` ✅ Instalado con tipos TypeScript
- [x] Configurar router básico en `src/App.tsx` ✅ Implementado con BrowserRouter, Routes y Route:
  ```typescript
  import { BrowserRouter, Routes, Route } from 'react-router-dom';
  import { ProtectedRoute, PublicRoute } from '@/components/auth/ProtectedRoute';
  
  function App() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/dev" element={<DevPage />} /> {/* Página de desarrollo */}
          <Route path="*" element={<NotFoundPage />} /> {/* 404 */}
        </Routes>
      </BrowserRouter>
    );
  }
  ```
- [x] Crear componente de rutas protegidas `ProtectedRoute.tsx` ✅ Implementado con ProtectedRoute y PublicRoute:
  ```typescript
  const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) {
      return <div>Cargando...</div>;
    }
    
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    
    return <>{children}</>;
  };
  ```
- [x] Crear páginas principales: HomePage, LoginPage, DashboardPage ✅ Páginas funcionales con UI moderna
- [x] Implementar sistema de autenticación simulado ✅ Con localStorage para desarrollo

#### 3.3 Formularios y Validaciones
- [x] Instalar React Hook Form: `npm install react-hook-form` ✅ Instalado correctamente
- [x] Instalar Zod: `npm install zod @hookform/resolvers` ✅ Zod en lugar de Yup para mejor TypeScript
- [x] Crear hook personalizado para formularios ✅ `useFormValidation` en `/src/lib/hooks/useFormValidation.ts`
- [x] Configurar validaciones base ✅ Esquemas Zod en `/src/lib/validations.ts`
- [x] Actualizar LoginPage con React Hook Form ✅ Formulario con validación en tiempo real
- [x] Crear RegisterPage con validaciones ✅ Formulario completo con confirmación de contraseña

---

### 🔐 Fase 4: Sistema de Autenticación

#### 4.1 Context de Autenticación ✅
- [x] Crear `src/contexts/AuthContext.tsx`: ✅ Completado
  ```typescript
  interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (userData: RegisterData) => Promise<void>;
    isLoading: boolean;
    isAuthenticated: boolean;
  }
  ```
- [x] Implementar provider de autenticación ✅ AuthProvider implementado con useReducer
- [x] Crear hook `useAuth()` para consumir el context ✅ Hook creado con validación
- [x] Implementar persistencia de sesión con localStorage ✅ Persistencia automática implementada

#### 4.2 Servicios de Autenticación ✅
- [x] Crear `src/services/authService.ts` ✅ Completado:
  ```typescript
  export const authService = {
    login: async (email: string, password: string) => {
      const response = await api.post('/auth/login/', { email, password });
      return response.data;
    },
    register: async (userData: RegisterData) => {
      const response = await api.post('/auth/register/', userData);
      return response.data;
    },
    logout: async () => {
      await api.post('/auth/logout/');
      localStorage.removeItem('token');
    },
    refreshToken: async () => {
      const response = await api.post('/auth/refresh/');
      return response.data;
    },
    // + métodos adicionales: getProfile, updateProfile, etc.
  };
  ```
- [x] Implementar manejo de refresh tokens ✅ Lógica implementada
- [x] Crear interceptor para renovación automática de tokens ✅ Configurado en api.ts

#### 4.3 Páginas de Autenticación ✅
- [x] Crear `src/pages/auth/LoginPage.tsx` ✅ Completado:
  ```typescript
  const LoginPage = () => {
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();
    
    const handleSubmit = async (data: LoginData) => {
      try {
        await login(data);
        navigate('/dashboard');
      } catch (error) {
        toast.error('Error al iniciar sesión');
      }
    };
    // ... resto del componente
  };
  ```
- [x] Crear `src/pages/auth/RegisterPage.tsx` ✅ Completado con useAuth
- [ ] Crear `src/pages/auth/ForgotPasswordPage.tsx`
- [x] Implementar validaciones de formulario ✅ Con React Hook Form y Zod
- [x] Agregar manejo de errores y loading states ✅ Implementado

#### 4.4 Rutas Protegidas ✅
- [x] Actualizar `src/components/auth/ProtectedRoute.tsx` ✅ Completado con manejo de loading
- [x] Crear `PublicRoute` para páginas de auth ✅ Implementado (evita acceso si ya está logueado)
- [x] Configurar rutas en `App.tsx` ✅ Todas las rutas configuradas
- [x] Implementar redirecciones automáticas ✅ Funcionando correctamente

---

---

### 📱 Fase 5: Layout y Navegación

#### 5.1 Layout Principal
- [ ] Crear `src/components/layout/Layout.tsx`:
  ```typescript
  interface LayoutProps {
    children: React.ReactNode;
    showSidebar?: boolean;
  }
  
  const Layout: React.FC<LayoutProps> = ({ children, showSidebar = true }) => {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          {showSidebar && <Sidebar />}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    );
  };
  ```
- [ ] Crear componente `Header.tsx` con navegación
- [ ] Crear componente `Sidebar.tsx` con menú lateral
- [ ] Implementar navegación responsive

#### 5.2 Navegación por Roles
- [ ] Crear configuración de menús por rol en `src/config/navigation.ts`:
  ```typescript
  export const navigationConfig = {
    client: [
      { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
      { name: 'Mis Citas', href: '/appointments', icon: CalendarIcon },
      { name: 'Perfil', href: '/profile', icon: UserIcon },
    ],
    admin: [
      { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
      { name: 'Citas', href: '/appointments', icon: CalendarIcon },
      { name: 'Pacientes', href: '/patients', icon: UsersIcon },
      { name: 'Doctores', href: '/doctors', icon: UserGroupIcon },
      { name: 'Reportes', href: '/reports', icon: ChartBarIcon },
    ],
    // ... más roles
  };
  ```
- [ ] Implementar menú dinámico basado en rol
- [ ] Crear breadcrumbs dinámicos

#### 5.3 Rutas Protegidas
- [ ] Crear `src/components/auth/ProtectedRoute.tsx`:
  ```typescript
  interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: string[];
  }
  
  const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
    children, 
    requiredRole 
  }) => {
    const { isAuthenticated, user } = useAuth();
    
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    
    if (requiredRole && !requiredRole.includes(user?.role)) {
      return <Navigate to="/unauthorized" replace />;
    }
    
    return <>{children}</>;
  };
  ```
- [ ] Implementar redirección automática según rol
- [ ] Crear página de acceso no autorizado

---

### 📊 Fase 6: Dashboard y Páginas Principales

#### 6.1 Dashboard del Cliente
- [ ] Crear `src/pages/dashboard/ClientDashboard.tsx`:
  ```typescript
  const ClientDashboard = () => {
    const { data: appointments, isLoading } = useQuery(
      'user-appointments',
      appointmentService.getUserAppointments
    );
    const { data: upcomingAppointments } = useQuery(
      'upcoming-appointments',
      () => appointmentService.getUpcoming(3)
    );
    
    return (
      <div className="space-y-6">
        <WelcomeCard />
        <QuickActions />
        <UpcomingAppointments appointments={upcomingAppointments} />
        <RecentActivity />
      </div>
    );
  };
  ```
- [ ] Crear componente `WelcomeCard.tsx`
- [ ] Crear componente `QuickActions.tsx`
- [ ] Crear componente `UpcomingAppointments.tsx`
- [ ] Implementar métricas básicas del usuario

#### 6.2 Dashboard del Administrador
- [ ] Crear `src/pages/dashboard/AdminDashboard.tsx`:
  ```typescript
  const AdminDashboard = () => {
    const { data: stats } = useQuery('admin-stats', reportService.getStats);
    const { data: todayAppointments } = useQuery(
      'today-appointments',
      () => appointmentService.getTodayAppointments()
    );
    
    return (
      <div className="space-y-6">
        <StatsCards stats={stats} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TodayAppointments appointments={todayAppointments} />
          <RecentActivity />
        </div>
        <ChartsSection />
      </div>
    );
  };
  ```
- [ ] Crear componentes de estadísticas
- [ ] Implementar gráficos con Chart.js o Recharts
- [ ] Crear tabla de citas del día

#### 6.3 Dashboard del SuperAdmin
- [ ] Crear `src/pages/dashboard/SuperAdminDashboard.tsx`
- [ ] Implementar métricas del sistema
- [ ] Crear componentes de gestión de usuarios
- [ ] Agregar logs del sistema

---

### 📅 Fase 7: Gestión de Citas

#### 7.1 Servicios de Citas
- [ ] Crear `src/services/appointmentService.ts`:
  ```typescript
  export const appointmentService = {
    getAll: async (filters?: AppointmentFilters) => {
      const response = await api.get('/appointments/', { params: filters });
      return response.data;
    },
    create: async (appointmentData: CreateAppointmentData) => {
      const response = await api.post('/appointments/', appointmentData);
      return response.data;
    },
    update: async (id: string, data: UpdateAppointmentData) => {
      const response = await api.put(`/appointments/${id}/`, data);
      return response.data;
    },
    cancel: async (id: string) => {
      const response = await api.delete(`/appointments/${id}/`);
      return response.data;
    },
    getAvailableSlots: async (doctorId: string, date: string) => {
      const response = await api.get(`/appointments/available/`, {
        params: { doctor: doctorId, date }
      });
      return response.data;
    }
  };
  ```
- [ ] Crear tipos TypeScript para citas
- [ ] Implementar hooks personalizados para citas

#### 7.2 Lista de Citas
- [ ] Crear `src/pages/appointments/AppointmentList.tsx`:
  ```typescript
  const AppointmentList = () => {
    const [filters, setFilters] = useState<AppointmentFilters>({});
    const { data: appointments, isLoading } = useQuery(
      ['appointments', filters],
      () => appointmentService.getAll(filters)
    );
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Citas Médicas</h1>
          <Button onClick={() => setShowCreateModal(true)}>
            Nueva Cita
          </Button>
        </div>
        <AppointmentFilters filters={filters} onChange={setFilters} />
        <AppointmentTable appointments={appointments} />
      </div>
    );
  };
  ```
- [ ] Crear componente `AppointmentTable.tsx`
- [ ] Crear componente `AppointmentFilters.tsx`
- [ ] Implementar paginación
- [ ] Agregar búsqueda y filtros

#### 7.3 Formulario de Citas
- [ ] Crear `src/components/appointments/AppointmentForm.tsx`:
  ```typescript
  interface AppointmentFormProps {
    appointment?: Appointment;
    onSubmit: (data: AppointmentFormData) => void;
    onCancel: () => void;
  }
  
  const AppointmentForm: React.FC<AppointmentFormProps> = ({
    appointment,
    onSubmit,
    onCancel
  }) => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
      resolver: yupResolver(appointmentSchema),
      defaultValues: appointment
    });
    
    const selectedDoctor = watch('doctor');
    const selectedDate = watch('date');
    
    const { data: availableSlots } = useQuery(
      ['available-slots', selectedDoctor, selectedDate],
      () => appointmentService.getAvailableSlots(selectedDoctor, selectedDate),
      { enabled: !!selectedDoctor && !!selectedDate }
    );
    
    // ... resto del componente
  };
  ```
- [ ] Implementar selección de doctor
- [ ] Crear selector de fecha y hora
- [ ] Implementar validación de horarios disponibles
- [ ] Agregar confirmación de cita

#### 7.4 Calendario de Citas
- [ ] Instalar librería de calendario: `npm install react-big-calendar`
- [ ] Crear `src/components/appointments/AppointmentCalendar.tsx`
- [ ] Implementar vista mensual, semanal y diaria
- [ ] Agregar drag & drop para reprogramar citas
- [ ] Implementar colores por estado de cita

---

### 👥 Fase 8: Gestión de Usuarios

#### 8.1 Servicios de Usuarios
- [ ] Crear `src/services/userService.ts`
- [ ] Crear `src/services/doctorService.ts`
- [ ] Crear `src/services/patientService.ts`
- [ ] Implementar CRUD completo para cada entidad

#### 8.2 Lista de Doctores
- [ ] Crear `src/pages/doctors/DoctorList.tsx`
- [ ] Crear componente `DoctorCard.tsx`
- [ ] Implementar filtros por especialización
- [ ] Agregar búsqueda por nombre
- [ ] Crear modal de detalles de doctor

#### 8.3 Lista de Pacientes
- [ ] Crear `src/pages/patients/PatientList.tsx`
- [ ] Crear componente `PatientCard.tsx`
- [ ] Implementar historial médico
- [ ] Agregar filtros y búsqueda
- [ ] Crear formulario de paciente

#### 8.4 Perfil de Usuario
- [ ] Crear `src/pages/profile/ProfilePage.tsx`:
  ```typescript
  const ProfilePage = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    
    const updateMutation = useMutation(userService.updateProfile, {
      onSuccess: () => {
        toast.success('Perfil actualizado exitosamente');
        setIsEditing(false);
      }
    });
    
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <ProfileHeader user={user} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ProfileForm 
              user={user} 
              isEditing={isEditing}
              onSave={updateMutation.mutate}
            />
          </div>
          <div>
            <ProfileSidebar user={user} />
          </div>
        </div>
      </div>
    );
  };
  ```
- [ ] Crear formulario de edición de perfil
- [ ] Implementar cambio de contraseña
- [ ] Agregar upload de foto de perfil

---

### 📊 Fase 9: Reportes y Analytics

#### 9.1 Servicios de Reportes
- [ ] Crear `src/services/reportService.ts`:
  ```typescript
  export const reportService = {
    getStats: async () => {
      const response = await api.get('/reports/stats/');
      return response.data;
    },
    getAppointmentsByPeriod: async (startDate: string, endDate: string) => {
      const response = await api.get('/reports/appointments/', {
        params: { start_date: startDate, end_date: endDate }
      });
      return response.data;
    },
    exportAppointments: async (filters: ExportFilters) => {
      const response = await api.get('/reports/export/', {
        params: filters,
        responseType: 'blob'
      });
      return response.data;
    }
  };
  ```
- [ ] Implementar exportación de datos
- [ ] Crear filtros de fecha para reportes

#### 9.2 Página de Reportes
- [ ] Crear `src/pages/reports/ReportsPage.tsx`
- [ ] Instalar librería de gráficos: `npm install recharts`
- [ ] Crear componentes de gráficos:
  ```typescript
  const AppointmentChart = ({ data }: { data: ChartData[] }) => {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="appointments" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    );
  };
  ```
- [ ] Crear gráfico de citas por período
- [ ] Implementar gráfico de doctores más solicitados
- [ ] Agregar métricas de cancelaciones

#### 9.3 Dashboard de Analytics
- [ ] Crear componentes de KPIs
- [ ] Implementar filtros de fecha
- [ ] Agregar comparación de períodos
- [ ] Crear exportación de reportes

---

### 📱 Fase 10: Responsive y UX

#### 10.1 Diseño Responsive
- [ ] Revisar todas las páginas en móvil
- [ ] Implementar menú hamburguesa para móvil
- [ ] Optimizar tablas para pantallas pequeñas
- [ ] Crear componentes específicos para móvil
- [ ] Probar en diferentes tamaños de pantalla

#### 10.2 Mejoras de UX
- [ ] Implementar loading skeletons
- [ ] Agregar estados vacíos (empty states)
- [ ] Crear confirmaciones para acciones destructivas
- [ ] Implementar tooltips informativos
- [ ] Agregar animaciones suaves

#### 10.3 Accesibilidad
- [ ] Agregar atributos ARIA
- [ ] Implementar navegación por teclado
- [ ] Verificar contraste de colores
- [ ] Agregar textos alternativos
- [ ] Probar con lectores de pantalla

---

### 🔧 Fase 11: Optimización y Performance

#### 11.1 Optimización de Bundle
- [ ] Implementar code splitting:
  ```typescript
  const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
  const AppointmentsPage = lazy(() => import('./pages/appointments/AppointmentsPage'));
  
  // En el router
  <Route 
    path="/dashboard" 
    element={
      <Suspense fallback={<LoadingSpinner />}>
        <DashboardPage />
      </Suspense>
    } 
  />
  ```
- [ ] Analizar bundle con `npm run build -- --analyze`
- [ ] Optimizar imports de librerías
- [ ] Implementar tree shaking

#### 11.2 Optimización de Imágenes
- [ ] Implementar lazy loading de imágenes
- [ ] Optimizar formatos de imagen
- [ ] Crear componente de imagen optimizada
- [ ] Implementar placeholders

#### 11.3 Cache y Estado
- [ ] Configurar cache de React Query:
  ```typescript
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutos
        cacheTime: 10 * 60 * 1000, // 10 minutos
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
  ```
- [ ] Implementar invalidación inteligente de cache
- [ ] Optimizar re-renders con React.memo
- [ ] Usar useMemo y useCallback apropiadamente

---

### 🧪 Fase 12: Testing

#### 12.1 Configuración de Testing
- [ ] Instalar dependencias de testing:
  ```bash
  npm install -D @testing-library/react @testing-library/jest-dom 
  @testing-library/user-event vitest jsdom
  ```
- [ ] Configurar Vitest en `vite.config.ts`
- [ ] Crear `src/test/setup.ts` para configuración global
- [ ] Crear utilities de testing

#### 12.2 Tests de Componentes
- [ ] Crear tests para componentes UI básicos:
  ```typescript
  describe('Button Component', () => {
    it('renders with correct text', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });
    
    it('calls onClick when clicked', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      fireEvent.click(screen.getByText('Click me'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
  ```
- [ ] Crear tests para formularios
- [ ] Probar componentes de autenticación
- [ ] Testear componentes de citas

#### 12.3 Tests de Integración
- [ ] Crear tests de flujos completos
- [ ] Probar navegación entre páginas
- [ ] Testear autenticación end-to-end
- [ ] Verificar manejo de errores

#### 12.4 Tests E2E (Opcional)
- [ ] Instalar Cypress: `npm install -D cypress`
- [ ] Configurar Cypress
- [ ] Crear tests de flujos críticos
- [ ] Automatizar tests en CI/CD

---

### 🚀 Fase 13: Build y Deployment

#### 13.1 Configuración de Build
- [ ] Optimizar configuración de Vite para producción
- [ ] Configurar variables de entorno:
  ```typescript
  // src/config/env.ts
  export const config = {
    API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    APP_NAME: import.meta.env.VITE_APP_NAME || 'Sistema de Citas',
    NODE_ENV: import.meta.env.NODE_ENV,
  };
  ```
- [ ] Crear archivos `.env.development` y `.env.production`
- [ ] Probar build de producción: `npm run build`
- [ ] Verificar que el build funciona: `npm run preview`

#### 13.2 Optimización para Producción
- [ ] Configurar Service Worker para cache
- [ ] Implementar manifest.json para PWA
- [ ] Optimizar meta tags para SEO
- [ ] Configurar CSP headers
- [ ] Minimizar y comprimir assets

#### 13.3 Deployment
- [ ] Configurar deployment en Netlify/Vercel:
  ```json
  {
    "build": {
      "command": "npm run build",
      "publish": "dist"
    },
    "redirects": [
      {
        "from": "/*",
        "to": "/index.html",
        "status": 200
      }
    ]
  }
  ```
- [ ] Configurar variables de entorno en plataforma
- [ ] Probar deployment en staging
- [ ] Configurar dominio personalizado

---

### 📊 Fase 14: Monitoreo y Analytics

#### 14.1 Error Tracking
- [ ] Instalar Sentry: `npm install @sentry/react`
- [ ] Configurar Sentry:
  ```typescript
  import * as Sentry from '@sentry/react';
  
  Sentry.init({
    dsn: "YOUR_SENTRY_DSN",
    environment: import.meta.env.NODE_ENV,
  });
  ```
- [ ] Crear boundary de errores
- [ ] Implementar logging de errores

#### 14.2 Analytics
- [ ] Configurar Google Analytics (opcional)
- [ ] Implementar tracking de eventos importantes
- [ ] Crear métricas de uso
- [ ] Monitorear performance

---

## 🎯 Comandos Útiles de Desarrollo

### Comandos npm/yarn Frecuentes
```bash
# Desarrollo
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Linting
npm run test         # Tests
npm run test:watch   # Tests en modo watch

# Instalación de dependencias
npm install <package>     # Dependencia de producción
npm install -D <package>  # Dependencia de desarrollo
npm update               # Actualizar dependencias

# Análisis
npm run build -- --analyze  # Analizar bundle
npm audit                   # Auditoría de seguridad
```

### Comandos de Git
```bash
# Workflow básico
git add .
git commit -m "feat: add appointment form"
git push origin main

# Branches
git checkout -b feature/appointment-calendar
git merge feature/appointment-calendar
git branch -d feature/appointment-calendar
```

---

## 📝 Estructura de Archivos Recomendada

```
src/
├── components/
│   ├── ui/                 # Componentes base reutilizables
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── Card.tsx
│   ├── layout/             # Componentes de layout
│   │   ├── Layout.tsx
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   ├── auth/               # Componentes de autenticación
│   ├── appointments/       # Componentes de citas
│   ├── doctors/           # Componentes de doctores
│   └── patients/          # Componentes de pacientes
├── pages/
│   ├── auth/
│   ├── dashboard/
│   ├── appointments/
│   ├── doctors/
│   ├── patients/
│   └── reports/
├── hooks/                  # Custom hooks
│   ├── useAuth.ts
│   ├── useAppointments.ts
│   └── useLocalStorage.ts
├── services/              # Servicios de API
│   ├── api.ts
│   ├── authService.ts
│   ├── appointmentService.ts
│   └── userService.ts
├── contexts/              # React contexts
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── types/                 # Definiciones de TypeScript
│   ├── auth.ts
│   ├── appointment.ts
│   └── user.ts
├── utils/                 # Utilidades
│   ├── formatters.ts
│   ├── validators.ts
│   └── constants.ts
├── config/               # Configuraciones
│   ├── env.ts
│   └── navigation.ts
└── assets/              # Assets estáticos
    ├── images/
    └── icons/
```

---

## 🔧 Troubleshooting Común

### Problemas de CORS
- [ ] Verificar configuración del backend
- [ ] Revisar URL de la API
- [ ] Probar con proxy en Vite:
  ```typescript
  // vite.config.ts
  export default defineConfig({
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
      },
    },
  });
  ```

### Problemas de Autenticación
- [ ] Verificar que el token se guarda correctamente
- [ ] Revisar interceptors de Axios
- [ ] Probar refresh de tokens
- [ ] Verificar expiración de tokens

### Problemas de Performance
- [ ] Revisar re-renders innecesarios
- [ ] Optimizar queries de React Query
- [ ] Verificar tamaño del bundle
- [ ] Implementar lazy loading

### Problemas de Build
- [ ] Verificar variables de entorno
- [ ] Revisar imports dinámicos
- [ ] Probar en modo de desarrollo
- [ ] Verificar configuración de Vite

---

## 📚 Recursos Adicionales

### Documentación Oficial
- [ ] [React Documentation](https://react.dev/)
- [ ] [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [ ] [Tailwind CSS](https://tailwindcss.com/docs)
- [ ] [React Query](https://tanstack.com/query/latest)
- [ ] [React Hook Form](https://react-hook-form.com/)

### Herramientas de Desarrollo
- [ ] React Developer Tools (extensión de navegador)
- [ ] Redux DevTools (si usas Redux)
- [ ] React Query DevTools
- [ ] Tailwind CSS IntelliSense (VS Code)

---

## ✅ Checklist Final

### Antes de Producción
- [ ] Todos los tests pasan
- [ ] Build de producción funciona
- [ ] Variables de entorno configuradas
- [ ] Error tracking configurado
- [ ] Performance optimizada
- [ ] Accesibilidad verificada
- [ ] Responsive design probado
- [ ] SEO básico implementado
- [ ] Documentación actualizada

### Post-Deployment
- [ ] Monitoreo de errores activo
- [ ] Analytics configurado
- [ ] Backup de datos configurado
- [ ] Plan de rollback preparado
- [ ] Documentación de deployment

---

*Esta guía debe seguirse paso a paso, marcando cada checkbox al completar la tarea correspondiente. Recuerda hacer commits frecuentes y probar cada funcionalidad antes de continuar.*