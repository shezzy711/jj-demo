'use client';

import { useState } from 'react';
import { Package, Wrench, StickyNote, Send } from 'lucide-react';
import VoiceStep from '../steps/VoiceStep';
import WizardHeader from '../steps/WizardHeader';
import BigTile from '@/components/shared/BigTile';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { format } from '@/lib/i18n/translations';
import { theme as t } from '@/lib/theme';
import { SEEDED } from '@/lib/seededTranscripts';
import type { ParsedItem, Project, RequisitionState } from '@/lib/types/forms';

interface ReqFlowProps {
  req: RequisitionState;
  setReq: (val: RequisitionState) => void;
  project: Project;
  onClose: () => void;
}

export default function ReqFlow({ req, setReq, project, onClose }: ReqFlowProps) {
  const { t: tt, lang } = useLanguage();
  const [step, setStep] = useState<'home' | 'materials' | 'tools' | 'notes'>('home');

  if (step === 'materials') {
    return (
      <VoiceStep
        title={tt('req.materialsToOrder')}
        subtitle={tt('req.materials.subtitle')}
        mode="items"
        withSourceToggle
        seededItems={SEEDED.reqMaterials}
        existing={req.materials.length > 0 ? req.materials : null}
        onSave={val => {
          setReq({ ...req, materials: val as ParsedItem[] });
          setStep('home');
        }}
        onClose={() => setStep('home')}
      />
    );
  }
  if (step === 'tools') {
    return (
      <VoiceStep
        title={tt('req.toolsNeeded')}
        subtitle={tt('req.tools.subtitle')}
        mode="items"
        seededItems={SEEDED.reqTools}
        existing={req.tools.length > 0 ? req.tools : null}
        onSave={val => {
          setReq({ ...req, tools: val as ParsedItem[] });
          setStep('home');
        }}
        onClose={() => setStep('home')}
      />
    );
  }
  if (step === 'notes') {
    return (
      <VoiceStep
        title={tt('req.notesForOffice')}
        subtitle={tt('req.notes.subtitle')}
        mode="prose"
        seededTranscript={SEEDED.reqNotes[lang]}
        existing={req.notes}
        onSave={val => {
          setReq({ ...req, notes: val as string });
          setStep('home');
        }}
        onClose={() => setStep('home')}
      />
    );
  }

  const tiles = [
    { id: 'materials' as const, icon: Package,    label: tt('req.materialsToOrder'), done: req.materials.length > 0, primary: true },
    { id: 'tools'     as const, icon: Wrench,     label: tt('req.toolsNeeded'),      done: req.tools.length > 0, primary: true },
    { id: 'notes'     as const, icon: StickyNote, label: tt('req.notesForOffice'),   done: !!req.notes, primary: true },
  ];
  const hasAnything = tiles.some(tile => tile.done);

  return (
    <>
      <WizardHeader
        title={tt('req.title')}
        subtitle={format(tt('req.for'), { job: project.name })}
        onClose={onClose}
      />
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 22px 130px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 12 }}>
          {tiles.slice(0, 2).map(tile => (
            <BigTile key={tile.id} tile={tile} onClick={() => setStep(tile.id)} />
          ))}
        </div>
        <BigTile tile={tiles[2]} onClick={() => setStep(tiles[2].id)} full />
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
        <button
          disabled={!hasAnything}
          onClick={hasAnything ? onClose : undefined}
          style={{
            flex: 2,
            padding: 18,
            borderRadius: 14,
            background: hasAnything ? t.accent : t.bgSoft,
            color: hasAnything ? '#fff' : t.inkLight,
            border: 'none',
            fontSize: 15,
            fontWeight: 700,
            cursor: hasAnything ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: hasAnything ? '0 4px 14px rgba(200,85,61,0.35)' : 'none',
          }}
        >
          <Send size={16} strokeWidth={2.2} /> {tt('req.sendToOffice')}
        </button>
      </div>
    </>
  );
}
