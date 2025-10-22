import { API_BASE_URL, API_GENERAL_SEGMENT } from '../constants/api.constants';
import { useStationStore } from '../stores/station.store';

/**
 * Interface for the exequatur validation response
 * Based on the API response structure from the first image
 */
export interface ExequaturValidationResponse {
  /** Response code (0 = success) */
  Codigo: number;
  /** Response message */
  Mensaje: string;
  /** Doctor's full name from the exequatur */
  Nombre: string;
  /** University graduation date */
  Fecha_Universidad: string;
  /** Decree number */
  Numero_Decreto: string;
  /** Decree date */
  Fecha_Decreto: string;
  /** Registration number */
  Numero_Registro: string;
  /** Registration date */
  Fecha_Registro: string;
  /** University name */
  Universidad: string;
  /** Profession code */
  Codigo_Profesion: string;
  /** Profession name */
  Profesion: string;
  /** Folio number */
  Folio: string;
  /** Book letter */
  Libro: string;
}

/**
 * Interface for the exequatur validation request
 */
export interface ExequaturValidationRequest {
  /** The exequatur number to validate */
  exequatur: string;
}

/**
 * Validates an exequatur by calling the ConsultaExequatur endpoint
 * @param request - Exequatur validation data
 * @returns Promise with the exequatur validation response
 * @throws Error if the API call fails or station ID is not available
 */
export const validateExequatur = async (
  request: ExequaturValidationRequest
): Promise<ExequaturValidationResponse> => {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not configured');
  }

  // Get station ID from Zustand store
  const stationId = useStationStore.getState().idUnico;
  
  if (!stationId) {
    throw new Error('Station ID is not available. Please ensure the station is initialized.');
  }

  const endpoint = `${API_BASE_URL}/${API_GENERAL_SEGMENT}/ConsultaExequatur`;

  try {
    // Create URL with query parameters
    const url = new URL(endpoint);
    url.searchParams.append('exequatur', request.exequatur);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'equipo': stationId,
      },
    });

    // Try to parse JSON response regardless of status
    let data: ExequaturValidationResponse;
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
      throw new Error(`Failed to validate exequatur: ${error.message}`);
    }
    throw new Error('Unknown error occurred while validating exequatur');
  }
};

/**
 * Validates if the exequatur validation response indicates success
 * @param response - The exequatur validation response to validate
 * @returns True if exequatur is valid, false otherwise
 */
export const isExequaturValid = (response: ExequaturValidationResponse): boolean => {
  return response.Codigo === 0;
};

/**
 * Validates if the name from exequatur matches the form data
 * @param exequaturName - The name from the exequatur response
 * @param formName - The first name from the form
 * @param formLastName - The last name from the form
 * @returns True if names match (case-insensitive), false otherwise
 */
export const validateNameMatch = (
  exequaturName: string,
  formName: string,
  formLastName: string
): boolean => {
  // Normalize names: convert to lowercase, trim, and replace multiple spaces with single space
  const normalizeName = (name: string) => 
    name.toLowerCase().trim().replace(/\s+/g, ' ');
  
  const exequaturNameNormalized = normalizeName(exequaturName);
  const formFullNameNormalized = normalizeName(`${formName} ${formLastName}`);
  
  return exequaturNameNormalized === formFullNameNormalized;
};

/**
 * Gets a user-friendly error message from the exequatur validation response
 * @param response - The exequatur validation response
 * @returns User-friendly error message or null if successful
 */
export const getExequaturErrorMessage = (response: ExequaturValidationResponse): string | null => {
  if (isExequaturValid(response)) {
    return null;
  }
  
  // Return the message from the API or a generic error message
  return response.Mensaje || 'Exequatur validation failed. Please check the number and try again.';
};
