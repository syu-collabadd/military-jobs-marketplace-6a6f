import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { JOBS } from '../data/seed';
import { topMatches } from '../lib/match';
import { formatSalaryRange } from '../lib/format';
import { MapPin, Shield, Star, ArrowUpRight, Sparkles, Sliders } from 'lucide-react';
import { SKILL_MAP } from '../data/skills';

export default function Matches() {
  const { seeker } = useAuth();
  const [minScore, setMinScore] = useState(0);
  const [sort, setSort] = useState<'score' | 'salary' | 'recent'>('score');

  const all = useMemo(() => (seeker ? topMatches(seeker, JOBS, 100) : []), [seeker]);
  const filtered = useMemo(() => {
    let out = all.filter(m => m.score >= minScore);
    if (sort === 'salary') out = [...out].sort((a, b) => b.job.salaryMax - a.job.salaryMax);
    if (sort === 'recent') out = [...out].sort((a, b) => b.job.postedAt - a.job.postedAt);
    return out;
  }, [all, minScore, sort]);

  if (!seeker) return null;

  return (
    <section className="section">
      <div className="container-x space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="eyebrow"><Sparkles size={12} /> Smart matches</span>
            <h1 className="h2 mt-3">Jobs ranked for you</h1>
            <p className="mt-1 text-slate-600 max-w-2xl">
              Scored on a 0–100 scale combining skills overlap (40%), clearance (20%), location fit (20%), and salary fit (20%).
            </p>
          </div>
        </div>

        <div className="card p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Sliders size={14} /> Refine
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-700">Min score</label>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={minScore}
                onChange={e => setMinScore(Number(e.target.value))}
                className="w-32 accent-navy-800"
              />
              <span className="text-sm font-semibold w-10 text-right">{minScore}%</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <label className="text-sm text-slate-700">Sort by</label>
              <select className="input py-1.5" value={sort} onChange={e => setSort(e.target.value as typeof sort)}>
                <option value="score">Match score</option>
                <option value="salary">Salary</option>
                <option value="recent">Recently posted</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="card p-10 text-center text-slate-600">No jobs match the current threshold. Lower the minimum score.</div>
          )}
          {filtered.map(m => (
            <div key={m.job.id} className="card p-5 sm:p-6">
              <div className="flex flex-wrap items-start gap-4">
                <span
                  className="grid h-12 w-12 place-items-center rounded-lg text-white font-bold shrink-0"
                  style={{ backgroundColor: m.job.company.logoColor }}
                >
                  {m.job.company.name[0]}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-lg font-semibold">{m.job.title}</span>
                    <span className={m.score >= 80 ? 'badge-gold' : m.score >= 60 ? 'badge-navy' : 'badge'}>
                      <Star size={11} fill="currentColor" /> {m.score}%
                    </span>
                  </div>
                  <div className="text-sm text-slate-600">{m.job.company.name} · {m.job.company.industry}</div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                    <span className="flex items-center gap-1"><MapPin size={12} /> {m.job.location}</span>
                    {m.job.remote && <span className="badge-green">Remote</span>}
                    {m.job.clearanceRequired !== 'None' && (
                      <span className="badge-navy inline-flex items-center gap-1">
                        <Shield size={10} /> {m.job.clearanceRequired}
                      </span>
                    )}
                    <span className="font-semibold text-navy-800">{formatSalaryRange(m.job.salaryMin, m.job.salaryMax)}</span>
                  </div>
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    <BreakdownPill label="Skills" value={m.breakdown.skills} />
                    <BreakdownPill label="Clearance" value={m.breakdown.clearance} />
                    <BreakdownPill label="Location" value={m.breakdown.location} />
                    <BreakdownPill label="Salary" value={m.breakdown.salary} />
                  </div>
                  {m.reasons.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {m.reasons.slice(0, 3).map(r => (
                        <span key={r} className="badge">{r}</span>
                      ))}
                    </div>
                  )}
                </div>
                <Link to={`/jobs/${m.job.id}`} className="btn-primary text-sm whitespace-nowrap">
                  View <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BreakdownPill({ label, value }: { label: string; value: number }) {
  const color = value >= 80 ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : value >= 50 ? 'text-navy-800 bg-navy-50 border-navy-200' : 'text-rose-700 bg-rose-50 border-rose-200';
  return (
    <div className={`rounded-md border px-2 py-1 text-center ${color}`}>
      <div className="text-sm font-bold">{value}%</div>
      <div className="text-[10px] uppercase tracking-wider opacity-80">{label}</div>
    </div>
  );
}
