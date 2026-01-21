'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { deleteMedicalPortalSession } from '@/lib/auth/auth-actions';

interface DashboardHeaderProps {
  userName: string;
}

/**
 * Header component for the medical portal dashboard
 * Displays logo, navigation links, and user greeting
 * 
 * @param userName - The name of the logged-in user
 * @returns JSX element with dashboard header
 */
const DashboardHeader = ({ userName }: DashboardHeaderProps) => {
  const t = useTranslations('portal-medico.dashboard.header');
  const router = useRouter();

  /**
   * Handles the logout action
   * @returns void
   */
  const handleLogout = async () => {
    await deleteMedicalPortalSession();
    router.push('/portal-medico/login');
  };

  /**
   * Handles navigation to profile page
   * @returns void
   */
  const handleProfileClick = () => {
    router.push('/portal-medico/perfil');
  };

  return (
    <header className="bg-white border-b border-gray-200 flex-shrink-0 z-50">
      <div className="px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-2xl font-bold text-gray-900">WHOBI</span>
          </div>

          {/* Navigation and User Info */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={handleProfileClick}
              className="hidden sm:flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
              tabIndex={0}
              aria-label={t('my-profile')}
            >
              {t('my-profile')}
            </button>

            <span className="text-sm text-gray-700" aria-label={`${t('hello')}, ${userName}`}>
              {t('hello')},{' '}
              <span className="font-semibold text-blue-600">{userName}</span>
            </span>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:border-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              tabIndex={0}
              aria-label={t('logout')}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              {t('logout')}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
