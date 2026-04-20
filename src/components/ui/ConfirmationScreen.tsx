'use client';

import { type ReactNode } from 'react';
import { CheckCircle, RotateCcw, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import TopBar from './TopBar';
import BigButton from './BigButton';

interface ConfirmationScreenProps {
  title: string;
  onReset: () => void;
  children?: ReactNode;
}

export default function ConfirmationScreen({ title, onReset, children }: ConfirmationScreenProps) {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <div className="flex flex-1 flex-col min-h-screen bg-background">
      <TopBar title={title} showBack={false} />

      <div className="flex-1 px-5 py-6 overflow-y-auto">
        {/* Success Banner */}
        <div className="flex flex-col items-center gap-3 py-6 fade-in">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
            <CheckCircle size={48} className="text-success" />
          </div>
          <h2 className="text-2xl font-bold text-success">{t('common.submitted')}</h2>
        </div>

        {/* Summary Content */}
        {children && (
          <div className="mt-4 rounded-2xl border border-border bg-white p-5 shadow-sm">
            {children}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 px-5 py-4 border-t border-border">
        <BigButton
          onClick={onReset}
          variant="outline"
          icon={<RotateCcw size={20} />}
          fullWidth
        >
          {t('common.addAnother')}
        </BigButton>
        <BigButton
          onClick={() => router.push('/')}
          variant="primary"
          icon={<Home size={20} />}
          fullWidth
        >
          Home
        </BigButton>
      </div>
    </div>
  );
}
