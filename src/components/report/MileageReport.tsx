'use client';

import ReportShell from './ReportShell';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  calculateMileageTotal,
  calculateMileageReimbursement,
  formatCurrency,
} from '@/lib/utils/calculations';
import { MILEAGE_RATE, type MileageData } from '@/lib/types/forms';

interface Props {
  data: MileageData;
  onReset: () => void;
}

export default function MileageReport({ data, onReset }: Props) {
  const { t } = useLanguage();
  const totalMiles = calculateMileageTotal(data.entries);
  const reimbursement = calculateMileageReimbursement(totalMiles);

  return (
    <ReportShell formTitle={t('mileage.title')} onReset={onReset}>
      <table className="mb-4">
        <tbody>
          <tr>
            <td className="label-cell">{t('timecard.who')}</td>
            <td>{data.employeeName || '—'}</td>
            <td className="label-cell">{t('timecard.weekEnding')}</td>
            <td>{data.weekEnding || '—'}</td>
          </tr>
        </tbody>
      </table>

      <table>
        <thead>
          <tr>
            <th>{t('common.date')}</th>
            <th>{t('mileage.startLocation')}</th>
            <th>{t('mileage.endLocation')}</th>
            <th className="num">{t('mileage.startOdometer')}</th>
            <th className="num">{t('mileage.endOdometer')}</th>
            <th className="num">{t('mileage.totalMiles')}</th>
          </tr>
        </thead>
        <tbody>
          {data.entries.length === 0 && (
            <tr>
              <td colSpan={6} className="center text-muted">—</td>
            </tr>
          )}
          {data.entries.map((e, i) => (
            <tr key={i}>
              <td>{e.date}</td>
              <td>{e.startLocation}</td>
              <td>{e.endLocation}</td>
              <td className="num">{e.startOdometer ?? '—'}</td>
              <td className="num">{e.endOdometer ?? '—'}</td>
              <td className="num">{e.totalMiles}</td>
            </tr>
          ))}
          <tr className="total-row">
            <td colSpan={5}>{t('mileage.totalMiles')}</td>
            <td className="num">{totalMiles}</td>
          </tr>
          <tr className="total-row">
            <td colSpan={5}>
              × {formatCurrency(MILEAGE_RATE)} {t('mileage.perMile')}
            </td>
            <td className="num">{formatCurrency(reimbursement)}</td>
          </tr>
          <tr className="grand-row">
            <td colSpan={5}>{t('mileage.reimbursement')}</td>
            <td className="num">{formatCurrency(reimbursement)}</td>
          </tr>
        </tbody>
      </table>
    </ReportShell>
  );
}
