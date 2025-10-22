import { API_BASE_URL, API_MEDICAL_SEGMENT } from '@/lib/constants/api.constants';
import { useStationStore } from '@/lib/stores/station.store';
import { 
  validateExequatur, 
  isExequaturValid, 
  validateNameMatch, 
  getExequaturErrorMessage,
  type ExequaturValidationResponse 
} from '@/lib/api/exequatur.api';

/**
 * Interface for the medical doctor registration request
 * Based on the API documentation structure from the second image
 */
export interface RegisterDoctorRequest {
  /** Doctor's username */
  usuario: string;
  /** Doctor's password */
  clave: string;
  /** Doctor's first name */
  nombre: string;
  /** Doctor's last name */
  apellidos: string;
  /** Doctor's email */
  email: string;
  /** Doctor's phone number */
  telefono: string;
  /** Doctor's exequatur number */
  exequatur: string;
}

/**
 * Interface for the medical doctor registration response
 * Based on the API response structure (same as plataforma-salud)
 */
export interface RegisterDoctorResponse {
  /** Response code (0 = success) */
  Codigo: number;
  /** Response message */
  Mensaje: string;
}

/**
 * Interface for the complete registration process result
 * Includes both exequatur validation and registration results
 */
export interface DoctorRegistrationResult {
  /** Whether the entire process was successful */
  success: boolean;
  /** Exequatur validation response */
  exequaturValidation?: ExequaturValidationResponse;
  /** Registration response */
  registrationResponse?: RegisterDoctorResponse;
  /** Error message if any step failed */
  errorMessage?: string;
  /** Step that failed (if any) */
  failedStep?: 'exequatur-validation' | 'name-mismatch' | 'registration';
}

/**
 * Registers a new medical doctor with two-step validation process:
 * 1. Validates the exequatur
 * 2. If valid and name matches, proceeds with registration
 * @param request - Doctor registration data
 * @returns Promise with the complete registration result
 * @throws Error if the API call fails or station ID is not available
 */
export const registerDoctor = async (
  request: RegisterDoctorRequest
): Promise<DoctorRegistrationResult> => {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not configured');
  }

  // Get station ID from Zustand store
  const stationId = useStationStore.getState().idUnico;
  
  if (!stationId) {
    throw new Error('Station ID is not available. Please ensure the station is initialized.');
  }

  try {
    // Step 1: Validate exequatur
    const exequaturValidation = await validateExequatur({
      exequatur: request.exequatur
    });

    // Check if exequatur is valid (codigo 0)
    if (!isExequaturValid(exequaturValidation)) {
      return {
        success: false,
        exequaturValidation,
        failedStep: 'exequatur-validation',
        errorMessage: getExequaturErrorMessage(exequaturValidation) || undefined
      };
    }

    // Step 2: Validate name match
    const nameMatches = validateNameMatch(
      exequaturValidation.Nombre,
      request.nombre,
      request.apellidos
    );

    if (!nameMatches) {
      return {
        success: false,
        exequaturValidation,
        failedStep: 'name-mismatch',
        errorMessage: 'The name and last name do not match the exequatur information. Please verify your information.'
      };
    }

    // Step 3: Proceed with registration
    const registrationResponse = await registerDoctorUser(request, stationId);

    return {
      success: isRegistrationSuccessful(registrationResponse),
      exequaturValidation,
      registrationResponse,
      errorMessage: isRegistrationSuccessful(registrationResponse) 
        ? undefined 
        : (getRegistrationErrorMessage(registrationResponse) || undefined)
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred during registration';
    
    return {
      success: false,
      failedStep: 'registration',
      errorMessage
    };
  }
};

/**
 * Registers a new medical doctor by calling the RegistrarUsuarios endpoint
 * @param request - Doctor registration data
 * @param stationId - Station ID for the request
 * @returns Promise with the registration response
 * @throws Error if the API call fails
 */
const registerDoctorUser = async (
  request: RegisterDoctorRequest,
  stationId: string
): Promise<RegisterDoctorResponse> => {
  const endpoint = `${API_BASE_URL}/${API_MEDICAL_SEGMENT}/RegistrarUsuarios`;

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
    let data: RegisterDoctorResponse;
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
      throw new Error(`Failed to register doctor: ${error.message}`);
    }
    throw new Error('Unknown error occurred while registering doctor');
  }
};

/**
 * Validates if the registration response indicates success
 * @param response - The registration response to validate
 * @returns True if registration was successful, false otherwise
 */
export const isRegistrationSuccessful = (response: RegisterDoctorResponse): boolean => {
  return response.Codigo === 0;
};

/**
 * Gets a user-friendly error message from the registration response
 * @param response - The registration response
 * @returns User-friendly error message or null if successful
 */
export const getRegistrationErrorMessage = (response: RegisterDoctorResponse): string | null => {
  if (isRegistrationSuccessful(response)) {
    return null;
  }
  
  // Return the message from the API or a generic error message
  return response.Mensaje || 'Registration failed. Please try again.';
};

/**
 * Helper function to create a RegisterDoctorRequest from form data
 * @param formData - Form data from the registration form
 * @returns RegisterDoctorRequest object
 */
export const createRegisterDoctorRequest = (formData: {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  exequatur: string;
}): RegisterDoctorRequest => {
  // Generate username from email (before @ symbol)
  const username = formData.email.split('@')[0];
  
  return {
    usuario: username,
    clave: formData.password,
    nombre: formData.name,
    apellidos: formData.lastName,
    email: formData.email,
    telefono: formData.phone,
    exequatur: formData.exequatur,
  };
};

// Types are already exported when declared as interfaces above
