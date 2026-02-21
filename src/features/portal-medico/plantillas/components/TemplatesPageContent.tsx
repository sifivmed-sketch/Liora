'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

const STEPS = [
  { id: 1, key: '1' },
  { id: 2, key: '2' },
  { id: 3, key: '3' },
  { id: 4, key: '4' },
  { id: 5, key: '5' },
  { id: 6, key: '6' },
] as const;

/** Panel titles and subtitles for each consultation step (for cards) */
const PANEL_TITLES: Record<number, { titleKey: string; subKey: string }> = {
  1: { titleKey: 'panel1-title', subKey: 'panel1-sub' },
  2: { titleKey: 'panel2-title', subKey: 'panel2-sub' },
  3: { titleKey: 'panel3-title', subKey: 'panel3-sub' },
  4: { titleKey: 'panel4-title', subKey: 'panel4-sub' },
  5: { titleKey: 'panel5-title', subKey: 'panel5-sub' },
  6: { titleKey: 'panel6-title', subKey: 'panel6-sub' },
};

/** Sections count and total fields per template step (for card stats) */
const TEMPLATE_STATS: Record<number, { sections: number; fields: number }> = {
  1: { sections: 2, fields: 12 },
  2: { sections: 1, fields: 8 },
  3: { sections: 2, fields: 6 },
  4: { sections: 2, fields: 15 },
  5: { sections: 1, fields: 3 },
  6: { sections: 3, fields: 10 },
};

/** Gradient classes for card icon (match record-templates.html order) */
const CARD_ICON_GRADIENT: Record<number, string> = {
  1: 'bg-gradient-to-br from-blue-500 to-blue-600',
  2: 'bg-gradient-to-br from-pink-500 to-pink-600',
  3: 'bg-gradient-to-br from-green-500 to-green-600',
  4: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
  5: 'bg-gradient-to-br from-red-500 to-red-600',
  6: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
};

/** Document icon SVG path (used for all template cards) */
const IconDocument = () => (
  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

/**
 * Plantillas page: same design as record-templates.html.
 * Grid of cards — one per consultation section (Identificación y Motivo, Enfermedad Actual, etc.).
 * Editar opens the form for that section (same fields as Consulta).
 */
const TemplatesPageContent = () => {
  const t = useTranslations('portal-medico.consultation');
  const tPl = useTranslations('portal-medico.templates');
  const [templateEnabled, setTemplateEnabled] = useState<Record<number, boolean>>({
    1: true, 2: true, 3: true, 4: false, 5: true, 6: true,
  });

  const handleToggle = (stepId: number) => {
    setTemplateEnabled((prev) => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const handlePreview = (stepId: number) => {
    // TODO: open preview modal or navigate to preview view
  };

  const handleDuplicate = (stepId: number) => {
    // TODO: duplicate template (e.g. copy config)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="flex-1 p-4 lg:p-6" role="main">
        <>
          {/* Page Header — same as record-templates.html */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{tPl('title')}</h1>
                <p className="text-gray-600 mt-1">{tPl('subtitle')}</p>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-300 transition-colors w-fit"
                aria-label={tPl('new-template')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {tPl('new-template')}
              </button>
            </div>

            {/* Info Banner — purple, same as record-templates */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-purple-900">{tPl('info-title')}</h3>
                  <p className="text-sm text-purple-800 mt-1">{tPl('info-body')}</p>
                </div>
              </div>
            </div>

            {/* Templates Grid — cards like record-templates */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" role="list">
              {STEPS.map((step) => {
                const { titleKey, subKey } = PANEL_TITLES[step.id];
                const { sections, fields } = TEMPLATE_STATS[step.id];
                const enabled = templateEnabled[step.id];
                return (
                  <article
                    key={step.id}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-lg transition-shadow"
                    role="listitem"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${CARD_ICON_GRADIENT[step.id]}`} aria-hidden>
                          <IconDocument />
                        </div>
                        <div className="min-w-0">
                          <h2 className="font-semibold text-gray-900 truncate">{t(titleKey)}</h2>
                          <p className="text-xs text-gray-500 truncate">{t(subKey)}</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-2" aria-label={enabled ? 'Desactivar plantilla' : 'Activar plantilla'}>
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={() => handleToggle(step.id)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600" />
                      </label>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{tPl('sections')}</span>
                        <span className="font-medium text-gray-900">{sections}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{tPl('total-fields')}</span>
                        <span className="font-medium text-gray-900">{fields}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{tPl('last-modified')}</span>
                        <span className="text-gray-500 text-xs">—</span>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                      <Link
                        href={{ pathname: '/portal-medico/plantillas/[id]', params: { id: String(step.id) } }}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 border border-violet-600 rounded-lg text-sm font-medium text-violet-600 bg-white hover:bg-violet-50 transition-colors"
                        aria-label={`${tPl('edit')} ${t(titleKey)}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        {tPl('edit')}
                      </Link>
                      <button
                        type="button"
                        onClick={() => handlePreview(step.id)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        aria-label={`${tPl('preview')} ${t(titleKey)}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {tPl('preview')}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDuplicate(step.id)}
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                        title={tPl('duplicate')}
                        aria-label={`${tPl('duplicate')} ${t(titleKey)}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
        </>
      </main>
    </div>
  );
};

export default TemplatesPageContent;
