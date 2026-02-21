'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

export type FieldType = 'text' | 'textarea' | 'number' | 'date' | 'select' | 'checkbox' | 'file';

export interface TemplateField {
  id: string;
  label: string;
  type: FieldType;
  placeholder: string;
  options: string;
  required: boolean;
}

export interface TemplateSection {
  id: string;
  title: string;
  description: string;
  fields: TemplateField[];
}

const FIELD_TYPE_KEYS: Record<FieldType, string> = {
  text: 'field-type-text',
  textarea: 'field-type-textarea',
  number: 'field-type-number',
  date: 'field-type-date',
  select: 'field-type-select',
  checkbox: 'field-type-checkbox',
  file: 'field-type-file',
};

/** Initial sections matching record-template-editor.js */
const createInitialSections = (): TemplateSection[] => [
  {
    id: `section-${Date.now()}-0`,
    title: 'Datos del Paciente',
    description: 'Información demográfica y de contacto',
    fields: [
      { id: `field-${Date.now()}-1`, label: 'Nombre Completo', type: 'text', placeholder: '', options: '', required: true },
      { id: `field-${Date.now()}-2`, label: 'Fecha de Nacimiento', type: 'date', placeholder: '', options: '', required: true },
      { id: `field-${Date.now()}-3`, label: 'Tipo de Sangre', type: 'select', placeholder: '', options: 'A+, A-, B+, B-, AB+, AB-, O+, O-', required: false },
    ],
  },
  {
    id: `section-${Date.now()}-4`,
    title: 'Antecedentes Médicos',
    description: 'Historia clínica previa del paciente',
    fields: [
      { id: `field-${Date.now()}-5`, label: 'Alergias', type: 'textarea', placeholder: 'Describa alergias conocidas...', options: '', required: false },
      { id: `field-${Date.now()}-6`, label: 'Condiciones Preexistentes', type: 'checkbox', placeholder: '', options: 'Diabetes, Hipertensión, Asma, Cardiopatía', required: false },
    ],
  },
];

/**
 * Sections and Fields builder for template editor.
 * Same logic as clinic-admin record-template-editor.js: add/move/delete sections and fields.
 */
