import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../lib/auth';
import { MOS_TRANSLATION, SKILLS, SKILL_MAP } from '../data/skills';
import { Download, Sparkles, Plus, Trash2, GripVertical, Eye, EyeOff, Save, Check } from 'lucide-react';
import type { ResumeData, ResumeSection } from '../types';

const RESUME_STORAGE_KEY = 'valorhire.resume.draft.v1';

export default function ResumeBuilder() {
  const { seeker, updateSeeker } = useAuth();
  if (!seeker) return null;
  return <ResumeBuilderForm seeker={seeker} updateSeeker={updateSeeker} />;
}

type Seeker = NonNullable<ReturnType<typeof useAuth>['seeker']>;
type UpdateSeeker = ReturnType<typeof useAuth>['updateSeeker'];

function ResumeBuilderForm({ seeker, updateSeeker }: { seeker: Seeker; updateSeeker: UpdateSeeker }) {
  // Load draft from localStorage or fall back to seeker.resume
  const [data, setData] = useState<ResumeData>(() => {
    try {
      const raw = localStorage.getItem(RESUME_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {/* */}
    return seeker.resume;
  });
  const [activeSection, setActiveSection] = useState<string>('summary');
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [mosApplied, setMosApplied] = useState(false);
  const dragId = useRef<string | null>(null);

  // Auto-save
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(data));
        setSavedAt(Date.now());
        updateSeeker({ resume: data });
      } catch {/* */}
    }, 500);
    return () => clearTimeout(t);
  }, [data, updateSeeker]);

  // Helpers
  function setSummary(v: string) {
    setData(d => ({ ...d, summary: v }));
  }
  function setSkillList(arr: string[]) {
    setData(d => ({ ...d, skills: arr }));
  }
  function addExperience() {
    setData(d => ({
      ...d,
      experience: [...d.experience, { id: `exp-${Date.now()}`, title: '', org: '', start: '', end: '', bullets: [''] }],
    }));
  }
  function updateExp(id: string, patch: Partial<ResumeData['experience'][number]>) {
    setData(d => ({ ...d, experience: d.experience.map(e => e.id === id ? { ...e, ...patch } : e) }));
  }
  function removeExp(id: string) {
    setData(d => ({ ...d, experience: d.experience.filter(e => e.id !== id) }));
  }
  function addBullet(id: string) {
    setData(d => ({ ...d, experience: d.experience.map(e => e.id === id ? { ...e, bullets: [...e.bullets, ''] } : e) }));
  }
  function updateBullet(id: string, idx: number, value: string) {
    setData(d => ({ ...d, experience: d.experience.map(e => e.id === id ? { ...e, bullets: e.bullets.map((b, i) => i === idx ? value : b) } : e) }));
  }
  function removeBullet(id: string, idx: number) {
    setData(d => ({ ...d, experience: d.experience.map(e => e.id === id ? { ...e, bullets: e.bullets.filter((_, i) => i !== idx) } : e) }));
  }
  function addEdu() {
    setData(d => ({ ...d, education: [...d.education, { id: `edu-${Date.now()}`, school: '', degree: '', year: '' }] }));
  }
  function updateEdu(id: string, patch: Partial<ResumeData['education'][number]>) {
    setData(d => ({ ...d, education: d.education.map(e => e.id === id ? { ...e, ...patch } : e) }));
  }
  function removeEdu(id: string) {
    setData(d => ({ ...d, education: d.education.filter(e => e.id !== id) }));
  }
  function addCert() {
    setData(d => ({ ...d, certifications: [...d.certifications, { id: `cert-${Date.now()}`, name: '', issuer: '', year: '' }] }));
  }
  function updateCert(id: string, patch: Partial<ResumeData['certifications'][number]>) {
    setData(d => ({ ...d, certifications: d.certifications.map(c => c.id === id ? { ...c, ...patch } : c) }));
  }
  function removeCert(id: string) {
    setData(d => ({ ...d, certifications: d.certifications.filter(c => c.id !== id) }));
  }
  function toggleSectionVisible(id: string) {
    setData(d => ({ ...d, sections: d.sections.map(s => s.id === id ? { ...s, visible: !s.visible } : s) }));
  }
  function reorderSection(fromId: string, toId: string) {
    if (fromId === toId) return;
    setData(d => {
      const sections = [...d.sections];
      const fromIdx = sections.findIndex(s => s.id === fromId);
      const toIdx = sections.findIndex(s => s.id === toId);
      if (fromIdx < 0 || toIdx < 0) return d;
      const [moved] = sections.splice(fromIdx, 1);
      sections.splice(toIdx, 0, moved);
      return { ...d, sections: sections.map((s, i) => ({ ...s, order: i })) };
    });
  }
  function translateMOS() {
    const code = seeker.mos?.trim().toUpperCase() ?? '';
    const t = MOS_TRANSLATION[code];
    if (!t) return;
    // Add skills
    const newSkills = Array.from(new Set([...data.skills, ...t.skills]));
    setSkillList(newSkills);
    // Pre-fill summary if blank
    let nextSummary = data.summary;
    if (!data.summary || data.summary.length < 20) {
      nextSummary = `${t.civilianTitle}. Translating military discipline, planning, and team leadership into measurable civilian outcomes. Open to operations, program, and IT leadership roles.`;
    }
    setSummary(nextSummary);
    // Pre-fill first experience entry's first bullet if blank
    if (data.experience[0] && (!data.experience[0].bullets[0] || data.experience[0].bullets[0].length < 5)) {
      const expId = data.experience[0].id;
      updateBullet(expId, 0, `Translated skills include: ${t.skills.slice(0, 4).map(s => SKILL_MAP[s] ?? s).join(', ')}.`);
    }
    setMosApplied(true);
    setTimeout(() => setMosApplied(false), 3000);
  }

  function downloadJSON() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${seeker.fullName.replace(/\s+/g, '-').toLowerCase()}-resume.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="section">
      <div className="container-x space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="h2">Resume builder</h1>
            <p className="mt-1 text-slate-600">Drag to reorder sections. We auto-save as you type.</p>
          </div>
          <div className="flex items-center gap-2">
            {savedAt && (
              <span className="text-xs text-slate-500 inline-flex items-center gap-1">
                <Save size={12} /> Saved
              </span>
            )}
            <button onClick={downloadJSON} className="btn-secondary">
              <Download size={14} /> Export
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Editor */}
          <div className="lg:col-span-2 space-y-4">
            {/* MOS auto-translation banner */}
            {seeker.mos && MOS_TRANSLATION[seeker.mos.trim().toUpperCase()] && (
              <div className="card p-4 bg-gradient-to-r from-navy-50 to-gold-50 border-navy-200">
                <div className="flex flex-wrap items-center gap-3">
                  <Sparkles size={18} className="text-gold-600" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-navy-800">
                      MOS {seeker.mos} → {MOS_TRANSLATION[seeker.mos.trim().toUpperCase()].civilianTitle}
                    </div>
                    <div className="text-xs text-slate-600">
                      Recommended skills: {MOS_TRANSLATION[seeker.mos.trim().toUpperCase()].skills.slice(0, 5).map(s => SKILL_MAP[s]).join(', ')}
                    </div>
                  </div>
                  {mosApplied && <span className="text-xs text-emerald-700 inline-flex items-center gap-1"><Check size={12} /> Applied</span>}
                  <button onClick={translateMOS} className="btn-gold text-sm">Auto-fill from MOS</button>
                </div>
              </div>
            )}

            {/* Section tabs */}
            <div className="card p-2">
              <div className="flex flex-wrap gap-1">
                {data.sections.sort((a, b) => a.order - b.order).map(sec => (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSection(sec.type)}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${activeSection === sec.type ? 'bg-navy-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    {sec.title}
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={e => { e.stopPropagation(); toggleSectionVisible(sec.id); }}
                      className="ml-2 inline-flex"
                      aria-label={sec.visible ? 'Hide section' : 'Show section'}
                    >
                      {sec.visible ? <Eye size={11} /> : <EyeOff size={11} className="opacity-50" />}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Section editor */}
            {activeSection === 'summary' && (
              <div className="card p-6">
                <h2 className="font-semibold">Professional summary</h2>
                <p className="text-sm text-slate-600">2-3 sentences. Lead with your MOS → civilian translation, your scope of leadership, and what you're targeting next.</p>
                <textarea
                  className="input min-h-[140px] mt-3"
                  value={data.summary}
                  onChange={e => setSummary(e.target.value)}
                  placeholder="Signal officer (25B) with 8 years leading tactical communications teams of 8-30 soldiers…"
                />
                <div className="mt-1 text-xs text-slate-500">{data.summary.length} characters</div>
              </div>
            )}

            {activeSection === 'experience' && (
              <div className="space-y-4">
                {data.experience.map(exp => (
                  <div key={exp.id} className="card p-6">
                    <div className="flex items-start gap-2">
                      <div className="grid h-10 w-10 place-items-center rounded bg-navy-50 text-navy-800 shrink-0">
                        <BriefcaseIcon />
                      </div>
                      <div className="grid grid-cols-2 gap-3 flex-1">
                        <input
                          className="input font-semibold"
                          placeholder="Job title / role"
                          value={exp.title}
                          onChange={e => updateExp(exp.id, { title: e.target.value })}
                        />
                        <input
                          className="input"
                          placeholder="Organization"
                          value={exp.org}
                          onChange={e => updateExp(exp.id, { org: e.target.value })}
                        />
                        <input
                          className="input"
                          placeholder="Start (e.g. 2022-03)"
                          value={exp.start}
                          onChange={e => updateExp(exp.id, { start: e.target.value })}
                        />
                        <input
                          className="input"
                          placeholder="End (e.g. Present)"
                          value={exp.end}
                          onChange={e => updateExp(exp.id, { end: e.target.value })}
                        />
                      </div>
                      <button onClick={() => removeExp(exp.id)} className="btn-ghost p-2 text-rose-600" aria-label="Remove">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="mt-4">
                      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Bullets</div>
                      <div className="mt-2 space-y-2">
                        {exp.bullets.map((b, i) => (
                          <div key={i} className="flex gap-2">
                            <input
                              className="input"
                              placeholder="Led 12-soldier team maintaining tactical communications for 4,000+ paratroopers"
                              value={b}
                              onChange={e => updateBullet(exp.id, i, e.target.value)}
                            />
                            <button onClick={() => removeBullet(exp.id, i)} className="btn-ghost p-2 text-slate-400" aria-label="Remove bullet">
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => addBullet(exp.id)} className="btn-ghost mt-2 text-sm">
                        <Plus size={12} /> Add bullet
                      </button>
                    </div>
                  </div>
                ))}
                <button onClick={addExperience} className="btn-secondary w-full">
                  <Plus size={14} /> Add experience
                </button>
              </div>
            )}

            {activeSection === 'skills' && (
              <div className="card p-6">
                <h2 className="font-semibold">Civilian skills</h2>
                <p className="text-sm text-slate-600">These power your match scores across all jobs.</p>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-96 overflow-auto p-1">
                  {SKILLS.map(s => (
                    <label
                      key={s.id}
                      className={`flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-sm cursor-pointer transition ${data.skills.includes(s.id) ? 'border-navy-800 bg-navy-50' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      <input
                        type="checkbox"
                        checked={data.skills.includes(s.id)}
                        onChange={() => setSkillList(data.skills.includes(s.id) ? data.skills.filter(x => x !== s.id) : [...data.skills, s.id])}
                        className="h-3.5 w-3.5 rounded border-slate-300 text-navy-800 focus:ring-navy-800"
                      />
                      <span className="truncate">{s.name}</span>
                    </label>
                  ))}
                </div>
                <p className="mt-2 text-xs text-slate-500">{data.skills.length} skills selected</p>
              </div>
            )}

            {activeSection === 'education' && (
              <div className="space-y-4">
                {data.education.map(edu => (
                  <div key={edu.id} className="card p-5 flex items-center gap-3">
                    <div className="grid grid-cols-3 gap-3 flex-1">
                      <input className="input col-span-2" placeholder="School" value={edu.school} onChange={e => updateEdu(edu.id, { school: e.target.value })} />
                      <input className="input" placeholder="Year" value={edu.year} onChange={e => updateEdu(edu.id, { year: e.target.value })} />
                      <input className="input col-span-3" placeholder="Degree (e.g. B.S. Information Technology)" value={edu.degree} onChange={e => updateEdu(edu.id, { degree: e.target.value })} />
                    </div>
                    <button onClick={() => removeEdu(edu.id)} className="btn-ghost p-2 text-rose-600"><Trash2 size={14} /></button>
                  </div>
                ))}
                <button onClick={addEdu} className="btn-secondary w-full">
                  <Plus size={14} /> Add education
                </button>
              </div>
            )}

            {activeSection === 'certifications' && (
              <div className="space-y-4">
                {data.certifications.map(cert => (
                  <div key={cert.id} className="card p-5 flex items-center gap-3">
                    <div className="grid grid-cols-3 gap-3 flex-1">
                      <input className="input col-span-2" placeholder="Certification" value={cert.name} onChange={e => updateCert(cert.id, { name: e.target.value })} />
                      <input className="input" placeholder="Year" value={cert.year} onChange={e => updateCert(cert.id, { year: e.target.value })} />
                      <input className="input col-span-3" placeholder="Issuer" value={cert.issuer} onChange={e => updateCert(cert.id, { issuer: e.target.value })} />
                    </div>
                    <button onClick={() => removeCert(cert.id)} className="btn-ghost p-2 text-rose-600"><Trash2 size={14} /></button>
                  </div>
                ))}
                <button onClick={addCert} className="btn-secondary w-full">
                  <Plus size={14} /> Add certification
                </button>
              </div>
            )}

            {/* Section reordering */}
            <div className="card p-6">
              <h2 className="font-semibold">Section order</h2>
              <p className="text-sm text-slate-600">Drag to reorder, click the eye to toggle visibility.</p>
              <ul className="mt-3 space-y-1">
                {data.sections.sort((a, b) => a.order - b.order).map(sec => (
                  <li
                    key={sec.id}
                    draggable
                    onDragStart={() => { dragId.current = sec.id; }}
                    onDragOver={e => e.preventDefault()}
                    onDrop={() => { if (dragId.current) reorderSection(dragId.current, sec.id); dragId.current = null; }}
                    className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 cursor-move"
                  >
                    <GripVertical size={14} className="text-slate-400" />
                    <span className="text-sm font-medium flex-1">{sec.title}</span>
                    <button onClick={() => toggleSectionVisible(sec.id)} className="text-slate-500 hover:text-slate-700">
                      {sec.visible ? <Eye size={14} /> : <EyeOff size={14} className="opacity-50" />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Live preview */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Live preview</div>
            <div className="mt-2 card p-6 max-h-[80vh] overflow-auto">
              <ResumePreview data={data} seeker={seeker} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BriefcaseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function ResumePreview({ data, seeker }: { data: ResumeData; seeker: { fullName: string; rank?: string; branch?: string; mos?: string; clearance: string; location: string; email: string } }) {
  const ordered = data.sections.filter(s => s.visible).sort((a, b) => a.order - b.order);
  return (
    <article className="text-sm text-slate-800">
      <header className="border-b border-slate-200 pb-3">
        <h1 className="text-xl font-bold text-slate-900">{seeker.fullName}</h1>
        <div className="text-xs text-slate-600 mt-0.5">
          {seeker.rank} · {seeker.branch} · {seeker.location}
        </div>
        <div className="text-xs text-slate-500">{seeker.email} · Clearance: {seeker.clearance}</div>
      </header>
      {ordered.map(sec => {
        if (sec.type === 'summary' && data.summary) {
          return (
            <section key={sec.id} className="mt-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-navy-800 border-b border-slate-200 pb-1">{sec.title}</h2>
              <p className="mt-1.5 text-slate-700">{data.summary}</p>
            </section>
          );
        }
        if (sec.type === 'experience') {
          return (
            <section key={sec.id} className="mt-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-navy-800 border-b border-slate-200 pb-1">{sec.title}</h2>
              <div className="mt-2 space-y-3">
                {data.experience.map(e => (
                  <div key={e.id}>
                    <div className="flex items-baseline justify-between">
                      <div className="font-semibold">{e.title}</div>
                      <div className="text-xs text-slate-500">{e.start} – {e.end}</div>
                    </div>
                    <div className="text-xs text-slate-600 italic">{e.org}</div>
                    <ul className="mt-1 list-disc list-inside text-slate-700 space-y-0.5">
                      {e.bullets.filter(b => b.trim()).map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          );
        }
        if (sec.type === 'skills') {
          return (
            <section key={sec.id} className="mt-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-navy-800 border-b border-slate-200 pb-1">{sec.title}</h2>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {data.skills.map(s => <span key={s} className="text-xs px-1.5 py-0.5 rounded bg-slate-100">{SKILL_MAP[s] ?? s}</span>)}
              </div>
            </section>
          );
        }
        if (sec.type === 'education') {
          return (
            <section key={sec.id} className="mt-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-navy-800 border-b border-slate-200 pb-1">{sec.title}</h2>
              <div className="mt-1.5 space-y-1">
                {data.education.map(e => (
                  <div key={e.id} className="flex items-baseline justify-between">
                    <div>
                      <div className="font-semibold">{e.degree}</div>
                      <div className="text-xs text-slate-600">{e.school}</div>
                    </div>
                    <div className="text-xs text-slate-500">{e.year}</div>
                  </div>
                ))}
              </div>
            </section>
          );
        }
        if (sec.type === 'certifications') {
          return (
            <section key={sec.id} className="mt-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-navy-800 border-b border-slate-200 pb-1">{sec.title}</h2>
              <ul className="mt-1.5 text-slate-700 space-y-0.5">
                {data.certifications.map(c => (
                  <li key={c.id} className="flex items-baseline justify-between">
                    <span>{c.name} <span className="text-slate-500 text-xs">— {c.issuer}</span></span>
                    <span className="text-xs text-slate-500">{c.year}</span>
                  </li>
                ))}
              </ul>
            </section>
          );
        }
        return null;
      })}
    </article>
  );
}
