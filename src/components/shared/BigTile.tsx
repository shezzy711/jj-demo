'use client';

import { Check, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { theme as t } from '@/lib/theme';

export interface TileShape {
  step?: string;
  icon: LucideIcon;
  label: string;
  done?: boolean;
  primary?: boolean;
  disabled?: boolean;
}

interface BigTileProps {
  tile: TileShape;
  onClick?: () => void;
  full?: boolean;
}

export default function BigTile({ tile, onClick, full }: BigTileProps) {
  const Icon = tile.icon;
  const { done, disabled, primary } = tile;
  let bg: string, fg: string, iconBg: string, iconColor: string, border: string;
  if (disabled) {
    bg = t.card;    fg = t.inkLight; iconBg = t.bgSoft; iconColor = t.inkLight; border = t.line;
  } else if (done) {
    bg = t.success; fg = '#fff';     iconBg = 'rgba(255,255,255,0.18)'; iconColor = '#fff'; border = t.success;
  } else if (primary) {
    bg = t.accent;  fg = '#fff';     iconBg = 'rgba(255,255,255,0.18)'; iconColor = '#fff'; border = t.accent;
  } else {
    bg = t.card;    fg = t.ink;      iconBg = t.navy;   iconColor = '#fff'; border = t.line;
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        aspectRatio: full ? 'auto' : '1.1',
        padding: full ? '20px 24px' : 20,
        background: bg,
        color: fg,
        border: `1.5px solid ${border}`,
        borderRadius: 20,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        flexDirection: full ? 'row' : 'column',
        alignItems: full ? 'center' : 'flex-start',
        justifyContent: full ? 'flex-start' : 'space-between',
        gap: full ? 18 : 0,
        boxShadow: disabled ? 'none' : (done || primary ? t.shadowMd : t.shadowSm),
        transition: 'transform 0.15s, box-shadow 0.15s',
        opacity: disabled ? 0.55 : 1,
        position: 'relative',
        textAlign: 'left',
        width: '100%',
      }}
      onMouseDown={e => !disabled && (e.currentTarget.style.transform = 'scale(0.98)')}
      onMouseUp={e => !disabled && (e.currentTarget.style.transform = 'none')}
      onMouseLeave={e => !disabled && (e.currentTarget.style.transform = 'none')}
    >
      <div
        style={{
          width: full ? 52 : 56,
          height: full ? 52 : 56,
          borderRadius: full ? 15 : 17,
          background: iconBg,
          color: iconColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={full ? 24 : 28} strokeWidth={1.8} />
      </div>
      {!full && <div style={{ flex: 1 }} />}
      <div
        style={{
          fontSize: 17,
          fontWeight: 700,
          letterSpacing: '-0.015em',
          lineHeight: 1.2,
          flex: full ? 1 : 'none',
        }}
      >
        {tile.label}
      </div>
      {done && !full && (
        <div
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            width: 26,
            height: 26,
            borderRadius: 13,
            background: 'rgba(255,255,255,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Check size={15} strokeWidth={3} />
        </div>
      )}
      {primary && !done && !disabled && !full && (
        <ArrowRight size={20} strokeWidth={2.5} style={{ position: 'absolute', top: 20, right: 20 }} />
      )}
      {full && !disabled && <ArrowRight size={19} strokeWidth={2.5} color={fg} />}
    </button>
  );
}