const TemplateSectionsBuilder = () => {
  const t = useTranslations('portal-medico.templates');
  const [sections, setSections] = useState<TemplateSection[]>(createInitialSections);
  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [addFieldOpen, setAddFieldOpen] = useState(false);
  const [addFieldSectionId, setAddFieldSectionId] = useState<string | null>(null);

  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionDescription, setNewSectionDescription] = useState('');
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<FieldType>('text');
  const [newFieldPlaceholder, setNewFieldPlaceholder] = useState('');
  const [newFieldOptions, setNewFieldOptions] = useState('');
  const [newFieldRequired, setNewFieldRequired] = useState(false);

  const openAddSection = useCallback(() => {
    setNewSectionTitle('');
    setNewSectionDescription('');
    setAddSectionOpen(true);
  }, []);

  const closeAddSection = useCallback(() => setAddSectionOpen(false), []);

  const handleAddSection = useCallback(() => {
    const title = newSectionTitle.trim();
    if (!title) return;
    setSections((prev) => [
      ...prev,
      {
        id: `section-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        title,
        description: newSectionDescription.trim(),
        fields: [],
      },
    ]);
    closeAddSection();
  }, [newSectionTitle, newSectionDescription, closeAddSection]);

  const openAddField = useCallback((sectionId: string) => {
    setAddFieldSectionId(sectionId);
    setNewFieldLabel('');
    setNewFieldType('text');
    setNewFieldPlaceholder('');
    setNewFieldOptions('');
    setNewFieldRequired(false);
    setAddFieldOpen(true);
  }, []);

  const closeAddField = useCallback(() => {
    setAddFieldOpen(false);
    setAddFieldSectionId(null);
  }, []);

  const handleAddField = useCallback(() => {
    const label = newFieldLabel.trim();
    if (!label || !addFieldSectionId) return;
    if ((newFieldType === 'select' || newFieldType === 'checkbox') && !newFieldOptions.trim()) return;

    const field: TemplateField = {
      id: `field-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      label,
      type: newFieldType,
      placeholder: newFieldPlaceholder.trim(),
      options: newFieldOptions.trim(),
      required: newFieldRequired,
    };

    setSections((prev) =>
      prev.map((sec) =>
        sec.id === addFieldSectionId ? { ...sec, fields: [...sec.fields, field] } : sec
      )
    );
    closeAddField();
  }, [addFieldSectionId, newFieldLabel, newFieldType, newFieldPlaceholder, newFieldOptions, newFieldRequired, closeAddField]);

  const moveSection = useCallback((sectionId: string, direction: 'up' | 'down') => {
    setSections((prev) => {
      const idx = prev.findIndex((s) => s.id === sectionId);
      if (idx < 0) return prev;
      if (direction === 'up' && idx === 0) return prev;
      if (direction === 'down' && idx === prev.length - 1) return prev;
      const next = [...prev];
      if (direction === 'up') {
        [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      } else {
        [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      }
      return next;
    });
  }, []);

  const deleteSection = useCallback((sectionId: string) => {
    if (typeof window !== 'undefined' && !window.confirm(t('delete-section-confirm'))) return;
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
  }, [t]);

  const deleteField = useCallback((sectionId: string, fieldId: string) => {
    if (typeof window !== 'undefined' && !window.confirm(t('delete-field-confirm'))) return;
    setSections((prev) =>
      prev.map((sec) =>
        sec.id === sectionId ? { ...sec, fields: sec.fields.filter((f) => f.id !== fieldId) } : sec
      )
    );
  }, [t]);

  const updateFieldLabel = useCallback((sectionId: string, fieldId: string, label: string) => {
    setSections((prev) =>
      prev.map((sec) =>
        sec.id === sectionId
          ? { ...sec, fields: sec.fields.map((f) => (f.id === fieldId ? { ...f, label } : f)) }
          : sec
      )
    );
  }, []);

  const showOptionsForType = newFieldType === 'select' || newFieldType === 'checkbox';

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{t('sections-and-fields')}</h3>
        <button
          type="button"
          onClick={openAddSection}
          className="inline-flex items-center gap-2 px-3 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-300"
          aria-label={t('add-section')}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {t('add-section')}
        </button>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <section
            key={section.id}
            className="bg-white rounded-xl border-2 border-violet-200 shadow-sm p-5"
            aria-label={section.title}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={section.title}
                  readOnly
                  className="section-title text-lg font-semibold text-gray-900 border-0 border-b-2 border-transparent hover:border-violet-300 focus:border-violet-500 focus:outline-none px-2 py-1 -ml-2 w-full bg-transparent"
                  aria-label={t('section-title-label')}
                />
                <p className="text-sm text-gray-500 mt-1 ml-2">{section.description}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <button
                  type="button"
                  onClick={() => moveSection(section.id, 'up')}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                  title={t('move-up')}
                  aria-label={t('move-up')}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => moveSection(section.id, 'down')}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                  title={t('move-down')}
                  aria-label={t('move-down')}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => deleteSection(section.id)}
                  className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                  title={t('delete-section')}
                  aria-label={t('delete-section')}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="fields-container space-y-3 mb-4">
              {section.fields.map((field) => (
                <FieldRow
                  key={field.id}
                  field={field}
                  typeLabelKey={FIELD_TYPE_KEYS[field.type]}
                  t={t}
                  onDelete={() => deleteField(section.id, field.id)}
                  onLabelChange={(label) => updateFieldLabel(section.id, field.id, label)}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => openAddField(section.id)}
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              aria-label={t('add-field')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {t('add-field')}
            </button>
          </section>
        ))}
      </div>

      {/* Add Section Modal */}
      {addSectionOpen && (
        <AddSectionModal
          title={newSectionTitle}
          description={newSectionDescription}
          onTitleChange={setNewSectionTitle}
          onDescriptionChange={setNewSectionDescription}
          onConfirm={handleAddSection}
          onCancel={closeAddSection}
          t={t}
        />
      )}

      {/* Add Field Modal */}
      {addFieldOpen && addFieldSectionId && (
        <AddFieldModal
          label={newFieldLabel}
          type={newFieldType}
          placeholder={newFieldPlaceholder}
          options={newFieldOptions}
          required={newFieldRequired}
          showOptions={showOptionsForType}
          onLabelChange={setNewFieldLabel}
          onTypeChange={setNewFieldType}
          onPlaceholderChange={setNewFieldPlaceholder}
          onOptionsChange={setNewFieldOptions}
          onRequiredChange={setNewFieldRequired}
          onConfirm={handleAddField}
          onCancel={closeAddField}
          t={t}
        />
      )}
    </div>
  );
};

