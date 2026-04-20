'use client';

interface StepIndicatorProps {
  current: number;
  total: number;
}

export default function StepIndicator({ current, total }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-3">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`
            rounded-full transition-all duration-300
            ${i === current
              ? 'h-3 w-8 bg-primary'
              : i < current
                ? 'h-3 w-3 bg-primary/40'
                : 'h-3 w-3 bg-border'
            }
          `}
        />
      ))}
    </div>
  );
}
