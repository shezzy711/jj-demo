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
import ToggleSwitch from '@/components/ui/ToggleSwitch';
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
import { Plus, Sparkles } from 'lucide-react';

const TOTAL_STEPS = 7;

const initialData: TimecardData = {
  employeeName: '',
  weekEnding: nextFridayISO(),
  entries: [],
};

const initialEntry: TimecardEntry = {
  dayOfWeek: '',
  date: '',
  jobNumber: '',
  jobName: '',
  timeIn: '',
  timeOut: '',
  lunch: false,
  totalHours: 0,
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

export default function TimecardWizard() {
  const { t } = useLanguage();
  const wizard = useWizard<TimecardData>(initialData, TOTAL_STEPS);
  const [currentEntry, setCurrentEntry] = useState<TimecardEntry>({ ...initialEntry });

  const updateEntry = <K extends keyof TimecardEntry>(key: K, value: TimecardEntry[K]) => {
    setCurrentEntry(prev => {
      const updated = { ...prev, [key]: value };
      if (key === 'timeIn' || key === 'timeOut' || key === 'lunch') {
        updated.totalHours = calculateDailyHours(
          key === 'timeIn' ? (value as string) : updated.timeIn,
          key === 'timeOut' ? (value as string) : updated.timeOut,
          key === 'lunch' ? (value as boolean) : updated.lunch,
        );
      }
      return updated;
    });
  };

  const pickJob = (number: string) => {
    const job = RECENT_JOBS.find(j => j.number === number);
    setCurrentEntry(prev => ({
      ...prev,
      jobNumber: job ? job.number : number,
      jobName: job ? job.name : prev.jobName,
    }));
  };

  const commitEntry = () => {
    if (currentEntry.dayOfWeek && currentEntry.timeIn && currentEntry.timeOut) {
      wizard.setFormData(prev => ({
        ...prev,
        entries: [...prev.entries, { ...currentEntry }],
      }));
      setCurrentEntry({ ...initialEntry });
    }
  };

  const loadSample = () => {
    wizard.setFormData(sampleTimecard);
    wizard.setIsComplete(true);
  };

  const canProceed = () => {
    switch (wizard.currentStep) {
      case 0: return !!wizard.formData.employeeName;
      case 1: return !!wizard.formData.weekEnding;
      case 2: return !!currentEntry.dayOfWeek;
      case 3: return !!currentEntry.jobNumber || !!currentEntry.jobName;
      case 4: return !!currentEntry.timeIn && !!currentEntry.timeOut;
      case 5: return true;
      case 6: return wizard.formData.entries.length > 0;
      default: return true;
    }
  };

  const handleNext = () => {
    if (wizard.currentStep === 5) {
      commitEntry();
      wizard.goNext();
      return;
    }
    if (wizard.isLast) {
      wizard.setIsComplete(true);
    } else {
      wizard.goNext();
    }
  };

  const addAnotherDay = () => {
    setCurrentEntry({ ...initialEntry });
    wizard.goToStep(2);
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
    >
      {/* Step 0: Who */}
      {wizard.currentStep === 0 && (
        <div className="space-y-4">
          <button
            onClick={loadSample}
            className="flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            <Sparkles size={16} />
            {t('common.tryDemo')}
          </button>
          <h2 className="text-2xl font-bold">{t('timecard.who')}</h2>
          <SelectPicker
            options={EMPLOYEES.map(name => ({ value: name, label: name }))}
            value={wizard.formData.employeeName}
            onChange={(val) => wizard.setField('employeeName', val)}
            columns={2}
          />
        </div>
      )}

      {/* Step 1: Week */}
      {wizard.currentStep === 1 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{t('timecard.whatWeek')}</h2>
          <QuickPick
            options={[
              { value: nextFridayISO(), label: t('common.thisFriday') },
              { value: lastFridayISO(), label: t('common.lastFriday') },
            ]}
            value={wizard.formData.weekEnding}
            onChange={(val) => wizard.setField('weekEnding', val)}
            columns={2}
            otherSlot={
              <DatePicker
                value={wizard.formData.weekEnding}
                onChange={(val) => wizard.setField('weekEnding', val)}
                label={t('timecard.weekEnding')}
              />
            }
          />
        </div>
      )}

      {/* Step 2: Day */}
      {wizard.currentStep === 2 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{t('timecard.pickDay')}</h2>
          <SelectPicker
            options={DAYS.map(d => ({ value: d.value, label: t(d.key) }))}
            value={currentEntry.dayOfWeek}
            onChange={(val) => {
              updateEntry('dayOfWeek', val);
              if (!currentEntry.date) updateEntry('date', wizard.formData.weekEnding);
            }}
            columns={2}
          />
        </div>
      )}

      {/* Step 3: Job — recent jobs as big buttons */}
      {wizard.currentStep === 3 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{t('timecard.jobInfo')}</h2>
          <QuickPick
            options={RECENT_JOBS.map(j => ({
              value: j.number,
              label: j.name,
              sublabel: `#${j.number}`,
            }))}
            value={currentEntry.jobNumber}
            onChange={pickJob}
            columns={2}
            otherSlot={
              <>
                <TextInput
                  value={currentEntry.jobNumber}
                  onChange={(val) => updateEntry('jobNumber', val)}
                  label={t('timecard.jobNumber')}
                />
                <TextInput
                  value={currentEntry.jobName}
                  onChange={(val) => updateEntry('jobName', val)}
                  label={t('timecard.jobName')}
                />
              </>
            }
          />
        </div>
      )}

      {/* Step 4: Time — presets */}
      {wizard.currentStep === 4 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">{t('timecard.timeInOut')}</h2>

          <QuickPick
            options={TIME_PRESETS_IN}
            value={currentEntry.timeIn}
            onChange={(val) => updateEntry('timeIn', val)}
            label={t('timecard.timeIn')}
            columns={4}
            otherSlot={
              <TimePicker
                value={currentEntry.timeIn}
                onChange={(val) => updateEntry('timeIn', val)}
              />
            }
          />

          <QuickPick
            options={TIME_PRESETS_OUT}
            value={currentEntry.timeOut}
            onChange={(val) => updateEntry('timeOut', val)}
            label={t('timecard.timeOut')}
            columns={3}
            otherSlot={
              <TimePicker
                value={currentEntry.timeOut}
                onChange={(val) => updateEntry('timeOut', val)}
              />
            }
          />

          {currentEntry.timeIn && currentEntry.timeOut && (
            <div className="text-center text-xl font-bold text-primary py-2">
              {formatHours(calculateDailyHours(currentEntry.timeIn, currentEntry.timeOut, currentEntry.lunch))}
            </div>
          )}
        </div>
      )}

      {/* Step 5: Lunch */}
      {wizard.currentStep === 5 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">{t('timecard.lunchTaken')}</h2>
          <ToggleSwitch
            value={currentEntry.lunch}
            onChange={(val) => updateEntry('lunch', val)}
            yesLabel={t('common.yes')}
            noLabel={t('common.no')}
            yesIcon="🥪"
            noIcon="✖️"
          />
        </div>
      )}

      {/* Step 6: Review */}
      {wizard.currentStep === 6 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{t('common.review')}</h2>
          <div className="rounded-2xl border border-border bg-white">
            {wizard.formData.entries.map((entry, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-border px-4 py-3 last:border-0"
              >
                <div>
                  <p className="font-bold">{entry.dayOfWeek}</p>
                  <p className="text-sm text-muted">{entry.jobName || entry.jobNumber}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{formatHours(entry.totalHours)}</p>
                  <p className="text-xs text-muted">{entry.timeIn} – {entry.timeOut}</p>
                </div>
              </div>
            ))}
          </div>
          <BigButton onClick={addAnotherDay} variant="outline" icon={<Plus size={20} />}>
            {t('timecard.addDay')}
          </BigButton>
        </div>
      )}
    </WizardShell>
  );
}
