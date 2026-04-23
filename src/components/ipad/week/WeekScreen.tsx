'use client';

import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import WeekTimecard from './WeekTimecard';
import WeekMileage from './WeekMileage';
import EditTimeScreen, { type EditRow } from './EditTimeScreen';
import AddDayScreen from './AddDayScreen';
import AddLegScreen from './AddLegScreen';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { theme as t } from '@/lib/theme';
import type { Employee, MileageLeg, TimecardEditMap } from '@/lib/types/forms';

interface WeekScreenProps {
  user: Employee;
  mileage: MileageLeg[];
  setMileage: (val: MileageLeg[]) => void;
  tcEdits: TimecardEditMap;
  setTcEdits: (val: TimecardEditMap) => void;
  onBack: () => void;
}

export default function WeekScreen({ user, mileage, setMileage, tcEdits, setTcEdits, onBack }: WeekScreenProps) {
  const { t: tt } = useLanguage();
  const [section, setSection] = useState<'timecard' | 'mileage'>('timecard');
  const [editingRow, setEditingRow] = useState<EditRow | null>(null);
  const [adding, setAdding] = useState(false);
  const [addingDay, setAddingDay] = useState<string | null>(null);

  if (adding) {
    return (
      <AddLegScreen
        onClose={() => setAdding(false)}
        onSave={leg => {
          setMileage([...mileage, leg]);
          setAdding(false);
        }}
      />
    );
  }
  if (addingDay) {
    return (
      <AddDayScreen
        day={addingDay}
        onClose={() => setAddingDay(null)}
        onSave={entry => {
          setTcEdits({ ...tcEdits, [addingDay]: entry });
          setAddingDay(null);
        }}
      />
    );
  }
  if (editingRow) {
    return (
      <EditTimeScreen
        row={editingRow}
        onClose={() => setEditingRow(null)}
        onSave={updated => {
          setTcEdits({
            ...tcEdits,
            [editingRow.day]: { ...(tcEdits[editingRow.day] || {}), ...updated, edited: true },
          });
          setEditingRow(null);
        }}
      />
    );
  }

  return (
    <div style={{ padding: '20px 24px' }}>
      <button
        onClick={onBack}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          fontSize: 13.5,
          color: t.inkMuted,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '8px 0',
          marginBottom: 12,
          fontWeight: 600,
        }}
      >
        <ChevronLeft size={16} /> {tt('common.home')}
      </button>
      <h1
        style={{
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: '-0.03em',
          margin: '0 0 18px 0',
          lineHeight: 1.1,
        }}
      >
        {tt('week.title')}
      </h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[
          { id: 'timecard' as const, label: tt('week.timecard') },
          ...(user.mileageEligible ? [{ id: 'mileage' as const, label: tt('week.mileage') }] : []),
        ].map(s => {
          const active = section === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              style={{
                padding: '10px 18px',
                borderRadius: 999,
                background: active ? t.navy : t.card,
                color: active ? '#fff' : t.ink,
                border: `1.5px solid ${active ? t.navy : t.line}`,
                fontSize: 13.5,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {section === 'timecard' && (
        <WeekTimecard
          tcEdits={tcEdits}
          onEditRow={row => setEditingRow(row)}
          onAddDay={day => setAddingDay(day)}
        />
      )}
      {section === 'mileage' && user.mileageEligible && (
        <WeekMileage mileage={mileage} onAdd={() => setAdding(true)} />
      )}
    </div>
  );
}
