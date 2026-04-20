'use client';

import { Clock, Wrench, Car, ClipboardList } from 'lucide-react';
import IconCard from '@/components/ui/IconCard';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function Dashboard() {
  const { lang, setLang, t } = useLanguage();

  return (
    <div className="flex flex-1 flex-col bg-background">
      {/* Header */}
      <div className="bg-primary px-6 pb-8 pt-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div />
          <button
            onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
            className="flex h-10 items-center gap-2 rounded-full bg-white/20 px-4 font-bold active:bg-white/30"
          >
            <span className="text-xl">{lang === 'en' ? '🇺🇸' : '🇲🇽'}</span>
            <span className="text-sm">{lang === 'en' ? 'EN' : 'ES'}</span>
          </button>
        </div>
        <h1 className="text-3xl font-bold">{t('app.title')}</h1>
        <p className="text-white/80 text-lg mt-1">{t('app.subtitle')}</p>
      </div>

      {/* Form Cards */}
      <div className="flex-1 px-4 py-6 -mt-4">
        <div className="grid grid-cols-2 gap-4">
          <IconCard
            href="/timecard"
            icon={<Clock size={32} className="text-white" />}
            title={t('dashboard.timecard')}
            description={t('dashboard.timecard.desc')}
            color="#1E40AF"
          />
          <IconCard
            href="/requisition"
            icon={<Wrench size={32} className="text-white" />}
            title={t('dashboard.requisition')}
            description={t('dashboard.requisition.desc')}
            color="#EA580C"
          />
          <IconCard
            href="/mileage"
            icon={<Car size={32} className="text-white" />}
            title={t('dashboard.mileage')}
            description={t('dashboard.mileage.desc')}
            color="#16A34A"
          />
          <IconCard
            href="/workorder"
            icon={<ClipboardList size={32} className="text-white" />}
            title={t('dashboard.workorder')}
            description={t('dashboard.workorder.desc')}
            color="#7C3AED"
          />
        </div>
      </div>
    </div>
  );
}
