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

// C direction: chunkier — 2px borders, bigger labels, more depth.
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
    <div style={{ display: 'grid', gridTemplateColumns: grid[columns], gap: 12 }}>
      {options.map(opt => {
        const selected = value === opt.value;
        return (
          <button
            key={String(opt.value)}
            onClick={() => onChange(opt.value)}
            style={{
              padding: columns === 1 ? '18px 16px' : '16px 12px',
              minHeight: columns === 1 ? 72 : 76,
              borderRadius: 18,
              background: selected ? t.navy : t.card,
              color: selected ? '#fff' : t.ink,
              border: `2px solid ${selected ? t.navy : t.line}`,
              cursor: 'pointer',
              fontSize: columns === 1 ? 17 : columns === 2 ? 17 : 16,
              fontWeight: 700,
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
              display: 'flex',
              flexDirection: columns === 1 ? 'row' : 'column',
              alignItems: columns === 1 ? 'baseline' : 'center',
              justifyContent: columns === 1 ? 'space-between' : 'center',
              gap: columns === 1 ? 12 : 4,
              textAlign: columns === 1 ? 'left' : 'center',
              boxShadow: selected
                ? '0 8px 22px rgba(15,35,64,0.25), inset 0 1px 0 rgba(255,255,255,0.08)'
                : '0 1px 2px rgba(15,35,64,0.04)',
              transition: 'transform 0.1s ease',
            }}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.98)')}
            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <span style={{ fontWeight: 700 }}>{opt.label}</span>
            {opt.sublabel && (
              <span
                style={{
                  fontSize: columns === 1 ? 13 : 12,
                  fontWeight: 600,
                  color: selected ? 'rgba(255,255,255,0.7)' : t.inkLight,
                }}
              >
                {opt.sublabel}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
