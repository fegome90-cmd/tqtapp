import { useState } from 'react';
import { Mic, Volume2 } from 'lucide-react';
import TopBar from '../components/layout/TopBar';
import { usePatient } from '../hooks/usePatient';
import type { VoiceBankSession } from '../types';

// Default stub session for MVP — no persistence yet
const DEFAULT_SESSION: VoiceBankSession = {
  id: 'session-1',
  patientId: 'patient-1',
  status: 'not-started',
  recordedSamples: 0,
  totalSamples: 50,
  startedAt: null,
  completedAt: null,
};

const CARE_PHASE_LABELS: Record<string, string> = {
  preop: 'Fase Preoperatoria',
  hospitalization: 'Fase Hospitalización',
  'early-rehab': 'Rehabilitación Temprana',
  'late-rehab': 'Rehabilitación Tardía',
  'follow-up': 'Seguimiento',
};

interface ProfileScreenProps {
  onNavigateVoiceBank: () => void;
  voiceBankSession?: VoiceBankSession;
}

export default function ProfileScreen({
  onNavigateVoiceBank,
  voiceBankSession = DEFAULT_SESSION,
}: ProfileScreenProps) {
  const { initials, displayName, carePhase } = usePatient();
  const [volumeEnabled, setVolumeEnabled] = useState(true);
  const phaseLabel = CARE_PHASE_LABELS[carePhase] || carePhase;
  const session = voiceBankSession;

  return (
    <div className="transition-opacity duration-300">
      <TopBar title="Mi Perfil Clínico" />
      <div className="p-5 space-y-8">
        {/* Patient card */}
        <div className="bg-card p-6 rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] flex items-center gap-6">
          <div className="w-20 h-20 bg-[var(--color-primary)] rounded-[var(--radius-full)] flex items-center justify-center">
            <span className="text-[var(--text-3xl)] font-[var(--weight-bold)] text-on-action">
              {initials}
            </span>
          </div>
          <div>
            <h2 className="text-[var(--text-2xl)] font-[var(--weight-bold)] text-heading">
              {displayName}
            </h2>
            <span className="inline-block mt-2 px-4 py-1.5 bg-[var(--color-primary-light)] text-[var(--color-primary-action)] rounded-[var(--radius-full)] text-[var(--text-sm)] font-[var(--weight-semibold)] tracking-wide uppercase">
              {phaseLabel}
            </span>
          </div>
        </div>

        {/* Accessibility section */}
        <div className="space-y-3">
          <h3 className="text-[var(--text-sm)] font-[var(--weight-bold)] text-secondary uppercase tracking-widest ml-2">
            Accesibilidad
          </h3>
          <div className="bg-card rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden divide-y divide-[var(--color-border-subtle)]">
            <button
              type="button"
              role="switch"
              aria-checked={volumeEnabled}
              className="p-5 flex items-center justify-between active:bg-[var(--color-surface)] cursor-pointer w-full"
              onClick={() => setVolumeEnabled(!volumeEnabled)}
            >
              <div className="flex items-center gap-4 text-heading">
                <Volume2 className="w-6 h-6" aria-hidden="true" />
                <span className="font-[var(--weight-semibold)] text-[var(--text-lg)]">
                  Volumen de Voz
                </span>
              </div>
              <div
                className={`w-14 h-8 ${volumeEnabled ? 'bg-primary-action' : 'bg-muted'} rounded-[var(--radius-full)] flex items-center px-1 ${volumeEnabled ? 'justify-end' : 'justify-start'}`}
              >
                <div className="w-6 h-6 bg-card rounded-[var(--radius-full)] shadow-[var(--elevation-0)]" />
              </div>
            </button>
          </div>
        </div>

        {/* Voice Bank card */}
        <div className="space-y-3">
          <h3 className="text-[var(--text-sm)] font-[var(--weight-bold)] text-secondary uppercase tracking-widest ml-2">
            Preparación Quirúrgica
          </h3>
          <button
            type="button"
            onClick={onNavigateVoiceBank}
            className="w-full bg-gradient-to-br from-blue-600 to-indigo-800 p-7 rounded-[var(--radius-xl)] shadow-[var(--elevation-2)] relative overflow-hidden text-left"
          >
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md text-on-action rounded-[var(--radius-md)] flex items-center justify-center border border-white/20">
                <Mic className="w-7 h-7" />
              </div>
              <span className="px-4 py-1.5 bg-card text-[var(--color-primary)] text-[var(--text-sm)] font-[var(--weight-bold)] rounded-[var(--radius-full)] shadow-[var(--elevation-1)]">
                {session.status === 'not-started'
                  ? 'No iniciado'
                  : `Progreso: ${session.recordedSamples} / ${session.totalSamples}`}
              </span>
            </div>

            <h4 className="text-[var(--text-2xl)] font-[var(--weight-bold)] text-on-action mb-2 relative z-10">
              Mi Banco de Voz
            </h4>
            <p className="text-[var(--text-base)] text-white/70 mb-6 relative z-10 leading-normal">
              Graba tu voz antes de la laringectomía para que podamos
              sintetizarla y la app suene exactamente como tú en el futuro.
            </p>

            <span className="block w-full bg-card text-[var(--color-primary)] font-[var(--weight-bold)] text-[var(--text-lg)] py-4 rounded-[var(--radius-md)] shadow-[var(--elevation-1)] hover:bg-[var(--color-primary-light)] active:scale-[var(--scale-press)] transition-all relative z-10 text-center">
              Comenzar
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
