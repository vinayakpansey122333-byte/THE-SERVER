import { StaffMember } from '../types';
import { getEffectiveManagerName } from '../config/siteConfig';

export const staffMembers: StaffMember[] = [
  {
    id: 'staff-manager',
    name: getEffectiveManagerName(),
    role: 'Server Manager & Lead Administrator',
    department: 'Leadership',
    about: 'Responsible for core server infrastructure, network uptime, community safety, and staff coordination.',
    contactDiscord: 'Via Discord Ticket',
    joinedDate: '2026-01-10',
    source: 'configured',
  },
];
