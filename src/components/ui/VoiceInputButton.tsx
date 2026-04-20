'use client';

import { Mic, MicOff } from 'lucide-react';

interface VoiceInputButtonProps {
  isListening: boolean;
  isSupported: boolean;
  onStart: () => void;
  onStop: () => void;
}

export default function VoiceInputButton({ isListening, isSupported, onStart, onStop }: VoiceInputButtonProps) {
  if (!isSupported) return null;

  return (
    <button
      type="button"
      onClick={isListening ? onStop : onStart}
      className={`
        relative flex h-14 w-14 items-center justify-center rounded-full
        transition-all active:scale-95 flex-shrink-0
        ${isListening
          ? 'bg-danger text-white voice-pulse'
          : 'bg-primary text-white'
        }
      `}
    >
      {isListening ? <MicOff size={24} /> : <Mic size={24} />}
    </button>
  );
}
