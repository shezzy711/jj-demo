'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useWizard } from '@/hooks/useWizard';
import WizardShell from '@/components/wizard/WizardShell';
import MileageReport from '@/components/report/MileageReport';
import SelectPicker from '@/components/ui/SelectPicker';
import DatePicker from '@/components/ui/DatePicker';
import TextInput from '@/components/ui/TextInput';
import NumberInput from '@/components/ui/NumberInput';
import BigButton from '@/components/ui/BigButton';
import { EMPLOYEES, type MileageData, type MileageEntry } from '@/lib/types/forms';
import { sampleMileage } from '@/lib/sampleData';
import { Plus, Sparkles } from 'lucide-react';

const TOTAL_STEPS = 5;

const initialData: MileageData = {
  employeeName: '',
  weekEnding: '',
  entries: [],
};

const initialEntry: MileageEntry = {
  date: '',
  startLocation: '',
  endLocation: '',
  totalMiles: 0,
};

export default function MileageWizard() {
  const { t } = useLanguage();
  const wizard = useWizard<MileageData>(initialData, TOTAL_STEPS);
  const [currentEntry, setCurrentEntry] = useState<MileageEntry>({ ...initialEntry });

  const updateEntry = <K extends keyof MileageEntry>(key: K, value: MileageEntry[K]) => {
    setCurrentEntry(prev => {
      const next = { ...prev, [key]: value };
      // Auto-calc total miles from odometer if both are set
      if (
        (key === 'startOdometer' || key === 'endOdometer') &&
        typeof next.startOdometer === 'number' &&
        typeof next.endOdometer === 'number' &&
        next.endOdometer >= next.startOdometer
      ) {
        next.totalMiles = next.endOdometer - next.startOdometer;
      }
      return next;
    });
  };

  const commitEntry = () => {
    if (currentEntry.startLocation && currentEntry.endLocation && currentEntry.totalMiles > 0) {
      wizard.setFormData(prev => ({
        ...prev,
        entries: [...prev.entries, { ...currentEntry }],
      }));
      setCurrentEntry({ ...initialEntry });
    }
  };

  const loadSample = () => {
    wizard.setFormData(sampleMileage);
    wizard.setIsComplete(true);
  };

  const canProceed = () => {
    switch (wizard.currentStep) {
      case 0: return !!wizard.formData.employeeName;
      case 1: return !!wizard.formData.weekEnding;
      case 2: return !!currentEntry.date;
      case 3: return !!currentEntry.startLocation && !!currentEntry.endLocation && currentEntry.totalMiles > 0;
      case 4: return wizard.formData.entries.length > 0;
      default: return true;
    }
  };

  const handleNext = () => {
    if (wizard.currentStep === 3) {
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

  const addAnotherTrip = () => {
    setCurrentEntry({ ...initialEntry });
    wizard.goToStep(2);
  };

  if (wizard.isComplete) {
    return <MileageReport data={wizard.formData} onReset={wizard.reset} />;
  }

  return (
    <WizardShell
      title={t('mileage.title')}
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
          <p className="text-muted">{t('timecard.weekEnding')}</p>
          <DatePicker
            value={wizard.formData.weekEnding}
            onChange={(val) => wizard.setField('weekEnding', val)}
          />
        </div>
      )}

      {/* Step 2: Date */}
      {wizard.currentStep === 2 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{t('common.date')}</h2>
          <DatePicker
            value={currentEntry.date}
            onChange={(val) => updateEntry('date', val)}
          />
        </div>
      )}

      {/* Step 3: Trip */}
      {wizard.currentStep === 3 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{t('mileage.tripDetails')}</h2>
          <TextInput
            value={currentEntry.startLocation}
            onChange={(val) => updateEntry('startLocation', val)}
            label={t('mileage.startLocation')}
          />
          <TextInput
            value={currentEntry.endLocation}
            onChange={(val) => updateEntry('endLocation', val)}
            label={t('mileage.endLocation')}
          />
          <div className="grid grid-cols-2 gap-3">
            <NumberInput
              value={currentEntry.startOdometer ?? 0}
              onChange={(val) => updateEntry('startOdometer', val)}
              label={t('mileage.startOdometer')}
              step={1}
              min={0}
            />
            <NumberInput
              value={currentEntry.endOdometer ?? 0}
              onChange={(val) => updateEntry('endOdometer', val)}
              label={t('mileage.endOdometer')}
              step={1}
              min={0}
            />
          </div>
          <NumberInput
            value={currentEntry.totalMiles}
            onChange={(val) => updateEntry('totalMiles', val)}
            label={t('mileage.howFar')}
            step={0.5}
            suffix=" mi"
          />
        </div>
      )}

      {/* Step 4: Review */}
      {wizard.currentStep === 4 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{t('common.review')}</h2>
          <div className="rounded-2xl border border-border bg-white">
            {wizard.formData.entries.map((entry, i) => (
              <div
                key={i}
                className="border-b border-border px-4 py-3 last:border-0"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted">{entry.date}</p>
                  <p className="font-bold text-primary">{entry.totalMiles} mi</p>
                </div>
                <p className="font-medium">{entry.startLocation}</p>
                <p className="text-sm text-muted">→ {entry.endLocation}</p>
              </div>
            ))}
          </div>
          <BigButton onClick={addAnotherTrip} variant="outline" icon={<Plus size={20} />}>
            {t('mileage.addTrip')}
          </BigButton>
        </div>
      )}
    </WizardShell>
  );
}
