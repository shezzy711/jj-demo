'use client';

import { useRef, useState } from 'react';
import { Plus, Trash2, Coffee, Check, Send } from 'lucide-react';
import WizardHeader from '../steps/WizardHeader';
import BigChoice from './shared/BigChoice';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { theme as t } from '@/lib/theme';
import {
  RECENT_JOBS,
  TIME_PRESETS_IN,
  TIME_PRESETS_OUT,
  nextFridayISO,
  lastFridayISO,
} from '@/lib/recents';
import type { Employee, TimecardData, TimecardEntry } from '@/lib/types/forms';

interface TimecardWizardProps {
  user: Employee;
  onClose: () => void;
  onSubmit: (data: TimecardData) => void;
}

const DAYS = [
  { full: 'Monday',    short: 'Mon' },
  { full: 'Tuesday',   short: 'Tue' },
  { full: 'Wednesday', short: 'Wed' },
  { full: 'Thursday',  short: 'Thu' },
  { full: 'Friday',    short: 'Fri' },
  { full: 'Saturday',  short: 'Sat' },
  { full: 'Sunday',    short: 'Sun' },
];

function diffHours(timeIn: string, timeOut: string, lunch: boolean): number {
  if (!timeIn || !timeOut) return 0;
  const [hi, mi] = timeIn.split(':').map(Number);
  const [ho, mo] = timeOut.split(':').map(Number);
  let h = ho + mo / 60 - (hi + mi / 60);
  if (h < 0) h += 24;
  if (lunch) h -= 0.5;
  return Math.max(0, Math.round(h * 10) / 10);
}

const TOTAL_STEPS = 5;
const ADVANCE_DELAY = 280;

