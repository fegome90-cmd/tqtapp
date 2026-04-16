import { useState } from 'react';
import { Mic, Play } from 'lucide-react';
import TopBar from '../components/layout/TopBar';
import { useTTS } from '../lib/tts/TTSContext';

interface FreeTextScreenProps {
  onPlay: (id: string, text: string) => void;
}

const SUGGESTIONS = ['Sí', 'No', 'Gracias', 'Por favor', 'Me duele'];

export default function FreeTextScreen({ onPlay }: FreeTextScreenProps) {
  const [freeText, setFreeText] = useState('');
  const { isSpeaking } = useTTS();

  return (
    <div className="h-full flex flex-col transition-opacity duration-300">
      <TopBar title="Texto Libre" />
      <div className="p-5 flex-1 flex flex-col gap-5">
        <div className="bg-card rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 flex-1 relative flex flex-col min-h-[250px]">
          <textarea
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            aria-label="Escribe tu mensaje"
            className="w-full flex-1 resize-none outline-none text-[var(--text-3xl)] font-[var(--weight-medium)] text-heading placeholder:text-muted bg-transparent"
            placeholder="Toca para escribir…"
          />
          <div className="flex gap-3 overflow-x-auto pb-2 pt-4 no-scrollbar border-t border-[var(--color-border-subtle)]">
            {SUGGESTIONS.map((sug) => (
              <button
                type="button"
                key={sug}
                onClick={() =>
                  setFreeText((prev) => (prev ? `${prev} ${sug}` : sug))
                }
                className="whitespace-nowrap px-6 py-3 bg-[var(--color-surface)] hover:bg-[var(--color-border)] active:bg-[var(--color-border-subtle)] text-heading rounded-[var(--radius-full)] font-[var(--weight-medium)] text-[var(--text-lg)] transition-colors"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onPlay('free_text', freeText)}
          disabled={!freeText.trim() || isSpeaking}
          className="w-full bg-[var(--color-primary-action)] disabled:bg-muted disabled:scale-100 text-on-action rounded-[var(--radius-lg)] p-5 flex items-center justify-center gap-3 active:scale-[var(--scale-press)] transition-all"
        >
          <Play className="w-6 h-6 fill-white" />
          <span className="text-[var(--text-xl)] font-[var(--weight-semibold)] tracking-wide">
            Reproducir Mensaje
          </span>
        </button>

        <div className="mt-2 p-5 rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface)] flex items-center gap-4 opacity-80">
          <div className="p-3 bg-[var(--color-primary-light)] text-[var(--color-primary-action)] rounded-[var(--radius-md)]">
            <Mic className="w-7 h-7" />
          </div>
          <div>
            <h4 className="font-[var(--weight-bold)] text-heading text-[var(--text-lg)]">
              Dictado por voz y clonación
            </h4>
            <p className="text-[var(--text-sm)] text-secondary font-[var(--weight-medium)]">
              El input predictivo de audio está agendado para la Fase 2.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
