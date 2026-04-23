'use client';

import { ArrowLeft } from 'lucide-react';
import { theme as t } from '@/lib/theme';

interface WizardHeaderProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
}

export default function WizardHeader({ title, subtitle, onClose }: WizardHeaderProps) {
  return (
    <div
      style={{
        padding: '16px 22px',
        borderBottom: `1px solid ${t.line}`,
        background: t.card,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}
    >
      <button
        onClick={onClose}
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          background: t.bg,
          border: `1px solid ${t.line}`,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ArrowLeft size={18} color={t.ink} strokeWidth={2} />
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.015em', lineHeight: 1.2 }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 12, color: t.inkLight, marginTop: 2 }}>{subtitle}</div>
        )}
      </div>
    </div>
  );
}
