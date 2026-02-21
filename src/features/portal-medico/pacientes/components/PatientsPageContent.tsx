'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

/** Static mock patient for demo */
interface MockPatient {
  id: string;
  name: string;
  mrn: string;
  age: number;
  gender: string;
  bloodType: string;
  allergiesCount?: number;
  phone: string;
  lastVisit: string;
  avatarLetters: string;
  avatarGradient: string;
}

const MOCK_PATIENTS: MockPatient[] = [
  {
    id: '1',
    name: 'Maria Garcia Lopez',
    mrn: 'MRN-2025-00001',
    age: 45,
    gender: 'Femenino',
    bloodType: 'O+',
    allergiesCount: 1,
    phone: '+1 809 555 0101',
    lastVisit: '28/01/2025',
    avatarLetters: 'MG',
    avatarGradient: 'linear-gradient(135deg, #2F80ED, #56CCF2)',
  },
  {
    id: '2',
    name: 'Jose Garcia Perez',
    mrn: 'MRN-2025-00089',
    age: 58,
    gender: 'Masculino',
    bloodType: 'A+',
    phone: '+1 809 555 0234',
    lastVisit: '15/01/2025',
    avatarLetters: 'JG',
    avatarGradient: 'linear-gradient(135deg, #2CA66F, #6FCF97)',
  },
  {
    id: '3',
    name: 'Ana Garcia Martinez',
    mrn: 'MRN-2025-00156',
    age: 32,
    gender: 'Femenino',
    bloodType: 'B-',
    allergiesCount: 2,
    phone: '+1 809 555 0567',
    lastVisit: '30/01/2025',
    avatarLetters: 'AG',
    avatarGradient: 'linear-gradient(135deg, #9333ea, #ec4899)',
  },
];

/**
 * Patients list page content (Mis pacientes).
 * Static data for design and test; links to patient record (expediente).
 */
const PatientsPageContent = () => {
  const t = useTranslations('portal-medico.patients');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'lastVisit' | 'mrn'>('name');

  const filteredPatients = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = [...MOCK_PATIENTS];
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.mrn.toLowerCase().includes(q) ||
          p.phone.includes(q)
      );
    }
    if (sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'lastVisit') list.sort((a, b) => b.lastVisit.localeCompare(a.lastVisit));
    if (sortBy === 'mrn') list.sort((a, b) => a.mrn.localeCompare(b.mrn));
    return list;
  }, [searchQuery, sortBy]);

  return (
    <div className="h-full bg-gray-100 overflow-y-auto">
      <div className="p-4 lg:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600 mt-1">{t('subtitle')}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
          <form
            className="flex flex-col md:flex-row gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex-1 relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400" aria-hidden>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search-placeholder')}
                className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                aria-label={t('search-aria')}
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-white rounded-lg font-medium transition-colors hover:opacity-90 min-h-[44px]"
              style={{ backgroundColor: '#2F80ED' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {t('search-button')}
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 bg-white hover:bg-gray-50 min-h-[44px]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {t('new-patient')}
            </button>
          </form>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-sm text-gray-500">{t('quick-filters')}</span>
            <button type="button" className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200">
              {t('filter-today')}
            </button>
            <button type="button" className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200">
              {t('filter-week')}
            </button>
            <button type="button" className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200">
              {t('filter-pending')}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            <strong>{filteredPatients.length}</strong> {t('results-count')}
          </p>
          <div className="flex items-center gap-2">
            <label htmlFor="sortSelect" className="text-sm text-gray-500">
              {t('sort-label')}
            </label>
            <select
              id="sortSelect"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'lastVisit' | 'mrn')}
              className="border border-gray-300 rounded-lg text-sm py-1.5 px-3 text-gray-900 focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">{t('sort-name')}</option>
              <option value="lastVisit">{t('sort-last-visit')}</option>
              <option value="mrn">{t('sort-mrn')}</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredPatients.map((patient) => (
            <Link
              key={patient.id}
              href={`/portal-medico/pacientes/${patient.id}`}
              className="block bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:border-blue-200 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ background: patient.avatarGradient }}
                >
                  {patient.avatarLetters}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                    <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {patient.bloodType}
                    </span>
                    {patient.allergiesCount != null && patient.allergiesCount > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92z" clipRule="evenodd" />
                        </svg>
                        {t('allergies-count', { count: patient.allergiesCount })}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {patient.mrn} | {patient.age} {t('years')} | {patient.gender}
                  </p>
                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {patient.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {t('last-visit')}: {patient.lastVisit}
                    </span>
                  </div>
                </div>
                <svg className="w-6 h-6 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            {t('shortcut-hint')} <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-gray-600">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-gray-600">K</kbd> {t('shortcut-search')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientsPageContent;
