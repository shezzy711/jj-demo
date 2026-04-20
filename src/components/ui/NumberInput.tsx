'use client';

import { Minus, Plus } from 'lucide-react';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
}

export default function NumberInput({
  value,
  onChange,
  label,
  min = 0,
  max = 99999,
  step = 1,
  prefix,
  suffix,
}: NumberInputProps) {
  const decrement = () => onChange(Math.max(min, value - step));
  const increment = () => onChange(Math.min(max, value + step));

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-muted mb-2">{label}</label>
      )}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={decrement}
          disabled={value <= min}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-foreground active:bg-gray-200 disabled:opacity-30 flex-shrink-0"
        >
          <Minus size={24} />
        </button>
        <div className="flex-1 flex items-center justify-center rounded-2xl border-2 border-border bg-white px-4 py-3 min-h-[56px]">
          <span className="text-2xl font-bold text-foreground">
            {prefix}{value}{suffix}
          </span>
        </div>
        <button
          type="button"
          onClick={increment}
          disabled={value >= max}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white active:bg-primary-light disabled:opacity-30 flex-shrink-0"
        >
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
}
