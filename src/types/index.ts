export type CategoryId =
  | 'urgente'
  | 'dolor'
  | 'respiracion'
  | 'secreciones'
  | 'posicion'
  | 'familia'
  | 'necesidades'
  | 'emociones'
  | 'gratitud';

export interface Category {
  id: CategoryId;
  title: string;
  icon: string;
  color: string;
  description?: string;
}

export interface Phrase {
  id: string;
  text: string;
  categoryId: CategoryId;
}

// --- Domain types for MVP Laringectomía Total ---

export type CarePhase =
  | 'preop'
  | 'hospitalization'
  | 'early-rehab'
  | 'late-rehab'
  | 'follow-up';

export interface PatientProfile {
  id: string;
  firstName: string;
  lastName: string;
  diagnosis: string;
  surgeryDate: string | null; // ISO 8601 or null
  carePhase: CarePhase;
  createdAt: string; // ISO 8601
}

export interface ConsentRecord {
  id: string;
  patientId: string;
  type: string;
  grantedAt: string | null; // ISO 8601 or null
  version: string;
}

export interface PhraseTemplate extends Phrase {
  isCustom: false;
  carePhase: CarePhase[];
  isEmergency: boolean;
  sortOrder: number;
}

export interface CustomPhrase {
  id: string; // prefixed with "custom_"
  text: string;
  categoryId: CategoryId;
  isCustom: true;
  createdAt: string; // ISO 8601
}

export type AnyPhrase = PhraseTemplate | CustomPhrase;

export type VoiceBankSessionStatus =
  | 'not-started'
  | 'in-progress'
  | 'completed';

export interface VoiceBankSession {
  id: string;
  patientId: string;
  status: VoiceBankSessionStatus;
  recordedSamples: number;
  totalSamples: number;
  startedAt: string | null; // ISO 8601 or null
  completedAt: string | null; // ISO 8601 or null
}

export interface VoiceBankService {
  startSession(patientId: string): Promise<VoiceBankSession>;
  recordSample(sessionId: string, audioBlob: Blob): Promise<VoiceBankSession>;
  getStatus(sessionId: string): Promise<VoiceBankSession>;
}
