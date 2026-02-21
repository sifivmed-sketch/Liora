'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

/** Mock: ready for consultation */
const READY = [
  { id: '1', name: 'Juan Rodriguez Martinez', initials: 'JR', gradient: 'linear-gradient(135deg, #2F80ED, #56CCF2)', type: 'Control Cardiologia', appointmentTime: '8:30 AM', checkin: '8:25 AM', hasAllergy: true },
  { id: '2', name: 'Ana Sofia Fernandez', initials: 'AS', gradient: 'linear-gradient(135deg, #9333EA, #EC4899)', type: 'Consulta General', appointmentTime: '9:15 AM', checkin: '9:10 AM', hasAllergy: false },
  { id: '3', name: 'Laura Elena Castillo', initials: 'LC', gradient: 'linear-gradient(135deg, #2CA66F, #6FCF97)', type: 'Seguimiento', appointmentTime: '10:00 AM', checkin: '9:40 AM', hasAllergy: false },
];

/** Mock: upcoming */
const UPCOMING = [
  { id: '4', name: 'Miguel Angel Torres', initials: 'MT', gradient: 'linear-gradient(135deg, #F59E0B, #EF4444)', type: 'Primera Consulta', time: '11:00 AM', firstTime: true },
  { id: '5', name: 'Carlos Alberto Mendez', initials: 'CM', gradient: 'linear-gradient(135deg, #6366F1, #8B5CF6)', type: 'Control Diabetes', time: '2:00 PM', firstTime: false },
  { id: '6', name: 'Roberto Jose Sanchez', initials: 'RS', gradient: 'linear-gradient(135deg, #10B981, #34D399)', type: 'Seguimiento', time: '2:30 PM', firstTime: false, hasAllergy: true },
  { id: '7', name: 'Patricia Lopez Diaz', initials: 'PL', gradient: 'linear-gradient(135deg, #EC4899, #F472B6)', type: 'Consulta General', time: '3:00 PM', firstTime: false },
];

/** Mock: in consultation */
const IN_CONSULTATION = { name: 'Maria Garcia Lopez', initials: 'MG', gradient: 'linear-gradient(135deg, #2F80ED, #56CCF2)', type: 'Consulta General', doctor: 'Dr. Rodriguez Martinez', start: '9:35 AM', duration: '10 min', room: 'Consultorio 1' };

/** Mock: completed today */
const COMPLETED = [
  { name: 'Pedro Suarez Mena', initials: 'PS', completed: '8:20 AM' },
  { name: 'Elena Vargas Cruz', initials: 'EV', completed: '9:00 AM' },
];

/**
 * Waiting room (Sala de Espera) page with static demo data.
 */
const WaitingRoomPageContent = () => {
  const t = useTranslations('portal-medico.waiting-room');

  return (
    <div className="h-full bg-gray-100 overflow-y-auto">
      <div className="p-4 lg:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
            <p className="text-gray-600 mt-1">Viernes, 31 de Enero 2025</p>
          </div>
          <button type="button" className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 font-medium text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            {t('refresh')}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="rounded-xl border border-amber-200 p-4 bg-amber-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-700">3</p>
                <p className="text-xs text-amber-600">{t('ready')}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-green-200 p-4 bg-green-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700">1</p>
                <p className="text-xs text-green-600">{t('in-consultation')}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-blue-200 p-4 bg-blue-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">2</p>
                <p className="text-xs text-blue-600">{t('seen')}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-700">4</p>
                <p className="text-xs text-gray-600">{t('upcoming')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-amber-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"/>
                  <h3 className="font-semibold text-gray-900">{t('ready-title')}</h3>
                </div>
                <span className="text-sm text-amber-700 font-medium">3 {t('patients-count')}</span>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {READY.map((p) => (
                <div key={p.id} className="p-4 border-l-4 border-amber-400">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0" style={{ background: p.gradient }}>{p.initials}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{p.name}</h4>
                        {p.hasAllergy && <span className="w-2 h-2 bg-red-500 rounded-full" title="Alergias"/>}
                      </div>
                      <p className="text-sm text-gray-600">{p.type}</p>
                      <p className="text-xs text-gray-500 mt-2">Cita: {p.appointmentTime} · Check-in: {p.checkin}</p>
                    </div>
                    <Link href="/portal-medico/consulta" className="flex-shrink-0 px-3 py-1.5 text-sm font-medium text-white rounded-lg" style={{ backgroundColor: '#2F80ED' }}>{t('pass-to-consultation')}</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{t('upcoming-title')}</h3>
                <span className="text-sm text-gray-500">4 {t('pending-count')}</span>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {UPCOMING.map((p) => (
                <div key={p.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0" style={{ background: p.gradient }}>{p.initials}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{p.name}</h4>
                        {(p as { hasAllergy?: boolean }).hasAllergy && <span className="w-2 h-2 bg-red-500 rounded-full"/>}
                      </div>
                      <p className="text-sm text-gray-600">{p.type}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <span className="font-medium text-gray-700">{p.time}</span>
                        {p.firstTime && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">{t('first-time')}</span>}
                      </div>
                    </div>
                    <button type="button" className="flex-shrink-0 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">{t('check-in')}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-xl border border-green-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-green-200 bg-green-50">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"/>
              <h3 className="font-semibold text-gray-900">{t('currently-in')}</h3>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ background: IN_CONSULTATION.gradient }}>{IN_CONSULTATION.initials}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900 text-lg">{IN_CONSULTATION.name}</h4>
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">En Curso</span>
                </div>
                <p className="text-gray-600">{IN_CONSULTATION.type} - {IN_CONSULTATION.doctor}</p>
                <p className="text-sm text-gray-500 mt-2">Inicio: {IN_CONSULTATION.start} · Duración: {IN_CONSULTATION.duration} · {IN_CONSULTATION.room}</p>
              </div>
              <Link href="/portal-medico/consulta" className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">{t('view-consultation')}</Link>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">{t('completed-today')}</h3>
              <span className="text-sm text-gray-500">2 {t('patients-count')}</span>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {COMPLETED.map((p) => (
              <div key={p.initials} className="p-4 flex items-center gap-4 opacity-75">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium">{p.initials}</div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-700">{p.name}</h4>
                  <p className="text-sm text-gray-500">Completada {p.completed}</p>
                </div>
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">Finalizado</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingRoomPageContent;
