import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { Star, ArrowRight } from 'lucide-react';
import { BRANCHES, CLEARANCES } from '../data/skills';
import type { Branch, Clearance } from '../types';

export default function SignUp() {
  const { signUp } = useAuth();
  const [params] = useSearchParams();
  const initial = (params.get('role') === 'employer' ? 'employer' : 'seeker') as 'seeker' | 'employer';
  const [role, setRole] = useState<'seeker' | 'employer'>(initial);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();

  // Seeker-specific
  const [branch, setBranch] = useState<Branch>('Army');
  const [clearance, setClearance] = useState<Clearance>('Secret');

  // Employer-specific
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (role === 'seeker') {
      signUp('seeker', {
        email,
        fullName,
        branch,
        clearance,
        yearsOfService: 4,
        location: '',
        desiredSalary: 90000,
        willingToRelocate: true,
        education: '',
        bio: '',
        skills: [],
        targetRoles: [],
        resume: {
          sections: [],
          summary: '',
          experience: [],
          skills: [],
          education: [],
          certifications: [],
        },
      });
      navigate('/dashboard');
    } else {
      signUp('employer', {
        email,
        fullName,
        company: {
          id: `c-${Date.now()}`,
          name: companyName || 'My Company',
          industry: industry || 'Technology',
          size: '1-50',
          website: '',
          description: '',
        },
      });
      navigate('/employer');
    }
  }

  return (
    <section className="section">
      <div className="container-x max-w-xl">
        <div className="card p-8">
          <div className="flex items-center gap-2 font-bold text-navy-800">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-navy-800 text-white">
              <Star size={16} fill="#f59e0b" strokeWidth={0} />
            </span>
            <span>ValorHire</span>
          </div>
          <h1 className="mt-5 text-2xl font-bold">Create your account</h1>
          <p className="mt-1 text-sm text-slate-600">Free for job seekers. No credit card required.</p>

          <div className="mt-5 grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setRole('seeker')}
              className={role === 'seeker' ? 'rounded-md bg-white py-2 text-sm font-semibold text-navy-800 shadow-sm' : 'rounded-md py-2 text-sm font-medium text-slate-600'}
            >
              Job seeker
            </button>
            <button
              type="button"
              onClick={() => setRole('employer')}
              className={role === 'employer' ? 'rounded-md bg-white py-2 text-sm font-semibold text-navy-800 shadow-sm' : 'rounded-md py-2 text-sm font-medium text-slate-600'}
            >
              Employer
            </button>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="label">Full name</label>
              <input className="input" value={fullName} onChange={e => setFullName(e.target.value)} required />
            </div>
            <div>
              <label className="label">Work email</label>
              <input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>

            {role === 'seeker' ? (
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Branch</label>
                  <select className="input" value={branch} onChange={e => setBranch(e.target.value as Branch)}>
                    {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Current clearance</label>
                  <select className="input" value={clearance} onChange={e => setClearance(e.target.value as Clearance)}>
                    {CLEARANCES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Company name</label>
                  <input className="input" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Acme Corp" required />
                </div>
                <div>
                  <label className="label">Industry</label>
                  <input className="input" value={industry} onChange={e => setIndustry(e.target.value)} placeholder="Defense / Tech / Healthcare" />
                </div>
              </div>
            )}

            <button type="submit" className="btn-primary w-full">
              Create account <ArrowRight size={16} />
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/signin" className="font-semibold text-navy-800 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
