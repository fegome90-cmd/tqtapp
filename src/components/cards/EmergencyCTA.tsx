import { BellRing } from 'lucide-react';

interface EmergencyCTAProps {
  onClick: () => void;
  isPlaying?: boolean;
}

export default function EmergencyCTA({ onClick, isPlaying }: EmergencyCTAProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full bg-primary-container hover:brightness-110 rounded-3xl shadow-[0_8px_24px_-8px_rgba(1,67,137,0.25)] p-6 flex items-center gap-5 text-left active:scale-[0.98] transition-transform${isPlaying ? ' animate-pulse' : ''}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
        <BellRing className="w-7 h-7 text-white" aria-hidden="true" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-white">Llamado de Asistencia</h3>
        <p className="text-sm text-blue-100 mt-1 font-medium">
          Enfermería te responderá pronto
        </p>
      </div>
    </button>
  );
}
