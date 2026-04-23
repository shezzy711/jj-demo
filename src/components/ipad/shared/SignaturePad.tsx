'use client';

import { Check } from 'lucide-react';
import Pill from '@/components/shared/Pill';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { theme as t } from '@/lib/theme';

interface SignaturePadProps {
  label: string;
  signed: boolean;
  signer?: string | null;
  canSkip?: boolean;
  skipped?: boolean;
  onToggle: () => void;
  onSkip?: () => void;
}

export default function SignaturePad({
  label,
  signed,
  signer,
  canSkip,
  skipped,
  onToggle,
  onSkip,
}: SignaturePadProps) {
  const { t: tt } = useLanguage();
  return (
    <div
      style={{
        background: t.card,
        border: `1.5px solid ${signed ? t.success : t.line}`,
        borderRadius: 16,
        padding: 16,
        boxShadow: t.shadowSm,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
        }}
      >
        <div style={{ fontSize: 13.5, fontWeight: 700 }}>{label}</div>
        {signed && (
          <Pill tone="success">
            <Check size={11} strokeWidth={3} /> {tt('common.signed')}
          </Pill>
        )}
        {skipped && <Pill tone="outline">{tt('common.skipped')}</Pill>}
      </div>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          height: 90,
          background: skipped ? t.bgSoft : signed ? '#fff' : t.bg,
          borderRadius: 12,
          border: `1.5px dashed ${t.line}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        {signed && (
          <svg width="200" height="54" viewBox="0 0 200 60">
            <path
              d="M20,40 Q30,10 50,30 T100,25 Q120,15 140,35 T180,30"
              stroke={t.navy}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        )}
        {!signed && !skipped && (
          <div style={{ color: t.inkLight, fontSize: 13, fontWeight: 500 }}>{tt('common.tapAndSign')}</div>
        )}
        {skipped && (
          <div style={{ color: t.inkLight, fontSize: 13, fontWeight: 500 }}>{tt('signoff.noCustomerOnSite')}</div>
        )}
      </button>
      {signer && !skipped && (
        <div
          style={{
            fontSize: 11.5,
            color: t.inkLight,
            marginTop: 8,
            textAlign: 'right',
            fontWeight: 500,
          }}
        >
          {signer}
        </div>
      )}
      {canSkip && !signed && (
        <button
          onClick={onSkip}
          style={{
            marginTop: 10,
            padding: '9px 12px',
            borderRadius: 10,
            background: 'transparent',
            border: `1px solid ${t.line}`,
            fontSize: 12,
            cursor: 'pointer',
            color: t.inkMuted,
            width: '100%',
            fontWeight: 600,
          }}
        >
          {skipped ? tt('signoff.undoSkip') : tt('signoff.skipNoCustomer')}
        </button>
      )}
    </div>
  );
}
