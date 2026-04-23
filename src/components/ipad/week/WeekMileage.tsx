'use client';

import { Plus } from 'lucide-react';
import Pill from '@/components/shared/Pill';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { theme as t } from '@/lib/theme';
import { companySettings } from '@/lib/branding';
import type { MileageLeg } from '@/lib/types/forms';

interface WeekMileageProps {
  mileage: MileageLeg[];
  onAdd: () => void;
}

const baseRows: MileageLeg[] = [
  { day: 'Mon Apr 20', start: 'Office',          end: 'Mountain View', miles: 12.0 },
  { day: 'Mon Apr 20', start: 'Mountain View',   end: 'Office',        miles: 12.0 },
  { day: 'Tue Apr 21', start: 'Office',          end: 'Mountain View', miles: 12.0 },
  { day: 'Tue Apr 21', start: 'Mountain View',   end: 'Summerlin',     miles: 8.4, addedLater: true },
  { day: 'Tue Apr 21', start: 'Summerlin',       end: 'Office',        miles: 10.6 },
];

export default function WeekMileage({ mileage, onAdd }: WeekMileageProps) {
  const { t: tt } = useLanguage();
  const allRows = [...baseRows, ...mileage];
  const total = allRows.reduce((s, r) => s + r.miles, 0);

  return (
    <div>
      <div
        style={{
          background: t.card,
          border: `1px solid ${t.line}`,
          borderRadius: 18,
          overflow: 'hidden',
          marginBottom: 12,
          boxShadow: t.shadowSm,
        }}
      >
        {allRows.map((r, i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr 60px',
              padding: '14px 18px',
              borderTop: i ? `1px solid ${t.line}` : 'none',
              fontSize: 13.5,
              alignItems: 'center',
              gap: 6,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, minWidth: 0 }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.day}</span>
              {r.addedLater && (
                <Pill tone="warn" size="sm">
                  {tt('pm.employees.addedLater')}
                </Pill>
              )}
            </div>
            <div style={{ color: t.inkMuted, fontSize: 12.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {r.start} → {r.end}
            </div>
            <div
              style={{
                textAlign: 'right',
                fontVariantNumeric: 'tabular-nums',
                fontWeight: 700,
                fontSize: 15,
              }}
            >
              {r.miles.toFixed(1)}
            </div>
          </div>
        ))}
        <div
          style={{
            padding: '16px 18px',
            background: t.navy,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>{tt('week.totalThisWeek')}</div>
            <div
              style={{
                fontSize: 11,
                color: 'rgba(255,255,255,0.65)',
                marginTop: 2,
              }}
            >
              {total.toFixed(1)} mi × ${companySettings.mileageRate}
            </div>
          </div>
          <span
            style={{
              fontSize: 21,
              fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            ${(total * companySettings.mileageRate).toFixed(2)}
          </span>
        </div>
      </div>
      <button
        onClick={onAdd}
        style={{
          width: '100%',
          padding: 16,
          borderRadius: 16,
          background: t.navy,
          border: 'none',
          color: '#fff',
          fontSize: 15,
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          boxShadow: '0 4px 14px rgba(15,35,64,0.25)',
        }}
      >
        <Plus size={17} strokeWidth={2.5} /> {tt('week.addLeg')}
      </button>
    </div>
  );
}
