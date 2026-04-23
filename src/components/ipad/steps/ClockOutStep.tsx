'use client';

import { useState } from 'react';
import { Coffee, X, Check, Pause } from 'lucide-react';
import WizardHeader from './WizardHeader';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { theme as t } from '@/lib/theme';

interface ClockOutStepProps {
  onClose: () => void;
}

export default function ClockOutStep({ onClose }: ClockOutStepProps) {
  const { t: tt } = useLanguage();
  const [lunch, setLunch] = useState<boolean | null>(null);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 40,
          gap: 22,
        }}
      >
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            background: t.success,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 14px 40px rgba(63,110,78,0.35)',
          }}
        >
          <Check size={56} color="#fff" strokeWidth={3} />
        </div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: '-0.025em',
            textAlign: 'center',
          }}
        >
          {tt('tech.seeYouTomorrow')}
        </div>
        <div
          style={{
            fontSize: 14,
            color: t.inkMuted,
            textAlign: 'center',
            maxWidth: 320,
            lineHeight: 1.5,
          }}
        >
          {tt('tech.hoursOnTimecard')}
        </div>
        <button
          onClick={onClose}
          style={{
            marginTop: 12,
            padding: '12px 22px',
            borderRadius: 12,
            background: t.card,
            border: `1.5px solid ${t.line}`,
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            color: t.ink,
          }}
        >
          {tt('common.home')}
        </button>
      </div>
    );
  }

  return (
    <>
      <WizardHeader
        title={tt('tech.clockingOut')}
        subtitle={tt('tech.lastQuestion')}
        onClose={onClose}
      />
      <div style={{ flex: 1, overflow: 'auto', padding: '28px 24px 130px' }}>
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: '-0.015em',
            marginBottom: 18,
          }}
        >
          {tt('tech.lunchQuestion')}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <button
            onClick={() => setLunch(true)}
            style={{
              padding: '28px 16px',
              borderRadius: 20,
              background: lunch === true ? t.navy : t.card,
              color: lunch === true ? '#fff' : t.ink,
              border: `1.5px solid ${lunch === true ? t.navy : t.line}`,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              boxShadow: lunch === true ? t.shadowMd : t.shadowSm,
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            <Coffee size={32} strokeWidth={1.8} />
            {tt('common.yes')}
          </button>
          <button
            onClick={() => setLunch(false)}
            style={{
              padding: '28px 16px',
              borderRadius: 20,
              background: lunch === false ? t.navy : t.card,
              color: lunch === false ? '#fff' : t.ink,
              border: `1.5px solid ${lunch === false ? t.navy : t.line}`,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              boxShadow: lunch === false ? t.shadowMd : t.shadowSm,
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            <X size={32} strokeWidth={2.2} />
            {tt('common.no')}
          </button>
        </div>
      </div>
      <div
        style={{
          padding: '14px 22px 22px',
          background: t.card,
          borderTop: `1px solid ${t.line}`,
          display: 'flex',
          gap: 10,
        }}
      >
        <button
          onClick={() => setDone(true)}
          disabled={lunch == null}
          style={{
            flex: 1,
            padding: 20,
            borderRadius: 14,
            background: lunch != null ? t.accent : t.bgSoft,
            color: lunch != null ? '#fff' : t.inkLight,
            border: 'none',
            fontSize: 16,
            fontWeight: 700,
            cursor: lunch != null ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            boxShadow: lunch != null ? '0 4px 14px rgba(200,85,61,0.35)' : 'none',
          }}
        >
          <Pause size={18} strokeWidth={2.5} /> {tt('tech.clockOut')}
        </button>
      </div>
    </>
  );
}
