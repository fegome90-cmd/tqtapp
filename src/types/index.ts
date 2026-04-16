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
  readonly id: CategoryId;
  readonly title: string;
  readonly icon: string;
  readonly description?: string;
}

interface Phrase {
  readonly id: string;
  readonly text: string;
  readonly categoryId: CategoryId;
}

// --- Domain types for MVP Laringectomía Total ---

export type CarePhase =
  | 'preop'
  | 'hospitalization'
  | 'early-rehab'
  | 'late-rehab'
  | 'follow-up';

export interface PatientProfile {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly diagnosis: string;
  readonly surgeryDate: string | null; // ISO 8601 or null
  readonly carePhase: CarePhase;
  readonly createdAt: string; // ISO 8601
}

export interface PhraseTemplate extends Phrase {
  readonly isCustom: false;
  readonly carePhase: CarePhase[];
  readonly isEmergency: boolean;
  readonly sortOrder: number;
}

export interface CustomPhrase {
  readonly id: string; // prefixed with "custom_"
  readonly text: string;
  readonly categoryId: CategoryId;
  readonly isCustom: true;
  readonly createdAt: string; // ISO 8601
}

export interface VoiceBankSession {
  readonly id: string;
  readonly patientId: string;
  readonly status: 'not-started' | 'in-progress' | 'completed';
  readonly recordedSamples: number;
  readonly totalSamples: number;
  readonly startedAt: string | null; // ISO 8601 or null
  readonly completedAt: string | null; // ISO 8601 or null
}
