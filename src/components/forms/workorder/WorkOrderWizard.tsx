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
import NumberInput from '@/components/ui/NumberInput';
import ToggleSwitch from '@/components/ui/ToggleSwitch';
import BigButton from '@/components/ui/BigButton';
import { EMPLOYEES, type WorkOrderData, type WorkOrderMaterial, type WorkOrderLabor } from '@/lib/types/forms';
import { calculateWorkOrderTotals, formatCurrency } from '@/lib/utils/calculations';
import { Sun, CloudRain, Wind, Plus, Mic, AlertTriangle } from 'lucide-react';

const TOTAL_STEPS = 10;

const initialData: WorkOrderData = {
  jobNumber: '',
  jobLocation: '',
  date: '',
  projectName: '',
  projectAddress: '',
  siteContact: '',
  technician: '',
  timeIn: '',
  timeOut: '',
  weather: '',
  temperature: '',
  scopeOfWork: '',
  materials: [],
  labor: [],
  hasProblems: false,
  problemDescription: '',
  techSignature: '',
  customerSignature: '',
};

const initialMaterial: WorkOrderMaterial = { quantity: 1, description: '', amount: 0 };
const initialLabor: WorkOrderLabor = { date: '', technician: '', hours: 0, rate: 0 };

export default function WorkOrderWizard() {
  const { t } = useLanguage();
  const wizard = useWizard<WorkOrderData>(initialData, TOTAL_STEPS);
  const [currentMaterial, setCurrentMaterial] = useState<WorkOrderMaterial>({ ...initialMaterial });
  const [currentLabor, setCurrentLabor] = useState<WorkOrderLabor>({ ...initialLabor });

  const saveMaterial = () => {
    if (currentMaterial.description) {
      wizard.setFormData(prev => ({
        ...prev,
        materials: [...prev.materials, { ...currentMaterial }],
      }));
      setCurrentMaterial({ ...initialMaterial });
    }
  };

  const saveLabor = () => {
    if (currentLabor.technician && currentLabor.hours > 0) {
      wizard.setFormData(prev => ({
        ...prev,
        labor: [...prev.labor, { ...currentLabor }],
      }));
      setCurrentLabor({ ...initialLabor, date: wizard.formData.date });
    }
  };

  const canProceed = () => {
    switch (wizard.currentStep) {
      case 0: return !!wizard.formData.jobNumber || !!wizard.formData.projectName;
      case 1: return !!wizard.formData.projectAddress;
      case 2: return !!wizard.formData.date;
      case 3: return !!wizard.formData.technician;
      case 4: return !!wizard.formData.timeIn && !!wizard.formData.timeOut;
      case 5: return !!wizard.formData.weather;
      case 6: return !!wizard.formData.scopeOfWork;
      case 7: return true;
      case 8: return true;
      case 9: return true;
      default: return true;
    }
  };

  const handleNext = () => {
    if (wizard.currentStep === 7 && currentMaterial.description) {
      saveMaterial();
    }
    if (wizard.currentStep === 8 && currentLabor.technician) {
      saveLabor();
    }
    if (wizard.isLast) {
      wizard.setIsComplete(true);
    } else {
      wizard.goNext();
    }
  };

  if (wizard.isComplete) {
    const totals = calculateWorkOrderTotals(wizard.formData.materials, wizard.formData.labor);

    return (
      <ConfirmationScreen title={t('workorder.title')} onReset={wizard.reset}>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">{t('timecard.jobNumber')}</span>
            <span className="font-bold">{wizard.formData.jobNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">{t('workorder.projectName')}</span>
            <span className="font-bold">{wizard.formData.projectName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">{t('workorder.projectAddress')}</span>
            <span className="font-bold">{wizard.formData.projectAddress}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">{t('workorder.technician')}</span>
            <span className="font-bold">{wizard.formData.technician}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">{t('workorder.time')}</span>
            <span className="font-bold">{wizard.formData.timeIn} - {wizard.formData.timeOut}</span>
          </div>

          <hr className="border-border" />
          <div>
            <p className="text-muted text-xs mb-1">{t('workorder.scope')}</p>
            <p className="font-medium">{wizard.formData.scopeOfWork}</p>
          </div>

          {wizard.formData.materials.length > 0 && (
            <>
              <hr className="border-border" />
              <h3 className="font-bold">{t('workorder.materials')}</h3>
              {wizard.formData.materials.map((m, i) => (
                <div key={i} className="flex justify-between py-1">
                  <span>{m.quantity}x {m.description}</span>
                  <span className="font-bold">{formatCurrency(m.quantity * m.amount)}</span>
                </div>
              ))}
            </>
          )}

          {wizard.formData.labor.length > 0 && (
            <>
              <hr className="border-border" />
              <h3 className="font-bold">{t('workorder.labor')}</h3>
              {wizard.formData.labor.map((l, i) => (
                <div key={i} className="flex justify-between py-1">
                  <span>{l.technician} ({l.hours}h)</span>
                  <span className="font-bold">{formatCurrency(l.hours * l.rate)}</span>
                </div>
              ))}
            </>
          )}

          <hr className="border-border" />
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>{t('workorder.materialsTotal')}</span>
              <span>{formatCurrency(totals.materialsTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('workorder.laborTotal')}</span>
              <span>{formatCurrency(totals.laborTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('workorder.subtotal')}</span>
              <span>{formatCurrency(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('workorder.pandO')}</span>
              <span>{formatCurrency(totals.pandO)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-primary pt-1">
              <span>{t('workorder.jobTotal')}</span>
              <span>{formatCurrency(totals.jobTotal)}</span>
            </div>
          </div>

          {wizard.formData.hasProblems && (
            <>
              <hr className="border-border" />
              <div className="flex items-start gap-2 text-danger">
                <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                <p>{wizard.formData.problemDescription}</p>
              </div>
            </>
          )}
        </div>
      </ConfirmationScreen>
    );
  }

  return (
    <WizardShell
      title={t('workorder.title')}
      currentStep={wizard.currentStep}
      totalSteps={TOTAL_STEPS}
      onNext={handleNext}
      onBack={wizard.goBack}
      isFirst={wizard.isFirst}
      isLast={wizard.isLast}
      canProceed={canProceed()}
    >
      {/* Step 0: Job info */}
      {wizard.currentStep === 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{t('workorder.jobInfo')}</h2>
          <TextInput
            value={wizard.formData.jobNumber}
            onChange={(val) => wizard.setField('jobNumber', val)}
            placeholder={t('timecard.jobNumber')}
            label={t('timecard.jobNumber')}
          />
          <TextInput
            value={wizard.formData.projectName}
            onChange={(val) => wizard.setField('projectName', val)}
            placeholder={t('workorder.projectName')}
            label={t('workorder.projectName')}
          />
        </div>
      )}

      {/* Step 1: Location */}
      {wizard.currentStep === 1 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{t('workorder.whereIsJob')}</h2>
          <TextInput
            value={wizard.formData.projectAddress}
            onChange={(val) => wizard.setField('projectAddress', val)}
            placeholder={t('workorder.projectAddress')}
            label={t('workorder.projectAddress')}
          />
          <TextInput
            value={wizard.formData.jobLocation}
            onChange={(val) => wizard.setField('jobLocation', val)}
            placeholder={t('workorder.jobLocation')}
            label={t('workorder.jobLocation')}
          />
        </div>
      )}

      {/* Step 2: Date & Contact */}
      {wizard.currentStep === 2 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{t('workorder.dateContact')}</h2>
          <DatePicker
            value={wizard.formData.date}
            onChange={(val) => wizard.setField('date', val)}
            label={t('common.date')}
          />
          <TextInput
            value={wizard.formData.siteContact}
            onChange={(val) => wizard.setField('siteContact', val)}
            placeholder={t('workorder.siteContact')}
            label={t('workorder.siteContact')}
          />
        </div>
      )}

      {/* Step 3: Technician */}
      {wizard.currentStep === 3 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{t('workorder.whoWorked')}</h2>
          <SelectPicker
            options={EMPLOYEES.map(name => ({ value: name, label: name }))}
            value={wizard.formData.technician}
            onChange={(val) => wizard.setField('technician', val)}
            columns={2}
          />
        </div>
      )}

      {/* Step 4: Time */}
      {wizard.currentStep === 4 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{t('workorder.time')}</h2>
          <TimePicker
            value={wizard.formData.timeIn}
            onChange={(val) => wizard.setField('timeIn', val)}
            label={t('timecard.timeIn')}
          />
          <TimePicker
            value={wizard.formData.timeOut}
            onChange={(val) => wizard.setField('timeOut', val)}
            label={t('timecard.timeOut')}
          />
        </div>
      )}

      {/* Step 5: Weather */}
      {wizard.currentStep === 5 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{t('workorder.whatsWeather')}</h2>
          <SelectPicker
            options={[
              { value: 'sunny', label: t('workorder.sunny'), icon: <Sun size={28} className="text-amber-500" /> },
              { value: 'rainy', label: t('workorder.rainy'), icon: <CloudRain size={28} className="text-blue-500" /> },
              { value: 'windy', label: t('workorder.windy'), icon: <Wind size={28} className="text-gray-500" /> },
            ]}
            value={wizard.formData.weather}
            onChange={(val) => wizard.setField('weather', val as WorkOrderData['weather'])}
            columns={3}
          />
          <TextInput
            value={wizard.formData.temperature}
            onChange={(val) => wizard.setField('temperature', val)}
            placeholder="e.g. 85°F"
            label={t('workorder.temperature')}
            enableVoice={false}
          />
        </div>
      )}

      {/* Step 6: Scope of work */}
      {wizard.currentStep === 6 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Mic size={28} className="text-primary" />
            {t('workorder.whatDidYouDo')}
          </h2>
          <p className="text-muted text-base">{t('common.tapToSpeak')}</p>
          <TextInput
            value={wizard.formData.scopeOfWork}
            onChange={(val) => wizard.setField('scopeOfWork', val)}
            placeholder={t('workorder.scope')}
            multiline
          />
        </div>
      )}

      {/* Step 7: Materials */}
      {wizard.currentStep === 7 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{t('workorder.materials')}</h2>
          {wizard.formData.materials.length > 0 && (
            <div className="rounded-xl bg-success/10 p-3 text-sm text-success font-medium">
              {wizard.formData.materials.length} item{wizard.formData.materials.length !== 1 ? 's' : ''} added
            </div>
          )}
          <TextInput
            value={currentMaterial.description}
            onChange={(val) => setCurrentMaterial(prev => ({ ...prev, description: val }))}
            placeholder={t('common.description')}
            label={t('common.description')}
          />
          <NumberInput
            value={currentMaterial.quantity}
            onChange={(val) => setCurrentMaterial(prev => ({ ...prev, quantity: val }))}
            label={t('common.quantity')}
            min={1}
          />
          <NumberInput
            value={currentMaterial.amount}
            onChange={(val) => setCurrentMaterial(prev => ({ ...prev, amount: val }))}
            label={t('common.amount')}
            prefix="$"
            step={5}
          />
          <BigButton onClick={saveMaterial} variant="accent" icon={<Plus size={20} />}>
            {t('common.addMore')}
          </BigButton>
        </div>
      )}

      {/* Step 8: Labor */}
      {wizard.currentStep === 8 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{t('workorder.labor')}</h2>
          {wizard.formData.labor.length > 0 && (
            <div className="rounded-xl bg-success/10 p-3 text-sm text-success font-medium">
              {wizard.formData.labor.length} entr{wizard.formData.labor.length !== 1 ? 'ies' : 'y'} added
            </div>
          )}
          <SelectPicker
            options={EMPLOYEES.map(name => ({ value: name, label: name }))}
            value={currentLabor.technician}
            onChange={(val) => setCurrentLabor(prev => ({ ...prev, technician: val }))}
            label={t('workorder.technician')}
            columns={2}
          />
          <NumberInput
            value={currentLabor.hours}
            onChange={(val) => setCurrentLabor(prev => ({ ...prev, hours: val }))}
            label={t('common.hours')}
            step={0.5}
            suffix="h"
          />
          <NumberInput
            value={currentLabor.rate}
            onChange={(val) => setCurrentLabor(prev => ({ ...prev, rate: val }))}
            label={t('common.rate')}
            prefix="$"
            step={5}
          />
          {currentLabor.hours > 0 && currentLabor.rate > 0 && (
            <div className="text-center text-xl font-bold text-primary">
              = {formatCurrency(currentLabor.hours * currentLabor.rate)}
            </div>
          )}
          <BigButton onClick={saveLabor} variant="accent" icon={<Plus size={20} />}>
            {t('common.addMore')}
          </BigButton>
        </div>
      )}

      {/* Step 9: Problems */}
      {wizard.currentStep === 9 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <AlertTriangle size={28} className="text-accent" />
            {t('workorder.problems')}
          </h2>
          <ToggleSwitch
            value={wizard.formData.hasProblems}
            onChange={(val) => wizard.setField('hasProblems', val)}
            yesLabel={t('common.yes')}
            noLabel={t('common.no')}
            yesIcon="⚠️"
            noIcon="✅"
          />
          {wizard.formData.hasProblems && (
            <TextInput
              value={wizard.formData.problemDescription}
              onChange={(val) => wizard.setField('problemDescription', val)}
              placeholder={t('workorder.problemsDesc')}
              multiline
            />
          )}
        </div>
      )}
    </WizardShell>
  );
}
