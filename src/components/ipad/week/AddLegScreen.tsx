'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';
import WizardHeader from '../steps/WizardHeader';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { theme as t } from '@/lib/theme';
import type { MileageLeg } from '@/lib/types/forms';

interface AddLegScreenProps {
  onClose: () => void;
  onSave: (leg: MileageLeg) => void;
}

export default function AddLegScreen({ onClose, onSave }: AddLegScreenProps) {
  const { t: tt } = useLanguage();
  const [day, setDay] = useState('Wed Apr 22');
  const [start, setStart] = useState('Office');
  const [end, setEnd] = useState('');
  const [miles, setMiles] = useState('');

  const canSave = start && end && Number(miles) > 0;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
      <WizardHeader
        title={tt('week.addLegTitle')}
        subtitle={tt('week.addLegSubtitle')}
        onClose={onClose}
      />
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 22px 130px' }}>
        <Field label={tt('common.day')} value={day} onChange={setDay} />
        <div style={{ height: 12 }} />
        <Field label={tt('common.start')} value={start} onChange={setStart} />
        <div style={{ height: 12 }} />
        <Field label={tt('common.end')} value={end} onChange={setEnd} />
        <div style={{ height: 12 }} />
        <Field label={tt('common.miles')} value={miles} onChange={setMiles} numeric />
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
          disabled={!canSave}
          onClick={() => onSave({ day, start, end, miles: Number(miles), addedLater: true })}
          style={{
            flex: 2,
            padding: 18,
            borderRadius: 14,
            background: canSave ? t.navy : t.bgSoft,
            color: canSave ? '#fff' : t.inkLight,
            border: 'none',
            fontSize: 15,
            fontWeight: 700,
            cursor: canSave ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: canSave ? '0 4px 14px rgba(15,35,64,0.25)' : 'none',
          }}
        >
          <Save size={16} strokeWidth={2.5} /> {tt('common.save')}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  numeric,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  numeric?: boolean;
}) {
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
        inputMode={numeric ? 'decimal' : undefined}
        style={{
          width: '100%',
          padding: '14px 16px',
          borderRadius: 12,
          border: `1.5px solid ${t.line}`,
          background: t.card,
          fontSize: 16,
          fontVariantNumeric: numeric ? 'tabular-nums' : undefined,
          color: t.ink,
          outline: 'none',
        }}
      />
    </div>
  );
}
