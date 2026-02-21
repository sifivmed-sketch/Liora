import { getTranslations } from 'next-intl/server';
import BackToDashboardButton from '../components/BackToDashboardButton';

/**
 * Catch-all route for undefined paths in protected medical portal routes.
 * Acts as a custom 404 page with protected layout, professional medical portal design.
 *
 * @returns JSX element with 404 page content
 */
export default async function NotFoundPage() {
  const t = await getTranslations('portal-medico.not-found');

  return (
    <div className="h-full bg-gray-100 overflow-y-auto">
      <div className="w-full max-w-2xl mx-auto px-8 pt-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center" style={{ borderTop: '3px solid #2F80ED' }}>
          <div className="mb-6">
            <h1 className="text-8xl font-bold text-gray-200" aria-hidden>404</h1>
          </div>

          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(47, 128, 237, 0.1)' }}>
              <svg
                className="w-10 h-10"
                style={{ color: '#2F80ED' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
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

          <h2 className="text-2xl font-bold text-gray-900 mb-3">{t('title')}</h2>
          <p className="text-base text-gray-600 mb-8 max-w-md mx-auto">{t('description')}</p>

          <BackToDashboardButton label={t('back-to-dashboard')} />
        </div>
      </div>
    </div>
  );
}
