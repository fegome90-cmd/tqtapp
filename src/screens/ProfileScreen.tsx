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
  const phaseLabel = CARE_PHASE_LABELS[carePhase] || carePhase;
  const session = voiceBankSession;

  return (
    <div className="transition-opacity duration-300">
      <TopBar title="Mi Perfil Clínico" />
      <div className="p-5 space-y-8">
        {/* Patient card */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-6">
          <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold text-white">{initials}</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{displayName}</h2>
            <span className="inline-block mt-2 px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold tracking-wide uppercase">
              {phaseLabel}
            </span>
          </div>
        </div>

        {/* Accessibility section */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest ml-2">
            Accesibilidad
          </h3>
          <div className="bg-white rounded-3xl border border-slate-200/60 overflow-hidden divide-y divide-slate-100">
            <div className="p-5 flex items-center justify-between active:bg-slate-50 cursor-pointer">
              <div className="flex items-center gap-4 text-slate-800">
                <Volume2 className="w-6 h-6" aria-hidden="true" />
                <span className="font-semibold text-lg">Volumen de Voz</span>
              </div>
              <div className="w-14 h-8 bg-blue-600 rounded-full flex items-center px-1 justify-end">
                <div className="w-6 h-6 bg-white rounded-full shadow-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Voice Bank card */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest ml-2">
            Preparación Quirúrgica
          </h3>
          <button
            type="button"
            onClick={onNavigateVoiceBank}
            className="w-full bg-gradient-to-br from-blue-600 to-indigo-800 p-7 rounded-[2rem] shadow-md relative overflow-hidden text-left"
          >
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white rounded-full opacity-10 blur-2xl" />
            <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-indigo-400 rounded-full opacity-20 blur-2xl" />

            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md text-white rounded-2xl flex items-center justify-center border border-white/20">
                <Mic className="w-7 h-7" />
              </div>
              <span className="px-4 py-1.5 bg-white text-indigo-800 text-sm font-bold rounded-full shadow-sm">
                {session.status === 'not-started'
                  ? 'No iniciado'
                  : `Progreso: ${session.recordedSamples} / ${session.totalSamples}`}
              </span>
            </div>

            <h4 className="text-2xl font-bold text-white mb-2 relative z-10">
              Mi Banco de Voz
            </h4>
            <p className="text-base text-blue-100 mb-6 relative z-10 leading-relaxed">
              Graba tu voz antes de la laringectomía para que podamos
              sintetizarla y la app suene exactamente como tú en el futuro.
            </p>

            <span className="block w-full bg-white text-indigo-700 font-bold text-lg py-4 rounded-2xl shadow-sm hover:bg-blue-50 active:scale-[0.98] transition-all relative z-10 text-center">
              Comenzar
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
