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
        padding: '12px 18px',
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
          width: 36,
          height: 36,
          borderRadius: 10,
          background: t.bg,
          border: `1px solid ${t.line}`,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <ArrowLeft size={16} color={t.ink} strokeWidth={2.2} />
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: '-0.015em',
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
              fontSize: 11.5,
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
                width: i === step ? 18 : 6,
                height: 6,
                borderRadius: 3,
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
