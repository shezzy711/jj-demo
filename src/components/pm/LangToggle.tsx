'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import { theme as t } from '@/lib/theme';

export default function LangToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '7px 14px',
        borderRadius: 999,
        background: t.card,
        border: `1px solid ${t.line}`,
        cursor: 'pointer',
        fontSize: 12.5,
        fontWeight: 700,
        color: t.ink,
      }}
    >
      <span style={{ fontSize: 14 }}>{lang === 'en' ? '🇺🇸' : '🇲🇽'}</span>
      {lang.toUpperCase()}
    </button>
  );
}
