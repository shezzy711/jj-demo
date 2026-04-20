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
import { EMPLOYEES, type RequisitionData, type MaterialItem, type ToolItem } from '@/lib/types/forms';
import { Wrench, Package, Plus } from 'lucide-react';

const TOTAL_STEPS = 7;

const initialData: RequisitionData = {
  jobNumber: '',
  jobName: '',
  originationDate: '',
  projectStartDate: '',
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

  const saveMaterial = () => {
    if (currentMaterial.description) {
      wizard.setFormData(prev => ({
        ...prev,
        materials: [...prev.materials, { ...currentMaterial }],
      }));
      setCurrentMaterial({ ...initialMaterial });
    }
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
    if (wizard.currentStep === 4 && currentMaterial.description) {
      saveMaterial();
    }
    if (wizard.currentStep === 5 && currentTool.description) {
      saveTool();
    }
    if (wizard.isLast) {
      wizard.setIsComplete(true);
    } else {
      wizard.goNext();
    }
  };

  if (wizard.isComplete) {
    return (
      <ConfirmationScreen title={t('requisition.title')} onReset={wizard.reset}>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted">{t('timecard.jobNumber')}</span>
            <span className="font-bold">{wizard.formData.jobNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">{t('timecard.jobName')}</span>
            <span className="font-bold">{wizard.formData.jobName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">{t('requisition.address')}</span>
            <span className="font-bold">{wizard.formData.projectAddress}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">{t('requisition.foreman')}</span>
            <span className="font-bold">{wizard.formData.foremanLead}</span>
          </div>

          {wizard.formData.materials.length > 0 && (
            <>
              <hr className="border-border" />
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Package size={18} /> {t('requisition.materials')}
              </h3>
              {wizard.formData.materials.map((m, i) => (
                <div key={i} className="flex justify-between py-1 border-b border-border last:border-0">
                  <span>{m.description}</span>
                  <span className="font-bold">x{m.quantity}</span>
                </div>
              ))}
            </>
          )}

          {wizard.formData.tools.length > 0 && (
            <>
              <hr className="border-border" />
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Wrench size={18} /> {t('requisition.tools')}
              </h3>
              {wizard.formData.tools.map((tool, i) => (
                <div key={i} className="flex justify-between py-1 border-b border-border last:border-0">
                  <span>{tool.description}</span>
                  <span className="font-bold">x{tool.quantity}</span>
                </div>
              ))}
            </>
          )}

          {wizard.formData.notes && (
            <>
              <hr className="border-border" />
              <div>
                <span className="text-muted text-sm">{t('common.notes')}</span>
                <p className="font-medium mt-1">{wizard.formData.notes}</p>
              </div>
            </>
          )}
        </div>
      </ConfirmationScreen>
    );
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
      {/* Step 0: Job info */}
      {wizard.currentStep === 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{t('requisition.jobInfo')}</h2>
          <TextInput
            value={wizard.formData.jobNumber}
            onChange={(val) => wizard.setField('jobNumber', val)}
            placeholder={t('timecard.jobNumber')}
            label={t('timecard.jobNumber')}
          />
          <TextInput
            value={wizard.formData.jobName}
            onChange={(val) => wizard.setField('jobName', val)}
            placeholder={t('timecard.jobName')}
            label={t('timecard.jobName')}
          />
        </div>
      )}

      {/* Step 1: Dates */}
      {wizard.currentStep === 1 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{t('requisition.dates')}</h2>
          <DatePicker
            value={wizard.formData.originationDate}
            onChange={(val) => wizard.setField('originationDate', val)}
            label={t('requisition.originDate')}
          />
          <DatePicker
            value={wizard.formData.projectStartDate}
            onChange={(val) => wizard.setField('projectStartDate', val)}
            label={t('requisition.startDate')}
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
            placeholder={t('requisition.address')}
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
          <SelectPicker
            options={[
              { value: 'inventory', label: t('requisition.inventory') },
              { value: 'order', label: t('requisition.orderNew') },
            ]}
            value={currentMaterial.source}
            onChange={(val) => setCurrentMaterial(prev => ({ ...prev, source: val as 'inventory' | 'order' }))}
            label={t('requisition.source')}
          />
          <TextInput
            value={currentMaterial.supplier}
            onChange={(val) => setCurrentMaterial(prev => ({ ...prev, supplier: val }))}
            placeholder={t('common.supplier')}
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
            <div className="rounded-xl bg-success/10 p-3 text-sm text-success font-medium">
              {wizard.formData.tools.length} tool{wizard.formData.tools.length !== 1 ? 's' : ''} added
            </div>
          )}
          <TextInput
            value={currentTool.description}
            onChange={(val) => setCurrentTool(prev => ({ ...prev, description: val }))}
            placeholder={t('common.description')}
            label={t('common.description')}
          />
          <NumberInput
            value={currentTool.quantity}
            onChange={(val) => setCurrentTool(prev => ({ ...prev, quantity: val }))}
            label={t('common.quantity')}
            min={1}
          />
          <TextInput
            value={currentTool.supplier}
            onChange={(val) => setCurrentTool(prev => ({ ...prev, supplier: val }))}
            placeholder={t('common.supplier')}
            label={t('common.supplier')}
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
          <TextInput
            value={wizard.formData.notes}
            onChange={(val) => wizard.setField('notes', val)}
            placeholder={t('common.notes')}
            multiline
          />
        </div>
      )}
    </WizardShell>
  );
}
