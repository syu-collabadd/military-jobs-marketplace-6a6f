import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { SeekerProfile, EmployerProfile, Role, Job, Interview } from '../types';
import { SEEKER_SAMPLE, EMPLOYER_SAMPLE, SAMPLE_INTERVIEWS, JOBS } from '../data/seed';

interface AuthState {
  role: Role | null;
  seeker: SeekerProfile | null;
  employer: EmployerProfile | null;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  signIn: (role: Role, email: string) => void;
  signOut: () => void;
  signUp: (role: Role, profile: Partial<SeekerProfile> & Partial<EmployerProfile>) => void;
  updateSeeker: (patch: Partial<SeekerProfile>) => void;
  updateEmployer: (patch: Partial<EmployerProfile>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'valorhire.auth.v1';

function loadAuth(): AuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AuthState;
      return parsed;
    }
  } catch {
    // ignore
  }
  return { role: null, seeker: null, employer: null, isAuthenticated: false };
}

function saveAuth(state: AuthState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => loadAuth());

  useEffect(() => {
    saveAuth(state);
  }, [state]);

  const signIn: AuthContextValue['signIn'] = (role, email) => {
    if (role === 'seeker') {
      // For demo: if email matches sample, hydrate; else create minimal profile
      const seeker =
        state.seeker && state.seeker.email === email
          ? state.seeker
          : { ...SEEKER_SAMPLE, email, id: `s-${Date.now()}` };
      setState({ role, seeker, employer: null, isAuthenticated: true });
    } else {
      const employer =
        state.employer && state.employer.email === email
          ? state.employer
          : { ...EMPLOYER_SAMPLE, email, id: `e-${Date.now()}` };
      setState({ role, seeker: null, employer, isAuthenticated: true });
    }
  };

  const signOut: AuthContextValue['signOut'] = () => {
    setState({ role: null, seeker: null, employer: null, isAuthenticated: false });
  };

  const signUp: AuthContextValue['signUp'] = (role, profile) => {
    if (role === 'seeker') {
      const seeker: SeekerProfile = {
        ...SEEKER_SAMPLE,
        ...(profile as Partial<SeekerProfile>),
        id: `s-${Date.now()}`,
        createdAt: Date.now(),
      };
      setState({ role, seeker, employer: null, isAuthenticated: true });
    } else {
      const employer: EmployerProfile = {
        ...EMPLOYER_SAMPLE,
        ...(profile as Partial<EmployerProfile>),
        id: `e-${Date.now()}`,
        createdAt: Date.now(),
      };
      setState({ role, seeker: null, employer, isAuthenticated: true });
    }
  };

  const updateSeeker: AuthContextValue['updateSeeker'] = (patch) => {
    setState(s => (s.seeker ? { ...s, seeker: { ...s.seeker, ...patch } } : s));
  };

  const updateEmployer: AuthContextValue['updateEmployer'] = (patch) => {
    setState(s => (s.employer ? { ...s, employer: { ...s.employer, ...patch } } : s));
  };

  return (
    <AuthContext.Provider
      value={{ ...state, signIn, signOut, signUp, updateSeeker, updateEmployer }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

// Public demo data accessor: returns live seed jobs/interviews.
export function useDemoData() {
  const [jobs, setJobs] = useState<Job[]>(JOBS);
  const [interviews, setInterviews] = useState<Interview[]>(SAMPLE_INTERVIEWS);
  return { jobs, setJobs, interviews, setInterviews };
}
