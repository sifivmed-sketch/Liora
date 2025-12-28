'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { deleteHealthPlatformSession } from '@/lib/auth/auth-actions';

interface DashboardHeaderProps {
  userName: string;
}

/**
 * Header component for the health platform dashboard
 * Displays logo, navigation links, and user greeting
 * 
 * @param userName - The name of the logged-in user
 * @returns JSX element with dashboard header
 */
const DashboardHeader = ({ userName }: DashboardHeaderProps) => {
  const t = useTranslations('plataforma-salud.dashboard.header');
  const router = useRouter();

  /**
   * Handles the logout action
   * @returns void
   */
  const handleLogout = async () => {
    await deleteHealthPlatformSession();
    router.push('/plataforma-salud/login');
  };

  /**
   * Handles navigation to profile page
   * @returns void
   */
  const handleProfileClick = () => {
    router.push('/plataforma-salud/perfil');
  };

  return (
    <header className="bg-white border-b border-gray-200 flex-shrink-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
              <div className="flex items-center">
                <span className="text-2xl font-bold text-gray-900">WHOBI</span>
              </div>

          {/* Navigation and User Info */}
          <div className="flex items-center gap-6">
            <button
              onClick={handleProfileClick}
              className="text-gray-700 hover:text-green-600 transition-colors duration-200 font-medium"
              tabIndex={0}
              aria-label={t('my-profile')}
            >
              {t('my-profile')}
            </button>
            <span className="text-gray-700 font-medium">
              {t('hello')}, {userName}
            </span>
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-red-600 transition-colors duration-200 font-medium"
              tabIndex={0}
              aria-label={t('logout')}
            >
              {t('logout')}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

