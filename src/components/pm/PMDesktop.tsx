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
import FieldApp, { type SubmittedForm } from '@/components/ipad/FieldApp';
import PrintReportOverlay, {
  type ReportPayload,
  buildTimecardForEmployee,
} from '@/components/report/PrintReportOverlay';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { theme as t } from '@/lib/theme';
import { findEmployee, findProject } from '@/lib/sampleData';

export default function PMDesktop() {
  const { t: tt } = useLanguage();
  const [section, setSection] = useState<PMSection>('employees');
  const [personId, setPersonId] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [iPadOpen, setIPadOpen] = useState(false);
  const [report, setReport] = useState<ReportPayload | null>(null);

  const switchSection = (s: PMSection) => {
    setSection(s);
    setPersonId(null);
    setJobId(null);
  };

  const personEmp = personId ? findEmployee(personId) : null;
  const jobProject = jobId ? findProject(jobId) : null;

  // When the iPad submits a form, close the device modal and show the
  // restyled Excel-style filled paper form on top of the desktop.
  const handleIPadSubmit = (form: SubmittedForm) => {
    setIPadOpen(false);
    const titleByType: Record<SubmittedForm['type'], string> = {
      timecard:    tt('home.tile.timecard'),
      mileage:     tt('home.tile.mileage'),
      requisition: tt('home.tile.requisition'),
      workorder:   tt('home.tile.workorder'),
    };
    setReport({ ...form, title: titleByType[form.type] } as ReportPayload);
  };

  // PM-side "Print this week" — synthesises a TimecardData from sample rows
  const handlePrintEmployee = (id: string) => {
    const emp = findEmployee(id);
    if (!emp) return;
    setReport({
      type: 'timecard',
      title: tt('home.tile.timecard'),
      data: buildTimecardForEmployee(emp),
    });
  };

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
        onOpenIPad={() => setIPadOpen(true)}
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
            onPrint={() => handlePrintEmployee(personEmp.id)}
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

      {iPadOpen && (
        <IPadModal onClose={() => setIPadOpen(false)}>
          <FieldApp onSubmit={handleIPadSubmit} />
        </IPadModal>
      )}

      {report && <PrintReportOverlay payload={report} onClose={() => setReport(null)} />}
    </div>
  );
}
