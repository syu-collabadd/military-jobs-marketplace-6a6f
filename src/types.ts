export type Role = 'seeker' | 'employer';

export type Clearance = 'None' | 'Public Trust' | 'Secret' | 'Top Secret' | 'TS/SCI';

export type Branch = 'Army' | 'Navy' | 'Air Force' | 'Marines' | 'Coast Guard' | 'Space Force';

export interface Skill {
  id: string;
  name: string;
  category: 'leadership' | 'technical' | 'logistics' | 'comms' | 'medical' | 'cyber' | 'operations';
}

export interface SeekerProfile {
  id: string;
  email: string;
  fullName: string;
  rank?: string;
  branch?: Branch;
  mos?: string;
  yearsOfService: number;
  clearance: Clearance;
  location: string;
  desiredSalary: number;
  willingToRelocate: boolean;
  education: string;
  bio: string;
  skills: string[]; // skill ids
  targetRoles: string[];
  resume: ResumeData;
  createdAt: number;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  size: string;
  website: string;
  description: string;
}

export interface EmployerProfile {
  id: string;
  email: string;
  fullName: string;
  company: Company;
  createdAt: number;
}

export interface Job {
  id: string;
  employerId: string;
  company: { name: string; industry: string; logoColor: string };
  title: string;
  location: string;
  remote: boolean;
  clearanceRequired: Clearance;
  salaryMin: number;
  salaryMax: number;
  branchPrefs: Branch[];
  mosPrefs: string[];
  description: string;
  responsibilities: string[];
  benefits: string[];
  requiredSkills: string[]; // skill ids
  postedAt: number;
  applicants: number;
}

export type InterviewStatus = 'pending' | 'confirmed' | 'declined' | 'completed';

export interface Interview {
  id: string;
  jobId: string;
  seekerId: string;
  employerId: string;
  scheduledFor: number; // ms epoch
  durationMin: number;
  timezone: string; // IANA
  format: 'phone' | 'video' | 'onsite';
  status: InterviewStatus;
  note?: string;
}

export interface ResumeSection {
  id: string;
  type: 'summary' | 'experience' | 'skills' | 'education' | 'certifications';
  title: string;
  visible: boolean;
  order: number;
}

export interface ResumeData {
  sections: ResumeSection[];
  summary: string;
  experience: { id: string; title: string; org: string; start: string; end: string; bullets: string[] }[];
  skills: string[]; // civilian skill ids
  education: { id: string; school: string; degree: string; year: string }[];
  certifications: { id: string; name: string; issuer: string; year: string }[];
}

export interface MatchResult {
  job: Job;
  score: number; // 0-100
  reasons: string[];
  breakdown: {
    skills: number;
    clearance: number;
    location: number;
    salary: number;
  };
}
