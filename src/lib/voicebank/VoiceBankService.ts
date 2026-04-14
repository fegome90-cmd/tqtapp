/**
 * VoiceBankService — stub interface for future voice banking workflow.
 * No implementation exists. This establishes the contract for future work.
 *
 * Expected lifecycle:
 * 1. startSession(patientId) → VoiceBankSession (status: "not-started")
 * 2. recordSample(sessionId, audioBlob) → VoiceBankSession (status: "in-progress", recordedSamples++)
 * 3. getStatus(sessionId) → VoiceBankSession
 *
 * This interface is the sole deliverable for MVP. Do NOT implement.
 */

import type { VoiceBankSession } from '../../types';

export interface VoiceBankService {
  startSession(patientId: string): Promise<VoiceBankSession>;
  recordSample(sessionId: string, audioBlob: Blob): Promise<VoiceBankSession>;
  getStatus(sessionId: string): Promise<VoiceBankSession>;
}
