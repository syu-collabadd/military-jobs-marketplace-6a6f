import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { Star, Mail, Lock } from 'lucide-react';

export default function SignIn() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState<'seeker' | 'employer'>('seeker');
  const [email, setEmail] = useState('jane.doe@example.com');
  const [password, setPassword] = useState('demo1234');
  const [err, setErr] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!email.includes('@')) {
      setErr('Please enter a valid email.');
      return;
    }
    signIn(role, email);
    const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname;
    navigate(from ?? (role === 'employer' ? '/employer' : '/dashboard'));
  }

  return (
    <section className="section">
      <div className="container-x max-w-md">
        <div className="card p-8">
          <div className="flex items-center gap-2 font-bold text-navy-800">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-navy-800 text-white">
              <Star size={16} fill="#f59e0b" strokeWidth={0} />
            </span>
            <span>ValorHire</span>
          </div>
          <h1 className="mt-5 text-2xl font-bold">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-600">Sign in to continue your transition.</p>

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
              <label className="label">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  className="input pl-9"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  className="input pl-9"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {err && <div className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-sm text-rose-700">{err}</div>}

            <button type="submit" className="btn-primary w-full">Sign in</button>
          </form>

          <div className="mt-5 text-center text-sm text-slate-600">
            New to ValorHire?{' '}
            <Link to="/signup" className="font-semibold text-navy-800 hover:underline">
              Create an account
            </Link>
          </div>
          <div className="mt-3 text-center text-xs text-slate-400">
            Demo: any email + password works. Use <span className="font-mono">jane.doe@example.com</span> for a populated seeker.
          </div>
        </div>
      </div>
    </section>
  );
}
