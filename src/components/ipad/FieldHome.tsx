'use client';

import { Clock, Car, Package, ClipboardList } from 'lucide-react';
import BigTile from '@/components/shared/BigTile';
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
    <div style={{ padding: '24px 24px 32px' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, color: t.inkMuted, fontWeight: 500 }}>{today}</div>
        <div
          style={{
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: '-0.03em',
            marginTop: 4,
            lineHeight: 1.05,
          }}
        >
          {format(tt('home.greeting'), { name: greetingName })}
        </div>
        <div style={{ fontSize: 14, color: t.inkLight, marginTop: 6 }}>{tt('home.pick')}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
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
