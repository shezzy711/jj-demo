'use client';

import { Clock } from 'lucide-react';

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export default function TimePicker({ value, onChange, label }: TimePickerProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-muted mb-2">{label}</label>
      )}
      <div className="relative">
        <Clock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
        <input
          type="time"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-2xl border-2 border-border bg-white pl-12 pr-4 py-4 text-lg text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-[56px]"
        />
      </div>
    </div>
  );
}
