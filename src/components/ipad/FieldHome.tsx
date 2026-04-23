'use client';

import { Clock, Car, Package, ClipboardList } from 'lucide-react';
import BigTile from '@/components/shared/BigTile';
import LangToggle from '@/components/shared/LangToggle';
import Avatar from '@/components/shared/Avatar';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { format } from '@/lib/i18n/translations';
import { theme as t } from '@/lib/theme';

export type FormKind = 'timecard' | 'mileage' | 'requisition' | 'workorder';

interface FieldHomeProps {
  greetingName: string;
  onPick: (kind: FormKind) => void;
}

export default function FieldHome({ greetingName, onPick }: FieldHomeProps) {
  const { t: tt } = useLanguage();
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const tiles: { kind: FormKind; icon: typeof Clock; label: string }[] = [
    { kind: 'timecard',    icon: Clock,         label: tt('home.tile.timecard') },
    { kind: 'workorder',   icon: ClipboardList, label: tt('home.tile.workorder') },
    { kind: 'requisition', icon: Package,       label: tt('home.tile.requisition') },
    { kind: 'mileage',     icon: Car,           label: tt('home.tile.mileage') },
  ];

  return (
    <div style={{ padding: '22px 22px 28px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 22,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, color: t.inkMuted, fontWeight: 600 }}>{today}</div>
          <div
            style={{
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: '-0.03em',
              marginTop: 4,
              lineHeight: 1.05,
            }}
          >
            {format(tt('home.greeting'), { name: greetingName })}
          </div>
        </div>
        <Avatar name={greetingName} size={48} tone="navy" />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: t.inkLight,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          {tt('home.pick')}
        </div>
        <LangToggle />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {tiles.map(tile => (
          <BigTile
            key={tile.kind}
            tile={{ icon: tile.icon, label: tile.label }}
            onClick={() => onPick(tile.kind)}
          />
        ))}
      </div>
    </div>
  );
}
