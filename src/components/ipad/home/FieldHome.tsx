'use client';

import { ArrowRight, ChevronRight, Hammer } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { theme as t } from '@/lib/theme';
import { format } from '@/lib/i18n/translations';
import Avatar from '@/components/shared/Avatar';
import { projects, findProject } from '@/lib/sampleData';
import type { Employee, Project } from '@/lib/types/forms';

interface FieldHomeProps {
  user: Employee;
  clockedInTo: string;
  onPickJob: (p: Project) => void;
  onOpenJob: (p: Project) => void;
}

export default function FieldHome({ user, clockedInTo, onPickJob, onOpenJob }: FieldHomeProps) {
  const { t: tt } = useLanguage();
  const detected = findProject(clockedInTo);
  if (!detected) return null;
  const others = projects.filter(p => p.id !== clockedInTo);
  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
  const elapsed = '4h 02m';

  return (
    <div style={{ padding: '20px 26px 0' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <div style={{ fontSize: 13, color: t.inkMuted, fontWeight: 500 }}>{today}</div>
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.03em', marginTop: 4, lineHeight: 1.05 }}>
            {format(tt('ipad.greeting'), { name: user.name.split(' ')[0] })}
          </div>
        </div>
        <Avatar name={user.name} size={48} tone="navy" />
      </div>

      <button
        onClick={() => onOpenJob(detected)}
        style={{
          width: '100%',
          background: t.navy,
          borderRadius: 22,
          padding: 24,
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: 22,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse 80% 60% at 100% 0%, rgba(200,85,61,0.3), transparent 60%),
                         radial-gradient(ellipse 60% 80% at 0% 100%, rgba(200,85,61,0.15), transparent 70%)`,
          }}
        />
        <div style={{ position: 'relative' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 12px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.12)',
              marginBottom: 14,
            }}
          >
            <span
              className="pulse-dot"
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                background: t.accent,
                display: 'inline-block',
              }}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#fff',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              {tt('ipad.clockedIn')}
            </span>
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
              marginBottom: 4,
            }}
          >
            {detected.name}
          </div>
          <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.7)', marginBottom: 18 }}>
            {format(tt('tech.clockedInAt'), { time: user.clockedInAt ?? '—' })} ·{' '}
            <span style={{ fontVariantNumeric: 'tabular-nums', color: '#fff', fontWeight: 600 }}>{elapsed}</span>
          </div>
          <div
            style={{
              padding: '12px 20px',
              borderRadius: 12,
              background: t.accent,
              color: '#fff',
              fontSize: 14,
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            {tt('ipad.openThisJob')} <ArrowRight size={16} strokeWidth={2.5} />
          </div>
        </div>
      </button>

      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: t.inkMuted,
          marginBottom: 12,
          paddingLeft: 2,
        }}
      >
        {tt('ipad.switchJob')}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {others.map(p => (
          <button
            key={p.id}
            onClick={() => onPickJob(p)}
            style={{
              background: t.card,
              border: `1px solid ${t.line}`,
              borderRadius: 16,
              padding: 14,
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              width: '100%',
              boxShadow: t.shadowSm,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: t.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: t.navy,
                flexShrink: 0,
              }}
            >
              <Hammer size={18} strokeWidth={1.6} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {p.name}
              </div>
              <div style={{ fontSize: 11.5, color: t.inkLight, marginTop: 3 }}>{p.address}</div>
            </div>
            <ChevronRight size={16} color={t.inkLight} />
          </button>
        ))}
      </div>
      <div style={{ height: 24 }} />
    </div>
  );
}
