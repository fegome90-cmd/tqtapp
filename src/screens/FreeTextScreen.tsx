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
        <div className="bg-white rounded-3xl border border-slate-200/60 p-5 flex-1 relative flex flex-col min-h-[250px]">
          <textarea
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            className="w-full flex-1 resize-none outline-none text-3xl font-medium text-slate-800 placeholder:text-slate-300 bg-transparent"
            placeholder="Toca para escribir…"
          />
          <div className="flex gap-3 overflow-x-auto pb-2 pt-4 no-scrollbar border-t border-slate-50">
            {SUGGESTIONS.map((sug) => (
              <button
                type="button"
                key={sug}
                onClick={() =>
                  setFreeText((prev) => (prev ? `${prev} ${sug}` : sug))
                }
                className="whitespace-nowrap px-6 py-3 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 rounded-full font-medium text-lg transition-colors"
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
          className="w-full bg-slate-900 disabled:bg-slate-300 disabled:scale-100 text-white rounded-3xl p-5 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
        >
          <Play className="w-6 h-6 fill-white" />
          <span className="text-xl font-semibold tracking-wide">
            Reproducir Mensaje
          </span>
        </button>

        <div className="mt-2 p-5 rounded-3xl border-2 border-dashed border-slate-200 bg-white/50 flex items-center gap-4 opacity-80">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
            <Mic className="w-7 h-7" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-lg">
              Dictado por voz y clonación
            </h4>
            <p className="text-sm text-slate-500 font-medium">
              El input predictivo de audio está agendado para la Fase 2.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
