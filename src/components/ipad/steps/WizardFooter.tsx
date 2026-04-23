'use client';

import { Check } from 'lucide-react';
import type { ReactNode } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { theme as t } from '@/lib/theme';

interface WizardFooterProps {
  onClose: () => void;
  primaryLabel?: string;
  onPrimary?: () => void;
  secondaryLabel?: ReactNode;
  onSecondary?: () => void;
  primaryDisabled?: boolean;
}

export default function WizardFooter({
  onClose,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  primaryDisabled,
}: WizardFooterProps) {
  const { t: tt } = useLanguage();
  const label = primaryLabel ?? tt('common.save');
  return (
    <div
      style={{
        padding: '14px 22px 22px',
        background: t.card,
        borderTop: `1px solid ${t.line}`,
        boxShadow: '0 -8px 20px rgba(15,35,64,0.05)',
        display: 'flex',
        gap: 10,
      }}
    >
      {secondaryLabel ? (
        <button
          onClick={onSecondary || onClose}
          style={{
            flex: 1,
            padding: 18,
            borderRadius: 14,
            background: t.card,
            color: t.ink,
            border: `1.5px solid ${t.line}`,
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          {secondaryLabel}
        </button>
      ) : (
        <button
          onClick={onClose}
          style={{
            flex: 1,
            padding: 18,
            borderRadius: 14,
            background: t.card,
            color: t.inkMuted,
            border: `1.5px solid ${t.line}`,
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {tt('common.cancel')}
        </button>
      )}
      <button
        onClick={onPrimary}
        disabled={primaryDisabled}
        style={{
          flex: 2,
          padding: 18,
          borderRadius: 14,
          background: primaryDisabled ? t.bgSoft : t.navy,
          color: primaryDisabled ? t.inkLight : '#fff',
          border: 'none',
          fontSize: 16,
          fontWeight: 700,
          cursor: primaryDisabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          boxShadow: primaryDisabled ? 'none' : '0 4px 14px rgba(15,35,64,0.25)',
        }}
      >
        <Check size={18} strokeWidth={2.5} /> {label}
      </button>
    </div>
  );
}
