import { API_BASE_URL, API_PATIENT_SEGMENT, API_GENERAL_SEGMENT } from '@/lib/constants/api.constants';
import { useStationStore } from '@/lib/stores/station.store';

/**
 * Interface for the patient identification and contact data from API
 * Based on the ConsultaFormularioIdentificacionContacto endpoint
 */
export interface PatientIdentificationContactData {
  Codigo: number;
  Mensaje: string;
  IdPaciente: string;
  Cedula: string;
  Nombre1: string;
  Nombre2: string;
  Apellido1: string;
  Apellido2: string;
  Fecha_Nacimiento: string;
  Email: string;
  Telefono1: string;
  Telefono2: string;
  TipoRegistro: string;
  Foto: string;
}

/**
 * Interface for the patient location and personal information data from API
 * Based on the ConsultaFormularioLocalizacionInformacionPersonal endpoint
 */
export interface PatientLocationPersonalData {
  Codigo: number;
  Mensaje: string;
  IdPaciente: string;
  Sexo: string;
  IdNacionalidad: number;
  Nacionalidad: string;
  Estado_Civil: string;
  Profesion: string;
  Direccion: string;
  Sector: string;
  IdMunicipio: string;
  Municipio: string;
  IdProvincia: string;
  Provincia: string;
}

/**
 * Interface for the patient medical information data from API
 * Based on the ConsultaFormularioInformacionMedica endpoint
 */
export interface PatientMedicalInfoData {
  Codigo: number;
  Mensaje: string;
  IdPaciente: string;
  Nss: string;
  IdAseguradora: number;
  Aseguradora: string;
  Tipo_Sangre: string;
  Donante: boolean;
}

/**
 * Combined patient profile data
 */
export interface PatientProfileData {
  identification: PatientIdentificationContactData | null;
  location: PatientLocationPersonalData | null;
  medical: PatientMedicalInfoData | null;
}

/**
 * Fetches patient identification and contact data from the API
 * @param sessionId - The session ID from login (not used in GET endpoints)
 * @param idPaciente - The patient ID from the session
 * @returns Promise with the identification and contact data
 */
export const fetchPatientIdentificationContact = async (
  sessionId: string,
  idPaciente: string
): Promise<PatientIdentificationContactData | null> => {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not configured');
  }

  const stationId = useStationStore.getState().idUnico;
  
  if (!stationId) {
    throw new Error('Station ID is not available. Please ensure the station is initialized.');
  }

  const endpoint = `${API_BASE_URL}/${API_PATIENT_SEGMENT}/ConsultaFormularioIdentificacionContacto?idPaciente=${encodeURIComponent(idPaciente)}`;

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'equipo': stationId,
      },
    });

    // 404 is normal - means no data saved yet for this section
    if (response.status === 404) {
      console.log('No se encontró información de identificación (404 - aún no guardada)');
      return null;
    }

    const data: PatientIdentificationContactData = await response.json();
    
    // API returns Codigo: 0 for success
    if (data.Codigo === 0) {
      return data;
    }
    
    console.log('Respuesta de identificación no exitosa:', data);
    return null;
  } catch (error) {
    console.error('Error fetching identification contact data:', error);
    return null;
  }
};

/**
 * Fetches patient location and personal information data from the API
 * @param sessionId - The session ID from login (not used in GET endpoints)
 * @param idPaciente - The patient ID from the session
 * @returns Promise with the location and personal information data
 */
export const fetchPatientLocationPersonal = async (
  sessionId: string,
  idPaciente: string
): Promise<PatientLocationPersonalData | null> => {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not configured');
  }

  const stationId = useStationStore.getState().idUnico;
  
  if (!stationId) {
    throw new Error('Station ID is not available. Please ensure the station is initialized.');
  }

  const endpoint = `${API_BASE_URL}/${API_PATIENT_SEGMENT}/ConsultaFormularioLocalizacionInformacionPersonal?idPaciente=${encodeURIComponent(idPaciente)}`;

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'equipo': stationId,
      },
    });

    // 404 is normal - means no data saved yet for this section
    if (response.status === 404) {
      console.log('No se encontró información de ubicación (404 - aún no guardada)');
      return null;
    }

    const data: PatientLocationPersonalData = await response.json();
    
    // API returns Codigo: 0 for success
    if (data.Codigo === 0) {
      return data;
    }
    
    console.log('Respuesta de ubicación no exitosa:', data);
    return null;
  } catch (error) {
    console.error('Error fetching location personal data:', error);
    return null;
  }
};

