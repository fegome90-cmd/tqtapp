import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { PatientProfile, CarePhase } from '../types';

// --- Default patient for single-patient MVP ---
const DEFAULT_PATIENT: PatientProfile = {
  id: 'patient-1',
  firstName: 'Mario',
  lastName: 'Rojas',
  diagnosis: 'Carcinoma laríngeo',
  surgeryDate: null,
  carePhase: 'preop',
  createdAt: '2026-04-13T00:00:00Z',
};

interface PatientContextValue {
  patient: PatientProfile;
  carePhase: CarePhase;
  initials: string;
  displayName: string;
}

const PatientContext = createContext<PatientContextValue | null>(null);

interface PatientProviderProps {
  children: ReactNode;
  patient?: PatientProfile;
}

export function PatientProvider({
  children,
  patient = DEFAULT_PATIENT,
}: PatientProviderProps) {
  const value = useMemo<PatientContextValue>(() => {
    const initials = patient.firstName.charAt(0) + patient.lastName.charAt(0);
    const displayName = `${patient.firstName} ${patient.lastName}`;
    return {
      patient,
      carePhase: patient.carePhase,
      initials,
      displayName,
    };
  }, [patient]);

  return (
    <PatientContext.Provider value={value}>{children}</PatientContext.Provider>
  );
}

export function usePatient(): PatientContextValue {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
}
