/**
 * Interface for the station ID generation API response
 * The endpoint returns only the idUnico field
 */
export interface GenerateStationIdResponse {
  /** Unique station identifier */
  idUnico: string;
}

/**
 * Interface for the station ID generation API request parameters (for GET)
 */
export interface GenerateStationIdRequest {
  /** Optional metadata about the station */
  metadata?: {
    /** User agent string */
    userAgent?: string;
    /** Timestamp of the request */
    timestamp?: number;
    /** Location information */
    location?: string;
  };
}

/**
 * Interface for the station store state
 */
export interface StationState {
  /** Unique identifier for the current station */
  idUnico: string | null;
  /** Loading state for station ID operations */
  isLoading: boolean;
  /** Error state for station ID operations */
  error: string | null;
  /** Timestamp when the station ID was last updated */
  lastUpdated: number | null;
}

/**
 * Interface for the station store actions
 */
export interface StationActions {
  /** Set the station unique ID */
  setIdUnico: (id: string) => void;
  /** Set loading state */
  setLoading: (loading: boolean) => void;
  /** Set error state */
  setError: (error: string | null) => void;
  /** Clear the station ID and reset state */
  clearStationId: () => void;
  /** Initialize station ID from localStorage or API */
  initializeStationId: () => Promise<void>;
}

/**
 * Combined interface for the station store
 */
export type StationStore = StationState & StationActions;

/**
 * Interface for the station initializer hook return value
 */
export interface UseStationInitializerReturn {
  /** Current station unique ID */
  stationId: string | null;
  /** Loading state for station operations */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Whether the station ID is available */
  hasStationId: boolean;
  /** Manually refresh the station ID */
  refreshStationId: () => Promise<void>;
  /** Reset and generate new station ID */
  resetStationId: () => Promise<void>;
}
