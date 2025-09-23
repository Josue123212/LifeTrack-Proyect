import React from 'react';
import { User, Phone, Calendar, FileText, AlertCircle } from 'lucide-react';
import type { DoctorPatient } from '../../../types';

interface PatientSummaryProps {
  recentPatients?: DoctorPatient[];
  isLoading?: boolean;
}

const PatientSummary: React.FC<PatientSummaryProps> = ({ recentPatients = [], isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-background rounded-xl p-6 shadow-sm border-border">
        <div className="h-6 bg-secondary-200 rounded w-1/3 mb-4 animate-pulse"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-4 bg-secondary-50 rounded-lg animate-pulse">
              <div className="w-10 h-10 bg-secondary-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-secondary-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-secondary-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-danger';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-success';
      default:
        return 'text-text-secondary';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Media';
      case 'low':
        return 'Baja';
      default:
        return 'Normal';
    }
  };

  return (
    <div className="bg-background rounded-xl p-6 shadow-sm border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">
          Pacientes Recientes
        </h3>
        <button className="text-primary hover:text-primary-hover text-sm font-medium">
          Ver todos
        </button>
      </div>

      {recentPatients.length === 0 ? (
        <div className="text-center py-8">
          <User className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <p className="text-text-secondary">No hay pacientes recientes</p>
          <p className="text-sm text-text-muted mt-1">Los pacientes aparecerán aquí después de las consultas</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recentPatients.map((patient) => (
            <div
              key={patient.id}
              className="flex items-start space-x-4 p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors cursor-pointer"
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
              </div>

              {/* Patient Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-sm font-medium text-text-primary truncate">
                    {patient.name}
                  </h4>
                  {patient.priority && patient.priority !== 'low' && (
                    <AlertCircle className={`w-4 h-4 ${getPriorityColor(patient.priority)}`} />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-4 text-xs text-text-secondary">
                    <span>Edad: {patient.age}</span>
                    {patient.phone && (
                      <div className="flex items-center space-x-1">
                        <Phone className="w-3 h-3" />
                        <span>{patient.phone}</span>
                      </div>
                    )}
                  </div>

                  {patient.last_visit && (
                    <div className="flex items-center space-x-1 text-xs text-text-secondary">
                      <Calendar className="w-3 h-3" />
                      <span>Última visita: {new Date(patient.last_visit).toLocaleDateString()}</span>
                    </div>
                  )}

                  {patient.condition && (
                    <p className="text-xs text-text-secondary">
                      <strong>Condición:</strong> {patient.condition}
                    </p>
                  )}

                  {patient.priority && patient.priority !== 'low' && (
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(patient.priority)} bg-opacity-10`}>
                      Prioridad {getPriorityText(patient.priority)}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex-shrink-0 flex flex-col space-y-1">
                <button className="text-primary hover:text-primary-hover text-xs font-medium">
                  Ver historial
                </button>
                {patient.has_pending_results && (
                  <div className="flex items-center space-x-1 text-xs text-warning">
                    <FileText className="w-3 h-3" />
                    <span>Resultados pendientes</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">
            Total de pacientes: {recentPatients.length}
          </span>
          <button className="text-primary hover:text-primary-hover font-medium">
            Gestionar pacientes
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientSummary;