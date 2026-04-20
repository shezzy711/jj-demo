'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useWizard } from '@/hooks/useWizard';
import WizardShell from '@/components/wizard/WizardShell';
import RequisitionReport from '@/components/report/RequisitionReport';
import SelectPicker from '@/components/ui/SelectPicker';
import DatePicker from '@/components/ui/DatePicker';
import TextInput from '@/components/ui/TextInput';
import NumberInput from '@/components/ui/NumberInput';
import QuickPick from '@/components/ui/QuickPick';
import VoiceFirstField from '@/components/ui/VoiceFirstField';
import BigButton from '@/components/ui/BigButton';
import { EMPLOYEES, type RequisitionData, type MaterialItem, type ToolItem } from '@/lib/types/forms';
import { sampleRequisition } from '@/lib/sampleData';
import {
  RECENT_JOBS,
  COMMON_MATERIALS,
  COMMON_TOOLS,
  todayISO,
  yesterdayISO,
  tomorrowISO,
  nextWeekISO,
} from '@/lib/recents';
import { Wrench, Package, Plus, Sparkles, X } from 'lucide-react';

const TOTAL_STEPS = 7;

const initialData: RequisitionData = {
  jobNumber: '',
  jobName: '',
  originationDate: todayISO(),
  projectStartDate: tomorrowISO(),
  projectAddress: '',
  foremanLead: '',
  materials: [],
  tools: [],
  notes: '',
};

const initialMaterial: MaterialItem = {
  quantity: 1,
  source: 'order',
  supplier: '',
  description: '',
};

const initialTool: ToolItem = {
  quantity: 1,
  source: 'inventory',
  supplier: '',
  description: '',
};

