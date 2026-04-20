'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useWizard } from '@/hooks/useWizard';
import WizardShell from '@/components/wizard/WizardShell';
import TimecardReport from '@/components/report/TimecardReport';
import SelectPicker from '@/components/ui/SelectPicker';
import DatePicker from '@/components/ui/DatePicker';
import TimePicker from '@/components/ui/TimePicker';
import TextInput from '@/components/ui/TextInput';
import QuickPick from '@/components/ui/QuickPick';
import BigButton from '@/components/ui/BigButton';
import { EMPLOYEES, type TimecardData, type TimecardEntry } from '@/lib/types/forms';
import { calculateDailyHours, formatHours } from '@/lib/utils/calculations';
import { sampleTimecard } from '@/lib/sampleData';
import {
  RECENT_JOBS,
  TIME_PRESETS_IN,
  TIME_PRESETS_OUT,
  nextFridayISO,
  lastFridayISO,
} from '@/lib/recents';
import { Plus, Sparkles, Check, Pencil, Trash2 } from 'lucide-react';

const TOTAL_STEPS = 5;

const initialData: TimecardData = {
  employeeName: '',
  weekEnding: nextFridayISO(),
  entries: [],
};

// Per-pass entry shell — dayOfWeek is stored in selectedDays separately
type EntryDraft = Omit<TimecardEntry, 'dayOfWeek' | 'date' | 'totalHours'>;

const blankDraft: EntryDraft = {
  jobNumber: '',
  jobName: '',
  timeIn: '',
  timeOut: '',
  lunch: true, // default to true — most days include lunch
};

const DAYS = [
  { key: 'day.monday', value: 'Monday' },
  { key: 'day.tuesday', value: 'Tuesday' },
  { key: 'day.wednesday', value: 'Wednesday' },
  { key: 'day.thursday', value: 'Thursday' },
  { key: 'day.friday', value: 'Friday' },
  { key: 'day.saturday', value: 'Saturday' },
  { key: 'day.sunday', value: 'Sunday' },
];

