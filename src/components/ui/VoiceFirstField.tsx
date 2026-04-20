'use client';

import { useEffect, useState } from 'react';
import { Mic, MicOff, Keyboard, X } from 'lucide-react';
import TextInput from './TextInput';
import { useSpeechRecognition } from '@/lib/voice/useSpeechRecognition';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface VoiceFirstFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export default function VoiceFirstField({ value, onChange, label }: VoiceFirstFieldProps) {
  const { lang, t } = useLanguage();
  const [typeMode, setTypeMode] = useState(false);
  const {
    transcript,
    interimTranscript,
    isListening,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      onChange(value ? `${value} ${transcript}` : transcript);
      resetTranscript();
    }
  }, [transcript, value, onChange, resetTranscript]);

  if (typeMode || !isSupported) {
    return (
      <div className="space-y-2">
        <TextInput value={value} onChange={onChange} label={label} multiline enableVoice={false} />
        {isSupported && (
          <button
            onClick={() => setTypeMode(false)}
            className="flex items-center gap-2 text-sm font-semibold text-primary"
          >
            <Mic size={14} />
            {t('common.useVoice')}
          </button>
        )}
      </div>
    );
  }

  const handleMicTap = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening(lang === 'es' ? 'es-MX' : 'en-US');
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-muted mb-3">{label}</label>
      )}

      <div className="flex flex-col items-center gap-3 rounded-3xl border-2 border-border bg-white px-4 py-6">
        <button
          type="button"
          onClick={handleMicTap}
          className={`
            relative flex h-24 w-24 items-center justify-center rounded-full
            transition-transform active:scale-95
            ${isListening ? 'bg-danger text-white voice-pulse' : 'bg-primary text-white'}
          `}
        >
          {isListening ? <MicOff size={40} /> : <Mic size={40} />}
        </button>
        <p className={`text-lg font-bold ${isListening ? 'text-danger' : 'text-foreground'}`}>
          {isListening ? t('common.listening') : t('common.tapToTalk')}
        </p>
      </div>

      {(value || interimTranscript) && (
        <div className="mt-3 rounded-2xl bg-gray-50 p-4">
          <p className="text-base leading-relaxed">
            {value}
            {interimTranscript && (
              <span className="text-muted"> {interimTranscript}</span>
            )}
          </p>
          {value && !isListening && (
            <button
              onClick={() => onChange('')}
              className="mt-2 flex items-center gap-1 text-xs font-medium text-muted"
            >
              <X size={12} />
              {t('common.clear')}
            </button>
          )}
        </div>
      )}

      <button
        onClick={() => setTypeMode(true)}
        className="mt-3 flex items-center gap-2 text-sm font-semibold text-muted"
      >
        <Keyboard size={14} />
        {t('common.typeInstead')}
      </button>
    </div>
  );
}
