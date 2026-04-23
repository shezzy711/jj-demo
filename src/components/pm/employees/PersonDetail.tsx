'use client';

import { useState } from 'react';
import { ChevronLeft, Clock, Calendar, Check, Download, Printer } from 'lucide-react';
import Avatar from '@/components/shared/Avatar';
import Pill from '@/components/shared/Pill';
import PersonTimecard from './PersonTimecard';
import PersonMileage from './PersonMileage';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { theme as t } from '@/lib/theme';
import type { Employee } from '@/lib/types/forms';

interface PersonDetailProps {
  emp: Employee;
  onBack: () => void;
  onPrint?: () => void;
}

export default function PersonDetail({ emp, onBack, onPrint }: PersonDetailProps) {
  const { t: tt } = useLanguage();
  const [section, setSection] = useState<'timecard' | 'mileage'>('timecard');
  return (
    <div>
      <button
        onClick={onBack}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          fontSize: 13,
          color: t.inkMuted,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          marginBottom: 20,
          fontWeight: 500,
        }}
      >
        <ChevronLeft size={15} /> {tt('pm.employees.allEmployees')}
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
        <Avatar name={emp.name} size={72} tone="navy" />
        <div>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 700,
              margin: 0,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            {emp.name}
          </h1>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <Pill tone="navy">{emp.role}</Pill>
            {emp.mileageEligible && <Pill>{tt('pm.employees.mileageEligible')}</Pill>}
            <Pill tone="outline">${emp.rate}/hr</Pill>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 4, borderBottom: `1px solid ${t.line}`, marginBottom: 26 }}>
        {[
          { id: 'timecard' as const, label: tt('pm.employees.section.timecard'), icon: Clock },
          ...(emp.mileageEligible
            ? [{ id: 'mileage' as const, label: tt('pm.employees.section.mileage'), icon: Calendar }]
            : []),
        ].map(s => {
          const Icon = s.icon;
          const active = section === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '13px 18px',
                border: 'none',
                background: 'transparent',
                borderBottom: `2.5px solid ${active ? t.navy : 'transparent'}`,
                color: active ? t.navy : t.inkMuted,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                marginBottom: -1,
              }}
            >
              <Icon size={14} strokeWidth={active ? 2.2 : 1.8} />
              {s.label}
            </button>
          );
        })}
      </div>

      {section === 'timecard' && <PersonTimecard emp={emp} />}
      {section === 'mileage' && emp.mileageEligible && <PersonMileage />}

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 18 }}>
        <button
          onClick={onPrint}
          style={{
            padding: '11px 18px',
            borderRadius: 10,
            background: t.card,
            color: t.ink,
            border: `1px solid ${t.lineStrong}`,
            fontSize: 13.5,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 7,
          }}
        >
          <Printer size={14} /> {tt('pm.employees.printPaperForm')}
        </button>
        <button
          style={{
            padding: '11px 18px',
            borderRadius: 10,
            background: t.card,
            color: t.ink,
            border: `1px solid ${t.lineStrong}`,
            fontSize: 13.5,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 7,
          }}
        >
          <Download size={14} /> {tt('common.exportQB')}
        </button>
        <button
          style={{
            padding: '11px 18px',
            borderRadius: 10,
            background: t.navy,
            color: '#fff',
            border: 'none',
            fontSize: 13.5,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 7,
          }}
        >
          <Check size={14} strokeWidth={2.5} />{' '}
          {section === 'timecard' ? tt('pm.employees.approveTimecard') : tt('pm.employees.approveMileage')}
        </button>
      </div>
    </div>
  );
}
