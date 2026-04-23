'use client';

import { useState } from 'react';
import { Sun, CloudRain, Wind, AlertCircle, Check } from 'lucide-react';
import WizardHeader from '../steps/WizardHeader';
import WizardFooter from '../steps/WizardFooter';
import VoiceStep from '../steps/VoiceStep';
import PhotosStep from '../steps/PhotosStep';
import BigChoice from './shared/BigChoice';
import StepDots from './shared/StepDots';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { theme as t } from '@/lib/theme';
import {
  RECENT_JOBS,
  TIME_PRESETS_IN,
  TIME_PRESETS_OUT,
  TEMP_PRESETS,
  todayISO,
} from '@/lib/recents';
import { SEEDED } from '@/lib/seededTranscripts';
import type {
  Employee,
  ParsedItem,
  WorkOrderData,
  WorkOrderFormType,
  WorkOrderWeather,
  WorkOrderMaterial,
} from '@/lib/types/forms';

interface WorkOrderWizardProps {
  user: Employee;
  onClose: () => void;
  onSubmit: (data: WorkOrderData) => void;
}

const TOTAL_STEPS = 7;

export default function WorkOrderWizard({ user, onClose, onSubmit }: WorkOrderWizardProps) {
  const { t: tt, lang } = useLanguage();
  const [step, setStep] = useState(0);

  const [formType, setFormType] = useState<WorkOrderFormType>('work-order');
  const [jobNum, setJobNum] = useState('');
  const [projectName, setProjectName] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState(todayISO());
  const [timeIn, setTimeIn] = useState('');
  const [timeOut, setTimeOut] = useState('');
  const [weather, setWeather] = useState<WorkOrderWeather | undefined>(undefined);
  const [temp, setTemp] = useState('');
  const [scope, setScope] = useState('');
  const [materials, setMaterials] = useState<ParsedItem[]>([]);
  const [photos, setPhotos] = useState<{ caption: string; seed: number }[]>([]);
  const [hasProblems, setHasProblems] = useState<boolean | null>(null);

  const pickJob = (num: string) => {
    const j = RECENT_JOBS.find(x => x.number === num);
    setJobNum(num);
    setProjectName(j?.name ?? '');
    setAddress(j?.address ?? '');
  };

  const submit = () => {
    const wMaterials: WorkOrderMaterial[] = materials.map(m => ({
      quantity: m.qty,
      description: m.name,
      amount: m.amount ?? 0,
    }));
    onSubmit({
      formType,
      jobNumber: jobNum,
      date,
      projectName,
      projectAddress: address,
      siteContact: '',
      technician: user.name,
      timeIn,
      timeOut,
      weather,
      temperature: temp,
      scopeOfWork: scope,
      materials: wMaterials,
      labor: [{
        date,
        technician: user.name,
        hours: 8,
        rate: user.rate,
      }],
      hasProblems: !!hasProblems,
      problemDescription: hasProblems ? SEEDED.problemNote[lang] : '',
    });
  };

  // VoiceStep / PhotosStep render their own headers.
  if (step === 3) {
    return (
      <VoiceStep
        title={tt('wo.scopeTitle')}
        subtitle={tt('wo.scopeSub')}
        mode="prose"
        seededTranscript={SEEDED.scope[lang]}
        existing={scope || null}
        onSave={val => { setScope(val as string); setStep(4); }}
        onClose={() => setStep(2)}
      />
    );
  }
  if (step === 4) {
    return (
      <VoiceStep
        title={tt('wo.materialsTitle')}
        subtitle={tt('wo.materialsSub')}
        mode="items"
        withAmount
        seededItems={SEEDED.dwoMaterials}
        existing={materials.length > 0 ? materials : null}
        onSave={val => { setMaterials(val as ParsedItem[]); setStep(5); }}
        onClose={() => setStep(3)}
      />
    );
  }
  if (step === 5) {
    return (
      <PhotosStep
        existing={photos}
        onSave={val => { setPhotos(val); setStep(6); }}
        onClose={() => setStep(4)}
      />
    );
  }

  const canNext = (() => {
    switch (step) {
      case 0: return !!jobNum;
      case 1: return !!date;
      case 2: return !!timeIn && !!timeOut && !!weather && !!temp;
      case 6: return hasProblems !== null;
      default: return true;
    }
  })();

  const goNext = () => {
    if (step === 6) { submit(); return; }
    setStep(s => s + 1);
  };
  const goBack = () => {
    if (step === 0) onClose();
    else setStep(s => s - 1);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
      <WizardHeader
        title={tt('home.tile.workorder')}
        subtitle={`${tt('common.step')} ${step + 1} ${tt('common.of')} ${TOTAL_STEPS}`}
        onClose={goBack}
      />
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 22px 130px' }}>
        <StepDots current={step} total={TOTAL_STEPS} />

        {step === 0 && (
          <Step title={tt('wo.whichJob')}>
            <Label text={tt('wo.formType')} />
            <BigChoice
              columns={3}
              options={[
                { value: 'work-order',   label: tt('wo.type.workOrder') },
                { value: 'change-order', label: tt('wo.type.changeOrder') },
                { value: 'estimate',     label: tt('wo.type.estimate') },
              ]}
              value={formType}
              onChange={v => setFormType(v as WorkOrderFormType)}
            />
            <div style={{ height: 18 }} />
            <Label text={tt('common.job')} />
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
          <Step title={tt('wo.whichDay')}>
            <BigChoice
              columns={2}
              options={[
                { value: todayISO(), label: tt('common.today') },
              ]}
              value={date}
              onChange={setDate}
            />
            <div style={{ height: 14 }} />
            <Label text={tt('wo.tech')} />
            <div
              style={{
                background: t.card,
                border: `1.5px solid ${t.line}`,
                borderRadius: 14,
                padding: '14px 16px',
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              {user.name}
            </div>
          </Step>
        )}

        {step === 2 && (
          <Step title={tt('wo.timeWeather')}>
            <Label text={tt('wo.timeIn')} />
            <BigChoice
              columns={4}
              options={TIME_PRESETS_IN}
              value={timeIn}
              onChange={setTimeIn}
            />
            <div style={{ height: 14 }} />
            <Label text={tt('wo.timeOut')} />
            <BigChoice
              columns={3}
              options={TIME_PRESETS_OUT}
              value={timeOut}
              onChange={setTimeOut}
            />
            <div style={{ height: 14 }} />
            <Label text={tt('wo.weather')} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {([
                { value: 'sunny', label: tt('common.weatherSunny'), Icon: Sun,       color: '#D97706' },
                { value: 'rainy', label: tt('common.weatherRainy'), Icon: CloudRain, color: '#0369A1' },
                { value: 'windy', label: 'Windy',                   Icon: Wind,      color: '#525252' },
              ] as const).map(opt => {
                const sel = weather === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setWeather(opt.value as WorkOrderWeather)}
                    style={{
                      padding: '14px 12px',
                      minHeight: 70,
                      borderRadius: 14,
                      background: sel ? t.navy : t.card,
                      color: sel ? '#fff' : t.ink,
                      border: `1.5px solid ${sel ? t.navy : t.line}`,
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: 700,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <opt.Icon size={22} color={sel ? '#fff' : opt.color} strokeWidth={2} />
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <div style={{ height: 14 }} />
            <Label text={tt('wo.temperature')} />
            <BigChoice
              columns={4}
              options={TEMP_PRESETS.slice(0, 4)}
              value={temp}
              onChange={setTemp}
            />
          </Step>
        )}

        {step === 6 && (
          <Step title={tt('wo.anyProblems')}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button
                onClick={() => setHasProblems(false)}
                style={{
                  padding: 22,
                  borderRadius: 18,
                  background: hasProblems === false ? t.success : t.card,
                  color: hasProblems === false ? '#fff' : t.ink,
                  border: `1.5px solid ${hasProblems === false ? t.success : t.line}`,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  textAlign: 'left',
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                <Check size={24} strokeWidth={2.5} />
                {tt('wo.noProblems')}
              </button>
              <button
                onClick={() => setHasProblems(true)}
                style={{
                  padding: 22,
                  borderRadius: 18,
                  background: hasProblems === true ? t.accent : t.card,
                  color: hasProblems === true ? '#fff' : t.ink,
                  border: `1.5px solid ${hasProblems === true ? t.accent : t.line}`,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  textAlign: 'left',
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                <AlertCircle size={24} strokeWidth={2.5} />
                {tt('wo.yesProblems')}
              </button>
            </div>
          </Step>
        )}
      </div>
      <WizardFooter
        onClose={goBack}
        primaryLabel={step === 6 ? tt('common.submit') : tt('common.next')}
        onPrimary={goNext}
        primaryDisabled={!canNext}
        secondaryLabel={step === 0 ? undefined : <>{tt('common.back')}</>}
        onSecondary={step === 0 ? undefined : goBack}
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

function Label({ text }: { text: string }) {
  return (
    <div style={{
      fontSize: 11,
      fontWeight: 700,
      color: t.inkMuted,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      marginBottom: 8,
    }}>{text}</div>
  );
}
