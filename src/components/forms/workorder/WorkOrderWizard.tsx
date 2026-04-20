'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useWizard } from '@/hooks/useWizard';
import WizardShell from '@/components/wizard/WizardShell';
import WorkOrderReport from '@/components/report/WorkOrderReport';
import SelectPicker from '@/components/ui/SelectPicker';
import DatePicker from '@/components/ui/DatePicker';
import TimePicker from '@/components/ui/TimePicker';
import TextInput from '@/components/ui/TextInput';
import NumberInput from '@/components/ui/NumberInput';
import QuickPick from '@/components/ui/QuickPick';
import VoiceFirstField from '@/components/ui/VoiceFirstField';
import ToggleSwitch from '@/components/ui/ToggleSwitch';
import BigButton from '@/components/ui/BigButton';
import {
  EMPLOYEES,
  type WorkOrderData,
  type WorkOrderMaterial,
  type WorkOrderLabor,
  type WorkOrderFormType,
  type WorkOrderWeather,
} from '@/lib/types/forms';
import { calculateWorkOrderTotals, formatCurrency } from '@/lib/utils/calculations';
import { sampleWorkOrder } from '@/lib/sampleData';
import {
  RECENT_JOBS,
  COMMON_MATERIALS,
  TIME_PRESETS_IN,
  TIME_PRESETS_OUT,
  TEMP_PRESETS,
  RATE_PRESETS,
  todayISO,
  yesterdayISO,
} from '@/lib/recents';
import { Sun, CloudRain, Wind, Plus, AlertTriangle, Sparkles, X } from 'lucide-react';

const TOTAL_STEPS = 8;

const initialData: WorkOrderData = {
  formType: 'work-order',
  jobNumber: '',
  date: todayISO(),
  projectName: '',
  projectAddress: '',
  siteContact: '',
  technician: '',
  timeIn: '',
  timeOut: '',
  temperature: '',
  scopeOfWork: '',
  materials: [],
  labor: [],
  hasProblems: false,
  problemDescription: '',
};

const initialMaterial: WorkOrderMaterial = { quantity: 1, description: '', amount: 0 };
const initialLabor: WorkOrderLabor = { date: '', technician: '', hours: 0, rate: 0 };