/** Single field row: drag handle, label, type, placeholder/options, required, edit, delete */
const FieldRow = ({
  field,
  typeLabelKey,
  t,
  onDelete,
  onLabelChange,
}: {
  field: TemplateField;
  typeLabelKey: string;
  t: (key: string) => string;
  onDelete: () => void;
  onLabelChange: (label: string) => void;
}) => {
  const [editing, setEditing] = useState(false);
  const displayPlaceholderOptions = field.options || field.placeholder || '';

  return (
    <div className="field-item flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
      <span className="w-5 h-5 text-gray-400 flex-shrink-0" aria-hidden>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </span>
      <div className="flex-1 grid grid-cols-12 gap-3 min-w-0">
        <div className="col-span-3 min-w-0">
          {editing ? (
            <input
              type="text"
              value={field.label}
              onChange={(e) => onLabelChange(e.target.value)}
              onBlur={() => setEditing(false)}
              onKeyDown={(e) => e.key === 'Enter' && setEditing(false)}
              className="w-full min-h-[32px] rounded border-2 border-violet-500 px-2 py-1 text-sm bg-white"
              autoFocus
            />
          ) : (
            <input
              type="text"
              value={field.label}
              readOnly
              onFocus={() => setEditing(true)}
              className="w-full min-h-[32px] rounded px-2 py-1 text-sm bg-gray-50 border border-transparent cursor-pointer hover:bg-gray-100"
            />
          )}
        </div>
        <div className="col-span-2 min-w-0">
          <input
            type="text"
            value={t(typeLabelKey)}
            readOnly
            className="w-full min-h-[32px] rounded px-2 py-1 text-sm bg-gray-50 border border-gray-200"
          />
        </div>
        <div className="col-span-3 min-w-0">
          <input
            type="text"
            value={displayPlaceholderOptions}
            readOnly
            placeholder={t('placeholder-options')}
            className="w-full min-h-[32px] rounded px-2 py-1 text-sm bg-gray-50 border border-gray-200"
          />
        </div>
        <div className="col-span-2 flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={field.required} disabled className="w-4 h-4 text-violet-600 rounded" />
            <span>{t('required')}</span>
          </label>
        </div>
        <div className="col-span-2 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="p-1.5 rounded text-gray-500 hover:bg-gray-100"
            title={t('edit-field')}
            aria-label={t('edit-field')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 rounded text-red-500 hover:bg-red-50"
            title={t('delete-field')}
            aria-label={t('delete-field')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

/** Modal: Nueva Sección */
const AddSectionModal = ({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onConfirm,
  onCancel,
  t,
}: {
  title: string;
  description: string;
  onTitleChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  t: (key: string) => string;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" role="dialog" aria-modal="true" aria-labelledby="add-section-modal-title">
    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 id="add-section-modal-title" className="text-lg font-semibold text-gray-900">
          {t('new-section-title')}
        </h3>
        <button type="button" onClick={onCancel} className="p-2 rounded-lg hover:bg-gray-100" aria-label={t('cancel')}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <label htmlFor="new-section-title" className="block text-sm font-medium text-gray-700 mb-2">
            {t('section-title-label')}
          </label>
          <input
            id="new-section-title"
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full min-h-[44px] rounded-lg border-2 border-gray-300 px-4 py-3"
            placeholder={t('section-title-placeholder')}
          />
        </div>
        <div>
          <label htmlFor="new-section-desc" className="block text-sm font-medium text-gray-700 mb-2">
            {t('section-description-label')}
          </label>
          <textarea
            id="new-section-desc"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            rows={2}
            className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 resize-y"
            placeholder={t('section-description-placeholder')}
          />
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          {t('cancel')}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={!title.trim()}
          className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:pointer-events-none"
        >
          {t('create-section')}
        </button>
      </div>
    </div>
  </div>
);

/** Modal: Nuevo Campo */
const AddFieldModal = ({
  label,
  type,
  placeholder,
  options,
  required,
  showOptions,
  onLabelChange,
  onTypeChange,
  onPlaceholderChange,
  onOptionsChange,
  onRequiredChange,
  onConfirm,
  onCancel,
  t,
}: {
  label: string;
  type: FieldType;
  placeholder: string;
  options: string;
  required: boolean;
  showOptions: boolean;
  onLabelChange: (v: string) => void;
  onTypeChange: (v: FieldType) => void;
  onPlaceholderChange: (v: string) => void;
  onOptionsChange: (v: string) => void;
  onRequiredChange: (v: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  t: (key: string) => string;
}) => {
  const canConfirm = label.trim() && (!showOptions || options.trim());
  const typeOptions: { value: FieldType; key: string }[] = [
    { value: 'text', key: 'field-type-text' },
    { value: 'textarea', key: 'field-type-textarea' },
    { value: 'number', key: 'field-type-number' },
    { value: 'date', key: 'field-type-date' },
    { value: 'select', key: 'field-type-select' },
    { value: 'checkbox', key: 'field-type-checkbox' },
    { value: 'file', key: 'field-type-file' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" role="dialog" aria-modal="true" aria-labelledby="add-field-modal-title">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 id="add-field-modal-title" className="text-lg font-semibold text-gray-900">
            {t('new-field-title')}
          </h3>
          <button type="button" onClick={onCancel} className="p-2 rounded-lg hover:bg-gray-100" aria-label={t('cancel')}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="new-field-label" className="block text-sm font-medium text-gray-700 mb-2">
              {t('field-label-label')}
            </label>
            <input
              id="new-field-label"
              type="text"
              value={label}
              onChange={(e) => onLabelChange(e.target.value)}
              className="w-full min-h-[44px] rounded-lg border-2 border-gray-300 px-4 py-3"
              placeholder={t('field-label-placeholder')}
            />
          </div>
          <div>
            <label htmlFor="new-field-type" className="block text-sm font-medium text-gray-700 mb-2">
              {t('field-type-label')}
            </label>
            <select
              id="new-field-type"
              value={type}
              onChange={(e) => onTypeChange(e.target.value as FieldType)}
              className="w-full min-h-[44px] rounded-lg border-2 border-gray-300 px-4 py-3"
            >
              {typeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {t(opt.key)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="new-field-placeholder" className="block text-sm font-medium text-gray-700 mb-2">
              {t('placeholder-label')}
            </label>
            <input
              id="new-field-placeholder"
              type="text"
              value={placeholder}
              onChange={(e) => onPlaceholderChange(e.target.value)}
              className="w-full min-h-[44px] rounded-lg border-2 border-gray-300 px-4 py-3"
              placeholder={t('placeholder-placeholder')}
            />
          </div>
          {showOptions && (
            <div>
              <label htmlFor="new-field-options" className="block text-sm font-medium text-gray-700 mb-2">
                {t('options-label')}
              </label>
              <input
                id="new-field-options"
                type="text"
                value={options}
                onChange={(e) => onOptionsChange(e.target.value)}
                className="w-full min-h-[44px] rounded-lg border-2 border-gray-300 px-4 py-3"
                placeholder={t('options-placeholder')}
              />
            </div>
          )}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={required}
                onChange={(e) => onRequiredChange(e.target.checked)}
                className="w-4 h-4 text-violet-600 rounded"
              />
              <span className="text-sm font-medium text-gray-700">{t('field-required-label')}</span>
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            {t('cancel')}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!canConfirm}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:pointer-events-none"
          >
            {t('add-field-button')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateSectionsBuilder;
