import type { SeekerProfile, Job, MatchResult } from '../types';
import { CLEARANCE_RANK, BRANCH_LIST } from '../data/seed';

export function computeMatch(seeker: SeekerProfile, job: Job): MatchResult {
  // Skills overlap (Jaccard-style, weighted toward required)
  const required = new Set(job.requiredSkills);
  const seekerSet = new Set(seeker.skills);
  const overlap = [...required].filter(s => seekerSet.has(s));
  const skillScore = required.size === 0 ? 100 : Math.round((overlap.length / required.size) * 100);

  // Clearance
  const seekerRank = CLEARANCE_RANK[seeker.clearance];
  const jobRank = CLEARANCE_RANK[job.clearanceRequired];
  const clearanceScore = seekerRank >= jobRank ? 100 : Math.max(0, 100 - (jobRank - seekerRank) * 35);

  // Location — exact match city, same state, or remote
  let locationScore = 0;
  if (job.remote) locationScore = 100;
  else if (!seeker.location) locationScore = 50;
  else {
    const [sc] = seeker.location.split(',').map(s => s.trim().toLowerCase());
    const [jc] = job.location.split(',').map(s => s.trim().toLowerCase());
    if (sc === jc) locationScore = 100;
    else if (seeker.willingToRelocate) locationScore = 75;
    else locationScore = 25;
  }

  // Salary fit
  let salaryScore = 0;
  if (seeker.desiredSalary === 0) salaryScore = 80;
  else if (seeker.desiredSalary <= job.salaryMin) salaryScore = 100;
  else if (seeker.desiredSalary <= job.salaryMax) {
    salaryScore = Math.round(100 - ((seeker.desiredSalary - job.salaryMin) / (job.salaryMax - job.salaryMin)) * 25);
  } else {
    // over budget — penalty
    const overBy = (seeker.desiredSalary - job.salaryMax) / job.salaryMax;
    salaryScore = Math.max(0, Math.round(60 - overBy * 200));
  }

  // Composite
  const score = Math.round(
    skillScore * 0.4 + clearanceScore * 0.2 + locationScore * 0.2 + salaryScore * 0.2
  );

  // Reasons
  const reasons: string[] = [];
  if (overlap.length > 0) {
    reasons.push(`${overlap.length}/${required.size} required skills match`);
  }
  if (seekerRank >= jobRank) {
    reasons.push(`${seeker.clearance} clearance meets requirement`);
  } else if (seekerRank < jobRank) {
    reasons.push(`Below required clearance (${job.clearanceRequired})`);
  }
  if (job.remote) {
    reasons.push('Remote-friendly');
  } else if (seeker.willingToRelocate) {
    reasons.push('Willing to relocate');
  }
  if (seeker.mos && job.mosPrefs.includes(seeker.mos)) {
    reasons.push(`MOS ${seeker.mos} preferred`);
  }
  if (seeker.branch && job.branchPrefs.includes(seeker.branch)) {
    reasons.push(`${seeker.branch} background preferred`);
  }
  if (seeker.desiredSalary > 0 && seeker.desiredSalary <= job.salaryMax) {
    reasons.push('Salary within range');
  } else if (seeker.desiredSalary > job.salaryMax) {
    reasons.push('Above posted salary range');
  }

  return {
    job,
    score,
    reasons,
    breakdown: {
      skills: skillScore,
      clearance: clearanceScore,
      location: locationScore,
      salary: salaryScore,
    },
  };
}

export function topMatches(seeker: SeekerProfile, jobs: Job[], limit = 6): MatchResult[] {
  return jobs
    .map(j => computeMatch(seeker, j))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function profileCompleteness(seeker: SeekerProfile | null): number {
  if (!seeker) return 0;
  const fields: (keyof SeekerProfile)[] = [
    'fullName',
    'email',
    'rank',
    'branch',
    'mos',
    'location',
    'bio',
    'education',
  ];
  let filled = 0;
  fields.forEach(f => {
    const v = seeker[f];
    if (typeof v === 'string' && v.trim().length > 0) filled += 1;
  });
  if (seeker.skills.length >= 5) filled += 1;
  if (seeker.resume.summary.trim().length > 50) filled += 1;
  if (seeker.resume.experience.length >= 1) filled += 1;
  return Math.round((filled / (fields.length + 3)) * 100);
}
