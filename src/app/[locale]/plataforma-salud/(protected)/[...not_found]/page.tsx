import { getTranslations } from 'next-intl/server';
import BackToProfileButton from '../components/BackToProfileButton';

/**
 * Catch-all route for undefined paths in protected health platform routes
 * Acts as a custom 404 page with protected layout
 * @returns JSX element with 404 page content
 */
export default async function NotFoundPage() {
  const t = await getTranslations('plataforma-salud.not-found');

  return (
    <div className="h-full bg-gray-100 overflow-y-auto">
      <div className="w-full max-w-2xl mx-auto px-8 pt-8">
        {/* Error Content */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          {/* 404 Number */}
          <div className="mb-6">
            <h1 className="text-8xl font-bold text-gray-200">404</h1>
          </div>

          {/* Error Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center">
              <svg 
                className="w-10 h-10 text-blue-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
          </div>

          {/* Error Message */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {t('title')}
          </h2>
          <p className="text-base text-gray-600 mb-8 max-w-md mx-auto">
            {t('description')}
          </p>

          {/* Back to Profile Link */}
          <BackToProfileButton label={t('back-to-profile')} />
        </div>
      </div>
    </div>
  );
}
