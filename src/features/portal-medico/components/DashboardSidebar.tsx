'use client';

import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import PersonIcon from '@/components/icons/person.icon';
import UsersGroupIcon from '@/components/icons/users-group.icon';
import CalendarIcon from '@/components/icons/calendar.icon';
import SettingsIcon from '@/components/icons/settings.icon';
import HelpIcon from '@/components/icons/help.icon';

interface MenuItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  section?: string;
}

/**
 * Sidebar component for the medical portal dashboard
 * Displays navigation menu with sections and menu items
 * 
 * @returns JSX element with dashboard sidebar navigation
 */
const DashboardSidebar = () => {
  const t = useTranslations('portal-medico.dashboard.sidebar');
  const router = useRouter();
  const pathname = usePathname();

  /**
   * Menu items configuration
   */
  const menuItems: MenuItem[] = [
    // Medical Panel Section
    { label: t('my-profile'), path: '/portal-medico/perfil', icon: PersonIcon, section: 'medical-panel' },
    { label: t('my-patients'), path: '/portal-medico/pacientes', icon: UsersGroupIcon, section: 'medical-panel' },
    { label: t('appointments'), path: '/portal-medico/citas', icon: CalendarIcon, section: 'medical-panel' },
    { label: t('medical-centers'), path: '/portal-medico/centros', icon: UsersGroupIcon, section: 'medical-panel' },
    
    // Configuration Section
    { label: t('settings'), path: '/portal-medico/configuracion', icon: SettingsIcon, section: 'configuration' },
    { label: t('help'), path: '/portal-medico/ayuda', icon: HelpIcon, section: 'configuration' },
  ];

  /**
   * Handles menu item click navigation
   * @param path - The path to navigate to
   * @returns void
   */
  const handleMenuItemClick = (path: string) => {
    // @ts-expect-error - Dynamic paths not in routing config
    router.push(path);
  };

  /**
   * Handles keyboard navigation for menu items
   * @param event - Keyboard event
   * @param path - The path to navigate to
   * @returns void
   */
  const handleMenuItemKeyDown = (event: React.KeyboardEvent, path: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleMenuItemClick(path);
    }
  };

  /**
   * Checks if a menu item is active based on current pathname
   * @param path - The menu item path
   * @returns boolean indicating if the item is active
   */
  const isActive = (path: string): boolean => {
    return pathname === path || pathname?.startsWith(path + '/');
  };

  /**
   * Groups menu items by section
   */
  const groupedItems = menuItems.reduce((acc, item) => {
    const section = item.section || 'other';
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto">
      <nav className="p-4">
        {/* Medical Panel Section */}
        {groupedItems['medical-panel'] && (
          <div className="mb-8">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              {t('medical-panel')}
            </h2>
            <ul className="space-y-2">
              {groupedItems['medical-panel'].map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <li key={item.path}>
                    <button
                      onClick={() => handleMenuItemClick(item.path)}
                      onKeyDown={(e) => handleMenuItemKeyDown(e, item.path)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 text-sm cursor-pointer ${
                        active
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      tabIndex={0}
                      aria-label={item.label}
                      aria-current={active ? 'page' : undefined}
                    >
                      <Icon className={`w-4 h-4 ${active ? 'text-blue-600' : 'text-gray-500'}`} />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Configuration Section */}
        {groupedItems['configuration'] && (
          <div className="mb-8">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              {t('configuration')}
            </h2>
            <ul className="space-y-2">
              {groupedItems['configuration'].map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <li key={item.path}>
                    <button
                      onClick={() => handleMenuItemClick(item.path)}
                      onKeyDown={(e) => handleMenuItemKeyDown(e, item.path)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 text-sm cursor-pointer ${
                        active
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      tabIndex={0}
                      aria-label={item.label}
                      aria-current={active ? 'page' : undefined}
                    >
                      <Icon className={`w-4 h-4 ${active ? 'text-blue-600' : 'text-gray-500'}`} />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
