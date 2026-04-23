'use client';

import { useState } from 'react';
import { Check, AlertCircle, Mic } from 'lucide-react';
import WizardHeader from './WizardHeader';
import WizardFooter from './WizardFooter';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { theme as t } from '@/lib/theme';
import { SEEDED } from '@/lib/seededTranscripts';
import type { ProblemNote } from '@/lib/types/forms';

interface ProblemsStepProps {
  existing?: ProblemNote | null;
  onSave: (val: ProblemNote) => void;
  onClose: () => void;
}

export default function ProblemsStep({ existing, onSave, onClose }: ProblemsStepProps) {
  const { t: tt, lang } = useLanguage();
  const [phase, setPhase] = useState<'choice' | 'capture' | 'review'>(
    existing == null ? 'choice' : existing.hasProblems ? 'review' : 'choice',
  );
  const [note, setNote] = useState(existing?.note || '');
  const [recording, setRecording] = useState(false);

  const handleNo = () => onSave({ hasProblems: false });
  const handleRelease = () => {
    setRecording(false);
    setNote(SEEDED.problemNote[lang]);
    setPhase('review');
  };

  return (
    <>
      <WizardHeader
        title={tt('foreman.problems.title')}
        subtitle={tt('foreman.problems.subtitle')}
        onClose={onClose}
      />
      <div style={{ flex: 1, overflow: 'auto', padding: '28px 22px 130px' }}>
        {phase === 'choice' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <button
              onClick={handleNo}
              style={{
                padding: 24,
                borderRadius: 22,
                background: t.success,
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                boxShadow: '0 8px 24px rgba(63,110,78,0.3)',
                textAlign: 'left',
                width: '100%',
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 18,
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Check size={30} strokeWidth={2.5} />
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>
                  {tt('foreman.problems.no')}
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 3 }}>
                  {tt('foreman.problems.noSub')}
                </div>
              </div>
            </button>

            <button
              onClick={() => setPhase('capture')}
              style={{
                padding: 24,
                borderRadius: 22,
                background: t.accent,
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                boxShadow: '0 8px 24px rgba(200,85,61,0.3)',
                textAlign: 'left',
                width: '100%',
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 18,
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <AlertCircle size={30} strokeWidth={2.5} />
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>
                  {tt('foreman.problems.yes')}
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 3 }}>
                  {tt('foreman.problems.yesSub')}
                </div>
              </div>
            </button>
          </div>
        )}

        {phase === 'capture' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 460,
              gap: 22,
            }}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: t.ink,
                textAlign: 'center',
                letterSpacing: '-0.015em',
              }}
            >
              {tt('foreman.problems.whatIs')}
            </div>
            <button
              onMouseDown={() => setRecording(true)}
              onMouseUp={handleRelease}
              onMouseLeave={() => recording && handleRelease()}
              onTouchStart={() => setRecording(true)}
              onTouchEnd={handleRelease}
              style={{
                width: 200,
                height: 200,
                borderRadius: 100,
                background: recording ? t.accent : t.navy,
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: recording
                  ? '0 0 0 14px rgba(200,85,61,0.2), 0 12px 36px rgba(200,85,61,0.45)'
                  : '0 14px 40px rgba(15,35,64,0.4)',
                position: 'relative',
              }}
            >
              <Mic size={80} strokeWidth={1.8} />
              {recording && (
                <span
                  className="ripple"
                  style={{
                    position: 'absolute',
                    inset: -10,
                    borderRadius: '50%',
                    border: '2.5px solid rgba(200,85,61,0.4)',
                  }}
                />
              )}
            </button>
            <div style={{ fontSize: 14, fontWeight: 700, color: t.inkMuted }}>
              {recording ? tt('common.listening') : tt('common.holdToTalk')}
            </div>
          </div>
        )}

        {phase === 'review' && (
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 14px',
                borderRadius: 999,
                background: t.successBg,
                color: t.success,
                fontSize: 12,
                fontWeight: 700,
                marginBottom: 14,
              }}
            >
              <Check size={13} strokeWidth={3} /> {tt('common.gotIt')}
            </div>
            <div
              style={{
                background: t.card,
                borderRadius: 16,
                padding: 20,
                border: `1px solid ${t.line}`,
                boxShadow: t.shadowSm,
              }}
            >
              <div style={{ fontSize: 15.5, lineHeight: 1.6, color: t.ink }}>{note}</div>
            </div>
          </div>
        )}
      </div>

      {phase === 'review' ? (
        <WizardFooter
          onClose={onClose}
          secondaryLabel={
            <>
              <Mic size={15} strokeWidth={2.2} /> {tt('common.tryAgain')}
            </>
          }
          onSecondary={() => { setNote(''); setPhase('capture'); }}
          primaryLabel={tt('common.save')}
          onPrimary={() => onSave({ hasProblems: true, note })}
        />
      ) : (
        <WizardFooter onClose={onClose} primaryDisabled primaryLabel={tt('common.save')} />
      )}
    </>
  );
}
