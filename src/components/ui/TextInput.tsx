'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import VoiceInputButton from './VoiceInputButton';
import { useSpeechRecognition } from '@/lib/voice/useSpeechRecognition';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  multiline?: boolean;
  enableVoice?: boolean;
}

export default function TextInput({
  value,
  onChange,
  placeholder = '',
  label,
  multiline = false,
  enableVoice = true,
}: TextInputProps) {
  const { lang } = useLanguage();
  const {
    transcript,
    interimTranscript,
    isListening,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    setTranscript,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      onChange(value ? `${value} ${transcript}` : transcript);
      resetTranscript();
    }
  }, [transcript, value, onChange, resetTranscript]);

  const handleVoiceStart = () => {
    setTranscript('');
    startListening(lang === 'es' ? 'es-MX' : 'en-US');
  };

  const inputClass = `
    w-full rounded-2xl border-2 border-border bg-white px-4 py-4
    text-lg text-foreground placeholder:text-muted
    focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
    transition-colors
  `;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-muted mb-2">{label}</label>
      )}
      <div className="flex items-start gap-3">
        <div className="relative flex-1">
          {multiline ? (
            <textarea
              value={isListening ? `${value}${interimTranscript ? ` ${interimTranscript}` : ''}` : value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              rows={4}
              className={`${inputClass} resize-none`}
              readOnly={isListening}
            />
          ) : (
            <input
              type="text"
              value={isListening ? `${value}${interimTranscript ? ` ${interimTranscript}` : ''}` : value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className={inputClass}
              readOnly={isListening}
            />
          )}
          {value && !isListening && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-muted active:bg-gray-200"
            >
              <X size={16} />
            </button>
          )}
        </div>
        {enableVoice && (
          <VoiceInputButton
            isListening={isListening}
            isSupported={isSupported}
            onStart={handleVoiceStart}
            onStop={stopListening}
          />
        )}
      </div>
      {isListening && (
        <p className="mt-2 text-sm text-danger font-medium animate-pulse">
          {lang === 'es' ? 'Escuchando...' : 'Listening...'}
        </p>
      )}
    </div>
  );
}
