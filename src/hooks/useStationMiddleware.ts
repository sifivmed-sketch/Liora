import { useEffect } from 'react';
import { useStationStore } from '../lib/stores/station.store';

/**
 * Custom hook that detects middleware signals and initializes station ID
 * This hook automatically runs when the middleware indicates station ID is needed
 * 
 * @returns Object with middleware detection state
 */
export const useStationMiddleware = () => {
  const { initializeStationId, idUnico, isLoading } = useStationStore();

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return;
    }

    // Initialize station ID automatically when component mounts
    // This will be triggered by the middleware on every page load
    if (!idUnico && !isLoading) {
      initializeStationId();
    }

    // Listen for navigation events to re-check
    const handleNavigation = () => {
      if (!idUnico && !isLoading) {
        initializeStationId();
      }
    };

    // Listen for popstate events (back/forward navigation)
    window.addEventListener('popstate', handleNavigation);

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handleNavigation);
    };
  }, [idUnico, isLoading, initializeStationId]);

  return {
    /** Whether the station ID is being initialized due to middleware signal */
    isInitializing: isLoading && !idUnico,
    /** Whether the station ID is available */
    hasStationId: !!idUnico,
  };
};
