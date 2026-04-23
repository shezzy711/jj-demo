'use client';

import { ChevronRight, CircleDot } from 'lucide-react';
import Avatar from '@/components/shared/Avatar';
import Pill from '@/components/shared/Pill';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { format } from '@/lib/i18n/translations';
import { theme as t } from '@/lib/theme';
import { employees, findProject } from '@/lib/sampleData';
import type { Employee } from '@/lib/types/forms';

interface EmployeesListProps {
  onOpen: (id: string) => void;
}

export default function EmployeesList({ onOpen }: EmployeesListProps) {
  const { t: tt } = useLanguage();
  const onSiteCount = employees.filter(e => e.status === 'on_site').length;
  const offCount = employees.length - onSiteCount;

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontSize: 36,
            fontWeight: 700,
            letterSpacing: '-0.03em',
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          {tt('pm.employees.title')}
        </h1>
        <div style={{ fontSize: 14, color: t.inkMuted, marginTop: 8 }}>
          Week of April 20 – 26 ·{' '}
          <span style={{ color: t.success, fontWeight: 600 }}>
            {format(tt('pm.employees.subtitle'), { on: onSiteCount, off: offCount })}
          </span>
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: 14,
        }}
      >
        {employees.map(e => (
          <EmployeeCard key={e.id} emp={e} onClick={() => onOpen(e.id)} />
        ))}
      </div>
    </div>
  );
}

function EmployeeCard({ emp, onClick }: { emp: Employee; onClick: () => void }) {
  const { t: tt } = useLanguage();
  const proj = findProject(emp.jobId);
  return (
    <button
      onClick={onClick}
      style={{
        background: t.card,
        border: `1px solid ${t.line}`,
        borderRadius: 16,
        padding: 22,
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'all 0.18s',
        width: '100%',
        display: 'block',
        boxShadow: t.shadowSm,
      }}
      onMouseEnter={el => {
        el.currentTarget.style.transform = 'translateY(-2px)';
        el.currentTarget.style.boxShadow = t.shadowMd;
      }}
      onMouseLeave={el => {
        el.currentTarget.style.transform = 'none';
        el.currentTarget.style.boxShadow = t.shadowSm;
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
        <Avatar name={emp.name} size={48} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16.5, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 4 }}>
            {emp.name}
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <Pill size="sm">{emp.role}</Pill>
            {emp.status === 'on_site' && proj && (
              <Pill tone="success" size="sm">
                <CircleDot size={8} fill={t.success} strokeWidth={0} />
                {proj.name}
              </Pill>
            )}
            {emp.status === 'off' && (
              <Pill tone="outline" size="sm">
                {tt('common.offToday')}
              </Pill>
            )}
          </div>
        </div>
        <ChevronRight size={18} color={t.inkLight} />
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          paddingTop: 16,
          borderTop: `1px solid ${t.line}`,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 10.5,
              color: t.inkLight,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontWeight: 600,
              marginBottom: 4,
            }}
          >
            {tt('pm.employees.weekHours')}
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.02em',
            }}
          >
            {emp.weekHours.toFixed(1)}
          </div>
        </div>
        <div>
          <div
            style={{
              fontSize: 10.5,
              color: t.inkLight,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontWeight: 600,
              marginBottom: 4,
            }}
          >
            {tt('pm.employees.weekMiles')}
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.02em',
              color: emp.mileageEligible ? t.ink : t.inkLight,
            }}
          >
            {emp.mileageEligible ? emp.weekMiles : '—'}
          </div>
        </div>
      </div>
    </button>
  );
}