/**
 * Fetches patient medical information data from the API
 * @param sessionId - The session ID from login (not used in GET endpoints)
 * @param idPaciente - The patient ID from the session
 * @returns Promise with the medical information data
 */
export const fetchPatientMedicalInfo = async (
  sessionId: string,
  idPaciente: string
): Promise<PatientMedicalInfoData | null> => {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not configured');
  }

  const stationId = useStationStore.getState().idUnico;
  
  if (!stationId) {
    throw new Error('Station ID is not available. Please ensure the station is initialized.');
  }

  const endpoint = `${API_BASE_URL}/${API_PATIENT_SEGMENT}/ConsultaFormularioInformacionMedica?idPaciente=${encodeURIComponent(idPaciente)}`;

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'equipo': stationId,
      },
    });

    // 404 is normal - means no data saved yet for this section
    if (response.status === 404) {
      console.log('No se encontró información médica (404 - aún no guardada)');
      return null;
    }

    const data: PatientMedicalInfoData = await response.json();
    
    // API returns Codigo: 0 for success
    if (data.Codigo === 0) {
      return data;
    }
    
    console.log('Respuesta de información médica no exitosa:', data);
    return null;
  } catch (error) {
    console.error('Error fetching medical info data:', error);
    return null;
  }
};

/**
 * Fetches the complete patient profile data from all API endpoints
 * @param sessionId - The session ID from login
 * @param idPaciente - The patient ID from the session
 * @returns Promise with the complete profile data
 */
export const fetchPatientProfile = async (
  sessionId: string,
  idPaciente: string
): Promise<PatientProfileData> => {
  const [identification, location, medical] = await Promise.all([
    fetchPatientIdentificationContact(sessionId, idPaciente),
    fetchPatientLocationPersonal(sessionId, idPaciente),
    fetchPatientMedicalInfo(sessionId, idPaciente),
  ]);

  return {
    identification,
    location,
    medical,
  };
};

/**
 * Saves patient identification and contact data to the API
 * @param sessionId - The session ID from login
 * @param data - The identification and contact data to save
 * @returns Promise with the response
 */
export const savePatientIdentificationContact = async (
  sessionId: string,
  data: {
    usuario: string;
    cedula: string;
    nombre1: string;
    nombre2: string;
    apellido1: string;
    apellido2: string;
    fechaNacimiento: string;
    email: string;
    telefono1: string;
    telefono2: string;
    tipoRegistro: string;
  }
): Promise<{ Codigo: number; Mensaje: string }> => {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not configured');
  }

  const stationId = useStationStore.getState().idUnico;
  
  if (!stationId) {
    throw new Error('Station ID is not available. Please ensure the station is initialized.');
  }

  const endpoint = `${API_BASE_URL}/${API_PATIENT_SEGMENT}/RegistrarFormularioIdentificacionContacto`;

  console.log('=== savePatientIdentificationContact ===');
  console.log('sessionId:', sessionId);
  console.log('stationId:', stationId);
  console.log('endpoint:', endpoint);
  console.log('data:', data);

  try {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'equipo': stationId,
      'id_sesion': sessionId,
    };
    
    console.log('headers:', headers);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log('response:', result);
    return result;
  } catch (error) {
    console.error('Error saving identification contact data:', error);
    throw error;
  }
};

/**
 * Saves patient location and personal information data to the API
 * @param sessionId - The session ID from login
 * @param data - The location and personal information data to save
 * @returns Promise with the response
 */
export const savePatientLocationPersonal = async (
  sessionId: string,
  data: {
    usuario: string;
    sexo: string;
    nacionalidad: number;
    estadoCivil: string;
    profesion: string;
    direccion: string;
    sector: string;
    municipio: string;
    provincia: string;
  }
): Promise<{ Codigo: number; Mensaje: string }> => {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not configured');
  }

  const stationId = useStationStore.getState().idUnico;
  
  if (!stationId) {
    throw new Error('Station ID is not available. Please ensure the station is initialized.');
  }

  const endpoint = `${API_BASE_URL}/${API_PATIENT_SEGMENT}/RegistrarFormularioLocalizacionInformacionPersonal`;

  console.log('=== savePatientLocationPersonal ===');
  console.log('sessionId:', sessionId);
  console.log('stationId:', stationId);
  console.log('endpoint:', endpoint);
  console.log('data:', data);

  try {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'equipo': stationId,
      'id_sesion': sessionId,
    };
    
    console.log('headers:', headers);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log('response:', result);
    return result;
  } catch (error) {
    console.error('Error saving location personal data:', error);
    throw error;
  }
};

