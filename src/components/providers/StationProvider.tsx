'use client';

import { useEffect } from 'react';
import { useStationStore } from '../../lib/stores/station.store';

/**
 * Props for the StationProvider component
 */
interface StationProviderProps {
  /** Child components to render */
  children: React.ReactNode;
}

/**
 * Provider component that initializes the station ID globally
 * This component should be placed high in the component tree to ensure
 * the station ID is available throughout the application
 * 
 * @param props - Component props
 * @returns JSX element with children
 */
export const StationProvider: React.FC<StationProviderProps> = ({ children }) => {
  const { idUnico, isLoading, initializeStationId } = useStationStore();

  /**
   * Initialize station ID when the provider mounts
   */
  useEffect(() => {
    // Only initialize if we don't have an ID and we're not already loading
    if (!idUnico && !isLoading) {
      initializeStationId();
    }
  }, [idUnico, isLoading, initializeStationId]);

  // Render children regardless of station ID status
  // The station ID will be available through the store once loaded
  return <>{children}</>;
};
