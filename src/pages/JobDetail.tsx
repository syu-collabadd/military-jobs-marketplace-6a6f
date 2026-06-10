import { useParams, Link, useNavigate } from 'react-router-dom';
import { JOBS } from '../data/seed';
import { useAuth } from '../lib/auth';
import { computeMatch } from '../lib/match';
import { SKILL_MAP, CLEARANCES, BRANCHES } from '../data/skills';
import { formatSalaryRange, timeAgo } from '../lib/format';
import { MapPin, Shield, Briefcase, Star, Calendar, ArrowLeft, Check, Clock } from 'lucide-react';
import { useState } from 'react';
import { COMMON_TIMEZONES, tzAbbr } from '../lib/format';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { seeker, isAuthenticated } = useAuth();
  const job = JOBS.find(j => j.id === id);
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('14:00');
  const [tz, setTz] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

  if (!job) {
    return (
      <section className="section">
        <div className="container-x">
          <div className="card p-10 text-center">
            <p className="text-slate-600">Job not found.</p>
            <Link to="/jobs" className="btn-primary mt-3">Back to jobs</Link>
          </div>
        </div>
      </section>
    );
  }

  const match = seeker ? computeMatch(seeker, job) : null;

  return (
    <section className="section">
      <div className="container-x max-w-4xl space-y-6">
        <button onClick={() => navigate(-1)} className="btn-ghost text-sm">
          <ArrowLeft size={14} /> Back
        </button>

        <div className="card p-6 sm:p-8">
          <div className="flex flex-wrap items-start gap-4">
            <span
              className="grid h-14 w-14 place-items-center rounded-xl text-white text-xl font-bold shrink-0"
              style={{ backgroundColor: job.company.logoColor }}
            >
              {job.company.name[0]}
            </span>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold">{job.title}</h1>
              <div className="mt-1 text-slate-600">{job.company.name} · {job.company.industry}</div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-700">
                <span className="flex items-center gap-1"><MapPin size={13} /> {job.location}</span>
                {job.remote && <span className="badge-green">Remote</span>}
                {job.clearanceRequired !== 'None' && (
                  <span className="badge-navy inline-flex items-center gap-1">
                    <Shield size={11} /> {job.clearanceRequired}
                  </span>
                )}
                <span className="font-semibold text-navy-800">{formatSalaryRange(job.salaryMin, job.salaryMax)}</span>
                <span className="text-slate-400">·</span>
                <span>Posted {timeAgo(job.postedAt)}</span>
              </div>
            </div>
            {match && (
              <div className="text-right">
                <div className={`text-3xl font-extrabold ${match.score >= 80 ? 'text-navy-800' : match.score >= 60 ? 'text-slate-700' : 'text-slate-500'}`}>
                  {match.score}%
                </div>
                <div className="text-xs text-slate-500">match for you</div>
              </div>
            )}
          </div>

          {match && (
            <div className="mt-5 rounded-lg bg-slate-50 border border-slate-200 p-4">
              <div className="text-sm font-semibold text-slate-700">Why this score</div>
              <ul className="mt-2 space-y-1 text-sm text-slate-700">
                {match.reasons.map(r => (
                  <li key={r} className="flex items-start gap-2">
                    <Check size={14} className="mt-0.5 text-emerald-600 shrink-0" /> {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            {isAuthenticated && seeker ? (
              <button onClick={() => setShowSchedule(s => !s)} className="btn-primary">
                <Calendar size={16} /> Request interview
              </button>
            ) : (
              <Link to="/signup?role=seeker" className="btn-primary">
                Apply now
              </Link>
            )}
            <button className="btn-secondary">
              <Briefcase size={16} /> Save job
            </button>
          </div>
        </div>

        {showSchedule && seeker && (
          <div className="card p-6 sm:p-8">
            <h2 className="font-semibold">Request an interview</h2>
            <p className="mt-1 text-sm text-slate-600">Pick a few times that work for you. The employer will confirm one.</p>
            <div className="mt-4 grid sm:grid-cols-3 gap-3">
              <div>
                <label className="label">Date</label>
                <input type="date" className="input" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} />
              </div>
              <div>
                <label className="label">Time</label>
                <input type="time" className="input" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} />
              </div>
              <div>
                <label className="label">Your timezone</label>
                <select className="input" value={tz} onChange={e => setTz(e.target.value)}>
                  {COMMON_TIMEZONES.map(z => <option key={z} value={z}>{z} ({tzAbbr(z)})</option>)}
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowSchedule(false)} className="btn-ghost">Cancel</button>
              <button onClick={() => { setShowSchedule(false); navigate('/interviews'); }} className="btn-primary">
                <Check size={14} /> Send request
              </button>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6 sm:p-8">
              <h2 className="font-semibold">About the role</h2>
              <p className="mt-3 text-slate-700 leading-relaxed">{job.description}</p>
            </div>

            <div className="card p-6 sm:p-8">
              <h2 className="font-semibold">Responsibilities</h2>
              <ul className="mt-3 space-y-2">
                {job.responsibilities.map(r => (
                  <li key={r} className="flex items-start gap-2 text-slate-700">
                    <Check size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-6 sm:p-8">
              <h2 className="font-semibold">Required skills</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {job.requiredSkills.map(s => (
                  <span key={s} className={`badge ${seeker?.skills.includes(s) ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : ''}`}>
                    {SKILL_MAP[s] ?? s}
                  </span>
                ))}
              </div>
            </div>

            <div className="card p-6 sm:p-8">
              <h2 className="font-semibold">Benefits</h2>
              <ul className="mt-3 space-y-2">
                {job.benefits.map(b => (
                  <li key={b} className="flex items-start gap-2 text-slate-700">
                    <Check size={16} className="mt-0.5 shrink-0 text-navy-800" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            {match && (
              <div className="card p-6">
                <h2 className="font-semibold">Match breakdown</h2>
                <div className="mt-3 space-y-3">
                  <Breakdown label="Skills" value={match.breakdown.skills} />
                  <Breakdown label="Clearance" value={match.breakdown.clearance} />
                  <Breakdown label="Location" value={match.breakdown.location} />
                  <Breakdown label="Salary fit" value={match.breakdown.salary} />
                </div>
              </div>
            )}

            <div className="card p-6">
              <h2 className="font-semibold">About the company</h2>
              <p className="mt-2 text-sm text-slate-700">{job.company.industry}</p>
            </div>

            <div className="card p-6">
              <h2 className="font-semibold">Military preferences</h2>
              <div className="mt-3 text-sm text-slate-700 space-y-1">
                <div><span className="text-slate-500">Branches:</span> {job.branchPrefs.length ? job.branchPrefs.join(', ') : 'Any'}</div>
                <div><span className="text-slate-500">MOS:</span> {job.mosPrefs.length ? job.mosPrefs.join(', ') : 'Any'}</div>
                <div><span className="text-slate-500">Clearance:</span> {job.clearanceRequired}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Breakdown({ label, value }: { label: string; value: number }) {
  const color = value >= 80 ? 'bg-emerald-500' : value >= 50 ? 'bg-navy-800' : 'bg-rose-500';
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-slate-600">
        <span>{label}</span><span className="font-semibold">{value}%</span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
