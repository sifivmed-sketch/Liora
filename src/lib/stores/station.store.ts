import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateStationId, getStoredStationId, storeStationId } from '../api/station.api';

/**
 * Interface for the station store state
 */
interface StationState {
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
interface StationActions {
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
type StationStore = StationState & StationActions;

/**
 * Station store using Zustand with persistence
 * Manages the unique station identifier across the application
 */
export const useStationStore = create<StationStore>()(
  persist(
    (set, get) => ({
      // Initial state
      idUnico: null,
      isLoading: false,
      error: null,
      lastUpdated: null,

      // Actions
      setIdUnico: (id: string) => {
        set({
          idUnico: id,
          lastUpdated: Date.now(),
          error: null,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearStationId: () => {
        set({
          idUnico: null,
          error: null,
          lastUpdated: null,
        });
      },

      /**
       * Initialize station ID from localStorage or generate new one
       * This method handles the complete flow of getting a station ID
       */
      initializeStationId: async () => {
        const { idUnico, isLoading } = get();
        
        // If already loading or already have an ID, skip
        if (isLoading || idUnico) {
          return;
        }

        set({ isLoading: true, error: null });

        try {
          // Try to get from localStorage first using the API function
          const storedId = getStoredStationId();
          
          if (storedId) {
            set({
              idUnico: storedId,
              lastUpdated: Date.now(),
              isLoading: false,
            });
            return;
          }

          // If not in localStorage, generate new one from API
          const newId = await generateStationId();

          // Store in localStorage using the API function
          const stored = storeStationId(newId);
          
          if (!stored) {
            throw new Error('Failed to store station ID in localStorage');
          }

          // Update state
          set({
            idUnico: newId,
            lastUpdated: Date.now(),
            isLoading: false,
          });

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'station-store',
      partialize: (state) => ({
        idUnico: state.idUnico,
        lastUpdated: state.lastUpdated,
      }),
    }
  )
);

/**
 * Hook to get the current station ID
 * @returns The current station unique ID or null if not available
 */
export const useStationId = () => {
  return useStationStore((state) => state.idUnico);
};

/**
 * Hook to get the station loading state
 * @returns True if station operations are in progress
 */
export const useStationLoading = () => {
  return useStationStore((state) => state.isLoading);
};

/**
 * Hook to get the station error state
 * @returns The current error message or null if no error
 */
export const useStationError = () => {
  return useStationStore((state) => state.error);
};
