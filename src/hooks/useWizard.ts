'use client';

import { useState, useCallback } from 'react';

export function useWizard<T extends object>(initialData: T, totalSteps: number) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<T>(initialData);
  const [isComplete, setIsComplete] = useState(false);

  const setField = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  const goNext = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsComplete(true);
    }
  }, [currentStep, totalSteps]);

  const goBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, totalSteps - 1)));
  }, [totalSteps]);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setFormData(initialData);
    setIsComplete(false);
  }, [initialData]);

  return {
    currentStep,
    formData,
    setField,
    setFormData,
    goNext,
    goBack,
    goToStep,
    reset,
    isFirst: currentStep === 0,
    isLast: currentStep === totalSteps - 1,
    isComplete,
    setIsComplete,
  };
}
