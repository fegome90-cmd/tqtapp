import type React from 'react';

interface PhraseCardProps {
  text: string;
  isPlaying: boolean;
  isFavorite: boolean;
  onPlay: () => void;
  onToggleFav: () => void;
}

// Icono de estrella
const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    aria-label="Favorito"
    {...props}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

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
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
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
        className="px-4 border-l border-slate-100 flex items-center justify-center hover:bg-slate-50 active:bg-slate-100 transition-colors"
      >
        <StarIcon
          className={`w-6 h-6 transition-all ${
            isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'
          }`}
        />
      </button>
    </div>
  );
}
