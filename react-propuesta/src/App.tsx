import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { AppointmentsPage } from './pages/AppointmentsPage'
import { PatientsPage } from './pages/PatientsPage'
import { DoctorsPage } from './pages/DoctorsPage'
import { Layout } from './components/Layout'
import './style.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-secondary-50">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Rutas protegidas con layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="patients" element={<PatientsPage />} />
            <Route path="doctors" element={<DoctorsPage />} />
          </Route>
          
          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App