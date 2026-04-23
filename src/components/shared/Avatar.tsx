'use client';

import { theme as t } from '@/lib/theme';

type Tone = 'cream' | 'navy';

interface AvatarProps {
  name: string;
  size?: number;
  tone?: Tone;
}

export default function Avatar({ name, size = 40, tone = 'cream' }: AvatarProps) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const styles: Record<Tone, { bg: string; fg: string }> = {
    cream: { bg: t.bgSoft, fg: t.navy },
    navy:  { bg: t.navy,   fg: '#fff' },
  };
  const s = styles[tone];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        background: s.bg,
        color: s.fg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: Math.round(size * 0.36),
        fontWeight: 700,
        flexShrink: 0,
        letterSpacing: '-0.01em',
      }}
    >
      {initials}
    </div>
  );
}
