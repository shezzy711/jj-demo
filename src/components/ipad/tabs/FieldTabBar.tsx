'use client';

import { Home, Calendar } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { theme as t } from '@/lib/theme';

interface FieldTabBarProps {
  current: 'home' | 'job' | 'week';
  onChange: (tab: 'home' | 'week') => void;
}

export default function FieldTabBar({ current, onChange }: FieldTabBarProps) {
  const { t: tt } = useLanguage();
  const tabs = [
    { id: 'home' as const, icon: Home,     label: tt('ipad.tab.home') },
    { id: 'week' as const, icon: Calendar, label: tt('ipad.tab.week') },
  ];
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        background: t.card,
        borderTop: `1px solid ${t.line}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 60px 18px',
      }}
    >
      {tabs.map(tab => {
        const Icon = tab.icon;
        const active = current === tab.id || (tab.id === 'home' && current === 'job');
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              background: 'transparent',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              cursor: 'pointer',
              color: active ? t.navy : t.inkLight,
              padding: '6px 20px',
            }}
          >
            <Icon size={22} strokeWidth={active ? 2.3 : 1.8} />
            <span style={{ fontSize: 11, fontWeight: active ? 700 : 500 }}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
