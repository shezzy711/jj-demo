'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { theme as t } from '@/lib/theme';
import type { ParsedItem } from '@/lib/types/forms';

interface MaterialRowProps {
  item: ParsedItem;
  withAmount?: boolean;
  sourceToggle?: boolean;
  onUpdate: (next: ParsedItem) => void;
  onRemove: () => void;
  onSourceToggle?: () => void;
}

export default function MaterialRow({
  item,
  withAmount,
  sourceToggle,
  onUpdate,
  onRemove,
  onSourceToggle,
}: MaterialRowProps) {
  const { t: tt } = useLanguage();
  const [editingAmount, setEditingAmount] = useState(false);

  return (
    <div
      style={{
        background: t.card,
        border: `1px solid ${t.line}`,
        borderRadius: 14,
        padding: 14,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        boxShadow: t.shadowSm,
        flexWrap: 'wrap',
      }}
    >
      <div
        style={{
          width: 54,
          height: 54,
          borderRadius: 12,
          background: t.bg,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: t.navy,
          flexShrink: 0,
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
          {item.qty}
        </div>
        {item.unit && (
          <div
            style={{
              fontSize: 9.5,
              fontWeight: 700,
              color: t.inkLight,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            {item.unit}
          </div>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 140 }}>
        <div style={{ fontSize: 14.5, fontWeight: 700, letterSpacing: '-0.01em' }}>{item.name}</div>
        {item.supplier && (
          <div style={{ fontSize: 11.5, color: t.inkLight, marginTop: 2 }}>{item.supplier}</div>
        )}
      </div>

      {withAmount && (
        <button
          onClick={() => setEditingAmount(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            padding: '8px 12px',
            borderRadius: 10,
            background: item.amount ? t.bgSoft : 'transparent',
            border: item.amount ? 'none' : `1.5px dashed ${t.line}`,
            color: item.amount ? t.ink : t.inkLight,
            cursor: 'pointer',
            fontSize: 13.5,
            fontWeight: 700,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {editingAmount ? (
            <>
              $
              <input
                type="number"
                autoFocus
                value={item.amount || ''}
                onChange={e => onUpdate({ ...item, amount: Number(e.target.value) })}
                onBlur={() => setEditingAmount(false)}
                onKeyDown={e => { if (e.key === 'Enter') setEditingAmount(false); }}
                style={{
                  width: 70,
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: 13.5,
                  fontWeight: 700,
                  fontVariantNumeric: 'tabular-nums',
                  color: t.ink,
                }}
              />
            </>
          ) : item.amount ? (
            `$${item.amount.toFixed(2)}`
          ) : (
            '+ $'
          )}
        </button>
      )}

      {sourceToggle && (
        <button
          onClick={onSourceToggle}
          style={{
            padding: '7px 12px',
            borderRadius: 999,
            background: item.source === 'shop' ? t.successBg : 'rgba(200,85,61,0.12)',
            color: item.source === 'shop' ? t.success : t.accent,
            fontSize: 10.5,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {item.source === 'shop' ? tt('foreman.fromShop') : tt('foreman.order')}
        </button>
      )}

      <button
        onClick={onRemove}
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          background: t.bg,
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <X size={15} color={t.inkMuted} strokeWidth={2} />
      </button>
    </div>
  );
}
