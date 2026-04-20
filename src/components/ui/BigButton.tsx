'use client';

import type { ReactNode } from 'react';

interface BigButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'accent' | 'outline' | 'success' | 'danger' | 'ghost';
  disabled?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
  type?: 'button' | 'submit';
}

const variants = {
  primary: 'bg-primary text-white active:bg-primary-light',
  accent: 'bg-accent text-white active:bg-accent-light',
  outline: 'bg-white text-foreground border-2 border-border active:bg-gray-50',
  success: 'bg-success text-white active:opacity-90',
  danger: 'bg-danger text-white active:opacity-90',
  ghost: 'bg-transparent text-muted active:bg-gray-100',
};

export default function BigButton({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  icon,
  fullWidth = true,
  type = 'button',
}: BigButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center justify-center gap-3 rounded-2xl px-6 py-4
        text-lg font-semibold transition-transform active:scale-[0.98]
        disabled:opacity-40 disabled:pointer-events-none
        min-h-[56px]
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
