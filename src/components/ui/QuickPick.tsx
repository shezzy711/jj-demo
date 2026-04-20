'use client';

import { useState, type ReactNode } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export interface QuickPickOption<T extends string | number = string> {
  value: T;
  label: string;
  sublabel?: string;
  icon?: ReactNode;
}

interface QuickPickProps<T extends string | number> {
  options: QuickPickOption<T>[];
  value: T | undefined;
  onChange: (value: T) => void;
  label?: string;
  columns?: 1 | 2 | 3 | 4;
  /** When provided, an "Other" tile is appended; tapping reveals these inputs below the grid. */
  otherSlot?: ReactNode;
  otherLabel?: string;
}

export default function QuickPick<T extends string | number = string>({
  options,
  value,
  onChange,
  label,
  columns = 2,
  otherSlot,
  otherLabel,
}: QuickPickProps<T>) {
  const { t } = useLanguage();
  const matched = options.find(o => o.value === value);
  const hasValue = value !== undefined && value !== '' && value !== 0;
  const [otherTapped, setOtherTapped] = useState(false);

  // "Other" is selected if user explicitly tapped it, OR if there's a value that doesn't match any preset
  const otherSelected = !!otherSlot && (otherTapped || (hasValue && !matched));

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-muted mb-3">{label}</label>
      )}
      <div className={`grid ${gridCols[columns]} gap-3`}>
        {options.map((opt) => {
          const isSelected = !otherSelected && value === opt.value;
          return (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOtherTapped(false);
              }}
              className={`
                flex flex-col items-center justify-center gap-1 rounded-2xl border-2 px-3 py-4 min-h-[80px]
                transition-all active:scale-[0.97]
                ${isSelected
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-white text-foreground'
                }
              `}
            >
              {opt.icon && <span className="text-2xl">{opt.icon}</span>}
              <span className="text-base font-bold leading-tight text-center">{opt.label}</span>
              {opt.sublabel && (
                <span className="text-xs text-muted leading-tight">{opt.sublabel}</span>
              )}
            </button>
          );
        })}
        {otherSlot && (
          <button
            type="button"
            onClick={() => setOtherTapped(true)}
            className={`
              flex flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed px-3 py-4 min-h-[80px]
              transition-all active:scale-[0.97]
              ${otherSelected
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-white text-muted'
              }
            `}
          >
            <span className="text-base font-bold">{otherLabel ?? t('common.other')}</span>
          </button>
        )}
      </div>
      {otherSlot && otherSelected && (
        <div className="mt-3 space-y-3 rounded-2xl border border-border bg-white p-4">
          {otherSlot}
        </div>
      )}
    </div>
  );
}
