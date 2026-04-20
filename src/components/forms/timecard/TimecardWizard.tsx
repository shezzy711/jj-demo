'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useWizard } from '@/hooks/useWizard';
import WizardShell from '@/components/wizard/WizardShell';
import ConfirmationScreen from '@/components/ui/ConfirmationScreen';
import SelectPicker from '@/components/ui/SelectPicker';
import DatePicker from '@/components/ui/DatePicker';
import TimePicker from '@/components/ui/TimePicker';
import TextInput from '@/components/ui/TextInput';
import ToggleSwitch from '@/components/ui/ToggleSwitch';
import BigButton from '@/components/ui/BigButton';
import { EMPLOYEES, type TimecardData, type TimecardEntry } from '@/lib/types/forms';
import { calculateDailyHours, calculateTimecardTotal, formatHours } from '@/lib/utils/calculations';
import { User, Plus } from 'lucide-react';

const TOTAL_STEPS = 6;

const initialData: TimecardData = {
  employeeName: '',
  weekEnding: '',
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

  const saveCurrentEntry = () => {
    if (currentEntry.dayOfWeek) {
      wizard.setFormData(prev => ({
        ...prev,
        entries: [...prev.entries, { ...currentEntry }],
      }));
      setCurrentEntry({ ...initialEntry });
      wizard.goToStep(2); // back to pick day
    }
  };

  const canProceed = () => {
    switch (wizard.currentStep) {
      case 0: return !!wizard.formData.employeeName;
      case 1: return !!wizard.formData.weekEnding;
      case 2: return !!currentEntry.dayOfWeek;
      case 3: return !!currentEntry.jobNumber || !!currentEntry.jobName;
      case 4: return !!currentEntry.timeIn && !!currentEntry.timeOut;
      case 5: return true;
      default: return true;
    }
  };

  const handleNext = () => {
    if (wizard.isLast) {
      // Save final entry and complete
      if (currentEntry.dayOfWeek) {
        wizard.setFormData(prev => ({
          ...prev,
          entries: [...prev.entries, { ...currentEntry }],
        }));
      }
      wizard.setIsComplete(true);
    } else {
      wizard.goNext();
    }
  };

  if (wizard.isComplete) {
    const totalHours = calculateTimecardTotal(wizard.formData.entries);
    return (
      <ConfirmationScreen title={t('timecard.title')} onReset={wizard.reset}>
        <div className="space-y-4">
          <div className="flex justify-between text-lg">
            <span className="font-medium">{t('timecard.who')}</span>
            <span className="font-bold">{wizard.formData.employeeName}</span>
          </div>
          <div className="flex justify-between text-lg">
            <span className="font-medium">{t('timecard.weekEnding')}</span>
            <span className="font-bold">{wizard.formData.weekEnding}</span>
          </div>
          <hr className="border-border" />
          {wizard.formData.entries.map((entry, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <p className="font-bold">{entry.dayOfWeek}</p>
                <p className="text-sm text-muted">{entry.jobName || entry.jobNumber}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">{formatHours(entry.totalHours)}</p>
                <p className="text-sm text-muted">{entry.timeIn} - {entry.timeOut}</p>
              </div>
            </div>
          ))}
          <hr className="border-border" />
          <div className="flex justify-between text-xl">
            <span className="font-bold">{t('timecard.totalHours')}</span>
            <span className="font-bold text-primary">{formatHours(totalHours)}</span>
          </div>
        </div>
      </ConfirmationScreen>
    );
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
      {/* Step 0: Who are you? */}
      {wizard.currentStep === 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <User size={28} className="text-primary" />
            {t('timecard.who')}
          </h2>
          <SelectPicker
            options={EMPLOYEES.map(name => ({ value: name, label: name }))}
            value={wizard.formData.employeeName}
            onChange={(val) => wizard.setField('employeeName', val)}
            columns={2}
          />
        </div>
      )}

      {/* Step 1: What week? */}
      {wizard.currentStep === 1 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{t('timecard.whatWeek')}</h2>
          <p className="text-muted">{t('timecard.weekEnding')}</p>
          <DatePicker
            value={wizard.formData.weekEnding}
            onChange={(val) => wizard.setField('weekEnding', val)}
          />
        </div>
      )}

      {/* Step 2: Pick a day */}
      {wizard.currentStep === 2 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{t('timecard.pickDay')}</h2>
          {wizard.formData.entries.length > 0 && (
            <div className="rounded-xl bg-success/10 p-3 text-sm text-success font-medium">
              {wizard.formData.entries.length} {wizard.formData.entries.length === 1 ? 'day' : 'days'} logged
            </div>
          )}
          <SelectPicker
            options={DAYS.map(d => ({ value: d.value, label: t(d.key) }))}
            value={currentEntry.dayOfWeek}
            onChange={(val) => {
              updateEntry('dayOfWeek', val);
              const dayDate = currentEntry.date;
              if (!dayDate) updateEntry('date', wizard.formData.weekEnding);
            }}
            columns={2}
          />
        </div>
      )}

      {/* Step 3: Job info */}
      {wizard.currentStep === 3 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{t('timecard.jobInfo')}</h2>
          <TextInput
            value={currentEntry.jobNumber}
            onChange={(val) => updateEntry('jobNumber', val)}
            placeholder={t('timecard.jobNumber')}
            label={t('timecard.jobNumber')}
          />
          <TextInput
            value={currentEntry.jobName}
            onChange={(val) => updateEntry('jobName', val)}
            placeholder={t('timecard.jobName')}
            label={t('timecard.jobName')}
          />
        </div>
      )}

      {/* Step 4: Time in & out */}
      {wizard.currentStep === 4 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{t('timecard.timeInOut')}</h2>
          <TimePicker
            value={currentEntry.timeIn}
            onChange={(val) => updateEntry('timeIn', val)}
            label={t('timecard.timeIn')}
          />
          <TimePicker
            value={currentEntry.timeOut}
            onChange={(val) => updateEntry('timeOut', val)}
            label={t('timecard.timeOut')}
          />
          {currentEntry.timeIn && currentEntry.timeOut && (
            <div className="text-center text-xl font-bold text-primary py-2">
              {formatHours(calculateDailyHours(currentEntry.timeIn, currentEntry.timeOut, currentEntry.lunch))}
            </div>
          )}
        </div>
      )}

      {/* Step 5: Lunch + Add Another */}
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

          <div className="pt-4">
            <BigButton
              onClick={saveCurrentEntry}
              variant="accent"
              icon={<Plus size={20} />}
            >
              {t('timecard.addDay')}
            </BigButton>
          </div>
        </div>
      )}
    </WizardShell>
  );
}
