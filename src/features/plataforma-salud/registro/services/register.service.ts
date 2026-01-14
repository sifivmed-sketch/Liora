import { API_BASE_URL, API_PATIENT_SEGMENT } from '@/lib/constants/api.constants';
import { useStationStore } from '@/lib/stores/station.store';

/**
 * Interface for the patient registration request
 * Based on the API documentation structure
 */
interface RegisterPatientRequest {
  /** Patient's email */
  email: string;
  /** Patient's password */
  clave: string;
}

/**
 * Interface for the patient registration response
 * Based on the API response structure
 */
interface RegisterPatientResponse {
  /** Response code (0 = success) */
  Codigo: number;
  /** Response message */
  Mensaje: string;
}

/**
 * Registers a new patient by calling the RegisterPatient endpoint
 * @param request - Patient registration data
 * @returns Promise with the registration response
 * @throws Error if the API call fails or station ID is not available
 */
export const registerPatient = async (
  request: RegisterPatientRequest
): Promise<RegisterPatientResponse> => {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not configured');
  }

  // Get station ID from Zustand store
  const stationId = useStationStore.getState().idUnico;
  
  if (!stationId) {
    throw new Error('Station ID is not available. Please ensure the station is initialized.');
  }

  const endpoint = `${API_BASE_URL}/${API_PATIENT_SEGMENT}/RegistrarUsuarios`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'equipo': stationId,
      },
      body: JSON.stringify(request),
    });

    // Try to parse JSON response regardless of status
    let data: RegisterPatientResponse;
    try {
      data = await response.json();
    } catch {
      // If JSON parsing fails, throw HTTP error
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // If response is not ok but we have valid JSON, return it
    // The API might return error messages in JSON format even with non-200 status
    if (!response.ok) {
      return data; // Return the error response from API
    }

    return data;
  } catch (error) {
    // If it's a network/HTTP error, throw it as is
    if (error instanceof Error && error.message.includes('HTTP error')) {
      throw error;
    }
    
    // For other errors (like JSON parsing), wrap them
    if (error instanceof Error) {
      throw new Error(`Failed to register patient: ${error.message}`);
    }
    throw new Error('Unknown error occurred while registering patient');
  }
};

/**
 * Validates if the registration response indicates success
 * @param response - The registration response to validate
 * @returns True if registration was successful, false otherwise
 */
export const isRegistrationSuccessful = (response: RegisterPatientResponse): boolean => {
  return response.Codigo === 0;
};

/**
 * Gets a user-friendly error message from the registration response
 * @param response - The registration response
 * @returns User-friendly error message or null if successful
 */
export const getRegistrationErrorMessage = (response: RegisterPatientResponse): string | null => {
  if (isRegistrationSuccessful(response)) {
    return null;
  }
  
  // Return the message from the API or a generic error message
  return response.Mensaje || 'Registration failed. Please try again.';
};


// Export types for use in components
export type { RegisterPatientRequest, RegisterPatientResponse };
