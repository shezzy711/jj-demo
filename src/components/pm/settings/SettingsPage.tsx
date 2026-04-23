'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { theme as t } from '@/lib/theme';
import { companySettings } from '@/lib/branding';

export default function SettingsPage() {
  const { t: tt } = useLanguage();
  const [mileage, setMileage] = useState(companySettings.mileageRate.toString());
  const [po, setPo] = useState((companySettings.poMarkup * 100).toString());

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontSize: 36,
            fontWeight: 700,
            letterSpacing: '-0.03em',
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          {tt('pm.settings.title')}
        </h1>
        <div style={{ fontSize: 14, color: t.inkMuted, marginTop: 8 }}>{tt('pm.settings.subtitle')}</div>
      </div>

      <div
        style={{
          background: t.card,
          border: `1px solid ${t.line}`,
          borderRadius: 16,
          padding: 26,
          boxShadow: t.shadowSm,
          maxWidth: 580,
          marginBottom: 16,
        }}
      >
        <SettingField
          label={tt('pm.settings.mileageRate')}
          help={tt('pm.settings.mileageHelp')}
          value={mileage}
          onChange={setMileage}
          prefix="$"
          suffix="/ mi"
        />
      </div>
      <div
        style={{
          background: t.card,
          border: `1px solid ${t.line}`,
          borderRadius: 16,
          padding: 26,
          boxShadow: t.shadowSm,
          maxWidth: 580,
        }}
      >
        <SettingField
          label={tt('pm.settings.poMarkup')}
          help={tt('pm.settings.poHelp')}
          value={po}
          onChange={setPo}
          suffix="%"
        />
      </div>
    </div>
  );
}

function SettingField({
  label,
  help,
  value,
  onChange,
  prefix,
  suffix,
}: {
  label: string;
  help: string;
  value: string;
  onChange: (val: string) => void;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 13.5,
          fontWeight: 700,
          color: t.ink,
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 12.5, color: t.inkLight, marginBottom: 14, lineHeight: 1.5 }}>{help}</div>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0,
          background: t.bg,
          border: `1.5px solid ${t.lineStrong}`,
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        {prefix && (
          <span
            style={{
              padding: '14px 12px',
              fontSize: 16,
              fontWeight: 700,
              color: t.inkMuted,
              borderRight: `1px solid ${t.lineStrong}`,
            }}
          >
            {prefix}
          </span>
        )}
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          inputMode="decimal"
          style={{
            border: 'none',
            background: 'transparent',
            padding: '14px 12px',
            fontSize: 16,
            fontWeight: 700,
            fontVariantNumeric: 'tabular-nums',
            color: t.ink,
            width: 110,
            outline: 'none',
          }}
        />
        {suffix && (
          <span
            style={{
              padding: '14px 12px',
              fontSize: 14,
              color: t.inkMuted,
              fontWeight: 600,
              borderLeft: `1px solid ${t.lineStrong}`,
            }}
          >
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
