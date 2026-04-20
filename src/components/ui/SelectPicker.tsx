'use client';

import type { ReactNode } from 'react';

interface SelectOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

interface SelectPickerProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  columns?: 2 | 3 | 4;
}

export default function SelectPicker({
  options,
  value,
  onChange,
  label,
  columns = 2,
}: SelectPickerProps) {
  const gridCols = {
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
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              flex flex-col items-center justify-center gap-2 rounded-2xl border-2 p-4 min-h-[72px]
              transition-all active:scale-[0.97]
              ${value === option.value
                ? 'border-primary bg-primary/10 text-primary font-bold'
                : 'border-border bg-white text-foreground'
              }
            `}
          >
            {option.icon && <span className="text-2xl">{option.icon}</span>}
            <span className="text-base font-medium leading-tight text-center">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
