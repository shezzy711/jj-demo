export interface RecentJob {
  number: string;
  name: string;
  address?: string;
}

export const RECENT_JOBS: RecentJob[] = [
  { number: '2487', name: 'Caesars Pool House', address: '3570 S Las Vegas Blvd, Las Vegas, NV 89109' },
  { number: '2491', name: 'Summerlin Office', address: '653 N Town Center Dr, Las Vegas, NV 89144' },
  { number: '2503', name: 'Bellagio Spa Re-Pipe', address: '3600 S Las Vegas Blvd, Las Vegas, NV 89109' },
  { number: '2510', name: 'Wynn HVAC Condensate', address: '3131 S Las Vegas Blvd, Las Vegas, NV 89109' },
  { number: '2515', name: 'MGM Sportsbook Backflow', address: '3799 S Las Vegas Blvd, Las Vegas, NV 89109' },
];

export const RECENT_LOCATIONS: string[] = [
  'Shop — 4262 Blue Diamond Rd',
  'Caesars Palace — 3570 S Las Vegas Blvd',
  'Summerlin Medical — 653 N Town Center Dr',
  'Ferguson Supply — 6675 S Eastern Ave',
  'Bellagio — 3600 S Las Vegas Blvd',
  'MGM Grand — 3799 S Las Vegas Blvd',
];

export interface CommonMaterial {
  description: string;
  defaultAmount: number;
  defaultSupplier?: string;
}

export const COMMON_MATERIALS: CommonMaterial[] = [
  { description: '1/2" copper pipe, type L (10 ft)', defaultAmount: 28, defaultSupplier: 'Ferguson' },
  { description: '4" PVC schedule 40 (10 ft)', defaultAmount: 22, defaultSupplier: 'Ferguson' },
  { description: '2" Watts 909 RPZ backflow', defaultAmount: 485, defaultSupplier: 'Ferguson' },
  { description: 'Brass ball valve, full port', defaultAmount: 32, defaultSupplier: 'Shop' },
  { description: 'PVC cleanout cap, threaded', defaultAmount: 18.5, defaultSupplier: 'Shop' },
  { description: 'Drain cleaning chemical, 1 gal', defaultAmount: 42, defaultSupplier: 'Grainger' },
  { description: 'Wax ring, standard toilet', defaultAmount: 8, defaultSupplier: 'Shop' },
  { description: 'PEX 1/2" coil, 100 ft', defaultAmount: 95, defaultSupplier: 'Ferguson' },
];

export interface CommonTool {
  description: string;
  defaultSupplier?: string;
}

export const COMMON_TOOLS: CommonTool[] = [
  { description: 'Ridgid 300 threading machine', defaultSupplier: 'Shop' },
  { description: 'MAPP torch kit + cylinders', defaultSupplier: 'Shop' },
  { description: 'Hydro-jet, 4000 PSI', defaultSupplier: 'Shop' },
  { description: 'Pipe camera + monitor', defaultSupplier: 'Shop' },
  { description: 'Battery PEX crimper', defaultSupplier: 'Shop' },
  { description: 'Drain snake, 75 ft', defaultSupplier: 'Shop' },
];

export const TIME_PRESETS_IN: { value: string; label: string }[] = [
  { value: '06:30', label: '6:30 AM' },
  { value: '07:00', label: '7:00 AM' },
  { value: '07:30', label: '7:30 AM' },
  { value: '08:00', label: '8:00 AM' },
];

export const TIME_PRESETS_OUT: { value: string; label: string }[] = [
  { value: '14:30', label: '2:30 PM' },
  { value: '15:00', label: '3:00 PM' },
  { value: '15:30', label: '3:30 PM' },
  { value: '16:00', label: '4:00 PM' },
  { value: '17:00', label: '5:00 PM' },
];

export const TEMP_PRESETS: { value: string; label: string }[] = [
  { value: '70°F', label: '70°' },
  { value: '80°F', label: '80°' },
  { value: '90°F', label: '90°' },
  { value: '100°F', label: '100°' },
  { value: '110°F', label: '110°' },
];

export const RATE_PRESETS: { value: number; label: string }[] = [
  { value: 75, label: '$75' },
  { value: 85, label: '$85' },
  { value: 95, label: '$95' },
  { value: 125, label: '$125' },
];

// Date helpers — return YYYY-MM-DD
const fmt = (d: Date) => d.toISOString().slice(0, 10);

export function todayISO(): string {
  return fmt(new Date());
}

export function yesterdayISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return fmt(d);
}

export function tomorrowISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return fmt(d);
}

export function nextWeekISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return fmt(d);
}

export function nextFridayISO(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = day <= 5 ? 5 - day : 12 - day;
  d.setDate(d.getDate() + diff);
  return fmt(d);
}

export function lastFridayISO(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = day >= 5 ? -(day - 5 + 7) : -(day + 2);
  d.setDate(d.getDate() + diff);
  return fmt(d);
}
