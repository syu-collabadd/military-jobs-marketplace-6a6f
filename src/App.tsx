import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import { Layout } from './components/Layout';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import SeekerDashboard from './pages/SeekerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import JobBoard from './pages/JobBoard';
import JobDetail from './pages/JobDetail';
import Matches from './pages/Matches';
import ResumeBuilder from './pages/ResumeBuilder';
import Interviews from './pages/Interviews';
import EmployerCandidates from './pages/EmployerCandidates';
import EmployerInterviews from './pages/EmployerInterviews';
import EmployerPostJob from './pages/EmployerPostJob';
import EmployerProfile from './pages/EmployerProfile';
import SeekerProfile from './pages/SeekerProfile';
import type { ReactNode } from 'react';
import type { Role } from './types';

function RequireAuth({ role, children }: { role?: Role; children: ReactNode }) {
  const { isAuthenticated, role: actual } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  if (role && actual !== role) {
    return <Navigate to={actual === 'employer' ? '/employer' : '/dashboard'} replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Seeker */}
        <Route path="/dashboard" element={<RequireAuth role="seeker"><SeekerDashboard /></RequireAuth>} />
        <Route path="/jobs" element={<JobBoard />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/matches" element={<RequireAuth role="seeker"><Matches /></RequireAuth>} />
        <Route path="/resume" element={<RequireAuth role="seeker"><ResumeBuilder /></RequireAuth>} />
        <Route path="/interviews" element={<RequireAuth role="seeker"><Interviews /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth role="seeker"><SeekerProfile /></RequireAuth>} />

        {/* Employer */}
        <Route path="/employer" element={<RequireAuth role="employer"><EmployerDashboard /></RequireAuth>} />
        <Route path="/employer/post" element={<RequireAuth role="employer"><EmployerPostJob /></RequireAuth>} />
        <Route path="/employer/candidates" element={<RequireAuth role="employer"><EmployerCandidates /></RequireAuth>} />
        <Route path="/employer/interviews" element={<RequireAuth role="employer"><EmployerInterviews /></RequireAuth>} />
        <Route path="/employer/profile" element={<RequireAuth role="employer"><EmployerProfile /></RequireAuth>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
