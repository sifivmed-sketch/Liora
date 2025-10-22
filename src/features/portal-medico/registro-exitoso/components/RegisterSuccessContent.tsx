'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useState, useEffect } from 'react';
import Link from '@/components/Link';
import Logo from '@/components/Logo';
import MedicalCard from '@/components/MedicalCard';
import { useRegistrationStore } from '@/lib/stores/registration.store';

/**
 * Register success page component for portal-medico
 * Shows confirmation message and provides actions for resend email and login
 */
const RegisterSuccessContent = () => {
  const t = useTranslations('portal-medico.register-success');
  const router = useRouter();
  const [isResending, setIsResending] = useState(false);
  
  const isRegistrationSuccessful = useRegistrationStore((state) => state.isRegistrationSuccessful);
  const checkAccess = useRegistrationStore((state) => state.checkAccess);
  const clearRegistrationSuccess = useRegistrationStore((state) => state.clearRegistrationSuccess);

  // Check access on component mount
  useEffect(() => {
    if (!checkAccess()) {
      router.push({ pathname: '/portal-medico/registro' });
    }
  }, [checkAccess, router]);

  // Show loading while checking access
  if (!isRegistrationSuccessful) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-medical-primary)] mx-auto"></div>
          <p className="mt-2 text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  /**
   * Handles resend email functionality
   * Does NOT clear registration success state - user can stay on success page
   */
  const handleResendEmail = async () => {
    if (isResending) return;
    
    setIsResending(true);
    
    try {
      // TODO: Implement resend email API call
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(t('resend-success'));
      
      // Do NOT clear registration success state here
      // User can continue to stay on success page and re-send if needed
    } catch {
      alert(t('resend-error'));
    } finally {
      setIsResending(false);
    }
  };

  /**
   * Handles navigation to login page
   * Clears registration success state to prevent returning to success page
   */
  const handleGoToLogin = () => {
    clearRegistrationSuccess();
    router.replace({ pathname: '/portal-medico/login' });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-4 px-4">
      <div className="max-w-md w-full">
        {/* Success Card */}
        <MedicalCard variant="medical-portal" className="w-full p-4 sm:p-6 md:p-8">
          {/* Logo inside card */}
          <div className="text-center mb-6">
            <Logo />
          </div>
          {/* Success Icon */}
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg 
                className="w-8 h-8 text-green-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {t('title')}
            </h1>
            
            <p className="text-gray-600 text-sm leading-relaxed">
              {t('description')}
            </p>
          </div>

          {/* Email Icon */}
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
              <svg 
                className="w-6 h-6 text-blue-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg 
                  className="w-5 h-5 text-blue-600 mt-0.5" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">{t('instructions-title')}</p>
                <ul className="space-y-1 text-blue-700">
                  <li>• {t('instruction-1')}</li>
                  <li>• {t('instruction-2')}</li>
                  <li>• {t('instruction-3')}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleResendEmail}
              disabled={isResending}
              className="cursor-pointer w-full bg-[var(--color-medical-primary)] text-white py-3 px-4 rounded-lg hover:bg-[var(--color-medical-dark)] hover:-translate-y-0.5 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-medical-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              {isResending ? t('resending') : t('resend-email')}
            </button>

            <button
              onClick={handleGoToLogin}
              className="cursor-pointer w-full bg-white text-[var(--color-medical-primary)] py-3 px-4 rounded-lg border-2 border-[var(--color-medical-primary)] hover:bg-[var(--color-medical-primary)] hover:text-white hover:-translate-y-0.5 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-medical-primary)] transition-all duration-200 font-medium"
            >
              {t('go-to-login')}
            </button>
          </div>
        </MedicalCard>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 mt-4">
          <p className="text-sm">
            {t('help-text')}{' '}
            <Link 
              href="/portal-medico/contacto" 
              type="next" 
              variant="medical"
              className="text-sm"
            >
              {t('contact-support')}
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default RegisterSuccessContent;
