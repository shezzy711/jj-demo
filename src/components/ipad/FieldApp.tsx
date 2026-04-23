'use client';

import { useState } from 'react';
import FieldHome, { type FormKind } from './FieldHome';
import TimecardWizard from './forms/TimecardWizard';
import MileageWizard from './forms/MileageWizard';
import RequisitionWizard from './forms/RequisitionWizard';
import WorkOrderWizard from './forms/WorkOrderWizard';
import { findEmployee } from '@/lib/sampleData';
import type {
  TimecardData,
  MileageData,
  RequisitionData,
  WorkOrderData,
} from '@/lib/types/forms';
import { theme as t } from '@/lib/theme';

export type SubmittedForm =
  | { type: 'timecard';    data: TimecardData }
  | { type: 'mileage';     data: MileageData }
  | { type: 'requisition'; data: RequisitionData }
  | { type: 'workorder';   data: WorkOrderData };

interface FieldAppProps {
  onSubmit: (form: SubmittedForm) => void;
}

export default function FieldApp({ onSubmit }: FieldAppProps) {
  const [active, setActive] = useState<FormKind | null>(null);
  // Demo user — same person for the whole iPad walkthrough
  const user = findEmployee('e4')!; // Tony Pham
  const greeting = user.name.split(' ')[0];

  const back = () => setActive(null);

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: t.bg,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ flex: 1, overflow: 'auto' }}>
        {active === null && <FieldHome greetingName={greeting} onPick={setActive} />}
        {active === 'timecard' && (
          <TimecardWizard
            user={user}
            onClose={back}
            onSubmit={data => { setActive(null); onSubmit({ type: 'timecard', data }); }}
          />
        )}
        {active === 'mileage' && (
          <MileageWizard
            user={user}
            onClose={back}
            onSubmit={data => { setActive(null); onSubmit({ type: 'mileage', data }); }}
          />
        )}
        {active === 'requisition' && (
          <RequisitionWizard
            user={user}
            onClose={back}
            onSubmit={data => { setActive(null); onSubmit({ type: 'requisition', data }); }}
          />
        )}
        {active === 'workorder' && (
          <WorkOrderWizard
            user={user}
            onClose={back}
            onSubmit={data => { setActive(null); onSubmit({ type: 'workorder', data }); }}
          />
        )}
      </div>
    </div>
  );
}
