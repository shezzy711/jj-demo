import type {
  TimecardData,
  MileageData,
  RequisitionData,
  WorkOrderData,
} from '@/lib/types/forms';

const today = new Date();
const fmt = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (d: Date, n: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};

const friday = (() => {
  const day = today.getDay();
  const diff = (5 - day + 7) % 7;
  return addDays(today, diff);
})();

export const sampleTimecard: TimecardData = {
  employeeName: 'Carlos Martinez',
  weekEnding: fmt(friday),
  entries: [
    {
      dayOfWeek: 'Monday',
      date: fmt(addDays(friday, -4)),
      jobNumber: '2487',
      jobName: 'Caesars Pool House — drain line',
      timeIn: '07:00',
      timeOut: '15:30',
      lunch: true,
      totalHours: 8,
    },
    {
      dayOfWeek: 'Tuesday',
      date: fmt(addDays(friday, -3)),
      jobNumber: '2487',
      jobName: 'Caesars Pool House — drain line',
      timeIn: '06:45',
      timeOut: '16:15',
      lunch: true,
      totalHours: 9,
    },
    {
      dayOfWeek: 'Wednesday',
      date: fmt(addDays(friday, -2)),
      jobNumber: '2491',
      jobName: 'Summerlin Office — backflow install',
      timeIn: '07:00',
      timeOut: '15:00',
      lunch: true,
      totalHours: 7.5,
    },
    {
      dayOfWeek: 'Thursday',
      date: fmt(addDays(friday, -1)),
      jobNumber: '2491',
      jobName: 'Summerlin Office — backflow install',
      timeIn: '07:00',
      timeOut: '14:30',
      lunch: true,
      totalHours: 7,
    },
  ],
};

export const sampleMileage: MileageData = {
  employeeName: 'Miguel Rodriguez',
  weekEnding: fmt(friday),
  entries: [
    {
      date: fmt(addDays(friday, -4)),
      startLocation: 'Shop — 4262 Blue Diamond Rd',
      endLocation: 'Caesars Palace — 3570 S Las Vegas Blvd',
      startOdometer: 48210,
      endOdometer: 48227,
      totalMiles: 17,
    },
    {
      date: fmt(addDays(friday, -3)),
      startLocation: 'Caesars Palace',
      endLocation: 'Ferguson Supply — 6675 S Eastern Ave',
      startOdometer: 48227,
      endOdometer: 48243,
      totalMiles: 16,
    },
    {
      date: fmt(addDays(friday, -2)),
      startLocation: 'Shop',
      endLocation: 'Summerlin Medical Plaza — 653 N Town Center Dr',
      startOdometer: 48243,
      endOdometer: 48270,
      totalMiles: 27,
    },
    {
      date: fmt(addDays(friday, -1)),
      startLocation: 'Summerlin Medical Plaza',
      endLocation: 'Shop',
      startOdometer: 48270,
      endOdometer: 48295,
      totalMiles: 25,
    },
  ],
};

export const sampleRequisition: RequisitionData = {
  jobNumber: '2491',
  jobName: 'Summerlin Office — backflow install',
  originationDate: fmt(addDays(today, -2)),
  projectStartDate: fmt(addDays(today, 3)),
  projectAddress: '653 N Town Center Dr, Las Vegas, NV 89144',
  foremanLead: 'David Sanchez',
  materials: [
    { quantity: 2, source: 'order', supplier: 'Ferguson', description: '2" Watts 909 RPZ backflow assembly' },
    { quantity: 4, source: 'inventory', supplier: 'Shop', description: '2" brass ball valves, full port' },
    { quantity: 20, source: 'order', supplier: 'Ferguson', description: '2" copper pipe, type L' },
    { quantity: 12, source: 'inventory', supplier: 'Shop', description: '2" 90° copper elbows' },
    { quantity: 1, source: 'order', supplier: 'Grainger', description: 'Test cock kit, 5-valve' },
  ],
  tools: [
    { quantity: 1, source: 'inventory', supplier: 'Shop', description: 'Ridgid 300 threading machine' },
    { quantity: 1, source: 'inventory', supplier: 'Shop', description: 'MAPP torch kit + extra cylinders' },
  ],
  notes: 'Schedule shutoff with building manager 24 hrs in advance. Backflow inspector confirmed for Friday AM.',
};

export const sampleWorkOrder: WorkOrderData = {
  formType: 'work-order',
  jobNumber: '2487',
  date: fmt(addDays(today, -1)),
  projectName: 'Caesars Pool House — drain line',
  projectAddress: '3570 S Las Vegas Blvd, Las Vegas, NV 89109',
  siteContact: 'Marco Russo, Facilities (702-555-0188)',
  technician: 'Carlos Martinez',
  timeIn: '07:00',
  timeOut: '15:30',
  weather: 'sunny',
  temperature: '88°F',
  scopeOfWork:
    'Cleared blockage in 4" main pool drain line, hydro-jetted 60 ft from cleanout. Recovered foreign object (pool toy fragment). Camera-inspected line — found minor scale at 35 ft, recommended descale on next visit. Replaced 4" cleanout cap and tested flow.',
  materials: [
    { quantity: 1, description: '4" PVC cleanout cap, threaded', amount: 18.5 },
    { quantity: 2, description: 'Drain cleaning chemical, gallon', amount: 42 },
    { quantity: 1, description: 'Hydro-jet nozzle, replacement', amount: 65 },
  ],
  labor: [
    { date: fmt(addDays(today, -1)), technician: 'Carlos Martinez', hours: 8, rate: 95 },
    { date: fmt(addDays(today, -1)), technician: 'Luis Garcia', hours: 4, rate: 75 },
  ],
  hasProblems: true,
  problemDescription:
    'Scale buildup at 35 ft suggests recurring hard-water issue. Recommend customer install inline filter at pool equipment pad.',
};
