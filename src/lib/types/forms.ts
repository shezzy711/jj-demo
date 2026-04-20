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

export interface WorkOrderData {
  jobNumber: string;
  jobLocation: string;
  date: string;
  projectName: string;
  projectAddress: string;
  siteContact: string;
  technician: string;
  timeIn: string;
  timeOut: string;
  weather: 'sunny' | 'rainy' | 'windy' | '';
  temperature: string;
  scopeOfWork: string;
  materials: WorkOrderMaterial[];
  labor: WorkOrderLabor[];
  hasProblems: boolean;
  problemDescription: string;
  techSignature: string;
  customerSignature: string;
}

export const EMPLOYEES = [
  'John F.', 'Carlos M.', 'Miguel R.', 'David S.', 'James T.',
  'Robert H.', 'Luis G.', 'Jose P.', 'Mark W.', 'Anthony B.',
  'Chris D.', 'Kevin L.', 'Brian K.', 'Jason N.', 'Ryan C.',
  'Eric V.', 'Steven A.', 'Daniel O.', 'Andrew Z.', 'Other',
];

export const MILEAGE_RATE = 0.725;