export default function RequisitionWizard() {
  const { t } = useLanguage();
  const wizard = useWizard<RequisitionData>(initialData, TOTAL_STEPS);
  const [currentMaterial, setCurrentMaterial] = useState<MaterialItem>({ ...initialMaterial });
  const [currentTool, setCurrentTool] = useState<ToolItem>({ ...initialTool });

  const pickJob = (number: string) => {
    const job = RECENT_JOBS.find(j => j.number === number);
    if (job) {
      wizard.setFormData(prev => ({
        ...prev,
        jobNumber: job.number,
        jobName: job.name,
        projectAddress: job.address || prev.projectAddress,
      }));
    } else {
      wizard.setField('jobNumber', number);
    }
  };

  const pickMaterial = (desc: string) => {
    const m = COMMON_MATERIALS.find(x => x.description === desc);
    if (m) {
      setCurrentMaterial(prev => ({
        ...prev,
        description: m.description,
        supplier: m.defaultSupplier || prev.supplier,
      }));
    } else {
      setCurrentMaterial(prev => ({ ...prev, description: desc }));
    }
  };

  const pickTool = (desc: string) => {
    const tool = COMMON_TOOLS.find(x => x.description === desc);
    if (tool) {
      setCurrentTool(prev => ({
        ...prev,
        description: tool.description,
        supplier: tool.defaultSupplier || prev.supplier,
      }));
    } else {
      setCurrentTool(prev => ({ ...prev, description: desc }));
    }
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

  const saveTool = () => {
    if (currentTool.description) {
      wizard.setFormData(prev => ({
        ...prev,
        tools: [...prev.tools, { ...currentTool }],
      }));
      setCurrentTool({ ...initialTool });
    }
  };

  const removeTool = (i: number) => {
    wizard.setFormData(prev => ({
      ...prev,
      tools: prev.tools.filter((_, idx) => idx !== i),
    }));
  };

  const loadSample = () => {
    wizard.setFormData(sampleRequisition);
    wizard.setIsComplete(true);
  };

  const canProceed = () => {
    switch (wizard.currentStep) {
      case 0: return !!wizard.formData.jobNumber || !!wizard.formData.jobName;
      case 1: return !!wizard.formData.originationDate;
      case 2: return !!wizard.formData.projectAddress;
      case 3: return !!wizard.formData.foremanLead;
      case 4: return wizard.formData.materials.length > 0 || !!currentMaterial.description;
      case 5: return true;
      case 6: return true;
      default: return true;
    }
  };

  const handleNext = () => {
    if (wizard.currentStep === 4 && currentMaterial.description) saveMaterial();
    if (wizard.currentStep === 5 && currentTool.description) saveTool();
    if (wizard.isLast) {
      wizard.setIsComplete(true);
    } else {
      wizard.goNext();
    }
  };

  if (wizard.isComplete) {
    return <RequisitionReport data={wizard.formData} onReset={wizard.reset} />;
  }

  return (
    <WizardShell
      title={t('requisition.title')}
      currentStep={wizard.currentStep}
      totalSteps={TOTAL_STEPS}
      onNext={handleNext}
      onBack={wizard.goBack}
      isFirst={wizard.isFirst}
      isLast={wizard.isLast}
      canProceed={canProceed()}
    >
      {/* Step 0: Job */}
      {wizard.currentStep === 0 && (
        <div className="space-y-4">
          <button
            onClick={loadSample}
            className="flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            <Sparkles size={16} />
            {t('common.tryDemo')}
          </button>
          <h2 className="text-2xl font-bold">{t('requisition.jobInfo')}</h2>
          <QuickPick
            options={RECENT_JOBS.map(j => ({
              value: j.number,
              label: j.name,
              sublabel: `#${j.number}`,
            }))}
            value={wizard.formData.jobNumber}
            onChange={pickJob}
            columns={2}
            otherSlot={
              <>
                <TextInput
                  value={wizard.formData.jobNumber}
                  onChange={(val) => wizard.setField('jobNumber', val)}
                  label={t('timecard.jobNumber')}
                />
                <TextInput
                  value={wizard.formData.jobName}
                  onChange={(val) => wizard.setField('jobName', val)}
                  label={t('timecard.jobName')}
                />
              </>
            }
          />
        </div>
      )}

      {/* Step 1: Dates */}
      {wizard.currentStep === 1 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">{t('requisition.dates')}</h2>
          <QuickPick
            options={[
              { value: todayISO(), label: t('common.today') },
              { value: yesterdayISO(), label: t('common.yesterday') },
            ]}
            value={wizard.formData.originationDate}
            onChange={(val) => wizard.setField('originationDate', val)}
            label={t('requisition.originDate')}
            columns={2}
            otherSlot={
              <DatePicker
                value={wizard.formData.originationDate}
                onChange={(val) => wizard.setField('originationDate', val)}
              />
            }
          />
          <QuickPick
            options={[
              { value: tomorrowISO(), label: t('common.tomorrow') },
              { value: nextWeekISO(), label: t('common.nextWeek') },
            ]}
            value={wizard.formData.projectStartDate}
            onChange={(val) => wizard.setField('projectStartDate', val)}
            label={t('requisition.startDate')}
            columns={2}
            otherSlot={
              <DatePicker
                value={wizard.formData.projectStartDate}
                onChange={(val) => wizard.setField('projectStartDate', val)}
              />
            }
          />
        </div>
      )}

      {/* Step 2: Address */}
      {wizard.currentStep === 2 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{t('requisition.whereIsIt')}</h2>
          <TextInput
            value={wizard.formData.projectAddress}
            onChange={(val) => wizard.setField('projectAddress', val)}
            label={t('requisition.address')}
          />
        </div>
      )}

      {/* Step 3: Foreman */}
      {wizard.currentStep === 3 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{t('requisition.whoLeads')}</h2>
          <SelectPicker
            options={EMPLOYEES.map(name => ({ value: name, label: name }))}
            value={wizard.formData.foremanLead}
            onChange={(val) => wizard.setField('foremanLead', val)}
            columns={2}
          />
        </div>
      )}

      {/* Step 4: Materials */}
      {wizard.currentStep === 4 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Package size={28} className="text-accent" />
            {t('requisition.whatMaterials')}
          </h2>
          {wizard.formData.materials.length > 0 && (
            <div className="space-y-2 rounded-2xl border border-border bg-white p-3">
              {wizard.formData.materials.map((m, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{m.description}</p>
                    <p className="text-xs text-muted">×{m.quantity} · {m.supplier || '—'}</p>
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
            <SelectPicker
              options={[
                { value: 'inventory', label: t('requisition.inventory') },
                { value: 'order', label: t('requisition.orderNew') },
              ]}
              value={currentMaterial.source}
              onChange={(val) => setCurrentMaterial(prev => ({ ...prev, source: val as 'inventory' | 'order' }))}
              label={t('requisition.source')}
              columns={2}
            />
          </div>
          <TextInput
            value={currentMaterial.supplier}
            onChange={(val) => setCurrentMaterial(prev => ({ ...prev, supplier: val }))}
            label={t('common.supplier')}
          />
          <BigButton onClick={saveMaterial} variant="accent" icon={<Plus size={20} />}>
            {t('common.addMore')}
          </BigButton>
        </div>
      )}

      {/* Step 5: Tools */}
      {wizard.currentStep === 5 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Wrench size={28} className="text-accent" />
            {t('requisition.whatTools')}
          </h2>
          {wizard.formData.tools.length > 0 && (
            <div className="space-y-2 rounded-2xl border border-border bg-white p-3">
              {wizard.formData.tools.map((tool, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{tool.description}</p>
                    <p className="text-xs text-muted">×{tool.quantity} · {tool.supplier || '—'}</p>
                  </div>
                  <button
                    onClick={() => removeTool(i)}
                    className="ml-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white text-muted active:bg-gray-200"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <QuickPick
            options={COMMON_TOOLS.map(tool => ({ value: tool.description, label: tool.description }))}
            value={currentTool.description}
            onChange={pickTool}
            label={t('common.commonItems')}
            columns={1}
            otherSlot={
              <TextInput
                value={currentTool.description}
                onChange={(val) => setCurrentTool(prev => ({ ...prev, description: val }))}
                label={t('common.description')}
              />
            }
          />

          <NumberInput
            value={currentTool.quantity}
            onChange={(val) => setCurrentTool(prev => ({ ...prev, quantity: val }))}
            label={t('common.quantity')}
            min={1}
          />
          <SelectPicker
            options={[
              { value: 'inventory', label: t('requisition.inventory') },
              { value: 'order', label: t('requisition.orderNew') },
            ]}
            value={currentTool.source}
            onChange={(val) => setCurrentTool(prev => ({ ...prev, source: val as 'inventory' | 'order' }))}
            label={t('requisition.source')}
          />
          <BigButton onClick={saveTool} variant="accent" icon={<Plus size={20} />}>
            {t('common.addMore')}
          </BigButton>
        </div>
      )}

      {/* Step 6: Notes */}
      {wizard.currentStep === 6 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{t('requisition.anythingElse')}</h2>
          <VoiceFirstField
            value={wizard.formData.notes}
            onChange={(val) => wizard.setField('notes', val)}
          />
        </div>
      )}
    </WizardShell>
  );
}

