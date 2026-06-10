import type { Skill } from '../types';

// Curated skills library. IDs are stable so resume + jobs reference them by id.
export const SKILLS: Skill[] = [
  // Leadership
  { id: 'lead-team', name: 'Team Leadership', category: 'leadership' },
  { id: 'lead-platoon', name: 'Platoon-Level Operations', category: 'leadership' },
  { id: 'lead-crisis', name: 'Crisis Decision Making', category: 'leadership' },
  { id: 'mentor', name: 'Mentoring & Coaching', category: 'leadership' },
  { id: 'strategic-plan', name: 'Strategic Planning', category: 'leadership' },

  // Technical
  { id: 'mech-repair', name: 'Mechanical Systems Repair', category: 'technical' },
  { id: 'electrical', name: 'Electrical Systems', category: 'technical' },
  { id: 'avionics', name: 'Avionics Maintenance', category: 'technical' },
  { id: 'radar', name: 'Radar & Sensor Systems', category: 'technical' },
  { id: 'quality-ctrl', name: 'Quality Control & Inspection', category: 'technical' },

  // Logistics
  { id: 'supply-chain', name: 'Supply Chain Management', category: 'logistics' },
  { id: 'inventory', name: 'Inventory & Asset Tracking', category: 'logistics' },
  { id: 'fleet-mgmt', name: 'Fleet Management', category: 'logistics' },
  { id: 'procurement', name: 'Procurement & Contracting', category: 'logistics' },

  // Communications
  { id: 'comms', name: 'Communications Systems', category: 'comms' },
  { id: 'public-speaking', name: 'Public Speaking & Briefings', category: 'comms' },
  { id: 'translation', name: 'Cross-functional Translation', category: 'comms' },

  // Medical
  { id: 'triage', name: 'Emergency Triage', category: 'medical' },
  { id: 'field-med', name: 'Field Medicine', category: 'medical' },
  { id: 'patient-care', name: 'Patient Care Coordination', category: 'medical' },

  // Cyber
  { id: 'cyber-sec', name: 'Cybersecurity Operations', category: 'cyber' },
  { id: 'network-admin', name: 'Network Administration', category: 'cyber' },
  { id: 'pen-test', name: 'Penetration Testing', category: 'cyber' },
  { id: 'siem', name: 'SIEM & Threat Detection', category: 'cyber' },

  // Operations
  { id: 'project-mgmt', name: 'Project Management', category: 'operations' },
  { id: 'risk-asses', name: 'Risk Assessment', category: 'operations' },
  { id: 'training', name: 'Training Program Development', category: 'operations' },
  { id: 'composite-risk', name: 'Composite Risk Management', category: 'operations' },
];

export const SKILL_MAP: Record<string, string> = SKILLS.reduce(
  (acc, s) => ({ ...acc, [s.id]: s.name }),
  {} as Record<string, string>
);

// Military-to-civilian MOS translation: maps common MOS codes to recommended civilian skill ids
export const MOS_TRANSLATION: Record<string, { civilianTitle: string; skills: string[] }> = {
  '11B': {
    civilianTitle: 'Infantryman → Security Operations Specialist',
    skills: ['lead-team', 'lead-platoon', 'strategic-plan', 'risk-asses', 'training'],
  },
  '25B': {
    civilianTitle: 'Information Technology Specialist → IT Support / SysAdmin',
    skills: ['network-admin', 'comms', 'cyber-sec', 'siem'],
  },
  '17C': {
    civilianTitle: 'Cyber Operations Specialist → SOC Analyst',
    skills: ['cyber-sec', 'pen-test', 'siem', 'network-admin'],
  },
  '68W': {
    civilianTitle: 'Combat Medic → Paramedic / Patient Care Coordinator',
    skills: ['triage', 'field-med', 'patient-care'],
  },
  '35F': {
    civilianTitle: 'Intelligence Analyst → Intelligence / Research Analyst',
    skills: ['radar', 'comms', 'risk-asses', 'translation'],
  },
  '15T': {
    civilianTitle: 'UH-60 Helicopter Repairer → Aviation Maintenance Technician',
    skills: ['avionics', 'mech-repair', 'electrical', 'quality-ctrl'],
  },
  '42A': {
    civilianTitle: 'Human Resources Specialist → HR Generalist',
    skills: ['mentor', 'training', 'comms', 'public-speaking'],
  },
  '25S': {
    civilianTitle: 'Satellite Communications → Network Engineer',
    skills: ['comms', 'radar', 'network-admin', 'electrical'],
  },
  '92G': {
    civilianTitle: 'Culinary Specialist → Food Service Manager',
    skills: ['inventory', 'supply-chain', 'training', 'lead-team'],
  },
  '31B': {
    civilianTitle: 'Military Police → Law Enforcement / Corporate Security',
    skills: ['risk-asses', 'lead-team', 'training', 'composite-risk'],
  },
  '88M': {
    civilianTitle: 'Motor Transport Operator → Fleet Manager',
    skills: ['fleet-mgmt', 'inventory', 'logistics' as any, 'lead-team'],
  },
  '51C': {
    civilianTitle: 'Water Treatment Specialist → Plant Operator',
    skills: ['quality-ctrl', 'mech-repair', 'electrical', 'risk-asses'],
  },
};

export const BRANCHES = ['Army', 'Navy', 'Air Force', 'Marines', 'Coast Guard', 'Space Force'] as const;
export const CLEARANCES = ['None', 'Public Trust', 'Secret', 'Top Secret', 'TS/SCI'] as const;
