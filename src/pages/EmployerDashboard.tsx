import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { JOBS, SAMPLE_INTERVIEWS, SEEKER_SAMPLE } from '../data/seed';
import { formatDateTime, formatSalaryRange, timeAgo } from '../lib/format';
import { computeMatch } from '../lib/match';
import { SKILL_MAP } from '../data/skills';
import {
  Plus, Briefcase, Users, Calendar, ChevronRight, Star, MapPin,
  CheckCircle2, Clock, ArrowUpRight,
} from 'lucide-react';

export default function EmployerDashboard() {
  const { employer } = useAuth();
  if (!employer) return null;

  // Demo: assume this employer owns jobs j1 and j6
  const myJobs = JOBS.filter(j => j.employerId === employer.id || j.employerId === 'e1');

  const totalApplicants = myJobs.reduce((s, j) => s + j.applicants, 0);
  const myInterviews = SAMPLE_INTERVIEWS.filter(i => myJobs.some(j => j.id === i.jobId));

  // Demo candidates = SEEKER_SAMPLE computed against myJobs
  const candidates = myJobs
    .slice(0, 3)
    .map(j => ({ job: j, match: computeMatch(SEEKER_SAMPLE, j) }));

  return (
    <section className="section">
      <div className="container-x space-y-8">
        <div className="card p-6 sm:p-8 bg-gradient-to-br from-navy-800 to-navy-900 text-white">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-sm text-navy-200">Welcome,</div>
              <h1 className="mt-1 text-2xl sm:text-3xl font-bold">{employer.company.name}</h1>
              <p className="mt-1 text-sm text-navy-100">{employer.company.industry} · {employer.company.size} employees</p>
            </div>
            <Link to="/employer/post" className="btn-gold">
              <Plus size={16} /> Post a job
            </Link>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Active jobs" value={myJobs.length} icon={<Briefcase size={18} />} sublabel={`${totalApplicants} total applicants`} />
          <StatCard label="Pending interviews" value={myInterviews.filter(i => i.status === 'pending').length} icon={<Clock size={18} />} sublabel={`${myInterviews.filter(i => i.status === 'confirmed').length} confirmed this week`} />
          <StatCard label="Top candidate matches" value={candidates.filter(c => c.match.score >= 80).length} icon={<Star size={18} />} sublabel="Score ≥ 80%" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* My jobs */}
          <div className="card p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Your open roles</h2>
              <Link to="/employer/post" className="text-sm font-semibold text-navy-800 hover:underline">+ Post new</Link>
            </div>
            <div className="mt-4 divide-y divide-slate-100">
              {myJobs.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-slate-600">You haven't posted any jobs yet.</p>
                  <Link to="/employer/post" className="btn-primary mt-3">Post your first job</Link>
                </div>
              ) : (
                myJobs.map(j => (
                  <div key={j.id} className="py-3 flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded text-white text-sm font-bold" style={{ backgroundColor: j.company.logoColor }}>
                      {j.company.name[0]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">{j.title}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <MapPin size={11} /> {j.location} · {formatSalaryRange(j.salaryMin, j.salaryMax)} · {timeAgo(j.postedAt)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{j.applicants}</div>
                      <div className="text-xs text-slate-500">applicants</div>
                    </div>
                    <Link to={`/jobs/${j.id}`} className="btn-ghost p-2" aria-label="View job">
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Interview pipeline */}
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Interview pipeline</h2>
              <Link to="/employer/interviews" className="text-sm font-semibold text-navy-800 hover:underline">All</Link>
            </div>
            {myInterviews.length === 0 ? (
              <div className="mt-5 text-sm text-slate-600">No interviews scheduled yet.</div>
            ) : (
              <div className="mt-4 space-y-3">
                {myInterviews.slice(0, 4).map(iv => {
                  const job = JOBS.find(j => j.id === iv.jobId);
                  return (
                    <div key={iv.id} className="rounded-lg border border-slate-200 p-3">
                      <div className="text-sm font-semibold">{job?.title}</div>
                      <div className="text-xs text-slate-500">{job?.company.name}</div>
                      <div className="mt-1 flex items-center gap-1 text-xs text-slate-700">
                        <Calendar size={11} /> {formatDateTime(iv.scheduledFor)}
                      </div>
                      <div className="mt-1 text-xs">
                        {iv.status === 'confirmed' ? (
                          <span className="text-emerald-700 inline-flex items-center gap-1"><CheckCircle2 size={11} /> Confirmed</span>
                        ) : (
                          <span className="text-gold-700 inline-flex items-center gap-1"><Clock size={11} /> Pending</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Candidate recommendations */}
        <div>
          <div className="flex items-end justify-between">
            <div>
              <span className="eyebrow"><Users size={12} /> Recommendations</span>
              <h2 className="h2 mt-3">Top candidates for your roles</h2>
            </div>
            <Link to="/employer/candidates" className="btn-secondary">Browse candidates <ArrowUpRight size={14} /></Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {candidates.map(({ job, match }) => (
              <div key={job.id} className="card p-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-navy-800 text-white font-bold">
                    {SEEKER_SAMPLE.fullName.split(' ').map(s => s[0]).join('')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold truncate">{SEEKER_SAMPLE.fullName}</div>
                    <div className="text-xs text-slate-500 truncate">{SEEKER_SAMPLE.rank} · {SEEKER_SAMPLE.branch}</div>
                  </div>
                  <span className={match.score >= 80 ? 'badge-gold' : 'badge-navy'}>{match.score}%</span>
                </div>
                <div className="mt-3 text-xs text-slate-600">
                  For: <span className="font-semibold text-slate-900">{job.title}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {SEEKER_SAMPLE.skills.slice(0, 4).map(s => (
                    <span key={s} className="badge-navy">{SKILL_MAP[s] ?? s}</span>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="btn-primary flex-1 text-sm">Request interview</button>
                  <button className="btn-secondary text-sm">Save</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value, sublabel, icon }: { label: string; value: number; sublabel: string; icon: React.ReactNode }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</div>
        <span className="grid h-8 w-8 place-items-center rounded-md bg-navy-50 text-navy-800">{icon}</span>
      </div>
      <div className="mt-2 text-3xl font-extrabold text-slate-900">{value}</div>
      <div className="text-xs text-slate-500">{sublabel}</div>
    </div>
  );
}
