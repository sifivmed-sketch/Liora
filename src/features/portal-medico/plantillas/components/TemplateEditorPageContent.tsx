'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import TemplateSectionsBuilder from './TemplateSectionsBuilder';
import { type TemplateStepId } from './TemplateStepForm';

const PANEL_TITLES: Record<TemplateStepId, { titleKey: string; subKey: string }> = {
  1: { titleKey: 'panel1-title', subKey: 'panel1-sub' },
  2: { titleKey: 'panel2-title', subKey: 'panel2-sub' },
  3: { titleKey: 'panel3-title', subKey: 'panel3-sub' },
  4: { titleKey: 'panel4-title', subKey: 'panel4-sub' },
  5: { titleKey: 'panel5-title', subKey: 'panel5-sub' },
  6: { titleKey: 'panel6-title', subKey: 'panel6-sub' },
};

interface TemplateEditorPageContentProps {
  templateId: TemplateStepId;
}

/**
 * Template editor page content. Same layout as record-template-editor.html:
 * back link, header with template name, Vista Previa + Guardar Plantilla,
 * Información Básica card, Secciones y Campos with the step form.
 *
 * @param templateId - Template/step id from URL (1–6)
 */
const TemplateEditorPageContent = ({ templateId }: TemplateEditorPageContentProps) => {
  const t = useTranslations('portal-medico.consultation');
  const tPl = useTranslations('portal-medico.templates');
  const { titleKey, subKey } = PANEL_TITLES[templateId];
  const templateName = t(titleKey);

  const handleSave = () => {
    // TODO: persist template (name, description, section config)
  };

  const handlePreview = () => {
    // TODO: open preview modal
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="flex-1 p-4 lg:p-6 w-full" role="main">
        <div className="w-full">
          {/* Back to plantillas — same as record-template-editor */}
          <div className="mb-4">
            <Link
              href="/portal-medico/plantillas"
              className="inline-flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-900"
              aria-label={tPl('back')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {tPl('back')}
            </Link>
          </div>

          {/* Page Header — Editor de Plantilla: [name] + buttons */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {tPl('editor-title')}: <span>{templateName}</span>
              </h1>
              <p className="text-gray-600 mt-1">{tPl('editor-subtitle')}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={handlePreview}
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-violet-600 rounded-lg text-sm font-medium text-violet-600 bg-white hover:bg-violet-50 transition-colors"
                aria-label={tPl('preview')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {tPl('preview')}
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-300 transition-colors"
                aria-label={tPl('save-template-button')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {tPl('save-template-button')}
              </button>
            </div>
          </div>

          {/* Template Basic Info card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">{tPl('basic-info')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="editor-template-name" className="block text-sm font-medium text-gray-700 mb-2">
                  {tPl('template-name')} *
                </label>
                <input
                  id="editor-template-name"
                  type="text"
                  defaultValue={templateName}
                  className="w-full min-h-[44px] rounded-lg border-2 border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                  placeholder={tPl('template-name-placeholder')}
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="editor-template-desc" className="block text-sm font-medium text-gray-700 mb-2">
                  {tPl('description')}
                </label>
                <textarea
                  id="editor-template-desc"
                  rows={2}
                  defaultValue={t(subKey)}
                  className="w-full min-h-[80px] rounded-lg border-2 border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 resize-y"
                  placeholder={tPl('description-placeholder')}
                />
              </div>
            </div>
          </div>

          {/* Sections and Fields — same logic as clinic-admin record-template-editor */}
          <TemplateSectionsBuilder />

          <div className="pt-4 mt-4 border-t border-gray-200 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {tPl('save-template')}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TemplateEditorPageContent;
