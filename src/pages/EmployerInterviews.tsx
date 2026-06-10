import { JOBS, SAMPLE_INTERVIEWS } from '../data/seed';
import { formatDateTime, tzAbbr } from '../lib/format';
import { CheckCircle2, Clock, X, Calendar as CalIcon, Video, Phone, MapPin } from 'lucide-react';
import type { Interview } from '../types';

export default function EmployerInterviews() {
  const all = SAMPLE_INTERVIEWS;
  const upcoming = all.filter(i => i.scheduledFor > Date.now() - 24 * 60 * 60 * 1000);
  const past = all.filter(i => i.scheduledFor < Date.now() - 24 * 60 * 60 * 1000);

  return (
    <section className="section">
      <div className="container-x space-y-6">
        <div>
          <h1 className="h2">Interviews</h1>
          <p className="mt-1 text-slate-600">Manage interview requests across your open roles.</p>
        </div>

        <div>
          <h2 className="font-semibold text-slate-900">Upcoming ({upcoming.length})</h2>
          <div className="mt-3 space-y-3">
            {upcoming.length === 0 && <div className="card p-6 text-sm text-slate-600">No upcoming interviews.</div>}
            {upcoming.map(iv => <Row key={iv.id} iv={iv} />)}
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-slate-900">Past</h2>
          <div className="mt-3 space-y-3">
            {past.length === 0 && <div className="card p-6 text-sm text-slate-600">No past interviews.</div>}
            {past.map(iv => <Row key={iv.id} iv={iv} past />)}
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ iv, past }: { iv: Interview; past?: boolean }) {
  const job = JOBS.find(j => j.id === iv.jobId);
  const statusBadge =
    iv.status === 'confirmed' ? 'badge-green' :
    iv.status === 'pending' ? 'badge-gold' :
    iv.status === 'declined' ? 'badge-red' : 'badge';

  const FormatIcon = iv.format === 'video' ? Video : iv.format === 'phone' ? Phone : MapPin;

  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg text-white font-bold" style={{ backgroundColor: job?.company.logoColor ?? '#1e3a8a' }}>
          {job?.company.name[0]}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-semibold truncate">{job?.title}</div>
          <div className="text-xs text-slate-500 truncate">Candidate: jane.doe@example.com</div>
        </div>
        <span className={statusBadge}>{iv.status}</span>
        <div className="text-right">
          <div className="text-sm font-medium">{formatDateTime(iv.scheduledFor)}</div>
          <div className="text-xs text-slate-500">{iv.durationMin} min · {tzAbbr(iv.timezone, iv.scheduledFor)}</div>
        </div>
      </div>
      {!past && iv.status === 'pending' && (
        <div className="mt-3 flex gap-2">
          <button className="btn-primary text-xs px-3 py-1.5">
            <CheckCircle2 size={12} /> Confirm
          </button>
          <button className="btn-secondary text-xs px-3 py-1.5">
            <CalIcon size={12} /> Reschedule
          </button>
          <button className="btn-ghost text-xs text-rose-700">
            <X size={12} /> Decline
          </button>
        </div>
      )}
      <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
        <FormatIcon size={11} /> {iv.format} interview {iv.note ? `· ${iv.note}` : ''}
      </div>
    </div>
  );
}
