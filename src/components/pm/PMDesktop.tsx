'use client';

import { useState } from 'react';
import { Tablet } from 'lucide-react';
import PMSidebar, { type PMSection } from './PMSidebar';
import LangToggle from '@/components/shared/LangToggle';
import EmployeesList from './employees/EmployeesList';
import PersonDetail from './employees/PersonDetail';
import JobsList from './jobs/JobsList';
import JobDetail from './jobs/JobDetail';
import SettingsPage from './settings/SettingsPage';
import PrintReportOverlay, {
  type ReportPayload,
  buildTimecardForEmployee,
} from '@/components/report/PrintReportOverlay';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { theme as t } from '@/lib/theme';
import { findEmployee, findProject } from '@/lib/sampleData';

interface PMDesktopProps {
  onBackToField: () => void;
}

export default function PMDesktop({ onBackToField }: PMDesktopProps) {
  const { t: tt } = useLanguage();
  const [section, setSection] = useState<PMSection>('employees');
  const [personId, setPersonId] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [report, setReport] = useState<ReportPayload | null>(null);

  const switchSection = (s: PMSection) => {
    setSection(s);
    setPersonId(null);
    setJobId(null);
  };

  const personEmp = personId ? findEmployee(personId) : null;
  const jobProject = jobId ? findProject(jobId) : null;

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
      <PMSidebar section={section} onSection={switchSection} />

      <main style={{ flex: 1, padding: '32px 44px', maxWidth: 1400 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginBottom: 18 }}>
          <LangToggle />
          <button
            onClick={onBackToField}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 14px',
              borderRadius: 999,
              background: t.accent,
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 700,
              color: '#fff',
              fontFamily: 'inherit',
              boxShadow: '0 4px 14px rgba(200,85,61,0.3)',
            }}
          >
            <Tablet size={14} />
            {tt('view.backToField')}
          </button>
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

      {report && <PrintReportOverlay payload={report} onClose={() => setReport(null)} />}
    </div>
  );
}
