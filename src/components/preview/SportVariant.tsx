'use client';

import { Clock, ClipboardList, Package, Car, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import MockPhone from './MockPhone';

const C = {
  bg: '#FFFFFF',
  ink: '#0B0B0B',
  inkMuted: '#5A5A5A',
  blue: '#0066FF',
  orange: '#FF5500',
  green: '#16A34A',
  magenta: '#DB2777',
  line: '#E5E5E5',
};

export default function SportVariant() {
  return (
    <MockPhone bg={C.bg}>
      <div
        style={{
          flex: 1,
          padding: '20px 18px',
          color: C.ink,
          fontFamily: 'var(--font-dm-sans), sans-serif',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}
      >
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 40,
              height: 40,
              background: C.blue,
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 15,
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-0.04em',
            }}
          >
            J&amp;J
          </div>
          <div style={{ flex: 1, fontSize: 14, fontWeight: 800, letterSpacing: '-0.01em' }}>
            J&amp;J Plumbing
          </div>
          <div
            style={{
              padding: '6px 12px',
              borderRadius: 999,
              background: C.blue,
              color: '#fff',
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.04em',
            }}
          >
            EN
          </div>
        </div>

        {/* Greeting — big numbers vibe */}
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: C.inkMuted,
              marginBottom: 2,
            }}
          >
            Hey,
          </div>
          <div
            style={{
              fontSize: 38,
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1,
            }}
          >
            Tony!
          </div>
          <div
            style={{
              marginTop: 8,
              fontSize: 14,
              fontWeight: 700,
              color: C.inkMuted,
            }}
          >
            Pick a form.
          </div>
        </div>

        {/* 4 colorful tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Tile icon={Clock}         label="Timecard"   color={C.blue} />
          <Tile icon={ClipboardList} label="Work Order" color={C.orange} />
          <Tile icon={Package}       label="Materials"  color={C.green} />
          <Tile icon={Car}           label="Mileage"    color={C.magenta} />
        </div>

        {/* Sample step */}
        <div
          style={{
            marginTop: 4,
            paddingTop: 14,
            borderTop: `1px solid ${C.line}`,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.1em',
              color: C.inkMuted,
              textTransform: 'uppercase',
              marginBottom: 10,
            }}
          >
            Sample step
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: '-0.025em',
              marginBottom: 14,
              lineHeight: 1.1,
            }}
          >
            Which week?
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <ChoiceBtn label="This Friday" selected />
            <ChoiceBtn label="Last Friday" />
          </div>
        </div>
      </div>
    </MockPhone>
  );
}

function Tile({ icon: Icon, label, color }: { icon: LucideIcon; label: string; color: string }) {
  return (
    <button
      style={{
        background: color,
        border: 'none',
        borderRadius: 22,
        padding: 20,
        cursor: 'pointer',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        minHeight: 110,
        position: 'relative',
        fontFamily: 'inherit',
        boxShadow: `0 10px 24px ${color}50`,
        color: '#fff',
      }}
    >
      <Icon size={28} color="#fff" strokeWidth={2.5} />
      <div
        style={{
          fontSize: 17,
          fontWeight: 800,
          letterSpacing: '-0.015em',
          lineHeight: 1.1,
        }}
      >
        {label}
      </div>
      <ArrowRight
        size={18}
        color="#fff"
        strokeWidth={2.5}
        style={{ position: 'absolute', top: 18, right: 16, opacity: 0.85 }}
      />
    </button>
  );
}

function ChoiceBtn({ label, selected }: { label: string; selected?: boolean }) {
  return (
    <button
      style={{
        background: selected ? C.blue : '#F3F4F6',
        color: selected ? '#fff' : C.ink,
        border: 'none',
        borderRadius: 999,
        padding: '18px 16px',
        fontSize: 16,
        fontWeight: 800,
        cursor: 'pointer',
        fontFamily: 'inherit',
        boxShadow: selected ? `0 8px 22px ${C.blue}50` : 'none',
        letterSpacing: '-0.01em',
      }}
    >
      {label}
    </button>
  );
}
