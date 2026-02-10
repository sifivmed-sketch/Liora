'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Textarea from '@/components/Textarea';
import { fetchPatientProfile, PatientProfileData } from '@/features/plataforma-salud/perfil/services/profile.service';

/**
 * Interface for correction request form data
 */
interface CorrectionFormData {
  description: string;
}

/**
 * Interface for component props
 */
interface MedicalHistoryPageContentProps {
  sessionId: string;
  idPaciente: string;
}

/**
 * Main medical history page content component
 * Displays patient's complete medical history with tabs
 * @param sessionId - Session ID from login for API calls
 * @param idPaciente - Patient ID from the session
 * @returns JSX element with medical history page layout
 */
const MedicalHistoryPageContent = ({ sessionId, idPaciente }: MedicalHistoryPageContentProps) => {
  const [activeTab, setActiveTab] = useState<'resumen' | 'consultas' | 'medicamentos' | 'alergias' | 'vacunas' | 'laboratorios'>('resumen');
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<PatientProfileData | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CorrectionFormData>();

  /**
   * Handles tab switching
   * @param tab - Tab identifier to switch to
   */
  const handleSwitchTab = (tab: typeof activeTab) => {
    setActiveTab(tab);
  };

  /**
   * Handles opening correction modal
   */
  const handleOpenCorrectionModal = () => {
    setShowCorrectionModal(true);
  };

  /**
   * Handles closing correction modal
   */
  const handleCloseCorrectionModal = () => {
    setShowCorrectionModal(false);
    reset();
  };

  /**
   * Handles submitting correction request
   * @param _data - Form data for correction request
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onCorrectionSubmit = (_data: CorrectionFormData) => {
    handleCloseCorrectionModal();
    toast.success('Solicitud de corrección enviada');
  };

  /**
   * Handles print action
   */
  const handlePrint = () => {
    toast.info('Funcionalidad de impresión');
  };

  /**
   * Loads patient profile data
   */
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchPatientProfile(sessionId, idPaciente);
        setProfileData(data);
      } catch (error) {
        console.error('Error loading profile data:', error);
        toast.error('Error al cargar los datos del perfil');
      } finally {
        setIsLoading(false);
      }
    };

    if (sessionId && idPaciente) {
      loadProfileData();
    }
  }, [sessionId, idPaciente]);

  /**
   * Calculates age from birth date
   * @param birthDate - Birth date string in format MM/DD/YYYY, DD/MM/YYYY, or YYYY-MM-DD
   * @returns Age in years or null if date is invalid
   */
  const calculateAge = (birthDate: string | null | undefined): number | null => {
    if (!birthDate) return null;

    try {
      // Remove time if present (format: MM/DD/YYYY HH:mm:ss)
      const dateString = birthDate.split(' ')[0];
      
      // Use Date constructor which handles MM/DD/YYYY format correctly
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) return null;

      const today = new Date();
      let age = today.getFullYear() - date.getFullYear();
      const monthDiff = today.getMonth() - date.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
        age--;
      }

      return age;
    } catch {
      return null;
    }
  };

  /**
   * Formats full name from profile data
   * @returns Formatted full name or "-"
   */
  const getFullName = (): string => {
    if (!profileData?.identification) return '-';
    
    const { Nombre1, Nombre2, Apellido1, Apellido2 } = profileData.identification;
    const parts = [Nombre1, Nombre2, Apellido1, Apellido2].filter(Boolean);
    return parts.length > 0 ? parts.join(' ') : '-';
  };

  /**
   * Gets initials from full name
   * @param name - Full name
   * @returns Initials (max 2 characters)
   */
  const getInitials = (name: string): string => {
    if (name === '-') return '--';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0]?.substring(0, 2).toUpperCase() || '--';
  };

  /**
   * Formats birth date with age
   * @returns Formatted birth date string in DD/MM/YYYY format or "-"
   */
  const getBirthDateWithAge = (): string => {
    if (!profileData?.identification?.Fecha_Nacimiento) return '-';
    
    const birthDate = profileData.identification.Fecha_Nacimiento;
    const age = calculateAge(birthDate);
    
    // Format date to DD/MM/YYYY from API format (MM/DD/YYYY or MM/DD/YYYY HH:mm:ss)
    let formattedDate = '-';
    
    try {
      // Remove time if present
      const datePart = birthDate.split(' ')[0];
      
      if (datePart.includes('/')) {
        // Parse MM/DD/YYYY format from API
        const parts = datePart.split('/');
        if (parts.length === 3) {
          const month = parseInt(parts[0], 10);
          const day = parseInt(parts[1], 10);
          const year = parseInt(parts[2], 10);
          
          // Validate date
          if (!isNaN(month) && !isNaN(day) && !isNaN(year) && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
            // Format to DD/MM/YYYY
            formattedDate = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
          }
        }
      } else {
        // Try to parse as ISO date or other format
        const date = new Date(birthDate);
        if (!isNaN(date.getTime())) {
          formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
        }
      }
    } catch {
      return '-';
    }

    if (formattedDate === '-') return '-';

    if (age !== null) {
      return `${formattedDate} (${age} años)`;
    }
    return formattedDate;
  };

  /**
   * Gets blood type or "-"
   * @returns Blood type string or "-"
   */
  const getBloodType = (): string => {
    if (!profileData?.medical?.Tipo_Sangre) return '-';
    return profileData.medical.Tipo_Sangre || '-';
  };

  /**
   * Gets emergency contact or "-"
   * @returns Emergency contact string or "-"
   */
  const getEmergencyContact = (): string => {
    // Emergency contact endpoint doesn't exist yet, return "-"
    return '-';
  };

  const fullName = getFullName();
  const initials = getInitials(fullName);

  return (
    <div className="h-full bg-gray-100 overflow-y-auto">
      <div className="p-8">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mi Historial Médico</h1>
              <p className="text-gray-600 mt-1">Información médica completa</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleOpenCorrectionModal}
                className="min-h-[44px] px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Solicitar Corrección
              </button>
              <button
                onClick={handlePrint}
                className="min-h-[44px] px-4 py-2 text-white rounded-lg flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                style={{ backgroundColor: '#2F80ED' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1E6FD9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2F80ED'}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Imprimir
              </button>
            </div>
          </div>
        </div>

        {/* Patient Info Card */}
        {isLoading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 animate-pulse">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Avatar Skeleton */}
              <div className="w-20 h-20 rounded-full bg-gray-200 flex-shrink-0"></div>
              {/* Info Skeleton */}
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-5 bg-gray-100 rounded w-32"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-28"></div>
                  <div className="h-5 bg-gray-100 rounded w-36"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-6 bg-gray-100 rounded w-12"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-28"></div>
                  <div className="h-5 bg-gray-100 rounded w-32"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0" style={{ background: 'linear-gradient(135deg, #2F80ED, #56CCF2)' }}>
                {initials}
              </div>
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nombre Completo</p>
                  <p className="font-medium text-gray-900">{fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha de Nacimiento</p>
                  <p className="font-medium text-gray-900">{getBirthDateWithAge()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tipo de Sangre</p>
                  <p className="font-medium">
                    {getBloodType() !== '-' ? (
                      <span className="px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-700">{getBloodType()}</span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contacto Emergencia</p>
                  <p className="font-medium text-gray-900">{getEmergencyContact()}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              <button
                onClick={() => handleSwitchTab('resumen')}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-[3px] ${
                  activeTab === 'resumen'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:bg-gray-50'
                }`}
              >
                Resumen
              </button>
              <button
                onClick={() => handleSwitchTab('consultas')}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-[3px] ${
                  activeTab === 'consultas'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:bg-gray-50'
                }`}
              >
                Consultas
              </button>
              <button
                onClick={() => handleSwitchTab('medicamentos')}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-[3px] ${
                  activeTab === 'medicamentos'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:bg-gray-50'
                }`}
              >
                Medicamentos
              </button>
              <button
                onClick={() => handleSwitchTab('alergias')}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-[3px] ${
                  activeTab === 'alergias'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:bg-gray-50'
                }`}
              >
                Alergias
              </button>
              <button
                onClick={() => handleSwitchTab('vacunas')}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-[3px] ${
                  activeTab === 'vacunas'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:bg-gray-50'
                }`}
              >
                Vacunas
              </button>
              <button
                onClick={() => handleSwitchTab('laboratorios')}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-[3px] ${
                  activeTab === 'laboratorios'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:bg-gray-50'
                }`}
              >
                Laboratorios
              </button>
            </nav>
          </div>

          {/* Tab: Resumen */}
          {activeTab === 'resumen' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Condiciones */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Condiciones Crónicas</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                      <span>Hipertensión Arterial</span>
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">Controlada</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                      <span>Diabetes Tipo 2</span>
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">Controlada</span>
                    </div>
                  </div>
                </div>

                {/* Alergias */}
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Alergias
                  </h3>
                  <div className="p-3 bg-white rounded border border-red-200">
                    <p className="font-medium text-red-900">Penicilina</p>
                    <p className="text-sm text-red-700">Severidad: Anafilaxia severa</p>
                  </div>
                </div>

                {/* Medicamentos Activos */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Medicamentos Activos</h3>
                  <div className="space-y-2">
                    <div className="p-2 bg-white rounded border border-gray-200">
                      <p className="font-medium">Omeprazol 20mg</p>
                      <p className="text-sm text-gray-500">1 vez al día</p>
                    </div>
                    <div className="p-2 bg-white rounded border border-gray-200">
                      <p className="font-medium">Losartán 50mg</p>
                      <p className="text-sm text-gray-500">1 vez al día</p>
                    </div>
                    <div className="p-2 bg-white rounded border border-gray-200">
                      <p className="font-medium">Metformina 850mg</p>
                      <p className="text-sm text-gray-500">2 veces al día</p>
                    </div>
                  </div>
                </div>

                {/* Antecedentes Familiares */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Antecedentes Familiares</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                      Padre: Diabetes, Hipertensión
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                      Abuelo paterno: Enfermedad coronaria
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Consultas */}
          {activeTab === 'consultas' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Historial de Consultas</h3>
                <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 min-h-[44px]">
                  <option>2025</option>
                  <option>2024</option>
                  <option>Todas</option>
                </select>
              </div>

              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-900">Consulta General</span>
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">Completada</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Dr. Rodríguez • 02/02/2025 • 9:35 AM</p>
                      <p className="text-sm text-gray-600 mt-2"><strong>Motivo:</strong> Cefalea persistente</p>
                      <p className="text-sm text-gray-600"><strong>Diagnóstico:</strong> Cefalea tensional. Se indica seguimiento.</p>
                    </div>
                    <button
                      onClick={() => toast.info('Demo: Expandir consulta')}
                      className="p-2 rounded-lg text-gray-400 hover:bg-gray-100"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-900">Control Diabetes</span>
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">Completada</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Dr. Rodríguez • 28/01/2025 • 10:00 AM</p>
                      <p className="text-sm text-gray-600 mt-2"><strong>Motivo:</strong> Control de rutina</p>
                      <p className="text-sm text-gray-600"><strong>Diagnóstico:</strong> Niveles de glucosa estables. Continuar tratamiento.</p>
                    </div>
                    <button
                      onClick={() => toast.info('Demo: Expandir consulta')}
                      className="p-2 rounded-lg text-gray-400 hover:bg-gray-100"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-900">Consulta Inicial</span>
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">Completada</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Dr. Rodríguez • 15/01/2025 • 11:30 AM</p>
                      <p className="text-sm text-gray-600 mt-2"><strong>Motivo:</strong> Primera consulta</p>
                      <p className="text-sm text-gray-600"><strong>Diagnóstico:</strong> Evaluación general completa. Historia clínica creada.</p>
                    </div>
                    <button
                      onClick={() => toast.info('Demo: Expandir consulta')}
                      className="p-2 rounded-lg text-gray-400 hover:bg-gray-100"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Medicamentos */}
          {activeTab === 'medicamentos' && (
            <div className="p-6">
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Medicamentos Activos</h3>
                <div className="space-y-3">
                  <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">Omeprazol 20mg</p>
                        <p className="text-sm text-gray-600">1 cápsula - 1 vez al día - En ayunas</p>
                      </div>
                      <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-700">Activo</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-blue-200 text-sm text-gray-500">
                      <span>Prescrito por: Dr. Rodríguez</span> • <span>Desde: 15/01/2025</span> • <span>Crónico</span>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">Losartán 50mg</p>
                        <p className="text-sm text-gray-600">1 tableta - 1 vez al día - Por la mañana</p>
                      </div>
                      <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-700">Activo</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-blue-200 text-sm text-gray-500">
                      <span>Prescrito por: Dr. Rodríguez</span> • <span>Desde: 15/01/2025</span> • <span>Crónico</span>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">Metformina 850mg</p>
                        <p className="text-sm text-gray-600">1 tableta - 2 veces al día - Con las comidas</p>
                      </div>
                      <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-700">Activo</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-blue-200 text-sm text-gray-500">
                      <span>Prescrito por: Dr. Rodríguez</span> • <span>Desde: 15/01/2025</span> • <span>Crónico</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Medicamentos Históricos</h3>
                <div className="space-y-3">
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-500">Ibuprofeno 400mg</p>
                        <p className="text-sm text-gray-400">1 tableta - Cada 8 horas - Por 5 días</p>
                      </div>
                      <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-200 text-gray-600">Finalizado</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200 text-sm text-gray-400">
                      <span>Prescrito por: Dr. Rodríguez</span> • <span>Dic 2024</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Alergias */}
          {activeTab === 'alergias' && (
            <div className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-red-900">Penicilina</h3>
                    <p className="text-red-700 mt-1">Severidad: <strong>Anafilaxia severa</strong></p>
                    <p className="text-sm text-red-600 mt-2">Registrada el 15/01/2025 por Dr. Rodríguez</p>
                    <p className="text-sm text-red-600 mt-3 p-3 bg-white rounded border border-red-200">
                      <strong>Nota:</strong> Paciente reporta reacción anafiláctica grave tras administración de amoxicilina en 2015. Requirió hospitalización.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-amber-700">Si necesita agregar o corregir información sobre alergias, use el botón &quot;Solicitar Corrección&quot; arriba.</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Vacunas */}
          {activeTab === 'vacunas' && (
            <div className="p-6">
              <div className="space-y-3">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">COVID-19 (Pfizer)</p>
                      <p className="text-sm text-gray-500">Refuerzo bivalente</p>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Aplicada</span>
                      <p className="text-sm text-gray-500 mt-1">15/10/2023</p>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">Influenza 2024</p>
                      <p className="text-sm text-gray-500">Vacuna estacional</p>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Aplicada</span>
                      <p className="text-sm text-gray-500 mt-1">20/11/2024</p>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">Tétanos</p>
                      <p className="text-sm text-gray-500">Refuerzo cada 10 años</p>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Aplicada</span>
                      <p className="text-sm text-gray-500 mt-1">05/03/2020</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Laboratorios */}
          {activeTab === 'laboratorios' && (
            <div className="p-6">
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">Química Sanguínea Completa</p>
                      <p className="text-sm text-gray-500">28/01/2025 • Laboratorio Central</p>
                    </div>
                    <button
                      onClick={() => toast.info('Demo: Descargando PDF...')}
                      className="min-h-[44px] px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-white flex items-center gap-2 transition-all duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      PDF
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Glucosa</p>
                        <p className="font-medium">105 mg/dL</p>
                      </div>
                      <div>
                        <p className="text-gray-500">HbA1c</p>
                        <p className="font-medium">6.8%</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Colesterol Total</p>
                        <p className="font-medium">195 mg/dL</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Triglicéridos</p>
                        <p className="font-medium">145 mg/dL</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">Hemograma Completo</p>
                      <p className="text-sm text-gray-500">15/01/2025 • Laboratorio Central</p>
                    </div>
                    <button
                      onClick={() => toast.info('Demo: Descargando PDF...')}
                      className="min-h-[44px] px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-white flex items-center gap-2 transition-all duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      PDF
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Hemoglobina</p>
                        <p className="font-medium">13.5 g/dL</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Hematocrito</p>
                        <p className="font-medium">40%</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Leucocitos</p>
                        <p className="font-medium">7,500/mm³</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Plaquetas</p>
                        <p className="font-medium">250,000/mm³</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Correction Modal */}
      {showCorrectionModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" style={{ opacity: showCorrectionModal ? 1 : 0, visibility: showCorrectionModal ? 'visible' : 'hidden' }}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Solicitar Corrección</h2>
              <button
                onClick={handleCloseCorrectionModal}
                className="p-2 rounded-lg hover:bg-gray-100"
                aria-label="Cerrar modal"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">Describa la información que necesita ser corregida. Un administrador revisará su solicitud.</p>
            <form onSubmit={handleSubmit(onCorrectionSubmit)} className="space-y-4">
              <Textarea
                label="Descripción"
                rows={4}
                placeholder="Describa qué información necesita corregirse..."
                required
                registration={register('description', { required: 'La descripción es requerida' })}
                error={errors.description?.message}
              />
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseCorrectionModal}
                  className="min-h-[44px] px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-4 py-2 text-white rounded-lg transition-all duration-200"
                  style={{ backgroundColor: '#2F80ED' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1E6FD9'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2F80ED'}
                >
                  Enviar Solicitud
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalHistoryPageContent;
