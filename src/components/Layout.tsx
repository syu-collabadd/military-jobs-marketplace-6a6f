import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Star, Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../lib/auth';
import clsx from 'clsx';

export function Navbar() {
  const { isAuthenticated, role, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const seekerLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/jobs', label: 'Jobs' },
    { to: '/matches', label: 'Matches' },
    { to: '/resume', label: 'Resume' },
    { to: '/interviews', label: 'Interviews' },
  ];
  const employerLinks = [
    { to: '/employer', label: 'Dashboard' },
    { to: '/employer/candidates', label: 'Candidates' },
    { to: '/employer/interviews', label: 'Interviews' },
  ];
  const links = role === 'seeker' ? seekerLinks : role === 'employer' ? employerLinks : [];

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-navy-800">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-navy-800 text-white">
            <Star size={16} fill="#f59e0b" strokeWidth={0} />
          </span>
          <span className="text-lg">ValorHire</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {!isAuthenticated && (
            <>
              <NavLink to="/#how" className="btn-ghost">How it works</NavLink>
              <NavLink to="/#pricing" className="btn-ghost">Pricing</NavLink>
              <NavLink to="/#employers" className="btn-ghost">For employers</NavLink>
            </>
          )}
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                clsx('btn-ghost', isActive && 'text-navy-800 bg-navy-50')
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {!isAuthenticated ? (
            <>
              <Link to="/signin" className="btn-ghost">Sign in</Link>
              <Link to="/signup" className="btn-primary">Get started</Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to={role === 'employer' ? '/employer/profile' : '/profile'}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <UserIcon size={14} />
                <span>{role === 'employer' ? 'Company' : 'Profile'}</span>
              </Link>
              <button
                onClick={() => {
                  signOut();
                  navigate('/');
                }}
                className="btn-ghost"
                aria-label="Sign out"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>

        <button
          className="md:hidden btn-ghost p-2"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="container-x py-3 space-y-1">
            {links.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  clsx('block rounded-lg px-3 py-2 text-sm font-medium',
                    isActive ? 'bg-navy-50 text-navy-800' : 'text-slate-700 hover:bg-slate-50')
                }
              >
                {l.label}
              </NavLink>
            ))}
            {!isAuthenticated ? (
              <div className="pt-2 flex gap-2">
                <Link to="/signin" className="btn-secondary flex-1">Sign in</Link>
                <Link to="/signup" className="btn-primary flex-1">Get started</Link>
              </div>
            ) : (
              <button
                onClick={() => { signOut(); navigate('/'); setOpen(false); }}
                className="btn-ghost w-full justify-start"
              >
                <LogOut size={16} /> Sign out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="container-x py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-bold text-navy-800">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-navy-800 text-white">
                <Star size={14} fill="#f59e0b" strokeWidth={0} />
              </span>
              <span>ValorHire</span>
            </Link>
            <p className="mt-3 text-sm text-slate-600 max-w-xs">
              Connecting transitioning service members with employers who value their skills, leadership, and clearances.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">For job seekers</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><Link to="/jobs" className="hover:text-navy-800">Browse jobs</Link></li>
              <li><Link to="/matches" className="hover:text-navy-800">Find matches</Link></li>
              <li><Link to="/resume" className="hover:text-navy-800">Build resume</Link></li>
              <li><Link to="/signup" className="hover:text-navy-800">Create account</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">For employers</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><Link to="/signup" className="hover:text-navy-800">Post a job</Link></li>
              <li><Link to="/employer/candidates" className="hover:text-navy-800">Find candidates</Link></li>
              <li><Link to="/employer" className="hover:text-navy-800">Employer dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Company</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><a href="#" className="hover:text-navy-800">About</a></li>
              <li><a href="#" className="hover:text-navy-800">Press</a></li>
              <li><a href="#" className="hover:text-navy-800">Careers</a></li>
              <li><a href="#" className="hover:text-navy-800">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} ValorHire. Built for those who served.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-700">Privacy</a>
            <a href="#" className="hover:text-slate-700">Terms</a>
            <a href="#" className="hover:text-slate-700">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
