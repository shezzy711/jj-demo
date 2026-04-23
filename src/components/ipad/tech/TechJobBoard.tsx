'use client';

import { ChevronLeft, MapPin, Pause } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { theme as t } from '@/lib/theme';
import { format } from '@/lib/i18n/translations';
import type { Project } from '@/lib/types/forms';

interface TechJobBoardProps {
  project: Project;
  elapsed: string;
  clockedInAt: string;
  onBack: () => void;
  onClockOut: () => void;
}

export default function TechJobBoard({ project, elapsed, clockedInAt, onBack, onClockOut }: TechJobBoardProps) {
  const { t: tt } = useLanguage();
  return (
    <div style={{ padding: '16px 26px 130px' }}>
      <button
        onClick={onBack}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          fontSize: 14,
          color: t.inkMuted,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '6px 0',
          marginBottom: 10,
          fontWeight: 600,
        }}
      >
        <ChevronLeft size={16} /> {tt('common.home')}
      </button>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
          {project.name}
        </div>
        <div
          style={{
            fontSize: 12.5,
            color: t.inkLight,
            marginTop: 5,
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}
        >
          <MapPin size={12} /> {project.address}
        </div>
      </div>

      <div
        style={{
          background: t.card,
          border: `1px solid ${t.line}`,
          borderRadius: 22,
          padding: 26,
          boxShadow: t.shadowSm,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 12px',
            borderRadius: 999,
            background: t.successBg,
            marginBottom: 16,
          }}
        >
          <span
            className="pulse-dot-success"
            style={{ width: 8, height: 8, borderRadius: 4, background: t.success }}
          />
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 700,
              color: t.success,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            {tt('tech.youreWorking')}
          </span>
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            letterSpacing: '-0.03em',
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1,
            marginBottom: 6,
          }}
        >
          {elapsed}
        </div>
        <div style={{ fontSize: 13.5, color: t.inkLight }}>
          {format(tt('tech.clockedInAt'), { time: clockedInAt })}
        </div>
      </div>

      <button
        onClick={onClockOut}
        style={{
          width: '100%',
          padding: 22,
          borderRadius: 18,
          background: t.accent,
          color: '#fff',
          border: 'none',
          fontSize: 17,
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          boxShadow: '0 6px 18px rgba(200,85,61,0.35)',
        }}
      >
        <Pause size={20} strokeWidth={2.5} /> {tt('tech.clockOut')}
      </button>
    </div>
  );
}
