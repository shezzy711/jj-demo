'use client';

import ReportShell from './ReportShell';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { calculateTimecardTotal, formatHours } from '@/lib/utils/calculations';
import type { TimecardData } from '@/lib/types/forms';

interface Props {
  data: TimecardData;
  onReset: () => void;
}

export default function TimecardReport({ data, onReset }: Props) {
  const { t } = useLanguage();
  const total = calculateTimecardTotal(data.entries);

  return (
    <ReportShell formTitle={t('timecard.title')} onReset={onReset}>
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
            <th>{t('timecard.day')}</th>
            <th>{t('common.date')}</th>
            <th>{t('timecard.jobNumber')}</th>
            <th>{t('timecard.jobName')}</th>
            <th className="center">{t('timecard.timeIn')}</th>
            <th className="center">{t('timecard.timeOut')}</th>
            <th className="center">{t('timecard.lunch')}</th>
            <th className="num">{t('common.hours')}</th>
          </tr>
        </thead>
        <tbody>
          {data.entries.length === 0 && (
            <tr>
              <td colSpan={8} className="center text-muted">—</td>
            </tr>
          )}
          {data.entries.map((e, i) => (
            <tr key={i}>
              <td>{e.dayOfWeek}</td>
              <td>{e.date}</td>
              <td>{e.jobNumber}</td>
              <td>{e.jobName}</td>
              <td className="center">{e.timeIn}</td>
              <td className="center">{e.timeOut}</td>
              <td className="center">{e.lunch ? 'Y' : 'N'}</td>
              <td className="num">{formatHours(e.totalHours)}</td>
            </tr>
          ))}
          <tr className="grand-row">
            <td colSpan={7}>{t('timecard.totalHours')}</td>
            <td className="num">{formatHours(total)}</td>
          </tr>
        </tbody>
      </table>
    </ReportShell>
  );
}
