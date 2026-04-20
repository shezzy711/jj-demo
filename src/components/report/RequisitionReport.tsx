'use client';

import ReportShell from './ReportShell';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { RequisitionData } from '@/lib/types/forms';

interface Props {
  data: RequisitionData;
  onReset: () => void;
}

export default function RequisitionReport({ data, onReset }: Props) {
  const { t } = useLanguage();

  return (
    <ReportShell formTitle={t('requisition.title')} onReset={onReset}>
      <table className="mb-4">
        <tbody>
          <tr>
            <td className="label-cell">{t('timecard.jobNumber')}</td>
            <td>{data.jobNumber || '—'}</td>
            <td className="label-cell">{t('requisition.originDate')}</td>
            <td>{data.originationDate || '—'}</td>
          </tr>
          <tr>
            <td className="label-cell">{t('timecard.jobName')}</td>
            <td>{data.jobName || '—'}</td>
            <td className="label-cell">{t('requisition.startDate')}</td>
            <td>{data.projectStartDate || '—'}</td>
          </tr>
          <tr>
            <td className="label-cell">{t('requisition.address')}</td>
            <td colSpan={3}>{data.projectAddress || '—'}</td>
          </tr>
          <tr>
            <td className="label-cell">{t('requisition.foreman')}</td>
            <td colSpan={3}>{data.foremanLead || '—'}</td>
          </tr>
        </tbody>
      </table>

      <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-foreground">
        {t('requisition.materials')}
      </h3>
      <table className="mb-4">
        <thead>
          <tr>
            <th className="num" style={{ width: '70px' }}>{t('report.qty')}</th>
            <th style={{ width: '110px' }}>{t('requisition.source')}</th>
            <th style={{ width: '160px' }}>{t('common.supplier')}</th>
            <th>{t('common.description')}</th>
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
              <td>{m.source === 'inventory' ? t('requisition.inventory') : t('requisition.orderNew')}</td>
              <td>{m.supplier || '—'}</td>
              <td>{m.description}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-foreground">
        {t('requisition.tools')}
      </h3>
      <table className="mb-4">
        <thead>
          <tr>
            <th className="num" style={{ width: '70px' }}>{t('report.qty')}</th>
            <th style={{ width: '110px' }}>{t('requisition.source')}</th>
            <th style={{ width: '160px' }}>{t('common.supplier')}</th>
            <th>{t('common.description')}</th>
          </tr>
        </thead>
        <tbody>
          {data.tools.length === 0 && (
            <tr>
              <td colSpan={4} className="center text-muted">—</td>
            </tr>
          )}
          {data.tools.map((tool, i) => (
            <tr key={i}>
              <td className="num">{tool.quantity}</td>
              <td>{tool.source === 'inventory' ? t('requisition.inventory') : t('requisition.orderNew')}</td>
              <td>{tool.supplier || '—'}</td>
              <td>{tool.description}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.notes && (
        <table>
          <tbody>
            <tr>
              <td className="label-cell" style={{ width: '120px' }}>{t('common.notes')}</td>
              <td>{data.notes}</td>
            </tr>
          </tbody>
        </table>
      )}
    </ReportShell>
  );
}
