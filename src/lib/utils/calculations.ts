import { MILEAGE_RATE } from '@/lib/types/forms';
import type { TimecardEntry, MileageEntry, WorkOrderMaterial, WorkOrderLabor } from '@/lib/types/forms';

export function calculateDailyHours(timeIn: string, timeOut: string, lunch: boolean): number {
  if (!timeIn || !timeOut) return 0;
  const [inH, inM] = timeIn.split(':').map(Number);
  const [outH, outM] = timeOut.split(':').map(Number);
  let hours = (outH + outM / 60) - (inH + inM / 60);
  if (hours < 0) hours += 24;
  if (lunch) hours -= 0.5;
  return Math.max(0, Math.round(hours * 100) / 100);
}

export function calculateTimecardTotal(entries: TimecardEntry[]): number {
  return entries.reduce((sum, e) => sum + e.totalHours, 0);
}

export function calculateMileageTotal(entries: MileageEntry[]): number {
  return entries.reduce((sum, e) => sum + (e.totalMiles || 0), 0);
}

export function calculateMileageReimbursement(totalMiles: number): number {
  return Math.round(totalMiles * MILEAGE_RATE * 100) / 100;
}

export function calculateMaterialsTotal(materials: WorkOrderMaterial[]): number {
  return materials.reduce((sum, m) => sum + (m.quantity * m.amount), 0);
}

export function calculateLaborTotal(labor: WorkOrderLabor[]): number {
  return labor.reduce((sum, l) => sum + (l.hours * l.rate), 0);
}

export function calculateWorkOrderTotals(materials: WorkOrderMaterial[], labor: WorkOrderLabor[]) {
  const materialsTotal = calculateMaterialsTotal(materials);
  const laborTotal = calculateLaborTotal(labor);
  const subtotal = materialsTotal + laborTotal;
  const pandO = Math.round(subtotal * 0.10 * 100) / 100;
  const jobTotal = subtotal + pandO;
  return { materialsTotal, laborTotal, subtotal, pandO, jobTotal };
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function formatHours(hours: number): string {
  return `${hours.toFixed(1)}h`;
}
