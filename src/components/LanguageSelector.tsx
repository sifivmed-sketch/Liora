'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

/**
 * Language selector component that allows users to switch between available locales
 * @returns JSX element with a select dropdown for language selection
 */
const LanguageSelector = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  
  // Safe translation with fallback
  const t = useTranslations('language');
  
  // Fallback text in case translations fail
  const getTranslation = (key: string, fallback: string) => {
    try {
      return t(key);
    } catch  {
      // console.warn(`Translation failed for key: ${key}`, error);
      return fallback;
    }
  };

  /**
   * Handles language change when user selects a new locale
   * @param event - Change event from select element
   */
  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = event.target.value as 'es' | 'en';
    
    // Get the current path without locale prefix
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    
    // Navigate to the new locale with the same path
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <div className="flex items-center gap-2">
      <label 
        htmlFor="language-select" 
        className="text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {getTranslation('selector', 'Language')}:
      </label>
      <select
        id="language-select"
        value={locale}
        onChange={handleLanguageChange}
        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        aria-label={getTranslation('selector', 'Language')}
      >
        <option value="es">{getTranslation('spanish', 'Español')}</option>
        <option value="en">{getTranslation('english', 'English')}</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
