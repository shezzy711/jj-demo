'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';

interface IconCardProps {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
  color: string;
}

export default function IconCard({ href, icon, title, description, color }: IconCardProps) {
  return (
    <Link
      href={href}
      className={`
        flex flex-col items-center justify-center gap-3 rounded-3xl p-6
        bg-white shadow-lg border border-border
        active:scale-[0.97] transition-transform
        min-h-[180px] text-center
      `}
    >
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>
      <div>
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
        <p className="text-sm text-muted mt-1">{description}</p>
      </div>
    </Link>
  );
}
