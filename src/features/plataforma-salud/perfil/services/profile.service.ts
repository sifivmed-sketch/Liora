import { API_BASE_URL, API_PATIENT_SEGMENT } from '@/lib/constants/api.constants';
import { useStationStore } from '@/lib/stores/station.store';

/**
 * Interface for the patient profile data from API
 * Based on the ConsultaFormularioIdentificacionContacto endpoint
 */
export interface PatientProfileData {
  Codigo: number;
  Mensaje: string;
  IdPaciente: number | null;
  Cedula: string | null;
  Nombre1: string | null;
  Nombre2: string | null;
  Apellido1: string | null;
  Apellido2: string | null;
  Fecha_Nacimiento: string | null;
  Email: string | null;
  Telefono1: string | null;
  Telefono2: string | null;
  TipoRegistro: string | null;
}

/**
 * Fetches the patient profile data from the API
 * @param token - The authentication token
 * @param idPaciente - The patient ID from the session
 * @returns Promise with the profile data
 * @throws Error if the API call fails
 */
export const fetchPatientProfile = async (
  token: string,
  idPaciente: string
): Promise<PatientProfileData> => {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not configured');
  }

  // Get station ID from Zustand store
  const stationId = useStationStore.getState().idUnico;
  
  if (!stationId) {
    throw new Error('Station ID is not available. Please ensure the station is initialized.');
  }

  // Add idPaciente as query parameter
  const endpoint = `${API_BASE_URL}/${API_PATIENT_SEGMENT}/ConsultaFormularioIdentificacionContacto?idPaciente=${encodeURIComponent(idPaciente)}`;

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'equipo': stationId,
        'Authorization': `Bearer ${token}`,
      },
    });

    // If 404, return empty data (patient profile not found yet)
    if (response.status === 404) {
      return {
        Codigo: 0,
        Mensaje: 'Perfil no encontrado',
        IdPaciente: null,
        Cedula: null,
        Nombre1: null,
        Nombre2: null,
        Apellido1: null,
        Apellido2: null,
        Fecha_Nacimiento: null,
        Email: null,
        Telefono1: null,
        Telefono2: null,
        TipoRegistro: null,
      };
    }

    let data: PatientProfileData;
    try {
      data = await response.json();
    } catch {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.ok) {
      return data;
    }

    return data;
  } catch (error) {
    if (error instanceof Error && error.message.includes('HTTP error')) {
      throw error;
    }
    
    if (error instanceof Error) {
      throw new Error(`Failed to fetch patient profile: ${error.message}`);
    }
    throw new Error('Unknown error occurred while fetching patient profile');
  }
};

/**
 * Validates if the profile response indicates success
 * @param response - The profile response to validate
 * @returns True if fetch was successful, false otherwise
 */
export const isProfileFetchSuccessful = (response: PatientProfileData): boolean => {
  return response.Codigo === 0;
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
  
  return response.Mensaje || 'Failed to fetch profile. Please try again.';
};

// Export types for use in components
export type { PatientProfileData as ProfileData };

