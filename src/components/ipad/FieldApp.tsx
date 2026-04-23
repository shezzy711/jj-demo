'use client';

import { useState } from 'react';
import { theme as t } from '@/lib/theme';
import { findEmployee, findProject, projects, crewOnJob } from '@/lib/sampleData';
import type {
  ForemanDWO,
  RequisitionState,
  MileageLeg,
  TimecardEditMap,
  Project,
} from '@/lib/types/forms';
import FieldHome from './home/FieldHome';
import TechJobBoard from './tech/TechJobBoard';
import ClockOutStep from './steps/ClockOutStep';
import FieldTabBar from './tabs/FieldTabBar';
import ForemanJobBoard from './foreman/ForemanJobBoard';
import ForemanWizard from './foreman/ForemanWizard';
import ReqFlow from './req/ReqFlow';
import WeekScreen from './week/WeekScreen';

const emptyDWO: ForemanDWO = {
  scope: null,
  materials: [],
  photos: [],
  problems: null,
  customerSigned: false,
  customerSkipped: false,
  foremanSigned: false,
};
const emptyReq: RequisitionState = { materials: [], tools: [], notes: null };

interface FieldAppProps {
  mode: 'foreman' | 'tech';
  onClose: () => void;
}

type Screen = 'home' | 'job' | 'week';
type WizardState = { kind: 'dwo'; step: 'scope' | 'materials' | 'photos' | 'problems' | 'signoff' } | { kind: 'tech-clockout' } | null;

export default function FieldApp({ mode, onClose: _onClose }: FieldAppProps) {
  const [screen, setScreen] = useState<Screen>('home');
  const [activeJob, setActiveJob] = useState<Project | null>(null);
  const [wizard, setWizard] = useState<WizardState>(null);
  const [reqOpen, setReqOpen] = useState(false);
  const [fState, setFState] = useState<ForemanDWO>(emptyDWO);
  const [req, setReq] = useState<RequisitionState>(emptyReq);
  const [mileage, setMileage] = useState<MileageLeg[]>([]);
  const [tcEdits, setTcEdits] = useState<TimecardEditMap>({});

  const user = mode === 'foreman' ? findEmployee('e1')! : findEmployee('e4')!;
  const detected = findProject(user.jobId);
  const [clockedInTo, setClockedInTo] = useState(detected?.id ?? projects[0].id);
  const currentJob = activeJob || findProject(clockedInTo) || projects[0];
  const elapsed = '4h 02m';
  const crew = crewOnJob(currentJob.id);

  const wrap = (children: React.ReactNode) => (
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
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          paddingBottom: wizard || reqOpen ? 0 : 86,
        }}
      >
        {children}
      </div>
      {!wizard && !reqOpen && (
        <FieldTabBar current={screen} onChange={tab => { setScreen(tab); setActiveJob(null); }} />
      )}
    </div>
  );

  // Wizard / Req overlays render full-screen inside the iPad
  if (wizard?.kind === 'tech-clockout') {
    return wrap(<ClockOutStep onClose={() => { setWizard(null); setScreen('home'); setActiveJob(null); }} />);
  }
  if (wizard?.kind === 'dwo') {
    return wrap(
      <ForemanWizard
        step={wizard.step}
        fState={fState}
        setFState={setFState}
        user={user}
        project={currentJob}
        crewOnJob={crew}
        onClose={() => setWizard(null)}
      />,
    );
  }
  if (reqOpen) {
    return wrap(
      <ReqFlow
        req={req}
        setReq={setReq}
        project={currentJob}
        onClose={() => setReqOpen(false)}
      />,
    );
  }

  if (screen === 'home') {
    return wrap(
      <FieldHome
        user={user}
        clockedInTo={clockedInTo}
        onPickJob={p => {
          setClockedInTo(p.id);
          setActiveJob(p);
          setScreen('job');
        }}
        onOpenJob={p => {
          setActiveJob(p);
          setScreen('job');
        }}
      />,
    );
  }
  if (screen === 'job') {
    return wrap(
      mode === 'foreman' ? (
        <ForemanJobBoard
          project={currentJob}
          elapsed={elapsed}
          crewOnJob={crew}
          fState={fState}
          onBack={() => { setActiveJob(null); setScreen('home'); }}
          onOpenStep={step => setWizard({ kind: 'dwo', step })}
          onOpenReq={() => setReqOpen(true)}
        />
      ) : (
        <TechJobBoard
          project={currentJob}
          elapsed={elapsed}
          clockedInAt={user.clockedInAt ?? '—'}
          onBack={() => { setActiveJob(null); setScreen('home'); }}
          onClockOut={() => setWizard({ kind: 'tech-clockout' })}
        />
      ),
    );
  }
  if (screen === 'week') {
    return wrap(
      <WeekScreen
        user={user}
        mileage={mileage}
        setMileage={setMileage}
        tcEdits={tcEdits}
        setTcEdits={setTcEdits}
        onBack={() => setScreen('home')}
      />,
    );
  }
  return wrap(null);
}
