import TopBar from '../components/layout/TopBar';

interface PreopVoiceBankScreenProps {
  onBack: () => void;
}

export default function PreopVoiceBankScreen({
  onBack,
}: PreopVoiceBankScreenProps) {
  return (
    <div>
      <TopBar title="Banco de Voz" showBack onBack={onBack} />
      <div className="p-5 flex flex-col items-center justify-center py-24">
        <p className="text-secondary text-[var(--text-lg)] text-center">
          Esta función estará disponible próximamente.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="mt-8 px-8 py-3 bg-[var(--color-primary-action)] text-on-action rounded-[var(--radius-md)] font-[var(--weight-semibold)] text-[var(--text-lg)] active:scale-[var(--scale-press)] transition-all"
        >
          Volver
        </button>
      </div>
    </div>
  );
}