function formatWeekChip(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function TimecardWizard() {
  const { t } = useLanguage();
  const wizard = useWizard<TimecardData>(initialData, TOTAL_STEPS);

  const [draft, setDraft] = useState<EntryDraft>({ ...blankDraft });
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [carriedOver, setCarriedOver] = useState(false);

  const isEditing = editingIndex !== null;

  const loggedDays = new Set(wizard.formData.entries.map(e => e.dayOfWeek));

  const updateDraft = <K extends keyof EntryDraft>(key: K, value: EntryDraft[K]) => {
    setDraft(prev => ({ ...prev, [key]: value }));
  };

  const pickJob = (number: string) => {
    const job = RECENT_JOBS.find(j => j.number === number);
    setDraft(prev => ({
      ...prev,
      jobNumber: job ? job.number : number,
      jobName: job ? job.name : prev.jobName,
    }));
  };

  const toggleDay = (day: string) => {
    if (isEditing) {
      // single-select while editing
      setSelectedDays([day]);
      return;
    }
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const commitEntries = () => {
    const totalHours = calculateDailyHours(draft.timeIn, draft.timeOut, draft.lunch);
    const baseEntry = (day: string): TimecardEntry => ({
      dayOfWeek: day,
      date: wizard.formData.weekEnding,
      jobNumber: draft.jobNumber,
      jobName: draft.jobName,
      timeIn: draft.timeIn,
      timeOut: draft.timeOut,
      lunch: draft.lunch,
      totalHours,
    });

    if (isEditing && selectedDays[0]) {
      const updated = [...wizard.formData.entries];
      updated[editingIndex!] = baseEntry(selectedDays[0]);
      wizard.setFormData(prev => ({ ...prev, entries: updated }));
    } else {
      const newEntries = selectedDays.map(baseEntry);
      wizard.setFormData(prev => ({ ...prev, entries: [...prev.entries, ...newEntries] }));
    }

    resetPass();
  };

  const resetPass = () => {
    setDraft({ ...blankDraft });
    setSelectedDays([]);
    setEditingIndex(null);
    setCarriedOver(false);
  };

  const startAddAnother = () => {
    // Carry over the last entry's job/time/lunch — most plumbers repeat
    const last = wizard.formData.entries[wizard.formData.entries.length - 1];
    if (last) {
      setDraft({
        jobNumber: last.jobNumber,
        jobName: last.jobName,
        timeIn: last.timeIn,
        timeOut: last.timeOut,
        lunch: last.lunch,
      });
      setCarriedOver(true);
    } else {
      setDraft({ ...blankDraft });
    }
    setSelectedDays([]);
    setEditingIndex(null);
    wizard.goToStep(1);
  };

  const startEdit = (i: number) => {
    const entry = wizard.formData.entries[i];
    setDraft({
      jobNumber: entry.jobNumber,
      jobName: entry.jobName,
      timeIn: entry.timeIn,
      timeOut: entry.timeOut,
      lunch: entry.lunch,
    });
    setSelectedDays([entry.dayOfWeek]);
    setEditingIndex(i);
    setCarriedOver(false);
    wizard.goToStep(1);
  };

  const deleteEntry = (i: number) => {
    wizard.setFormData(prev => ({
      ...prev,
      entries: prev.entries.filter((_, idx) => idx !== i),
    }));
  };

  const loadSample = () => {
    wizard.setFormData(sampleTimecard);
    wizard.setIsComplete(true);
  };

  const canProceed = () => {
    switch (wizard.currentStep) {
      case 0: return !!wizard.formData.employeeName && !!wizard.formData.weekEnding;
      case 1: return selectedDays.length > 0;
      case 2: return !!draft.jobNumber || !!draft.jobName;
      case 3: return !!draft.timeIn && !!draft.timeOut;
      case 4: return wizard.formData.entries.length > 0;
      default: return true;
    }
  };

  const handleNext = () => {
    if (wizard.currentStep === 3) {
      commitEntries();
      wizard.goToStep(4);
      return;
    }
    if (wizard.isLast) {
      wizard.setIsComplete(true);
    } else {
      wizard.goNext();
    }
  };

  if (wizard.isComplete) {
    return <TimecardReport data={wizard.formData} onReset={wizard.reset} />;
  }

  return (
    <WizardShell
      title={t('timecard.title')}
      currentStep={wizard.currentStep}
      totalSteps={TOTAL_STEPS}
      onNext={handleNext}
      onBack={wizard.goBack}
      isFirst={wizard.isFirst}
      isLast={wizard.isLast}
      canProceed={canProceed()}
      hideBack={wizard.currentStep === 4}
    >
      {/* Step 0: Employee + Week ending in one screen */}
      {wizard.currentStep === 0 && (
        <div className="space-y-5">
          <button
            onClick={loadSample}
            className="flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            <Sparkles size={16} />
            {t('common.tryDemo')}
          </button>

          <div>
            <h2 className="text-2xl font-bold mb-3">{t('timecard.who')}</h2>
            <SelectPicker
              options={EMPLOYEES.map(name => ({ value: name, label: name }))}
              value={wizard.formData.employeeName}
              onChange={(val) => wizard.setField('employeeName', val)}
              columns={2}
            />
          </div>

          <div className="border-t border-border pt-5">
            <QuickPick
              options={[
                { value: nextFridayISO(), label: t('common.thisFriday'), sublabel: formatWeekChip(nextFridayISO()) },
                { value: lastFridayISO(), label: t('common.lastFriday'), sublabel: formatWeekChip(lastFridayISO()) },
              ]}
              value={wizard.formData.weekEnding}
              onChange={(val) => wizard.setField('weekEnding', val)}
              label={t('timecard.weekEnding')}
              columns={2}
              otherSlot={
                <DatePicker
                  value={wizard.formData.weekEnding}
                  onChange={(val) => wizard.setField('weekEnding', val)}
                />
              }
            />
          </div>
        </div>
      )}

      {/* Step 1: Day(s) — multi-select with logged checkmarks */}
      {wizard.currentStep === 1 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold">
              {isEditing ? `${t('common.editing')} · ${selectedDays[0]}` : t('timecard.pickDays')}
            </h2>
            {!isEditing && carriedOver && (
              <p className="mt-1 text-sm text-muted">{t('timecard.sameAsLast')}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {DAYS.map(d => {
              const isSelected = selectedDays.includes(d.value);
              const isLogged = loggedDays.has(d.value);
              return (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => toggleDay(d.value)}
                  className={`
                    relative flex items-center justify-center gap-2 rounded-2xl border-2 px-4 py-5 min-h-[72px]
                    transition-all active:scale-[0.97]
                    ${isSelected
                      ? 'border-primary bg-primary/10 text-primary font-bold'
                      : isLogged
                      ? 'border-success/40 bg-success/5 text-foreground'
                      : 'border-border bg-white text-foreground'
                    }
                  `}
                >
                  {isLogged && !isSelected && (
                    <Check size={18} className="text-success" />
                  )}
                  <span className="text-base font-semibold">{t(d.key)}</span>
                </button>
              );
            })}
          </div>

          {!isEditing && selectedDays.length > 0 && (
            <p className="text-center text-sm text-muted">
              {selectedDays.length} {selectedDays.length === 1 ? t('timecard.daySelected') : t('timecard.daysSelected')}
            </p>
          )}
        </div>
      )}

      {/* Step 2: Job */}
      {wizard.currentStep === 2 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{t('timecard.jobInfo')}</h2>
          <QuickPick
            options={RECENT_JOBS.map(j => ({
              value: j.number,
              label: j.name,
              sublabel: `#${j.number}`,
            }))}
            value={draft.jobNumber}
            onChange={pickJob}
            columns={2}
            otherSlot={
              <>
                <TextInput
                  value={draft.jobNumber}
                  onChange={(val) => updateDraft('jobNumber', val)}
                  label={t('timecard.jobNumber')}
                />
                <TextInput
                  value={draft.jobName}
                  onChange={(val) => updateDraft('jobName', val)}
                  label={t('timecard.jobName')}
                />
              </>
            }
          />
        </div>
      )}

      {/* Step 3: Time + Lunch combined */}
      {wizard.currentStep === 3 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">{t('timecard.timeInOut')}</h2>

          <QuickPick
            options={TIME_PRESETS_IN}
            value={draft.timeIn}
            onChange={(val) => updateDraft('timeIn', val)}
            label={t('timecard.timeIn')}
            columns={4}
            otherSlot={
              <TimePicker
                value={draft.timeIn}
                onChange={(val) => updateDraft('timeIn', val)}
              />
            }
          />

          <QuickPick
            options={TIME_PRESETS_OUT}
            value={draft.timeOut}
            onChange={(val) => updateDraft('timeOut', val)}
            label={t('timecard.timeOut')}
            columns={3}
            otherSlot={
              <TimePicker
                value={draft.timeOut}
                onChange={(val) => updateDraft('timeOut', val)}
              />
            }
          />

          {/* Lunch as inline checkbox-style */}
          <button
            type="button"
            onClick={() => updateDraft('lunch', !draft.lunch)}
            className={`
              flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-4 min-h-[64px]
              transition-all active:scale-[0.99]
              ${draft.lunch
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-white text-foreground'
              }
            `}
          >
            <span className={`
              flex h-7 w-7 items-center justify-center rounded-md border-2
              ${draft.lunch ? 'border-primary bg-primary text-white' : 'border-border bg-white'}
            `}>
              {draft.lunch && <Check size={18} strokeWidth={3} />}
            </span>
            <span className="text-base font-semibold">{t('timecard.lunchTook')}</span>
          </button>

          {draft.timeIn && draft.timeOut && (
            <div className="text-center text-xl font-bold text-primary">
              {formatHours(calculateDailyHours(draft.timeIn, draft.timeOut, draft.lunch))} ×{' '}
              {selectedDays.length || 1} = {' '}
              {formatHours(calculateDailyHours(draft.timeIn, draft.timeOut, draft.lunch) * (selectedDays.length || 1))}
            </div>
          )}
        </div>
      )}

      {/* Step 4: Review with edit/delete */}
      {wizard.currentStep === 4 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{t('common.review')}</h2>
          <div className="rounded-2xl border border-border bg-white divide-y divide-border">
            {wizard.formData.entries.map((entry, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="font-bold">{entry.dayOfWeek}</p>
                  <p className="text-sm text-muted truncate">{entry.jobName || entry.jobNumber}</p>
                  <p className="text-xs text-muted">
                    {entry.timeIn} – {entry.timeOut}
                    {entry.lunch && ' · 🥪'}
                    {' · '}
                    <span className="font-bold text-primary">{formatHours(entry.totalHours)}</span>
                  </p>
                </div>
                <button
                  onClick={() => startEdit(i)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-muted active:bg-gray-200"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => deleteEntry(i)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-danger active:bg-gray-200"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          <BigButton onClick={startAddAnother} variant="outline" icon={<Plus size={20} />}>
            {t('timecard.addDay')}
          </BigButton>
        </div>
      )}
    </WizardShell>
  );
}
