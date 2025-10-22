'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Link from '@/components/Link';
import Logo from '@/components/Logo';
import MedicalCard from '@/components/MedicalCard';
import { activateAccount, isActivationSuccessful, getActivationErrorMessage } from '../services/activation.service';

/**
 * Modal component for activation result
 */
interface ActivationModalProps {
  isOpen: boolean;
  isSuccess: boolean;
  message: string;
  onClose: () => void;
  onGoToLogin: () => void;
}

const ActivationModal = ({ isOpen, isSuccess, message, onGoToLogin }: ActivationModalProps) => {
  const t = useTranslations('plataforma-salud.activation.modal');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 plataforma-salud bg-opacity-50 flex items-center justify-center z-50 p-4">
      <MedicalCard variant="health-platform" className="max-w-md w-full mx-4">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            {isSuccess ? (
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            ) : (
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            )}
          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
            {isSuccess ? t('success-title') : t('error-title')}
          </h2>

          {/* Message */}
          <p className="text-gray-600 text-center mb-6">
            {message}
          </p>

          {/* Buttons */}
          {isSuccess && (
            <div className="flex flex-col space-y-3">
              <button
                onClick={onGoToLogin}
                className="w-full bg-[var(--color-primary)] text-white py-3 px-4 rounded-lg hover:bg-[#248456] hover:-translate-y-0.5 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-200 font-medium"
              >
                {t('go-to-login')}
              </button>
            </div>
          )}
      </MedicalCard>
    </div>
  );
};

/**
 * Main activation content component
 */
const ActivationContent = () => {
  const t = useTranslations('plataforma-salud.activation');
  const router = useRouter();
  const params = useParams();
  
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const hasProcessed = useRef(false);

  const codigo = params.codigo as string;

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessed.current) return;
    
    const processActivation = async () => {
      hasProcessed.current = true;
      
      if (!codigo) {
        setMessage(t('invalid-code'));
        setIsSuccess(false);
        setModalOpen(true);
        setIsLoading(false);
        setIsCompleted(true);
        return;
      }

      try {
        const response = await activateAccount({ hashConfirmacion: codigo });
        
        if (isActivationSuccessful(response)) {
          setMessage(t('success-message'));
          setIsSuccess(true);
        } else {
          setMessage(getActivationErrorMessage(response));
          setIsSuccess(false);
        }
        
        setModalOpen(true);
        setIsCompleted(true);
      } catch {
        setMessage(t('unexpected-error'));
        setIsSuccess(false);
        setModalOpen(true);
        setIsCompleted(true);
      } finally {
        setIsLoading(false);
      }
    };

    processActivation();
  }, [codigo, t]);

  const handleGoToLogin = () => {
    setModalOpen(false);
    router.push({ pathname: '/plataforma-salud/login' });
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-4 px-4">
      <div className="max-w-md w-full">
        <MedicalCard variant="health-platform" className="w-full">
          <div className="text-center">
            <Logo />
          </div>

          {!isCompleted && isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
              <h1 className="text-xl font-semibold text-gray-900 mb-2">
                {t('validating')}
              </h1>
              <p className="text-gray-600">
                {t('validating-description')}
              </p>
            </div>
          ) : !isCompleted ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
              <h1 className="text-xl font-semibold text-gray-900 mb-2">
                {t('processing')}
              </h1>
              <p className="text-gray-600">
                {t('processing-description')}
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-gray-900 mb-2">
                {isSuccess ? t('modal.success-title') : t('modal.error-title')}
              </h1>
              <p className="text-gray-600">
                {message}
              </p>
            </div>
          )}
        </MedicalCard>

        <footer className="text-center text-sm text-gray-500 mt-4">
          <p className="text-sm">
            {t('help-text')}{' '}
            <Link
              href="/plataforma-salud/contacto"
              type="next"
              variant="medical"
              className="text-sm"
            >
              {t('contact-support')}
            </Link>
          </p>
        </footer>
      </div>

      <ActivationModal
        isOpen={modalOpen}
        isSuccess={isSuccess}
        message={message}
        onClose={handleCloseModal}
        onGoToLogin={handleGoToLogin}
      />
    </div>
  );
};

export default ActivationContent;
