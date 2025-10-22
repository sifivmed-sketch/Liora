import { API_BASE_URL, API_GENERAL_SEGMENT } from '../constants/api.constants';

/**
 * Interface for the station ID generation response
 * The endpoint returns only the idUnico field
 */
interface GenerateStationIdResponse {
  idUnico: string;
}

/**
 * Interface for the station ID generation request parameters (for GET)
 */
interface GenerateStationIdRequest {
  /** Optional metadata about the station */
  metadata?: {
    userAgent?: string;
    timestamp?: number;
    location?: string;
  };
}

/**
 * Generates a unique station ID by calling the GenerarIdEstación endpoint
 * @param request - Optional request parameters (sent as query parameters)
 * @returns Promise with the generated station ID
 * @throws Error if the API call fails
 */
export const generateStationId = async (
  request?: GenerateStationIdRequest
): Promise<string> => {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not configured');
  }

  let endpoint = `${API_BASE_URL}/${API_GENERAL_SEGMENT}/GenerarIdEstacion`;
  
  // Add query parameters if provided
  if (request?.metadata) {
    const params = new URLSearchParams();
    
    if (request.metadata.userAgent) {
      params.append('userAgent', request.metadata.userAgent);
    }
    if (request.metadata.timestamp) {
      params.append('timestamp', request.metadata.timestamp.toString());
    }
    if (request.metadata.location) {
      params.append('location', request.metadata.location);
    }
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }
  }
  
  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: GenerateStationIdResponse = await response.json();

    if (!data.idUnico) {
      throw new Error('No station ID returned from API');
    }

    return data.idUnico;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to generate station ID: ${error.message}`);
    }
    throw new Error('Unknown error occurred while generating station ID');
  }
};

/**
 * Validates if a station ID has the correct format
 * @param id - The station ID to validate
 * @returns True if the ID is valid, false otherwise
 */
export const isValidStationId = (id: string | null): boolean => {
  if (!id || typeof id !== 'string') {
    return false;
  }
  
  // Basic validation - adjust regex pattern based on your ID format
  // This is a generic pattern, you may need to adjust it
  const stationIdPattern = /^[a-zA-Z0-9-_]{8,}$/;
  return stationIdPattern.test(id);
};

/**
 * Gets the station ID from localStorage
 * @returns The stored station ID or null if not found
 */
export const getStoredStationId = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    const storedId = localStorage.getItem('station_id_unico');
    return storedId && isValidStationId(storedId) ? storedId : null;
  } catch  {
    return null;  
  }
};

/**
 * Stores the station ID in localStorage
 * @param id - The station ID to store
 * @returns True if successful, false otherwise
 */
export const storeStationId = (id: string): boolean => {
  if (typeof window === 'undefined' || !isValidStationId(id)) {
    return false;
  }
  
  try {
    localStorage.setItem('station_id_unico', id);
    return true;
  } catch  {
    return false;
  }
};

/**
 * Removes the station ID from localStorage
 * @returns True if successful, false otherwise
 */
export const removeStoredStationId = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  try {
    localStorage.removeItem('station_id_unico');
    return true;
  } catch  {
    return false;
  }
};
