import { ChevronLeft, Volume2 } from 'lucide-react';

interface TopBarProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
}

export default function TopBar({ title, showBack, onBack }: TopBarProps) {
  return (
    <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-200/60 px-5 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors"
            aria-label="Volver"
          >
            <ChevronLeft
              className="w-7 h-7 text-slate-700"
              aria-hidden="true"
            />
          </button>
        )}
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          {title}
        </h1>
      </div>
      <button
        type="button"
        className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 active:bg-slate-200 flex items-center justify-center border border-slate-200/60 transition-colors"
        aria-label="Volumen"
      >
        <Volume2 className="w-5 h-5 text-slate-400" aria-hidden="true" />
      </button>
    </header>
  );
}
