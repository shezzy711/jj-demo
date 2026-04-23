export type ProjectId = string;
export type EmployeeId = string;
export type Role = 'Foreman' | 'Tech' | 'Apprentice';
export type EmployeeStatus = 'on_site' | 'off' | 'travelling';

export interface Project {
  id: ProjectId;
  name: string;
  address: string;
  siteContact: string;
  startDate: string;
}

export interface Employee {
  id: EmployeeId;
  name: string;
  role: Role;
  mileageEligible: boolean;
  rate: number;
  weekHours: number;
  weekMiles: number;
  status: EmployeeStatus;
  jobId: ProjectId | null;
  clockedInAt: string | null;
}

// ─── Foreman DWO ────────────────────────────────────────────────
export interface ParsedItem {
  qty: number;
  unit?: string | null;
  name: string;
  supplier?: string;
  amount?: number;          // $/each, optional (DWO has it; req doesn't)
  source?: 'shop' | 'order'; // for requisition only
}

export interface ProblemNote {
  hasProblems: boolean;
  note?: string;
}

export interface ForemanDWO {
  scope: string | null;
  materials: ParsedItem[];
  photos: { caption: string; seed: number }[];
  problems: ProblemNote | null;
  customerSigned: boolean;
  customerSkipped: boolean;
  foremanSigned: boolean;
  signedAt?: string;
}

export interface RequisitionState {
  materials: ParsedItem[];
  tools: ParsedItem[];
  notes: string | null;
}

// ─── My Week / time edits ────────────────────────────────────────
export interface MileageLeg {
  day: string;          // "Mon Apr 20"
  start: string;
  end: string;
  miles: number;
  addedLater?: boolean;
}

export interface TimecardEditMap {
  [day: string]: {
    job?: string;
    clockIn?: string;
    clockOut?: string;
    hours?: number;
    edited?: boolean;
    lunch?: string;
  };
}

// ─── Old form types kept ONLY for the report components ─────────
// (Reports are restyled but keep their existing data shape.)
export interface TimecardEntry {
  dayOfWeek: string;
  date: string;
  jobNumber: string;
  jobName: string;
  timeIn: string;
  timeOut: string;
  lunch: boolean;
  totalHours: number;
}

export interface TimecardData {
  employeeName: string;
  weekEnding: string;
  entries: TimecardEntry[];
}

export interface MaterialItem {
  quantity: number;
  source: 'inventory' | 'order';
  supplier: string;
  description: string;
}

export interface ToolItem {
  quantity: number;
  source: 'inventory' | 'order';
  supplier: string;
  description: string;
}

export interface RequisitionData {
  jobNumber: string;
  jobName: string;
  originationDate: string;
  projectStartDate: string;
  projectAddress: string;
  foremanLead: string;
  materials: MaterialItem[];
  tools: ToolItem[];
  notes: string;
}

export interface MileageEntry {
  date: string;
  startLocation: string;
  endLocation: string;
  startOdometer?: number;
  endOdometer?: number;
  totalMiles: number;
}

export interface MileageData {
  employeeName: string;
  weekEnding: string;
  entries: MileageEntry[];
}

export interface WorkOrderMaterial {
  quantity: number;
  description: string;
  amount: number;
}

export interface WorkOrderLabor {
  date: string;
  technician: string;
  hours: number;
  rate: number;
}

export type WorkOrderFormType = 'work-order' | 'change-order' | 'estimate';
export type WorkOrderWeather = 'sunny' | 'rainy' | 'windy';

export interface WorkOrderData {
  formType: WorkOrderFormType;
  jobNumber: string;
  date: string;
  projectName: string;
  projectAddress: string;
  siteContact: string;
  technician: string;
  timeIn: string;
  timeOut: string;
  weather?: WorkOrderWeather;
  temperature: string;
  scopeOfWork: string;
  materials: WorkOrderMaterial[];
  labor: WorkOrderLabor[];
  hasProblems: boolean;
  problemDescription: string;
}

// Legacy demo placeholder kept (used by report components that reference it).
export const EMPLOYEES = [
  'Alex Ramirez',
  'Dave Kowalski',
  'Miguel Santos',
  'Tony Pham',
  'Carlos Muñoz',
  'Mike Delgado',
  'Ray Chen',
  'Jay Lucero',
  'Other',
];

export const MILEAGE_RATE = 0.725;