export default function WorkOrderWizard() {
  const { t } = useLanguage();
  const wizard = useWizard<WorkOrderData>(initialData, TOTAL_STEPS);
  const [currentMaterial, setCurrentMaterial] = useState<WorkOrderMaterial>({ ...initialMaterial });
  const [currentLabor, setCurrentLabor] = useState<WorkOrderLabor>({ ...initialLabor });

  const pickJob = (number: string) => {
    const job = RECENT_JOBS.find(j => j.number === number);
    if (job) {
      wizard.setFormData(prev => ({
        ...prev,
        jobNumber: job.number,
        projectName: job.name,
        projectAddress: job.address || prev.projectAddress,
      }));
    } else {
      wizard.setField('jobNumber', number);
    }
  };

  const pickMaterial = (desc: string) => {
    const m = COMMON_MATERIALS.find(x => x.description === desc);
    setCurrentMaterial(prev => ({
      ...prev,
      description: m ? m.description : desc,
      amount: m ? m.defaultAmount : prev.amount,
    }));
  };

  const saveMaterial = () => {
    if (currentMaterial.description) {
      wizard.setFormData(prev => ({
        ...prev,
        materials: [...prev.materials, { ...currentMaterial }],
      }));
      setCurrentMaterial({ ...initialMaterial });
    }
  };

  const removeMaterial = (i: number) => {
    wizard.setFormData(prev => ({
      ...prev,
      materials: prev.materials.filter((_, idx) => idx !== i),
    }));
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

  const removeLabor = (i: number) => {
    wizard.setFormData(prev => ({
      ...prev,
      labor: prev.labor.filter((_, idx) => idx !== i),
    }));
  };

  const loadSample = () => {
    wizard.setFormData(sampleWorkOrder);
    wizard.setIsComplete(true);
  };

  const canProceed = () => {
    switch (wizard.currentStep) {
      case 0: return !!wizard.formData.jobNumber || !!wizard.formData.projectName;
      case 1: return !!wizard.formData.projectAddress;
      case 2: return !!wizard.formData.date && !!wizard.formData.technician;
      case 3: return !!wizard.formData.timeIn && !!wizard.formData.timeOut;
      case 4: return !!wizard.formData.weather;
      case 5: return !!wizard.formData.scopeOfWork;
      case 6: return true;
      case 7: return true;
      default: return true;
    }
  };

  const handleNext = () => {
    if (wizard.currentStep === 6) {
      if (currentMaterial.description) saveMaterial();
      if (currentLabor.technician) saveLabor();
    }
    if (wizard.isLast) {
      wizard.setIsComplete(true);
    } else {
      wizard.goNext();
    }
  };

  if (wizard.isComplete) {
    return <WorkOrderReport data={wizard.formData} onReset={wizard.reset} />;
  }

  const totals = calculateWorkOrderTotals(wizard.formData.materials, wizard.formData.labor);

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
      {/* Step 0: Form type + Job */}
      {wizard.currentStep === 0 && (
        <div className="space-y-5">
          <button
            onClick={loadSample}
            className="flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            <Sparkles size={16} />
            {t('common.tryDemo')}
          </button>
          <h2 className="text-2xl font-bold">{t('workorder.jobInfo')}</h2>
          <SelectPicker
            options={[
              { value: 'work-order', label: t('workorder.workOrder') },
              { value: 'change-order', label: t('workorder.changeOrder') },
              { value: 'estimate', label: t('workorder.estimate') },
            ]}
            value={wizard.formData.formType}
            onChange={(val) => wizard.setField('formType', val as WorkOrderFormType)}
            label={t('workorder.formType')}
            columns={3}
          />
          <QuickPick
            options={RECENT_JOBS.map(j => ({
              value: j.number,
              label: j.name,
              sublabel: `#${j.number}`,
            }))}
            value={wizard.formData.jobNumber}
            onChange={pickJob}
            label={t('common.recentJobs')}
            columns={2}
            otherSlot={
              <>
                <TextInput
                  value={wizard.formData.jobNumber}
                  onChange={(val) => wizard.setField('jobNumber', val)}
                  label={t('timecard.jobNumber')}
                />
                <TextInput
                  value={wizard.formData.projectName}
                  onChange={(val) => wizard.setField('projectName', val)}
                  label={t('workorder.projectName')}
                />
              </>
            }
          />
        </div>
      )}

      {/* Step 1: Address + site contact */}
      {wizard.currentStep === 1 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{t('workorder.whereIsJob')}</h2>
          <TextInput
            value={wizard.formData.projectAddress}
            onChange={(val) => wizard.setField('projectAddress', val)}
            label={t('workorder.projectAddress')}
          />
          <TextInput
            value={wizard.formData.siteContact}
            onChange={(val) => wizard.setField('siteContact', val)}
            label={t('workorder.siteContact')}
          />
        </div>
      )}

      {/* Step 2: Date + Tech */}
      {wizard.currentStep === 2 && (
        <div className="space-y-5">
          <h2 className="text-2xl font-bold">{t('workorder.dateContact')}</h2>
          <QuickPick
            options={[
              { value: todayISO(), label: t('common.today') },
              { value: yesterdayISO(), label: t('common.yesterday') },
            ]}
            value={wizard.formData.date}
            onChange={(val) => wizard.setField('date', val)}
            label={t('common.date')}
            columns={2}
            otherSlot={
              <DatePicker
                value={wizard.formData.date}
                onChange={(val) => wizard.setField('date', val)}
              />
            }
          />
          <SelectPicker
            options={EMPLOYEES.map(name => ({ value: name, label: name }))}
            value={wizard.formData.technician}
            onChange={(val) => wizard.setField('technician', val)}
            label={t('workorder.technician')}
            columns={2}
          />
        </div>
      )}

      {/* Step 3: Time */}
      {wizard.currentStep === 3 && (
        <div className="space-y-5">
          <h2 className="text-2xl font-bold">{t('workorder.time')}</h2>
          <QuickPick
            options={TIME_PRESETS_IN}
            value={wizard.formData.timeIn}
            onChange={(val) => wizard.setField('timeIn', val)}
            label={t('timecard.timeIn')}
            columns={4}
            otherSlot={
              <TimePicker
                value={wizard.formData.timeIn}
                onChange={(val) => wizard.setField('timeIn', val)}
              />
            }
          />
          <QuickPick
            options={TIME_PRESETS_OUT}
            value={wizard.formData.timeOut}
            onChange={(val) => wizard.setField('timeOut', val)}
            label={t('timecard.timeOut')}
            columns={3}
            otherSlot={
              <TimePicker
                value={wizard.formData.timeOut}
                onChange={(val) => wizard.setField('timeOut', val)}
              />
            }
          />
        </div>
      )}

      {/* Step 4: Weather + Temp */}
      {wizard.currentStep === 4 && (
        <div className="space-y-5">
          <h2 className="text-2xl font-bold">{t('workorder.weather')}</h2>
          <SelectPicker
            options={[
              { value: 'sunny', label: t('workorder.sunny'), icon: <Sun size={28} className="text-amber-500" /> },
              { value: 'rainy', label: t('workorder.rainy'), icon: <CloudRain size={28} className="text-blue-500" /> },
              { value: 'windy', label: t('workorder.windy'), icon: <Wind size={28} className="text-gray-500" /> },
            ]}
            value={wizard.formData.weather ?? ''}
            onChange={(val) => wizard.setField('weather', val as WorkOrderWeather)}
            columns={3}
          />
          <QuickPick
            options={TEMP_PRESETS}
            value={wizard.formData.temperature}
            onChange={(val) => wizard.setField('temperature', val)}
            label={t('workorder.temperature')}
            columns={3}
            otherSlot={
              <TextInput
                value={wizard.formData.temperature}
                onChange={(val) => wizard.setField('temperature', val)}
                enableVoice={false}
              />
            }
          />
        </div>
      )}

      {/* Step 5: Scope — voice-first */}
      {wizard.currentStep === 5 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{t('workorder.whatDidYouDo')}</h2>
          <VoiceFirstField
            value={wizard.formData.scopeOfWork}
            onChange={(val) => wizard.setField('scopeOfWork', val)}
          />
        </div>
      )}

      {/* Step 6: Materials + Labor */}
      {wizard.currentStep === 6 && (
        <div className="space-y-6">
          {/* Materials */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold">{t('workorder.materials')}</h2>
            {wizard.formData.materials.length > 0 && (
              <div className="space-y-2 rounded-2xl border border-border bg-white p-3">
                {wizard.formData.materials.map((m, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                    <div className="min-w-0 text-sm">
                      <p className="truncate font-medium">{m.quantity}× {m.description}</p>
                      <p className="text-xs text-muted">{formatCurrency(m.quantity * m.amount)}</p>
                    </div>
                    <button
                      onClick={() => removeMaterial(i)}
                      className="ml-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white text-muted active:bg-gray-200"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <QuickPick
              options={COMMON_MATERIALS.map(m => ({ value: m.description, label: m.description }))}
              value={currentMaterial.description}
              onChange={pickMaterial}
              label={t('common.commonItems')}
              columns={1}
              otherSlot={
                <TextInput
                  value={currentMaterial.description}
                  onChange={(val) => setCurrentMaterial(prev => ({ ...prev, description: val }))}
                  label={t('common.description')}
                />
              }
            />
            <div className="grid grid-cols-2 gap-3">
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
            </div>
            <BigButton onClick={saveMaterial} variant="accent" icon={<Plus size={20} />}>
              {t('common.addMore')}
            </BigButton>
          </section>

          {/* Labor */}
          <section className="space-y-3 border-t border-border pt-6">
            <h2 className="text-xl font-bold">{t('workorder.labor')}</h2>
            {wizard.formData.labor.length > 0 && (
              <div className="space-y-2 rounded-2xl border border-border bg-white p-3">
                {wizard.formData.labor.map((l, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                    <div className="min-w-0 text-sm">
                      <p className="truncate font-medium">{l.technician} · {l.hours}h</p>
                      <p className="text-xs text-muted">{formatCurrency(l.hours * l.rate)}</p>
                    </div>
                    <button
                      onClick={() => removeLabor(i)}
                      className="ml-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white text-muted active:bg-gray-200"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
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
            <QuickPick
              options={RATE_PRESETS}
              value={currentLabor.rate}
              onChange={(val) => setCurrentLabor(prev => ({ ...prev, rate: val }))}
              label={t('common.rate')}
              columns={4}
              otherSlot={
                <NumberInput
                  value={currentLabor.rate}
                  onChange={(val) => setCurrentLabor(prev => ({ ...prev, rate: val }))}
                  prefix="$"
                  step={5}
                />
              }
            />
            <BigButton onClick={saveLabor} variant="accent" icon={<Plus size={20} />}>
              {t('common.addMore')}
            </BigButton>
          </section>

          {(wizard.formData.materials.length > 0 || wizard.formData.labor.length > 0) && (
            <div className="rounded-2xl border-2 border-primary bg-primary/5 p-4">
              <div className="flex justify-between text-base font-bold text-primary">
                <span>{t('workorder.jobTotal')}</span>
                <span>{formatCurrency(totals.jobTotal)}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 7: Problems */}
      {wizard.currentStep === 7 && (
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
            <VoiceFirstField
              value={wizard.formData.problemDescription}
              onChange={(val) => wizard.setField('problemDescription', val)}
            />
          )}
        </div>
      )}
    </WizardShell>
  );
}
