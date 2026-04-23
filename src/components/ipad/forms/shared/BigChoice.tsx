'use client';

import { theme as t } from '@/lib/theme';

interface Option<T extends string | number> {
  value: T;
  label: string;
  sublabel?: string;
}

interface BigChoiceProps<T extends string | number> {
  options: Option<T>[];
  value: T | undefined;
  onChange: (val: T) => void;
  columns?: 1 | 2 | 3 | 4;
}

export default function BigChoice<T extends string | number>({
  options,
  value,
  onChange,
  columns = 2,
}: BigChoiceProps<T>) {
  const grid = {
    1: 'repeat(1, 1fr)',
    2: 'repeat(2, 1fr)',
    3: 'repeat(3, 1fr)',
    4: 'repeat(4, 1fr)',
  };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: grid[columns], gap: 10 }}>
      {options.map(opt => {
        const selected = value === opt.value;
        return (
          <button
            key={String(opt.value)}
            onClick={() => onChange(opt.value)}
            style={{
              padding: '14px 12px',
              minHeight: 64,
              borderRadius: 14,
              background: selected ? t.navy : t.card,
              color: selected ? '#fff' : t.ink,
              border: `1.5px solid ${selected ? t.navy : t.line}`,
              cursor: 'pointer',
              fontSize: 14.5,
              fontWeight: 700,
              letterSpacing: '-0.005em',
              lineHeight: 1.2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              textAlign: 'center',
              boxShadow: selected ? '0 4px 14px rgba(15,35,64,0.2)' : 'none',
            }}
          >
            <span>{opt.label}</span>
            {opt.sublabel && (
              <span style={{
                fontSize: 11,
                fontWeight: 600,
                color: selected ? 'rgba(255,255,255,0.7)' : t.inkLight,
              }}>{opt.sublabel}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
