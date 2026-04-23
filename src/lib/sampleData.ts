import type { Employee, Project } from '@/lib/types/forms';

export const projects: Project[] = [
  { id: 'MV-2401',   name: 'Mountain View Hospital', address: '3001 St Rose Pkwy, Henderson',  siteContact: 'Emily Park, (702) 555-0142',     startDate: 'Mar 3, 2026' },
  { id: 'MCC-2408',  name: 'Marriott CC',            address: '3752 Las Vegas Blvd S',          siteContact: 'Jordan Reyes, (702) 555-0188',   startDate: 'Feb 12, 2026' },
  { id: 'SMB-2412',  name: 'Summerlin MOB 1',        address: '653 Town Center Dr',             siteContact: 'Pat Kim, (702) 555-0170',         startDate: 'Apr 7, 2026' },
  { id: 'PMAK-2415', name: 'PMAK Henderson',         address: '2225 Village Walk Dr',           siteContact: "Sam O'Rourke, (702) 555-0161",    startDate: 'Mar 24, 2026' },
  { id: 'BG-2418',   name: 'Bluegreen',              address: '755 Sierra Vista Dr',            siteContact: 'Morgan Liu, (702) 555-0154',     startDate: 'Apr 14, 2026' },
];

export const employees: Employee[] = [
  { id: 'e1', name: 'Alex Ramirez',   role: 'Foreman', mileageEligible: true,  rate: 68, weekHours: 38.5, weekMiles: 92, status: 'on_site', jobId: 'MV-2401',  clockedInAt: '7:48 AM' },
  { id: 'e2', name: 'Dave Kowalski',  role: 'Foreman', mileageEligible: false, rate: 72, weekHours: 41.0, weekMiles: 0,  status: 'on_site', jobId: 'MCC-2408', clockedInAt: '8:02 AM' },
  { id: 'e3', name: 'Miguel Santos',  role: 'Tech',    mileageEligible: false, rate: 58, weekHours: 36.5, weekMiles: 0,  status: 'on_site', jobId: 'MV-2401',  clockedInAt: '7:52 AM' },
  { id: 'e4', name: 'Tony Pham',      role: 'Tech',    mileageEligible: true,  rate: 55, weekHours: 32.0, weekMiles: 64, status: 'on_site', jobId: 'MV-2401',  clockedInAt: '8:15 AM' },
  { id: 'e5', name: 'Carlos Muñoz',   role: 'Tech',    mileageEligible: false, rate: 60, weekHours: 38.0, weekMiles: 0,  status: 'off',     jobId: null,        clockedInAt: null },
  { id: 'e6', name: 'Mike Delgado',   role: 'Tech',    mileageEligible: false, rate: 56, weekHours: 39.5, weekMiles: 0,  status: 'on_site', jobId: 'SMB-2412', clockedInAt: '7:30 AM' },
  { id: 'e7', name: 'Ray Chen',       role: 'Tech',    mileageEligible: false, rate: 54, weekHours: 40.0, weekMiles: 0,  status: 'off',     jobId: null,        clockedInAt: null },
  { id: 'e8', name: 'Jay Lucero',     role: 'Foreman', mileageEligible: false, rate: 70, weekHours: 40.0, weekMiles: 0,  status: 'on_site', jobId: 'SMB-2412', clockedInAt: '7:28 AM' },
];

export const findProject = (id: string | null) => projects.find(p => p.id === id) || null;
export const findEmployee = (id: string) => employees.find(e => e.id === id);
export const crewOnJob = (jobId: string) =>
  employees.filter(e => e.jobId === jobId && e.status === 'on_site');
