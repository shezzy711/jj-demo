'use client';

import { useState } from 'react';
import PMSidebar, { type PMSection } from './PMSidebar';
import LangToggle from './LangToggle';
import EmployeesList from './employees/EmployeesList';
import PersonDetail from './employees/PersonDetail';
import JobsList from './jobs/JobsList';
import JobDetail from './jobs/JobDetail';
import SettingsPage from './settings/SettingsPage';
import IPadModal from '@/components/ipad/IPadModal';
import FieldApp from '@/components/ipad/FieldApp';
import PrintReportOverlay from '@/components/report/PrintReportOverlay';
import { theme as t } from '@/lib/theme';
import { findEmployee, findProject } from '@/lib/sampleData';

export default function PMDesktop() {
  const [section, setSection] = useState<PMSection>('employees');
  const [personId, setPersonId] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [iPadMode, setIPadMode] = useState<'foreman' | 'tech' | null>(null);
  const [printingPersonId, setPrintingPersonId] = useState<string | null>(null);

  const switchSection = (s: PMSection) => {
    setSection(s);
    setPersonId(null);
    setJobId(null);
  };

  const printingEmp = printingPersonId ? findEmployee(printingPersonId) : null;
  const personEmp = personId ? findEmployee(personId) : null;
  const jobProject = jobId ? findProject(jobId) : null;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: t.bg,
        color: t.ink,
        display: 'flex',
      }}
    >
      <PMSidebar
        section={section}
        onSection={switchSection}
        onOpenForeman={() => setIPadMode('foreman')}
        onOpenTech={() => setIPadMode('tech')}
      />

      <main style={{ flex: 1, padding: '32px 44px', maxWidth: 1400 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 18 }}>
          <LangToggle />
        </div>

        {section === 'employees' && !personEmp && (
          <EmployeesList onOpen={id => setPersonId(id)} />
        )}
        {section === 'employees' && personEmp && (
          <PersonDetail
            emp={personEmp}
            onBack={() => setPersonId(null)}
            onPrint={() => setPrintingPersonId(personEmp.id)}
          />
        )}

        {section === 'jobs' && !jobProject && (
          <JobsList onOpen={id => setJobId(id)} />
        )}
        {section === 'jobs' && jobProject && (
          <JobDetail project={jobProject} onBack={() => setJobId(null)} />
        )}

        {section === 'settings' && <SettingsPage />}
      </main>

      {iPadMode && (
        <IPadModal onClose={() => setIPadMode(null)}>
          <FieldApp mode={iPadMode} onClose={() => setIPadMode(null)} />
        </IPadModal>
      )}

      {printingEmp && (
        <PrintReportOverlay onClose={() => setPrintingPersonId(null)} employee={printingEmp} />
      )}
    </div>
  );
}
