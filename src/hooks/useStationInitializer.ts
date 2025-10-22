import { useStationStore } from '../lib/stores/station.store';
import { useStationMiddleware } from './useStationMiddleware';

/**
 * Custom hook to initialize the station ID on component mount
 * This hook handles the complete flow of getting a station ID:
 * 1. Check Zustand store
 * 2. Check localStorage
 * 3. Generate new ID from API if needed
 * 
 * @returns Object with station ID state and methods
 */
export const useStationInitializer = () => {
  const {
    idUnico,
    isLoading,
    error,
    initializeStationId,
    setError,
  } = useStationStore();

  // Use the middleware hook to detect when station ID is needed
  useStationMiddleware();

  /**
   * Manually refresh the station ID
   * This will generate a new ID from the API
   */
  const refreshStationId = async () => {
    try {
      setError(null);
      await initializeStationId();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to refresh station ID';
      setError(errorMessage);
    }
  };

  /**
   * Clear the current station ID and generate a new one
   */
  const resetStationId = async () => {
    try {
      setError(null);
      // Clear current ID
      useStationStore.getState().clearStationId();
      // Generate new one
      await initializeStationId();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reset station ID';
      setError(errorMessage);
    }
  };

  return {
    /** Current station unique ID */
    stationId: idUnico,
    /** Loading state for station operations */
    isLoading,
    /** Error message if any */
    error,
    /** Whether the station ID is available */
    hasStationId: !!idUnico,
    /** Manually refresh the station ID */
    refreshStationId,
    /** Reset and generate new station ID */
    resetStationId,
  };
};
