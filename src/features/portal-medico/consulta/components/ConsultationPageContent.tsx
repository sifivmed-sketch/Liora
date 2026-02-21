'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { deleteMedicalPortalSession } from '@/lib/auth/auth-actions';

const STEPS = [
  { id: 1, key: '1' },
  { id: 2, key: '2' },
  { id: 3, key: '3' },
  { id: 4, key: '4' },
  { id: 5, key: '5' },
  { id: 6, key: '6' },
] as const;

interface ConsultationPageContentProps {
  userName: string;
}

/**
 * Encounter workspace header: logo, title, allergy chip, user dropdown.
 */
const EncounterHeader = ({
  userName,
  onLogout,
  onProfileClick,
}: {
  userName: string;
  onLogout: () => void;
  onProfileClick: () => void;
}) => {
  const t = useTranslations('portal-medico.consultation');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = userName.split(/\s+/).map((s) => s[0]).join('').toUpperCase().slice(0, 2);

  return (
    <header className="flex-shrink-0 bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        <div className="flex items-center gap-4">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #2CA66F, #6FCF97)' }}
            aria-hidden
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900 leading-tight">{t('title')}</div>
            <div className="text-xs text-gray-500">{t('subtitle')}</div>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-100 text-amber-800 text-sm font-medium hover:bg-amber-200 border border-amber-200"
          aria-label={t('allergies')}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92z" clipRule="evenodd" />
          </svg>
          {t('allergies')}: Penicilina
        </button>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
            aria-haspopup="true"
            aria-expanded={menuOpen}
          >
            <div className="text-right hidden md:block">
              <div className="text-sm font-semibold text-gray-900">{userName}</div>
              <div className="text-xs text-gray-500">Medicina Interna</div>
            </div>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #2CA66F, #6FCF97)' }}
            >
              {initials}
            </div>
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-1 w-48 py-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <button type="button" onClick={() => { setMenuOpen(false); onProfileClick(); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Perfil
              </button>
              <hr className="my-1 border-gray-200" />
              <button type="button" onClick={() => { setMenuOpen(false); onLogout(); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

/** Encounter form styles — match reference encounter-workspace.css (enc-*) */
const encInput =
  'w-full min-h-[40px] rounded-[7px] border-[1.5px] border-gray-300 bg-white py-[9px] px-3 text-[13px] text-gray-900 placeholder-gray-400 ' +
  'hover:border-gray-400 focus:border-blue-600 focus:outline-none focus:ring-[3px] focus:ring-blue-600/10 transition-colors';
const encInputSelect = encInput + ' cursor-pointer pr-9';
const encTextarea = encInput + ' min-h-[80px] resize-y leading-relaxed';
const encLabel = 'text-[11.5px] font-semibold text-gray-700';
const encLabelReq = encLabel; // add <span className="text-red-500"> *</span> in JSX for required
const encFieldGroup = 'flex flex-col gap-[5px]';
const encFieldGrid = 'grid grid-cols-1 sm:grid-cols-2 gap-3.5'; // 14px
const encFieldGrid3 = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5';
const encHelper = 'text-[10.5px] text-gray-500 leading-snug';
const encProfileGrid = 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4';
const encProfileField = 'flex flex-col gap-[3px]';
const encProfileLabel = 'text-[9.5px] font-bold uppercase tracking-[0.06em] text-gray-500';
const encProfileValue = 'text-[13px] font-semibold text-gray-900';
const encBloodBadge = 'inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-200';
const encSubsectionTitle = 'flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.07em] text-blue-600 pb-2 mb-3.5 border-b-2 border-blue-100';
const encNotice = 'flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-[7px] p-2.5 text-[11.5px] text-blue-800';
const encVitalsGrid = 'grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3';
const encVitalCard = 'bg-gray-50 border-[1.5px] border-gray-200 rounded-[9px] p-[11px] pr-3 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-[3px] focus-within:ring-blue-600/10 transition-colors';
const encVitalLabel = 'text-[9.5px] font-bold uppercase tracking-[0.05em] text-gray-500';
const encVitalInput = 'w-full border-0 bg-transparent p-0 text-[22px] font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-normal placeholder:text-sm focus:outline-none';
const encConditionItem = 'flex items-center gap-2 py-2 px-2.5 border border-gray-200 rounded-[7px] cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-colors has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50';
const encConditionLabel = 'text-xs text-gray-700 cursor-pointer leading-snug';

/**
 * Consultation (Historia Clínica) workspace — full page like encounter-workspace.
 * Header, control bar, 6-step wizard, and tab content per step.
 */
const ConsultationPageContent = ({ userName }: ConsultationPageContentProps) => {
  const t = useTranslations('portal-medico.consultation');
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  const handleLogout = async () => {
    await deleteMedicalPortalSession();
    router.push('/portal-medico/login');
  };

  const handleProfileClick = () => router.push('/portal-medico/perfil');

  const stepLabel = (key: string) => t(`steps.${key}`);

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <EncounterHeader userName={userName} onLogout={handleLogout} onProfileClick={handleProfileClick} />

      {/* Control bar — sticky, same structure as reference */}
      <div className="flex-shrink-0 sticky top-[57px] z-30 bg-white border-b border-gray-200 px-6 min-h-[52px] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1 overflow-hidden">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-[11px] flex-shrink-0" style={{ background: 'linear-gradient(135deg, #2F80ED, #56CCF2)' }} aria-hidden>MG</div>
          <div className="min-w-0">
            <div className="text-[13px] font-bold text-gray-900 truncate">Maria Garcia Lopez</div>
            <div className="text-[11px] text-gray-500 whitespace-nowrap hidden lg:block">45 años · Femenino · O+ · MRN-2025-00001</div>
          </div>
          <div className="w-px h-[22px] bg-gray-200 flex-shrink-0 hidden lg:block" aria-hidden />
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-amber-100 text-amber-800 border border-amber-200 flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden />
            {t('in-progress')} · {t('draft')}
          </div>
          <div className="hidden xl:flex items-center gap-1 text-[11px] text-gray-500 flex-shrink-0">
            <svg className="w-[11px] h-[11px] text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            <span>{t('autosave')}</span>
          </div>
        </div>
        <div className="flex-shrink-0">
          <Link href="/portal-medico/sala-espera" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 py-1.5 px-2.5 rounded-md hover:bg-gray-100 hover:text-gray-700 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            <span>{t('exit')}</span>
          </Link>
        </div>
      </div>

      {/* Wizard stepper — desktop: dot above label, connectors (reference layout) */}
      <nav className="hidden md:flex flex-shrink-0 bg-white border-b border-gray-200 py-4 px-8 overflow-x-auto justify-center items-end gap-0" aria-label="Pasos de la historia clínica">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-end gap-0">
            <button
              type="button"
              onClick={() => setCurrentStep(step.id)}
              className={`flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer transition-colors ${
                currentStep === step.id ? 'opacity-100' : 'opacity-90 hover:opacity-100'
              }`}
              aria-current={currentStep === step.id ? 'step' : undefined}
              aria-label={`Paso ${step.id}: ${stepLabel(step.key)}`}
            >
              <span className={`w-[30px] h-[30px] rounded-full flex items-center justify-center text-xs font-bold border-2 flex-shrink-0 ${
                currentStep === step.id
                  ? 'border-blue-600 bg-blue-600 text-white shadow-[0_0_0_4px_rgba(37,99,235,0.15)]'
                  : 'border-gray-300 bg-white text-gray-400'
              }`}>{step.id}</span>
              <span className={`text-[10.5px] font-semibold text-center leading-tight max-w-[80px] ${
                currentStep === step.id ? 'text-blue-600' : 'text-gray-400'
              }`}>{stepLabel(step.key)}</span>
            </button>
            {index < STEPS.length - 1 && <span className="w-12 h-0.5 bg-gray-200 flex-shrink-0 mb-[22px] mx-0" aria-hidden />}
          </div>
        ))}
      </nav>

      {/* Wizard mobile */}
      <div className="md:hidden flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3" aria-live="polite">
        <div className="flex justify-between items-center gap-2 mb-2">
          <span className="text-sm font-medium text-gray-600">{t('step')} {currentStep} {t('of')} 6</span>
          <span className="text-sm font-medium text-gray-900">{stepLabel(String(currentStep))}</span>
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${(currentStep / 6) * 100}%` }} />
        </div>
      </div>

      {/* Main — panels (max-width 900px, padding as reference) */}
      <main className="flex-1 min-h-0 overflow-y-auto">
        <div className="max-w-[900px] mx-auto px-6 pt-6 pb-10">
          {currentStep === 1 && (
            <div role="region" aria-label="Paso 1: Identificación y Motivo">
              {/* Step header — badge + title + sub */}
              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b-2 border-blue-100">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-[13px] font-bold flex-shrink-0" aria-hidden>1</div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 m-0">{t('panel1-title')}</h1>
                  <div className="text-xs text-gray-500 mt-0.5">{t('panel1-sub')}</div>
                </div>
              </div>

              {/* Section A — Ficha de Identificación */}
              <div className="bg-white rounded-[10px] border border-gray-200 mb-3.5 overflow-hidden">
                <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <span className="w-[22px] h-[22px] rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">A</span>
                  <h2 className="text-[12.5px] font-bold text-gray-900 flex-1 m-0">{t('panel1-section-a')}</h2>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-800">{t('badge-done')}</span>
                </div>
                <div className="px-5 py-4">
                  <div className={encProfileGrid}>
                    <div className={encProfileField}><span className={encProfileLabel}>Nombre completo</span><span className={encProfileValue}>Maria Garcia Lopez</span></div>
                    <div className={encProfileField}><span className={encProfileLabel}>Fecha de nacimiento</span><span className={encProfileValue}>15/03/1980</span></div>
                    <div className={encProfileField}><span className={encProfileLabel}>Edad</span><span className={encProfileValue}>45 años</span></div>
                    <div className={encProfileField}><span className={encProfileLabel}>Sexo biológico</span><span className={encProfileValue}>Femenino</span></div>
                    <div className={encProfileField}><span className={encProfileLabel}>Grupo sanguíneo</span><span className={encBloodBadge}>O+</span></div>
                    <div className={encProfileField}><span className={encProfileLabel}>MRN</span><span className={encProfileValue}>MRN-2025-00001</span></div>
                  </div>
                  <div className={encSubsectionTitle}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z" /></svg>
                    Contacto
                  </div>
                  <div className={encFieldGrid}>
                    <div className={encFieldGroup}><label className={encLabel} htmlFor="ficha-telefono">Teléfono principal</label><input id="ficha-telefono" type="tel" className={encInput} defaultValue="(809) 555-1234" placeholder="(809) 000-0000" /></div>
                    <div className={encFieldGroup}><label className={encLabel} htmlFor="ficha-email">Correo electrónico</label><input id="ficha-email" type="email" className={encInput} defaultValue="m.garcia@email.com" placeholder="correo@ejemplo.com" /></div>
                  </div>
                </div>
              </div>

              {/* Section B — Motivo de Consulta */}
              <div className="bg-white rounded-[10px] border border-gray-200 mb-3.5 overflow-hidden">
                <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <span className="w-[22px] h-[22px] rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">B</span>
                  <h2 className="text-[12.5px] font-bold text-gray-900 flex-1 m-0">{t('panel1-section-b')}</h2>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">{t('badge-required')}</span>
                </div>
                <div className="px-5 py-4">
                  <div className={`${encFieldGroup} mb-4`}>
                    <label className={encLabelReq} htmlFor="motivo-principal">Motivo principal <span className="text-red-500">*</span></label>
                    <input id="motivo-principal" type="text" className={encInput} placeholder="Ej.: Cefalea intensa de 3 días de evolución" aria-describedby="motivo-help" autoComplete="off" />
                    <span id="motivo-help" className={encHelper}>Describe el síntoma o problema en palabras del paciente</span>
                  </div>
                  <div className={encFieldGroup}>
                    <label className={encLabel} htmlFor="motivo-ampliacion">Ampliación del motivo</label>
                    <textarea id="motivo-ampliacion" className={encTextarea} rows={3} placeholder="Información adicional sobre el motivo de la consulta…" />
                  </div>
                </div>
              </div>

              {/* Wizard nav — 3 columns: prev | save | next (reference enc-wizard-nav) */}
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2.5 pt-4 mt-1 border-t border-gray-200">
                <div className="justify-self-start" />
                <div className="justify-self-center">
                  <button type="button" className="inline-flex items-center gap-2 px-3 py-1.5 border border-green-600 rounded-lg text-sm font-medium text-green-700 bg-white hover:bg-green-50">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                    {t('save-draft')}
                  </button>
                </div>
                <div className="justify-self-end">
                  <button type="button" onClick={() => setCurrentStep(2)} className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                    {t('next')}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div role="region" aria-label="Paso 2: Enfermedad Actual">
              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b-2 border-blue-100">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-[13px] font-bold flex-shrink-0" aria-hidden>2</div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 m-0">{t('panel2-title')}</h1>
                  <div className="text-xs text-gray-500 mt-0.5">{t('panel2-sub')}</div>
                </div>
              </div>
              <div className="bg-white rounded-[10px] border border-gray-200 mb-3.5 overflow-hidden">
                <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <span className="w-[22px] h-[22px] rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">A</span>
                  <h2 className="text-[12.5px] font-bold text-gray-900 flex-1 m-0">Características del padecimiento</h2>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">{t('badge-required')}</span>
                </div>
                <div className="px-5 py-4">
                  <div className={`${encFieldGrid} mb-4`}>
                    <div className={encFieldGroup}>
                      <label className={encLabelReq} htmlFor="ea-desde-cuando">Desde cuándo</label>
                      <input id="ea-desde-cuando" type="text" className={encInput} placeholder="Ej.: 3 días / 2 semanas / 1 mes" aria-describedby="ea-desde-help" />
                      <span id="ea-desde-help" className={encHelper}>Tiempo de evolución del síntoma</span>
                    </div>
                    <div className={encFieldGroup}><label className={encLabel} htmlFor="ea-inicio">Forma de inicio</label><select id="ea-inicio" className={encInputSelect}><option value="">Seleccionar…</option><option>Súbito (brusco)</option><option>Gradual (progresivo)</option><option>Insidioso (lento e imperceptible)</option></select></div>
                    <div className={encFieldGroup}><label className={encLabel} htmlFor="ea-localizacion">Localización</label><input id="ea-localizacion" type="text" className={encInput} placeholder="Ej.: Región frontal y temporal bilateral" /></div>
                    <div className={encFieldGroup}><label className={encLabel} htmlFor="ea-irradiacion">Irradiación</label><input id="ea-irradiacion" type="text" className={encInput} placeholder="Ej.: No irradia / Irradia hacia…" /></div>
                  </div>
                  <div className={`${encFieldGrid} mb-4`}>
                    <div className={encFieldGroup}><label className={encLabel} htmlFor="ea-agrava">Qué lo empeora</label><textarea id="ea-agrava" className={encTextarea} rows={2} placeholder="Ej.: Luz intensa, ruidos fuertes, movimiento…" /></div>
                    <div className={encFieldGroup}><label className={encLabel} htmlFor="ea-alivia">Qué lo mejora</label><textarea id="ea-alivia" className={encTextarea} rows={2} placeholder="Ej.: Reposo en oscuridad, frío local, analgésicos…" /></div>
                  </div>
                  <div className={encFieldGroup}>
                    <label className={encLabel} htmlFor="ea-medicamentos">Medicamentos tomados antes de la consulta</label>
                    <textarea id="ea-medicamentos" className={encTextarea} rows={2} placeholder="Ej.: Ibuprofeno 400 mg cada 8 h (sin mejoría) / Ninguno" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2.5 pt-4 mt-1 border-t border-gray-200">
                <div className="justify-self-start">
                  <button type="button" onClick={() => setCurrentStep(1)} className="inline-flex items-center gap-2 px-3 py-1.5 border border-green-600 rounded-lg text-sm font-medium text-green-700 bg-white hover:bg-green-50">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    {t('prev')}
                  </button>
                </div>
                <div className="justify-self-center">
                  <button type="button" className="inline-flex items-center gap-2 px-3 py-1.5 border border-green-600 rounded-lg text-sm font-medium text-green-700 bg-white hover:bg-green-50"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>{t('save-draft')}</button>
                </div>
                <div className="justify-self-end">
                  <button type="button" onClick={() => setCurrentStep(3)} className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">{t('next')} <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div role="region" aria-label="Paso 3: Antecedentes">
              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b-2 border-blue-100">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-[13px] font-bold flex-shrink-0" aria-hidden>3</div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 m-0">{t('panel3-title')}</h1>
                  <div className="text-xs text-gray-500 mt-0.5">{t('panel3-sub')}</div>
                </div>
              </div>
              <div className="bg-white rounded-[10px] border border-gray-200 mb-3.5 overflow-hidden">
                <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <span className="w-[22px] h-[22px] rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">A</span>
                  <h2 className="text-[12.5px] font-bold text-gray-900 flex-1 m-0">Antecedentes Personales</h2>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{t('badge-optional')}</span>
                </div>
                <div className="px-5 py-4">
                  <div className={encNotice} role="note">
                    <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Los cambios realizados aquí actualizan el historial permanente del paciente.
                  </div>
                  <div className={`${encFieldGroup} mb-4`}><label className={encLabel} htmlFor="ant-alergias">Alergias conocidas</label><textarea id="ant-alergias" className={encTextarea} rows={2} defaultValue="Penicilina → Anafilaxia severa" /></div>
                  <div className={encFieldGroup}><label className={encLabel} htmlFor="ant-medicamentos">Medicamentos actuales</label><textarea id="ant-medicamentos" className={encTextarea} rows={3} placeholder="Nombre, dosis, frecuencia…" defaultValue={'Omeprazol 20 mg — 1 vez/día\nLosartán 50 mg — 1 vez/día\nMetformina 850 mg — 2 veces/día'} /></div>
                </div>
              </div>
              <div className="bg-white rounded-[10px] border border-gray-200 mb-3.5 overflow-hidden">
                <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <span className="w-[22px] h-[22px] rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">B</span>
                  <h2 className="text-[12.5px] font-bold text-gray-900 flex-1 m-0">Antecedentes Familiares</h2>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{t('badge-optional')}</span>
                </div>
                <div className="px-5 py-4">
                  <div className={encFieldGroup}><label className={encLabel} htmlFor="ant-fam-obs">Observaciones adicionales</label><textarea id="ant-fam-obs" className={encTextarea} rows={2} placeholder="Padre: HTA, DM2. Madre: Osteoporosis." defaultValue="Padre: HTA, DM2. Madre: Osteoporosis." /></div>
                </div>
              </div>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2.5 pt-4 mt-1 border-t border-gray-200">
                <div className="justify-self-start">
                  <button type="button" onClick={() => setCurrentStep(2)} className="inline-flex items-center gap-2 px-3 py-1.5 border border-green-600 rounded-lg text-sm font-medium text-green-700 bg-white hover:bg-green-50">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    {t('prev')}
                  </button>
                </div>
                <div className="justify-self-center">
                  <button type="button" className="inline-flex items-center gap-2 px-3 py-1.5 border border-green-600 rounded-lg text-sm font-medium text-green-700 bg-white hover:bg-green-50"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>{t('save-draft')}</button>
                </div>
                <div className="justify-self-end">
                  <button type="button" onClick={() => setCurrentStep(4)} className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">{t('next')} <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div role="region" aria-label="Paso 4: Examen Físico">
              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b-2 border-blue-100">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-[13px] font-bold flex-shrink-0" aria-hidden>4</div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 m-0">{t('panel4-title')}</h1>
                  <div className="text-xs text-gray-500 mt-0.5">{t('panel4-sub')}</div>
                </div>
              </div>
              <div className="bg-white rounded-[10px] border border-gray-200 mb-3.5 overflow-hidden">
                <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <span className="w-[22px] h-[22px] rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">A</span>
                  <h2 className="text-[12.5px] font-bold text-gray-900 flex-1 m-0">Signos Vitales</h2>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">{t('badge-required')}</span>
                </div>
                <div className="px-5 py-4">
                  <div className={encVitalsGrid}>
                    <div className={encVitalCard}>
                      <div className="flex items-center justify-between mb-1.5"><span className={encVitalLabel}>TA (mmHg)</span><span className="text-[9.5px] text-gray-400">—</span></div>
                      <div className="flex items-center gap-1"><input type="number" className={encVitalInput} placeholder="120" aria-label="Tensión sistólica" /><span className="text-xl font-light text-gray-300 mt-0.5">/</span><input type="number" className={encVitalInput} placeholder="80" aria-label="Tensión diastólica" /></div>
                    </div>
                    <div className={encVitalCard}>
                      <div className="flex items-center justify-between mb-1.5"><span className={encVitalLabel}>FC (lpm)</span><span className="text-[9.5px] text-gray-400">—</span></div>
                      <input type="number" className={encVitalInput} placeholder="—" aria-label="Frecuencia cardíaca" />
                    </div>
                    <div className={encVitalCard}>
                      <div className="flex items-center justify-between mb-1.5"><span className={encVitalLabel}>FR (rpm)</span><span className="text-[9.5px] text-gray-400">—</span></div>
                      <input type="number" className={encVitalInput} placeholder="—" aria-label="Frecuencia respiratoria" />
                    </div>
                    <div className={encVitalCard}>
                      <div className="flex items-center justify-between mb-1.5"><span className={encVitalLabel}>Temp (°C)</span><span className="text-[9.5px] text-gray-400">—</span></div>
                      <input type="number" className={encVitalInput} placeholder="—" step="0.1" aria-label="Temperatura" />
                    </div>
                    <div className={encVitalCard}>
                      <div className="flex items-center justify-between mb-1.5"><span className={encVitalLabel}>SpO₂ (%)</span><span className="text-[9.5px] text-gray-400">—</span></div>
                      <input type="number" className={encVitalInput} placeholder="—" aria-label="Saturación" />
                    </div>
                    <div className={encVitalCard}>
                      <div className="flex items-center justify-between mb-1.5"><span className={encVitalLabel}>Peso (kg)</span><span className="text-[9.5px] text-gray-400">—</span></div>
                      <input type="number" className={encVitalInput} placeholder="—" step="0.1" aria-label="Peso" />
                    </div>
                    <div className={encVitalCard}>
                      <div className="flex items-center justify-between mb-1.5"><span className={encVitalLabel}>Talla (cm)</span><span className="text-[9.5px] text-gray-400">—</span></div>
                      <input type="number" className={encVitalInput} placeholder="—" aria-label="Talla" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-[10px] border border-gray-200 mb-3.5 overflow-hidden">
                <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <span className="w-[22px] h-[22px] rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">B</span>
                  <h2 className="text-[12.5px] font-bold text-gray-900 flex-1 m-0">Examen por Sistemas</h2>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{t('badge-optional')}</span>
                </div>
                <div className="px-5 py-4">
                  <div className={encFieldGroup}><label className={encLabel} htmlFor="examen-hallazgos">Hallazgos relevantes adicionales</label><textarea id="examen-hallazgos" className={encTextarea} rows={3} placeholder="Describe cualquier hallazgo físico adicional…" /></div>
                </div>
              </div>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2.5 pt-4 mt-1 border-t border-gray-200">
                <div className="justify-self-start">
                  <button type="button" onClick={() => setCurrentStep(3)} className="inline-flex items-center gap-2 px-3 py-1.5 border border-green-600 rounded-lg text-sm font-medium text-green-700 bg-white hover:bg-green-50">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    {t('prev')}
                  </button>
                </div>
                <div className="justify-self-center">
                  <button type="button" className="inline-flex items-center gap-2 px-3 py-1.5 border border-green-600 rounded-lg text-sm font-medium text-green-700 bg-white hover:bg-green-50"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>{t('save-draft')}</button>
                </div>
                <div className="justify-self-end">
                  <button type="button" onClick={() => setCurrentStep(5)} className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">{t('next')} <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div role="region" aria-label="Paso 5: Impresión Diagnóstica">
              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b-2 border-blue-100">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-[13px] font-bold flex-shrink-0" aria-hidden>5</div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 m-0">{t('panel5-title')}</h1>
                  <div className="text-xs text-gray-500 mt-0.5">{t('panel5-sub')}</div>
                </div>
              </div>
              <div className="bg-white rounded-[10px] border border-gray-200 mb-3.5 overflow-hidden">
                <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <span className="w-[22px] h-[22px] rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">A</span>
                  <h2 className="text-[12.5px] font-bold text-gray-900 flex-1 m-0">Diagnósticos</h2>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">{t('badge-required')}</span>
                </div>
                <div className="px-5 py-4">
                  <div className={`${encFieldGroup} mb-4`}><label className={encLabel} htmlFor="diag-search">Buscar por código CIE-10 o nombre</label><input id="diag-search" type="search" className={encInput} placeholder="Buscar diagnóstico… (mínimo 2 caracteres)" /></div>
                  <div className="p-3 mb-4 bg-gray-50 rounded-[7px] text-[13px] text-gray-500">Sin diagnósticos agregados aún</div>
                  <div className={encFieldGroup}><label className={encLabel} htmlFor="diag-diferenciales">Diagnósticos diferenciales</label><textarea id="diag-diferenciales" className={encTextarea} rows={3} placeholder="Enumera los diagnósticos diferenciales…" /></div>
                </div>
              </div>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2.5 pt-4 mt-1 border-t border-gray-200">
                <div className="justify-self-start">
                  <button type="button" onClick={() => setCurrentStep(4)} className="inline-flex items-center gap-2 px-3 py-1.5 border border-green-600 rounded-lg text-sm font-medium text-green-700 bg-white hover:bg-green-50">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    {t('prev')}
                  </button>
                </div>
                <div className="justify-self-center">
                  <button type="button" className="inline-flex items-center gap-2 px-3 py-1.5 border border-green-600 rounded-lg text-sm font-medium text-green-700 bg-white hover:bg-green-50"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>{t('save-draft')}</button>
                </div>
                <div className="justify-self-end">
                  <button type="button" onClick={() => setCurrentStep(6)} className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">{t('next')} <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div role="region" aria-label="Paso 6: Plan">
              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b-2 border-blue-100">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-[13px] font-bold flex-shrink-0" aria-hidden>6</div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 m-0">{t('panel6-title')}</h1>
                  <div className="text-xs text-gray-500 mt-0.5">{t('panel6-sub')}</div>
                </div>
              </div>
              <div className="bg-white rounded-[10px] border border-gray-200 mb-3.5 overflow-hidden">
                <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <span className="w-[22px] h-[22px] rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">A</span>
                  <h2 className="text-[12.5px] font-bold text-gray-900 flex-1 m-0">Laboratorios e Imagen</h2>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{t('badge-optional')}</span>
                </div>
                <div className="px-5 py-4">
                  <div className="space-y-2 mb-3">
                    <label className={`${encConditionItem} w-fit`}><input type="checkbox" className="rounded border-gray-300 text-blue-600" /><span className={encConditionLabel}>Hemograma completo</span></label>
                    <label className={`${encConditionItem} w-fit`}><input type="checkbox" className="rounded border-gray-300 text-blue-600" /><span className={encConditionLabel}>Glicemia en ayunas</span></label>
                    <label className={`${encConditionItem} w-fit`}><input type="checkbox" className="rounded border-gray-300 text-blue-600" /><span className={encConditionLabel}>Perfil lipídico</span></label>
                    <label className={`${encConditionItem} w-fit`}><input type="checkbox" className="rounded border-gray-300 text-blue-600" /><span className={encConditionLabel}>Rx de tórax</span></label>
                    <label className={`${encConditionItem} w-fit`}><input type="checkbox" className="rounded border-gray-300 text-blue-600" /><span className={encConditionLabel}>ECG</span></label>
                  </div>
                  <div className={encFieldGroup}><label className={encLabel} htmlFor="plan-otro-estudio">Otro estudio</label><input id="plan-otro-estudio" type="text" className={encInput} placeholder="Otro estudio…" /></div>
                </div>
              </div>
              <div className="bg-white rounded-[10px] border border-gray-200 mb-3.5 overflow-hidden">
                <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <span className="w-[22px] h-[22px] rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">B</span>
                  <h2 className="text-[12.5px] font-bold text-gray-900 flex-1 m-0">Medicamentos</h2>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{t('badge-optional')}</span>
                </div>
                <div className="px-5 py-4">
                  <div className={encFieldGroup}>
                    <label className={encLabel} htmlFor="plan-medicamentos">Prescripción</label>
                    <textarea id="plan-medicamentos" className={encTextarea} rows={4} placeholder="Nombre del medicamento — dosis — vía — frecuencia — duración. Ej.: Sumatriptán 50 mg — oral — al inicio de cefalea — máx. 2 comp/día — 5 días." />
                    <span className={encHelper}>{t('medications-helper')}</span>
                  </div>
                  <div className="flex justify-start mt-4">
                    <button type="button" className="inline-flex items-center gap-2 px-3 py-1.5 border border-green-600 rounded-lg text-sm font-medium text-green-700 bg-white hover:bg-green-50">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      {t('new-prescription')}
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-[10px] border border-gray-200 mb-3.5 overflow-hidden">
                <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <span className="w-[22px] h-[22px] rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">C</span>
                  <h2 className="text-[12.5px] font-bold text-gray-900 flex-1 m-0">Referencias y Seguimiento</h2>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{t('badge-optional')}</span>
                </div>
                <div className="px-5 py-4">
                  <div className={`${encFieldGrid} mb-4`}>
                    <div className={encFieldGroup}><label className={encLabel} htmlFor="plan-referencia">Referencia a especialidad</label><select id="plan-referencia" className={encInputSelect}><option value="">Sin referencia</option><option>Neurología</option><option>Cardiología</option><option>Otra</option></select></div>
                    <div className={encFieldGroup}><label className={encLabel} htmlFor="plan-motivo-ref">Motivo de referencia</label><input id="plan-motivo-ref" type="text" className={encInput} placeholder="Ej.: Evaluación cefalea" /></div>
                  </div>
                  <div className={`${encFieldGroup} mb-4`}><label className={encLabel} htmlFor="plan-fecha-seg">Fecha de seguimiento</label><input id="plan-fecha-seg" type="date" className={encInput} /></div>
                  <div className={encFieldGroup}><label className={encLabel} htmlFor="plan-instrucciones">Instrucciones al paciente</label><textarea id="plan-instrucciones" className={encTextarea} rows={3} placeholder="Reposo, dieta, signos de alarma…" /></div>
                </div>
              </div>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2.5 pt-4 mt-1 border-t border-gray-200">
                <div className="justify-self-start">
                  <button type="button" onClick={() => setCurrentStep(5)} className="inline-flex items-center gap-2 px-3 py-1.5 border border-green-600 rounded-lg text-sm font-medium text-green-700 bg-white hover:bg-green-50">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    {t('prev')}
                  </button>
                </div>
                <div className="justify-self-center">
                  <button type="button" className="inline-flex items-center gap-2 px-3 py-1.5 border border-green-600 rounded-lg text-sm font-medium text-green-700 bg-white hover:bg-green-50"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>{t('save-draft')}</button>
                </div>
                <div className="justify-self-end">
                  <button type="button" className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {t('finish')}
                </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ConsultationPageContent;
