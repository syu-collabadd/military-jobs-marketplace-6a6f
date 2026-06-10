import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BRANCHES, CLEARANCES, SKILLS } from '../data/skills';
import { useAuth } from '../lib/auth';
import { Check, ChevronRight } from 'lucide-react';
import type { Clearance, Branch, Job } from '../types';
import { JOBS } from '../data/seed';
import { formatSalaryRange } from '../lib/format';

export default function EmployerPostJob() {
  const { employer } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [remote, setRemote] = useState(false);
  const [clearance, setClearance] = useState<Clearance>('None');
  const [salaryMin, setSalaryMin] = useState(90000);
  const [salaryMax, setSalaryMax] = useState(120000);
  const [branchPrefs, setBranchPrefs] = useState<Branch[]>([]);
  const [mosInput, setMosInput] = useState('');
  const [mosPrefs, setMosPrefs] = useState<string[]>([]);
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [benefits, setBenefits] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function toggle<T>(arr: T[], v: T, set: (a: T[]) => void) {
    set(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);
  }

  function addMos() {
    const t = mosInput.trim().toUpperCase();
    if (t && !mosPrefs.includes(t)) setMosPrefs([...mosPrefs, t]);
    setMosInput('');
  }

  function submit() {
    const job: Job = {
      id: `j-${Date.now()}`,
      employerId: employer?.id ?? 'e1',
      company: {
        name: employer?.company.name ?? 'My Company',
        industry: employer?.company.industry ?? '',
        logoColor: '#1e3a8a',
      },
      title: title || 'Untitled role',
      location: remote ? 'Remote — U.S.' : location || 'TBD',
      remote,
      clearanceRequired: clearance,
      salaryMin,
      salaryMax,
      branchPrefs,
      mosPrefs,
      description: description || 'Job description pending.',
      responsibilities: responsibilities.split('\n').map(s => s.trim()).filter(Boolean),
      benefits: benefits.split('\n').map(s => s.trim()).filter(Boolean),
      requiredSkills,
      postedAt: Date.now(),
      applicants: 0,
    };
    // Add to seed for demo (in-memory only)
    JOBS.unshift(job);
    setSubmitted(true);
    setTimeout(() => navigate('/employer'), 1500);
  }

  if (submitted) {
    return (
      <section className="section">
        <div className="container-x max-w-xl">
          <div className="card p-10 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-emerald-600">
              <Check size={28} />
            </div>
            <h2 className="mt-4 text-xl font-bold">Job posted!</h2>
            <p className="mt-1 text-sm text-slate-600">Redirecting to your dashboard…</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container-x max-w-3xl space-y-6">
        <div>
          <h1 className="h2">Post a new role</h1>
          <p className="mt-1 text-slate-600">Step {step} of 3 — takes about 2 minutes.</p>
        </div>

        <div className="flex items-center gap-2">
          {[1, 2, 3].map(n => (
            <div key={n} className={`h-1.5 flex-1 rounded-full ${n <= step ? 'bg-navy-800' : 'bg-slate-200'}`} />
          ))}
        </div>

        <div className="card p-6 sm:p-8 space-y-5">
          {step === 1 && (
            <>
              <h2 className="font-semibold">Basics</h2>
              <div>
                <label className="label">Job title</label>
                <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Operations Manager — Defense Programs" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Location</label>
                  <input className="input" value={location} onChange={e => setLocation(e.target.value)} placeholder="Arlington, VA" disabled={remote} />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" checked={remote} onChange={e => setRemote(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-navy-800 focus:ring-navy-800" />
                    Open to remote candidates
                  </label>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="label">Salary min</label>
                  <input type="number" className="input" value={salaryMin} onChange={e => setSalaryMin(Number(e.target.value))} />
                </div>
                <div>
                  <label className="label">Salary max</label>
                  <input type="number" className="input" value={salaryMax} onChange={e => setSalaryMax(Number(e.target.value))} />
                </div>
                <div>
                  <label className="label">Required clearance</label>
                  <select className="input" value={clearance} onChange={e => setClearance(e.target.value as Clearance)}>
                    {CLEARANCES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-2 text-sm text-slate-700">
                Salary range: <span className="font-semibold">{formatSalaryRange(salaryMin, salaryMax)}</span>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="font-semibold">Target military background</h2>
              <p className="text-sm text-slate-600">These help our matching algorithm rank candidates.</p>
              <div>
                <label className="label">Preferred branches</label>
                <div className="flex flex-wrap gap-2">
                  {BRANCHES.map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => toggle(branchPrefs, b, setBranchPrefs)}
                      className={`rounded-full border px-3 py-1 text-sm font-medium transition ${branchPrefs.includes(b) ? 'bg-navy-800 border-navy-800 text-white' : 'bg-white border-slate-300 text-slate-700 hover:border-navy-800'}`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Preferred MOS codes</label>
                <div className="flex gap-2">
                  <input className="input" value={mosInput} onChange={e => setMosInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addMos())} placeholder="e.g. 25B" />
                  <button type="button" onClick={addMos} className="btn-secondary">Add</button>
                </div>
                {mosPrefs.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {mosPrefs.map(m => (
                      <span key={m} className="badge-navy">
                        {m}
                        <button onClick={() => setMosPrefs(mosPrefs.filter(x => x !== m))} className="ml-1 text-navy-400 hover:text-navy-800">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="label">Required skills</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-auto p-1">
                  {SKILLS.map(s => (
                    <label key={s.id} className={`flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-sm cursor-pointer transition ${requiredSkills.includes(s.id) ? 'border-navy-800 bg-navy-50' : 'border-slate-200 hover:border-slate-300'}`}>
                      <input
                        type="checkbox"
                        checked={requiredSkills.includes(s.id)}
                        onChange={() => toggle(requiredSkills, s.id, setRequiredSkills)}
                        className="h-3.5 w-3.5 rounded border-slate-300 text-navy-800 focus:ring-navy-800"
                      />
                      <span className="truncate">{s.name}</span>
                    </label>
                  ))}
                </div>
                <p className="mt-1 text-xs text-slate-500">{requiredSkills.length} selected</p>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="font-semibold">Description & benefits</h2>
              <div>
                <label className="label">Job description</label>
                <textarea className="input min-h-[120px]" value={description} onChange={e => setDescription(e.target.value)} placeholder="A few sentences about the role, team, and what success looks like." />
              </div>
              <div>
                <label className="label">Responsibilities (one per line)</label>
                <textarea className="input min-h-[100px]" value={responsibilities} onChange={e => setResponsibilities(e.target.value)} placeholder="Manage $20M+ program deliverables&#10;Coordinate with government stakeholders" />
              </div>
              <div>
                <label className="label">Benefits (one per line)</label>
                <textarea className="input min-h-[80px]" value={benefits} onChange={e => setBenefits(e.target.value)} placeholder="20% 401(k) match&#10;Full medical/dental/vision" />
              </div>
            </>
          )}

          <div className="flex items-center justify-between pt-2">
            {step > 1 ? (
              <button onClick={() => setStep(s => s - 1)} className="btn-ghost">Back</button>
            ) : (
              <span />
            )}
            {step < 3 ? (
              <button onClick={() => setStep(s => s + 1)} className="btn-primary">
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <button onClick={submit} className="btn-primary">
                <Check size={16} /> Publish role
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
