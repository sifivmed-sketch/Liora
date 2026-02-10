'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

/**
 * Interface for section checkbox data
 */
interface Section {
  id: string;
  key: string;
  descriptionKey: string;
  defaultChecked: boolean;
}

/**
 * Interface for component props
 */
interface PrintRecordsPageContentProps {
  sessionId: string;
  idPaciente: string;
}

/**
 * Print/Export medical history page content component
 * Allows users to select sections and export their medical history
 * @param sessionId - Session ID from login for API calls
 * @param idPaciente - Patient ID from the session
 * @returns JSX element with print/export page layout
 */
const PrintRecordsPageContent = ({
  sessionId,
  idPaciente,
}: PrintRecordsPageContentProps) => {
  const router = useRouter();
  const t = useTranslations('plataforma-salud.historial.print');
  const [sections, setSections] = useState<Section[]>([
    {
      id: 'personal-info',
      key: 'personal-information',
      descriptionKey: 'personal-information-description',
      defaultChecked: true,
    },
    {
      id: 'allergies',
      key: 'allergies',
      descriptionKey: 'allergies-description',
      defaultChecked: true,
    },
    {
      id: 'chronic-conditions',
      key: 'chronic-conditions',
      descriptionKey: 'chronic-conditions-description',
      defaultChecked: true,
    },
    {
      id: 'active-medications',
      key: 'active-medications',
      descriptionKey: 'active-medications-description',
      defaultChecked: true,
    },
    {
      id: 'historical-medications',
      key: 'historical-medications',
      descriptionKey: 'historical-medications-description',
      defaultChecked: false,
    },
    {
      id: 'consultations',
      key: 'consultations',
      descriptionKey: 'consultations-description',
      defaultChecked: true,
    },
    {
      id: 'vaccines',
      key: 'vaccines',
      descriptionKey: 'vaccines-description',
      defaultChecked: false,
    },
    {
      id: 'lab-results',
      key: 'lab-results',
      descriptionKey: 'lab-results-description',
      defaultChecked: false,
    },
  ]);

  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [emailMessage, setEmailMessage] = useState<string>('');

  /**
   * Handles going back to medical history page
   */
  const handleGoBack = () => {
    router.push('/plataforma-salud/historial');
  };

  /**
   * Handles section checkbox toggle
   * @param sectionId - ID of the section to toggle
   */
  const handleToggleSection = (sectionId: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? { ...section, defaultChecked: !section.defaultChecked }
          : section
      )
    );
  };

  /**
   * Handles print action
   */
  const handlePrint = () => {
    toast.info(t('print-toast'));
    // TODO: Implement print functionality
  };

  /**
   * Handles PDF download
   */
  const handleDownloadPDF = () => {
    toast.info(t('download-pdf-toast'));
    // TODO: Implement PDF download functionality
  };

  /**
   * Handles opening email modal
   */
  const handleOpenEmailModal = () => {
    setShowEmailModal(true);
  };

  /**
   * Handles closing email modal
   */
  const handleCloseEmailModal = () => {
    setShowEmailModal(false);
    setEmail('');
    setEmailMessage('');
  };

  /**
   * Handles sending email
   */
  const handleSendEmail = () => {
    if (!email) {
      toast.error(t('email-required'));
      return;
    }
    handleCloseEmailModal();
    toast.success(t('email-sent-toast'));
    // TODO: Implement email sending functionality
  };

  return (
    <div className="h-full bg-gray-100 overflow-y-auto">
      <div className="p-4 lg:p-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={handleGoBack}
              className="min-h-[44px] px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-all duration-200"
              aria-label={t('back-button')}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              {t('back-button')}
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600 mt-1">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Selection Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sections Selection */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                {t('sections-title')}
              </h3>
              <div className="space-y-2">
                {sections.map((section) => (
                  <label
                    key={section.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer transition-all duration-150 hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={section.defaultChecked}
                      onChange={() => handleToggleSection(section.id)}
                      className="w-5 h-5 rounded accent-[#2F80ED]"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {t(`sections.${section.key}`)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {t(`sections.${section.descriptionKey}`)}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                {t('date-range-title')}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {t('date-range-description')}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('date-from')}
                  </label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('date-to')}
                  </label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview & Actions */}
          <div className="space-y-6">
            {/* Preview */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                {t('preview-title')}
              </h3>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 h-64 flex flex-col items-center justify-center text-gray-400">
                <svg
                  className="w-16 h-16 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-sm text-center">{t('preview-description')}</p>
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">
                {t('preview-pages')}
              </p>
            </div>

            {/* Export Options */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                {t('export-options-title')}
              </h3>
              <div className="space-y-3">
                <button
                  onClick={handlePrint}
                  className="w-full min-h-[44px] px-4 py-3 text-white rounded-lg flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  style={{ backgroundColor: '#2F80ED' }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = '#1E6FD9')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = '#2F80ED')
                  }
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                    />
                  </svg>
                  {t('print-button')}
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="w-full min-h-[44px] px-4 py-3 bg-green-600 text-white rounded-lg flex items-center justify-center gap-2 transition-all duration-200 hover:bg-green-700 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  {t('download-pdf-button')}
                </button>
                <button
                  onClick={handleOpenEmailModal}
                  className="w-full min-h-[44px] px-4 py-3 border border-gray-300 text-gray-700 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 hover:bg-gray-50"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {t('send-email-button')}
                </button>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-amber-800">
                    {t('security-notice-title')}
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    {t('security-notice-description')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={handleCloseEmailModal}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {t('email-modal-title')}
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('email-label')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent"
                placeholder={t('email-placeholder')}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('email-message-label')}
              </label>
              <textarea
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent"
                rows={3}
                placeholder={t('email-message-placeholder')}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCloseEmailModal}
                className="min-h-[44px] px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                {t('cancel-button')}
              </button>
              <button
                onClick={handleSendEmail}
                className="min-h-[44px] px-4 py-2 text-white rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                style={{ backgroundColor: '#2F80ED' }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = '#1E6FD9')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = '#2F80ED')
                }
              >
                {t('send-button')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrintRecordsPageContent;
