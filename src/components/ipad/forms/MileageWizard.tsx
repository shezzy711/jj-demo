'use client';

import { useRef, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import WizardHeader from '../steps/WizardHeader';
import BigChoice from './shared/BigChoice';
import { SubmitBar } from './TimecardWizard';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { theme as t } from '@/lib/theme';
import {
  RECENT_LOCATIONS,
  nextFridayISO,
  lastFridayISO,
  todayISO,
  yesterdayISO,
  mileageBetween,
} from '@/lib/recents';
import { MILEAGE_RATE } from '@/lib/types/forms';
import type { Employee, MileageData, MileageEntry } from '@/lib/types/forms';

interface MileageWizardProps {
  user: Employee;
  onClose: () => void;
  onSubmit: (data: MileageData) => void;
}

const TOTAL_STEPS = 4;
const ADVANCE_DELAY = 280;

export default function MileageWizard({ user, onClose, onSubmit }: MileageWizardProps) {
  const { t: tt } = useLanguage();
  const [step, setStep] = useState(0);
  const [weekEnding, setWeekEnding] = useState(nextFridayISO());
  const [entries, setEntries] = useState<MileageEntry[]>([]);
  const [date, setDate] = useState(todayISO());
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [miles, setMiles] = useState(0);

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

  // Bug fix: pass values explicitly so the timer's closure doesn't capture
  // stale state from the render before the tap that set them.
  const commit = (s: string, e: string, m: number, d: string) => {
    setEntries(prev => [...prev, {
      date: d,
      startLocation: s,
      endLocation: e,
      totalMiles: m,
    }]);
    setStep(3);
  };

  const addAnother = () => {
    setStart(''); setEnd(''); setMiles(0); setDate(todayISO());
    setStep(1);
  };

  const submit = () => {
    onSubmit({ employeeName: user.name, weekEnding, entries });
  };

  const total = entries.reduce((s, e) => s + e.totalMiles, 0);
  const reimburse = Math.round(total * MILEAGE_RATE * 100) / 100;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
      <WizardHeader
        title={tt('home.tile.mileage')}
        step={step}
        totalSteps={TOTAL_STEPS}
        onClose={back}
      />
      <div style={{ flex: 1, overflow: 'auto', padding: '24px 22px 24px' }}>

        {step === 0 && (
          <Step title={tt('mi.whichWeek')}>
            <BigChoice
              columns={2}
              options={[
                { value: nextFridayISO(), label: tt('common.thisFriday') },
                { value: lastFridayISO(), label: tt('common.lastFriday') },
              ]}
              value={weekEnding}
              onChange={val => { setWeekEnding(val); scheduleAdvance(() => setStep(1)); }}
            />
          </Step>
        )}

        {step === 1 && (
          <Step title={tt('mi.whichDay')}>
            <BigChoice
              columns={2}
              options={[
                { value: todayISO(),     label: tt('common.today') },
                { value: yesterdayISO(), label: tt('common.yesterday') },
              ]}
              value={date}
              onChange={val => { setDate(val); scheduleAdvance(() => setStep(2)); }}
            />
          </Step>
        )}

        {step === 2 && (
          <Step title={tt('mi.tripDetails')}>
            <Label text={tt('mi.from')} />
            <BigChoice
              columns={1}
              options={RECENT_LOCATIONS.map(loc => ({ value: loc, label: loc }))}
              value={start}
              onChange={val => {
                setStart(val);
                if (val && end) {
                  const m = mileageBetween(val, end);
                  setMiles(m);
                  scheduleAdvance(() => commit(val, end, m, date));
                }
              }}
            />
            <div style={{ height: 14 }} />
            <Label text={tt('mi.to')} />
            <BigChoice
              columns={1}
              options={RECENT_LOCATIONS.map(loc => ({ value: loc, label: loc }))}
              value={end}
              onChange={val => {
                setEnd(val);
                if (start && val) {
                  const m = mileageBetween(start, val);
                  setMiles(m);
                  scheduleAdvance(() => commit(start, val, m, date));
                }
              }}
            />
            {start && end && miles > 0 && (
              <div style={{
                marginTop: 14,
                fontSize: 13,
                color: t.inkLight,
                textAlign: 'center',
              }}>
                ≈ {miles} mi
              </div>
            )}
          </Step>
        )}

        {step === 3 && (
          <Step title={tt('mi.review')}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {entries.map((e, i) => (
                <div key={i} style={{
                  background: t.card,
                  border: `1px solid ${t.line}`,
                  borderRadius: 14,
                  padding: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: t.inkLight }}>{e.date}</div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, marginTop: 2 }}>
                      {e.startLocation}
                    </div>
                    <div style={{ fontSize: 12.5, color: t.inkLight }}>→ {e.endLocation}</div>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                    {e.totalMiles} mi
                  </div>
                  <button
                    onClick={() => setEntries(prev => prev.filter((_, idx) => idx !== i))}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      background: t.bg,
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Trash2 size={14} color={t.inkMuted} />
                  </button>
                </div>
              ))}
            </div>
            <div style={{ height: 14 }} />
            <button
              onClick={addAnother}
              style={{
                width: '100%',
                padding: 14,
                borderRadius: 14,
                background: t.card,
                border: `1.5px dashed ${t.lineStrong}`,
                cursor: 'pointer',
                color: t.ink,
                fontSize: 14.5,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Plus size={16} strokeWidth={2.5} /> {tt('mi.addLeg')}
            </button>
            <div style={{ height: 14 }} />
            <div style={{
              background: t.navy,
              color: '#fff',
              borderRadius: 14,
              padding: 16,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 13.5, fontWeight: 600 }}>{tt('mi.totalMiles')}</span>
                <span style={{ fontSize: 18, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                  {total.toFixed(1)} mi
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 13.5, fontWeight: 600, opacity: 0.85 }}>
                  {tt('mi.reimbursement')}
                </span>
                <span style={{ fontSize: 22, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                  ${reimburse.toFixed(2)}
                </span>
              </div>
            </div>
          </Step>
        )}
      </div>

      {step === 3 && (
        <SubmitBar disabled={entries.length === 0} onSubmit={submit} label={tt('common.submit')} />
      )}
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
