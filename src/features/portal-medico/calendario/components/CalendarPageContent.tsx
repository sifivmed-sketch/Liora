'use client';

import { useState, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

type ViewMode = 'day' | 'week' | 'month';

interface MockAppointment {
  id: string;
  date: string;
  hour: number;
  minute: number;
  durationMin: number;
  patientName: string;
  status: 'scheduled' | 'confirmed' | 'waiting' | 'in-progress';
  type: string;
  room?: string;
  isAllergy?: boolean;
  isFirstTime?: boolean;
}

/** Today's date for demo: 21 Feb 2026. Citas agendadas alrededor de esta semana. */
const TODAY_KEY = '2026-02-21';

const MOCK_APPOINTMENTS: MockAppointment[] = [
  { id: '1', date: '2026-02-21', hour: 8, minute: 0, durationMin: 30, patientName: 'Maria Garcia Lopez', status: 'confirmed', type: 'Consulta General', room: 'Consultorio 1' },
  { id: '2', date: '2026-02-21', hour: 8, minute: 30, durationMin: 45, patientName: 'Juan Rodriguez Martinez', status: 'waiting', type: 'Control Cardiologia', room: 'Consultorio 1', isAllergy: true },
  { id: '3', date: '2026-02-21', hour: 9, minute: 15, durationMin: 30, patientName: 'Ana Sofia Fernandez', status: 'scheduled', type: 'Consulta General', room: 'Consultorio 1' },
  { id: '4', date: '2026-02-21', hour: 10, minute: 0, durationMin: 30, patientName: 'Laura Elena Castillo', status: 'confirmed', type: 'Seguimiento', room: 'Consultorio 1' },
  { id: '5', date: '2026-02-21', hour: 11, minute: 0, durationMin: 45, patientName: 'Miguel Angel Torres', status: 'scheduled', type: 'Primera Consulta', room: 'Consultorio 1', isFirstTime: true },
  { id: '6', date: '2026-02-21', hour: 14, minute: 0, durationMin: 30, patientName: 'Carlos Alberto Mendez', status: 'confirmed', type: 'Control Diabetes', room: 'Consultorio 1' },
  { id: '7', date: '2026-02-21', hour: 14, minute: 30, durationMin: 30, patientName: 'Roberto Jose Sanchez', status: 'scheduled', type: 'Seguimiento', room: 'Consultorio 1', isAllergy: true },
  { id: '8', date: '2026-02-21', hour: 16, minute: 0, durationMin: 30, patientName: 'Pedro Martinez', status: 'in-progress', type: 'Consulta General', room: 'Consultorio 1' },
  { id: '9', date: '2026-02-17', hour: 9, minute: 0, durationMin: 30, patientName: 'Elena Ruiz', status: 'confirmed', type: 'Consulta General', room: 'Consultorio 1' },
  { id: '10', date: '2026-02-18', hour: 10, minute: 0, durationMin: 45, patientName: 'Sofia Gomez', status: 'scheduled', type: 'Primera Consulta', room: 'Consultorio 1', isFirstTime: true },
  { id: '11', date: '2026-02-19', hour: 8, minute: 30, durationMin: 30, patientName: 'Diego Lopez', status: 'waiting', type: 'Seguimiento', room: 'Consultorio 1' },
  { id: '12', date: '2026-02-20', hour: 11, minute: 0, durationMin: 30, patientName: 'Lucia Herrera', status: 'confirmed', type: 'Control', room: 'Consultorio 1' },
];

const STATUS_BORDER: Record<string, string> = {
  scheduled: 'border-gray-300',
  confirmed: 'border-blue-400 bg-blue-50',
  waiting: 'border-amber-400 bg-amber-50',
  'in-progress': 'border-green-400 bg-green-50',
};

const STATUS_BADGE: Record<string, string> = {
  scheduled: 'bg-gray-100 text-gray-700',
  confirmed: 'bg-blue-100 text-blue-800',
  waiting: 'bg-amber-100 text-amber-800',
  'in-progress': 'bg-green-100 text-green-800',
};

const STATUS_DOT: Record<string, string> = {
  scheduled: 'bg-gray-400',
  confirmed: 'bg-blue-500',
  waiting: 'bg-amber-500',
  'in-progress': 'bg-green-500',
};

const HOURS = Array.from({ length: 13 }, (_, i) => i + 7); // 7:00 – 19:00

/**
 * Formats a date key as YYYY-MM-DD
 */
const toDateKey = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

/**
 * Returns Monday of the week containing the given date (ISO weeks: Mon-Sun).
 */
const getMonday = (d: Date): Date => {
  const copy = new Date(d);
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

/**
 * ISO week number
 */
const getWeekNumber = (d: Date): number => {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  copy.setDate(copy.getDate() + 4 - (copy.getDay() || 7));
  const yearStart = new Date(copy.getFullYear(), 0, 1);
  return Math.ceil(((copy.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};

/**
 * Formats hour as "8:00 AM" style.
 */
const formatHour = (h: number): string => {
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:00 ${period}`;
};

/**
 * Calendar page: Day / Week / Month views with dynamic navigation.
 * Static mock data is date-aware; if navigating away from data dates, agenda shows empty.
 */
const CalendarPageContent = () => {
  const t = useTranslations('portal-medico.calendar');
  const tDays = useTranslations('portal-medico.calendar.days');
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 1, 21));

  const statusLabel: Record<string, string> = useMemo(() => ({
    scheduled: t('legend-scheduled'),
    confirmed: t('legend-confirmed'),
    waiting: t('legend-waiting'),
    'in-progress': t('legend-in-progress'),
  }), [t]);

  const dayNames = useMemo(() => [
    tDays('mon'), tDays('tue'), tDays('wed'), tDays('thu'), tDays('fri'), tDays('sat'), tDays('sun'),
  ], [tDays]);

  const dateDisplay = useMemo(() => {
    return currentDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }, [currentDate]);

  const weekNumber = useMemo(() => getWeekNumber(currentDate), [currentDate]);

  const weekDays = useMemo(() => {
    const mon = getMonday(currentDate);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(mon);
      d.setDate(mon.getDate() + i);
      return d;
    });
  }, [currentDate]);

  const monthDays = useMemo(() => {
    const first = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const last = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDay = first.getDay() === 0 ? 6 : first.getDay() - 1;
    const days: (Date | null)[] = Array.from({ length: startDay }, () => null);
    for (let d = 1; d <= last.getDate(); d++) {
      days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), d));
    }
    while (days.length % 7 !== 0) days.push(null);
    return days;
  }, [currentDate]);

  const appointmentsByDate = useMemo(() => {
    const map: Record<string, MockAppointment[]> = {};
    MOCK_APPOINTMENTS.forEach((a) => {
      if (!map[a.date]) map[a.date] = [];
      map[a.date].push(a);
    });
    Object.values(map).forEach((arr) => arr.sort((a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute)));
    return map;
  }, []);

  const todayAppointments = useMemo(() => appointmentsByDate[toDateKey(currentDate)] ?? [], [appointmentsByDate, currentDate]);

  const stats = useMemo(() => {
    let apps: MockAppointment[];
    if (viewMode === 'day') {
      apps = todayAppointments;
    } else if (viewMode === 'week') {
      apps = weekDays.flatMap((d) => appointmentsByDate[toDateKey(d)] ?? []);
    } else {
      const y = currentDate.getFullYear();
      const m = currentDate.getMonth();
      apps = MOCK_APPOINTMENTS.filter((a) => {
        const [ay, am] = a.date.split('-').map(Number);
        return ay === y && am - 1 === m;
      });
    }
    return {
      total: apps.length,
      waiting: apps.filter((a) => a.status === 'waiting').length,
      confirmed: apps.filter((a) => a.status === 'confirmed').length,
      pending: apps.filter((a) => a.status === 'scheduled').length,
    };
  }, [viewMode, currentDate, todayAppointments, weekDays, appointmentsByDate]);

  const handlePrev = useCallback(() => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (viewMode === 'day') d.setDate(d.getDate() - 1);
      else if (viewMode === 'week') d.setDate(d.getDate() - 7);
      else d.setMonth(d.getMonth() - 1);
      return d;
    });
  }, [viewMode]);

  const handleNext = useCallback(() => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (viewMode === 'day') d.setDate(d.getDate() + 1);
      else if (viewMode === 'week') d.setDate(d.getDate() + 7);
      else d.setMonth(d.getMonth() + 1);
      return d;
    });
  }, [viewMode]);

  const handleToday = useCallback(() => {
    setCurrentDate(new Date(2026, 1, 21));
  }, []);

  const isToday = (d: Date): boolean => toDateKey(d) === TODAY_KEY;

  const headerTitle = useMemo(() => {
    if (viewMode === 'day') return dateDisplay;
    if (viewMode === 'week') {
      const mon = weekDays[0];
      const sun = weekDays[6];
      const fmt = (d: Date) => d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
      return `${fmt(mon)} – ${fmt(sun)}, ${sun.getFullYear()}`;
    }
    return currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  }, [viewMode, dateDisplay, weekDays, currentDate]);

  return (
    <div className="h-full bg-gray-100 overflow-y-auto">
      <div className="p-4 lg:p-6">
        {/* Title + new appointment */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
            <p className="text-gray-600 mt-1">{t('subtitle')}</p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium min-h-[44px]"
            style={{ backgroundColor: '#2F80ED' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            {t('new-appointment')}
          </button>
        </div>

        {/* Nav bar: date navigation + view toggle */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <button type="button" onClick={handlePrev} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600" aria-label="Anterior">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <div className="text-center min-w-[200px]">
                <h2 className="text-lg font-bold text-gray-900 capitalize">{headerTitle}</h2>
                {viewMode !== 'month' && <p className="text-sm text-gray-500">{t('week')} {weekNumber}</p>}
              </div>
              <button type="button" onClick={handleNext} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600" aria-label="Siguiente">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>
              <button type="button" onClick={handleToday} className="ml-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                {t('today')}
              </button>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg" role="group" aria-label="Vista">
              {(['day', 'week', 'month'] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === mode ? 'bg-white text-gray-900 shadow' : 'text-gray-600 hover:text-gray-900'}`}
                  aria-pressed={viewMode === mode}
                >
                  {t(mode)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { value: stats.total, label: t('total'), bg: 'bg-blue-100', color: 'text-blue-600', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
            { value: stats.waiting, label: t('waiting'), bg: 'bg-amber-100', color: 'text-amber-600', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
            { value: stats.confirmed, label: t('confirmed'), bg: 'bg-green-100', color: 'text-green-600', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
            { value: stats.pending, label: t('pending'), bg: 'bg-gray-100', color: 'text-gray-600', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <svg className={`w-5 h-5 ${s.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={s.icon} /></svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main calendar area */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Legend header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="font-semibold text-gray-900">
                {viewMode === 'day' && t('agenda-title')}
                {viewMode === 'week' && `${t('agenda-week')} ${weekNumber}`}
                {viewMode === 'month' && currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-300" />{t('legend-scheduled')}</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-400" />{t('legend-confirmed')}</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-400" />{t('legend-waiting')}</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-400" />{t('legend-in-progress')}</span>
              </div>
            </div>
          </div>

          {/* DAY VIEW */}
          {viewMode === 'day' && (
            <div className="divide-y divide-gray-100">
              {todayAppointments.length === 0 ? (
                <div className="p-12 text-center text-gray-400">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <p className="text-sm font-medium">{t('no-appointments')}</p>
                </div>
              ) : (
                todayAppointments.map((slot) => {
                  const h12 = slot.hour === 0 ? 12 : slot.hour > 12 ? slot.hour - 12 : slot.hour;
                  const period = slot.hour >= 12 ? 'PM' : 'AM';
                  const timeStr = `${h12}:${String(slot.minute).padStart(2, '0')}`;
                  return (
                    <div
                      key={slot.id}
                      className={`flex border-l-4 ${STATUS_BORDER[slot.status]} hover:opacity-90 transition-opacity`}
                    >
                      <div className="w-20 py-4 px-3 text-center border-r border-gray-200 bg-white flex-shrink-0">
                        <span className="text-sm font-medium block text-gray-900">{timeStr}</span>
                        <span className="text-xs block text-gray-500">{period}</span>
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-semibold text-gray-900">{slot.patientName}</h4>
                              <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${STATUS_BADGE[slot.status]}`}>{statusLabel[slot.status]}</span>
                              {slot.isAllergy && <span className="w-2 h-2 bg-red-500 rounded-full" title="Alergias" aria-label="Alergias" />}
                              {slot.isFirstTime && <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">{t('first-time-badge')}</span>}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{slot.type} – {slot.durationMin} min</p>
                            {slot.room && <p className="text-xs text-gray-500 mt-1">{slot.room}</p>}
                          </div>
                          {slot.status === 'waiting' && (
                            <Link href="/portal-medico/consulta" className="inline-flex px-3 py-1.5 text-sm font-medium text-white rounded-lg flex-shrink-0" style={{ backgroundColor: '#2F80ED' }}>
                              {t('start-consultation')}
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* WEEK VIEW – Google Calendar style time grid */}
          {viewMode === 'week' && (
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Header row: days of the week */}
                <div className="grid grid-cols-[72px_repeat(7,1fr)] border-b border-gray-200 bg-white sticky top-0 z-10">
                  <div className="border-r border-gray-200" />
                  {weekDays.map((d, i) => {
                    const today = isToday(d);
                    return (
                      <div
                        key={i}
                        className={`text-center py-3 border-r border-gray-200 last:border-r-0 ${today ? 'bg-blue-50' : ''}`}
                      >
                        <p className="text-xs text-gray-500 uppercase">{dayNames[i]}</p>
                        <p className={`text-lg font-bold ${today ? 'text-blue-600' : 'text-gray-900'}`}>{d.getDate()}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Time rows */}
                {HOURS.map((hour) => (
                  <div key={hour} className="grid grid-cols-[72px_repeat(7,1fr)] border-b border-gray-100 min-h-[60px]">
                    <div className="border-r border-gray-200 py-1 px-2 text-right">
                      <span className="text-xs text-gray-400">{formatHour(hour)}</span>
                    </div>
                    {weekDays.map((d, dayIdx) => {
                      const key = toDateKey(d);
                      const dayApps = (appointmentsByDate[key] ?? []).filter((a) => a.hour === hour);
                      const today = isToday(d);
                      return (
                        <div
                          key={dayIdx}
                          className={`border-r border-gray-100 last:border-r-0 p-0.5 ${today ? 'bg-blue-50/30' : ''}`}
                        >
                          {dayApps.map((app) => (
                            <div
                              key={app.id}
                              className={`rounded px-1.5 py-1 mb-0.5 border-l-3 text-xs cursor-pointer transition-opacity hover:opacity-80 ${STATUS_BORDER[app.status]}`}
                              title={`${app.patientName} – ${app.type}`}
                            >
                              <p className="font-medium text-gray-900 truncate">{app.patientName}</p>
                              <p className="text-gray-500 truncate">{app.hour}:{String(app.minute).padStart(2, '0')} – {app.type}</p>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MONTH VIEW – calendar grid */}
          {viewMode === 'month' && (
            <div>
              <div className="grid grid-cols-7 border-b border-gray-200">
                {dayNames.map((name) => (
                  <div key={name} className="text-center py-2 text-xs font-semibold text-gray-500 uppercase border-r border-gray-100 last:border-r-0">
                    {name}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {monthDays.map((d, i) => {
                  if (!d) {
                    return <div key={`empty-${i}`} className="min-h-[100px] border-r border-b border-gray-100 last:border-r-0 bg-gray-50" />;
                  }
                  const key = toDateKey(d);
                  const apps = appointmentsByDate[key] ?? [];
                  const today = isToday(d);
                  const isCurrentMonth = d.getMonth() === currentDate.getMonth();
                  return (
                    <div
                      key={key}
                      className={`min-h-[100px] border-r border-b border-gray-100 last:border-r-0 p-1.5 cursor-pointer hover:bg-gray-50 transition-colors ${
                        !isCurrentMonth ? 'bg-gray-50 opacity-50' : ''
                      }`}
                      onClick={() => {
                        setCurrentDate(new Date(d));
                        setViewMode('day');
                      }}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setCurrentDate(new Date(d)); setViewMode('day'); } }}
                      role="button"
                      tabIndex={0}
                      aria-label={`${d.getDate()}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${
                            today ? 'bg-blue-600 text-white' : 'text-gray-700'
                          }`}
                        >
                          {d.getDate()}
                        </span>
                        {apps.length > 0 && (
                          <span className="text-xs text-gray-400">{apps.length}</span>
                        )}
                      </div>
                      <div className="space-y-0.5">
                        {apps.slice(0, 3).map((app) => (
                          <div
                            key={app.id}
                            className={`flex items-center gap-1 rounded px-1 py-0.5 text-xs truncate ${STATUS_BORDER[app.status]}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_DOT[app.status]}`} />
                            <span className="truncate text-gray-700">{app.patientName.split(' ')[0]}</span>
                          </div>
                        ))}
                        {apps.length > 3 && (
                          <p className="text-xs text-blue-600 font-medium pl-1">+{apps.length - 3} más</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPageContent;
