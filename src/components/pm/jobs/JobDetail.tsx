'use client';

import { ChevronLeft, MapPin, User, Calendar } from 'lucide-react';
import Avatar from '@/components/shared/Avatar';
import Pill from '@/components/shared/Pill';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { theme as t } from '@/lib/theme';
import { crewOnJob } from '@/lib/sampleData';
import type { Project } from '@/lib/types/forms';

interface JobDetailProps {
  project: Project;
  onBack: () => void;
}

export default function JobDetail({ project, onBack }: JobDetailProps) {
  const { t: tt } = useLanguage();
  const crew = crewOnJob(project.id);
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
        <ChevronLeft size={15} /> {tt('pm.jobs.allJobs')}
      </button>

      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 700,
            margin: 0,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
          }}
        >
          {project.name}
        </h1>
        <div
          style={{
            fontSize: 14,
            color: t.inkMuted,
            marginTop: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <MapPin size={13} /> {project.address}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Calendar size={13} /> {project.startDate}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
        <Card title={tt('pm.jobs.siteContact')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                background: t.bgSoft,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <User size={18} color={t.navy} />
            </div>
            <div style={{ fontSize: 14.5, fontWeight: 600 }}>{project.siteContact}</div>
          </div>
        </Card>
        <Card title={tt('pm.jobs.crewToday')}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {crew.length === 0 && (
              <span style={{ fontSize: 13, color: t.inkLight }}>{tt('common.offToday')}</span>
            )}
            {crew.map(e => (
              <div
                key={e.id}
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <Avatar name={e.name} size={28} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>{e.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <h2
        style={{
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: t.inkMuted,
          marginBottom: 12,
        }}
      >
        {tt('pm.jobs.recentDWO')}
      </h2>
      <div
        style={{
          background: t.card,
          border: `1px solid ${t.line}`,
          borderRadius: 14,
          overflow: 'hidden',
          boxShadow: t.shadowSm,
        }}
      >
        {[
          ['Apr 21', 'Alex Ramirez', '$2,140.00', 'success'],
          ['Apr 20', 'Alex Ramirez', '$1,860.50', 'success'],
          ['Apr 18', 'Alex Ramirez', '$3,420.00', 'success'],
        ].map(([date, foreman, total, tone], i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '120px 1fr 140px',
              padding: '16px 22px',
              borderTop: i ? `1px solid ${t.line}` : 'none',
              alignItems: 'center',
              fontSize: 14,
            }}
          >
            <div style={{ fontWeight: 700 }}>{date}</div>
            <div style={{ color: t.inkMuted }}>{foreman}</div>
            <div
              style={{
                textAlign: 'right',
                fontVariantNumeric: 'tabular-nums',
                fontWeight: 700,
                fontSize: 15,
                color: tone === 'success' ? t.success : t.ink,
              }}
            >
              {total}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: t.card,
        border: `1px solid ${t.line}`,
        borderRadius: 14,
        padding: 18,
        boxShadow: t.shadowSm,
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: t.inkLight,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontWeight: 600,
          marginBottom: 10,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}
