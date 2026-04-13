import { Star } from 'lucide-react';

interface PhraseCardProps {
  text: string;
  isPlaying: boolean;
  isFavorite: boolean;
  onPlay: () => void;
  onToggleFav: () => void;
}

export default function PhraseCard({
  text,
  isPlaying,
  isFavorite,
  onPlay,
  onToggleFav,
}: PhraseCardProps) {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/60 overflow-hidden flex items-stretch min-h-[80px]">
      <button
        type="button"
        onClick={onPlay}
        className="flex-1 p-4 text-left active:bg-slate-50 transition-colors flex items-center gap-4"
      >
        {/* Indicador visual de reproducción */}
        <div
          className={`w-3 h-3 rounded-full transition-colors duration-300 ${
            isPlaying
              ? 'bg-primary-container scale-125 shadow-[0_0_12px_rgba(59,130,246,0.6)]'
              : 'bg-slate-200'
          }`}
        />
        <span className="text-lg font-medium text-slate-800 leading-tight">
          {text}
        </span>
      </button>
      {/* Botón Favorito */}
      <button
        type="button"
        onClick={onToggleFav}
        aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        aria-pressed={isFavorite}
        className="px-4 border-l border-slate-100 flex items-center justify-center hover:bg-slate-50 active:bg-slate-100 transition-colors"
      >
        <Star
          aria-hidden="true"
          className={`w-6 h-6 transition-colors ${
            isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'
          }`}
        />
      </button>
    </div>
  );
}
