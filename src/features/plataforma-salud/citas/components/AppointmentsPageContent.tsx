'use client';

import { ReactNode, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import CustomSelect, { SelectOption } from '@/components/Select';
import Textarea from '@/components/Textarea';

/**
 * Interface for appointment data
 */
interface Appointment {
  id: string;
  centerId: string;
  doctorId: string;
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
  centerId: string;
  specialtyCode: string;
  doctorId: string;
  reason: string;
}

/**
 * Main appointments page content component
 * Displays upcoming appointments and appointment history
 * @returns JSX element with appointments page layout
 */
const AppointmentsPageContent = () => {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<{ type: string; date: string } | null>(null);
  const [selectedCenterId, setSelectedCenterId] = useState<string>('');
  const [selectedSpecialtyCode, setSelectedSpecialtyCode] = useState<string>('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [originalAppointmentInfo, setOriginalAppointmentInfo] = useState<{ date: string; time: string } | null>(null);
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());

  // Form for requesting appointment
  const {
    register: registerRequest,
    handleSubmit: handleSubmitRequest,
    control: controlRequest,
    reset: resetRequest,
    formState: { errors: errorsRequest },
  } = useForm<RequestAppointmentFormData>();

  // Mock data for upcoming appointments
  const upcomingAppointments: Appointment[] = [
    {
      id: '1',
      centerId: 'centro1',
      doctorId: 'dr1',
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
      centerId: 'centro2',
      doctorId: 'dr4',
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

  /**
   * Interface for medical center doctor working hours
   */
  interface WorkingHours {
    start: string;
    end: string;
  }

  /**
   * Interface for doctor in medical center
   */
  interface CenterDoctor {
    id: string;
    name: string;
    specialty: string;
    schedule: string[];
    workingHours: WorkingHours;
    workingDays: number[];
  }

  /**
   * Interface for medical center data
   */
  interface MedicalCenter {
    name: string;
    specialties: string[];
    doctors: Record<string, CenterDoctor[]>;
  }

  /**
   * Interface for booked appointments structure
   * Key is date in YYYY-MM-DD format and value is a record with doctor id and array of times
   */
  interface BookedAppointments {
    [date: string]: {
      [doctorId: string]: string[];
    };
  }

  // Options for doctor select
  const specialtyNameByCode: Record<string, string> = {
    general: 'Medicina General',
    cardio: 'Cardiología',
    endo: 'Endocrinología',
    pedia: 'Pediatría',
  };

  /**
   * Medical centers configuration with specialties and doctors
   */
  const medicalCenters: Record<string, MedicalCenter> = {
    centro1: {
      name: 'Centro Médico Santiago - Centro General',
      specialties: ['general', 'cardio'],
      doctors: {
        general: [
          {
            id: 'dr1',
            name: 'Dr. Rodríguez',
            specialty: 'Medicina General',
            schedule: ['Lun-Vie: 9:00-17:00'],
            workingHours: { start: '09:00', end: '17:00' },
            workingDays: [1, 2, 3, 4, 5],
          },
          {
            id: 'dr2',
            name: 'Dra. Martínez',
            specialty: 'Medicina General',
            schedule: ['Lun-Mié-Vie: 10:00-14:00'],
            workingHours: { start: '10:00', end: '14:00' },
            workingDays: [1, 3, 5],
          },
        ],
        cardio: [
          {
            id: 'dr3',
            name: 'Dr. López',
            specialty: 'Cardiología',
            schedule: ['Mar-Jue: 14:00-18:00'],
            workingHours: { start: '14:00', end: '18:00' },
            workingDays: [2, 4],
          },
        ],
      },
    },
    centro2: {
      name: 'Clínica Providencia - Especialidades',
      specialties: ['endo', 'cardio'],
      doctors: {
        endo: [
          {
            id: 'dr4',
            name: 'Dra. González',
            specialty: 'Endocrinología',
            schedule: ['Lun-Jue: 8:00-12:00'],
            workingHours: { start: '08:00', end: '12:00' },
            workingDays: [1, 2, 3, 4],
          },
        ],
        cardio: [
          {
            id: 'dr5',
            name: 'Dr. Silva',
            specialty: 'Cardiología',
            schedule: ['Mié-Vie: 15:00-19:00'],
            workingHours: { start: '15:00', end: '19:00' },
            workingDays: [3, 4, 5],
          },
        ],
      },
    },
    centro3: {
      name: 'Hospital Regional - Control Diabetes',
      specialties: ['endo', 'general'],
      doctors: {
        endo: [
          {
            id: 'dr6',
            name: 'Dr. Ramírez',
            specialty: 'Endocrinología',
            schedule: ['Lun-Vie: 9:00-13:00'],
            workingHours: { start: '09:00', end: '13:00' },
            workingDays: [1, 2, 3, 4, 5],
          },
        ],
        general: [
          {
            id: 'dr7',
            name: 'Dra. Torres',
            specialty: 'Medicina General',
            schedule: ['Mar-Jue-Vie: 10:00-16:00'],
            workingHours: { start: '10:00', end: '16:00' },
            workingDays: [2, 4, 5],
          },
        ],
      },
    },
  };

  /**
   * Simulated booked appointments information
   * Key is date (YYYY-MM-DD) and doctor id with array of occupied time slots
   */
  const bookedAppointments: BookedAppointments = {
    '2025-02-05': {
      dr1: ['09:00', '10:00', '14:00', '15:30'],
      dr3: ['14:00', '16:00'],
    },
    '2025-02-06': {
      dr1: ['09:00', '09:30', '11:00'],
      dr2: ['10:00', '12:00'],
    },
    '2025-02-07': {
      dr4: ['08:00', '09:00', '10:30'],
      dr5: ['15:00', '17:00'],
    },
    '2025-02-10': {
      dr1: ['14:00', '15:00', '16:00'],
      dr6: ['09:00', '11:00'],
    },
    '2025-02-15': {
      dr1: ['08:00', '10:00'],
      dr3: ['14:00', '15:00', '16:00', '17:00'],
    },
  };

  /**
   * Gets all specialties options for a given center id
   * @param centerId - Center identifier
   * @returns Select options for specialties
   */
  const getSpecialtyOptionsForCenter = (centerId: string): SelectOption[] => {
    if (!centerId) {
      return [{ value: '', label: 'Todas las especialidades' }];
    }

    const center = medicalCenters[centerId];
    if (!center) {
      return [{ value: '', label: 'Todas las especialidades' }];
    }

    const resultOptions: SelectOption[] = [
      { value: '', label: 'Todas las especialidades' },
      ...center.specialties.map((code) => ({
        value: code,
        label: specialtyNameByCode[code] ?? code,
      })),
    ];

    return resultOptions;
  };

  /**
   * Gets doctor options for a given center and optional specialty
   * @param centerId - Center identifier
   * @param specialtyCode - Optional specialty code
   * @returns Array of select options for doctors
   */
  const getDoctorOptionsForSelection = (centerId: string, specialtyCode: string): SelectOption[] => {
    if (!centerId) {
      return [{ value: '', label: 'Primero seleccione centro' }];
    }

    const center = medicalCenters[centerId];
    if (!center) {
      return [{ value: '', label: 'No hay doctores disponibles' }];
    }

    let allDoctors: CenterDoctor[] = [];

    if (specialtyCode) {
      const doctors = center.doctors[specialtyCode] ?? [];
      allDoctors = doctors;
    } else {
      Object.keys(center.doctors).forEach((code) => {
        allDoctors = allDoctors.concat(center.doctors[code] ?? []);
      });
    }

    if (allDoctors.length === 0) {
      return [{ value: '', label: 'No hay doctores disponibles' }];
    }

    const sortedDoctors = [...allDoctors].sort((first, second) => {
      if (first.specialty !== second.specialty) {
        return first.specialty.localeCompare(second.specialty);
      }

      return first.name.localeCompare(second.name);
    });

    const resultOptions: SelectOption[] = [
      { value: '', label: 'Seleccione un doctor...' },
      ...sortedDoctors.map((doctor) => ({
        value: doctor.id,
        label: `${doctor.name} - ${doctor.specialty}`,
      })),
    ];

    return resultOptions;
  };

  /**
   * Gets doctor information for selected center and doctor id
   * @param centerId - Center identifier
   * @param doctorId - Doctor identifier
   * @returns CenterDoctor or null
   */
  const getSelectedDoctorData = (centerId: string, doctorId: string): CenterDoctor | null => {
    if (!centerId || !doctorId) {
      return null;
    }

    const center = medicalCenters[centerId];
    if (!center) {
      return null;
    }

    const allDoctors: CenterDoctor[] = [];

    Object.keys(center.doctors).forEach((specialtyCode) => {
      const doctors = center.doctors[specialtyCode] ?? [];
      doctors.forEach((doctor) => allDoctors.push(doctor));
    });

    const foundDoctor = allDoctors.find((doctor) => doctor.id === doctorId);

    if (!foundDoctor) {
      return null;
    }

    return foundDoctor;
  };

  /**
   * Gets specialty code for a doctor within a specific center
   * @param centerId - Center identifier
   * @param doctorId - Doctor identifier
   * @returns Specialty code or empty string when not found
   */
  const getSpecialtyCodeForDoctor = (centerId: string, doctorId: string): string => {
    if (!centerId || !doctorId) {
      return '';
    }

    const center = medicalCenters[centerId];
    if (!center) {
      return '';
    }

    const specialtyCodes = Object.keys(center.doctors);

    for (const code of specialtyCodes) {
      const doctors = center.doctors[code] ?? [];
      const hasDoctor = doctors.some((doctor) => doctor.id === doctorId);

      if (hasDoctor) {
        return code;
      }
    }

    return '';
  };

  /**
   * Checks if a date is in the past comparing only date part
   * @param date - Date to check
   * @returns True if date is before today
   */
  const isPastDate = (date: Date): boolean => {
    const normalizedDate = new Date(date);
    const normalizedToday = new Date();

    normalizedDate.setHours(0, 0, 0, 0);
    normalizedToday.setHours(0, 0, 0, 0);

    return normalizedDate < normalizedToday;
  };

  /**
   * Formats date as YYYY-MM-DD
   * @param date - Date to format
   * @returns Formatted string
   */
  const formatDateKey = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  /**
   * Adds minutes to a time string HH:MM
   * @param time - Base time string
   * @param minutesToAdd - Minutes to add
   * @returns Time string with minutes added
   */
  const addMinutesToTime = (time: string, minutesToAdd: number): string => {
    const parts = time.split(':');

    if (parts.length !== 2) {
      return time;
    }

    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);
    const totalMinutes = hours * 60 + minutes + minutesToAdd;
    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;

    return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
  };

  /**
   * Generates all available time slots for a doctor in a given date
   * excluding booked appointments
   * @param doctor - Selected doctor data
   * @param date - Selected date
   * @returns Array with available time slot strings
   */
  const generateAvailableSlots = (doctor: CenterDoctor | null, date: Date | null): string[] => {
    if (!doctor || !date) {
      return [];
    }

    const dateKey = formatDateKey(date);
    const bookedSlotsForDay = bookedAppointments[dateKey]?.[doctor.id] ?? [];
    const allSlots: string[] = [];

    let currentTime = doctor.workingHours.start;

    while (currentTime < doctor.workingHours.end) {
      allSlots.push(currentTime);
      currentTime = addMinutesToTime(currentTime, 30);
    }

    const availableSlots = allSlots.filter((slot) => !bookedSlotsForDay.includes(slot));

    return availableSlots;
  };

  /**
   * Gets human readable date label for selected date
   * @param date - Selected date
   * @returns Formatted string for Spanish locale
   */
  const getSelectedDateLabel = (date: Date | null): string => {
    if (!date) {
      return '';
    }

    const label = date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    if (!label) {
      return '';
    }

    return `${label.charAt(0).toUpperCase()}${label.slice(1)}`;
  };

  /**
   * Handles selecting a date from calendar
   * @param date - Selected date
   */
  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  /**
   * Handles selecting a time slot
   * @param time - Selected time slot
   */
  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
  };

  /**
   * Handles previous month navigation in calendar
   */
  const handlePreviousMonth = () => {
    setSelectedDate(null);
    setSelectedTime(null);

    setCurrentMonth((prevMonth) => {
      const updatedMonth = prevMonth - 1;

      if (updatedMonth < 0) {
        setCurrentYear((prevYear) => prevYear - 1);
        return 11;
      }

      return updatedMonth;
    });
  };

  /**
   * Handles next month navigation in calendar
   */
  const handleNextMonth = () => {
    setSelectedDate(null);
    setSelectedTime(null);

    setCurrentMonth((prevMonth) => {
      const updatedMonth = prevMonth + 1;

      if (updatedMonth > 11) {
        setCurrentYear((prevYear) => prevYear + 1);
        return 0;
      }

      return updatedMonth;
    });
  };

  /**
   * Gets current month label in Spanish
   * @returns Formatted month label
   */
  const getCurrentMonthLabel = (): string => {
    const monthNames = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    return `${monthNames[currentMonth]} ${currentYear}`;
  };

  /**
   * Gets information if doctor works in a specific date based on workingDays
   * @param doctor - CenterDoctor to validate
   * @param date - Date to check
   * @returns True when doctor works this day
   */
  const doctorWorksOnDate = (doctor: CenterDoctor | null, date: Date): boolean => {
    if (!doctor) {
      return false;
    }

    const dayOfWeek = date.getDay();

    return doctor.workingDays.includes(dayOfWeek);
  };

  /**
   * Handles opening the request appointment modal and resets selection
   */
  const handleOpenRequestModal = () => {
    setShowRequestModal(true);
    setIsRescheduling(false);
    setOriginalAppointmentInfo(null);
    setSelectedCenterId('');
    setSelectedSpecialtyCode('');
    setSelectedDoctorId('');
    setSelectedDate(null);
    setSelectedTime(null);
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    resetRequest();
  };

  /**
   * Handles closing the request appointment modal
   */
  const handleCloseRequestModal = () => {
    setShowRequestModal(false);
    setIsRescheduling(false);
    setOriginalAppointmentInfo(null);
    setSelectedCenterId('');
    setSelectedSpecialtyCode('');
    setSelectedDoctorId('');
    setSelectedDate(null);
    setSelectedTime(null);
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
   * Handles opening the reschedule appointment flow using request modal
   * Preloads center, specialty and doctor based on existing appointment
   * @param appointment - Appointment to reschedule
   */
  const handleOpenRescheduleModal = (appointment: Appointment) => {
    const { centerId, doctorId, date, time } = appointment;

    setIsRescheduling(true);
    setOriginalAppointmentInfo({ date, time });
    setSelectedCenterId(centerId);
    setSelectedDoctorId(doctorId);

    const specialtyCode = getSpecialtyCodeForDoctor(centerId, doctorId);
    setSelectedSpecialtyCode(specialtyCode);

    setSelectedDate(null);
    setSelectedTime(null);
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());

    resetRequest({
      centerId,
      specialtyCode,
      doctorId,
      reason: '',
    });

    setShowRequestModal(true);
  };

  /**
   * Handles submitting appointment request
   * @param _data - Form data for requesting appointment
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onRequestSubmit = (_data: RequestAppointmentFormData) => {
    if (!selectedCenterId || !selectedDoctorId || !selectedDate || !selectedTime) {
      toast.error('Debe seleccionar centro, doctor, fecha y hora');
      return;
    }

    handleCloseRequestModal();

    if (isRescheduling) {
      toast.success('Solicitud de reprogramación enviada');
      return;
    }

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
                  onClick={() => handleOpenRescheduleModal(appointment)}
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
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          style={{
            opacity: showRequestModal ? 1 : 0,
            visibility: showRequestModal ? 'visible' : 'hidden',
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Solicitar Nueva Cita</h2>
                <button
                  onClick={handleCloseRequestModal}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                  aria-label="Cerrar modal de solicitud de cita"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitRequest(onRequestSubmit)} className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Original appointment info for rescheduling */}
                {isRescheduling && originalAppointmentInfo && (
                  <div className="lg:col-span-2 mb-2">
                    <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <h4 className="font-semibold text-amber-900 mb-2">
                        Cita Original
                      </h4>
                      <div className="text-sm text-amber-700">
                        <p>
                          <span className="font-semibold">Fecha:</span>
                          <span className="ml-1">{originalAppointmentInfo.date}</span>
                        </p>
                        <p className="mt-1">
                          <span className="font-semibold">Hora:</span>
                          <span className="ml-1">{originalAppointmentInfo.time}</span>
                        </p>
                        <p className="mt-2 text-xs">
                          Seleccione una nueva fecha y hora para reprogramar su cita.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {/* Left Column: Filters */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 mb-1">Seleccione los detalles</h3>

                  {/* Centro Médico */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Centro Médico
                    </label>
                    <Controller
                      name="centerId"
                      control={controlRequest}
                      rules={{ required: 'El centro médico es requerido' }}
                      render={({ field }) => (
                        <CustomSelect
                          label=""
                          options={[
                            { value: '', label: 'Seleccione un centro...' },
                            { value: 'centro1', label: medicalCenters.centro1.name },
                            { value: 'centro2', label: medicalCenters.centro2.name },
                            { value: 'centro3', label: medicalCenters.centro3.name },
                          ]}
                          value={field.value ?? ''}
                          onChange={(value) => {
                            if (isRescheduling) {
                              return;
                            }

                            field.onChange(value);
                            setSelectedCenterId(value);
                            setSelectedSpecialtyCode('');
                            setSelectedDoctorId('');
                            setSelectedDate(null);
                            setSelectedTime(null);
                          }}
                          error={errorsRequest.centerId?.message}
                          placeholder="Seleccione un centro..."
                        />
                      )}
                    />
                  </div>

                  {/* Especialidad (Opcional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Especialidad
                      <span className="ml-1 text-xs text-gray-500 font-normal">
                        (opcional - filtra doctores)
                      </span>
                    </label>
                    <Controller
                      name="specialtyCode"
                      control={controlRequest}
                      render={({ field }) => (
                        <CustomSelect
                          label=""
                          options={getSpecialtyOptionsForCenter(selectedCenterId)}
                          value={field.value ?? ''}
                          onChange={(value) => {
                            if (isRescheduling) {
                              return;
                            }

                            field.onChange(value);
                            setSelectedSpecialtyCode(value);
                            setSelectedDoctorId('');
                            setSelectedDate(null);
                            setSelectedTime(null);
                          }}
                          placeholder="Todas las especialidades"
                        />
                      )}
                    />
                  </div>

                  {/* Doctor */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Doctor
                    </label>
                    <Controller
                      name="doctorId"
                      control={controlRequest}
                      rules={{ required: 'El doctor es requerido' }}
                      render={({ field }) => (
                        <CustomSelect
                          label=""
                          options={getDoctorOptionsForSelection(selectedCenterId, selectedSpecialtyCode)}
                          value={field.value ?? ''}
                          onChange={(value) => {
                            if (isRescheduling) {
                              return;
                            }

                            field.onChange(value);
                            setSelectedDoctorId(value);
                            setSelectedDate(null);
                            setSelectedTime(null);
                          }}
                          error={errorsRequest.doctorId?.message}
                          placeholder="Seleccione un doctor..."
                        />
                      )}
                    />
                  </div>

                  {/* Horario del Doctor */}
                  {(() => {
                    const doctorData = getSelectedDoctorData(selectedCenterId, selectedDoctorId);

                    if (!doctorData) {
                      return null;
                    }

                    return (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm font-medium text-blue-900 mb-2">
                          Horarios de atención:
                        </p>
                        <div className="text-sm text-blue-700 space-y-1">
                          {doctorData.schedule.map((scheduleLine) => (
                            <p key={scheduleLine}>• {scheduleLine}</p>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Right Column: Calendar & Time Slots */}
                <div>
                  {/* Calendario */}
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Seleccione Fecha</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <button
                          type="button"
                          onClick={handlePreviousMonth}
                          className="p-2 rounded hover:bg-gray-200"
                          aria-label="Mes anterior"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <span className="font-semibold text-gray-900">
                          {getCurrentMonthLabel()}
                        </span>
                        <button
                          type="button"
                          onClick={handleNextMonth}
                          className="p-2 rounded hover:bg-gray-200"
                          aria-label="Mes siguiente"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>

                      <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-medium text-gray-600">
                        <div>Dom</div>
                        <div>Lun</div>
                        <div>Mar</div>
                        <div>Mié</div>
                        <div>Jue</div>
                        <div>Vie</div>
                        <div>Sáb</div>
                      </div>

                      <div className="grid grid-cols-7 gap-1">
                        {(() => {
                          const firstDay = new Date(currentYear, currentMonth, 1).getDay();
                          const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                          const items: ReactNode[] = [];

                          for (let index = 0; index < firstDay; index += 1) {
                            items.push(
                              <div
                                key={`empty-${index}`}
                                className="text-center py-2"
                              />,
                            );
                          }

                          const doctorData = getSelectedDoctorData(selectedCenterId, selectedDoctorId);

                          for (let day = 1; day <= daysInMonth; day += 1) {
                            const dayDate = new Date(currentYear, currentMonth, day);
                            const isPast = isPastDate(dayDate);
                            const worksThisDay = doctorWorksOnDate(doctorData, dayDate);
                            const isSelected =
                              selectedDate !== null &&
                              selectedDate.getFullYear() === dayDate.getFullYear() &&
                              selectedDate.getMonth() === dayDate.getMonth() &&
                              selectedDate.getDate() === dayDate.getDate();

                            const dateKey = formatDateKey(dayDate);
                            const bookedForDay = doctorData
                              ? bookedAppointments[dateKey]?.[doctorData.id] ?? []
                              : [];

                            const isDisabled =
                              isPast || !doctorData || !worksThisDay;

                            items.push(
                              <button
                                key={day}
                                type="button"
                                onClick={() => {
                                  if (isDisabled) {
                                    return;
                                  }

                                  handleSelectDate(dayDate);
                                }}
                                className={`relative text-center py-2 rounded text-sm transition ${
                                  isDisabled
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : isSelected
                                      ? 'bg-blue-600 text-white font-semibold'
                                      : 'text-gray-900 hover:bg-blue-50'
                                }`}
                                aria-disabled={isDisabled}
                              >
                                {day}
                                {bookedForDay.length > 0 && (
                                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full" />
                                )}
                              </button>,
                            );
                          }

                          return items;
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Horarios Disponibles */}
                  {(() => {
                    const doctorData = getSelectedDoctorData(selectedCenterId, selectedDoctorId);

                    if (!doctorData || !selectedDate) {
                      return null;
                    }

                    const availableSlots = generateAvailableSlots(doctorData, selectedDate);
                    const dateKey = formatDateKey(selectedDate);
                    const bookedForDay = bookedAppointments[dateKey]?.[doctorData.id] ?? [];

                    return (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">
                          Horarios Disponibles
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {getSelectedDateLabel(selectedDate)}
                        </p>
                        <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                          {bookedForDay.length > 0 && (
                            <div className="col-span-3 mb-2 p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-700">
                              <span className="font-semibold">
                                Horarios ocupados:
                              </span>
                              <span className="ml-1">
                                {bookedForDay.join(', ')}
                              </span>
                            </div>
                          )}

                          {availableSlots.length === 0 && (
                            <p className="col-span-3 text-center text-gray-500 py-4">
                              No hay horarios disponibles para este día
                            </p>
                          )}

                          {availableSlots.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => handleSelectTime(slot)}
                              className={`py-2 px-3 rounded-lg text-sm transition border ${
                                selectedTime === slot
                                  ? 'bg-blue-600 text-white font-semibold border-blue-600'
                                  : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-700'
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Resumen de Cita */}
              {(() => {
                if (!selectedCenterId || !selectedDoctorId || !selectedDate || !selectedTime) {
                  return null;
                }

                const centerData = medicalCenters[selectedCenterId];
                const doctorData = getSelectedDoctorData(selectedCenterId, selectedDoctorId);

                if (!centerData || !doctorData) {
                  return null;
                }

                return (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">
                      Resumen de la Cita
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-600">Centro:</p>
                        <p className="font-medium text-gray-900">
                          {centerData.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Doctor:</p>
                        <p className="font-medium text-gray-900">
                          {doctorData.name} - {doctorData.specialty}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Fecha:</p>
                        <p className="font-medium text-gray-900">
                          {getSelectedDateLabel(selectedDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Hora:</p>
                        <p className="font-medium text-gray-900">
                          {selectedTime}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Motivo de Consulta */}
              <div className="mt-4">
                <Textarea
                  label="Motivo de consulta (opcional)"
                  rows={3}
                  placeholder="Describa brevemente el motivo de su consulta..."
                  registration={registerRequest('reason')}
                  error={errorsRequest.reason?.message}
                />
              </div>

              {/* Botones de Acción */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseRequestModal}
                  className="min-h-[44px] px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-4 py-2 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#2F80ED' }}
                  onMouseEnter={(event) => {
                    if (event.currentTarget.disabled) {
                      return;
                    }
                    event.currentTarget.style.backgroundColor = '#1E6FD9';
                  }}
                  onMouseLeave={(event) => {
                    if (event.currentTarget.disabled) {
                      return;
                    }
                    event.currentTarget.style.backgroundColor = '#2F80ED';
                  }}
                  disabled={
                    !selectedCenterId ||
                    !selectedDoctorId ||
                    !selectedDate ||
                    !selectedTime
                  }
                >
                  Confirmar Cita
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

    </div>
  );
};

export default AppointmentsPageContent;
