'use client';

import { X, Printer } from 'lucide-react';
import TimecardReport from './TimecardReport';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { theme as t } from '@/lib/theme';
import type { Employee, TimecardData } from '@/lib/types/forms';

interface PrintReportOverlayProps {
  employee: Employee;
  onClose: () => void;
}

// Build a TimecardData from the demo's clock-in rows for this employee.
// (PersonTimecard renders the same data; we just package it for the printable report.)
function buildTimecard(emp: Employee): TimecardData {
  return {
    employeeName: emp.name,
    weekEnding: 'Apr 24, 2026',
    entries: [
      { dayOfWeek: 'Monday',    date: 'Apr 20', jobNumber: 'MV-2401', jobName: 'Mountain View Hospital', timeIn: '7:58',  timeOut: '16:32', lunch: true, totalHours: 8.0 },
      { dayOfWeek: 'Tuesday',   date: 'Apr 21', jobNumber: 'MV-2401', jobName: 'Mountain View Hospital', timeIn: '8:02',  timeOut: '16:45', lunch: true, totalHours: 8.2 },
      { dayOfWeek: 'Wednesday', date: 'Apr 22', jobNumber: 'MV-2401', jobName: 'Mountain View Hospital', timeIn: '8:04',  timeOut: '12:08', lunch: false, totalHours: 4.1 },
    ],
  };
}

export default function PrintReportOverlay({ employee, onClose }: PrintReportOverlayProps) {
  const { t: tt } = useLanguage();
  const data = buildTimecard(employee);

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15,35,64,0.6)',
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        backdropFilter: 'blur(6px)',
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: 'min(900px, 100%)',
          height: 'min(95vh, 1100px)',
          background: t.bg,
          borderRadius: 18,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
        }}
      >
        <div
          className="no-print"
          style={{
            padding: '14px 22px',
            borderBottom: `1px solid ${t.line}`,
            background: t.card,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <button
            onClick={onClose}
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: t.bg,
              border: `1px solid ${t.line}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={16} color={t.ink} />
          </button>
          <div style={{ flex: 1, fontSize: 14, fontWeight: 700 }}>
            {tt('report.completed')} · {employee.name}
          </div>
          <button
            onClick={handlePrint}
            style={{
              padding: '10px 16px',
              borderRadius: 10,
              background: t.navy,
              color: '#fff',
              border: 'none',
              fontSize: 13.5,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Printer size={14} /> {tt('common.print')}
          </button>
        </div>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <TimecardReport data={data} onReset={onClose} embedded />
        </div>
      </div>
    </div>
  );
}
