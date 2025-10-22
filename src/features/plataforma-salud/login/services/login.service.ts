import { API_BASE_URL, API_PATIENT_SEGMENT } from '@/lib/constants/api.constants';

/**
 * Interface for the patient login request
 * Based on the API documentation structure
 */
interface LoginPatientRequest {
  /** Patient's username/email */
  usuario: string;
  /** Patient's password */
  clave: string;
  /** Station/equipment identifier */
  equipo: string;
}

/**
 * Interface for the patient login response
 * Based on the API response structure
 */
interface LoginPatientResponse {
  /** Response code (0 = success) */
  Codigo: number;
  /** Response message */
  Mensaje: string;
  /** User ID */
  Id_Usuario: string;
  /** Session ID */
  Id_Sesion: string;
  /** User first name */
  Nombre: string;
  /** User last name */
  Apellidos: string;
  /** User email */
  Email: string;
  /** Account creation date */
  Fecha_Creacion: string;
  /** Last access date */
  Fecha_Ultimo_Acceso: string;
}

/**
 * Authenticates a patient by calling the LoginUsuarios endpoint
 * @param request - Patient login credentials including station ID
 * @returns Promise with the login response
 * @throws Error if the API call fails
 */
export const loginPatient = async (
  request: LoginPatientRequest
): Promise<LoginPatientResponse> => {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not configured');
  }

  // Build the URL with query parameters
  const url = new URL(`${API_BASE_URL}/${API_PATIENT_SEGMENT}/LoginUsuarios`);
  url.searchParams.append('usuario', request.usuario);
  url.searchParams.append('clave', request.clave);


  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'equipo': request.equipo,
      },
    });

    // Try to parse JSON response regardless of status
    let data: LoginPatientResponse;
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
      throw new Error(`Failed to login patient: ${error.message}`);
    }
    throw new Error('Unknown error occurred while logging in patient');
  }
};

/**
 * Validates if the login response indicates success
 * @param response - The login response to validate
 * @returns True if login was successful, false otherwise
 */
export const isLoginSuccessful = (response: LoginPatientResponse): boolean => {
  return response.Codigo === 0;
};

/**
 * Gets a user-friendly error message from the login response
 * @param response - The login response
 * @returns User-friendly error message or null if successful
 */
export const getLoginErrorMessage = (response: LoginPatientResponse): string | null => {
  if (isLoginSuccessful(response)) {
    return null;
  }
  
  // Return the message from the API or a generic error message
  return response.Mensaje || 'Login failed. Please try again.';
};

// Export types for use in components
export type { LoginPatientRequest, LoginPatientResponse };
