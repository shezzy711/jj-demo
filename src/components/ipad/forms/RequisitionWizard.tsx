'use client';

import { useState } from 'react';
import WizardHeader from '../steps/WizardHeader';
import WizardFooter from '../steps/WizardFooter';
import VoiceStep from '../steps/VoiceStep';
import BigChoice from './shared/BigChoice';
import StepDots from './shared/StepDots';
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

const FOREMEN = employees.filter(e => e.role === 'Foreman');

export default function RequisitionWizard({ user: _user, onClose, onSubmit }: RequisitionWizardProps) {
  const { t: tt, lang } = useLanguage();
  const [step, setStep] = useState(0);

  const [jobNum, setJobNum] = useState('');
  const [jobName, setJobName] = useState('');
  const [address, setAddress] = useState('');
  const [origDate, setOrigDate] = useState(todayISO());
  const [startDate, setStartDate] = useState(tomorrowISO());
  const [foreman, setForeman] = useState('');
  const [materials, setMaterials] = useState<ParsedItem[]>([]);
  const [tools, setTools] = useState<ParsedItem[]>([]);
  const [notes, setNotes] = useState('');

  const pickJob = (num: string) => {
    const j = RECENT_JOBS.find(x => x.number === num);
    setJobNum(num);
    setJobName(j?.name ?? '');
    setAddress(j?.address ?? '');
  };

  const submit = () => {
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
      originationDate: origDate,
      projectStartDate: startDate,
      projectAddress: address,
      foremanLead: foreman,
      materials: matsForReport,
      tools: toolsForReport,
      notes,
    });
  };

  // Steps using VoiceStep render their own header — wrap them differently.
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
        onSave={val => { setNotes(val as string); submit(); }}
        onClose={() => setStep(3)}
      />
    );
  }

  const canNext = (() => {
    switch (step) {
      case 0: return !!jobNum;
      case 1: return !!foreman;
      default: return true;
    }
  })();

  const goNext = () => setStep(s => s + 1);
  const goBack = () => {
    if (step === 0) onClose();
    else setStep(s => s - 1);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
      <WizardHeader
        title={tt('home.tile.requisition')}
        subtitle={`${tt('common.step')} ${step + 1} ${tt('common.of')} ${TOTAL_STEPS}`}
        onClose={goBack}
      />
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 22px 130px' }}>
        <StepDots current={step} total={TOTAL_STEPS} />

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
              onChange={pickJob}
            />
          </Step>
        )}

        {step === 1 && (
          <Step title={tt('req.whichForeman')}>
            <BigChoice
              columns={2}
              options={FOREMEN.map(f => ({ value: f.name, label: f.name }))}
              value={foreman}
              onChange={setForeman}
            />
          </Step>
        )}
      </div>
      <WizardFooter
        onClose={goBack}
        primaryLabel={tt('common.next')}
        onPrimary={goNext}
        primaryDisabled={!canNext}
        secondaryLabel={<>{tt('common.back')}</>}
        onSecondary={goBack}
      />
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
