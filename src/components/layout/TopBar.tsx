interface TopBarProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
}

export default function TopBar({ title, showBack, onBack }: TopBarProps) {
  return (
    <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-surface-container px-5 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            type="button"
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-surface-container active:bg-surface-container-high transition-colors"
            aria-label="Volver"
          >
            <span
              className="material-symbols-outlined text-2xl text-primary"
              aria-hidden="true"
            >
              chevron_left
            </span>
          </button>
        )}
        <h1 className="text-2xl font-black text-primary tracking-tight">
          {title}
        </h1>
      </div>
      <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center border border-surface-container-highest shadow-sm">
        <span
          className="material-symbols-outlined text-xl text-outline-variant"
          aria-hidden="true"
        >
          volume_up
        </span>
      </div>
    </header>
  );
}
