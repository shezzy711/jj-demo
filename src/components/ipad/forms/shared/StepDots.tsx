'use client';

import { theme as t } from '@/lib/theme';

interface StepDotsProps {
  current: number;
  total: number;
}

export default function StepDots({ current, total }: StepDotsProps) {
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 18 }}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          style={{
            width: i === current ? 22 : 8,
            height: 8,
            borderRadius: 4,
            background: i === current ? t.navy : i < current ? t.success : t.lineStrong,
            transition: 'all 0.2s',
          }}
        />
      ))}
    </div>
  );
}
