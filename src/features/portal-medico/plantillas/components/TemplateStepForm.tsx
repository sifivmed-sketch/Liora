'use client';

import { useTranslations } from 'next-intl';
import {
  encInput,
  encInputSelect,
  encTextarea,
  encLabel,
  encLabelReq,
  encFieldGroup,
  encFieldGrid,
  encHelper,
  encProfileGrid,
  encProfileField,
  encProfileLabel,
  encProfileValue,
  encBloodBadge,
  encSubsectionTitle,
  encNotice,
  encVitalsGrid,
  encVitalCard,
  encVitalLabel,
  encVitalInput,
  encConditionItem,
  encConditionLabel,
} from '@/features/portal-medico/consulta/styles/encounter-form-styles';

export type TemplateStepId = 1 | 2 | 3 | 4 | 5 | 6;

interface TemplateStepFormProps {
  stepId: TemplateStepId;
}

/**
 * Renders the form content for a single template step (consultation section).
 * Same fields as in Consulta for that step.
 *
 * @param stepId - Template/step id (1–6)
 * @returns Form JSX for the given step
 */
const TemplateStepForm = ({ stepId }: TemplateStepFormProps) => {
  const t = useTranslations('portal-medico.consultation');
  const stepLabel = (key: string) => t(`steps.${key}`);

  if (stepId === 1) {
    return (
      <div role="region" aria-label={stepLabel('1')}>
        <div className="bg-white rounded-[10px] border border-gray-200 mb-3.5 overflow-hidden">
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100 bg-gray-50">
            <span className="w-[22px] h-[22px] rounded-full bg-green-100 text-green-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">A</span>
            <h3 className="text-[12.5px] font-bold text-gray-900 flex-1 m-0">{t('panel1-section-a')}</h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{t('badge-optional')}</span>
          </div>
          <div className="px-5 py-4">
            <div className={encProfileGrid}>
              <div className={encProfileField}><span className={encProfileLabel}>Nombre completo</span><span className={encProfileValue}>—</span></div>
              <div className={encProfileField}><span className={encProfileLabel}>Fecha de nacimiento</span><span className={encProfileValue}>—</span></div>
              <div className={encProfileField}><span className={encProfileLabel}>Edad</span><span className={encProfileValue}>—</span></div>
              <div className={encProfileField}><span className={encProfileLabel}>Sexo biológico</span><span className={encProfileValue}>—</span></div>
              <div className={encProfileField}><span className={encProfileLabel}>Grupo sanguíneo</span><span className={encBloodBadge}>—</span></div>
              <div className={encProfileField}><span className={encProfileLabel}>MRN</span><span className={encProfileValue}>—</span></div>
            </div>
            <div className={encSubsectionTitle}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z" /></svg>
              Contacto
            </div>
            <div className={encFieldGrid}>
              <div className={encFieldGroup}><label className={encLabel} htmlFor="tpl1-tel">Teléfono principal</label><input id="tpl1-tel" type="tel" className={encInput} placeholder="(809) 000-0000" /></div>
              <div className={encFieldGroup}><label className={encLabel} htmlFor="tpl1-email">Correo electrónico</label><input id="tpl1-email" type="email" className={encInput} placeholder="correo@ejemplo.com" /></div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-[10px] border border-gray-200 mb-3.5 overflow-hidden">
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100 bg-gray-50">
            <span className="w-[22px] h-[22px] rounded-full bg-green-100 text-green-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">B</span>
            <h3 className="text-[12.5px] font-bold text-gray-900 flex-1 m-0">{t('panel1-section-b')}</h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">{t('badge-required')}</span>
          </div>
          <div className="px-5 py-4">
            <div className={`${encFieldGroup} mb-4`}>
              <label className={encLabelReq} htmlFor="tpl1-motivo">Motivo principal <span className="text-red-500">*</span></label>
              <input id="tpl1-motivo" type="text" className={encInput} placeholder="Ej.: Cefalea intensa de 3 días de evolución" />
              <span className={encHelper}>Describe el síntoma o problema en palabras del paciente</span>
            </div>
            <div className={encFieldGroup}>
              <label className={encLabel} htmlFor="tpl1-ampliacion">Ampliación del motivo</label>
              <textarea id="tpl1-ampliacion" className={encTextarea} rows={3} placeholder="Información adicional…" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stepId === 2) {
    return (
      <div role="region" aria-label={stepLabel('2')}>
        <div className="bg-white rounded-[10px] border border-gray-200 mb-3.5 overflow-hidden">
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100 bg-gray-50">
            <span className="w-[22px] h-[22px] rounded-full bg-green-100 text-green-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">A</span>
            <h3 className="text-[12.5px] font-bold text-gray-900 flex-1 m-0">Características del padecimiento</h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">{t('badge-required')}</span>
          </div>
          <div className="px-5 py-4">
            <div className={`${encFieldGrid} mb-4`}>
              <div className={encFieldGroup}>
                <label className={encLabelReq} htmlFor="tpl2-desde">Desde cuándo</label>
                <input id="tpl2-desde" type="text" className={encInput} placeholder="Ej.: 3 días / 2 semanas / 1 mes" />
                <span className={encHelper}>Tiempo de evolución del síntoma</span>
              </div>
              <div className={encFieldGroup}><label className={encLabel} htmlFor="tpl2-inicio">Forma de inicio</label><select id="tpl2-inicio" className={encInputSelect}><option value="">Seleccionar…</option><option>Súbito (brusco)</option><option>Gradual (progresivo)</option><option>Insidioso</option></select></div>
              <div className={encFieldGroup}><label className={encLabel} htmlFor="tpl2-local">Localización</label><input id="tpl2-local" type="text" className={encInput} placeholder="Ej.: Región frontal" /></div>
              <div className={encFieldGroup}><label className={encLabel} htmlFor="tpl2-irrad">Irradiación</label><input id="tpl2-irrad" type="text" className={encInput} placeholder="No irradia / Irradia hacia…" /></div>
            </div>
            <div className={`${encFieldGrid} mb-4`}>
              <div className={encFieldGroup}><label className={encLabel} htmlFor="tpl2-empeora">Qué lo empeora</label><textarea id="tpl2-empeora" className={encTextarea} rows={2} placeholder="Luz intensa, ruidos…" /></div>
              <div className={encFieldGroup}><label className={encLabel} htmlFor="tpl2-mejora">Qué lo mejora</label><textarea id="tpl2-mejora" className={encTextarea} rows={2} placeholder="Reposo, analgésicos…" /></div>
            </div>
            <div className={encFieldGroup}>
              <label className={encLabel} htmlFor="tpl2-med">Medicamentos tomados antes de la consulta</label>
              <textarea id="tpl2-med" className={encTextarea} rows={2} placeholder="Ibuprofeno 400 mg… / Ninguno" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stepId === 3) {
    return (
      <div role="region" aria-label={stepLabel('3')}>
        <div className="bg-white rounded-[10px] border border-gray-200 mb-3.5 overflow-hidden">
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100 bg-gray-50">
            <span className="w-[22px] h-[22px] rounded-full bg-green-100 text-green-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">A</span>
            <h3 className="text-[12.5px] font-bold text-gray-900 flex-1 m-0">Antecedentes Personales</h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{t('badge-optional')}</span>
          </div>
          <div className="px-5 py-4">
            <div className={encNotice} role="note">
              <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Los cambios realizados aquí actualizan el historial permanente del paciente.
            </div>
            <div className={`${encFieldGroup} mb-4`}><label className={encLabel} htmlFor="tpl3-alergias">Alergias conocidas</label><textarea id="tpl3-alergias" className={encTextarea} rows={2} placeholder="Penicilina → Anafilaxia" /></div>
            <div className={encFieldGroup}><label className={encLabel} htmlFor="tpl3-med">Medicamentos actuales</label><textarea id="tpl3-med" className={encTextarea} rows={3} placeholder="Nombre, dosis, frecuencia…" /></div>
          </div>
        </div>
        <div className="bg-white rounded-[10px] border border-gray-200 mb-3.5 overflow-hidden">
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100 bg-gray-50">
            <span className="w-[22px] h-[22px] rounded-full bg-green-100 text-green-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">B</span>
            <h3 className="text-[12.5px] font-bold text-gray-900 flex-1 m-0">Antecedentes Familiares</h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{t('badge-optional')}</span>
          </div>
          <div className="px-5 py-4">
            <div className={encFieldGroup}><label className={encLabel} htmlFor="tpl3-fam">Observaciones adicionales</label><textarea id="tpl3-fam" className={encTextarea} rows={2} placeholder="Padre: HTA, DM2. Madre: Osteoporosis." /></div>
          </div>
        </div>
      </div>
    );
  }

  if (stepId === 4) {
    return (
      <div role="region" aria-label={stepLabel('4')}>
        <div className="bg-white rounded-[10px] border border-gray-200 mb-3.5 overflow-hidden">
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100 bg-gray-50">
            <span className="w-[22px] h-[22px] rounded-full bg-green-100 text-green-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">A</span>
            <h3 className="text-[12.5px] font-bold text-gray-900 flex-1 m-0">Signos Vitales</h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">{t('badge-required')}</span>
          </div>
          <div className="px-5 py-4">
            <div className={encVitalsGrid}>
              <div className={encVitalCard}><div className="flex items-center justify-between mb-1.5"><span className={encVitalLabel}>TA (mmHg)</span></div><div className="flex items-center gap-1"><input type="number" className={encVitalInput} placeholder="120" /><span className="text-xl font-light text-gray-300">/</span><input type="number" className={encVitalInput} placeholder="80" /></div></div>
              <div className={encVitalCard}><div className="flex items-center justify-between mb-1.5"><span className={encVitalLabel}>FC (lpm)</span></div><input type="number" className={encVitalInput} placeholder="—" /></div>
              <div className={encVitalCard}><div className="flex items-center justify-between mb-1.5"><span className={encVitalLabel}>FR (rpm)</span></div><input type="number" className={encVitalInput} placeholder="—" /></div>
              <div className={encVitalCard}><div className="flex items-center justify-between mb-1.5"><span className={encVitalLabel}>Temp (°C)</span></div><input type="number" className={encVitalInput} placeholder="—" step="0.1" /></div>
              <div className={encVitalCard}><div className="flex items-center justify-between mb-1.5"><span className={encVitalLabel}>SpO₂ (%)</span></div><input type="number" className={encVitalInput} placeholder="—" /></div>
              <div className={encVitalCard}><div className="flex items-center justify-between mb-1.5"><span className={encVitalLabel}>Peso (kg)</span></div><input type="number" className={encVitalInput} placeholder="—" step="0.1" /></div>
              <div className={encVitalCard}><div className="flex items-center justify-between mb-1.5"><span className={encVitalLabel}>Talla (cm)</span></div><input type="number" className={encVitalInput} placeholder="—" /></div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-[10px] border border-gray-200 mb-3.5 overflow-hidden">
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100 bg-gray-50">
            <span className="w-[22px] h-[22px] rounded-full bg-green-100 text-green-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">B</span>
            <h3 className="text-[12.5px] font-bold text-gray-900 flex-1 m-0">Examen por Sistemas</h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{t('badge-optional')}</span>
          </div>
          <div className="px-5 py-4">
            <div className={encFieldGroup}><label className={encLabel} htmlFor="tpl4-hallazgos">Hallazgos relevantes adicionales</label><textarea id="tpl4-hallazgos" className={encTextarea} rows={3} placeholder="Describe cualquier hallazgo físico adicional…" /></div>
          </div>
        </div>
      </div>
    );
  }

  if (stepId === 5) {
    return (
      <div role="region" aria-label={stepLabel('5')}>
        <div className="bg-white rounded-[10px] border border-gray-200 mb-3.5 overflow-hidden">
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100 bg-gray-50">
            <span className="w-[22px] h-[22px] rounded-full bg-green-100 text-green-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">A</span>
            <h3 className="text-[12.5px] font-bold text-gray-900 flex-1 m-0">Diagnósticos</h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">{t('badge-required')}</span>
          </div>
          <div className="px-5 py-4">
            <div className={`${encFieldGroup} mb-4`}><label className={encLabel} htmlFor="tpl5-search">Buscar por código CIE-10 o nombre</label><input id="tpl5-search" type="search" className={encInput} placeholder="Buscar diagnóstico… (mínimo 2 caracteres)" /></div>
            <div className="p-3 mb-4 bg-gray-50 rounded-[7px] text-[13px] text-gray-500">Sin diagnósticos agregados aún</div>
            <div className={encFieldGroup}><label className={encLabel} htmlFor="tpl5-dif">Diagnósticos diferenciales</label><textarea id="tpl5-dif" className={encTextarea} rows={3} placeholder="Enumera los diagnósticos diferenciales…" /></div>
          </div>
        </div>
      </div>
    );
  }

  // stepId === 6
  return (
    <div role="region" aria-label={stepLabel('6')}>
      <div className="bg-white rounded-[10px] border border-gray-200 mb-3.5 overflow-hidden">
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100 bg-gray-50">
          <span className="w-[22px] h-[22px] rounded-full bg-green-100 text-green-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">A</span>
          <h3 className="text-[12.5px] font-bold text-gray-900 flex-1 m-0">Laboratorios e Imagen</h3>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{t('badge-optional')}</span>
        </div>
        <div className="px-5 py-4">
          <div className="space-y-2 mb-3">
            <label className={`${encConditionItem} w-fit`}><input type="checkbox" className="rounded border-gray-300 text-green-600" /><span className={encConditionLabel}>Hemograma completo</span></label>
            <label className={`${encConditionItem} w-fit`}><input type="checkbox" className="rounded border-gray-300 text-green-600" /><span className={encConditionLabel}>Glicemia en ayunas</span></label>
            <label className={`${encConditionItem} w-fit`}><input type="checkbox" className="rounded border-gray-300 text-green-600" /><span className={encConditionLabel}>Perfil lipídico</span></label>
            <label className={`${encConditionItem} w-fit`}><input type="checkbox" className="rounded border-gray-300 text-green-600" /><span className={encConditionLabel}>Rx de tórax</span></label>
            <label className={`${encConditionItem} w-fit`}><input type="checkbox" className="rounded border-gray-300 text-green-600" /><span className={encConditionLabel}>ECG</span></label>
          </div>
          <div className={encFieldGroup}><label className={encLabel} htmlFor="tpl6-otro">Otro estudio</label><input id="tpl6-otro" type="text" className={encInput} placeholder="Otro estudio…" /></div>
        </div>
      </div>
      <div className="bg-white rounded-[10px] border border-gray-200 mb-3.5 overflow-hidden">
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100 bg-gray-50">
          <span className="w-[22px] h-[22px] rounded-full bg-green-100 text-green-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">B</span>
          <h3 className="text-[12.5px] font-bold text-gray-900 flex-1 m-0">Medicamentos</h3>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{t('badge-optional')}</span>
        </div>
        <div className="px-5 py-4">
          <div className={encFieldGroup}><label className={encLabel} htmlFor="tpl6-med">Prescripción</label><textarea id="tpl6-med" className={encTextarea} rows={4} placeholder="Nombre — dosis — vía — frecuencia — duración" /></div>
          <span className={encHelper}>{t('medications-helper')}</span>
          <div className="flex justify-start mt-4">
            <button type="button" className="inline-flex items-center gap-2 px-3 py-1.5 border border-green-600 rounded-lg text-sm font-medium text-green-700 bg-white hover:bg-green-50">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              {t('new-prescription')}
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-[10px] border border-gray-200 mb-3.5 overflow-hidden">
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100 bg-gray-50">
          <span className="w-[22px] h-[22px] rounded-full bg-green-100 text-green-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">C</span>
          <h3 className="text-[12.5px] font-bold text-gray-900 flex-1 m-0">Referencias y Seguimiento</h3>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{t('badge-optional')}</span>
        </div>
        <div className="px-5 py-4">
          <div className={`${encFieldGrid} mb-4`}>
            <div className={encFieldGroup}><label className={encLabel} htmlFor="tpl6-ref">Referencia a especialidad</label><select id="tpl6-ref" className={encInputSelect}><option value="">Sin referencia</option><option>Neurología</option><option>Cardiología</option><option>Otra</option></select></div>
            <div className={encFieldGroup}><label className={encLabel} htmlFor="tpl6-motivo-ref">Motivo de referencia</label><input id="tpl6-motivo-ref" type="text" className={encInput} placeholder="Ej.: Evaluación cefalea" /></div>
          </div>
          <div className={`${encFieldGroup} mb-4`}><label className={encLabel} htmlFor="tpl6-fecha">Fecha de seguimiento</label><input id="tpl6-fecha" type="date" className={encInput} /></div>
          <div className={encFieldGroup}><label className={encLabel} htmlFor="tpl6-instr">Instrucciones al paciente</label><textarea id="tpl6-instr" className={encTextarea} rows={3} placeholder="Reposo, dieta, signos de alarma…" /></div>
        </div>
      </div>
    </div>
  );
};

export default TemplateStepForm;
