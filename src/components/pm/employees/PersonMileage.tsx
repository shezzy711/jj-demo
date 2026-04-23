'use client';

import { Edit3 } from 'lucide-react';
import Pill from '@/components/shared/Pill';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { theme as t } from '@/lib/theme';
import { companySettings } from '@/lib/branding';

export default function PersonMileage() {
  const { t: tt } = useLanguage();
  type Row = [day: string, start: string, end: string, miles: number, addedLater: boolean];
  const rows: Row[] = [
    ['Mon Apr 20', 'Office', 'Mountain View Hospital', 12.0, false],
    ['Mon Apr 20', 'Mountain View Hospital', 'Office', 12.0, false],
    ['Tue Apr 21', 'Office', 'Mountain View Hospital', 12.0, false],
    ['Tue Apr 21', 'Mountain View Hospital', 'Summerlin MOB 1', 8.4, true],
    ['Tue Apr 21', 'Summerlin MOB 1', 'Office', 10.6, false],
    ['Wed Apr 22', 'Office', 'Mountain View Hospital', 12.0, false],
    ['Wed Apr 22', 'Mountain View Hospital', 'Bluegreen', 13.0, false],
    ['Wed Apr 22', 'Bluegreen', 'Office', 12.0, false],
  ];
  const total = rows.reduce((s, r) => s + r[3], 0);
  return (
    <div
      style={{
        background: t.card,
        border: `1px solid ${t.line}`,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: t.shadowSm,
        marginBottom: 16,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1.5fr 1.5fr 0.8fr',
          padding: '15px 22px',
          background: t.bg,
          fontSize: 11,
          fontWeight: 700,
          color: t.inkMuted,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        <div>{tt('common.day')}</div>
        <div>{tt('common.start')}</div>
        <div>{tt('common.end')}</div>
        <div style={{ textAlign: 'right' }}>{tt('common.miles')}</div>
      </div>
      {rows.map((r, i) => (
        <div
          key={i}
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1.5fr 1.5fr 0.8fr',
            padding: '15px 22px',
            borderTop: `1px solid ${t.line}`,
            fontSize: 13.5,
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
            {r[0]}
            {r[4] && (
              <Pill tone="warn" size="sm">
                <Edit3 size={9} /> {tt('pm.employees.addedLater')}
              </Pill>
            )}
          </div>
          <div style={{ color: t.inkMuted }}>{r[1]}</div>
          <div style={{ color: t.inkMuted }}>{r[2]}</div>
          <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600, fontSize: 14.5 }}>
            {r[3].toFixed(1)}
          </div>
        </div>
      ))}
      <div
        style={{
          padding: '18px 22px',
          background: t.navy,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
        }}
      >
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 600 }}>{tt('pm.employees.totalReimbursement')}</div>
          <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.6)', marginTop: 3 }}>
            {total.toFixed(1)} mi × ${companySettings.mileageRate}
          </div>
        </div>
        <div
          style={{
            fontSize: 26,
            fontWeight: 700,
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.02em',
          }}
        >
          ${(total * companySettings.mileageRate).toFixed(2)}
        </div>
      </div>
    </div>
  );
}
