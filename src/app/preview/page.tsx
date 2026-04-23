import WorksiteVariant from '@/components/preview/WorksiteVariant';
import SportVariant from '@/components/preview/SportVariant';
import RefinedVariant from '@/components/preview/RefinedVariant';

export const metadata = {
  title: 'Pick a look · J&J Demo',
};

export default function PreviewPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0B0B0B',
        color: '#FFFFFF',
        fontFamily: 'var(--font-dm-sans), sans-serif',
        padding: '40px 28px 80px',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <h1
          style={{
            fontSize: 38,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            margin: '0 0 8px 0',
            lineHeight: 1.05,
          }}
        >
          Pick a look
        </h1>
        <p style={{ fontSize: 15, color: '#A0A0A0', margin: '0 0 36px 0', maxWidth: 640 }}>
          Same iPad home + one sample step in three directions. Tell me which one you want and I&apos;ll
          apply it across the whole iPad.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
            justifyItems: 'center',
          }}
        >
          <Column letter="A" name="Worksite-bold" sub="Milwaukee/DeWalt feel — gloves on">
            <WorksiteVariant />
          </Column>
          <Column letter="B" name="Sport-app loud" sub="Strava/DraftKings — kinetic">
            <SportVariant />
          </Column>
          <Column letter="C" name="Refined-tactile" sub="Current direction, dialed up">
            <RefinedVariant />
          </Column>
        </div>
      </div>
    </div>
  );
}

function Column({
  letter,
  name,
  sub,
  children,
}: {
  letter: string;
  name: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, width: '100%' }}>
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: 18,
            background: '#FFFFFF',
            color: '#0B0B0B',
            fontSize: 16,
            fontWeight: 800,
            marginBottom: 10,
          }}
        >
          {letter}
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.015em' }}>{name}</div>
        <div style={{ fontSize: 12.5, color: '#A0A0A0', marginTop: 3 }}>{sub}</div>
      </div>
      {children}
    </div>
  );
}
