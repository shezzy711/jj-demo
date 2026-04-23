'use client';

import { useState } from 'react';
import { AlertCircle, Save } from 'lucide-react';
import WizardHeader from '../steps/WizardHeader';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { format } from '@/lib/i18n/translations';
import { theme as t } from '@/lib/theme';

export interface EditRow {
  day: string;
  field: 'clockIn' | 'clockOut' | 'all';
  current: { clockIn: string; clockOut: string; hours: number };
}

interface EditTimeScreenProps {
  row: EditRow;
  onClose: () => void;
  onSave: (val: { clockIn?: string; clockOut?: string }) => void;
}

export default function EditTimeScreen({ row, onClose, onSave }: EditTimeScreenProps) {
  const { t: tt } = useLanguage();
  const [clockIn, setClockIn] = useState(row.current.clockIn);
  const [clockOut, setClockOut] = useState(row.current.clockOut);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
      <WizardHeader
        title={format(tt('week.editTitle'), { day: row.day })}
        subtitle={tt('week.editSubtitle')}
        onClose={onClose}
      />
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 22px 130px' }}>
        <div
          style={{
            background: 'rgba(184,137,47,0.1)',
            border: '1px solid rgba(184,137,47,0.25)',
            borderRadius: 12,
            padding: 14,
            marginBottom: 22,
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start',
          }}
        >
          <AlertCircle size={18} color={t.warn} style={{ flexShrink: 0, marginTop: 1 }} strokeWidth={2} />
          <div style={{ fontSize: 12.5, color: '#5C4818', lineHeight: 1.5 }}>{tt('week.editFlagged')}</div>
        </div>

        <Field label={tt('common.start')} value={clockIn} onChange={setClockIn} />
        <div style={{ height: 14 }} />
        <Field label={tt('common.end')} value={clockOut} onChange={setClockOut} />
      </div>
      <div
        style={{
          padding: '14px 22px 22px',
          background: t.card,
          borderTop: `1px solid ${t.line}`,
          display: 'flex',
          gap: 10,
        }}
      >
        <button
          onClick={onClose}
          style={{
            flex: 1,
            padding: 18,
            borderRadius: 14,
            background: t.card,
            color: t.inkMuted,
            border: `1.5px solid ${t.line}`,
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {tt('common.cancel')}
        </button>
        <button
          onClick={() => onSave({ clockIn, clockOut })}
          style={{
            flex: 2,
            padding: 18,
            borderRadius: 14,
            background: t.navy,
            color: '#fff',
            border: 'none',
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: '0 4px 14px rgba(15,35,64,0.25)',
          }}
        >
          <Save size={16} strokeWidth={2.5} /> {tt('common.save')}
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (val: string) => void }) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          fontSize: 12,
          fontWeight: 700,
          color: t.inkMuted,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginBottom: 8,
        }}
      >
        {label}
      </label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '14px 16px',
          borderRadius: 12,
          border: `1.5px solid ${t.line}`,
          background: t.card,
          fontSize: 16,
          fontVariantNumeric: 'tabular-nums',
          color: t.ink,
          outline: 'none',
        }}
      />
    </div>
  );
}