export default function TimecardWizard({ user, onClose, onSubmit }: TimecardWizardProps) {
  const { t: tt } = useLanguage();
  const [step, setStep] = useState(0);
  const [weekEnding, setWeekEnding] = useState(nextFridayISO());
  const [entries, setEntries] = useState<TimecardEntry[]>([]);
  const [day, setDay] = useState('');
  const [jobNum, setJobNum] = useState('');
  const [jobName, setJobName] = useState('');
  const [timeIn, setTimeIn] = useState('');
  const [timeOut, setTimeOut] = useState('');
  const [lunch, setLunch] = useState(true);

  const pendingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const advanceTo = (n: number) => {
    if (pendingRef.current) clearTimeout(pendingRef.current);
    pendingRef.current = setTimeout(() => setStep(n), ADVANCE_DELAY);
  };

  const back = () => {
    if (pendingRef.current) clearTimeout(pendingRef.current);
    if (step === 0) onClose();
    else setStep(s => s - 1);
  };

  // Bug fix: pass values explicitly so the timer's closure doesn't capture
  // stale state from before the tap that set them.
  const commit = (
    d: string,
    jn: string,
    jname: string,
    ti: string,
    to: string,
    l: boolean,
    w: string,
  ) => {
    const total = diffHours(ti, to, l);
    setEntries(prev => [...prev, {
      dayOfWeek: d,
      date: w,
      jobNumber: jn,
      jobName: jname,
      timeIn: ti,
      timeOut: to,
      lunch: l,
      totalHours: total,
    }]);
    setStep(4);
  };

  const addAnother = () => {
    setDay(''); setJobNum(''); setJobName(''); setTimeIn(''); setTimeOut(''); setLunch(true);
    setStep(1);
  };

  const submit = () => {
    onSubmit({
      employeeName: user.name,
      weekEnding,
      entries,
    });
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bg }}>
      <WizardHeader
        title={tt('home.tile.timecard')}
        step={step}
        totalSteps={TOTAL_STEPS}
        onClose={back}
      />
      <div style={{ flex: 1, overflow: 'auto', padding: '24px 22px 24px' }}>

        {step === 0 && (
          <Step title={tt('tc.whichWeek')}>
            <BigChoice
              columns={2}
              options={[
                { value: nextFridayISO(), label: tt('common.thisFriday') },
                { value: lastFridayISO(), label: tt('common.lastFriday') },
              ]}
              value={weekEnding}
              onChange={val => { setWeekEnding(val); advanceTo(1); }}
            />
          </Step>
        )}

        {step === 1 && (
          <Step title={tt('tc.whichDay')}>
            <BigChoice
              columns={2}
              options={DAYS.map(d => ({ value: d.full, label: d.full }))}
              value={day}
              onChange={val => { setDay(val); advanceTo(2); }}
            />
          </Step>
        )}

        {step === 2 && (
          <Step title={tt('tc.whichJob')}>
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
                advanceTo(3);
              }}
            />
          </Step>
        )}

        {step === 3 && (
          <Step title={tt('tc.whichHours')}>
            <Label text={tt('tc.timeIn')} />
            <BigChoice
              columns={4}
              options={TIME_PRESETS_IN}
              value={timeIn}
              onChange={val => {
                setTimeIn(val);
                if (val && timeOut) {
                  if (pendingRef.current) clearTimeout(pendingRef.current);
                  pendingRef.current = setTimeout(
                    () => commit(day, jobNum, jobName, val, timeOut, lunch, weekEnding),
                    ADVANCE_DELAY,
                  );
                }
              }}
            />
            <div style={{ height: 14 }} />
            <Label text={tt('tc.timeOut')} />
            <BigChoice
              columns={3}
              options={TIME_PRESETS_OUT}
              value={timeOut}
              onChange={val => {
                setTimeOut(val);
                if (val && timeIn) {
                  if (pendingRef.current) clearTimeout(pendingRef.current);
                  pendingRef.current = setTimeout(
                    () => commit(day, jobNum, jobName, timeIn, val, lunch, weekEnding),
                    ADVANCE_DELAY,
                  );
                }
              }}
            />
            <div style={{ height: 14 }} />
            <button
              onClick={() => {
                const next = !lunch;
                setLunch(next);
                // If both times are already chosen, re-schedule the commit with the
                // freshly-toggled lunch value so the entry's totalHours reflects it.
                if (timeIn && timeOut) {
                  if (pendingRef.current) clearTimeout(pendingRef.current);
                  pendingRef.current = setTimeout(
                    () => commit(day, jobNum, jobName, timeIn, timeOut, next, weekEnding),
                    ADVANCE_DELAY,
                  );
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 16px',
                width: '100%',
                background: lunch ? t.successBg : t.card,
                color: lunch ? t.success : t.ink,
                border: `1.5px solid ${lunch ? t.success : t.line}`,
                borderRadius: 14,
                cursor: 'pointer',
                fontSize: 14.5,
                fontWeight: 700,
                textAlign: 'left',
              }}
            >
              <Coffee size={18} />
              {lunch ? tt('tc.tookLunch') : tt('tc.noLunch')}
              {lunch && (
                <span style={{
                  marginLeft: 'auto',
                  fontSize: 12,
                  fontWeight: 700,
                  color: t.success,
                }}>−30 min</span>
              )}
            </button>
            {timeIn && timeOut && (
              <div style={{
                marginTop: 12,
                fontSize: 13,
                color: t.inkLight,
                textAlign: 'center',
              }}>
                {diffHours(timeIn, timeOut, lunch).toFixed(1)} h
              </div>
            )}
          </Step>
        )}

        {step === 4 && (
          <Step title={tt('tc.review')}>
            {entries.length === 0 && (
              <div style={{ fontSize: 13.5, color: t.inkLight, textAlign: 'center', padding: 20 }}>
                {tt('tc.empty')}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {entries.map((e, i) => (
                <EntryCard key={i} entry={e} onRemove={() => {
                  setEntries(prev => prev.filter((_, idx) => idx !== i));
                }} />
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
              <Plus size={16} strokeWidth={2.5} /> {tt('tc.addDay')}
            </button>
            <div style={{ height: 14 }} />
            <div style={{
              background: t.navy,
              color: '#fff',
              borderRadius: 14,
              padding: 16,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ fontSize: 13.5, fontWeight: 600 }}>{tt('tc.weekTotal')}</span>
              <span style={{
                fontSize: 22,
                fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
              }}>
                {entries.reduce((s, e) => s + e.totalHours, 0).toFixed(1)} h
              </span>
            </div>
          </Step>
        )}
      </div>

      {step === 4 && (
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

function EntryCard({ entry, onRemove }: { entry: TimecardEntry; onRemove: () => void }) {
  return (
    <div style={{
      background: t.card,
      border: `1px solid ${t.line}`,
      borderRadius: 14,
      padding: 14,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14.5, fontWeight: 700 }}>{entry.dayOfWeek}</div>
        <div style={{ fontSize: 12, color: t.inkLight, marginTop: 2 }}>
          {entry.jobName} · {entry.timeIn}–{entry.timeOut}
        </div>
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
        {entry.totalHours.toFixed(1)} h
      </div>
      <button
        onClick={onRemove}
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
  );
}

export function SubmitBar({
  disabled,
  onSubmit,
  label,
  icon,
}: {
  disabled: boolean;
  onSubmit: () => void;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <div style={{
      padding: '14px 22px 22px',
      background: t.card,
      borderTop: `1px solid ${t.line}`,
    }}>
      <button
        onClick={onSubmit}
        disabled={disabled}
        style={{
          width: '100%',
          padding: 18,
          borderRadius: 14,
          background: disabled ? t.bgSoft : t.accent,
          color: disabled ? t.inkLight : '#fff',
          border: 'none',
          fontSize: 16,
          fontWeight: 700,
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          boxShadow: disabled ? 'none' : '0 4px 14px rgba(200,85,61,0.35)',
        }}
      >
        {icon ?? <Send size={17} strokeWidth={2.5} />} {label}
      </button>
    </div>
  );
}
