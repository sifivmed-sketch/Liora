'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import Input from '@/components/Input';
import CustomSelect, { SelectOption } from '@/components/Select';
import Textarea from '@/components/Textarea';

/**
 * Interface for appointment data
 */
interface Appointment {
  id: string;
  type: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  isFirstTime?: boolean;
}

/**
 * Interface for appointment history data
 */
interface AppointmentHistory {
  date: string;
  doctor: string;
  specialty: string;
  reason: string;
  status: 'completed' | 'cancelled';
}

/**
 * Interface for request appointment form data
 */
interface RequestAppointmentFormData {
  specialty: string;
  doctor: string;
  preferredDate: string;
  reason: string;
}

/**
 * Interface for reschedule appointment form data
 */
interface RescheduleAppointmentFormData {
  newDate: string;
  preferredTime: string;
}

/**
 * Main appointments page content component
 * Displays upcoming appointments and appointment history
 * @returns JSX element with appointments page layout
 */
const AppointmentsPageContent = () => {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<{ type: string; date: string } | null>(null);

  // Form for requesting appointment
  const {
    register: registerRequest,
    handleSubmit: handleSubmitRequest,
    control: controlRequest,
    reset: resetRequest,
    formState: { errors: errorsRequest },
  } = useForm<RequestAppointmentFormData>();

  // Form for rescheduling appointment
  const {
    register: registerReschedule,
    handleSubmit: handleSubmitReschedule,
    control: controlReschedule,
    reset: resetReschedule,
    formState: { errors: errorsReschedule },
  } = useForm<RescheduleAppointmentFormData>();

  // Mock data for upcoming appointments
  const upcomingAppointments: Appointment[] = [
    {
      id: '1',
      type: 'Control General',
      doctor: 'Dr. Rodríguez',
      specialty: 'Medicina General',
      date: '5 Feb 2025',
      time: '10:30 AM',
      location: 'Consultorio 3, Piso 2',
      status: 'confirmed',
    },
    {
      id: '2',
      type: 'Control Endocrinología',
      doctor: 'Dr. López',
      specialty: 'Endocrinología',
      date: '15 Feb 2025',
      time: '3:00 PM',
      location: 'Consultorio 5, Piso 3',
      status: 'pending',
    },
  ];

  // Mock data for appointment history
  const appointmentHistory: AppointmentHistory[] = [
    {
      date: '02/02/2025',
      doctor: 'Dr. Rodríguez',
      specialty: 'Medicina General',
      reason: 'Consulta General',
      status: 'completed',
    },
    {
      date: '28/01/2025',
      doctor: 'Dr. Rodríguez',
      specialty: 'Medicina General',
      reason: 'Control Diabetes',
      status: 'completed',
    },
    {
      date: '15/01/2025',
      doctor: 'Dr. Rodríguez',
      specialty: 'Medicina General',
      reason: 'Consulta Inicial',
      status: 'completed',
    },
    {
      date: '10/01/2025',
      doctor: 'Dra. García',
      specialty: 'Pediatría',
      reason: 'Evaluación',
      status: 'cancelled',
    },
  ];

  // Options for specialty select
  const specialtyOptions: SelectOption[] = [
    { value: '', label: 'Seleccione especialidad...' },
    { value: 'general', label: 'Medicina General' },
    { value: 'cardio', label: 'Cardiología' },
    { value: 'endo', label: 'Endocrinología' },
    { value: 'pedia', label: 'Pediatría' },
  ];

  // Options for doctor select
  const doctorOptions: SelectOption[] = [
    { value: '', label: 'Cualquier doctor disponible' },
    { value: '1', label: 'Dr. Rodríguez' },
    { value: '2', label: 'Dr. López' },
  ];

  // Options for time preference select
  const timePreferenceOptions: SelectOption[] = [
    { value: '', label: 'Seleccione horario...' },
    { value: 'am', label: 'Mañana (8:00 - 12:00)' },
    { value: 'pm', label: 'Tarde (2:00 - 6:00)' },
  ];

  /**
   * Handles opening the request appointment modal
   */
  const handleOpenRequestModal = () => {
    setShowRequestModal(true);
  };

  /**
   * Handles closing the request appointment modal
   */
  const handleCloseRequestModal = () => {
    setShowRequestModal(false);
    resetRequest();
  };

  /**
   * Handles opening the cancel appointment modal
   * @param appointment - The appointment to cancel
   */
  const handleOpenCancelModal = (appointment: Appointment) => {
    setSelectedAppointment({ type: appointment.type, date: appointment.date });
    setShowCancelModal(true);
  };

  /**
   * Handles closing the cancel appointment modal
   */
  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setSelectedAppointment(null);
  };

  /**
   * Handles confirming appointment cancellation
   */
  const handleConfirmCancel = () => {
    handleCloseCancelModal();
    toast.success('Cita cancelada');
  };

  /**
   * Handles opening the reschedule appointment modal
   */
  const handleOpenRescheduleModal = () => {
    setShowRescheduleModal(true);
  };

  /**
   * Handles closing the reschedule appointment modal
   */
  const handleCloseRescheduleModal = () => {
    setShowRescheduleModal(false);
    resetReschedule();
  };

  /**
   * Handles submitting reschedule request
   * @param _data - Form data for rescheduling
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onRescheduleSubmit = (_data: RescheduleAppointmentFormData) => {
    handleCloseRescheduleModal();
    toast.success('Solicitud de reprogramación enviada');
  };

  /**
   * Handles submitting appointment request
   * @param _data - Form data for requesting appointment
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onRequestSubmit = (_data: RequestAppointmentFormData) => {
    handleCloseRequestModal();
    toast.success('Solicitud de cita enviada');
  };

  /**
   * Gets status badge styling
   * @param status - Appointment status
   * @returns String with className for status badge
   */
  const getStatusBadgeClass = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  /**
   * Gets status label in Spanish
   * @param status - Appointment status
   * @returns Status label in Spanish
   */
  const getStatusLabel = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'pending':
        return 'Pendiente confirmación';
      case 'completed':
        return 'Completada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return 'Desconocido';
    }
  };

  return (
    <div className="h-full bg-gray-100 overflow-y-auto">
      <div className="p-8">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mis Citas</h1>
              <p className="text-gray-600 mt-1">Gestione sus citas médicas programadas</p>
            </div>
            <button
              onClick={handleOpenRequestModal}
              className="min-h-[44px] px-4 py-2 text-white font-medium rounded-lg flex items-center gap-2 w-fit transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              style={{ backgroundColor: '#2F80ED' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1E6FD9'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2F80ED'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Solicitar Cita
            </button>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Próximas Citas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md"
              >
                <div className="p-4 border-l-4" style={{ borderLeftColor: appointment.status === 'confirmed' ? '#2F80ED' : '#F59E0B' }}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(appointment.status)}`}>
                          {getStatusLabel(appointment.status)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900">{appointment.type}</h3>
                      <p className="text-sm text-gray-600 mt-1">{appointment.doctor} • {appointment.specialty}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <div className="flex items-center gap-1 text-gray-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{appointment.date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{appointment.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{appointment.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={handleOpenRescheduleModal}
                      className="flex-1 min-h-[44px] px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                    >
                      Reprogramar
                    </button>
                    <button
                      onClick={() => handleOpenCancelModal(appointment)}
                      className="flex-1 min-h-[44px] px-3 py-2 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Appointment History */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Historial de Citas</h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Especialidad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motivo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {appointmentHistory.map((appointment, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{appointment.doctor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{appointment.specialty}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{appointment.reason}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        appointment.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {appointment.status === 'completed' ? 'Completada' : 'Cancelada'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Request Appointment Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" style={{ opacity: showRequestModal ? 1 : 0, visibility: showRequestModal ? 'visible' : 'hidden' }}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Solicitar Nueva Cita</h2>
              <button
                onClick={handleCloseRequestModal}
                className="p-2 rounded-lg hover:bg-gray-100"
                aria-label="Cerrar modal"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmitRequest(onRequestSubmit)} className="space-y-4">
              <Controller
                name="specialty"
                control={controlRequest}
                rules={{ required: 'La especialidad es requerida' }}
                render={({ field }) => (
                  <CustomSelect
                    label="Especialidad"
                    required
                    options={specialtyOptions}
                    value={field.value || ''}
                    onChange={field.onChange}
                    error={errorsRequest.specialty?.message}
                    placeholder="Seleccione especialidad..."
                  />
                )}
              />

              <Controller
                name="doctor"
                control={controlRequest}
                render={({ field }) => (
                  <CustomSelect
                    label="Doctor (opcional)"
                    options={doctorOptions}
                    value={field.value || ''}
                    onChange={field.onChange}
                    placeholder="Cualquier doctor disponible"
                  />
                )}
              />

              <Input
                label="Fecha preferida"
                type="date"
                required
                registration={registerRequest('preferredDate', { required: 'La fecha es requerida' })}
                error={errorsRequest.preferredDate?.message}
              />

              <Textarea
                label="Motivo de consulta"
                required
                rows={3}
                placeholder="Describa brevemente el motivo..."
                registration={registerRequest('reason', { required: 'El motivo es requerido' })}
                error={errorsRequest.reason?.message}
              />

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseRequestModal}
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

      {/* Cancel Confirmation Modal */}
      {showCancelModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" style={{ opacity: showCancelModal ? 1 : 0, visibility: showCancelModal ? 'visible' : 'hidden' }}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Cancelar Cita</h3>
                <p className="text-sm text-gray-500">Esta acción no se puede deshacer</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              ¿Está seguro que desea cancelar su cita de <span className="font-medium text-gray-900">{selectedAppointment.type}</span> del <span className="font-medium text-gray-900">{selectedAppointment.date}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCloseCancelModal}
                className="min-h-[44px] px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                No, mantener
              </button>
              <button
                onClick={handleConfirmCancel}
                className="min-h-[44px] px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
              >
                Sí, cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" style={{ opacity: showRescheduleModal ? 1 : 0, visibility: showRescheduleModal ? 'visible' : 'hidden' }}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Reprogramar Cita</h2>
              <button
                onClick={handleCloseRescheduleModal}
                className="p-2 rounded-lg hover:bg-gray-100"
                aria-label="Cerrar modal"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmitReschedule(onRescheduleSubmit)} className="space-y-4">
              <Input
                label="Nueva fecha"
                type="date"
                required
                registration={registerReschedule('newDate', { required: 'La fecha es requerida' })}
                error={errorsReschedule.newDate?.message}
              />

              <Controller
                name="preferredTime"
                control={controlReschedule}
                rules={{ required: 'La hora es requerida' }}
                render={({ field }) => (
                  <CustomSelect
                    label="Hora preferida"
                    required
                    options={timePreferenceOptions}
                    value={field.value || ''}
                    onChange={field.onChange}
                    error={errorsReschedule.preferredTime?.message}
                    placeholder="Seleccione horario..."
                  />
                )}
              />

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseRescheduleModal}
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
                  Solicitar cambio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsPageContent;
