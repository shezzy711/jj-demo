'use client';

import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Sun,
  Users,
  FileText,
  Package,
  Camera,
  AlertCircle,
  PenTool,
} from 'lucide-react';
import BigTile, { type TileShape } from '@/components/shared/BigTile';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { theme as t } from '@/lib/theme';
import type { Employee, ForemanDWO, Project } from '@/lib/types/forms';

type DWOStep = 'scope' | 'materials' | 'photos' | 'problems' | 'signoff';

interface ForemanJobBoardProps {
  project: Project;
  elapsed: string;
  crewOnJob: Employee[];
  fState: ForemanDWO;
  onBack: () => void;
  onOpenStep: (step: DWOStep) => void;
  onOpenReq: () => void;
}

export default function ForemanJobBoard({
  project,
  elapsed,
  crewOnJob,
  fState,
  onBack,
  onOpenStep,
  onOpenReq,
}: ForemanJobBoardProps) {
  const { t: tt } = useLanguage();
  const dwoTiles: (TileShape & { step: DWOStep })[] = [
    { step: 'scope',     icon: FileText,     label: tt('foreman.tile.scope'),     done: !!fState.scope },
    { step: 'materials', icon: Package,      label: tt('foreman.tile.materials'), done: fState.materials.length > 0 },
    { step: 'photos',    icon: Camera,       label: tt('foreman.tile.photos'),    done: fState.photos.length > 0 },
    { step: 'problems',  icon: AlertCircle,  label: tt('foreman.tile.problems'),  done: fState.problems != null },
  ];
  const allDone = dwoTiles.every(tile => tile.done);

  return (
    <div style={{ padding: '16px 24px 130px' }}>
      <button
        onClick={onBack}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          fontSize: 13.5,
          color: t.inkMuted,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '6px 0',
          marginBottom: 8,
          fontWeight: 600,
        }}
      >
        <ChevronLeft size={16} /> {tt('common.home')}
      </button>

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 16,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 21, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            {project.name}
          </div>
          <div
            style={{
              fontSize: 12,
              color: t.inkLight,
              marginTop: 5,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <MapPin size={12} /> {project.address}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            padding: '7px 12px',
            background: t.successBg,
            borderRadius: 999,
            flexShrink: 0,
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: 4, background: t.success }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: t.success, fontVariantNumeric: 'tabular-nums' }}>
            {elapsed}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 22 }}>
        <InfoCard icon={Sun}    iconBg="rgba(251, 191, 36, 0.15)" iconColor="#D97706" title="78°F · Sunny" subtitle={tt('common.autoFromWeather')} />
        <InfoCard icon={Users}  iconBg={t.successBg}              iconColor={t.success} title={`${crewOnJob.length} ${tt('common.onSite')}`} subtitle={tt('common.fromClockIns')} />
      </div>

      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: t.inkMuted,
          marginBottom: 12,
          paddingLeft: 2,
        }}
      >
        {tt('foreman.todaysDWO')}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 14 }}>
        {dwoTiles.map(tile => (
          <BigTile key={tile.step} tile={tile} onClick={() => onOpenStep(tile.step)} />
        ))}
      </div>

      <BigTile
        tile={{
          icon: PenTool,
          label: allDone ? tt('foreman.signOff') : tt('foreman.finishOtherFirst'),
          done: fState.customerSigned || fState.customerSkipped,
          primary: true,
          disabled: !allDone,
        }}
        onClick={() => allDone && onOpenStep('signoff')}
        full
      />

      <button
        onClick={onOpenReq}
        style={{
          width: '100%',
          marginTop: 18,
          padding: 16,
          borderRadius: 14,
          background: t.card,
          border: `1.5px solid ${t.lineStrong}`,
          cursor: 'pointer',
          color: t.ink,
          fontSize: 14,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          boxShadow: t.shadowSm,
        }}
      >
        <Package size={17} strokeWidth={1.8} /> {tt('foreman.requestMatTools')} <ChevronRight size={15} />
      </button>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  subtitle,
}: {
  icon: typeof Sun;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div
      style={{
        background: t.card,
        border: `1px solid ${t.line}`,
        borderRadius: 14,
        padding: 13,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        boxShadow: t.shadowSm,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 9,
          background: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={18} color={iconColor} strokeWidth={2} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '-0.01em' }}>{title}</div>
        <div style={{ fontSize: 10.5, color: t.inkLight, marginTop: 1 }}>{subtitle}</div>
      </div>
    </div>
  );
}
