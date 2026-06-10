import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { JOBS, SAMPLE_INTERVIEWS } from '../data/seed';
import { profileCompleteness, topMatches, computeMatch } from '../lib/match';
import { SKILL_MAP } from '../data/skills';
import { formatDateTime, formatSalaryRange, timeAgo } from '../lib/format';
import {
  Sparkles, Star, MapPin, Calendar, CheckCircle2, Clock, ChevronRight,
  FileText, Target, ArrowUpRight, Shield,
} from 'lucide-react';

export default function SeekerDashboard() {
  const { seeker } = useAuth();
  if (!seeker) return null;

  const completion = profileCompleteness(seeker);
  const matches = topMatches(seeker, JOBS, 4);
  const upcoming = SAMPLE_INTERVIEWS
    .filter(i => i.status !== 'declined' && i.scheduledFor > Date.now() - 24 * 60 * 60 * 1000)
    .sort((a, b) => a.scheduledFor - b.scheduledFor);

  const missingFields: string[] = [];
  if (!seeker.bio || seeker.bio.length < 20) missingFields.push('Add a short bio');
  if (!seeker.education) missingFields.push('Add your education');
  if (seeker.skills.length < 5) missingFields.push('Add at least 5 skills');
  if (seeker.resume.summary.length < 50) missingFields.push('Write a resume summary');
  if (seeker.resume.experience.length === 0) missingFields.push('Add one experience entry');

  return (
    <section className="section">
      <div className="container-x space-y-8">
        {/* Welcome banner */}
        <div className="card p-6 sm:p-8 bg-gradient-to-br from-navy-800 to-navy-900 text-white">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-sm text-navy-200">Welcome back,</div>
              <h1 className="mt-1 text-2xl sm:text-3xl font-bold">{seeker.fullName}</h1>
              <div className="mt-2 flex flex-wrap gap-2 text-sm text-navy-100">
                {seeker.rank && <span className="badge-gold">{seeker.rank}</span>}
                {seeker.branch && <span className="badge-navy">{seeker.branch}</span>}
                {seeker.clearance !== 'None' && (
                  <span className="badge-navy inline-flex items-center gap-1">
                    <Shield size={11} /> {seeker.clearance}
                  </span>
                )}
                <span className="badge">{seeker.yearsOfService} yrs service</span>
              </div>
            </div>
            <Link to="/resume" className="btn-gold">
              <FileText size={16} /> Edit resume
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile completion */}
          <div className="card p-6 lg:col-span-1">
            <div className="flex items-center gap-2">
              <Target size={18} className="text-navy-800" />
              <h2 className="font-semibold">Profile completion</h2>
            </div>
            <div className="mt-4 flex items-end gap-2">
              <span className="text-4xl font-extrabold text-navy-800">{completion}%</span>
              <span className="text-sm text-slate-500 mb-1">complete</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-navy-800 to-gold-500" style={{ width: `${completion}%` }} />
            </div>
            {missingFields.length > 0 && (
              <div className="mt-5">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">To reach 100%</div>
                <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
                  {missingFields.map(f => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/profile" className="btn-secondary mt-4 w-full">
                  Complete profile <ChevronRight size={14} />
                </Link>
              </div>
            )}
            {missingFields.length === 0 && (
              <div className="mt-4 flex items-center gap-2 text-sm text-emerald-700">
                <CheckCircle2 size={16} /> You're all set. Start applying.
              </div>
            )}
          </div>

          {/* Upcoming interviews */}
          <div className="card p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-navy-800" />
                <h2 className="font-semibold">Upcoming interviews</h2>
              </div>
              <Link to="/interviews" className="text-sm font-semibold text-navy-800 hover:underline">
                View all
              </Link>
            </div>
            {upcoming.length === 0 ? (
              <div className="mt-5 text-sm text-slate-600">No interviews scheduled. Apply to a job to get started.</div>
            ) : (
              <div className="mt-4 divide-y divide-slate-100">
                {upcoming.map(iv => {
                  const job = JOBS.find(j => j.id === iv.jobId);
                  return (
                    <div key={iv.id} className="py-3 flex flex-wrap items-center gap-3">
                      <div className="grid h-12 w-12 place-items-center rounded-lg text-white font-bold" style={{ backgroundColor: job?.company.logoColor ?? '#1e3a8a' }}>
                        {job?.company.name[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold truncate">{job?.title}</div>
                        <div className="text-xs text-slate-500">
                          {job?.company.name} · {job?.location}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{formatDateTime(iv.scheduledFor)}</div>
                        <div className={`text-xs ${iv.status === 'confirmed' ? 'text-emerald-600' : 'text-gold-600'}`}>
                          {iv.status === 'confirmed' ? '✓ Confirmed' : 'Pending confirmation'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Top matches */}
        <div>
          <div className="flex items-end justify-between">
            <div>
              <span className="eyebrow"><Sparkles size={12} /> For you</span>
              <h2 className="h2 mt-3">Top matches</h2>
              <p className="mt-1 text-slate-600">Based on your skills, clearance, location, and salary fit.</p>
            </div>
            <Link to="/matches" className="btn-secondary">View all <ArrowUpRight size={14} /></Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {matches.map(m => {
              const breakdown = m.breakdown;
              return (
                <Link
                  key={m.job.id}
                  to={`/jobs/${m.job.id}`}
                  className="card p-5 hover:shadow-glow transition"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="grid h-10 w-10 place-items-center rounded-lg text-white font-bold"
                      style={{ backgroundColor: m.job.company.logoColor }}
                    >
                      {m.job.company.name[0]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold truncate">{m.job.title}</div>
                      <div className="text-xs text-slate-500 truncate">{m.job.company.name}</div>
                    </div>
                    <span className={m.score >= 80 ? 'badge-gold' : m.score >= 60 ? 'badge-navy' : 'badge'}>
                      <Star size={11} fill="currentColor" /> {m.score}%
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                    <span className="flex items-center gap-1"><MapPin size={11} /> {m.job.location}</span>
                    {m.job.remote && <span className="badge-green">Remote</span>}
                    {m.job.clearanceRequired !== 'None' && (
                      <span className="badge-navy">{m.job.clearanceRequired}</span>
                    )}
                    <span className="text-slate-500">· {formatSalaryRange(m.job.salaryMin, m.job.salaryMax)}</span>
                  </div>

                  <div className="mt-4 grid grid-cols-4 gap-2 text-center">
                    <Stat label="Skills" value={breakdown.skills} />
                    <Stat label="Clear." value={breakdown.clearance} />
                    <Stat label="Loc." value={breakdown.location} />
                    <Stat label="Salary" value={breakdown.salary} />
                  </div>

                  {m.reasons.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {m.reasons.slice(0, 2).map(r => (
                        <span key={r} className="text-[11px] text-slate-600">· {r}</span>
                      ))}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent activity */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="card p-6 lg:col-span-2">
            <h2 className="font-semibold">Recently posted</h2>
            <div className="mt-4 divide-y divide-slate-100">
              {JOBS.slice(0, 5).map(j => {
                const m = computeMatch(seeker, j);
                return (
                  <Link key={j.id} to={`/jobs/${j.id}`} className="py-3 flex items-center gap-3 hover:bg-slate-50 -mx-3 px-3 rounded">
                    <span className="grid h-9 w-9 place-items-center rounded text-white text-sm font-bold" style={{ backgroundColor: j.company.logoColor }}>
                      {j.company.name[0]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">{j.title}</div>
                      <div className="text-xs text-slate-500">{j.company.name} · {j.location} · {timeAgo(j.postedAt)}</div>
                    </div>
                    <span className="text-xs text-slate-500">{m.score}%</span>
                    <ChevronRight size={16} className="text-slate-400" />
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="card p-6">
            <h2 className="font-semibold">Your skills</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {seeker.skills.map(s => (
                <span key={s} className="badge-navy">{SKILL_MAP[s] ?? s}</span>
              ))}
              <Link to="/profile" className="badge text-navy-800 border-navy-200">+ Edit</Link>
            </div>
            <div className="mt-6 rounded-lg bg-slate-50 border border-slate-200 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Clock size={14} className="text-gold-600" /> Tip
              </div>
              <p className="mt-1 text-sm text-slate-600">
                Profiles with 8+ skills and a complete resume summary get <span className="font-semibold text-navy-800">3.2× more interview requests</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  const color = value >= 80 ? 'text-emerald-600' : value >= 50 ? 'text-navy-800' : 'text-rose-600';
  return (
    <div>
      <div className={`text-sm font-bold ${color}`}>{value}%</div>
      <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
    </div>
  );
}
