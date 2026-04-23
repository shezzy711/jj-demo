'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import { theme as t } from '@/lib/theme';

interface LangToggleProps {
  variant?: 'light' | 'dark';
}

export default function LangToggle({ variant = 'light' }: LangToggleProps) {
  const { lang, setLang } = useLanguage();
  const dark = variant === 'dark';
  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 14px',
        borderRadius: 999,
        background: dark ? 'rgba(255,255,255,0.08)' : t.card,
        border: `1.5px solid ${dark ? 'rgba(255,255,255,0.18)' : t.line}`,
        cursor: 'pointer',
        fontSize: 13,
        fontWeight: 700,
        color: dark ? '#FFFFFF' : t.ink,
        fontFamily: 'inherit',
      }}
    >
      <span>{lang === 'en' ? 'EN' : 'ES'}</span>
      <span style={{ fontSize: 11, fontWeight: 600, color: dark ? 'rgba(255,255,255,0.55)' : t.inkLight }}>
        / {lang === 'en' ? 'ES' : 'EN'}
      </span>
    </button>
  );
}
