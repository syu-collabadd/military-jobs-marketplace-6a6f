import { useAuth } from '../lib/auth';
import { useState } from 'react';
import { BRANCHES, CLEARANCES, SKILLS, SKILL_MAP, MOS_TRANSLATION } from '../data/skills';
import { profileCompleteness } from '../lib/match';
import type { Branch, Clearance } from '../types';
import { Check, Sparkles, ArrowRight } from 'lucide-react';

export default function SeekerProfile() {
  const { seeker, updateSeeker } = useAuth();
  if (!seeker) return null;
  const [name, setName] = useState(seeker.fullName);
  const [rank, setRank] = useState(seeker.rank ?? '');
  const [branch, setBranch] = useState<Branch>(seeker.branch ?? 'Army');
  const [mos, setMos] = useState(seeker.mos ?? '');
  const [clearance, setClearance] = useState<Clearance>(seeker.clearance);
  const [location, setLocation] = useState(seeker.location);
  const [salary, setSalary] = useState(seeker.desiredSalary);
  const [relocate, setRelocate] = useState(seeker.willingToRelocate);
  const [bio, setBio] = useState(seeker.bio);
  const [skills, setSkills] = useState<string[]>(seeker.skills);
  const [education, setEducation] = useState(seeker.education);
  const [saved, setSaved] = useState(false);
  const [mosApplied, setMosApplied] = useState(false);

  function toggleSkill(id: string) {
    setSkills(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  }

  function applyMosTranslation() {
    const code = mos.trim().toUpperCase();
    const t = MOS_TRANSLATION[code];
    if (!t) return;
    const merged = Array.from(new Set([...skills, ...t.skills]));
    setSkills(merged);
    if (!bio) {
      setBio(`${t.civilianTitle}. Bringing leadership, planning, and execution discipline to a civilian role.`);
    }
    setMosApplied(true);
    setTimeout(() => setMosApplied(false), 3000);
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    updateSeeker({
      fullName: name,
      rank,
      branch,
      mos,
      clearance,
      location,
      desiredSalary: salary,
      willingToRelocate: relocate,
      bio,
      skills,
      education,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  const completion = profileCompleteness({
    ...seeker,
    fullName: name,
    rank,
    branch,
    mos,
    clearance,
    location,
    desiredSalary: salary,
    willingToRelocate: relocate,
    bio,
    skills,
    education,
  });

  return (
    <section className="section">
      <div className="container-x max-w-3xl space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="h2">Your profile</h1>
            <p className="mt-1 text-slate-600">This is what employers see. Higher completion → more interview requests.</p>
          </div>
          <span className="badge-navy"><Sparkles size={12} /> {completion}% complete</span>
        </div>

        <form onSubmit={save} className="card p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="font-semibold">Personal</h2>
            <div className="mt-3 grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Full name</label>
                <input className="input" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <label className="label">Email</label>
                <input className="input" value={seeker.email} disabled />
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-semibold">Military background</h2>
            <div className="mt-3 grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Rank</label>
                <input className="input" value={rank} onChange={e => setRank(e.target.value)} placeholder="SSG (E-6)" />
              </div>
              <div>
                <label className="label">Branch</label>
                <select className="input" value={branch} onChange={e => setBranch(e.target.value as Branch)}>
                  {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="label">MOS code</label>
                <div className="flex gap-2">
                  <input className="input" value={mos} onChange={e => setMos(e.target.value.toUpperCase())} placeholder="25B" />
                  <button type="button" onClick={applyMosTranslation} className="btn-secondary text-sm whitespace-nowrap">
                    Auto-translate <ArrowRight size={12} />
                  </button>
                </div>
                {mosApplied && <p className="mt-1 text-xs text-emerald-700">Skills updated from MOS translation</p>}
                {mos && MOS_TRANSLATION[mos] && (
                  <p className="mt-1 text-xs text-slate-600">
                    Maps to: <span className="font-semibold">{MOS_TRANSLATION[mos].civilianTitle}</span>
                  </p>
                )}
              </div>
              <div>
                <label className="label">Clearance</label>
                <select className="input" value={clearance} onChange={e => setClearance(e.target.value as Clearance)}>
                  {CLEARANCES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-semibold">Civilian preferences</h2>
            <div className="mt-3 grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Location</label>
                <input className="input" value={location} onChange={e => setLocation(e.target.value)} placeholder="Arlington, VA" />
              </div>
              <div>
                <label className="label">Desired salary</label>
                <input type="number" className="input" value={salary} onChange={e => setSalary(Number(e.target.value))} />
              </div>
            </div>
            <label className="mt-3 flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={relocate}
                onChange={e => setRelocate(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-navy-800 focus:ring-navy-800"
              />
              Willing to relocate
            </label>
          </div>

          <div>
            <h2 className="font-semibold">About you</h2>
            <textarea
              className="input min-h-[100px] mt-3"
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Briefly summarize your leadership scope, technical strengths, and what you're looking for next."
            />
          </div>

          <div>
            <h2 className="font-semibold">Skills</h2>
            <p className="text-sm text-slate-600">Pick at least 5. These drive your match scores.</p>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-72 overflow-auto p-1">
              {SKILLS.map(s => (
                <label
                  key={s.id}
                  className={`flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-sm cursor-pointer transition ${skills.includes(s.id) ? 'border-navy-800 bg-navy-50' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <input
                    type="checkbox"
                    checked={skills.includes(s.id)}
                    onChange={() => toggleSkill(s.id)}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-navy-800 focus:ring-navy-800"
                  />
                  <span className="truncate">{s.name}</span>
                </label>
              ))}
            </div>
            <p className="mt-1 text-xs text-slate-500">{skills.length} selected</p>
          </div>

          <div>
            <h2 className="font-semibold">Education</h2>
            <input
              className="input mt-3"
              value={education}
              onChange={e => setEducation(e.target.value)}
              placeholder="B.S. Information Technology, UMUC (2021)"
            />
          </div>

          <div className="flex items-center justify-end gap-3">
            {saved && <span className="text-sm text-emerald-700 inline-flex items-center gap-1"><Check size={14} /> Saved</span>}
            <button type="submit" className="btn-primary">Save profile</button>
          </div>
        </form>
      </div>
    </section>
  );
}
