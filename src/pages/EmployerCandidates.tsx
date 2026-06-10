import { useState, useMemo } from 'react';
import { useAuth } from '../lib/auth';
import { JOBS, SEEKER_SAMPLE, BRANCH_LIST } from '../data/seed';
import { computeMatch } from '../lib/match';
import { CLEARANCES, BRANCHES, SKILLS, SKILL_MAP } from '../data/skills';
import type { Clearance, Branch } from '../types';
import { formatSalary, tzAbbr } from '../lib/format';
import { Star, MapPin, Shield, Filter, Search, Mail } from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  rank: string;
  branch: Branch;
  mos: string;
  yearsOfService: number;
  clearance: Clearance;
  location: string;
  desiredSalary: number;
  willingToRelocate: boolean;
  skills: string[];
  bio: string;
}

// Build a synthetic candidate pool from the seed seeker + variants.
const CANDIDATE_POOL: Candidate[] = [
  {
    id: 'c-1', name: SEEKER_SAMPLE.fullName, rank: SEEKER_SAMPLE.rank ?? 'SSG', branch: SEEKER_SAMPLE.branch ?? 'Army',
    mos: SEEKER_SAMPLE.mos ?? '25B', yearsOfService: SEEKER_SAMPLE.yearsOfService, clearance: SEEKER_SAMPLE.clearance,
    location: SEEKER_SAMPLE.location, desiredSalary: SEEKER_SAMPLE.desiredSalary, willingToRelocate: SEEKER_SAMPLE.willingToRelocate,
    skills: SEEKER_SAMPLE.skills, bio: SEEKER_SAMPLE.bio,
  },
  { id: 'c-2', name: 'Marcus Reyes', rank: 'SFC (E-7)', branch: 'Army', mos: '17C', yearsOfService: 12, clearance: 'Top Secret', location: 'Colorado Springs, CO', desiredSalary: 145000, willingToRelocate: false, skills: ['cyber-sec', 'pen-test', 'siem', 'network-admin', 'lead-team'], bio: 'Senior cyber operations NCO. 12 years leading defensive and offensive teams.' },
  { id: 'c-3', name: 'Aisha Patel', rank: 'Capt (O-3)', branch: 'Air Force', mos: '17S', yearsOfService: 6, clearance: 'TS/SCI', location: 'San Antonio, TX', desiredSalary: 125000, willingToRelocate: true, skills: ['cyber-sec', 'siem', 'pen-test', 'public-speaking'], bio: 'Cyber warfare officer with experience briefing senior leaders.' },
  { id: 'c-4', name: 'Devon Brooks', rank: 'GySgt (E-7)', branch: 'Marines', mos: '31B', yearsOfService: 14, clearance: 'Secret', location: 'Norfolk, VA', desiredSalary: 95000, willingToRelocate: true, skills: ['lead-team', 'risk-asses', 'composite-risk', 'training', 'mentor'], bio: 'Marine gunnery sergeant turned security operations leader.' },
  { id: 'c-5', name: 'Tasha Nguyen', rank: 'PO2 (E-5)', branch: 'Navy', mos: '15T', yearsOfService: 6, clearance: 'None', location: 'San Diego, CA', desiredSalary: 78000, willingToRelocate: false, skills: ['avionics', 'mech-repair', 'electrical', 'quality-ctrl'], bio: 'Navy aviation electronics technician transitioning to MRO.' },
  { id: 'c-6', name: 'Riley Thompson', rank: 'SSgt (E-5)', branch: 'Air Force', mos: '35F', yearsOfService: 7, clearance: 'Top Secret', location: 'Washington, DC', desiredSalary: 110000, willingToRelocate: false, skills: ['radar', 'comms', 'risk-asses', 'public-speaking', 'strategic-plan'], bio: 'Air Force intelligence analyst, fluent in adversary TTPs.' },
  { id: 'c-7', name: 'Hector Salinas', rank: 'SGT (E-5)', branch: 'Army', mos: '68W', yearsOfService: 5, clearance: 'None', location: 'El Paso, TX', desiredSalary: 70000, willingToRelocate: true, skills: ['triage', 'field-med', 'patient-care', 'training'], bio: 'Combat medic with 5 years and 200+ field trauma cases.' },
  { id: 'c-8', name: 'Jordan Kim', rank: 'LT (O-3)', branch: 'Navy', mos: '42A', yearsOfService: 4, clearance: 'Secret', location: 'Arlington, VA', desiredSalary: 105000, willingToRelocate: true, skills: ['mentor', 'training', 'comms', 'project-mgmt', 'lead-team'], bio: 'Navy HR officer pivoting to corporate learning & development.' },
  { id: 'c-9', name: 'Casey Morgan', rank: 'SSG (E-6)', branch: 'Army', mos: '88M', yearsOfService: 8, clearance: 'None', location: 'Fort Bragg, NC', desiredSalary: 82000, willingToRelocate: true, skills: ['fleet-mgmt', 'inventory', 'lead-team', 'training', 'supply-chain'], bio: 'Motor transport NCOIC. 8 years coordinating multi-state convoys.' },
  { id: 'c-10', name: 'Samira Hassan', rank: 'CPT (O-3)', branch: 'Army', mos: '25B', yearsOfService: 7, clearance: 'Secret', location: 'Huntsville, AL', desiredSalary: 130000, willingToRelocate: false, skills: ['network-admin', 'comms', 'cyber-sec', 'lead-team', 'project-mgmt'], bio: 'Signal corps officer, program management focus.' },
];

