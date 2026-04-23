'use client';

import { useState } from 'react';
import { Mic, Edit3, Check } from 'lucide-react';
import WizardHeader from './WizardHeader';
import WizardFooter from './WizardFooter';
import MaterialRow from '../shared/MaterialRow';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { format } from '@/lib/i18n/translations';
import { theme as t } from '@/lib/theme';
import type { ParsedItem } from '@/lib/types/forms';

interface VoiceStepProps {
  title: string;
  subtitle: string;
  mode: 'prose' | 'items';
  seededTranscript?: string;
  seededItems?: ParsedItem[];
  existing?: string | ParsedItem[] | null;
  withAmount?: boolean;
  withSourceToggle?: boolean;
  onSave: (val: string | ParsedItem[]) => void;
  onClose: () => void;
}

export default function VoiceStep({
  title,
  subtitle,
  mode,
  seededTranscript,
  seededItems,
  existing,
  withAmount,
  withSourceToggle,
  onSave,
  onClose,
}: VoiceStepProps) {
  const { t: tt } = useLanguage();
  const hasExisting = existing != null && (typeof existing === 'string' ? existing.length > 0 : existing.length > 0);
  const [phase, setPhase] = useState<'capture' | 'review'>(hasExisting ? 'review' : 'capture');
  const [recording, setRecording] = useState(false);
  const [prose, setProse] = useState<string>(typeof existing === 'string' ? existing : '');
  const [items, setItems] = useState<ParsedItem[]>(Array.isArray(existing) ? existing : []);
  const [editingProse, setEditingProse] = useState(false);

  const handleRelease = () => {
    setRecording(false);
    if (mode === 'prose' && seededTranscript) setProse(seededTranscript);
    else if (mode === 'items' && seededItems) setItems(seededItems);
    setPhase('review');
  };
  const handleRedo = () => {
    setPhase('capture');
    setRecording(false);
    if (mode === 'prose') setProse('');
    else setItems([]);
  };
  const handleSave = () => {
    if (mode === 'prose') onSave(prose);
    else onSave(items);
  };

  return (
    <>
      <WizardHeader
        title={title}
        subtitle={phase === 'capture' ? subtitle : tt('common.gotIt')}
        onClose={onClose}
      />
      <div style={{ flex: 1, overflow: 'auto', padding: '24px 22px 130px' }}>
        {phase === 'capture' ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 460,
              gap: 24,
            }}
          >
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
                  ? '0 0 0 14px rgba(200,85,61,0.2), 0 0 0 28px rgba(200,85,61,0.1), 0 12px 36px rgba(200,85,61,0.45)'
                  : '0 14px 40px rgba(15,35,64,0.4)',
                transition: 'background 0.2s, box-shadow 0.2s',
                position: 'relative',
              }}
            >
              <Mic size={80} strokeWidth={1.8} />
              {recording && (
                <>
                  <span
                    className="ripple"
                    style={{
                      position: 'absolute',
                      inset: -10,
                      borderRadius: '50%',
                      border: '2.5px solid rgba(200,85,61,0.4)',
                    }}
                  />
                  <span
                    className="ripple-delayed"
                    style={{
                      position: 'absolute',
                      inset: -22,
                      borderRadius: '50%',
                      border: '2.5px solid rgba(200,85,61,0.25)',
                    }}
                  />
                </>
              )}
            </button>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: t.ink,
                textAlign: 'center',
                letterSpacing: '-0.015em',
              }}
            >
              {recording ? tt('common.listening') : tt('common.holdToTalk')}
            </div>
          </div>
        ) : (
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
                marginBottom: 16,
              }}
            >
              <Check size={13} strokeWidth={3} />
              {mode === 'prose' ? tt('common.gotIt') : format(tt('foreman.parsedItems'), { n: items.length })}
            </div>

            {mode === 'prose' && (
              <div
                style={{
                  background: t.card,
                  borderRadius: 16,
                  padding: 20,
                  border: `1px solid ${t.line}`,
                  boxShadow: t.shadowSm,
                  position: 'relative',
                }}
              >
                {editingProse ? (
                  <textarea
                    value={prose}
                    onChange={e => setProse(e.target.value)}
                    autoFocus
                    style={{
                      width: '100%',
                      minHeight: 180,
                      border: 'none',
                      background: 'transparent',
                      fontSize: 15.5,
                      color: t.ink,
                      resize: 'none',
                      outline: 'none',
                      lineHeight: 1.6,
                    }}
                  />
                ) : (
                  <div style={{ fontSize: 15.5, lineHeight: 1.6, color: t.ink, paddingRight: 36 }}>
                    {prose}
                  </div>
                )}
                <button
                  onClick={() => setEditingProse(!editingProse)}
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: t.bg,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Edit3 size={15} color={t.inkMuted} strokeWidth={2} />
                </button>
              </div>
            )}

            {mode === 'items' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {items.map((item, i) => (
                  <MaterialRow
                    key={i}
                    item={item}
                    withAmount={withAmount}
                    sourceToggle={withSourceToggle}
                    onUpdate={next => setItems(items.map((it, idx) => (idx === i ? next : it)))}
                    onRemove={() => setItems(items.filter((_, idx) => idx !== i))}
                    onSourceToggle={() =>
                      setItems(
                        items.map((it, idx) =>
                          idx === i ? { ...it, source: it.source === 'shop' ? 'order' : 'shop' } : it,
                        ),
                      )
                    }
                  />
                ))}
              </div>
            )}
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
          onSecondary={handleRedo}
          primaryLabel={tt('common.save')}
          onPrimary={handleSave}
        />
      ) : (
        <WizardFooter onClose={onClose} primaryLabel={tt('common.save')} primaryDisabled />
      )}
    </>
  );
}
