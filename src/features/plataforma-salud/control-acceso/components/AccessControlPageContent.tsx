'use client';

import { useState } from 'react';
import { toast } from 'sonner';

/**
 * Interface for pending request data
 */
interface PendingRequest {
  id: string;
  doctorName: string;
  specialty: string;
  requestDate: string;
  reason: string;
}

/**
 * Interface for doctor with access data
 */
interface DoctorWithAccess {
  id: string;
  name: string;
  specialty: string;
  lastAccess: string;
  isPrimary?: boolean;
  hasAccess: boolean;
  initials: string;
}

/**
 * Interface for doctor without access data
 */
interface DoctorWithoutAccess {
  id: string;
  name: string;
  specialty: string;
  initials: string;
}

/**
 * Interface for access history entry
 */
interface AccessHistoryEntry {
  date: string;
  action: string;
  doctorName: string;
  type: 'granted' | 'revoked' | 'assigned';
}

/**
 * Main access control page content component
 * Displays patient's access control settings for medical records
 * @returns JSX element with access control page layout
 */
const AccessControlPageContent = () => {
  const [globalAccess, setGlobalAccess] = useState(false);

  // Mock data for pending requests
  const [pendingRequests] = useState<PendingRequest[]>([
    {
      id: '1',
      doctorName: 'Dra. Martínez',
      specialty: 'Cardiología',
      requestDate: '01/02/2025',
      reason: 'Evaluación cardiovascular referida por Dr. Rodríguez.',
    },
  ]);

  // State for doctors with access
  const [doctorsWithAccess, setDoctorsWithAccess] = useState<DoctorWithAccess[]>([
    {
      id: '1',
      name: 'Dr. Rodríguez',
      specialty: 'Medicina General',
      lastAccess: 'Hoy, 10:45 AM',
      isPrimary: true,
      hasAccess: true,
      initials: 'DR',
    },
    {
      id: '2',
      name: 'Dr. López',
      specialty: 'Endocrinología',
      lastAccess: '28/01/2025',
      hasAccess: true,
      initials: 'DL',
    },
  ]);

  // State for doctors without access (tracking their access state)
  const [doctorsWithoutAccess, setDoctorsWithoutAccess] = useState<Array<DoctorWithoutAccess & { hasAccess: boolean }>>([
    {
      id: '3',
      name: 'Dra. García',
      specialty: 'Pediatría',
      initials: 'DG',
      hasAccess: false,
    },
    {
      id: '4',
      name: 'Dr. Herrera',
      specialty: 'Medicina General',
      initials: 'DH',
      hasAccess: false,
    },
  ]);

  // Mock data for access history
  const accessHistory: AccessHistoryEntry[] = [
    {
      date: '15/01/2025',
      action: 'Acceso otorgado a',
      doctorName: 'Dr. López',
      type: 'granted',
    },
    {
      date: '15/01/2025',
      action: 'asignado como doctor principal',
      doctorName: 'Dr. Rodríguez',
      type: 'assigned',
    },
  ];

  /**
   * Handles toggling global access
   */
  const handleToggleGlobalAccess = () => {
    setGlobalAccess(!globalAccess);
    toast.success(`Acceso global ${!globalAccess ? 'activado' : 'desactivado'}`);
  };

  /**
   * Handles toggling doctor access
   * @param doctorId - ID of the doctor
   * @param doctorName - Name of the doctor
   */
  const handleToggleDoctorAccess = (doctorId: string, doctorName: string) => {
    // Check if doctor is in doctorsWithAccess
    const doctorWithAccess = doctorsWithAccess.find(d => d.id === doctorId);
    
    if (doctorWithAccess && !doctorWithAccess.isPrimary) {
      // Toggle access for doctor in doctorsWithAccess
      setDoctorsWithAccess(prev => 
        prev.map(doctor => 
          doctor.id === doctorId 
            ? { ...doctor, hasAccess: !doctor.hasAccess }
            : doctor
        )
      );
      const newAccess = !doctorWithAccess.hasAccess;
      toast.success(`Acceso ${newAccess ? 'otorgado' : 'revocado'} a ${doctorName}`);
    } else {
      // Toggle access for doctor in doctorsWithoutAccess
      setDoctorsWithoutAccess(prev => 
        prev.map(doctor => 
          doctor.id === doctorId 
            ? { ...doctor, hasAccess: !doctor.hasAccess }
            : doctor
        )
      );
      const doctor = doctorsWithoutAccess.find(d => d.id === doctorId);
      const newAccess = !doctor?.hasAccess;
      toast.success(`Acceso ${newAccess ? 'otorgado' : 'revocado'} a ${doctorName}`);
    }
  };

  /**
   * Handles approving access request
   * @param requestId - ID of the request
   * @param doctorName - Name of the doctor
   */
  const handleApproveAccess = (requestId: string, doctorName: string) => {
    toast.success(`Acceso aprobado para ${doctorName}`);
  };

  /**
   * Handles denying access request
   * @param requestId - ID of the request
   * @param doctorName - Name of the doctor
   */
  const handleDenyAccess = (requestId: string, doctorName: string) => {
    toast.success(`Acceso denegado para ${doctorName}`);
  };

  /**
   * Gets color for history entry dot
   * @param type - Type of history entry
   * @returns Color class name
   */
  const getHistoryDotColor = (type: AccessHistoryEntry['type']) => {
    switch (type) {
      case 'granted':
        return 'bg-green-500';
      case 'revoked':
        return 'bg-red-500';
      case 'assigned':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  /**
   * Gets gradient colors for doctor avatar
   * @param index - Index of the doctor
   * @returns Gradient style string
   */
  const getDoctorAvatarGradient = (index: number): string => {
    const gradients = [
      'linear-gradient(135deg, #2CA66F, #6FCF97)', // Green
      'linear-gradient(135deg, #9333EA, #EC4899)', // Purple
      'linear-gradient(135deg, #F59E0B, #FBBF24)', // Amber
      'linear-gradient(135deg, #EF4444, #F87171)', // Red
      'linear-gradient(135deg, #2F80ED, #56CCF2)', // Blue
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="h-full bg-gray-100 overflow-y-auto">
      <div className="p-8">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Control de Acceso</h1>
              <p className="text-gray-600 mt-1">Gestione quién puede ver su historia clínica</p>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-blue-900">Su Privacidad es Importante</h3>
              <p className="text-sm text-blue-700 mt-1">Usted tiene el control sobre quién puede acceder a su información médica. Los doctores necesitan su autorización para ver su historia clínica, excepto en emergencias médicas.</p>
            </div>
          </div>
        </div>

        {/* Global Access */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Acceso Global</h3>
              <p className="text-sm text-gray-500 mt-1">Permitir que todos los doctores de la clínica vean su historia</p>
            </div>
            <button
              onClick={handleToggleGlobalAccess}
              className={`relative w-14 h-8 rounded-full transition-all duration-200 cursor-pointer ${
                globalAccess ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ${
                  globalAccess ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>
          <div className={`mt-4 p-3 rounded-lg border ${
            globalAccess 
              ? 'bg-red-50 border-red-200' 
              : 'bg-amber-50 border-amber-200'
          }`}>
            <p className={`text-sm ${
              globalAccess 
                ? 'text-red-700' 
                : 'text-amber-700'
            }`}>
              <strong>Estado actual:</strong>{' '}
              {globalAccess 
                ? 'Acceso global activado. Todos los doctores de la clínica pueden ver su historia.'
                : 'Acceso selectivo activado. Solo los doctores que usted autorice pueden ver su historia.'
              }
            </p>
          </div>
        </div>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-200 bg-amber-50">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-semibold text-gray-900">Solicitudes Pendientes</h3>
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-500 text-white">
                  {pendingRequests.length}
                </span>
              </div>
            </div>
            <div className="p-6">
              {pendingRequests.map((request) => (
                <div key={request.id} className="flex items-start gap-4 p-4 border border-amber-200 rounded-lg bg-amber-50/50">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium" style={{ background: 'linear-gradient(135deg, #2F80ED, #56CCF2)' }}>
                    {request.doctorName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">{request.doctorName}</p>
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-700">Pendiente</span>
                    </div>
                    <p className="text-sm text-gray-600">{request.specialty}</p>
                    <p className="text-sm text-gray-500 mt-2">Solicitado: {request.requestDate}</p>
                    <p className="text-sm text-gray-600 mt-2 p-2 bg-white rounded border border-gray-200">
                      <strong>Motivo:</strong> {request.reason}
                    </p>
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => handleApproveAccess(request.id, request.doctorName)}
                        className="min-h-[44px] px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 flex items-center gap-2 transition-all duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Aprobar
                      </button>
                      <button
                        onClick={() => handleDenyAccess(request.id, request.doctorName)}
                        className="min-h-[44px] px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-all duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Denegar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Doctors with Access */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Doctores con Acceso Autorizado</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {doctorsWithAccess.map((doctor, index) => (
              <div key={doctor.id} className={`p-4 ${doctor.isPrimary ? 'bg-blue-50' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium" style={{ background: doctor.isPrimary ? 'linear-gradient(135deg, #2CA66F, #6FCF97)' : getDoctorAvatarGradient(index) }}>
                      {doctor.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">{doctor.name}</p>
                        {doctor.isPrimary && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">Doctor Principal</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{doctor.specialty}</p>
                      <p className="text-xs text-gray-500 mt-1">Último acceso: {doctor.lastAccess}</p>
                    </div>
                  </div>
                  {doctor.isPrimary ? (
                    <span className="text-sm text-blue-600 font-medium">Siempre autorizado</span>
                  ) : (
                    <button
                      onClick={() => handleToggleDoctorAccess(doctor.id, doctor.name)}
                      className={`relative w-14 h-8 rounded-full transition-all duration-200 cursor-pointer ${
                        doctor.hasAccess ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ${
                          doctor.hasAccess ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      ></div>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Doctors without Access */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Otros Doctores de la Clínica</h3>
            <p className="text-sm text-gray-500">Puede otorgar acceso a estos doctores si lo necesita</p>
          </div>
          <div className="divide-y divide-gray-200">
            {doctorsWithoutAccess.map((doctor, index) => (
              <div key={doctor.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium" style={{ background: getDoctorAvatarGradient(index + doctorsWithAccess.length) }}>
                      {doctor.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{doctor.name}</p>
                      <p className="text-sm text-gray-600">{doctor.specialty}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleDoctorAccess(doctor.id, doctor.name)}
                    className={`relative w-14 h-8 rounded-full transition-all duration-200 cursor-pointer ${
                      doctor.hasAccess ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ${
                        doctor.hasAccess ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    ></div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Access History */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Historial de Cambios de Acceso</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {accessHistory.map((entry, index) => (
                <div key={index} className="flex items-center gap-4 text-sm">
                  <div className={`w-2 h-2 rounded-full ${getHistoryDotColor(entry.type)}`}></div>
                  <span className="text-gray-500">{entry.date}</span>
                  <span className="text-gray-900">
                    {entry.type === 'assigned' ? (
                      <>
                        <strong>{entry.doctorName}</strong> {entry.action}
                      </>
                    ) : (
                      <>
                        {entry.action} <strong>{entry.doctorName}</strong>
                      </>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessControlPageContent;
