'use client';

import { ArrowLeft } from 'lucide-react';
import { theme as t } from '@/lib/theme';

interface WizardHeaderProps {
  title: string;
  subtitle?: string;
  step?: number;        // 0-indexed
  totalSteps?: number;  // total
  onClose: () => void;
}

export default function WizardHeader({ title, subtitle, step, totalSteps, onClose }: WizardHeaderProps) {
  const showDots = typeof step === 'number' && typeof totalSteps === 'number';
  return (
    <div
      style={{
        padding: '14px 20px',
        background: t.card,
        borderBottom: `1px solid ${t.line}`,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}
    >
      <button
        onClick={onClose}
        aria-label="Back"
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          background: t.bg,
          border: `1.5px solid ${t.line}`,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <ArrowLeft size={18} color={t.ink} strokeWidth={2.2} />
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 17,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: 12,
              color: t.inkLight,
              marginTop: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
      {showDots && (
        <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
          {Array.from({ length: totalSteps! }).map((_, i) => (
            <span
              key={i}
              style={{
                width: i === step ? 22 : 7,
                height: 7,
                borderRadius: 4,
                background: i === step ? t.navy : i < step! ? t.success : t.lineStrong,
                transition: 'all 0.2s',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
