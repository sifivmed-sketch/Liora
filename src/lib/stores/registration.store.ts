import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Interface for the registration store state
 */
interface RegistrationState {
  /** Whether registration was successful */
  isRegistrationSuccessful: boolean;
  /** User's email from successful registration */
  userEmail: string | null;
  /** Loading state for registration operations */
  isLoading: boolean;
  /** Error state for registration operations */
  error: string | null;
  /** Timestamp when the registration was completed */
  completedAt: number | null;
}

/**
 * Interface for the registration store actions
 */
interface RegistrationActions {
  /** Mark registration as successful and store user email */
  markRegistrationSuccessful: (email: string) => void;
  /** Clear registration success state */
  clearRegistrationSuccess: () => void;
  /** Set loading state */
  setLoading: (loading: boolean) => void;
  /** Set error state */
  setError: (error: string | null) => void;
  /** Check if user has access to success page */
  checkAccess: () => boolean;
}

/**
 * Combined interface for the registration store
 */
type RegistrationStore = RegistrationState & RegistrationActions;

/**
 * Registration store using Zustand with persistence
 * Manages the registration success state across the application
 * 
 * Persistence behavior:
 * - State persists in localStorage across page reloads
 * - Only cleared when user explicitly goes to login
 * - Allows user to stay on success page and re-send emails
 */
export const useRegistrationStore = create<RegistrationStore>()(
  persist(
    (set, get) => ({
      // Initial state
      isRegistrationSuccessful: false,
      userEmail: null,
      isLoading: false,
      error: null,
      completedAt: null,

      // Actions
      markRegistrationSuccessful: (email: string) => {
        set({
          isRegistrationSuccessful: true,
          userEmail: email,
          completedAt: Date.now(),
          error: null,
        });
      },

      /**
       * Clear registration success state
       * Should only be called when user explicitly navigates to login
       * This prevents returning to success page after user has moved on
       */
      clearRegistrationSuccess: () => {
        set({
          isRegistrationSuccessful: false,
          userEmail: null,
          completedAt: null,
          error: null,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      checkAccess: () => {
        const { isRegistrationSuccessful, userEmail } = get();
        return isRegistrationSuccessful && userEmail !== null;
      },
    }),
    {
      name: 'registration-store',
      partialize: (state) => ({
        isRegistrationSuccessful: state.isRegistrationSuccessful,
        userEmail: state.userEmail,
        completedAt: state.completedAt,
      }),
    }
  )
);

/**
 * Hook to get the current registration success state
 * @returns True if registration was successful, false otherwise
 */
export const useRegistrationSuccess = () => {
  return useRegistrationStore((state) => state.isRegistrationSuccessful);
};

/**
 * Hook to get the user email from successful registration
 * @returns The user's email or null if not available
 */
export const useRegistrationEmail = () => {
  return useRegistrationStore((state) => state.userEmail);
};

/**
 * Hook to get the registration loading state
 * @returns True if registration operations are in progress
 */
export const useRegistrationLoading = () => {
  return useRegistrationStore((state) => state.isLoading);
};

/**
 * Hook to get the registration error state
 * @returns The current error message or null if no error
 */
export const useRegistrationError = () => {
  return useRegistrationStore((state) => state.error);
};