/**
 * Saves patient medical information data to the API
 * @param sessionId - The session ID from login
 * @param data - The medical information data to save
 * @returns Promise with the response
 */
export const savePatientMedicalInfo = async (
  sessionId: string,
  data: {
    usuario: string;
    nss: string;
    aseguradora: number;
    tipoSangre: string;
    donante: number;
  }
): Promise<{ Codigo: number; Mensaje: string }> => {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not configured');
  }

  const stationId = useStationStore.getState().idUnico;
  
  if (!stationId) {
    throw new Error('Station ID is not available. Please ensure the station is initialized.');
  }

  const endpoint = `${API_BASE_URL}/${API_PATIENT_SEGMENT}/RegistrarFormularioInformacionMedica`;

  console.log('=== savePatientMedicalInfo ===');
  console.log('sessionId:', sessionId);
  console.log('stationId:', stationId);
  console.log('endpoint:', endpoint);
  console.log('data:', data);

  try {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'equipo': stationId,
      'id_sesion': sessionId,
    };
    
    console.log('headers:', headers);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log('response:', result);
    return result;
  } catch (error) {
    console.error('Error saving medical info data:', error);
    throw error;
  }
};

/**
 * Validates if the profile response indicates success
 * @param response - The profile response to validate
 * @returns True if fetch was successful, false otherwise
 */
export const isProfileFetchSuccessful = (response: PatientProfileData): boolean => {
  return !!(response.identification || response.location || response.medical);
};

/**
 * Gets a user-friendly error message from the profile response
 * @param response - The profile response
 * @returns User-friendly error message or null if successful
 */
export const getProfileErrorMessage = (response: PatientProfileData): string | null => {
  if (isProfileFetchSuccessful(response)) {
    return null;
  }
  
  return 'No se pudo cargar el perfil. Por favor, intenta de nuevo.';
};

// Export types for use in components
export type { PatientProfileData as ProfileData };

/**
 * Interface for province/municipality data from API
 */
export interface LocationOption {
  Id: string;
  Nombre: string;
}

/**
 * Interface for provinces/municipalities API response
 */
export interface LocationResponse {
  Codigo: number;
  Mensaje: string;
  Data: LocationOption[];
}

/**
 * Fetches all provinces from the API
 * @returns Promise with array of provinces
 */
export const fetchProvinces = async (): Promise<LocationOption[]> => {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not configured');
  }

  const stationId = useStationStore.getState().idUnico;
  
  if (!stationId) {
    throw new Error('Station ID is not available. Please ensure the station is initialized.');
  }

  const endpoint = `${API_BASE_URL}/${API_GENERAL_SEGMENT}/ConsultaProvincias`;

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'equipo': stationId,
      },
    });

    if (response.status === 404) {
      return [];
    }

    const data: LocationResponse = await response.json();
    
    if (data.Codigo === 0 && data.Data) {
      return data.Data;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching provinces:', error);
    return [];
  }
};

/**
 * Fetches municipalities for a specific province
 * @param idProvincia - Province ID
 * @returns Promise with array of municipalities
 */
export const fetchMunicipalities = async (idProvincia: string): Promise<LocationOption[]> => {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not configured');
  }

  if (!idProvincia) {
    return [];
  }

  const stationId = useStationStore.getState().idUnico;
  
  if (!stationId) {
    throw new Error('Station ID is not available. Please ensure the station is initialized.');
  }

  const endpoint = `${API_BASE_URL}/${API_GENERAL_SEGMENT}/ConsultaMunicipiosProvincia?id_provincia=${encodeURIComponent(idProvincia)}`;

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'equipo': stationId,
      },
    });

    if (response.status === 404) {
      return [];
    }

    const data: LocationResponse = await response.json();
    
    if (data.Codigo === 0 && data.Data) {
      return data.Data;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching municipalities:', error);
    return [];
  }
};
