'use client';

import type { ReactNode } from 'react';
import { theme as t } from '@/lib/theme';

type Tone = 'default' | 'success' | 'outline' | 'navy' | 'warn' | 'accent';
type Size = 'sm' | 'md' | 'lg';

interface PillProps {
  children: ReactNode;
  tone?: Tone;
  size?: Size;
}

export default function Pill({ children, tone = 'default', size = 'md' }: PillProps) {
  const tones: Record<Tone, { bg: string; fg: string; border?: string }> = {
    default: { bg: t.bgSoft, fg: t.ink },
    success: { bg: t.successBg, fg: t.success },
    outline: { bg: 'transparent', fg: t.inkMuted, border: t.lineStrong },
    navy:    { bg: t.navy, fg: '#fff' },
    accent:  { bg: 'rgba(200,85,61,0.12)', fg: t.accent },
    warn:    { bg: t.warnBg, fg: '#7A5A1F' },
  };
  const sizes: Record<Size, { fontSize: number; padding: string; gap: number }> = {
    sm: { fontSize: 11, padding: '3px 9px', gap: 4 },
    md: { fontSize: 12.5, padding: '5px 11px', gap: 5 },
    lg: { fontSize: 13.5, padding: '7px 14px', gap: 6 },
  };
  const tc = tones[tone];
  const sz = sizes[size];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: sz.gap,
        borderRadius: 999,
        fontWeight: 600,
        background: tc.bg,
        color: tc.fg,
        border: tc.border ? `1px solid ${tc.border}` : 'none',
        fontSize: sz.fontSize,
        padding: sz.padding,
        whiteSpace: 'nowrap',
        lineHeight: 1.2,
      }}
    >
      {children}
    </span>
  );
}
