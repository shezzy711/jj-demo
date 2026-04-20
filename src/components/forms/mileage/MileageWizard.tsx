'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useWizard } from '@/hooks/useWizard';
import WizardShell from '@/components/wizard/WizardShell';
import ConfirmationScreen from '@/components/ui/ConfirmationScreen';
import SelectPicker from '@/components/ui/SelectPicker';
import DatePicker from '@/components/ui/DatePicker';
import TextInput from '@/components/ui/TextInput';
import NumberInput from '@/components/ui/NumberInput';
import BigButton from '@/components/ui/BigButton';
import { EMPLOYEES, MILEAGE_RATE, type MileageData, type MileageEntry } from '@/lib/types/forms';
import { calculateMileageTotal, calculateMileageReimbursement, formatCurrency } from '@/lib/utils/calculations';
import { User, Plus, MapPin } from 'lucide-react';

const TOTAL_STEPS = 4;

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
    setCurrentEntry(prev => ({ ...prev, [key]: value }));
  };

  const saveCurrentEntry = () => {
    if (currentEntry.startLocation && currentEntry.endLocation) {
      wizard.setFormData(prev => ({
        ...prev,
        entries: [...prev.entries, { ...currentEntry }],
      }));
      setCurrentEntry({ ...initialEntry, date: currentEntry.date });
      wizard.goToStep(2); // back to date/trip
    }
  };

  const canProceed = () => {
    switch (wizard.currentStep) {
      case 0: return !!wizard.formData.employeeName;
      case 1: return !!wizard.formData.weekEnding;
      case 2: return !!currentEntry.date;
      case 3: return !!currentEntry.startLocation && !!currentEntry.endLocation && currentEntry.totalMiles > 0;
      default: return true;
    }
  };

  const handleNext = () => {
    if (wizard.isLast) {
      if (currentEntry.startLocation && currentEntry.endLocation) {
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
    const totalMiles = calculateMileageTotal(wizard.formData.entries);
    const reimbursement = calculateMileageReimbursement(totalMiles);

    return (
      <ConfirmationScreen title={t('mileage.title')} onReset={wizard.reset}>
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
                <p className="text-sm text-muted">{entry.date}</p>
                <p className="font-medium">{entry.startLocation}</p>
                <p className="text-muted text-sm">→ {entry.endLocation}</p>
              </div>
              <span className="font-bold text-primary">{entry.totalMiles} mi</span>
            </div>
          ))}
          <hr className="border-border" />
          <div className="flex justify-between text-xl">
            <span className="font-bold">{t('mileage.totalMiles')}</span>
            <span className="font-bold text-primary">{totalMiles} mi</span>
          </div>
          <div className="flex justify-between text-xl">
            <span className="font-bold">{t('mileage.reimbursement')}</span>
            <span className="font-bold text-success">{formatCurrency(reimbursement)}</span>
          </div>
          <p className="text-sm text-muted text-right">{formatCurrency(MILEAGE_RATE)} {t('mileage.perMile')}</p>
        </div>
      </ConfirmationScreen>
    );
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

      {/* Step 2: Pick a date */}
      {wizard.currentStep === 2 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{t('common.date')}</h2>
          {wizard.formData.entries.length > 0 && (
            <div className="rounded-xl bg-success/10 p-3 text-sm text-success font-medium">
              {wizard.formData.entries.length} trip{wizard.formData.entries.length !== 1 ? 's' : ''} logged
            </div>
          )}
          <DatePicker
            value={currentEntry.date}
            onChange={(val) => updateEntry('date', val)}
          />
        </div>
      )}

      {/* Step 3: Trip details */}
      {wizard.currentStep === 3 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <MapPin size={28} className="text-primary" />
            {t('mileage.tripDetails')}
          </h2>
          <TextInput
            value={currentEntry.startLocation}
            onChange={(val) => updateEntry('startLocation', val)}
            placeholder={t('mileage.whereFrom')}
            label={t('mileage.startLocation')}
          />
          <TextInput
            value={currentEntry.endLocation}
            onChange={(val) => updateEntry('endLocation', val)}
            placeholder={t('mileage.whereTo')}
            label={t('mileage.endLocation')}
          />
          <NumberInput
            value={currentEntry.totalMiles}
            onChange={(val) => updateEntry('totalMiles', val)}
            label={t('mileage.howFar')}
            step={0.5}
            suffix=" mi"
          />
          <div className="pt-2">
            <BigButton
              onClick={saveCurrentEntry}
              variant="accent"
              icon={<Plus size={20} />}
            >
              {t('mileage.addTrip')}
            </BigButton>
          </div>
        </div>
      )}
    </WizardShell>
  );
}
