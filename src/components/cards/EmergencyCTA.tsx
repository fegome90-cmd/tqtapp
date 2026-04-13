import type React from 'react';

interface EmergencyCTAProps {
  onClick: () => void;
}

// Icono de notifications_active (campana con notifications)
const NotificationsActiveIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => (
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
    aria-label="Notificación"
    {...props}
  >
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

export default function EmergencyCTA({ onClick }: EmergencyCTAProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full bg-primary-container hover:brightness-110 rounded-3xl shadow-[0_8px_24px_-8px_rgba(1,67,137,0.25)] p-6 flex items-center gap-5 text-left active:scale-[0.98] transition-all"
    >
      <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
        <NotificationsActiveIcon className="w-7 h-7 text-white" />
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
