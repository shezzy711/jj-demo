'use client';

import type { CSSProperties, ReactNode } from 'react';

interface MockPhoneProps {
  bg: string;       // inner-screen background color
  children: ReactNode;
  width?: number;
  height?: number;
}

// A static phone-frame mockup used by the /preview page. No live clock,
// no close button — purely for showing visual treatments side-by-side.
export default function MockPhone({ bg, children, width = 360, height = 760 }: MockPhoneProps) {
  return (
    <div
      style={{
        width,
        height,
        background: '#1A1A1A',
        borderRadius: 44,
        padding: 12,
        boxShadow: '0 24px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.04)',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          background: bg,
          borderRadius: 32,
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Static iOS status bar */}
        <div
          style={{
            height: 24,
            flexShrink: 0,
            padding: '0 22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 12,
            fontWeight: 600,
            color: 'inherit',
            opacity: 0.85,
          }}
        >
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>9:41</span>
          <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <Glyph w={18} h={11} />
            <Glyph w={20} h={11} />
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}

function Glyph({ w, h }: { w: number; h: number }) {
  const style: CSSProperties = {
    width: w,
    height: h,
    background: 'currentColor',
    borderRadius: 2,
    opacity: 0.7,
  };
  return <span style={style} />;
}
