'use client';

import { useState } from 'react';
import { Camera, Plus } from 'lucide-react';
import WizardHeader from './WizardHeader';
import WizardFooter from './WizardFooter';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { format } from '@/lib/i18n/translations';
import { theme as t } from '@/lib/theme';

interface PhotoMock {
  caption: string;
  seed: number;
}

interface PhotosStepProps {
  existing?: PhotoMock[];
  onSave: (photos: PhotoMock[]) => void;
  onClose: () => void;
}

// Generate a small plumbing-flavoured colored gradient as the "photo" thumbnail.
function thumbBg(seed: number) {
  const gradients = [
    'linear-gradient(135deg, #2C3E50 0%, #4A6B8A 100%)',
    'linear-gradient(135deg, #5C7C8A 0%, #B0C4D6 100%)',
    'linear-gradient(135deg, #8B4513 0%, #C8855E 100%)',
    'linear-gradient(135deg, #4A5568 0%, #718096 100%)',
    'linear-gradient(135deg, #2D3748 0%, #5A6E8A 100%)',
    'linear-gradient(135deg, #6B7280 0%, #9CA3AF 100%)',
  ];
  return gradients[seed % gradients.length];
}

export default function PhotosStep({ existing, onSave, onClose }: PhotosStepProps) {
  const { t: tt } = useLanguage();
  const [photos, setPhotos] = useState<PhotoMock[]>(existing || []);

  const addPhoto = () => {
    setPhotos(prev => [...prev, { caption: `Photo ${prev.length + 1}`, seed: prev.length }]);
  };

  return (
    <>
      <WizardHeader
        title={tt('foreman.photos.title')}
        subtitle={tt('foreman.photos.subtitle')}
        onClose={onClose}
      />
      <div style={{ flex: 1, overflow: 'auto', padding: '22px 22px 130px' }}>
        {photos.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 460,
              gap: 24,
            }}
          >
            <button
              onClick={addPhoto}
              style={{
                width: 200,
                height: 200,
                borderRadius: 100,
                background: t.navy,
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 14px 40px rgba(15,35,64,0.4)',
              }}
            >
              <Camera size={80} strokeWidth={1.6} />
            </button>
            <div
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: t.ink,
                textAlign: 'center',
                letterSpacing: '-0.015em',
              }}
            >
              {tt('foreman.photos.tapToAdd')}
            </div>
          </div>
        ) : (
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: t.inkMuted,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: 12,
              }}
            >
              {format(tt('foreman.photos.added'), { n: photos.length })}
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 12,
                marginBottom: 16,
              }}
            >
              {photos.map((p, i) => (
                <div
                  key={i}
                  style={{
                    aspectRatio: '4 / 3',
                    borderRadius: 14,
                    background: thumbBg(p.seed),
                    boxShadow: t.shadowSm,
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: 10,
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {p.caption}
                </div>
              ))}
              <button
                onClick={addPhoto}
                style={{
                  aspectRatio: '4 / 3',
                  borderRadius: 14,
                  background: t.card,
                  border: `1.5px dashed ${t.lineStrong}`,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  color: t.inkMuted,
                }}
              >
                <Plus size={28} strokeWidth={1.8} />
                <span style={{ fontSize: 12, fontWeight: 600 }}>{tt('foreman.photos.addPhoto')}</span>
              </button>
            </div>
          </div>
        )}
      </div>
      <WizardFooter
        onClose={onClose}
        primaryLabel={tt('common.save')}
        onPrimary={() => onSave(photos)}
        primaryDisabled={photos.length === 0}
      />
    </>
  );
}
