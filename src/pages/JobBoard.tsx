import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { JOBS } from '../data/seed';
import { CLEARANCES, BRANCHES, SKILLS, SKILL_MAP } from '../data/skills';
import { formatSalaryRange, timeAgo } from '../lib/format';
import { useAuth } from '../lib/auth';
import { computeMatch } from '../lib/match';
import type { Branch, Clearance } from '../types';
import { MapPin, Search, Filter, Star, Shield } from 'lucide-react';

export default function JobBoard() {
  const { seeker } = useAuth();
  const [query, setQuery] = useState('');
  const [branch, setBranch] = useState<Branch | 'all'>('all');
  const [clearance, setClearance] = useState<Clearance | 'all'>('all');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [salaryMin, setSalaryMin] = useState(0);
  const [skillFilter, setSkillFilter] = useState('');

  const filtered = useMemo(() => {
    return JOBS.filter(j => {
      if (branch !== 'all' && !j.branchPrefs.includes(branch) && j.branchPrefs.length > 0) return false;
      if (clearance !== 'all' && j.clearanceRequired !== clearance) return false;
      if (remoteOnly && !j.remote) return false;
      if (salaryMin > 0 && j.salaryMax < salaryMin) return false;
      if (skillFilter && !j.requiredSkills.includes(skillFilter)) return false;
      if (query) {
        const q = query.toLowerCase();
        const hay = `${j.title} ${j.description} ${j.company.name} ${j.requiredSkills.map(s => SKILL_MAP[s] ?? s).join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [query, branch, clearance, remoteOnly, salaryMin, skillFilter]);

  return (
    <section className="section">
      <div className="container-x space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="h2">Find your next mission</h1>
            <p className="mt-1 text-slate-600">{JOBS.length} roles across defense, cyber, healthcare, logistics, and government.</p>
          </div>
          {!seeker && (
            <Link to="/signup?role=seeker" className="btn-primary">Create free profile</Link>
          )}
        </div>

        {/* Search + filters */}
        <div className="card p-4 sm:p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Filter size={14} /> Filters
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative lg:col-span-2">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by title, company, or skill…"
                className="input pl-9"
              />
            </div>
            <select className="input" value={branch} onChange={e => setBranch(e.target.value as Branch | 'all')}>
              <option value="all">All branches</option>
              {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <select className="input" value={clearance} onChange={e => setClearance(e.target.value as Clearance | 'all')}>
              <option value="all">All clearances</option>
              {CLEARANCES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="input" value={skillFilter} onChange={e => setSkillFilter(e.target.value)}>
              <option value="">All skills</option>
              {SKILLS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <div className="flex items-center gap-3 px-1">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={remoteOnly}
                  onChange={e => setRemoteOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-navy-800 focus:ring-navy-800"
                />
                Remote only
              </label>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-700 shrink-0">Min salary</label>
              <input
                type="range"
                min={0}
                max={200000}
                step={10000}
                value={salaryMin}
                onChange={e => setSalaryMin(Number(e.target.value))}
                className="flex-1 accent-navy-800"
              />
              <span className="text-sm font-semibold w-14 text-right">{salaryMin ? `$${Math.round(salaryMin/1000)}k` : '—'}</span>
            </div>
          </div>
          <div className="mt-3 text-sm text-slate-500">
            {filtered.length} {filtered.length === 1 ? 'job' : 'jobs'} match
          </div>
        </div>

        {/* Results */}
        <div className="grid gap-4">
          {filtered.length === 0 && (
            <div className="card p-10 text-center text-slate-600">
              No jobs match those filters. Try widening the search.
            </div>
          )}
          {filtered.map(job => {
            const match = seeker ? computeMatch(seeker, job) : null;
            return (
              <Link key={job.id} to={`/jobs/${job.id}`} className="card p-5 sm:p-6 hover:shadow-glow transition">
                <div className="flex flex-wrap items-start gap-4">
                  <span
                    className="grid h-12 w-12 place-items-center rounded-lg text-white font-bold shrink-0"
                    style={{ backgroundColor: job.company.logoColor }}
                  >
                    {job.company.name[0]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-lg font-semibold">{job.title}</span>
                      {match && (
                        <span className={match.score >= 80 ? 'badge-gold' : match.score >= 60 ? 'badge-navy' : 'badge'}>
                          <Star size={11} fill="currentColor" /> {match.score}% match
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-slate-600">
                      {job.company.name} · {job.company.industry}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                      <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                      {job.remote && <span className="badge-green">Remote</span>}
                      {job.clearanceRequired !== 'None' && (
                        <span className="badge-navy inline-flex items-center gap-1">
                          <Shield size={10} /> {job.clearanceRequired}
                        </span>
                      )}
                      <span className="font-semibold text-navy-800">{formatSalaryRange(job.salaryMin, job.salaryMax)}</span>
                      <span className="text-slate-400">·</span>
                      <span>{timeAgo(job.postedAt)}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-700 line-clamp-2 max-w-3xl">{job.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {job.requiredSkills.slice(0, 5).map(s => (
                        <span key={s} className="badge-navy">{SKILL_MAP[s] ?? s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-semibold">{job.applicants}</div>
                    <div className="text-xs text-slate-500">applicants</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
