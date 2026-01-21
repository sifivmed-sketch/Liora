'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import Input from '@/components/Input';
import CustomSelect, { SelectOption } from '@/components/Select';
import { formatIdentityCard, handleIdentityCardKeyDown } from '@/lib/utils/identity.utils';

interface MedicalProfileFormData {
  // Información Personal
  govid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // Credenciales Profesionales
  licenseNumber: string;
  specialty: string;
  licenseType: string;
  yearsOfPractice: string;
  // Centros de Trabajo
  selectedCenters: string[];
}

interface MedicalCenter {
  id: string;
  name: string;
  type: string;
  location: string;
  services: string[];
}

interface ProfileCompletion {
  percentage: number;
  missingCredentials: string[];
  hasIncompleteCredentials: boolean;
  hasNoCenters: boolean;
}

/**
 * Medical Profile Content Component
 * Displays and manages medical professional profile information
 * 
 * @param userId - User ID for localStorage key
 * @param userName - Logged-in user's display name used as fallback for the profile card
 * @returns JSX element with medical profile form
 */
const MedicalProfileContent = ({ userId, userName }: { userId: string; userName: string }) => {
  const t = useTranslations('portal-medico.profile');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState<ProfileCompletion>({
    percentage: 0,
    missingCredentials: [],
    hasIncompleteCredentials: false,
    hasNoCenters: false,
  });
  const [selectedCenters, setSelectedCenters] = useState<MedicalCenter[]>([]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm<MedicalProfileFormData>({
    defaultValues: {
      govid: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      licenseNumber: '',
      specialty: '',
      licenseType: '',
      yearsOfPractice: '',
      selectedCenters: [],
    },
  });

  // Available medical centers (mock data - should come from API)
  const availableCenters: MedicalCenter[] = useMemo(() => [
    {
      id: 'hospital_central',
      name: 'Hospital Central Dr. Luis E. Aybar',
      type: 'Hospital Público',
      location: 'Santo Domingo',
      services: ['Emergencias', 'Cirugía', 'Medicina Interna'],
    },
    {
      id: 'clinica_abreu',
      name: 'Clínica Dr. Abel González',
      type: 'Clínica Privada',
      location: 'Santiago',
      services: ['Consulta Externa', 'Especialidades'],
    },
    {
      id: 'hospital_salvador',
      name: 'Hospital Salvador B. Gautier',
      type: 'Hospital Público',
      location: 'Santo Domingo',
      services: ['Pediatría', 'Ginecología', 'Cardiología'],
    },
    {
      id: 'centro_diagnostico',
      name: 'Centro de Diagnóstico y Medicina Avanzada',
      type: 'Centro Diagnóstico',
      location: 'Santo Domingo',
      services: ['Diagnóstico', 'Imagenología'],
    },
    {
      id: 'hospital_universitario',
      name: 'Hospital Universitario',
      type: 'Hospital Universitario',
      location: 'Santiago',
      services: ['Docencia', 'Investigación', 'Atención'],
    },
    {
      id: 'clinica_corominas',
      name: 'Clínica Corominas',
      type: 'Clínica Privada',
      location: 'La Vega',
      services: ['Consulta Externa', 'Cirugía Menor'],
    },
  ], []);

  /**
   * Gets display name for field
   * @param fieldId - Field identifier
   * @returns Display name for the field
   */
  const getFieldDisplayName = useCallback((fieldId: keyof MedicalProfileFormData): string | null => {
    const fieldNames: Record<string, string> = {
      licenseNumber: t('fields.license-number'),
      specialty: t('fields.specialty'),
      licenseType: t('fields.license-type'),
      yearsOfPractice: t('fields.years-of-practice'),
    };
    return fieldNames[fieldId] || null;
  }, [t]);

  /**
   * Calculates profile completion percentage
   * @param formData - Current form data
   * @returns Profile completion information
   */
  const calculateProfileCompletion = useCallback((formData: MedicalProfileFormData): ProfileCompletion => {
    const fields = {
      // Información personal (40% del total)
      personalInfo: {
        weight: 40,
        fields: ['govid', 'firstName', 'lastName', 'email', 'phone'] as (keyof MedicalProfileFormData)[],
      },
      // Credenciales profesionales (45% del total)
      credentials: {
        weight: 45,
        fields: ['licenseNumber', 'specialty', 'licenseType', 'yearsOfPractice'] as (keyof MedicalProfileFormData)[],
      },
      // Centros de trabajo (15% del total)
      workCenters: {
        weight: 15,
        hasActiveCenters: selectedCenters.length > 0,
      },
    };

    let totalCompletion = 0;
    const missingCredentials: string[] = [];

    // Verificar información personal
    const personalFields = fields.personalInfo.fields;
    let completedPersonal = 0;
    personalFields.forEach((fieldId) => {
      const field = formData[fieldId];
      if (field && String(field).trim() !== '') {
        completedPersonal++;
      }
    });
    const personalCompletion = (completedPersonal / personalFields.length) * fields.personalInfo.weight;
    totalCompletion += personalCompletion;

    // Verificar credenciales profesionales
    const credentialFields = fields.credentials.fields;
    let completedCredentials = 0;
    credentialFields.forEach((fieldId) => {
      const field = formData[fieldId];
      if (field && String(field).trim() !== '') {
        completedCredentials++;
      } else {
        const fieldName = getFieldDisplayName(fieldId);
        if (fieldName) {
          missingCredentials.push(fieldName);
        }
      }
    });
    const credentialsCompletion = (completedCredentials / credentialFields.length) * fields.credentials.weight;
    totalCompletion += credentialsCompletion;

    // Verificar centros de trabajo
    if (fields.workCenters.hasActiveCenters) {
      totalCompletion += fields.workCenters.weight;
    } else {
      missingCredentials.push(t('missing-work-center'));
    }

    return {
      percentage: Math.round(totalCompletion),
      missingCredentials,
      hasIncompleteCredentials: credentialsCompletion < fields.credentials.weight,
      hasNoCenters: !fields.workCenters.hasActiveCenters,
    };
  }, [selectedCenters, getFieldDisplayName, t]);

  // Watch form changes to update completion and set dirty state
  useEffect(() => {
    const subscription = watch((value) => {
      const formData = value as MedicalProfileFormData;
      // Include selected centers in form data for calculation
      formData.selectedCenters = selectedCenters.map((c) => c.id);
      const completion = calculateProfileCompletion(formData);
      setProfileCompletion(completion);
      // Set dirty state only on user changes
      setIsDirty(true);
    });
    return () => subscription.unsubscribe();
  }, [watch, selectedCenters, calculateProfileCompletion]);

  /**
   * Loads profile data from localStorage
   */
  useEffect(() => {
    const loadProfile = () => {
      try {
        setIsLoading(true);
        const key = `medical_profile_${userId}`;
        const saved = localStorage.getItem(key);

        if (saved) {
          const savedData: MedicalProfileFormData = JSON.parse(saved);
          
          // Restore form data
          reset(savedData);
          
          // Restore selected centers
          if (savedData.selectedCenters && savedData.selectedCenters.length > 0) {
            const centers = availableCenters.filter((center) =>
              savedData.selectedCenters.includes(center.id)
            );
            setSelectedCenters(centers);
          }
          
          // Calculate initial completion
          const completion = calculateProfileCompletion(savedData);
          setProfileCompletion(completion);
          
          setIsDirty(false);
        }
      } catch (error) {
        console.error('Error loading profile from localStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [userId, availableCenters, calculateProfileCompletion, reset]);

  /**
   * Handles form submission
   * @param data - Form data to save
   */
  const onSubmit = async (data: MedicalProfileFormData) => {
    try {
      setIsSaving(true);
      
      // Update selected centers in form data
      data.selectedCenters = selectedCenters.map((center) => center.id);
      
      // Save to localStorage
      const key = `medical_profile_${userId}`;
      localStorage.setItem(key, JSON.stringify(data));
      
      // Update completion
      const completion = calculateProfileCompletion(data);
      setProfileCompletion(completion);
      
      setIsDirty(false);
      
      // Show success message
      alert(t('save-success'));
    } catch (error) {
      console.error('Error saving profile:', error);
      alert(t('save-error'));
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Handles form cancellation
   */
  const handleCancel = () => {
    try {
      const key = `medical_profile_${userId}`;
      const saved = localStorage.getItem(key);
      
      if (saved) {
        const savedData: MedicalProfileFormData = JSON.parse(saved);
        reset(savedData);
        
        // Restore selected centers
        if (savedData.selectedCenters && savedData.selectedCenters.length > 0) {
          const centers = availableCenters.filter((center) =>
            savedData.selectedCenters.includes(center.id)
          );
          setSelectedCenters(centers);
        } else {
          setSelectedCenters([]);
        }
        
        // Recalculate completion
        const completion = calculateProfileCompletion(savedData);
        setProfileCompletion(completion);
      } else {
        reset();
        setSelectedCenters([]);
        setProfileCompletion({
          percentage: 0,
          missingCredentials: [],
          hasIncompleteCredentials: false,
          hasNoCenters: true,
        });
      }
      
      setIsDirty(false);
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      reset();
      setSelectedCenters([]);
      setIsDirty(false);
    }
  };

  /**
   * Handles adding a medical center
   * @param center - Medical center to add
   */
  const handleAddCenter = (center: MedicalCenter) => {
    if (!selectedCenters.some((c) => c.id === center.id)) {
      setSelectedCenters([...selectedCenters, center]);
      // Update form data
      const currentData = watch();
      setValue('selectedCenters', [...selectedCenters.map((c) => c.id), center.id]);
      
      // Mark as dirty
      setIsDirty(true);
      
      // Recalculate completion
      setTimeout(() => {
        const completion = calculateProfileCompletion({ ...currentData, selectedCenters: [...selectedCenters.map((c) => c.id), center.id] } as MedicalProfileFormData);
        setProfileCompletion(completion);
      }, 0);
    }
  };

  /**
   * Handles removing a medical center
   * @param centerId - ID of center to remove
   */
  const handleRemoveCenter = (centerId: string) => {
    const updated = selectedCenters.filter((c) => c.id !== centerId);
    setSelectedCenters(updated);
    
    // Update form data
    const currentData = watch();
    setValue('selectedCenters', updated.map((c) => c.id));
    
    // Mark as dirty
    setIsDirty(true);
    
    // Recalculate completion
    setTimeout(() => {
      const completion = calculateProfileCompletion({ ...currentData, selectedCenters: updated.map((c) => c.id) } as MedicalProfileFormData);
      setProfileCompletion(completion);
    }, 0);
  };

  /**
   * Builds initials from a full name (e.g., "Juan Perez" => "JP")
   * @param fullName - Full name to extract initials from
   * @returns Initials in uppercase, or empty string if it can't be derived
   */
  const getInitialsFromName = (fullName: string): string => {
    const cleaned = fullName.trim();
    if (!cleaned) return '';

    const parts = cleaned.split(/\s+/).filter(Boolean);
    if (!parts.length) return '';

    const first = parts[0]?.charAt(0) ?? '';
    const last = (parts.length > 1 ? parts[parts.length - 1] : parts[0])?.charAt(0) ?? '';

    return `${first}${last}`.toUpperCase();
  };

  // Get initials & display name for avatar card (prefer form data, fallback to session userName)
  const firstName = watch('firstName') || '';
  const lastName = watch('lastName') || '';

  const typedInitials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const fallbackInitials = getInitialsFromName(userName);
  const initials = typedInitials || fallbackInitials || 'DM';

  const typedDisplayName = `${firstName} ${lastName}`.trim();
  const displayName = typedDisplayName || userName || t('default-name');

  // Options for selects
  const specialtyOptions: SelectOption[] = [
    { value: '', label: t('select-placeholder') },
    { value: 'Cardiologia', label: t('specialties.cardiologia') },
    { value: 'Medicina_Interna', label: t('specialties.medicina-interna') },
    { value: 'Pediatria', label: t('specialties.pediatria') },
    { value: 'Ginecologia', label: t('specialties.ginecologia') },
    { value: 'Neurologia', label: t('specialties.neurologia') },
    { value: 'Traumatologia', label: t('specialties.traumatologia') },
  ];

  const licenseTypeOptions: SelectOption[] = [
    { value: '', label: t('select-placeholder') },
    { value: 'Exequatur', label: t('license-types.exequatur') },
    { value: 'Colegio_Medico', label: t('license-types.colegio-medico') },
    { value: 'Licencia_Especial', label: t('license-types.licencia-especial') },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">{t('loading')}</div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-100 overflow-y-auto">
      <div className="py-8 px-6">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                {t('title')}
              </h1>
              <p className="text-gray-600 text-sm lg:text-base">
                {t('description')}
              </p>
            </div>
            
            {/* Profile completion */}
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">{t('completion-label')}</div>
              <div className="text-lg font-semibold" style={{ color: '#2F80ED' }}>
                {profileCompletion.percentage}%
              </div>
              <div className="w-24 h-2 bg-gray-200 rounded-full ml-auto mt-1">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    backgroundColor:
                      profileCompletion.percentage < 50
                        ? '#dc2626'
                        : profileCompletion.percentage < 80
                        ? '#f59e0b'
                        : '#2F80ED',
                    width: `${profileCompletion.percentage}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Summary Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 text-center relative overflow-hidden" style={{ borderTop: '3px solid #2F80ED' }}>
                <div
                  className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #2F80ED 0%, #56CCF2 100%)',
                  }}
                >
                  {initials}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{displayName}</h3>
                <p className="text-gray-600 mb-4">{t('medical-specialist')}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{t('status')}:</span>
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800">
                      {t('status-active')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{t('plan')}:</span>
                    <span
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold text-white uppercase"
                      style={{
                        background: 'linear-gradient(135deg, #2F80ED 0%, #56CCF2 100%)',
                      }}
                    >
                      {t('plan-professional')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{t('last-access')}:</span>
                    <span className="text-gray-900">{t('today')}</span>
                  </div>
                </div>
                
                <button
                  type="button"
                  className="w-full mt-6 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  tabIndex={0}
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  {t('change-photo')}
                </button>
              </div>
            </div>

            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 relative overflow-hidden" style={{ borderTop: '3px solid #2F80ED' }}>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('sections.personal-info')}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Cédula */}
                  <div>
                    <label htmlFor="govid" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('fields.gov-id')} <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="govid"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="govid"
                          placeholder="123-4567890-1"
                          maxLength={13}
                          value={field.value}
                          onChange={(e) => {
                            const formatted = formatIdentityCard(e.target.value);
                            field.onChange(formatted);
                          }}
                          onKeyDown={handleIdentityCardKeyDown}
                          error={errors.govid?.message}
                          className="focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                    />
                    <div className="text-xs text-gray-500 mt-1">{t('fields.gov-id-format')}</div>
                  </div>
                  
                  {/* First Name */}
                  <Input
                    label={t('fields.first-name')}
                    required
                    registration={register('firstName')}
                    error={errors.firstName?.message}
                    className="focus:ring-2 focus:ring-blue-500"
                  />
                  
                  {/* Last Name */}
                  <Input
                    label={t('fields.last-name')}
                    required
                    registration={register('lastName')}
                    error={errors.lastName?.message}
                    className="focus:ring-2 focus:ring-blue-500"
                  />
                  
                  {/* Email */}
                  <Input
                    label={t('fields.email')}
                    type="email"
                    required
                    registration={register('email', {
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: t('fields.email-invalid'),
                      },
                    })}
                    error={errors.email?.message}
                    className="focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">{t('fields.email-note')}</p>
                  
                  {/* Phone */}
                  <Input
                    label={t('fields.phone')}
                    type="tel"
                    required
                    registration={register('phone')}
                    error={errors.phone?.message}
                    className="focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Professional Credentials */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 relative overflow-hidden" style={{ borderTop: '3px solid #2F80ED' }}>
                {/* Alert for incomplete credentials */}
                {profileCompletion.hasIncompleteCredentials && profileCompletion.missingCredentials.length > 0 && (
                  <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg mb-4">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                      </svg>
                      <div>
                        <h3 className="text-sm font-medium text-red-800">{t('alerts.incomplete-credentials-title')}</h3>
                        <p className="text-sm text-red-700 mt-1">{t('alerts.incomplete-credentials-description')}</p>
                        <ul className="text-sm text-red-700 mt-2 list-disc list-inside">
                          {profileCompletion.missingCredentials
                            .filter((cred) => cred !== t('missing-work-center'))
                            .map((cred, index) => (
                              <li key={index}>{cred}</li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                
                <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('sections.professional-credentials')}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* License Number */}
                  <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 rounded-lg p-3">
                    <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('fields.license-number')} <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="licenseNumber"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="licenseNumber"
                          value={field.value}
                          onChange={field.onChange}
                          error={errors.licenseNumber?.message}
                          className="focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                    />
                    <div className="flex items-center mt-2">
                      <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      <span className="text-sm text-green-700">{t('verified')}</span>
                    </div>
                  </div>

                  {/* Specialty */}
                  <Controller
                    name="specialty"
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        label={t('fields.specialty')}
                        required
                        options={specialtyOptions}
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.specialty?.message}
                      />
                    )}
                  />

                  {/* License Type */}
                  <Controller
                    name="licenseType"
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        label={t('fields.license-type')}
                        options={licenseTypeOptions}
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.licenseType?.message}
                      />
                    )}
                  />

                  {/* Years of Practice */}
                  <Input
                    label={t('fields.years-of-practice')}
                    type="number"
                    min="0"
                    max="50"
                    registration={register('yearsOfPractice')}
                    error={errors.yearsOfPractice?.message}
                    className="focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Medical Centers */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 relative overflow-hidden" style={{ borderTop: '3px solid #2F80ED' }}>
                {/* Alert for no work centers */}
                {profileCompletion.hasNoCenters && (
                  <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg mb-4">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                      </svg>
                      <div>
                        <h3 className="text-sm font-medium text-red-800">{t('alerts.no-centers-title')}</h3>
                        <p className="text-sm text-red-700 mt-1">{t('alerts.no-centers-description')}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('sections.work-centers')}</h2>
                
                {/* Available Centers */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t('available-centers')}
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {availableCenters.map((center) => {
                      const isSelected = selectedCenters.some((c) => c.id === center.id);
                      return (
                        <div
                          key={center.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? 'border-blue-300 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                          }`}
                          onClick={() => {
                            if (isSelected) {
                              handleRemoveCenter(center.id);
                            } else {
                              handleAddCenter(center);
                            }
                          }}
                          tabIndex={0}
                          role="button"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              if (isSelected) {
                                handleRemoveCenter(center.id);
                              } else {
                                handleAddCenter(center);
                              }
                            }
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => {
                                    if (isSelected) {
                                      handleRemoveCenter(center.id);
                                    } else {
                                      handleAddCenter(center);
                                    }
                                  }}
                                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                  style={{ accentColor: '#2F80ED' }}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <label className="ml-3 text-sm font-medium text-gray-900 cursor-pointer">
                                  {center.name}
                                </label>
                              </div>
                              <div className="ml-7">
                                <p className="text-xs text-gray-600 mb-1">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                    {center.type}
                                  </span>
                                  <span className="ml-2 text-gray-500">{center.location}</span>
                                </p>
                                <p className="text-xs text-gray-500">
                                  {center.services.slice(0, 2).join(', ')}
                                  {center.services.length > 2 ? '...' : ''}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Selected Centers */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">{t('selected-centers')}</h3>
                  {selectedCenters.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                      </svg>
                      <p>{t('no-centers-selected')}</p>
                      <p className="text-sm mt-1">{t('select-center-message')}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedCenters.map((center) => (
                        <div
                          key={center.id}
                          className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                        >
                          <div className="flex items-center flex-1">
                            <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" clipRule="evenodd"></path>
                            </svg>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 text-sm">{center.name}</p>
                              <p className="text-xs text-gray-600">
                                {center.type} • {center.location}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800">
                              {t('selected')}
                            </span>
                            <button
                              type="button"
                              className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                              onClick={() => handleRemoveCenter(center.id)}
                              aria-label={t('remove-center', { name: center.name })}
                              tabIndex={0}
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

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
              tabIndex={0}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              {t('cancel')}
            </button>
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isSaving}
              className="min-h-[44px] px-4 py-2 text-sm font-medium text-white rounded-lg hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#2F80ED' }}
              onMouseEnter={(e) => {
                if (!isSaving) {
                  e.currentTarget.style.backgroundColor = '#1d4ed8';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSaving) {
                  e.currentTarget.style.backgroundColor = '#2F80ED';
                }
              }}
              tabIndex={0}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t('saving')}
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {t('save')}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalProfileContent;
