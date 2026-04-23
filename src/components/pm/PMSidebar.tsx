'use client';

import { Users, Briefcase, Settings, Tablet } from 'lucide-react';
import JJLogoMark from '@/components/shared/JJLogoMark';
import Avatar from '@/components/shared/Avatar';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { theme as t } from '@/lib/theme';
import { employees } from '@/lib/sampleData';
import { projects } from '@/lib/sampleData';

export type PMSection = 'employees' | 'jobs' | 'settings';

interface PMSidebarProps {
  section: PMSection;
  onSection: (section: PMSection) => void;
  onOpenIPad: () => void;
}

export default function PMSidebar({ section, onSection, onOpenIPad }: PMSidebarProps) {
  const { t: tt } = useLanguage();
  const items = [
    { id: 'employees' as const, label: tt('pm.nav.employees'), icon: Users,     count: employees.length },
    { id: 'jobs'      as const, label: tt('pm.nav.jobs'),      icon: Briefcase, count: projects.length },
    { id: 'settings'  as const, label: tt('pm.nav.settings'),  icon: Settings,  count: undefined },
  ];

  return (
    <aside
      style={{
        width: 264,
        background: t.card,
        borderRight: `1px solid ${t.line}`,
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 8px 24px' }}>
        <JJLogoMark size={40} />
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.015em', lineHeight: 1.1 }}>
            {tt('app.title')}
          </div>
          <div
            style={{
              fontSize: 10.5,
              color: t.inkLight,
              marginTop: 3,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {tt('app.poweredBy')}
          </div>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {items.map(item => {
          const Icon = item.icon;
          const active = section === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSection(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                borderRadius: 10,
                border: 'none',
                background: active ? t.navy : 'transparent',
                color: active ? '#fff' : t.ink,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: active ? 600 : 500,
                textAlign: 'left',
                transition: 'all 0.15s',
              }}
            >
              <Icon size={17} strokeWidth={active ? 2.2 : 1.8} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.count != null && (
                <span
                  style={{
                    fontSize: 11.5,
                    fontVariantNumeric: 'tabular-nums',
                    color: active ? 'rgba(255,255,255,0.6)' : t.inkLight,
                    fontWeight: 500,
                  }}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div style={{ flex: 1 }} />

      <button
        onClick={onOpenIPad}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '14px 16px',
          marginBottom: 14,
          borderRadius: 12,
          background: t.accent,
          border: 'none',
          cursor: 'pointer',
          fontSize: 14,
          fontWeight: 700,
          color: '#fff',
          textAlign: 'left',
          boxShadow: '0 6px 18px rgba(200,85,61,0.3)',
        }}
      >
        <Tablet size={17} strokeWidth={2.2} />
        <span style={{ flex: 1 }}>{tt('pm.openIPad')}</span>
      </button>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '10px 12px',
          borderRadius: 10,
          background: t.bg,
          border: `1px solid ${t.line}`,
        }}
      >
        <Avatar name="Taryn O" size={36} tone="navy" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>Taryn O.</div>
          <div style={{ fontSize: 11, color: t.inkLight }}>{tt('pm.profile.role')}</div>
        </div>
      </div>
    </aside>
  );
}
