interface HeaderProps {
  avatarSrc?: string;
}

export default function Header({ avatarSrc }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-container bg-white/80 backdrop-blur-md">
      <div className="flex justify-between items-center px-6 h-16 w-full max-w-screen-xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-fixed bg-slate-200 flex items-center justify-center">
            {avatarSrc ? (
              <img
                alt="Avatar"
                className="w-full h-full object-cover"
                src={avatarSrc}
              />
            ) : (
              <span className="text-slate-500 text-xs font-bold" aria-hidden="true">MR</span>
            )}
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-black text-primary/60">
              Asistente
            </p>
            <span className="text-primary text-lg font-black leading-tight">
              FALP Sentinel
            </span>
          </div>
        </div>
        <button
          type="button"
          className="relative w-10 h-10 flex items-center justify-center text-primary-container bg-primary-fixed/30 rounded-full"
          aria-label="Notificaciones"
        >
          <span
            className="material-symbols-outlined text-2xl"
            aria-hidden="true"
          >
            notifications
          </span>
          <span
            className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"
            aria-hidden="true"
          />
        </button>
      </div>
    </header>
  );
}
