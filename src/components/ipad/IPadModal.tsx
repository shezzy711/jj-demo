'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { Wifi, Battery } from 'lucide-react';
import { theme as t } from '@/lib/theme';

interface IPadModalProps {
  onClose: () => void;
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

export default function IPadModal({ onClose, children }: IPadModalProps) {
  const time = useNowClock();
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15,35,64,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: 32,
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: 'min(440px, 100%)',
          height: 'min(900px, calc(100vh - 64px))',
          background: '#1A1A1A',
          borderRadius: 48,
          padding: 14,
          boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
          position: 'relative',
        }}
      >
        {/* Inner screen */}
        <div
          style={{
            width: '100%',
            height: '100%',
            background: t.bg,
            borderRadius: 36,
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* iOS status bar */}
          <div
            style={{
              height: 28,
              flexShrink: 0,
              padding: '0 24px',
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
        {/* Close button on phone bezel */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: -38,
            right: 0,
            background: 'rgba(255,255,255,0.15)',
            color: 'white',
            border: 'none',
            borderRadius: 999,
            padding: '6px 14px',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            backdropFilter: 'blur(6px)',
          }}
        >
          Close iPad
        </button>
      </div>
    </div>
  );
}
