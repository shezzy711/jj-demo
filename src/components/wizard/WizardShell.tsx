'use client';

import { type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import TopBar from '@/components/ui/TopBar';
import StepIndicator from '@/components/ui/StepIndicator';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface WizardShellProps {
  title: string;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
  canProceed?: boolean;
  children: ReactNode;
  hideNav?: boolean;
}

export default function WizardShell({
  title,
  currentStep,
  totalSteps,
  onNext,
  onBack,
  isFirst,
  isLast,
  canProceed = true,
  children,
  hideNav = false,
}: WizardShellProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-1 flex-col min-h-screen bg-background">
      <TopBar title={title} />
      <StepIndicator current={currentStep} total={totalSteps} />

      <div className="flex-1 px-5 py-4 overflow-y-auto">
        <div className="fade-in" key={currentStep}>
          {children}
        </div>
      </div>

      {!hideNav && (
        <div className="sticky bottom-0 flex gap-3 bg-background px-5 py-4 border-t border-border">
          {!isFirst && (
            <button
              onClick={onBack}
              className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-border bg-white text-lg font-semibold text-foreground active:bg-gray-50"
            >
              <ArrowLeft size={20} />
              {t('common.back')}
            </button>
          )}
          <button
            onClick={onNext}
            disabled={!canProceed}
            className={`
              flex h-14 items-center justify-center gap-2 rounded-2xl text-lg font-semibold text-white active:opacity-90
              disabled:opacity-40 disabled:pointer-events-none
              ${isLast ? 'bg-success' : 'bg-primary'}
              ${isFirst ? 'flex-1' : 'flex-[2]'}
            `}
          >
            {isLast ? (
              <>
                <Check size={20} />
                {t('common.done')}
              </>
            ) : (
              <>
                {t('common.next')}
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
