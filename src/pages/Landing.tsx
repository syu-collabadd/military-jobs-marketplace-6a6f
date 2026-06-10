import { Link } from 'react-router-dom';
import {
  ArrowRight, Shield, Target, Calendar, Briefcase, Users, Star,
  Check, FileText, MapPin, BadgeCheck, ChevronRight, Sparkles,
} from 'lucide-react';
import { JOBS } from '../data/seed';
import { formatSalaryRange, timeAgo } from '../lib/format';

const TRUSTED_LOGOS = [
  'LOCKHAVEN', 'NORTHWIND', 'BASTION', 'VANTAGE', 'ATLAS AERO', 'CIVIC FED',
];

export default function Landing() {
  const recentJobs = JOBS.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Gradient mesh background */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(60% 50% at 15% 20%, rgba(245, 158, 11, 0.10), transparent 60%), radial-gradient(50% 50% at 90% 10%, rgba(30, 58, 138, 0.18), transparent 60%), radial-gradient(60% 70% at 50% 100%, rgba(30, 58, 138, 0.10), transparent 60%), #f8fafc',
          }}
        />
        <div className="container-x py-20 sm:py-28">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="eyebrow">
                <Sparkles size={12} /> Built for the military-to-civilian transition
              </span>
              <h1 className="h1 mt-4">
                Hire the people who run <span className="text-navy-800">high-stakes operations</span>.
              </h1>
              <p className="mt-5 max-w-xl text-lg text-slate-600">
                ValorHire translates your military background into a profile employers understand —
                with matched jobs, an automated resume builder, and a calendar that handles timezones.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link to="/signup?role=seeker" className="btn-primary text-base px-5 py-3">
                  I'm transitioning out <ArrowRight size={16} />
                </Link>
                <Link to="/signup?role=employer" className="btn-secondary text-base px-5 py-3">
                  We're hiring veterans
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
                <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-600" /> Free for job seekers</span>
                <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-600" /> No credit card required</span>
                <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-600" /> Setup in 3 minutes</span>
              </div>
            </div>

            {/* Hero card — visual */}
            <div className="relative">
              <div className="card p-6 sm:p-8 max-w-md mx-auto">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-navy-800 text-white font-bold">JD</div>
                  <div>
                    <div className="font-semibold">Jane Doe</div>
                    <div className="text-xs text-slate-500">SSG (E-6) · U.S. Army · 8 yrs · Secret</div>
                  </div>
                  <span className="ml-auto badge-gold"><Star size={11} fill="currentColor" /> 94% match</span>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
                  <span className="badge-navy">Team Leadership</span>
                  <span className="badge-navy">Network Admin</span>
                  <span className="badge-navy">Comms Systems</span>
                  <span className="badge-navy">Cybersecurity</span>
                  <span className="badge-navy">SIEM</span>
                  <span className="badge-navy">+ 3 more</span>
                </div>
                <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs">
                  <div className="font-semibold text-slate-700">Operations Manager — Defense Programs</div>
                  <div className="mt-1 text-slate-500">Lockhaven Defense · Arlington, VA · $110k–$145k</div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Calendar size={12} /> Interview: Thu 2:00 PM ET</span>
                  <span className="text-emerald-600 font-medium">Confirmed</span>
                </div>
              </div>

              {/* Floating badges */}
              <div className="hidden sm:block absolute -top-4 -right-2 card px-3 py-2 text-xs shadow-glow">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <BadgeCheck size={14} className="text-navy-800" /> MOS 25B → IT Manager
                </span>
              </div>
              <div className="hidden sm:block absolute -bottom-4 -left-2 card px-3 py-2 text-xs shadow-glow">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <MapPin size={14} className="text-gold-600" /> 12 matches in VA
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-slate-200 bg-white py-8">
        <div className="container-x">
          <div className="text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
            Trusted by veteran-friendly employers
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {TRUSTED_LOGOS.map(name => (
              <span key={name} className="text-lg font-extrabold tracking-widest text-slate-400">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Dual value props */}
      <section className="section" id="how">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto">
            <span className="eyebrow">How it works</span>
            <h2 className="h2 mt-3">Two sides, one platform</h2>
            <p className="mt-3 text-slate-600">
              Whether you're transitioning out or staffing up — the workflow adapts to you.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="card p-8">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-navy-50 text-navy-800">
                  <Shield size={20} />
                </span>
                <h3 className="h3">For service members</h3>
              </div>
              <ul className="mt-6 space-y-3 text-slate-700">
                <li className="flex gap-3">
                  <Check size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                  <span>Auto-translate your MOS to civilian roles employers understand</span>
                </li>
                <li className="flex gap-3">
                  <Check size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                  <span>See a match score for every job — not just a keyword search</span>
                </li>
                <li className="flex gap-3">
                  <Check size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                  <span>Drag-and-drop resume builder that auto-saves your work</span>
                </li>
                <li className="flex gap-3">
                  <Check size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                  <span>Schedule interviews in any timezone — no back-and-forth emails</span>
                </li>
              </ul>
              <Link to="/signup?role=seeker" className="btn-primary mt-6">
                Create free profile <ChevronRight size={16} />
              </Link>
            </div>

            <div className="card p-8" id="employers">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-gold-50 text-gold-700">
                  <Briefcase size={20} />
                </span>
                <h3 className="h3">For employers</h3>
              </div>
              <ul className="mt-6 space-y-3 text-slate-700">
                <li className="flex gap-3">
                  <Check size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                  <span>Post a job in 2 minutes — clearance, MOS, branch preferences supported</span>
                </li>
                <li className="flex gap-3">
                  <Check size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                  <span>Browse ranked candidates by skill, clearance, and salary fit</span>
                </li>
                <li className="flex gap-3">
                  <Check size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                  <span>Self-serve interview requests with built-in timezone handling</span>
                </li>
                <li className="flex gap-3">
                  <Check size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                  <span>See veterans' leadership scope in the language you already use</span>
                </li>
              </ul>
              <Link to="/signup?role=employer" className="btn-gold mt-6">
                Post your first job <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3-feature section */}
      <section className="section bg-slate-50 border-y border-slate-200">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto">
            <span className="eyebrow">Why ValorHire</span>
            <h2 className="h2 mt-3">Built for the way veterans actually get hired</h2>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-3">
            <Feature
              icon={<Target size={22} />}
              title="Compatibility scoring, not keyword bingo"
              body="Skills, clearance, location, and salary fit — combined into a single 0–100 match score that updates as your profile changes."
              mock={<MatchMock />}
            />
            <Feature
              icon={<FileText size={22} />}
              title="MOS to civilian, automatically"
              body="Type your MOS code once. We map it to the right civilian title, suggest the skills employers search for, and pre-fill your resume sections."
              mock={<MOSTranslateMock />}
            />
            <Feature
              icon={<Calendar size={22} />}
              title="Interviews that respect your time"
              body="Auto-detect timezones, send email reminders, and keep all your confirmed, pending, and completed interviews in one calendar view."
              mock={<CalendarMock />}
            />
          </div>
        </div>
      </section>

      {/* Recent jobs strip */}
      <section className="section">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="eyebrow">Live on the platform</span>
              <h2 className="h2 mt-3">Roles posted this week</h2>
            </div>
            <Link to="/jobs" className="btn-secondary">Browse all jobs <ChevronRight size={16} /></Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentJobs.map(job => (
              <Link key={job.id} to={`/jobs/${job.id}`} className="card p-5 hover:shadow-glow transition">
                <div className="flex items-center gap-3">
                  <span
                    className="grid h-10 w-10 place-items-center rounded-lg text-white font-bold"
                    style={{ backgroundColor: job.company.logoColor }}
                  >
                    {job.company.name[0]}
                  </span>
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{job.title}</div>
                    <div className="text-xs text-slate-500 truncate">{job.company.name}</div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                  {job.remote && <span className="badge-green">Remote</span>}
                  {job.clearanceRequired !== 'None' && (
                    <span className="badge-navy">{job.clearanceRequired}</span>
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-navy-800">
                    {formatSalaryRange(job.salaryMin, job.salaryMax)}
                  </span>
                  <span className="text-xs text-slate-500">{timeAgo(job.postedAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section bg-slate-50 border-y border-slate-200" id="pricing">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto">
            <span className="eyebrow">Pricing</span>
            <h2 className="h2 mt-3">Free for job seekers, simple plans for employers</h2>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <PriceCard
              name="Seeker"
              price="$0"
              cadence="forever"
              cta="Create profile"
              ctaLink="/signup?role=seeker"
              highlight={false}
              features={[
                'Unlimited job applications',
                'Match scoring & recommendations',
                'Resume builder with auto-save',
                'Interview scheduling',
              ]}
            />
            <PriceCard
              name="Pro"
              price="$149"
              cadence="per job, 30 days"
              cta="Post a job"
              ctaLink="/signup?role=employer"
              highlight
              features={[
                'Top placement in matches',
                'Up to 50 ranked candidates',
                'Self-serve interview requests',
                'Email support',
              ]}
            />
            <PriceCard
              name="Enterprise"
              price="Custom"
              cadence="annual contract"
              cta="Contact sales"
              ctaLink="/#"
              highlight={false}
              features={[
                'Unlimited jobs & candidates',
                'ATS integration',
                'Dedicated success manager',
                'SSO & SCIF-friendly hosting',
              ]}
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section">
        <div className="container-x">
          <div className="card overflow-hidden bg-gradient-to-br from-navy-800 to-navy-900 text-white p-8 sm:p-12 text-center">
            <h2 className="h2 text-white">Ready to take the next step?</h2>
            <p className="mt-3 text-navy-100 max-w-xl mx-auto">
              Whether you're separating in 6 months or hiring your next teammate — start in under 3 minutes.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/signup?role=seeker" className="btn-gold">I'm a job seeker</Link>
              <Link to="/signup?role=employer" className="btn-secondary">I'm an employer</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Feature({ icon, title, body, mock }: { icon: React.ReactNode; title: string; body: string; mock: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-white border border-slate-200 text-navy-800 shadow-card">
          {icon}
        </span>
        <h3 className="h3">{title}</h3>
      </div>
      <p className="mt-3 text-slate-600">{body}</p>
      <div className="mt-5">{mock}</div>
    </div>
  );
}

function MatchMock() {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold">Operations Manager — Defense Programs</span>
        <span className="badge-gold">94% match</span>
      </div>
      <div className="mt-3 space-y-2">
        {[
          { label: 'Skills', value: 92 },
          { label: 'Clearance', value: 100 },
          { label: 'Location', value: 88 },
          { label: 'Salary', value: 95 },
        ].map(row => (
          <div key={row.label}>
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>{row.label}</span><span>{row.value}%</span>
            </div>
            <div className="mt-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-navy-800" style={{ width: `${row.value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MOSTranslateMock() {
  return (
    <div className="card p-4">
      <div className="text-xs text-slate-500">MOS 25B entered</div>
      <div className="mt-1 font-semibold text-navy-800">→ Information Technology Specialist</div>
      <div className="mt-1 text-sm text-slate-600">Recommended civilian title: IT Manager / SysAdmin</div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {['Network Admin', 'Cybersecurity', 'Comms Systems', 'SIEM'].map(s => (
          <span key={s} className="badge-navy">{s}</span>
        ))}
      </div>
    </div>
  );
}

function CalendarMock() {
  return (
    <div className="card p-4">
      <div className="text-sm font-semibold">This week</div>
      <div className="mt-3 space-y-2">
        {[
          { day: 'Mon', item: 'SOC Analyst · Phone screen · 2:00 PM ET' },
          { day: 'Wed', item: 'Ops Manager · Panel · 10:00 AM ET' },
          { day: 'Fri', item: 'Cyber Lead · Onsite · 9:30 AM ET' },
        ].map(r => (
          <div key={r.day} className="flex items-start gap-3 text-sm">
            <span className="grid h-7 w-12 place-items-center rounded bg-navy-50 text-navy-800 text-xs font-semibold shrink-0">
              {r.day}
            </span>
            <span className="text-slate-700">{r.item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PriceCard({ name, price, cadence, cta, ctaLink, features, highlight }: {
  name: string; price: string; cadence: string; cta: string; ctaLink: string;
  features: string[]; highlight: boolean;
}) {
  return (
    <div className={highlight ? 'card p-6 ring-2 ring-navy-800 shadow-glow relative' : 'card p-6'}>
      {highlight && (
        <span className="absolute -top-3 right-6 inline-flex items-center gap-1 rounded-full bg-navy-800 px-3 py-1 text-xs font-semibold text-white">
          <Star size={11} fill="#f59e0b" strokeWidth={0} /> Most popular
        </span>
      )}
      <div className="text-sm font-semibold uppercase tracking-wider text-slate-500">{name}</div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-4xl font-extrabold text-slate-900">{price}</span>
        <span className="text-sm text-slate-500">{cadence}</span>
      </div>
      <ul className="mt-5 space-y-2 text-sm text-slate-700">
        {features.map(f => (
          <li key={f} className="flex gap-2">
            <Check size={16} className="mt-0.5 shrink-0 text-emerald-600" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Link to={ctaLink} className={highlight ? 'btn-primary mt-6 w-full' : 'btn-secondary mt-6 w-full'}>
        {cta}
      </Link>
    </div>
  );
}
