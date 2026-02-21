'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { deleteMedicalPortalSession } from '@/lib/auth/auth-actions';

/** Mock patient for record view */
const MOCK_BY_ID: Record<string, { name: string; age: number; avatarLetters: string; created: string }> = {
  '1': { name: 'Maria Garcia Lopez', age: 45, avatarLetters: 'MG', created: '10 ene 2025' },
  '2': { name: 'Jose Garcia Perez', age: 58, avatarLetters: 'JG', created: '05 ene 2025' },
  '3': { name: 'Ana Garcia Martinez', age: 32, avatarLetters: 'AG', created: '15 ene 2025' },
};

/** Mock consultations for clinical history tab */
const MOCK_CONSULTATIONS = [
  { id: '1', title: 'Consulta General', date: '31 ene 2026', doctor: 'Dr. Rodriguez Martinez', status: 'completed' as const, reason: 'Control de rutina', diagnosis: 'Paciente sano, continuar con hábitos saludables', indications: 'Mantener dieta balanceada y ejercicio regular' },
  { id: '2', title: 'Consulta de Seguimiento', date: '15 ene 2026', doctor: 'Dr. Rodriguez Martinez', status: 'completed' as const, reason: 'Revisión de resultados de laboratorio', diagnosis: 'Valores normales, evolución favorable', indications: 'Continuar con tratamiento actual' },
  { id: '3', title: 'Primera Consulta', date: '20 dic 2025', doctor: 'Dr. Rodriguez Martinez', status: 'completed' as const, reason: 'Evaluación inicial', diagnosis: 'Evaluación completa realizada, creación de expediente', indications: 'Realizar estudios de laboratorio de rutina' },
];

/** Mock prescriptions */
const MOCK_PRESCRIPTIONS = [
  { id: '1', name: 'Amoxicilina 500mg', prescribedDate: '31 ene 2026', doctor: 'Dr. Rodriguez Martinez', status: 'completed' as const, dose: '1 cápsula cada 8 horas', duration: '7 días', route: 'Oral', indications: 'Tomar con alimentos. Completar el tratamiento aunque se sienta mejor.' },
  { id: '2', name: 'Ibuprofeno 400mg', prescribedDate: '15 ene 2026', doctor: 'Dr. Rodriguez Martinez', status: 'completed' as const, dose: '1 tableta cada 6-8 horas', duration: 'Según necesidad', route: 'Oral', indications: 'Para dolor o fiebre. No exceder 3 tabletas al día. Tomar con alimentos.' },
  { id: '3', name: 'Omeprazol 20mg', prescribedDate: '20 dic 2025', doctor: 'Dr. Rodriguez Martinez', status: 'in_progress' as const, dose: '1 cápsula en ayunas', duration: '30 días (renovable)', route: 'Oral', indications: 'Tomar 30 minutos antes del desayuno. Tratamiento para gastritis.' },
];

