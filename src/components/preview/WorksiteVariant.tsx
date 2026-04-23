'use client';

import { Clock, ClipboardList, Package, Car, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import MockPhone from './MockPhone';

const C = {
  bg: '#1A1A1A',
  card: '#2A2A2A',
  yellow: '#FCD34D',
  white: '#FFFFFF',
  muted: '#A0A0A0',
  edge: '#3A3A3A',
};

export default function WorksiteVariant() {
  return (
    <MockPhone bg={C.bg}>
      <div
        style={{
          flex: 1,
          padding: '20px 18px',
          color: C.white,
          fontFamily: 'var(--font-dm-sans), sans-serif',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}
      >
        {/* Logo bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 38,
              height: 38,
              background: C.yellow,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 800,
              color: '#1A1A1A',
              letterSpacing: '-0.04em',
            }}
          >
            J&amp;J
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              J&amp;J Plumbing
            </div>
          </div>
          {/* "ON SHIFT" pill */}
          <div
            style={{
              padding: '6px 12px',
              border: `2px solid ${C.yellow}`,
              borderRadius: 6,
              fontSize: 10.5,
              fontWeight: 800,
              letterSpacing: '0.1em',
              color: C.yellow,
            }}
          >
            ON SHIFT
          </div>
        </div>

        {/* Greeting */}
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: C.yellow,
              textTransform: 'uppercase',
              marginBottom: 6,
            }}
          >
            Hi, Tony
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
              textTransform: 'uppercase',
            }}
          >
            What are you doing?
          </div>
        </div>

        {/* 4 tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Tile icon={Clock} label="TIMECARD" />
          <Tile icon={ClipboardList} label="WORK ORDER" />
          <Tile icon={Package} label="MATERIALS" />
          <Tile icon={Car} label="MILEAGE" />
        </div>

        {/* Sample form step preview */}
        <div
          style={{
            marginTop: 4,
            paddingTop: 14,
            borderTop: `1.5px dashed ${C.edge}`,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: C.muted,
              textTransform: 'uppercase',
              marginBottom: 10,
            }}
          >
            Sample step
          </div>
          <div
            style={{
              fontSize: 19,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              marginBottom: 12,
            }}
          >
            Which week?
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <ChoiceBtn label="THIS FRI" selected />
            <ChoiceBtn label="LAST FRI" />
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
        border: `3px solid ${C.yellow}`,
        borderRadius: 10,
        padding: '18px 14px',
        cursor: 'pointer',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        minHeight: 100,
        position: 'relative',
        fontFamily: 'inherit',
      }}
    >
      <Icon size={26} color={C.yellow} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      <div
        style={{
          fontSize: 13,
          fontWeight: 800,
          color: C.white,
          letterSpacing: '0.04em',
        }}
      >
        {label}
      </div>
      <ArrowRight
        size={14}
        color={C.yellow}
        strokeWidth={3}
        style={{ position: 'absolute', top: 14, right: 14 }}
      />
    </button>
  );
}

function ChoiceBtn({ label, selected }: { label: string; selected?: boolean }) {
  return (
    <button
      style={{
        background: selected ? C.yellow : C.card,
        color: selected ? '#1A1A1A' : C.white,
        border: `3px solid ${C.yellow}`,
        borderRadius: 8,
        padding: '14px 12px',
        fontSize: 14,
        fontWeight: 800,
        letterSpacing: '0.03em',
        cursor: 'pointer',
        fontFamily: 'inherit',
      }}
    >
      {label}
    </button>
  );
}
