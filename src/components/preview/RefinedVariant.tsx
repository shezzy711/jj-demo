'use client';

import { Clock, ClipboardList, Package, Car, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import MockPhone from './MockPhone';

const C = {
  bg: '#F4EFE6',
  card: '#FFFFFF',
  navy: '#0F2340',
  accent: '#C8553D',
  ink: '#0F0F0F',
  inkMuted: '#4A4A4A',
  inkLight: '#8A8A8A',
  line: '#E8E1D2',
  lineStrong: '#D4CBB8',
};

export default function RefinedVariant() {
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
          gap: 20,
        }}
      >
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 40,
              height: 40,
              background: C.accent,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-0.04em',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)',
            }}
          >
            J&amp;J
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em' }}>
              J&amp;J Plumbing
            </div>
            <div
              style={{
                fontSize: 10,
                color: C.inkLight,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginTop: 1,
              }}
            >
              Powered by Evios
            </div>
          </div>
        </div>

        {/* Greeting */}
        <div>
          <div style={{ fontSize: 12.5, color: C.inkMuted, fontWeight: 600 }}>
            Wednesday, April 22
          </div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: '-0.03em',
              marginTop: 4,
              lineHeight: 1.05,
            }}
          >
            Hi, Tony
          </div>
        </div>

        {/* 4 tiles — chunkier */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Tile icon={Clock}         label="Timecard" />
          <Tile icon={ClipboardList} label="Work Order" />
          <Tile icon={Package}       label="Materials" />
          <Tile icon={Car}           label="Mileage" />
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
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: C.inkLight,
              textTransform: 'uppercase',
              marginBottom: 10,
            }}
          >
            Sample step
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              marginBottom: 14,
              lineHeight: 1.15,
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

function Tile({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <button
      style={{
        background: C.card,
        border: `2px solid ${C.line}`,
        borderRadius: 20,
        padding: 18,
        cursor: 'pointer',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        minHeight: 110,
        position: 'relative',
        fontFamily: 'inherit',
        boxShadow: '0 6px 18px rgba(15,35,64,0.07), 0 2px 4px rgba(15,35,64,0.04)',
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          background: C.navy,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={24} color="#fff" strokeWidth={2.2} />
      </div>
      <div
        style={{
          fontSize: 17,
          fontWeight: 700,
          letterSpacing: '-0.015em',
          color: C.ink,
        }}
      >
        {label}
      </div>
      <ArrowRight
        size={16}
        color={C.inkLight}
        strokeWidth={2}
        style={{ position: 'absolute', top: 16, right: 16 }}
      />
    </button>
  );
}

function ChoiceBtn({ label, selected }: { label: string; selected?: boolean }) {
  return (
    <button
      style={{
        background: selected ? C.navy : C.card,
        color: selected ? '#fff' : C.ink,
        border: `2px solid ${selected ? C.navy : C.line}`,
        borderRadius: 16,
        padding: '18px 14px',
        fontSize: 16,
        fontWeight: 700,
        cursor: 'pointer',
        fontFamily: 'inherit',
        letterSpacing: '-0.005em',
        boxShadow: selected ? '0 6px 18px rgba(15,35,64,0.2)' : 'none',
      }}
    >
      {label}
    </button>
  );
}
