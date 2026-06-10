import { useState, useMemo } from 'react';
import { useAuth } from '../lib/auth';
import { JOBS, SAMPLE_INTERVIEWS } from '../data/seed';
import { Calendar as CalIcon, Clock, Video, Phone, MapPin, ChevronLeft, ChevronRight, Check, X, Plus } from 'lucide-react';
import { formatDateTime, tzAbbr, COMMON_TIMEZONES } from '../lib/format';
import type { Interview } from '../types';

export default function Interviews() {
  const { seeker } = useAuth();
  const [interviews, setInterviews] = useState<Interview[]>(SAMPLE_INTERVIEWS);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [tz, setTz] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [showNew, setShowNew] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('14:00');
  const [newJob, setNewJob] = useState(JOBS[0].id);
  const [newFormat, setNewFormat] = useState<'phone' | 'video' | 'onsite'>('video');
  const [newDuration, setNewDuration] = useState(45);

  const upcoming = interviews
    .filter(i => i.scheduledFor > Date.now() - 24 * 60 * 60 * 1000)
    .sort((a, b) => a.scheduledFor - b.scheduledFor);
  const past = interviews
    .filter(i => i.scheduledFor < Date.now() - 24 * 60 * 60 * 1000)
    .sort((a, b) => b.scheduledFor - a.scheduledFor);

  function setStatus(id: string, status: Interview['status']) {
    setInterviews(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  }
  function scheduleNew(e: React.FormEvent) {
    e.preventDefault();
    if (!newDate) return;
    const ms = new Date(`${newDate}T${newTime}`).getTime();
    setInterviews(prev => [
      ...prev,
      {
        id: `iv-${Date.now()}`,
        jobId: newJob,
        seekerId: seeker?.id ?? 's1',
        employerId: JOBS.find(j => j.id === newJob)?.employerId ?? 'e1',
        scheduledFor: ms,
        durationMin: newDuration,
        timezone: tz,
        format: newFormat,
        status: 'pending',
      },
    ]);
    setShowNew(false);
    setNewDate('');
  }

  // Calendar grid
  const grid = useMemo(() => buildMonthGrid(month), [month]);

  return (
    <section className="section">
      <div className="container-x space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="h2">Interviews</h1>
            <p className="mt-1 text-slate-600">Confirmed, pending, and completed — all in your local timezone.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg bg-slate-100 p-1">
              <button
                onClick={() => setView('list')}
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${view === 'list' ? 'bg-white shadow-sm text-navy-800' : 'text-slate-600'}`}
              >
                List
              </button>
              <button
                onClick={() => setView('calendar')}
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${view === 'calendar' ? 'bg-white shadow-sm text-navy-800' : 'text-slate-600'}`}
              >
                Calendar
              </button>
            </div>
            <select className="input py-1.5" value={tz} onChange={e => setTz(e.target.value)}>
              {COMMON_TIMEZONES.map(z => <option key={z} value={z}>{z} ({tzAbbr(z)})</option>)}
            </select>
            <button onClick={() => setShowNew(s => !s)} className="btn-primary">
              <Plus size={14} /> New
            </button>
          </div>
        </div>

        {showNew && (
          <form onSubmit={scheduleNew} className="card p-6">
            <h2 className="font-semibold">Schedule a new interview</h2>
            <p className="text-sm text-slate-600">We'll convert to each party's timezone automatically.</p>
            <div className="mt-3 grid sm:grid-cols-5 gap-3">
              <div>
                <label className="label">Job</label>
                <select className="input" value={newJob} onChange={e => setNewJob(e.target.value)}>
                  {JOBS.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Date</label>
                <input type="date" className="input" value={newDate} onChange={e => setNewDate(e.target.value)} required />
              </div>
              <div>
                <label className="label">Time</label>
                <input type="time" className="input" value={newTime} onChange={e => setNewTime(e.target.value)} required />
              </div>
              <div>
                <label className="label">Format</label>
                <select className="input" value={newFormat} onChange={e => setNewFormat(e.target.value as 'phone' | 'video' | 'onsite')}>
                  <option value="video">Video</option>
                  <option value="phone">Phone</option>
                  <option value="onsite">Onsite</option>
                </select>
              </div>
              <div>
                <label className="label">Duration</label>
                <select className="input" value={newDuration} onChange={e => setNewDuration(Number(e.target.value))}>
                  <option value={15}>15 min</option>
                  <option value={30}>30 min</option>
                  <option value={45}>45 min</option>
                  <option value={60}>60 min</option>
                </select>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-end gap-2">
              <button type="button" onClick={() => setShowNew(false)} className="btn-ghost">Cancel</button>
              <button type="submit" className="btn-primary">
                <Check size={14} /> Schedule
              </button>
            </div>
          </form>
        )}

        {view === 'list' ? (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <h2 className="font-semibold">Upcoming ({upcoming.length})</h2>
              {upcoming.length === 0 && <div className="card p-6 text-sm text-slate-600">No upcoming interviews.</div>}
              {upcoming.map(iv => (
                <InterviewCard
                  key={iv.id}
                  iv={iv}
                  onConfirm={() => setStatus(iv.id, 'confirmed')}
                  onDecline={() => setStatus(iv.id, 'declined')}
                />
              ))}
              <h2 className="font-semibold pt-4">Past</h2>
              {past.length === 0 && <div className="card p-6 text-sm text-slate-600">No past interviews.</div>}
              {past.map(iv => <InterviewCard key={iv.id} iv={iv} past />)}
            </div>
            <div className="space-y-4">
              <div className="card p-6">
                <h2 className="font-semibold">This week</h2>
                <p className="text-sm text-slate-600">All times shown in {tz} ({tzAbbr(tz)}).</p>
                <div className="mt-3 space-y-2">
                  {upcoming.slice(0, 4).map(iv => {
                    const job = JOBS.find(j => j.id === iv.jobId);
                    return (
                      <div key={iv.id} className="flex items-start gap-3 rounded-lg bg-slate-50 p-3 text-sm">
                        <span className="grid h-7 w-12 place-items-center rounded bg-white text-xs font-semibold text-navy-800 shrink-0">
                          {new Date(iv.scheduledFor).toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium truncate">{job?.title}</div>
                          <div className="text-xs text-slate-500">
                            {new Date(iv.scheduledFor).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} · {iv.durationMin} min
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {upcoming.length === 0 && <div className="text-sm text-slate-500">No interviews this week.</div>}
                </div>
              </div>
              <div className="card p-6">
                <h2 className="font-semibold">Email reminders</h2>
                <p className="text-sm text-slate-600">Automatic 24h and 1h reminders go to <span className="font-mono text-slate-800">{seeker?.email}</span>.</p>
              </div>
            </div>
          </div>
        ) : (
          <CalendarView
            month={month}
            setMonth={setMonth}
            interviews={interviews}
            tz={tz}
          />
        )}
      </div>
    </section>
  );
}

function InterviewCard({ iv, onConfirm, onDecline, past }: {
  iv: Interview;
  onConfirm?: () => void;
  onDecline?: () => void;
  past?: boolean;
}) {
  const job = JOBS.find(j => j.id === iv.jobId);
  const FormatIcon = iv.format === 'video' ? Video : iv.format === 'phone' ? Phone : MapPin;
  const statusBadge =
    iv.status === 'confirmed' ? 'badge-green' :
    iv.status === 'pending' ? 'badge-gold' :
    iv.status === 'declined' ? 'badge-red' : 'badge';

  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-lg text-white font-bold" style={{ backgroundColor: job?.company.logoColor ?? '#1e3a8a' }}>
          {job?.company.name[0]}
        </span>
        <div className="min-w-0 flex-1">
          <div className="font-semibold truncate">{job?.title}</div>
          <div className="text-xs text-slate-500">{job?.company.name} · {job?.location}</div>
        </div>
        <span className={statusBadge}>{iv.status}</span>
        <div className="text-right">
          <div className="text-sm font-medium">{formatDateTime(iv.scheduledFor)}</div>
          <div className="text-xs text-slate-500">{iv.durationMin} min · {tzAbbr(iv.timezone, iv.scheduledFor)}</div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
        <FormatIcon size={12} /> {iv.format} interview {iv.note ? `· ${iv.note}` : ''}
      </div>
      {!past && iv.status === 'pending' && (
        <div className="mt-3 flex gap-2">
          <button onClick={onConfirm} className="btn-primary text-xs px-3 py-1.5">
            <Check size={12} /> Confirm
          </button>
          <button onClick={onDecline} className="btn-secondary text-xs px-3 py-1.5">
            <X size={12} /> Decline
          </button>
        </div>
      )}
    </div>
  );
}

function CalendarView({ month, setMonth, interviews, tz }: {
  month: Date;
  setMonth: (d: Date) => void;
  interviews: Interview[];
  tz: string;
}) {
  const grid = useMemo(() => buildMonthGrid(month), [month]);
  const events = useMemo(() => {
    const map = new Map<string, Interview[]>();
    interviews.forEach(iv => {
      const key = ymd(new Date(iv.scheduledFor));
      const arr = map.get(key) ?? [];
      arr.push(iv);
      map.set(key, arr);
    });
    return map;
  }, [interviews]);

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="btn-ghost p-2">
          <ChevronLeft size={16} />
        </button>
        <div className="font-semibold">
          {month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} · {tz} ({tzAbbr(tz)})
        </div>
        <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="btn-ghost p-2">
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-2 text-xs text-slate-500">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center font-semibold uppercase tracking-wider py-1">{d}</div>
        ))}
        {grid.map((cell, i) => {
          const dayEvents = events.get(ymd(cell.date)) ?? [];
          const isToday = ymd(cell.date) === ymd(new Date());
          return (
            <div
              key={i}
              className={`min-h-[88px] rounded-md border p-1.5 text-xs ${cell.inMonth ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-100 text-slate-400'} ${isToday ? 'ring-2 ring-navy-800' : ''}`}
            >
              <div className={`text-right font-semibold ${isToday ? 'text-navy-800' : ''}`}>{cell.date.getDate()}</div>
              <div className="mt-1 space-y-0.5">
                {dayEvents.map(ev => {
                  const job = JOBS.find(j => j.id === ev.jobId);
                  return (
                    <div
                      key={ev.id}
                      className={`truncate rounded px-1 py-0.5 text-[10px] font-medium ${ev.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' : ev.status === 'pending' ? 'bg-gold-50 text-gold-700' : 'bg-slate-100 text-slate-600'}`}
                      title={`${job?.title} · ${new Date(ev.scheduledFor).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`}
                    >
                      {new Date(ev.scheduledFor).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} {job?.title}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function buildMonthGrid(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const startDow = first.getDay();
  const start = new Date(first);
  start.setDate(1 - startDow);
  const cells: { date: Date; inMonth: boolean }[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    cells.push({ date: d, inMonth: d.getMonth() === month.getMonth() });
  }
  return cells;
}

function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