/** Mock files for archives tab (type: 'doc' | 'image' for icon) */
const MOCK_FILES = [
  { id: '1', name: 'Resultados_Laboratorio_01-2026.pdf', uploadedDate: '10 ene 2026', size: '2.4 MB', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', type: 'doc' as const },
  { id: '2', name: 'Radiografia_Torax.jpg', uploadedDate: '05 ene 2026', size: '1.8 MB', iconBg: 'bg-green-100', iconColor: 'text-green-600', type: 'image' as const },
  { id: '3', name: 'Consentimiento_Informado.pdf', uploadedDate: '20 dic 2025', size: '850 KB', iconBg: 'bg-purple-100', iconColor: 'text-purple-600', type: 'doc' as const },
];

type SectionId = 'filiacion' | 'historia' | 'prescripciones' | 'archivos';
type FiliationSubTab = 'personales' | 'fiscales';

interface PatientRecordPageContentProps {
  patientId: string;
  userName: string;
}

/**
 * Top bar for the patient record full page: logo block, notifications, user dropdown.
 */
const PatientRecordHeader = ({
  userName,
  onLogout,
  onProfileClick,
  onSettingsClick,
}: {
  userName: string;
  onLogout: () => void;
  onProfileClick: () => void;
  onSettingsClick: () => void;
}) => {
  const t = useTranslations('portal-medico.patient-record');
  const tHeader = useTranslations('portal-medico.patient-record.header');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setUserMenuOpen(false);
    onProfileClick();
  };

  const handleSettingsClick = () => {
    setUserMenuOpen(false);
    onSettingsClick();
  };

  const handleLogoutClick = () => {
    setUserMenuOpen(false);
    onLogout();
  };

  const initials = userName
    .split(/\s+/)
    .map((s) => s[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="flex-shrink-0 bg-white border-b border-gray-200 z-30">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #2CA66F, #6FCF97)' }}
              aria-hidden
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">{t('title')}</div>
              <div className="text-xs text-gray-500">{t('subtitle')}</div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Notification icon removed from header per design */}
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              id="userMenuBtn"
              onClick={() => setUserMenuOpen((o) => !o)}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              aria-haspopup="true"
              aria-expanded={userMenuOpen}
              aria-label={userName}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #2CA66F, #6FCF97)' }}
              >
                {initials}
              </div>
              <span className="text-sm text-gray-600 hidden md:block">{userName}</span>
              <svg
                className="w-4 h-4 text-gray-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {userMenuOpen && (
              <div
                id="userMenu"
                className="absolute right-0 mt-1 w-48 py-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                role="menu"
                aria-hidden="false"
              >
                <button
                  type="button"
                  onClick={handleProfileClick}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  role="menuitem"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {tHeader('profile')}
                </button>
                <button
                  type="button"
                  onClick={handleSettingsClick}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  role="menuitem"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {tHeader('settings')}
                </button>
                <hr className="my-1 border-gray-200" />
                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  role="menuitem"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  {tHeader('logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

/**
 * Patient record (expediente) full page: own header, patient sidebar, and main content.
 * Filiation section includes sub-tabs (Datos Personales / Datos Fiscales) and demo form.
 */
const PatientRecordPageContent = ({ patientId, userName }: PatientRecordPageContentProps) => {
  const t = useTranslations('portal-medico.patient-record');
  const tTabs = useTranslations('portal-medico.patient-record.filiation-tabs');
  const tSections = useTranslations('portal-medico.patient-record.filiation-sections');
  const tFields = useTranslations('portal-medico.patient-record.filiation-fields');
  const tSex = useTranslations('portal-medico.patient-record.sex-options');
  const tHistory = useTranslations('portal-medico.patient-record.history');
  const tPresc = useTranslations('portal-medico.patient-record.prescriptions-section');
  const tArchives = useTranslations('portal-medico.patient-record.archives-section');
  const router = useRouter();

  const [activeSection, setActiveSection] = useState<SectionId>('filiacion');
  const [filiationSubTab, setFiliationSubTab] = useState<FiliationSubTab>('personales');

  const patient = MOCK_BY_ID[patientId] ?? {
    name: 'Paciente',
    age: 0,
    avatarLetters: 'P',
    created: '-',
  };

  const handleLogout = async () => {
    await deleteMedicalPortalSession();
    router.push('/portal-medico/login');
  };

  const handleProfileClick = () => router.push('/portal-medico/perfil');
  const handleSettingsClick = () => router.push('/portal-medico/configuracion' as Parameters<typeof router.push>[0]);

  const navItems: { id: SectionId; label: string; iconPath: string }[] = [
    { id: 'filiacion', label: t('filiation'), iconPath: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'historia', label: t('clinical-history'), iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'prescripciones', label: t('prescriptions'), iconPath: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
    { id: 'archivos', label: t('archives'), iconPath: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' },
  ];

  const inputClass =
    'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <PatientRecordHeader
        userName={userName}
        onLogout={handleLogout}
        onProfileClick={handleProfileClick}
        onSettingsClick={handleSettingsClick}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Patient sidebar: fixed width, no scroll (only inner nav scrolls) */}
        <aside
          className="w-72 h-full bg-white border-r border-gray-200 flex-shrink-0 flex flex-col overflow-hidden"
          role="complementary"
          aria-label={t('title')}
        >
          <div className="p-6 text-center border-b border-gray-100 flex-shrink-0">
            <div
              className="w-24 h-24 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl font-bold text-white border-4 border-gray-100"
              style={{ background: 'linear-gradient(135deg, #2F80ED, #56CCF2)' }}
            >
              {patient.avatarLetters}
            </div>
            <h2 className="text-lg font-bold text-gray-900">{patient.name}</h2>
            <p className="text-sm text-gray-500">{patient.age} años</p>
            <p className="text-xs text-gray-400 mt-1">Creado el {patient.created}</p>
            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                type="button"
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                title="WhatsApp"
                aria-label="WhatsApp"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                </svg>
              </button>
              <button
                type="button"
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                title="Email"
                aria-label="Email"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
              <button
                type="button"
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                title="Más opciones"
                aria-label="Más opciones"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="5" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="12" cy="19" r="2" />
                </svg>
              </button>
            </div>
          </div>
          <nav className="p-4 space-y-1 flex-1 min-h-0 overflow-y-auto" role="navigation" aria-label="Expediente">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm font-medium transition-colors ${
                  activeSection === item.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
                aria-current={activeSection === item.id ? 'true' : undefined}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.iconPath} />
                </svg>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-200 flex-shrink-0">
            <Link
              href="/portal-medico/pacientes"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t('exit-record')}
            </Link>
          </div>
        </aside>

        {/* Main content: inset (only this area scrolls) */}
        <main className="flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-hidden p-4 lg:p-6" role="main">
          {activeSection === 'filiacion' && (
            <div>
              <div className="flex items-center border-b border-gray-200 mb-6">
                <button
                  type="button"
                  onClick={() => setFiliationSubTab('personales')}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    filiationSubTab === 'personales'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tTabs('personal-data')}
                </button>
                <button
                  type="button"
                  onClick={() => setFiliationSubTab('fiscales')}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    filiationSubTab === 'fiscales'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tTabs('fiscal-data')}
                </button>
                <div className="ml-auto text-xs text-gray-400 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  {tTabs('edit-fields')}
                </div>
              </div>

              {filiationSubTab === 'personales' && (
                <div className="bg-white rounded-lg border border-gray-200 p-6 lg:p-8">
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-5">{tSections('basic-info')}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">{tFields('first-names')} <span className="text-red-500">*</span></label>
                          <input type="text" className={inputClass} defaultValue="Homero" />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">{tFields('last-names')} <span className="text-red-500">*</span></label>
                          <div className="grid grid-cols-2 gap-3">
                            <input type="text" className={inputClass} placeholder={tFields('paternal')} defaultValue="Prueba" />
                            <input type="text" className={inputClass} placeholder={tFields('maternal')} />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">{tFields('nickname')}</label>
                          <input type="text" className={inputClass} />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">{tFields('sex')}</label>
                          <select className={inputClass}>
                            <option>{tSex('man')}</option>
                            <option>{tSex('woman')}</option>
                            <option>{tSex('other')}</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-5">{tSections('document-id')}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">{tFields('doc-type-number')}</label>
                          <div className="flex gap-2">
                            <select className={inputClass} style={{ width: 140 }}>
                              <option>Cédula</option>
                              <option>Pasaporte</option>
                              <option>DNI</option>
                              <option>Otro</option>
                            </select>
                            <input type="text" className={`${inputClass} flex-1`} placeholder={tFields('doc-number')} />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">{tFields('clinical-history-number')}</label>
                          <input type="text" className={`${inputClass} bg-gray-50`} defaultValue="2" readOnly />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-5">{tSections('contact')}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">{tFields('mobile')}</label>
                          <div className="flex gap-2">
                            <select className={inputClass} style={{ width: 80 }}>
                              <option>DO</option>
                              <option>MX</option>
                              <option>US</option>
                            </select>
                            <input type="tel" className={`${inputClass} flex-1`} defaultValue="8292225560" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">{tFields('phone')}</label>
                          <input type="tel" className={inputClass} />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">{tFields('email')}</label>
                          <input type="email" className={inputClass} />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">{tFields('address')}</label>
                          <button type="button" className={`${inputClass} text-left flex items-center justify-between text-blue-600`}>
                            <span>+ {tFields('add-address')}</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-5">{tSections('demographics')}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">{tFields('birth-date')}</label>
                          <input type="date" className={inputClass} defaultValue="2000-01-01" />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">{tFields('birth-country')}</label>
                          <select className={inputClass}>
                            <option>República Dominicana</option>
                            <option>México</option>
                            <option>Colombia</option>
                            <option>Estados Unidos</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">{tFields('occupation')}</label>
                          <input type="text" className={inputClass} />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">{tFields('source')}</label>
                          <select className={inputClass}>
                            <option value="">{tFields('select')}</option>
                            <option>Referido</option>
                            <option>Redes sociales</option>
                            <option>Publicidad</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-5">{tSections('insurance')}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">{tFields('insurer')}</label>
                          <select className={inputClass}>
                            <option value="">{tFields('select')}</option>
                            <option>Humano</option>
                            <option>ARS Palic</option>
                            <option>Senasa</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">{tFields('business-line')}</label>
                          <select className={inputClass}>
                            <option value="">{tFields('select')}</option>
                            <option>Consulta general</option>
                            <option>Especialidad</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">{tFields('group')}</label>
                          <select className={inputClass}>
                            <option value="">{tFields('select')}</option>
                            <option>A</option>
                            <option>B</option>
                            <option>C</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">{tFields('additional-info')}</label>
                          <input type="text" className={inputClass} />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button type="button" className="px-6 py-2.5 text-white rounded-lg font-medium bg-blue-600 hover:bg-blue-700 transition-colors">
                        {tFields('save-changes')}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {filiationSubTab === 'fiscales' && (
                <div className="bg-white rounded-lg border border-gray-200 p-6 lg:p-8">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">{tFields('company-name')}</label>
                        <input type="text" className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">{tFields('rnc-tax-id')}</label>
                        <input type="text" className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">{tFields('fiscal-address')}</label>
                        <input type="text" className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">{tFields('fiscal-phone')}</label>
                        <input type="tel" className={inputClass} />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm text-gray-700 mb-2">{tFields('fiscal-email')}</label>
                        <input type="email" className={inputClass} />
                      </div>
                    </div>
                    <div className="pt-4">
                      <button type="button" className="px-6 py-2.5 text-white rounded-lg font-medium bg-blue-600 hover:bg-blue-700 transition-colors">
                        {tFields('save-changes')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === 'historia' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{tHistory('title')}</h3>
                <p className="text-sm text-gray-600">{tHistory('subtitle')}</p>
              </div>
              <div className="space-y-4">
                {MOCK_CONSULTATIONS.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow cursor-pointer"
                    role="button"
                    tabIndex={0}
                    onClick={() => {}}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }}
                    aria-label={c.title}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{c.title}</h4>
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                            {tHistory('status-completed')}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{c.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>{c.doctor}</span>
                          </div>
                        </div>
                      </div>
                      <button type="button" className="p-2 hover:bg-gray-100 rounded-lg" aria-label="Ver más">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700 mb-2"><strong>{tHistory('reason')}:</strong> {c.reason}</p>
                      <p className="text-sm text-gray-700 mb-2"><strong>{tHistory('diagnosis')}:</strong> {c.diagnosis}</p>
                      <p className="text-sm text-gray-700"><strong>{tHistory('indications')}:</strong> {c.indications}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <button type="button" className="text-sm font-medium text-blue-600 hover:underline">
                  {tHistory('view-all')}
                </button>
              </div>
            </div>
          )}
          {activeSection === 'prescripciones' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{tPresc('title')}</h3>
                <p className="text-sm text-gray-600">{tPresc('subtitle')}</p>
              </div>
              <div className="space-y-4">
                {MOCK_PRESCRIPTIONS.map((p) => (
                  <div key={p.id} className="bg-white border border-gray-200 rounded-lg p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{p.name}</h4>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              p.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {p.status === 'completed' ? tPresc('status-completed') : tPresc('status-in-progress')}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{tPresc('prescribed')}: {p.prescribedDate}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>{p.doctor}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">{tPresc('dose')}</p>
                        <p className="text-sm font-medium text-gray-900">{p.dose}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">{tPresc('duration')}</p>
                        <p className="text-sm font-medium text-gray-900">{p.duration}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">{tPresc('route')}</p>
                        <p className="text-sm font-medium text-gray-900">{p.route}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm text-gray-700"><strong>{tPresc('indications')}:</strong> {p.indications}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <button type="button" className="text-sm font-medium text-blue-600 hover:underline">
                  {tPresc('view-all')}
                </button>
              </div>
            </div>
          )}
          {activeSection === 'archivos' && (
            <div>
              <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
                <h3 className="text-lg font-semibold text-gray-800">{tArchives('title')}</h3>
                <button
                  type="button"
                  className="px-4 py-2 text-white rounded-lg font-medium text-sm bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  + {tArchives('upload')}
                </button>
              </div>
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder={tArchives('search-placeholder')}
                    className="w-full md:w-64 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="divide-y divide-gray-200">
                  {MOCK_FILES.map((f) => (
                    <div
                      key={f.id}
                      className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      role="button"
                      tabIndex={0}
                      aria-label={f.name}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${f.iconBg}`}>
                            {f.type === 'image' ? (
                              <svg className={`w-5 h-5 ${f.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            ) : (
                              <svg className={`w-5 h-5 ${f.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate">{f.name}</div>
                            <div className="text-sm text-gray-500">{tArchives('uploaded-on')} {f.uploadedDate} • {f.size}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button type="button" className="p-2 hover:bg-gray-100 rounded-lg" title={tArchives('download')} aria-label={tArchives('download')}>
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>
                          <button type="button" className="p-2 hover:bg-gray-100 rounded-lg" title={tArchives('delete')} aria-label={tArchives('delete')}>
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PatientRecordPageContent;