export default function EmployerCandidates() {
  const { employer } = useAuth();

  const [query, setQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState<Branch | 'all'>('all');
  const [clearanceFilter, setClearanceFilter] = useState<Clearance | 'all'>('all');
  const [skillFilter, setSkillFilter] = useState<string>('');
  const [relocateOnly, setRelocateOnly] = useState(false);

  const myJobs = useMemo(
    () => (employer ? JOBS.filter(j => j.employerId === employer.id || j.employerId === 'e1') : JOBS.slice(0, 1)),
    [employer]
  );
  const bestJob = myJobs[0];

  const filtered = useMemo(() => {
    return CANDIDATE_POOL.filter(c => {
      if (branchFilter !== 'all' && c.branch !== branchFilter) return false;
      if (clearanceFilter !== 'all' && c.clearance !== clearanceFilter) return false;
      if (relocateOnly && !c.willingToRelocate) return false;
      if (skillFilter && !c.skills.includes(skillFilter)) return false;
      if (query) {
        const q = query.toLowerCase();
        const hay = `${c.name} ${c.mos} ${c.bio} ${c.skills.map(s => SKILL_MAP[s] ?? s).join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [query, branchFilter, clearanceFilter, skillFilter, relocateOnly]);

  return (
    <section className="section">
      <div className="container-x space-y-6">
        <div>
          <h1 className="h2">Candidates</h1>
          <p className="mt-1 text-slate-600">
            Ranked for your <span className="font-semibold text-navy-800">{bestJob?.title ?? 'open roles'}</span> based on skills, clearance, location, and salary fit.
          </p>
        </div>

        {/* Filters */}
        <div className="card p-4 sm:p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Filter size={14} /> Filters
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div className="relative lg:col-span-2">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by name, MOS, skill…"
                className="input pl-9"
              />
            </div>
            <select className="input" value={branchFilter} onChange={e => setBranchFilter(e.target.value as Branch | 'all')}>
              <option value="all">All branches</option>
              {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <select className="input" value={clearanceFilter} onChange={e => setClearanceFilter(e.target.value as Clearance | 'all')}>
              <option value="all">All clearances</option>
              {CLEARANCES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="input" value={skillFilter} onChange={e => setSkillFilter(e.target.value)}>
              <option value="">All skills</option>
              {SKILLS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={relocateOnly}
                onChange={e => setRelocateOnly(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-navy-800 focus:ring-navy-800"
              />
              Willing to relocate only
            </label>
            <span className="ml-auto text-sm text-slate-500">
              {filtered.length} {filtered.length === 1 ? 'candidate' : 'candidates'}
            </span>
          </div>
        </div>

        {/* Candidate list */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="card p-10 text-center text-slate-600">No candidates match your filters.</div>
          )}
          {filtered
            .map(c => ({ c, match: bestJob ? computeMatch(
              { ...SEEKER_SAMPLE, id: c.id, email: '', fullName: c.name, rank: c.rank, branch: c.branch, mos: c.mos, yearsOfService: c.yearsOfService, clearance: c.clearance, location: c.location, desiredSalary: c.desiredSalary, willingToRelocate: c.willingToRelocate, education: '', bio: c.bio, skills: c.skills, targetRoles: [], resume: SEEKER_SAMPLE.resume, createdAt: Date.now() },
              bestJob
            ) : null }))
            .sort((a, b) => (b.match?.score ?? 0) - (a.match?.score ?? 0))
            .map(({ c, match }) => (
              <div key={c.id} className="card p-5">
                <div className="flex flex-wrap items-start gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-navy-800 text-white font-bold">
                    {c.name.split(' ').map(s => s[0]).join('')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{c.name}</span>
                      <span className="badge-navy">{c.rank}</span>
                      <span className="badge">{c.branch}</span>
                      <span className="badge">MOS {c.mos}</span>
                      {c.clearance !== 'None' && (
                        <span className="badge-navy inline-flex items-center gap-1">
                          <Shield size={10} /> {c.clearance}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-sm text-slate-600 flex flex-wrap gap-3">
                      <span className="flex items-center gap-1"><MapPin size={12} /> {c.location}</span>
                      <span>{c.yearsOfService} yrs service</span>
                      <span>{formatSalary(c.desiredSalary)} target</span>
                      {c.willingToRelocate && <span className="text-emerald-700">Willing to relocate</span>}
                    </div>
                    <p className="mt-2 text-sm text-slate-700 max-w-2xl">{c.bio}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {c.skills.slice(0, 6).map(s => (
                        <span key={s} className="badge-navy">{SKILL_MAP[s] ?? s}</span>
                      ))}
                    </div>
                  </div>
                  {match && (
                    <div className="text-right">
                      <div className={`text-2xl font-extrabold ${match.score >= 80 ? 'text-navy-800' : match.score >= 60 ? 'text-slate-700' : 'text-slate-500'}`}>
                        {match.score}%
                      </div>
                      <div className="text-xs text-slate-500">match</div>
                      <div className="mt-3 flex flex-col gap-1.5">
                        <button className="btn-primary text-xs px-3 py-1.5">Request interview</button>
                        <button className="btn-ghost text-xs">Message <Mail size={11} /></button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
