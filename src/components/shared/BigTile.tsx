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
        aspectRatio: full ? 'auto' : '1.05',
        padding: full ? '22px 26px' : 22,
        background: bg,
        color: fg,
        border: `2px solid ${border}`,
        borderRadius: 22,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        flexDirection: full ? 'row' : 'column',
        alignItems: full ? 'center' : 'flex-start',
        justifyContent: full ? 'flex-start' : 'space-between',
        gap: full ? 18 : 0,
        boxShadow: disabled
          ? 'none'
          : (done || primary
            ? '0 10px 24px rgba(15,35,64,0.18), inset 0 1px 0 rgba(255,255,255,0.12)'
            : '0 4px 14px rgba(15,35,64,0.07), 0 1px 2px rgba(15,35,64,0.04)'),
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
          width: full ? 56 : 60,
          height: full ? 56 : 60,
          borderRadius: full ? 16 : 18,
          background: iconBg,
          color: iconColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={full ? 26 : 30} strokeWidth={2} />
      </div>
      {!full && <div style={{ flex: 1 }} />}
      <div
        style={{
          fontSize: 19,
          fontWeight: 700,
          letterSpacing: '-0.02em',
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
