'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import WizardHeader from './WizardHeader';
import SignaturePad from '../shared/SignaturePad';
import Avatar from '@/components/shared/Avatar';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { format } from '@/lib/i18n/translations';
import { theme as t } from '@/lib/theme';
import { companySettings } from '@/lib/branding';
import type { Employee, ForemanDWO, Project } from '@/lib/types/forms';

interface SignOffStepProps {
  fState: ForemanDWO;
  setFState: (val: ForemanDWO) => void;
  crewOnJob: Employee[];
  user: Employee;
  project: Project;
  onClose: () => void;
}

export default function SignOffStep({ fState, setFState, crewOnJob, user, project, onClose }: SignOffStepProps) {
  const { t: tt } = useLanguage();
  const [custSigned, setCustSigned] = useState(fState.customerSigned);
  const [skipCust, setSkipCust] = useState(fState.customerSkipped);
  const [foremanSigned, setForemanSigned] = useState(fState.foremanSigned);

  const materialsSum = fState.materials.reduce((s, m) => s + (m.amount || 0) * m.qty, 0);
  const laborSum = crewOnJob.reduce((s, e) => s + e.rate * 8.0, 0);
  const subtotal = materialsSum + laborSum;
  const po = subtotal * companySettings.poMarkup;
  const jobTotal = subtotal + po;

  const customerName = project.siteContact.split(',')[0];
  const canSubmit = foremanSigned && (custSigned || skipCust);

  const handleSubmit = () => {
    setFState({
      ...fState,
      customerSigned: custSigned,
      customerSkipped: skipCust,
      foremanSigned,
      signedAt: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    });
    onClose();
  };

  return (
    <>
      <WizardHeader title={tt('signoff.title')} subtitle={tt('signoff.subtitle')} onClose={onClose} />

      <div style={{ flex: 1, overflow: 'auto', padding: '20px 22px 130px' }}>
        <div
          style={{
            fontSize: 11,
            color: t.inkLight,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontWeight: 700,
            marginBottom: 10,
          }}
        >
          {tt('signoff.crewToday')}
        </div>
        <div
          style={{
            background: t.card,
            border: `1px solid ${t.line}`,
            borderRadius: 14,
            overflow: 'hidden',
            marginBottom: 16,
            boxShadow: t.shadowSm,
          }}
        >
          {crewOnJob.length === 0 && (
            <div style={{ padding: '14px 14px', fontSize: 13, color: t.inkLight }}>
              No crew clocked in.
            </div>
          )}
          {crewOnJob.map((e, i) => (
            <div
              key={e.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                borderTop: i ? `1px solid ${t.line}` : 'none',
              }}
            >
              <Avatar name={e.name} size={32} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{e.name}</div>
                <div style={{ fontSize: 11.5, color: t.inkLight }}>
                  {tt('common.since').toLowerCase()} {e.clockedInAt}
                </div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                ~8.0 h
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: t.navy,
            color: '#fff',
            borderRadius: 14,
            padding: 18,
            marginBottom: 16,
            boxShadow: t.shadowMd,
          }}
        >
          <div
            style={{
              fontSize: 11,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontWeight: 700,
              opacity: 0.7,
              marginBottom: 10,
            }}
          >
            {tt('signoff.todaysTotal')}
          </div>
          {(
            [
              [tt('signoff.materials'), `$${materialsSum.toFixed(2)}`],
              [tt('signoff.labor'), `$${laborSum.toFixed(2)}`],
              [format(tt('signoff.poMarkup'), { pct: (companySettings.poMarkup * 100).toFixed(0) }), `$${po.toFixed(2)}`],
            ] as [string, string][]
          ).map(([k, v], i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '7px 0',
                borderTop: i ? '1px solid rgba(255,255,255,0.15)' : 'none',
                fontSize: 13.5,
                color: 'rgba(255,255,255,0.8)',
              }}
            >
              <span>{k}</span>
              <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: '#fff' }}>{v}</span>
            </div>
          ))}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              paddingTop: 12,
              marginTop: 8,
              borderTop: '1.5px solid rgba(255,255,255,0.3)',
            }}
          >
            <span style={{ fontSize: 14.5, fontWeight: 700 }}>{tt('signoff.jobTotal')}</span>
            <span
              style={{
                fontSize: 26,
                fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '-0.02em',
              }}
            >
              ${jobTotal.toFixed(2)}
            </span>
          </div>
        </div>

        <SignaturePad
          label={tt('signoff.foremanSignature')}
          signed={foremanSigned}
          onToggle={() => setForemanSigned(!foremanSigned)}
          signer={
            foremanSigned
              ? `${user.name} · ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
              : null
          }
        />
        <div style={{ height: 12 }} />
        <SignaturePad
          label={tt('signoff.customerSignature')}
          signed={custSigned}
          skipped={skipCust}
          onToggle={() => {
            setCustSigned(!custSigned);
            setSkipCust(false);
          }}
          onSkip={() => {
            setSkipCust(!skipCust);
            setCustSigned(false);
          }}
          signer={custSigned ? customerName : null}
          canSkip
        />
      </div>

      <div
        style={{
          padding: '14px 22px 22px',
          background: t.card,
          borderTop: `1px solid ${t.line}`,
        }}
      >
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          style={{
            width: '100%',
            padding: 20,
            borderRadius: 14,
            background: canSubmit ? t.accent : t.bgSoft,
            color: canSubmit ? '#fff' : t.inkLight,
            border: 'none',
            fontSize: 16,
            fontWeight: 700,
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            boxShadow: canSubmit ? '0 4px 14px rgba(200,85,61,0.35)' : 'none',
          }}
        >
          <Send size={18} strokeWidth={2.5} /> {tt('signoff.submit')}
        </button>
      </div>
    </>
  );
}
