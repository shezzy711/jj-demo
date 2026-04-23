'use client';

import { ChevronRight, MapPin, Hammer } from 'lucide-react';
import Pill from '@/components/shared/Pill';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { format } from '@/lib/i18n/translations';
import { theme as t } from '@/lib/theme';
import { projects, crewOnJob } from '@/lib/sampleData';
import type { Project } from '@/lib/types/forms';

interface JobsListProps {
  onOpen: (id: string) => void;
}

export default function JobsList({ onOpen }: JobsListProps) {
  const { t: tt } = useLanguage();
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
          {tt('pm.jobs.title')}
        </h1>
        <div style={{ fontSize: 14, color: t.inkMuted, marginTop: 8 }}>
          {format(tt('pm.jobs.subtitle'), { count: projects.length })}
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: 14,
        }}
      >
        {projects.map(p => (
          <JobCard key={p.id} project={p} onClick={() => onOpen(p.id)} />
        ))}
      </div>
    </div>
  );
}

function JobCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const { t: tt } = useLanguage();
  const crew = crewOnJob(project.id);
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
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: t.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: t.navy,
            flexShrink: 0,
          }}
        >
          <Hammer size={20} strokeWidth={1.6} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16.5, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 4 }}>
            {project.name}
          </div>
          <div
            style={{
              fontSize: 12.5,
              color: t.inkLight,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <MapPin size={11} /> {project.address}
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
            {tt('pm.jobs.startedOn')}
          </div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{project.startDate}</div>
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
            {tt('pm.jobs.crewToday')}
          </div>
          <Pill tone={crew.length > 0 ? 'success' : 'outline'} size="sm">
            {crew.length} {tt('common.onSite')}
          </Pill>
        </div>
      </div>
    </button>
  );
}
