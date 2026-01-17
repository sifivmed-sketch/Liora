'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Input from '@/components/Input';
import CustomSelect, { SelectOption } from '@/components/Select';
import { fetchPatientProfile, isProfileFetchSuccessful, getProfileErrorMessage } from '../services/profile.service';
import { formatIdentityCard, handleIdentityCardKeyDown } from '@/lib/utils/identity.utils';

interface ProfilePersonalInfoFormProps {
  token: string;
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
  provincia: string;
  municipio: string;
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
 * @param token - Authentication token for API calls
 * @param idPaciente - Patient ID from the session
 * @returns JSX element with personal information form
 */
const ProfilePersonalInfoForm = ({ token, idPaciente, onProgressChange }: ProfilePersonalInfoFormProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

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
      
      // Set dirty state only on user changes
      setIsDirty(true);
    });
    return () => subscription.unsubscribe();
  }, [watch, onProgressChange]);

  /**
   * Loads patient profile data from localStorage or API
   */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        setApiError(null);

        // Primero intentar cargar desde localStorage
        try {
          const key = `profile_${idPaciente}`;
          const saved = localStorage.getItem(key);
          
          if (saved) {
            const savedData: PersonalInfoFormData = JSON.parse(saved);
            // Si hay datos guardados en localStorage, usarlos
            console.log('Cargando datos desde localStorage');
            // Asegurar que el tipo de identificación esté establecido si hay cédula o pasaporte
            if (!savedData.tipoIdentificacion) {
              if (savedData.cedula) {
                savedData.tipoIdentificacion = 'Cedula';
                savedData.cedula = formatIdentityCard(savedData.cedula.replace(/\D/g, ''));
              } else if (savedData.pasaporte) {
                savedData.tipoIdentificacion = 'Pasaporte';
              }
            }
            reset(savedData);
            setIsDirty(false);
            
            // Calculate and notify initial progress
            const progress = calculateProgress(savedData);
            if (onProgressChange) {
              onProgressChange(progress);
            }
            
            setIsLoading(false);
            return;
          }
        } catch (localStorageError) {
          console.error('Error al cargar desde localStorage:', localStorageError);
        }

        // Si no hay datos en localStorage, intentar cargar desde la API
        console.log('Cargando datos desde API');
        const response = await fetchPatientProfile(token, idPaciente);

        if (isProfileFetchSuccessful(response)) {
          // Populate form with API data
          const cedulaValue = response.Cedula || '';
          const apiData: Partial<PersonalInfoFormData> = {
            nombre: response.Nombre1 || '',
            apellidos: `${response.Apellido1 || ''} ${response.Apellido2 || ''}`.trim(),
            tipoIdentificacion: cedulaValue ? 'Cedula' : '',
            cedula: cedulaValue ? formatIdentityCard(cedulaValue) : '',
            pasaporte: '',
            email: response.Email || '',
            telefonoPrincipal: response.Telefono1 || '',
            fechaNacimiento: response.Fecha_Nacimiento || '',
          };
          reset(apiData as PersonalInfoFormData);
          setIsDirty(false);
          
          // Calculate and notify initial progress
          const progress = calculateProgress(apiData as PersonalInfoFormData);
          if (onProgressChange) {
            onProgressChange(progress);
          }
          
          // Nota: El resto de campos no vienen del API, quedarán vacíos
        } else {
          const errorMessage = getProfileErrorMessage(response);
          setApiError(errorMessage || 'Error al cargar el perfil');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error inesperado al cargar el perfil';
        setApiError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, idPaciente]);

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
    
    // Reload data from localStorage or API
    try {
      const key = `profile_${idPaciente}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        const savedData: PersonalInfoFormData = JSON.parse(saved);
        // Usar reset() para revertir los cambios y resetear el estado dirty
        reset(savedData);
      } else {
        // Si no hay datos guardados, resetear a los valores por defecto
        reset();
      }
    } catch (error) {
      console.error('Error al cargar desde localStorage:', error);
      reset();
    }
    
    setIsDirty(false);
  };

  /**
   * Handles form submission
   * @param data - Form data to save
   */
  const onSubmit = (data: PersonalInfoFormData) => {
    console.log('Datos del formulario:', {
      seccion: 'Todas las secciones',
      datos: data
    });
    
    // Guardar en localStorage
    try {
      const key = `profile_${idPaciente}`;
      localStorage.setItem(key, JSON.stringify(data));
      console.log('Datos guardados en localStorage:', { key, data });
      
      setIsDirty(false);
      
      // Mostrar mensaje de éxito
      alert('Perfil guardado exitosamente');
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
      alert('Error al guardar el perfil');
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

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center p-8">
          <div className="text-gray-600">Cargando información...</div>
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
              name="provincia"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label="Provincia"
                  placeholder="Seleccionar"
                  options={[{ value: '', label: 'Seleccionar' }]}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.provincia?.message}
                />
              )}
            />

            {/* Municipio */}
            <Controller
              name="municipio"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label="Municipio"
                  placeholder="Seleccionar provincia primero"
                  options={[{ value: '', label: 'Seleccionar provincia primero' }]}
                  value={field.value}
                  onChange={field.onChange}
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
            className="min-h-[44px] px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            className="min-h-[44px] px-4 py-2 text-sm font-medium text-white rounded-lg hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex items-center gap-2"
            style={{ 
              backgroundColor: '#2CA66F',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#248456'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2CA66F'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Guardar Cambios
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePersonalInfoForm;
