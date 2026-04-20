'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface TopBarProps {
  title: string;
  showBack?: boolean;
}

export default function TopBar({ title, showBack = true }: TopBarProps) {
  const router = useRouter();
  const { lang, setLang } = useLanguage();

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between bg-primary px-4 py-3 text-white shadow-md">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => router.push('/')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 active:bg-white/30"
          >
            <ArrowLeft size={24} />
          </button>
        )}
        <h1 className="text-lg font-bold">{title}</h1>
      </div>

      <button
        onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
        className="flex h-10 items-center gap-2 rounded-full bg-white/20 px-4 font-bold active:bg-white/30"
      >
        <span className="text-xl">{lang === 'en' ? '🇺🇸' : '🇲🇽'}</span>
        <span className="text-sm">{lang === 'en' ? 'EN' : 'ES'}</span>
      </button>
    </div>
  );
}
