'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Printer, Home, RotateCcw } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { COMPANY } from '@/lib/branding';

interface ReportShellProps {
  formTitle: string;
  badge?: string;
  onReset: () => void;
  embedded?: boolean;
  children: ReactNode;
}

export default function ReportShell({ formTitle, badge, onReset, embedded, children }: ReportShellProps) {
  const router = useRouter();
  const { t } = useLanguage();

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  return (
    <div className="flex flex-1 flex-col min-h-screen bg-background">
      {/* Action bar (hidden in print and when embedded inside an overlay) */}
      {!embedded && (
        <div className="no-print sticky top-0 z-10 flex items-center gap-2 border-b border-border bg-white px-4 py-3 shadow-sm">
          <button
            onClick={() => router.push('/')}
            className="flex h-11 items-center gap-2 rounded-xl border-2 border-border px-4 text-sm font-semibold active:bg-gray-50"
          >
            <Home size={16} />
            {t('common.home')}
          </button>
          <div className="flex-1 text-center text-sm font-semibold text-muted">
            {t('report.completed')}
          </div>
          <button
            onClick={onReset}
            className="flex h-11 items-center gap-2 rounded-xl border-2 border-border px-4 text-sm font-semibold active:bg-gray-50"
          >
            <RotateCcw size={16} />
            {t('common.startOver')}
          </button>
          <button
            onClick={handlePrint}
            className="flex h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white active:bg-primary-light"
          >
            <Printer size={16} />
            {t('common.print')}
          </button>
        </div>
      )}

      {/* Printable sheet */}
      <div className="flex-1 overflow-y-auto bg-gray-100 px-4 py-6 print:bg-white print:p-0">
        <div className="report-sheet mx-auto max-w-3xl bg-white p-6 shadow-md print:max-w-none print:shadow-none print:p-0">
          {/* Company header */}
          <div className="mb-4 flex items-start justify-between border-b-2 border-foreground pb-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{COMPANY.name}</h1>
              <p className="text-xs text-muted leading-snug">
                {COMPANY.remitAddress}<br />
                {COMPANY.remitCity}<br />
                {COMPANY.phone} · {COMPANY.fax}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold uppercase tracking-wide">{formTitle}</p>
              {badge && (
                <span className="mt-1 inline-block rounded-md bg-primary px-2 py-0.5 text-xs font-semibold uppercase text-white">
                  {badge}
                </span>
              )}
              <p className="mt-2 text-xs text-muted">
                {COMPANY.license}<br />
                {COMPANY.bondLimit}
              </p>
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
