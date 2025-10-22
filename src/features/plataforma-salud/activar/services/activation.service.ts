import { API_BASE_URL, API_PATIENT_SEGMENT, API_PATIENT_ACTIVATION_ENDPOINT } from '@/lib/constants/api.constants';
import { useStationStore } from '@/lib/stores/station.store';

/**
 * Request interface for account activation
 */
export interface ActivateAccountRequest {
  hashConfirmacion: string;
}

/**
 * Response interface for account activation
 */
export interface ActivateAccountResponse {
  Codigo: number;
  Mensaje: string;
}

/**
 * Activates a user account using the confirmation hash
 * @param request - The activation request containing the confirmation hash
 * @returns Promise<ActivateAccountResponse> - The activation response
 * @throws Error if API_BASE_URL is not configured or station ID is not available
 */
export const activateAccount = async (
  request: ActivateAccountRequest
): Promise<ActivateAccountResponse> => {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not configured');
  }

  const stationId = useStationStore.getState().idUnico;
  if (!stationId) {
    throw new Error('Station ID is not available. Please ensure the station is initialized.');
  }

  const endpoint = `${API_BASE_URL}/${API_PATIENT_SEGMENT}/${API_PATIENT_ACTIVATION_ENDPOINT}`;

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

    let data: ActivateAccountResponse;
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
      throw new Error(`Failed to activate account: ${error.message}`);
    }
    throw new Error('Unknown error occurred while activating account');
  }
};

/**
 * Checks if the activation was successful
 * @param response - The activation response
 * @returns boolean - True if activation was successful (Codigo 0 or 99)
 */
export const isActivationSuccessful = (response: ActivateAccountResponse): boolean => {
  return response.Codigo === 0 || response.Codigo === 99;
};

/**
 * Gets the activation error message
 * @param response - The activation response
 * @returns string - The error message or a default message
 */
export const getActivationErrorMessage = (response: ActivateAccountResponse): string => {
  return response.Mensaje || 'Account activation failed. Please try again.';
};

