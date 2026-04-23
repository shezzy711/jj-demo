'use client';

import { useState } from 'react';
import { Briefcase } from 'lucide-react';
import IPadShell from '@/components/ipad/IPadShell';
import FieldApp, { type SubmittedForm } from '@/components/ipad/FieldApp';
import PMDesktop from '@/components/pm/PMDesktop';
import LangToggle from '@/components/shared/LangToggle';
import PrintReportOverlay, {
  type ReportPayload,
} from '@/components/report/PrintReportOverlay';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { theme as t } from '@/lib/theme';

type View = 'ipad' | 'pm';

export default function Page() {
  const { t: tt } = useLanguage();
  const [view, setView] = useState<View>('ipad');
  const [report, setReport] = useState<ReportPayload | null>(null);

  const handleSubmit = (form: SubmittedForm) => {
    const titleByType: Record<SubmittedForm['type'], string> = {
      timecard:    tt('home.tile.timecard'),
      mileage:     tt('home.tile.mileage'),
      requisition: tt('home.tile.requisition'),
      workorder:   tt('home.tile.workorder'),
    };
    setReport({ ...form, title: titleByType[form.type] } as ReportPayload);
  };

  if (view === 'pm') {
    return (
      <>
        <PMDesktop onBackToField={() => setView('ipad')} />
        {report && <PrintReportOverlay payload={report} onClose={() => setReport(null)} />}
      </>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: t.bg,
        // subtle warm radial so the iPad feels seated
        backgroundImage: `radial-gradient(circle at 50% 0%, ${t.bgSoft} 0%, ${t.bg} 55%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Slim toolbar above the iPad */}
      <div
        style={{
          width: '100%',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: 1200,
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: t.inkLight,
          }}
        >
          J&amp;J Plumbing · Demo
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <LangToggle />
          <button
            onClick={() => setView('pm')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 14px',
              borderRadius: 999,
              background: t.card,
              border: `1.5px solid ${t.line}`,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 700,
              color: t.ink,
              fontFamily: 'inherit',
            }}
          >
            <Briefcase size={14} />
            {tt('view.office')}
          </button>
        </div>
      </div>

      {/* iPad fills the rest of the viewport */}
      <div
        style={{
          flex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 20px 24px',
        }}
      >
        <IPadShell>
          <FieldApp onSubmit={handleSubmit} />
        </IPadShell>
      </div>

      {report && <PrintReportOverlay payload={report} onClose={() => setReport(null)} />}
    </div>
  );
}
