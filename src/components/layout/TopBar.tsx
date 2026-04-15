import { ChevronLeft } from 'lucide-react';

interface TopBarProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
}

export default function TopBar({ title, showBack, onBack }: TopBarProps) {
  return (
    <header className="sticky top-0 z-10 bg-[var(--glass-header)] backdrop-blur-[var(--glass-blur)] border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-[var(--radius-full)] hover:bg-[var(--color-surface)] active:bg-[var(--color-surface)] transition-colors"
            aria-label="Volver"
          >
            <ChevronLeft className="w-7 h-7 text-heading" aria-hidden="true" />
          </button>
        )}
        <h1 className="text-[var(--text-xl)] font-[var(--weight-bold)] text-heading">
          {title}
        </h1>
      </div>
    </header>
  );
}
