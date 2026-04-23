'use client';

import ReportShell from './ReportShell';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  calculateWorkOrderTotals,
  formatCurrency,
} from '@/lib/utils/calculations';
import type { WorkOrderData } from '@/lib/types/forms';

interface Props {
  data: WorkOrderData;
  onReset: () => void;
  embedded?: boolean;
}

const FORM_TYPE_LABEL: Record<WorkOrderData['formType'], { en: string; es: string }> = {
  'work-order': { en: 'Work Order', es: 'Orden de Trabajo' },
  'change-order': { en: 'Change Order', es: 'Orden de Cambio' },
  'estimate': { en: 'Estimate', es: 'Estimado' },
};

export default function WorkOrderReport({ data, onReset, embedded }: Props) {
  const { t, lang } = useLanguage();
  const totals = calculateWorkOrderTotals(data.materials, data.labor);
  const weatherLabel = data.weather ? t(`workorder.${data.weather}`) : '—';
  const badge = FORM_TYPE_LABEL[data.formType][lang];

  return (
    <ReportShell formTitle={t('workorder.title')} badge={badge} onReset={onReset} embedded={embedded}>
      <table className="mb-4">
        <tbody>
          <tr>
            <td className="label-cell">{t('timecard.jobNumber')}</td>
            <td>{data.jobNumber || '—'}</td>
            <td className="label-cell">{t('common.date')}</td>
            <td>{data.date || '—'}</td>
          </tr>
          <tr>
            <td className="label-cell">{t('workorder.projectName')}</td>
            <td colSpan={3}>{data.projectName || '—'}</td>
          </tr>
          <tr>
            <td className="label-cell">{t('workorder.projectAddress')}</td>
            <td colSpan={3}>{data.projectAddress || '—'}</td>
          </tr>
          <tr>
            <td className="label-cell">{t('workorder.siteContact')}</td>
            <td>{data.siteContact || '—'}</td>
            <td className="label-cell">{t('workorder.technician')}</td>
            <td>{data.technician || '—'}</td>
          </tr>
          <tr>
            <td className="label-cell">{t('timecard.timeIn')}</td>
            <td>{data.timeIn || '—'}</td>
            <td className="label-cell">{t('timecard.timeOut')}</td>
            <td>{data.timeOut || '—'}</td>
          </tr>
          <tr>
            <td className="label-cell">{t('workorder.weather')}</td>
            <td>{weatherLabel}</td>
            <td className="label-cell">{t('workorder.temperature')}</td>
            <td>{data.temperature || '—'}</td>
          </tr>
        </tbody>
      </table>

      <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-foreground">
        {t('workorder.scope')}
      </h3>
      <table className="mb-4">
        <tbody>
          <tr>
            <td>{data.scopeOfWork || '—'}</td>
          </tr>
        </tbody>
      </table>

      <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-foreground">
        {t('workorder.materials')}
      </h3>
      <table className="mb-4">
        <thead>
          <tr>
            <th className="num" style={{ width: '60px' }}>{t('report.qty')}</th>
            <th>{t('common.description')}</th>
            <th className="num" style={{ width: '100px' }}>{t('report.unitPrice')}</th>
            <th className="num" style={{ width: '110px' }}>{t('report.lineTotal')}</th>
          </tr>
        </thead>
        <tbody>
          {data.materials.length === 0 && (
            <tr>
              <td colSpan={4} className="center text-muted">—</td>
            </tr>
          )}
          {data.materials.map((m, i) => (
            <tr key={i}>
              <td className="num">{m.quantity}</td>
              <td>{m.description}</td>
              <td className="num">{formatCurrency(m.amount)}</td>
              <td className="num">{formatCurrency(m.quantity * m.amount)}</td>
            </tr>
          ))}
          <tr className="total-row">
            <td colSpan={3}>{t('workorder.materialsTotal')}</td>
            <td className="num">{formatCurrency(totals.materialsTotal)}</td>
          </tr>
        </tbody>
      </table>

      <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-foreground">
        {t('workorder.labor')}
      </h3>
      <table className="mb-4">
        <thead>
          <tr>
            <th>{t('report.tech')}</th>
            <th className="num" style={{ width: '90px' }}>{t('common.hours')}</th>
            <th className="num" style={{ width: '90px' }}>{t('common.rate')}</th>
            <th className="num" style={{ width: '110px' }}>{t('report.lineTotal')}</th>
          </tr>
        </thead>
        <tbody>
          {data.labor.length === 0 && (
            <tr>
              <td colSpan={4} className="center text-muted">—</td>
            </tr>
          )}
          {data.labor.map((l, i) => (
            <tr key={i}>
              <td>{l.technician}</td>
              <td className="num">{l.hours}</td>
              <td className="num">{formatCurrency(l.rate)}</td>
              <td className="num">{formatCurrency(l.hours * l.rate)}</td>
            </tr>
          ))}
          <tr className="total-row">
            <td colSpan={3}>{t('workorder.laborTotal')}</td>
            <td className="num">{formatCurrency(totals.laborTotal)}</td>
          </tr>
        </tbody>
      </table>

      <table className="mb-4">
        <tbody>
          <tr>
            <td className="label-cell" style={{ width: '70%' }}>{t('workorder.subtotal')}</td>
            <td className="num">{formatCurrency(totals.subtotal)}</td>
          </tr>
          <tr>
            <td className="label-cell">{t('workorder.pandO')}</td>
            <td className="num">{formatCurrency(totals.pandO)}</td>
          </tr>
          <tr className="grand-row">
            <td>{t('workorder.jobTotal')}</td>
            <td className="num">{formatCurrency(totals.jobTotal)}</td>
          </tr>
        </tbody>
      </table>

      {data.hasProblems && data.problemDescription && (
        <>
          <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-danger">
            {t('report.problemsNoted')}
          </h3>
          <table>
            <tbody>
              <tr>
                <td>{data.problemDescription}</td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </ReportShell>
  );
}
