'use client';

import type { ReactNode } from 'react';

interface ToggleSwitchProps {
  value: boolean;
  onChange: (value: boolean) => void;
  yesLabel: string;
  noLabel: string;
  yesIcon?: ReactNode;
  noIcon?: ReactNode;
}

export default function ToggleSwitch({
  value,
  onChange,
  yesLabel,
  noLabel,
  yesIcon,
  noIcon,
}: ToggleSwitchProps) {
  return (
    <div className="flex gap-4 w-full">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`
          flex-1 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-6 min-h-[100px]
          transition-all active:scale-[0.97]
          ${value === true
            ? 'border-success bg-success/10 text-success'
            : 'border-border bg-white text-foreground'
          }
        `}
      >
        {yesIcon && <span className="text-3xl">{yesIcon}</span>}
        <span className="text-xl font-bold">{yesLabel}</span>
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`
          flex-1 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-6 min-h-[100px]
          transition-all active:scale-[0.97]
          ${value === false
            ? 'border-danger bg-danger/10 text-danger'
            : 'border-border bg-white text-foreground'
          }
        `}
      >
        {noIcon && <span className="text-3xl">{noIcon}</span>}
        <span className="text-xl font-bold">{noLabel}</span>
      </button>
    </div>
  );
}
