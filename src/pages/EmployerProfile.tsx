import { useAuth } from '../lib/auth';
import { useState } from 'react';
import { Check } from 'lucide-react';

export default function EmployerProfile() {
  const { employer, updateEmployer } = useAuth();
  if (!employer) return null;
  return <ProfileForm employer={employer} updateEmployer={updateEmployer} />;
}

function ProfileForm({ employer, updateEmployer }: { employer: NonNullable<ReturnType<typeof useAuth>['employer']>; updateEmployer: ReturnType<typeof useAuth>['updateEmployer'] }) {
  const [name, setName] = useState(employer.fullName);
  const [company, setCompany] = useState(employer.company.name);
  const [industry, setIndustry] = useState(employer.company.industry);
  const [size, setSize] = useState(employer.company.size);
  const [website, setWebsite] = useState(employer.company.website);
  const [description, setDescription] = useState(employer.company.description);
  const [saved, setSaved] = useState(false);

  function save(e: React.FormEvent) {
    e.preventDefault();
    updateEmployer({
      fullName: name,
      company: { ...employer.company, name: company, industry, size, website, description },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <section className="section">
      <div className="container-x max-w-2xl">
        <h1 className="h2">Company profile</h1>
        <p className="mt-1 text-slate-600">This is what candidates see about your organization.</p>

        <form onSubmit={save} className="card p-6 sm:p-8 mt-6 space-y-4">
          <div>
            <label className="label">Your name</label>
            <input className="input" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Company name</label>
              <input className="input" value={company} onChange={e => setCompany(e.target.value)} />
            </div>
            <div>
              <label className="label">Industry</label>
              <input className="input" value={industry} onChange={e => setIndustry(e.target.value)} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Company size</label>
              <input className="input" value={size} onChange={e => setSize(e.target.value)} />
            </div>
            <div>
              <label className="label">Website</label>
              <input className="input" value={website} onChange={e => setWebsite(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input min-h-[100px]" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="flex items-center justify-end gap-3">
            {saved && <span className="text-sm text-emerald-700 inline-flex items-center gap-1"><Check size={14} /> Saved</span>}
            <button type="submit" className="btn-primary">Save changes</button>
          </div>
        </form>
      </div>
    </section>
  );
}
