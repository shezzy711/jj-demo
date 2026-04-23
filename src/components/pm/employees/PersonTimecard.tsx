'use client';

import { Edit3 } from 'lucide-react';
import Pill from '@/components/shared/Pill';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { theme as t } from '@/lib/theme';
import type { Employee } from '@/lib/types/forms';

export default function PersonTimecard({ emp }: { emp: Employee }) {
  const { t: tt } = useLanguage();
  type Row = [day: string, date: string, job: string | null, ci: string | null, co: string | null, lunch: string | null, hours: number, live: boolean, edited: boolean];
  const rows: Row[] = [
    ['Mon', 'Apr 20', 'Mountain View Hospital', '7:58 AM', '4:32 PM', 'Y', 8.0, false, true],
    ['Tue', 'Apr 21', 'Mountain View Hospital', '8:02 AM', '4:45 PM', 'Y', 8.2, false, false],
    ['Wed', 'Apr 22', 'Mountain View Hospital', '8:04 AM', 'In progress', '—', 4.1, true, false],
    ['Thu', 'Apr 23', null, null, null, null, 0, false, false],
    ['Fri', 'Apr 24', null, null, null, null, 0, false, false],
  ];
  const weekPay = emp.weekHours * emp.rate;
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
          gridTemplateColumns: '100px 1.6fr 1fr 1fr 0.6fr 0.7fr',
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
        <div>{tt('common.job')}</div>
        <div>{tt('common.start')}</div>
        <div>{tt('common.end')}</div>
        <div style={{ textAlign: 'center' }}>{tt('common.lunch')}</div>
        <div style={{ textAlign: 'right' }}>{tt('common.hours')}</div>
      </div>
      {rows.map((r, i) => (
        <div
          key={i}
          style={{
            display: 'grid',
            gridTemplateColumns: '100px 1.6fr 1fr 1fr 0.6fr 0.7fr',
            padding: '16px 22px',
            borderTop: `1px solid ${t.line}`,
            fontSize: 14,
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: 14.5 }}>{r[0]}</div>
            <div style={{ fontSize: 11.5, color: t.inkLight }}>{r[1]}</div>
          </div>
          <div
            style={{
              color: r[2] ? t.ink : t.inkLight,
              fontWeight: r[2] ? 500 : 400,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              minWidth: 0,
            }}
          >
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {r[2] || tt('common.off')}
            </span>
            {r[8] && (
              <Pill tone="warn" size="sm">
                <Edit3 size={9} /> {tt('pm.employees.editedByTech')}
              </Pill>
            )}
          </div>
          <div style={{ fontVariantNumeric: 'tabular-nums', color: t.inkMuted, fontSize: 13 }}>
            {r[3] || '—'}
          </div>
          <div
            style={{
              fontVariantNumeric: 'tabular-nums',
              fontSize: 13,
              color: r[7] ? t.success : t.inkMuted,
              fontWeight: r[7] ? 600 : 400,
            }}
          >
            {r[4] || '—'}
          </div>
          <div style={{ textAlign: 'center', color: t.inkMuted, fontSize: 13 }}>{r[5] || '—'}</div>
          <div
            style={{
              textAlign: 'right',
              fontVariantNumeric: 'tabular-nums',
              fontWeight: 700,
              fontSize: 15.5,
            }}
          >
            {r[6] ? r[6].toFixed(1) : '—'}
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
          <div style={{ fontSize: 13.5, fontWeight: 600 }}>{tt('pm.employees.weekTotal')}</div>
          <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.6)', marginTop: 3 }}>
            {emp.weekHours.toFixed(1)} h × ${emp.rate}/hr
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.01em',
            }}
          >
            {emp.weekHours.toFixed(1)} h
          </div>
          <div
            style={{
              fontSize: 12.5,
              color: 'rgba(255,255,255,0.7)',
              marginTop: 2,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            ${weekPay.toFixed(2)} {tt('common.gross')}
          </div>
        </div>
      </div>
    </div>
  );
}
