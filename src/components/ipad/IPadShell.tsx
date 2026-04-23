'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { Wifi, Battery } from 'lucide-react';
import { theme as t } from '@/lib/theme';

interface IPadShellProps {
  children: ReactNode;
}

function useNowClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);
  return now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

// Full-page iPad device frame. Always visible — there's no modal,
// no click-outside-to-close. The iPad IS the page.
export default function IPadShell({ children }: IPadShellProps) {
  const time = useNowClock();
  return (
    <div
      style={{
        width: 'min(500px, 92vw)',
        height: 'min(960px, 92vh)',
        background: '#1A1A1A',
        borderRadius: 52,
        padding: 14,
        boxShadow: '0 30px 80px rgba(15,35,64,0.18), 0 0 0 1px rgba(255,255,255,0.04)',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          background: t.bg,
          borderRadius: 38,
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* iOS status bar */}
        <div
          style={{
            height: 30,
            flexShrink: 0,
            padding: '0 26px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'transparent',
            fontSize: 13,
            fontWeight: 600,
            color: t.ink,
          }}
        >
          <div style={{ fontVariantNumeric: 'tabular-nums' }}>{time}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Wifi size={14} strokeWidth={2.2} />
            <Battery size={16} strokeWidth={2} />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
