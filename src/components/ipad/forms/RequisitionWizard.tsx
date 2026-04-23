'use client';

import { useRef, useState } from 'react';
import WizardHeader from '../steps/WizardHeader';
import VoiceStep from '../steps/VoiceStep';
import BigChoice from './shared/BigChoice';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { theme as t } from '@/lib/theme';
import { RECENT_JOBS, todayISO, tomorrowISO } from '@/lib/recents';
import { SEEDED } from '@/lib/seededTranscripts';
import { employees } from '@/lib/sampleData';
import type {
  Employee,
  ParsedItem,
  RequisitionData,
  MaterialItem,
  ToolItem,
} from '@/lib/types/forms';

interface RequisitionWizardProps {
  user: Employee;
  onClose: () => void;
  onSubmit: (data: RequisitionData) => void;
}

const TOTAL_STEPS = 5;
const ADVANCE_DELAY = 280;

const FOREMEN = employees.filter(e => e.role === 'Foreman');

export default function RequisitionWizard({ user: _user, onClose, onSubmit }: RequisitionWizardProps) {
  const { t: tt, lang } = useLanguage();
  const [step, setStep] = useState(0);

  const [jobNum, setJobNum] = useState('');
  const [jobName, setJobName] = useState('');
  const [address, setAddress] = useState('');
  const [foreman, setForeman] = useState('');
  const [materials, setMaterials] = useState<ParsedItem[]>([]);
  const [tools, setTools] = useState<ParsedItem[]>([]);
  const [notes, setNotes] = useState('');

  const pendingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scheduleAdvance = (fn: () => void) => {
    if (pendingRef.current) clearTimeout(pendingRef.current);
    pendingRef.current = setTimeout(fn, ADVANCE_DELAY);
  };

  const back = () => {
    if (pendingRef.current) clearTimeout(pendingRef.current);
    if (step === 0) onClose();
    else setStep(s => s - 1);
  };

  const submit = (latestNotes?: string) => {
    const matsForReport: MaterialItem[] = materials.map(m => ({
      quantity: m.qty,
      source: m.source === 'shop' ? 'inventory' : 'order',
      supplier: m.supplier ?? '',
      description: m.name,
    }));
    const toolsForReport: ToolItem[] = tools.map(tool => ({
      quantity: tool.qty,
      source: 'inventory',
      supplier: tool.supplier ?? 'Shop',
      description: tool.name,
    }));
    onSubmit({
      jobNumber: jobNum,
      jobName,
      originationDate: todayISO(),
      projectStartDate: tomorrowISO(),
      projectAddress: address,
      foremanLead: foreman,
      materials: matsForReport,
      tools: toolsForReport,
      notes: latestNotes ?? notes,
    });
  };

  // Voice steps render their own UI (header + footer)
  if (step === 2) {
    return (
      <VoiceStep
        title={tt('req.materials')}
        subtitle={tt('req.materials.sub')}
        mode="items"
        withSourceToggle
        seededItems={SEEDED.reqMaterials}
        existing={materials.length > 0 ? materials : null}
        onSave={val => { setMaterials(val as ParsedItem[]); setStep(3); }}
        onClose={() => setStep(1)}
      />
    );
  }
  if (step === 3) {
    return (
      <VoiceStep
        title={tt('req.tools')}
        subtitle={tt('req.tools.sub')}
        mode="items"
        seededItems={SEEDED.reqTools}
        existing={tools.length > 0 ? tools : null}
        onSave={val => { setTools(val as ParsedItem[]); setStep(4); }}
        onClose={() => setStep(2)}
      />
    );
  }
  if (step === 4) {
    return (
      <VoiceStep
        title={tt('req.notes')}
        subtitle={tt('req.notes.sub')}
        mode="prose"
        seededTranscript={SEEDED.reqNotes[lang]}
        existing={notes || null}
        onSave={val => {
          const next = val as string;
          setNotes(next);
          submit(next);
        }}
        onClose={() => setStep(3)}
      />
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
      <WizardHeader
        title={tt('home.tile.requisition')}
        step={step}
        totalSteps={TOTAL_STEPS}
        onClose={back}
      />
      <div style={{ flex: 1, overflow: 'auto', padding: '24px 22px 24px' }}>
        {step === 0 && (
          <Step title={tt('req.whichJob')}>
            <BigChoice
              columns={1}
              options={RECENT_JOBS.map(j => ({
                value: j.number,
                label: j.name,
                sublabel: `#${j.number}`,
              }))}
              value={jobNum}
              onChange={val => {
                const j = RECENT_JOBS.find(x => x.number === val);
                setJobNum(val);
                setJobName(j?.name ?? '');
                setAddress(j?.address ?? '');
                scheduleAdvance(() => setStep(1));
              }}
            />
          </Step>
        )}

        {step === 1 && (
          <Step title={tt('req.whichForeman')}>
            <BigChoice
              columns={2}
              options={FOREMEN.map(f => ({ value: f.name, label: f.name }))}
              value={foreman}
              onChange={val => { setForeman(val); scheduleAdvance(() => setStep(2)); }}
            />
          </Step>
        )}
      </div>
    </div>
  );
}

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <h2 style={{
        fontSize: 22,
        fontWeight: 700,
        letterSpacing: '-0.02em',
        margin: '0 0 18px 0',
        lineHeight: 1.2,
      }}>{title}</h2>
      {children}
    </>
  );
}
