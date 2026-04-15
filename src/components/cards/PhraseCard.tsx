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
    <div className="w-full bg-card rounded-[var(--radius-lg)] border border-transparent shadow-[var(--elevation-1)] overflow-hidden flex items-stretch min-h-[80px]">
      <button
        type="button"
        onClick={onPlay}
        aria-label="Reproducir frase"
        className="flex-1 p-4 text-left active:bg-[var(--color-surface)] transition-colors flex items-center gap-4"
      >
        {/* Indicador visual de reproducción */}
        <div className="min-w-[var(--touch-min)] flex items-center justify-center">
          <div
            className={`w-6 h-6 rounded-[var(--radius-full)] transition-all duration-300 ${
              isPlaying
                ? 'bg-primary-action scale-125 shadow-[0_0_12px_rgba(59,130,246,0.6)]'
                : 'bg-[var(--color-border)]'
            }`}
          />
        </div>
        <span className="text-[var(--text-lg)] font-[var(--weight-medium)] text-heading leading-[var(--leading-tight)]">
          {text}
        </span>
      </button>
      {/* Botón Favorito */}
      <button
        type="button"
        onClick={onToggleFav}
        aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        className="px-4 border-l border-[var(--color-border)] flex items-center justify-center hover:bg-[var(--color-surface)] active:bg-[var(--color-surface)] active:scale-[var(--scale-press)] transition-colors"
      >
        <Star
          className={`w-6 h-6 transition-all ${
            isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted'
          }`}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
