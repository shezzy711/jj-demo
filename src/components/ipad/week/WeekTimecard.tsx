'use client';

import { Plus, Edit3 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { theme as t } from '@/lib/theme';
import type { TimecardEditMap } from '@/lib/types/forms';
import type { EditRow } from './EditTimeScreen';

interface BaseRow {
  day: string;
  date: string;
  job?: string;
  clockIn?: string;
  clockOut?: string;
  hours?: number;
  off?: boolean;
  live?: boolean;
}
interface DisplayRow extends BaseRow {
  edited?: boolean;
}

interface WeekTimecardProps {
  tcEdits: TimecardEditMap;
  onEditRow: (row: EditRow) => void;
  onAddDay: (day: string) => void;
}

const baseRows: BaseRow[] = [
  { day: 'Mon', date: 'Apr 20', job: 'Mountain View', clockIn: '7:58 AM', clockOut: '4:32 PM', hours: 8.0 },
  { day: 'Tue', date: 'Apr 21', job: 'Mountain View', clockIn: '8:02 AM', clockOut: '4:45 PM', hours: 8.2 },
  { day: 'Wed', date: 'Apr 22', job: 'Mountain View', clockIn: '8:15 AM', clockOut: 'Now', hours: 4.0, live: true },
  { day: 'Thu', date: 'Apr 23', off: true },
  { day: 'Fri', date: 'Apr 24', off: true },
];

export default function WeekTimecard({ tcEdits, onEditRow, onAddDay }: WeekTimecardProps) {
  const { t: tt } = useLanguage();
  const rows: DisplayRow[] = baseRows.map(r => {
    const edit = tcEdits[r.day];
    if (edit) return { ...r, ...edit, edited: true, off: false };
    return r;
  });
  const total = rows.reduce((s, r) => s + (r.hours || 0), 0);

  return (
    <div
      style={{
        background: t.card,
        border: `1px solid ${t.line}`,
        borderRadius: 18,
        overflow: 'hidden',
        boxShadow: t.shadowSm,
      }}
    >
      {rows.map((r, i) =>
        r.off ? (
          <button
            key={i}
            onClick={() => onAddDay(r.day)}
            style={{
              display: 'grid',
              gridTemplateColumns: '60px 1fr auto',
              width: '100%',
              padding: '14px 18px',
              borderTop: i ? `1px solid ${t.line}` : 'none',
              fontSize: 13.5,
              alignItems: 'center',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div style={{ fontWeight: 700 }}>{r.day}</div>
            <div style={{ color: t.inkLight }}>{tt('week.offTapToAdd')}</div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                color: t.navy,
                fontSize: 12.5,
                fontWeight: 700,
              }}
            >
              <Plus size={14} strokeWidth={2.5} /> {tt('common.add')}
            </div>
          </button>
        ) : (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '60px 1.2fr 0.9fr 0.9fr 0.5fr 36px',
              padding: '14px 18px',
              borderTop: i ? `1px solid ${t.line}` : 'none',
              fontSize: 13.5,
              alignItems: 'center',
              gap: 6,
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{r.day}</div>
              {r.edited && (
                <div
                  style={{
                    fontSize: 9.5,
                    color: t.warn,
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    marginTop: 2,
                  }}
                >
                  {tt('week.edited')}
                </div>
              )}
            </div>
            <div style={{ color: t.ink, fontWeight: 600, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {r.job}
            </div>
            <button
              onClick={() => onEditRow({ day: r.day, field: 'clockIn', current: { clockIn: r.clockIn ?? '', clockOut: r.clockOut ?? '', hours: r.hours ?? 0 } })}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontVariantNumeric: 'tabular-nums',
                color: t.inkMuted,
                fontSize: 12.5,
                textAlign: 'left',
                padding: 0,
              }}
            >
              {r.clockIn}
            </button>
            <button
              onClick={() => onEditRow({ day: r.day, field: 'clockOut', current: { clockIn: r.clockIn ?? '', clockOut: r.clockOut ?? '', hours: r.hours ?? 0 } })}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontVariantNumeric: 'tabular-nums',
                fontSize: 12.5,
                color: r.live ? t.success : t.inkMuted,
                fontWeight: r.live ? 700 : 400,
                textAlign: 'left',
                padding: 0,
              }}
            >
              {r.clockOut}
            </button>
            <div
              style={{
                textAlign: 'right',
                fontVariantNumeric: 'tabular-nums',
                fontWeight: 700,
                fontSize: 15,
              }}
            >
              {(r.hours ?? 0).toFixed(1)}
            </div>
            <button
              onClick={() => onEditRow({ day: r.day, field: 'all', current: { clockIn: r.clockIn ?? '', clockOut: r.clockOut ?? '', hours: r.hours ?? 0 } })}
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: t.bg,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                justifySelf: 'end',
              }}
            >
              <Edit3 size={12} color={t.inkMuted} strokeWidth={2} />
            </button>
          </div>
        ),
      )}
      <div
        style={{
          padding: 18,
          background: t.navy,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 600 }}>{tt('week.weekTotal')}</span>
        <span
          style={{
            fontSize: 22,
            fontWeight: 700,
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.02em',
          }}
        >
          {total.toFixed(1)} hrs
        </span>
      </div>
    </div>
  );
}
