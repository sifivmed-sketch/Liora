'use client';

import { useEffect, useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Input from '@/components/Input';
import CustomSelect, { SelectOption } from '@/components/Select';
import { 
  fetchPatientProfile, 
  isProfileFetchSuccessful,
  savePatientIdentificationContact,
  savePatientLocationPersonal,
  savePatientMedicalInfo,
  fetchProvinces,
  fetchMunicipalities
} from '../services/profile.service';
import { formatIdentityCard, handleIdentityCardKeyDown } from '@/lib/utils/identity.utils';

interface ProfilePersonalInfoFormProps {
  sessionId: string;
  idPaciente: string;
  onProgressChange?: (progress: number) => void;
}

interface PersonalInfoFormData {
  // Información Personal
  nombre: string;
  apellidos: string;
  tipoIdentificacion: string;
  cedula: string;
  pasaporte: string;
  email: string;
  sexo: string;
  fechaNacimiento: string;
  telefonoPrincipal: string;
  // Información de Ubicación
  telefonoSecundario: string;
  nacionalidad: string;
  idNacionalidad?: number;
  provincia: string;
  idProvincia?: string;
  municipio: string;
  idMunicipio?: string;
  sector: string;
  direccion: string;
  // Información Adicional
  estadoCivil: string;
  profesion: string;
  // Información Médica y de Seguro
  tipoSangre: string;
  donante: string;
  nss: string;
  aseguradora: string;
  idAseguradora?: number;
  numeroContrato: string;
  cedulaTitular: string;
  tipoPaciente: string;
  // Contacto de Emergencia
  nombreEmergencia: string;
  telefonoEmergencia: string;
  relacionEmergencia: string;
}

/**
 * Component for displaying and editing patient's personal information
 * @param sessionId - Session ID from login for API calls
 * @param idPaciente - Patient ID from the session
 * @returns JSX element with personal information form
 */
const ProfilePersonalInfoForm = ({ sessionId, idPaciente, onProgressChange }: ProfilePersonalInfoFormProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [initialData, setInitialData] = useState<PersonalInfoFormData | null>(null);
  const [provinces, setProvinces] = useState<SelectOption[]>([]);
  const [municipalities, setMunicipalities] = useState<SelectOption[]>([]);
  const [isLoadingMunicipalities, setIsLoadingMunicipalities] = useState(false);
  const isInitialLoadRef = useRef(true);

  // Debug: Log props on mount
  useEffect(() => {
    console.log('=== ProfilePersonalInfoForm Props ===');
    console.log('sessionId:', sessionId);
    console.log('idPaciente:', idPaciente);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { 
    register, 
    control,
    handleSubmit, 
    formState: { errors },
    watch,
    reset,
    setValue
  } = useForm<PersonalInfoFormData>({
    defaultValues: {
      // Información Personal
      nombre: '',
      apellidos: '',
      tipoIdentificacion: '',
      cedula: '',
      pasaporte: '',
      email: '',
      sexo: '',
      fechaNacimiento: '',
      telefonoPrincipal: '',
      // Información de Ubicación
      telefonoSecundario: '',
      nacionalidad: '',
      provincia: '',
      municipio: '',
      sector: '',
      direccion: '',
      // Información Adicional
      estadoCivil: '',
      profesion: '',
      // Información Médica y de Seguro
      tipoSangre: '',
      donante: '',
      nss: '',
      aseguradora: '',
      numeroContrato: '',
      cedulaTitular: '',
      tipoPaciente: '',
      // Contacto de Emergencia
      nombreEmergencia: '',
      telefonoEmergencia: '',
      relacionEmergencia: '',
    }
  });

  /**
   * Calculates the percentage of completed fields
   * @param formData - Current form data
   * @returns Percentage of completed fields (0-100)
   */
  const calculateProgress = (formData: PersonalInfoFormData): number => {
    const allFields = Object.keys(formData) as (keyof PersonalInfoFormData)[];
    const totalFields = allFields.length;
    
    const filledFields = allFields.filter((key) => {
      const value = formData[key];
      return value !== null && value !== undefined && value !== '';
    }).length;
    
    return Math.round((filledFields / totalFields) * 100);
  };

  // Watch for form changes
  useEffect(() => {
    const subscription = watch((value) => {
      const formData = value as PersonalInfoFormData;
      
      // Calculate and notify progress
      const progress = calculateProgress(formData);
      if (onProgressChange) {
        onProgressChange(progress);
      }
      
      // Set dirty state only on user changes (not during initial load)
      if (!isInitialLoadRef.current) {
        setIsDirty(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, onProgressChange]);

  /**
   * Converts API date format to input date format (YYYY-MM-DD)
   * @param dateString - Date string from API
   * @returns Formatted date string (YYYY-MM-DD) or empty string
   */
  const convertApiDateToInputFormat = (dateString: string): string => {
    if (!dateString) return '';
    
    try {
      console.log('Fecha recibida del API:', dateString);
      
      // Try to parse with Date object
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Fecha inválida:', dateString);
        return '';
      }
      
      // Format to YYYY-MM-DD
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      const formattedDate = `${year}-${month}-${day}`;
      console.log('Fecha convertida:', formattedDate);
      
      return formattedDate;
    } catch (error) {
      console.error('Error convirtiendo fecha:', error);
      return '';
    }
  };

  /**
   * Loads patient profile data from the API
   */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        setApiError(null);

        console.log('Cargando datos desde API');
        const response = await fetchPatientProfile(sessionId, idPaciente);

        // Prepare form data from API responses
        const apiData: PersonalInfoFormData = {
          // Información Personal
          nombre: '',
          apellidos: '',
          tipoIdentificacion: '',
          cedula: '',
          pasaporte: '',
          email: '',
          sexo: '',
          fechaNacimiento: '',
          telefonoPrincipal: '',
          // Información de Ubicación
          telefonoSecundario: '',
          nacionalidad: '',
          idNacionalidad: undefined,
          provincia: '',
          idProvincia: undefined,
          municipio: '',
          idMunicipio: undefined,
          sector: '',
          direccion: '',
          // Información Adicional
          estadoCivil: '',
          profesion: '',
          // Información Médica y de Seguro
          tipoSangre: '',
          donante: '',
          nss: '',
          aseguradora: '',
          idAseguradora: undefined,
          numeroContrato: '',
          cedulaTitular: '',
          tipoPaciente: '',
          // Contacto de Emergencia
          nombreEmergencia: '',
          telefonoEmergencia: '',
          relacionEmergencia: '',
        };

        if (isProfileFetchSuccessful(response)) {
          const { identification, location, medical } = response;
          
          console.log('Datos obtenidos de la API:', {
            tieneIdentificacion: !!identification,
            tieneUbicacion: !!location,
            tieneMedica: !!medical
          });
          
          // Identification and Contact data
          if (identification) {
            const nombre1 = identification.Nombre1 || '';
            const nombre2 = identification.Nombre2 || '';
            const apellido1 = identification.Apellido1 || '';
            const apellido2 = identification.Apellido2 || '';
            
            apiData.nombre = nombre2 ? `${nombre1} ${nombre2}` : nombre1;
            apiData.apellidos = apellido2 ? `${apellido1} ${apellido2}` : apellido1;
            apiData.cedula = identification.Cedula ? formatIdentityCard(identification.Cedula) : '';
            apiData.tipoIdentificacion = identification.Cedula ? 'Cedula' : '';
            apiData.email = identification.Email || '';
            apiData.telefonoPrincipal = identification.Telefono1 || '';
            apiData.telefonoSecundario = identification.Telefono2 || '';
            apiData.fechaNacimiento = convertApiDateToInputFormat(identification.Fecha_Nacimiento || '');
          }
          
          // Location and Personal data
          if (location) {
            apiData.sexo = location.Sexo || '';
            apiData.nacionalidad = location.Nacionalidad || '';
            apiData.idNacionalidad = location.IdNacionalidad;
            apiData.estadoCivil = location.Estado_Civil || '';
            apiData.profesion = location.Profesion || '';
            apiData.direccion = location.Direccion || '';
            apiData.sector = location.Sector || '';
            apiData.municipio = location.Municipio || '';
            apiData.idMunicipio = location.IdMunicipio || '';
            // Use IdProvincia as the value for provincia select (it will show the name)
            apiData.idProvincia = location.IdProvincia || '';
            apiData.provincia = location.Provincia || ''; // Keep name for display/backup
          }
          
          // Medical Information data
          if (medical) {
            apiData.nss = medical.Nss || '';
            apiData.aseguradora = medical.Aseguradora || '';
            apiData.idAseguradora = medical.IdAseguradora;
            apiData.tipoSangre = medical.Tipo_Sangre || '';
            apiData.donante = medical.Donante ? 'S' : 'N';
          }
        } else {
          // If no data from API (all sections returned 404), continue with empty form
          console.log('No se encontró información del perfil - paciente nuevo o sin datos guardados');
        }
        
        // Always set the data (either from API or empty)
        const completeData = apiData as PersonalInfoFormData;
        
        console.log('=== DATOS PARA RESET ===');
        console.log('completeData:', completeData);
        console.log('Muestra de campos:', {
          nombre: completeData.nombre,
          apellidos: completeData.apellidos,
          cedula: completeData.cedula,
          email: completeData.email,
          sexo: completeData.sexo,
          fechaNacimiento: completeData.fechaNacimiento
        });
        
        reset(completeData);
        console.log('reset() ejecutado');
        
        setInitialData(completeData); // Store initial data for comparison
        setIsDirty(false);
        
        // Calculate and notify initial progress
        const progress = calculateProgress(completeData);
        if (onProgressChange) {
          onProgressChange(progress);
        }
        
        // If no province is selected, mark initial load as complete immediately
        // Otherwise, it will be marked complete after municipalities load
        if (!completeData.idProvincia) {
          isInitialLoadRef.current = false;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error inesperado al cargar el perfil';
        console.error('Error loading profile:', errorMessage);
        setApiError(errorMessage);
        isInitialLoadRef.current = false;
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, idPaciente]);

  /**
   * Loads provinces from API on mount
   */
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        const provincesData = await fetchProvinces();
        const provinceOptions: SelectOption[] = [
          { value: '', label: 'Seleccionar' },
          ...provincesData.map((province: { Id: string; Nombre: string }) => ({
            value: province.Id,
            label: province.Nombre
          }))
        ];
        setProvinces(provinceOptions);
      } catch (error) {
        console.error('Error loading provinces:', error);
      }
    };

    loadProvinces();
  }, []);

  // Watch idProvincia to load municipalities when it changes
  const idProvincia = watch('idProvincia');

  /**
   * Loads municipalities when province changes
   */
  useEffect(() => {
    const loadMunicipalities = async () => {
      if (!idProvincia) {
        setMunicipalities([{ value: '', label: 'Seleccionar provincia primero' }]);
        return;
      }

      try {
        setIsLoadingMunicipalities(true);
        const municipalitiesData = await fetchMunicipalities(idProvincia);
        const municipalityOptions: SelectOption[] = [
          { value: '', label: 'Seleccionar' },
          ...municipalitiesData.map((municipality: { Id: string; Nombre: string }) => ({
            value: municipality.Id,
            label: municipality.Nombre
          }))
        ];
        setMunicipalities(municipalityOptions);
        
        // Mark initial load as complete after municipalities are loaded
        if (isInitialLoadRef.current) {
          isInitialLoadRef.current = false;
        }
      } catch (error) {
        console.error('Error loading municipalities:', error);
        setMunicipalities([{ value: '', label: 'Error al cargar municipios' }]);
        // Mark initial load as complete even on error
        if (isInitialLoadRef.current) {
          isInitialLoadRef.current = false;
        }
      } finally {
        setIsLoadingMunicipalities(false);
      }
    };

    loadMunicipalities();
  }, [idProvincia]);

  // Watch tipoIdentificacion to clear the opposite field when it changes
  const tipoIdentificacion = watch('tipoIdentificacion');
  const isCedula = tipoIdentificacion === 'Cedula';
  const isPasaporte = tipoIdentificacion === 'Pasaporte';

  // Clear opposite field when tipoIdentificacion changes
  useEffect(() => {
    if (isCedula) {
      setValue('pasaporte', '');
    } else if (isPasaporte) {
      setValue('cedula', '');
    }
  }, [tipoIdentificacion, isCedula, isPasaporte, setValue]);

  /**
   * Handles form cancellation
   */
  const handleCancel = () => {
    console.log('Cancelar cambios');
    
    // Restore initial data
    if (initialData) {
      reset(initialData);
      setIsDirty(false);
    }
  };

  /**
   * Converts input date format to API date format
   * @param dateString - Date string from input (YYYY-MM-DD)
   * @returns Formatted date string for API in ISO format (YYYY-MM-DD) that SQL Server can handle
   */
  const convertInputDateToApiFormat = (dateString: string): string => {
    if (!dateString) return '';
    
    try {
      // Input format: YYYY-MM-DD (already in ISO format)
      // SQL Server accepts ISO format (YYYY-MM-DD) without issues
      // Just return as-is, SQL Server will handle the conversion
      return dateString;
    } catch (error) {
      console.error('Error converting date for API:', error);
      return '';
    }
  };

  /**
   * Determines which sections have changed
   * @param currentData - Current form data
   * @param initialData - Initial data from API
   * @returns Object indicating which sections changed
   */
  const getChangedSections = (currentData: PersonalInfoFormData, initialData: PersonalInfoFormData) => {
    const identificationFields = ['nombre', 'apellidos', 'cedula', 'pasaporte', 'tipoIdentificacion', 'email', 'fechaNacimiento', 'telefonoPrincipal', 'telefonoSecundario'];
    const locationFields = ['sexo', 'nacionalidad', 'sector', 'direccion', 'estadoCivil', 'profesion'];
    const medicalFields = ['tipoSangre', 'donante', 'nss', 'aseguradora'];
    
    const identificationChanged = identificationFields.some(field => 
      currentData[field as keyof PersonalInfoFormData] !== initialData[field as keyof PersonalInfoFormData]
    );
    
    // Check location fields including province and municipality IDs
    const locationChanged = locationFields.some(field => 
      currentData[field as keyof PersonalInfoFormData] !== initialData[field as keyof PersonalInfoFormData]
    ) || currentData.idProvincia !== initialData.idProvincia 
    || currentData.idMunicipio !== initialData.idMunicipio;
    
    const medicalChanged = medicalFields.some(field => 
      currentData[field as keyof PersonalInfoFormData] !== initialData[field as keyof PersonalInfoFormData]
    );
    
    return {
      identification: identificationChanged,
      location: locationChanged,
      medical: medicalChanged
    };
  };

  /**
   * Handles form submission
   * @param data - Form data to save
   */
  const onSubmit = async (data: PersonalInfoFormData) => {
    console.log('Datos del formulario:', {
      seccion: 'Todas las secciones',
      datos: data
    });
    
    try {
      setIsSaving(true);
      
      // Determine which sections changed (only if we have initialData)
      const changedSections = initialData 
        ? getChangedSections(data, initialData)
        : { identification: true, location: true, medical: true }; // If no initialData, save everything
      
      console.log('Secciones modificadas:', changedSections);
      
      const promises: Promise<{ Codigo: number; Mensaje: string }>[] = [];
      
      // Only save identification if it changed
      if (changedSections.identification) {
        // Split nombre into nombre1 and nombre2
        const nombreParts = data.nombre.trim().split(' ');
        const nombre1 = nombreParts[0] || '';
        const nombre2 = nombreParts.slice(1).join(' ') || '';
        
        // Split apellidos into apellido1 and apellido2
        const apellidoParts = data.apellidos.trim().split(' ');
        const apellido1 = apellidoParts[0] || '';
        const apellido2 = apellidoParts.slice(1).join(' ') || '';
        
        const identificationData = {
          usuario: idPaciente,
          cedula: data.cedula.replace(/\D/g, ''),
          nombre1: nombre1,
          nombre2: nombre2,
          apellido1: apellido1,
          apellido2: apellido2,
          fechaNacimiento: convertInputDateToApiFormat(data.fechaNacimiento),
          email: data.email,
          telefono1: data.telefonoPrincipal,
          telefono2: data.telefonoSecundario,
          tipoRegistro: data.tipoIdentificacion === 'Cedula' ? 'Cedula' : 'Pasaporte',
        };
        
        console.log('Guardando identificación:', identificationData);
        promises.push(savePatientIdentificationContact(sessionId, identificationData));
      }
      
      // Only save location if it changed
      if (changedSections.location) {
        const locationData = {
          usuario: idPaciente,
          sexo: data.sexo,
          nacionalidad: data.idNacionalidad || 1,
          estadoCivil: data.estadoCivil,
          profesion: data.profesion,
          direccion: data.direccion,
          sector: data.sector,
          municipio: data.idMunicipio || '',
          provincia: data.idProvincia || '',
        };
        
        console.log('Guardando ubicación:', locationData);
        promises.push(savePatientLocationPersonal(sessionId, locationData));
      }
      
      // Only save medical if it changed
      if (changedSections.medical) {
        const medicalData = {
          usuario: idPaciente,
          nss: data.nss,
          aseguradora: data.idAseguradora || 1,
          tipoSangre: data.tipoSangre,
          donante: data.donante === 'S' ? 1 : 0,
        };
        
        console.log('Guardando información médica:', medicalData);
        promises.push(savePatientMedicalInfo(sessionId, medicalData));
      }
      
      if (promises.length === 0) {
        alert('No hay cambios para guardar');
        return;
      }
      
      console.log(`Guardando ${promises.length} sección(es)...`);
      
      // Save only the changed sections
      const results = await Promise.allSettled(promises);
      
      // Check if all requests were successful (API returns Codigo: 0 for success)
      const allSuccessful = results.every(
        (result) => result.status === 'fulfilled' && result.value.Codigo === 0
      );
      
      if (allSuccessful) {
        // Update initial data with new values
        setInitialData(data);
        setIsDirty(false);
        alert('Perfil guardado exitosamente');
      } else {
        // Show error messages
        const errors = results
          .map((result, index) => {
            if (result.status === 'rejected') {
              return `Error en sección ${index + 1}: ${result.reason}`;
            } else if (result.status === 'fulfilled' && result.value.Codigo !== 0) {
              return result.value.Mensaje;
            }
            return null;
          })
          .filter(Boolean);
        
        alert(`Se guardaron algunos datos, pero hubo errores:\n${errors.join('\n')}`);
      }
    } catch (error) {
      console.error('Error al guardar el perfil:', error);
      alert('Error al guardar el perfil. Por favor, intenta de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  const tipoIdentificacionOptions: SelectOption[] = [
    { value: '', label: 'Seleccionar' },
    { value: 'Cedula', label: 'Cédula' },
    { value: 'Pasaporte', label: 'Pasaporte' },
  ];

  const sexoOptions: SelectOption[] = [
    { value: '', label: 'Seleccionar' },
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Femenino' },
  ];

  const nacionalidadOptions: SelectOption[] = [
    { value: '', label: 'Seleccionar' },
    { value: 'Dominicana', label: 'Dominicana' },
    { value: 'Haitiana', label: 'Haitiana' },
    { value: 'Americana', label: 'Americana' },
    { value: 'Española', label: 'Española' },
    { value: 'Venezolana', label: 'Venezolana' },
    { value: 'Colombiana', label: 'Colombiana' },
    { value: 'Cubana', label: 'Cubana' },
    { value: 'Otra', label: 'Otra' },
  ];

  const estadoCivilOptions: SelectOption[] = [
    { value: '', label: 'Seleccionar' },
    { value: 'S', label: 'Soltero(a)' },
    { value: 'C', label: 'Casado(a)' },
    { value: 'D', label: 'Divorciado(a)' },
    { value: 'V', label: 'Viudo(a)' },
    { value: 'U', label: 'Unión Libre' },
  ];

  const profesionOptions: SelectOption[] = [
    { value: '', label: 'Seleccionar' },
    { value: 'Médico', label: 'Médico' },
    { value: 'Enfermero', label: 'Enfermero' },
    { value: 'Abogado', label: 'Abogado' },
    { value: 'Ingeniero', label: 'Ingeniero' },
    { value: 'Profesor', label: 'Profesor' },
    { value: 'Contador', label: 'Contador' },
    { value: 'Arquitecto', label: 'Arquitecto' },
    { value: 'Comerciante', label: 'Comerciante' },
    { value: 'Estudiante', label: 'Estudiante' },
    { value: 'Ama de casa', label: 'Ama de casa' },
    { value: 'Pensionado', label: 'Pensionado' },
    { value: 'Empleado público', label: 'Empleado público' },
    { value: 'Empleado privado', label: 'Empleado privado' },
    { value: 'Trabajador independiente', label: 'Trabajador independiente' },
    { value: 'Desempleado', label: 'Desempleado' },
    { value: 'Otra', label: 'Otra' },
  ];

  const tipoSangreOptions: SelectOption[] = [
    { value: '', label: 'Seleccionar' },
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' },
  ];

  const donanteOptions: SelectOption[] = [
    { value: '', label: 'Seleccionar' },
    { value: 'S', label: 'Sí' },
    { value: 'N', label: 'No' },
  ];

  const aseguradoraOptions: SelectOption[] = [
    { value: '', label: 'Seleccionar' },
    { value: 'SENASA', label: 'SENASA' },
    { value: 'Humano', label: 'Humano' },
    { value: 'Universal', label: 'Universal' },
    { value: 'Futuro', label: 'Futuro' },
    { value: 'Palic', label: 'Palic' },
    { value: 'Yunen', label: 'Yunen' },
    { value: 'Primera', label: 'Primera' },
    { value: 'Renacer', label: 'Renacer' },
    { value: 'Monumental', label: 'Monumental' },
    { value: 'GMA', label: 'GMA' },
    { value: 'Privado particular', label: 'Privado particular' },
    { value: 'Sin seguro', label: 'Sin seguro' },
    { value: 'Otra', label: 'Otra' },
  ];

  const tipoPacienteOptions: SelectOption[] = [
    { value: '', label: 'Seleccionar' },
    { value: 'T', label: 'Titular' },
    { value: 'D', label: 'Dependiente' },
    { value: 'P', label: 'Particular' },
  ];

  const relacionEmergenciaOptions: SelectOption[] = [
    { value: '', label: 'Seleccionar' },
    { value: 'Esposo(a)', label: 'Esposo(a)' },
    { value: 'Hijo(a)', label: 'Hijo(a)' },
    { value: 'Padre', label: 'Padre' },
    { value: 'Madre', label: 'Madre' },
    { value: 'Hermano(a)', label: 'Hermano(a)' },
    { value: 'Familiar', label: 'Otro familiar' },
    { value: 'Amigo(a)', label: 'Amigo(a)' },
  ];

  if (isLoading && !isSaving) {
    return (
      <div className="space-y-6">
        {/* Personal Information Skeleton */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-11 bg-gray-100 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-11 bg-gray-100 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-11 bg-gray-100 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-11 bg-gray-100 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-12"></div>
              <div className="h-11 bg-gray-100 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-12"></div>
              <div className="h-11 bg-gray-100 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-36"></div>
              <div className="h-11 bg-gray-100 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-11 bg-gray-100 rounded"></div>
            </div>
          </div>
        </div>

        {/* Location Information Skeleton */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-56 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-11 bg-gray-100 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-11 bg-gray-100 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-11 bg-gray-100 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-11 bg-gray-100 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-11 bg-gray-100 rounded"></div>
            </div>
            <div className="md:col-span-2 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-36"></div>
              <div className="h-20 bg-gray-100 rounded"></div>
            </div>
          </div>
        </div>

        {/* Additional Information Skeleton */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-52 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-11 bg-gray-100 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-11 bg-gray-100 rounded"></div>
            </div>
          </div>
        </div>

        {/* Medical Information Skeleton */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 animate-pulse" style={{ borderLeft: '4px solid #2F80ED' }}>
          <div className="h-6 bg-blue-100 rounded w-60 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-28"></div>
              <div className="h-11 bg-gray-100 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-40"></div>
              <div className="h-11 bg-gray-100 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-48"></div>
              <div className="h-11 bg-gray-100 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-11 bg-gray-100 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-52"></div>
              <div className="h-11 bg-gray-100 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-48"></div>
              <div className="h-11 bg-gray-100 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-11 bg-gray-100 rounded"></div>
            </div>
          </div>
        </div>

        {/* Emergency Contact Skeleton */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 animate-pulse" style={{ borderLeft: '4px solid #dc2626' }}>
          <div className="h-6 bg-red-100 rounded w-52 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-48"></div>
              <div className="h-11 bg-gray-100 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-36"></div>
              <div className="h-11 bg-gray-100 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-11 bg-gray-100 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {apiError}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Information Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <Input
              label="Nombre"
              required
              placeholder="Tu nombre"
              registration={register('nombre')}
              error={errors.nombre?.message}
            />

            {/* Apellidos */}
            <Input
              label="Apellidos"
              required
              placeholder="Tus apellidos"
              registration={register('apellidos')}
              error={errors.apellidos?.message}
            />

            {/* Tipo de Identificación */}
            <Controller
              name="tipoIdentificacion"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label="Tipo de Identificación"
                  required
                  placeholder="Seleccionar"
                  options={tipoIdentificacionOptions}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.tipoIdentificacion?.message}
                />
              )}
            />

            {/* Cédula o Pasaporte - Dynamic field */}
            {isCedula && (
              <Controller
                name="cedula"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Cédula"
                    required
                    placeholder="000-0000000-0"
                    value={field.value}
                    onChange={(e) => {
                      const formatted = formatIdentityCard(e.target.value);
                      field.onChange(formatted);
                    }}
                    onKeyDown={handleIdentityCardKeyDown}
                    error={errors.cedula?.message}
                  />
                )}
              />
            )}

            {isPasaporte && (
              <Input
                label="Pasaporte"
                required
                placeholder="Número de pasaporte"
                registration={register('pasaporte')}
                error={errors.pasaporte?.message}
              />
            )}

            {/* Email */}
            <Input
              label="Email"
              type="email"
              placeholder="tu@email.com"
              registration={register('email')}
              error={errors.email?.message}
            />

            {/* Sexo */}
            <Controller
              name="sexo"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label="Sexo"
                  required
                  placeholder="Seleccionar"
                  options={sexoOptions}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.sexo?.message}
                />
              )}
            />

            {/* Fecha de Nacimiento */}
            <Input
              label="Fecha de Nacimiento"
              type="date"
              placeholder="dd/mm/aaaa"
              registration={register('fechaNacimiento')}
              error={errors.fechaNacimiento?.message}
            />

            {/* Teléfono Principal */}
            <Input
              label="Teléfono Principal"
              type="tel"
              placeholder="+57 300 123 4567"
              registration={register('telefonoPrincipal')}
              error={errors.telefonoPrincipal?.message}
            />
          </div>
        </div>

        {/* Información de Ubicación */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Información de Ubicación</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Teléfono Secundario */}
            <Input
              label="Teléfono Secundario"
              type="tel"
              placeholder="(829) 123-4567"
              registration={register('telefonoSecundario')}
              error={errors.telefonoSecundario?.message}
            />

            {/* Nacionalidad */}
            <Controller
              name="nacionalidad"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label="Nacionalidad"
                  placeholder="Seleccionar"
                  options={nacionalidadOptions}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.nacionalidad?.message}
                />
              )}
            />

            {/* Provincia */}
            <Controller
              name="idProvincia"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label="Provincia"
                  placeholder="Seleccionar"
                  options={provinces}
                  value={field.value || ''}
                  onChange={(value) => {
                    field.onChange(value);
                    // Find province name from ID and update provincia field
                    const selectedProvince = provinces.find(p => p.value === value);
                    if (selectedProvince) {
                      setValue('provincia', selectedProvince.label);
                    }
                    // Clear municipio when province changes
                    setValue('municipio', '');
                    setValue('idMunicipio', undefined);
                  }}
                  error={errors.provincia?.message}
                />
              )}
            />

            {/* Municipio */}
            <Controller
              name="idMunicipio"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label="Municipio"
                  placeholder={isLoadingMunicipalities ? "Cargando..." : "Seleccionar provincia primero"}
                  options={municipalities}
                  value={field.value || ''}
                  onChange={(value) => {
                    field.onChange(value);
                    // Find municipality name from ID and update municipio field
                    const selectedMunicipality = municipalities.find(m => m.value === value);
                    if (selectedMunicipality) {
                      setValue('municipio', selectedMunicipality.label);
                    }
                  }}
                  error={errors.municipio?.message}
                />
              )}
            />

            {/* Sector */}
            <Controller
              name="sector"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label="Sector"
                  placeholder="Seleccionar municipio primero"
                  options={[{ value: '', label: 'Seleccionar municipio primero' }]}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.sector?.message}
                />
              )}
            />

            {/* Dirección Completa */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1 mx-1">
                Dirección Completa
              </label>
              <textarea
                {...register('direccion')}
                rows={2}
                className="w-full min-h-[44px] px-4 py-2 text-base border border-gray-300 rounded-lg bg-white transition-all duration-200 ease-in-out focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                placeholder="Dirección completa de residencia"
                maxLength={250}
              />
              {errors.direccion && (
                <div className="flex items-center gap-1 text-xs text-red-600 mt-1 mx-1" role="alert">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{errors.direccion.message}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Información Adicional */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Información Adicional</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Estado Civil */}
            <Controller
              name="estadoCivil"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label="Estado Civil"
                  placeholder="Seleccionar"
                  options={estadoCivilOptions}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.estadoCivil?.message}
                />
              )}
            />

            {/* Profesión */}
            <Controller
              name="profesion"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label="Profesión"
                  placeholder="Seleccionar"
                  options={profesionOptions}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.profesion?.message}
                />
              )}
            />
          </div>
        </div>

        {/* Información Médica y de Seguro */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6" style={{ borderLeft: '4px solid #2F80ED' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#2F80ED' }}>
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            Información Médica y de Seguro
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tipo de Sangre */}
            <Controller
              name="tipoSangre"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label="Tipo de Sangre"
                  placeholder="Seleccionar"
                  options={tipoSangreOptions}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.tipoSangre?.message}
                />
              )}
            />

            {/* Donante */}
            <Controller
              name="donante"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label="¿Es donante de órganos?"
                  placeholder="Seleccionar"
                  options={donanteOptions}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.donante?.message}
                />
              )}
            />

            {/* NSS */}
            <Input
              label="Número de Seguro Social (NSS)"
              type="text"
              placeholder="000-00000-0"
              registration={register('nss')}
              error={errors.nss?.message}
            />

            {/* Aseguradora */}
            <Controller
              name="aseguradora"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label="Aseguradora"
                  placeholder="Seleccionar"
                  options={aseguradoraOptions}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.aseguradora?.message}
                />
              )}
            />

            {/* Número de Contrato */}
            <Input
              label="Número de Contrato/Afiliación"
              type="text"
              placeholder="Número de contrato"
              registration={register('numeroContrato')}
              error={errors.numeroContrato?.message}
            />

            {/* Cédula del Titular */}
            <Input
              label="Cédula del Titular del Seguro"
              type="text"
              placeholder="000-0000000-0"
              registration={register('cedulaTitular')}
              error={errors.cedulaTitular?.message}
            />

            {/* Tipo de Paciente */}
            <Controller
              name="tipoPaciente"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label="Tipo de Paciente"
                  placeholder="Seleccionar"
                  options={tipoPacienteOptions}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.tipoPaciente?.message}
                />
              )}
            />
          </div>
        </div>

        {/* Contacto de Emergencia */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6" style={{ borderLeft: '4px solid #dc2626' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#dc2626' }}>
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.866-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            Contacto de Emergencia
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre del Contacto */}
            <Input
              label="Nombre Completo del Contacto"
              type="text"
              placeholder="Nombre del contacto de emergencia"
              registration={register('nombreEmergencia')}
              error={errors.nombreEmergencia?.message}
            />

            {/* Teléfono del Contacto */}
            <Input
              label="Teléfono del Contacto"
              type="tel"
              placeholder="(809) 123-4567"
              registration={register('telefonoEmergencia')}
              error={errors.telefonoEmergencia?.message}
            />

            {/* Relación */}
            <Controller
              name="relacionEmergencia"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label="Relación"
                  placeholder="Seleccionar"
                  options={relacionEmergenciaOptions}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.relacionEmergencia?.message}
                />
              )}
            />
          </div>
        </div>
      </form>

      {/* Fixed Action Buttons */}
      {isDirty && (
        <div className="fixed bottom-6 right-6 flex gap-3 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-50">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSaving}
            className="min-h-[44px] px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={isSaving}
            className="min-h-[44px] px-4 py-2 text-sm font-medium text-white rounded-lg hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex items-center gap-2 disabled:opacity-75 disabled:cursor-wait disabled:hover:translate-y-0"
            style={{ 
              backgroundColor: '#2CA66F',
            }}
            onMouseEnter={(e) => !isSaving && (e.currentTarget.style.backgroundColor = '#248456')}
            onMouseLeave={(e) => !isSaving && (e.currentTarget.style.backgroundColor = '#2CA66F')}
          >
            {isSaving ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePersonalInfoForm;
