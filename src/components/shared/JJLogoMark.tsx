'use client';

import { theme as t } from '@/lib/theme';

export default function JJLogoMark({ size = 36 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: Math.max(8, size * 0.25),
        background: t.accent,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          color: 'white',
          fontSize: Math.round(size * 0.4),
          fontWeight: 800,
          letterSpacing: '-0.04em',
        }}
      >
        J&amp;J
      </span>
    </div>
  );
}
