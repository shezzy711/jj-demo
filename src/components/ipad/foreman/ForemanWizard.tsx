'use client';

import VoiceStep from '../steps/VoiceStep';
import PhotosStep from '../steps/PhotosStep';
import ProblemsStep from '../steps/ProblemsStep';
import SignOffStep from '../steps/SignOffStep';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { SEEDED } from '@/lib/seededTranscripts';
import type { Employee, ForemanDWO, ParsedItem, Project } from '@/lib/types/forms';

type Step = 'scope' | 'materials' | 'photos' | 'problems' | 'signoff';

interface ForemanWizardProps {
  step: Step;
  fState: ForemanDWO;
  setFState: (val: ForemanDWO) => void;
  user: Employee;
  project: Project;
  crewOnJob: Employee[];
  onClose: () => void;
}

export default function ForemanWizard({
  step,
  fState,
  setFState,
  user,
  project,
  crewOnJob,
  onClose,
}: ForemanWizardProps) {
  const { t: tt, lang } = useLanguage();

  if (step === 'scope') {
    return (
      <VoiceStep
        title={tt('foreman.scope.title')}
        subtitle={tt('foreman.scope.subtitle')}
        mode="prose"
        seededTranscript={SEEDED.scope[lang]}
        existing={fState.scope}
        onSave={val => {
          setFState({ ...fState, scope: val as string });
          onClose();
        }}
        onClose={onClose}
      />
    );
  }
  if (step === 'materials') {
    return (
      <VoiceStep
        title={tt('foreman.materials.title')}
        subtitle={tt('foreman.materials.subtitle')}
        mode="items"
        withAmount
        seededItems={SEEDED.dwoMaterials}
        existing={fState.materials.length > 0 ? fState.materials : null}
        onSave={val => {
          setFState({ ...fState, materials: val as ParsedItem[] });
          onClose();
        }}
        onClose={onClose}
      />
    );
  }
  if (step === 'photos') {
    return (
      <PhotosStep
        existing={fState.photos}
        onSave={val => {
          setFState({ ...fState, photos: val });
          onClose();
        }}
        onClose={onClose}
      />
    );
  }
  if (step === 'problems') {
    return (
      <ProblemsStep
        existing={fState.problems}
        onSave={val => {
          setFState({ ...fState, problems: val });
          onClose();
        }}
        onClose={onClose}
      />
    );
  }
  if (step === 'signoff') {
    return (
      <SignOffStep
        fState={fState}
        setFState={setFState}
        crewOnJob={crewOnJob}
        user={user}
        project={project}
        onClose={onClose}
      />
    );
  }
  return null;
}
