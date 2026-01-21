'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import ArrowLeftIcon from '@/components/icons/arrow-left.icon';
import AlertTriangleIcon from '@/components/icons/alert-triangle.icon';
import PlusIcon from '@/components/icons/plus.icon';
import XCloseIcon from '@/components/icons/x-close.icon';
import EditIcon from '@/components/icons/edit.icon';
import DocumentIcon from '@/components/icons/document.icon';
import PillIcon from '@/components/icons/pill.icon';
import UsersGroupIcon from '@/components/icons/users-group.icon';
import LockSecurityIcon from '@/components/icons/lock-security.icon';
import TrashIcon from '@/components/icons/trash.icon';

/**
 * Medical Profile Content Component
 * Displays medical information sections: allergies, conditions, medications, surgeries, and doctor permissions
 * 
 * @returns JSX element with medical profile content
 */
const MedicalProfileContent = () => {
  const t = useTranslations('plataforma-salud.medical-profile');
  const router = useRouter();

  /**
   * Handles navigation back to profile page
   */
  const handleBackToProfile = () => {
    router.push({ pathname: '/plataforma-salud/perfil' });
  };

  /**
   * Handles navigation to dashboard
   */
  const handleDashboardClick = () => {
    router.push({ pathname: '/plataforma-salud' });
  };

  /**
   * Handles navigation to profile from breadcrumb
   */
  const handleProfileBreadcrumb = () => {
    router.push({ pathname: '/plataforma-salud/perfil' });
  };

  return (
    <div className="h-full bg-gray-100 overflow-y-auto">
      <div className="p-8">
        {/* Back to Profile Button */}
        <div className="flex justify-start mb-4">
          <button
            onClick={handleBackToProfile}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            tabIndex={0}
            aria-label={t('back-button')}
          >
            <ArrowLeftIcon className="w-4 h-4" />
            {t('back-button')}
          </button>
        </div>

        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                {t('header.title')}
              </h1>
              <p className="text-gray-600 text-sm lg:text-base">
                {t('header.description')}
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">{t('header.medical-info')}</div>
              <div className="text-lg font-semibold" style={{ color: '#2F80ED' }}>
                {t('header.configured')}
              </div>
              <div className="text-xs text-gray-500">3 {t('header.doctors-authorized')}</div>
            </div>
          </div>
          
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <button
                  onClick={handleDashboardClick}
                  className="hover:underline focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
                  style={{ color: '#2CA66F' }}
                  tabIndex={0}
                >
                  {t('breadcrumb.dashboard')}
                </button>
              </li>
              <li><span>/</span></li>
              <li>
                <button
                  onClick={handleProfileBreadcrumb}
                  className="hover:underline focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
                  style={{ color: '#2CA66F' }}
                  tabIndex={0}
                >
                  {t('breadcrumb.my-profile')}
                </button>
              </li>
              <li><span>/</span></li>
              <li><span className="text-gray-900">{t('breadcrumb.medical-profile')}</span></li>
            </ol>
          </nav>
        </div>

        {/* Medical Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Alergias */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" style={{ borderLeft: '4px solid #dc2626' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: '#dc2626' }}>
                <AlertTriangleIcon className="w-5 h-5 inline mr-2" />
                {t('sections.allergies.title')}
              </h3>
              <button
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                tabIndex={0}
                aria-label={t('sections.allergies.add-button')}
              >
                <PlusIcon className="w-4 h-4" />
                {t('sections.allergies.add-button')}
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-red-50 p-3 rounded-lg">
                <div>
                  <span className="font-medium text-red-800">Penicilina</span>
                  <span className="text-xs text-red-600 ml-2">{t('sections.allergies.type-medication')}</span>
                </div>
                <button
                  className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                  tabIndex={0}
                  aria-label="Eliminar alergia"
                >
                  <XCloseIcon className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-500 italic">{t('sections.allergies.empty-message')}</p>
            </div>
          </div>

          {/* Condiciones Médicas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" style={{ borderLeft: '4px solid #2F80ED' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: '#2F80ED' }}>
                <DocumentIcon className="w-5 h-5 inline mr-2" />
                {t('sections.conditions.title')}
              </h3>
              <button
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                tabIndex={0}
                aria-label={t('sections.conditions.add-button')}
              >
                <PlusIcon className="w-4 h-4" />
                {t('sections.conditions.add-button')}
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                <div>
                  <span className="font-medium text-blue-800">Hipertensión</span>
                  <span className="text-xs text-blue-600 ml-2">{t('sections.conditions.status-controlled')}</span>
                </div>
                <button
                  className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  tabIndex={0}
                  aria-label="Editar condición"
                >
                  <EditIcon className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-500 italic">{t('sections.conditions.empty-message')}</p>
            </div>
          </div>

          {/* Medicamentos Actuales */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" style={{ borderLeft: '4px solid #2CA66F' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: '#2CA66F' }}>
                <PillIcon className="w-5 h-5 inline mr-2" />
                {t('sections.medications.title')}
              </h3>
              <button
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                tabIndex={0}
                aria-label={t('sections.medications.add-button')}
              >
                <PlusIcon className="w-4 h-4" />
                {t('sections.medications.add-button')}
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                <div>
                  <span className="font-medium text-green-800">Losartán 50mg</span>
                  <div className="text-xs text-green-600">
                    {t('sections.medications.frequency-once')} • {t('sections.medications.time-breakfast')}
                  </div>
                </div>
                <button
                  className="text-green-600 hover:text-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
                  tabIndex={0}
                  aria-label="Editar medicamento"
                >
                  <EditIcon className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-500 italic">{t('sections.medications.empty-message')}</p>
            </div>
          </div>

          {/* Cirugías Previas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" style={{ borderLeft: '4px solid #7c3aed' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: '#7c3aed' }}>
                <UsersGroupIcon className="w-5 h-5 inline mr-2" />
                {t('sections.surgeries.title')}
              </h3>
              <button
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                tabIndex={0}
                aria-label={t('sections.surgeries.add-button')}
              >
                <PlusIcon className="w-4 h-4" />
                {t('sections.surgeries.add-button')}
              </button>
            </div>
            <div className="space-y-2">
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-purple-800">Apendicectomía</span>
                  <button
                    className="text-purple-600 hover:text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
                    tabIndex={0}
                    aria-label="Editar cirugía"
                  >
                    <EditIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-purple-600 mt-1">Marzo 2020 • Hospital General</div>
              </div>
              <p className="text-sm text-gray-500 italic">{t('sections.surgeries.empty-message')}</p>
            </div>
          </div>
        </div>

        {/* Doctor Permissions Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6" style={{ borderLeft: '4px solid #2F80ED' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold" style={{ color: '#2F80ED' }}>
              <LockSecurityIcon className="w-6 h-6 inline mr-2" />
              {t('doctor-permissions.title')}
            </h2>
            <button
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              tabIndex={0}
              aria-label={t('doctor-permissions.add-doctor-button')}
            >
              <PlusIcon className="w-4 h-4" />
              {t('doctor-permissions.add-doctor-button')}
            </button>
          </div>

          <div className="space-y-4">
            {/* Doctor 1 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                    Dr
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Dr. María González</h3>
                    <p className="text-sm text-gray-600">Cardiología • Clínica San Rafael</p>
                    <p className="text-xs text-gray-500">
                      {t('doctor-permissions.authorized-since')} 15 Oct 2024
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    {t('doctor-permissions.status-active')}
                  </span>
                  <button
                    className="text-gray-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                    tabIndex={0}
                    aria-label="Eliminar doctor"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{t('doctor-permissions.permissions.basic-info')}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{t('doctor-permissions.permissions.allergies')}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{t('doctor-permissions.permissions.conditions')}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{t('doctor-permissions.permissions.medications')}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{t('doctor-permissions.permissions.surgeries')}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{t('doctor-permissions.permissions.lab-results')}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
              
              <div className="mt-3 flex items-center justify-between">
                <button
                  className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none active:outline-none cursor-pointer rounded px-2 py-1"
                  tabIndex={0}
                >
                  {t('doctor-permissions.preview-access')}
                </button>
                <span className="text-xs text-gray-500">4 {t('doctor-permissions.permissions-active', { total: 6 })}</span>
              </div>
            </div>

            {/* Doctor 2 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white font-semibold">
                    Dr
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Dr. Carlos Ramírez</h3>
                    <p className="text-sm text-gray-600">Medicina General • Centro Médico ABC</p>
                    <p className="text-xs text-gray-500">
                      {t('doctor-permissions.authorized-since')} 10 Sep 2024
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    {t('doctor-permissions.status-active')}
                  </span>
                  <button
                    className="text-gray-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                    tabIndex={0}
                    aria-label="Eliminar doctor"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{t('doctor-permissions.permissions.basic-info')}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{t('doctor-permissions.permissions.allergies')}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{t('doctor-permissions.permissions.conditions')}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{t('doctor-permissions.permissions.medications')}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{t('doctor-permissions.permissions.surgeries')}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{t('doctor-permissions.permissions.lab-results')}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
              
              <div className="mt-3 flex items-center justify-between">
                <button
                  className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none active:outline-none cursor-pointer rounded px-2 py-1"
                  tabIndex={0}
                >
                  {t('doctor-permissions.preview-access')}
                </button>
                <span className="text-xs text-gray-500">6 {t('doctor-permissions.permissions-active', { total: 6 })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalProfileContent;
