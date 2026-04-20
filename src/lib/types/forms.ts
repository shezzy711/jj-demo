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

export const EMPLOYEES = [
  'John Feno',
  'Carlos Martinez',
  'Miguel Rodriguez',
  'David Sanchez',
  'James Thompson',
  'Robert Hernandez',
  'Luis Garcia',
  'Jose Perez',
  'Mark Williams',
  'Anthony Brown',
  'Chris Davis',
  'Kevin Lopez',
  'Brian Kim',
  'Jason Nguyen',
  'Ryan Cooper',
  'Eric Vasquez',
  'Steven Adams',
  'Daniel Ortiz',
  'Andrew Zhang',
  'Other',
];

export const MILEAGE_RATE = 0.725;
