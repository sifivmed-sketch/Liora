import { API_BASE_URL, API_MEDICAL_SEGMENT, API_MEDICAL_ACTIVATION_ENDPOINT } from '@/lib/constants/api.constants';
import { useStationStore } from '@/lib/stores/station.store';

/**
 * Request interface for medical account activation
 */
export interface ActivateMedicalAccountRequest {
  hashConfirmacion: string;
}

/**
 * Response interface for medical account activation
 */
export interface ActivateMedicalAccountResponse {
  Codigo: number;
  Mensaje: string;
}

/**
 * Activates a medical user account using the confirmation hash
 * @param request - The activation request containing the confirmation hash
 * @returns Promise<ActivateMedicalAccountResponse> - The activation response
 * @throws Error if API_BASE_URL is not configured or station ID is not available
 */
export const activateMedicalAccount = async (
  request: ActivateMedicalAccountRequest
): Promise<ActivateMedicalAccountResponse> => {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not configured');
  }

  const stationId = useStationStore.getState().idUnico;
  if (!stationId) {
    throw new Error('Station ID is not available. Please ensure the station is initialized.');
  }

  const endpoint = `${API_BASE_URL}/${API_MEDICAL_SEGMENT}/${API_MEDICAL_ACTIVATION_ENDPOINT}`;

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

    let data: ActivateMedicalAccountResponse;
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
      throw new Error(`Failed to activate medical account: ${error.message}`);
    }
    throw new Error('Unknown error occurred while activating medical account');
  }
};

/**
 * Checks if the medical activation was successful
 * @param response - The activation response
 * @returns boolean - True if activation was successful (Codigo 0 or 99)
 */
export const isMedicalActivationSuccessful = (response: ActivateMedicalAccountResponse): boolean => {
  return response.Codigo === 0 || response.Codigo === 99;
};

/**
 * Gets the medical activation error message
 * @param response - The activation response
 * @returns string - The error message or a default message
 */
export const getMedicalActivationErrorMessage = (response: ActivateMedicalAccountResponse): string => {
  return response.Mensaje || 'Medical account activation failed. Please try again.';
};
