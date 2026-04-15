import { Bell } from 'lucide-react';

interface EmergencyCTAProps {
  onClick: () => void;
  isPlaying?: boolean;
}

export default function EmergencyCTA({
  onClick,
  isPlaying,
}: EmergencyCTAProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Llamar asistencia de enfermería"
      className={`w-full bg-primary-action hover:brightness-110 rounded-[var(--radius-lg)] shadow-[var(--elevation-3)] p-6 flex items-center gap-5 text-left active:scale-[var(--scale-press)] transition-all ${isPlaying ? 'animate-pulse' : ''}`}
    >
      <div className="w-14 h-14 rounded-[var(--radius-md)] bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
        <Bell className="w-7 h-7 text-on-action" aria-hidden="true" />
      </div>
      <div>
        <h3 className="text-[var(--text-2xl)] font-[var(--weight-black)] tracking-tight text-on-action">
          Llamado de Asistencia
        </h3>
        <p className="text-[var(--text-sm)] font-[var(--weight-medium)] text-white/70 mt-1">
          Enfermería te responderá pronto
        </p>
      </div>
    </button>
  );
}
