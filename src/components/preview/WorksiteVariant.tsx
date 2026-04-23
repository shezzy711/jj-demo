'use client';

import { Clock, ClipboardList, Package, Car, ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import MockPhone from './MockPhone';

// "Hardline" — a refined Spike-TV-leaning take on the original Worksite-bold.
// Warm charcoal + deep red + brushed brass for the brand mark.
// Thinner borders, less aggressive uppercase, more breathing room.
const C = {
  bg: '#1A1817',          // very dark, slightly warm
  card: '#232120',        // a touch lighter warm dark
  cardActive: '#2A2826',
  accent: '#B91C1C',      // refined deep red (not tomato bright)
  accentSoft: 'rgba(185,28,28,0.18)',
  brass: '#B87333',       // burnished brass for the J&J mark
  text: '#F5F1ED',        // warm white
  textMuted: '#A8A3A0',
  textSubtle: '#6B6661',
  border: '#2D2A28',
  borderStrong: '#3F3A37',
};

export default function WorksiteVariant() {
  return (
    <MockPhone bg={C.bg}>
      <div
        style={{
          flex: 1,
          padding: '20px 20px',
          color: C.text,
          fontFamily: 'var(--font-dm-sans), sans-serif',
          display: 'flex',
          flexDirection: 'column',
          gap: 22,
        }}
      >
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: `linear-gradient(160deg, ${C.brass} 0%, #8E5824 100%)`,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 800,
              color: '#1A1817',
              letterSpacing: '-0.04em',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)',
            }}
          >
            J&amp;J
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 13.5,
                fontWeight: 700,
                letterSpacing: '-0.005em',
              }}
            >
              J&amp;J Plumbing
            </div>
            <div
              style={{
                fontSize: 10,
                color: C.textSubtle,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginTop: 2,
              }}
            >
              Field
            </div>
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 10px',
              border: `1px solid ${C.borderStrong}`,
              borderRadius: 999,
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: C.textMuted,
              textTransform: 'uppercase',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                background: C.accent,
              }}
            />
            On site
          </div>
        </div>

        {/* Greeting */}
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: C.brass,
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            Hi, Tony
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              color: C.text,
            }}
          >
            What are you doing?
          </div>
        </div>

        {/* 4 tiles — refined, thinner */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Tile icon={Clock}         label="Timecard"   />
          <Tile icon={ClipboardList} label="Work Order" />
          <Tile icon={Package}       label="Materials"  />
          <Tile icon={Car}           label="Mileage"    />
        </div>

        {/* Sample step */}
        <div
          style={{
            paddingTop: 16,
            borderTop: `1px solid ${C.border}`,
          }}
        >
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: C.textSubtle,
              textTransform: 'uppercase',
              marginBottom: 12,
            }}
          >
            Sample step
          </div>
          <div
            style={{
              fontSize: 21,
              fontWeight: 700,
              letterSpacing: '-0.015em',
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
        border: `1.5px solid ${C.border}`,
        borderRadius: 12,
        padding: '16px 14px',
        cursor: 'pointer',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        minHeight: 100,
        position: 'relative',
        fontFamily: 'inherit',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.025)',
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 9,
          background: C.accentSoft,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={19} color={C.accent} strokeWidth={2.2} />
      </div>
      <div
        style={{
          fontSize: 14.5,
          fontWeight: 700,
          color: C.text,
          letterSpacing: '-0.01em',
        }}
      >
        {label}
      </div>
      <ChevronRight
        size={14}
        color={C.textSubtle}
        strokeWidth={2.2}
        style={{ position: 'absolute', top: 16, right: 12 }}
      />
    </button>
  );
}

function ChoiceBtn({ label, selected }: { label: string; selected?: boolean }) {
  return (
    <button
      style={{
        background: selected
          ? `linear-gradient(180deg, ${C.accent} 0%, #971515 100%)`
          : C.card,
        color: selected ? '#FFFFFF' : C.text,
        border: `1.5px solid ${selected ? C.accent : C.border}`,
        borderRadius: 10,
        padding: '15px 14px',
        fontSize: 15,
        fontWeight: 700,
        letterSpacing: '-0.005em',
        cursor: 'pointer',
        fontFamily: 'inherit',
        boxShadow: selected
          ? '0 6px 18px rgba(185,28,28,0.35), inset 0 1px 0 rgba(255,255,255,0.18)'
          : 'inset 0 1px 0 rgba(255,255,255,0.025)',
      }}
    >
      {label}
    </button>
  );
}
