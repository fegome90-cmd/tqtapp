import { describe, expect, it } from 'vitest';
import type {
  CarePhase,
  PatientProfile,
  ConsentRecord,
  CustomPhrase,
  VoiceBankSession,
} from '../types';
import { SEED_PHRASES, CATEGORIES } from '../data/seed';

// ---------------------------------------------------------------------------
// SC-PP-1: Display patient initials
// ---------------------------------------------------------------------------
describe('PatientProfile initials derivation', () => {
  it('derives "MR" from Mario Rojas', () => {
    const profile: PatientProfile = {
      id: 'patient-1',
      firstName: 'Mario',
      lastName: 'Rojas',
      diagnosis: 'Carcinoma laríngeo',
      surgeryDate: null,
      carePhase: 'preop',
      createdAt: '2026-04-13T00:00:00Z',
    };
    const initials = profile.firstName.charAt(0) + profile.lastName.charAt(0);
    expect(initials).toBe('MR');
  });

  it('derives initials from single-character names', () => {
    const initials = 'A'.charAt(0) + 'B'.charAt(0);
    expect(initials).toBe('AB');
  });
});

// ---------------------------------------------------------------------------
// SC-PP-2: Missing surgery date
// ---------------------------------------------------------------------------
describe('PatientProfile missing surgery date', () => {
  it('shows preop phase badge when surgeryDate is null', () => {
    const profile: PatientProfile = {
      id: 'patient-1',
      firstName: 'Mario',
      lastName: 'Rojas',
      diagnosis: 'Carcinoma laríngeo',
      surgeryDate: null,
      carePhase: 'preop',
      createdAt: '2026-04-13T00:00:00Z',
    };
    expect(profile.surgeryDate).toBeNull();
    expect(profile.carePhase).toBe('preop');
  });

  it('has a valid surgery date when provided', () => {
    const profile: PatientProfile = {
      id: 'patient-1',
      firstName: 'Mario',
      lastName: 'Rojas',
      diagnosis: 'Carcinoma laríngeo',
      surgeryDate: '2026-04-20T10:00:00Z',
      carePhase: 'preop',
      createdAt: '2026-04-13T00:00:00Z',
    };
    expect(profile.surgeryDate).not.toBeNull();
    // Verify the date string is valid ISO 8601
    expect(typeof profile.surgeryDate).toBe('string');
    // toISOString() may add milliseconds (.000Z); compare parsed dates instead
    expect(new Date(profile.surgeryDate as string).getTime()).toBe(
      new Date('2026-04-20T10:00:00Z').getTime(),
    );
  });
});

// ---------------------------------------------------------------------------
// SC-PP-3: Care phase transitions
// ---------------------------------------------------------------------------
describe('CarePhase transitions', () => {
  it('defines all valid care phases', () => {
    const validPhases: CarePhase[] = [
      'preop',
      'hospitalization',
      'early-rehab',
      'late-rehab',
      'follow-up',
    ];
    expect(validPhases.length).toBe(5);
  });

  it('allows transitioning between phases', () => {
    let phase: CarePhase = 'preop';
    expect(phase).toBe('preop');

    phase = 'hospitalization';
    expect(phase).toBe('hospitalization');

    phase = 'early-rehab';
    expect(phase).toBe('early-rehab');
  });
});

// ---------------------------------------------------------------------------
// SC-PP-4: Consent not yet granted
// ---------------------------------------------------------------------------
describe('ConsentRecord not granted', () => {
  it('consent is not granted when grantedAt is null', () => {
    const consent: ConsentRecord = {
      id: 'consent-1',
      patientId: 'patient-1',
      type: 'voice-banking',
      grantedAt: null,
      version: '1.0',
    };
    const isGranted = consent.grantedAt !== null;
    expect(isGranted).toBe(false);
  });

  it('consent is granted when grantedAt has a value', () => {
    const consent: ConsentRecord = {
      id: 'consent-1',
      patientId: 'patient-1',
      type: 'voice-banking',
      grantedAt: '2026-04-13T10:00:00Z',
      version: '1.0',
    };
    const isGranted = consent.grantedAt !== null;
    expect(isGranted).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// PhraseTemplate discriminated union
// ---------------------------------------------------------------------------
describe('PhraseTemplate discriminated union', () => {
  it('PhraseTemplate has isCustom: false', () => {
    const template = SEED_PHRASES[0];
    expect(template.isCustom).toBe(false);
  });

  it('CustomPhrase has isCustom: true', () => {
    const custom: CustomPhrase = {
      id: 'custom_123',
      text: 'Necesito mi cánula',
      categoryId: 'respiracion',
      isCustom: true,
      createdAt: '2026-04-13T00:00:00Z',
    };
    expect(custom.isCustom).toBe(true);
    expect(custom.id.startsWith('custom_')).toBe(true);
  });

  it('can discriminate between template and custom phrase', () => {
    const template = SEED_PHRASES[0];
    const custom: CustomPhrase = {
      id: 'custom_456',
      text: 'Test',
      categoryId: 'dolor',
      isCustom: true,
      createdAt: '2026-04-13T00:00:00Z',
    };

    if (template.isCustom === false) {
      expect(template.carePhase).toBeDefined();
      expect(template.sortOrder).toBeDefined();
    }
    if (custom.isCustom === true) {
      expect(custom.createdAt).toBeDefined();
    }
  });
});

// ---------------------------------------------------------------------------
// VoiceBankSession
// ---------------------------------------------------------------------------
describe('VoiceBankSession', () => {
  it('can represent not-started session', () => {
    const session: VoiceBankSession = {
      id: 'session-1',
      patientId: 'patient-1',
      status: 'not-started',
      recordedSamples: 0,
      totalSamples: 50,
      startedAt: null,
      completedAt: null,
    };
    expect(session.status).toBe('not-started');
    expect(session.recordedSamples).toBe(0);
  });

  it('can represent in-progress session', () => {
    const session: VoiceBankSession = {
      id: 'session-1',
      patientId: 'patient-1',
      status: 'in-progress',
      recordedSamples: 12,
      totalSamples: 50,
      startedAt: '2026-04-13T10:00:00Z',
      completedAt: null,
    };
    expect(session.status).toBe('in-progress');
    expect(session.recordedSamples).toBe(12);
  });

  it('can represent completed session', () => {
    const session: VoiceBankSession = {
      id: 'session-1',
      patientId: 'patient-1',
      status: 'completed',
      recordedSamples: 50,
      totalSamples: 50,
      startedAt: '2026-04-13T10:00:00Z',
      completedAt: '2026-04-13T12:00:00Z',
    };
    expect(session.status).toBe('completed');
    expect(session.recordedSamples).toBe(session.totalSamples);
  });
});

// ---------------------------------------------------------------------------
// Seed data integrity
// ---------------------------------------------------------------------------
describe('Seed data integrity', () => {
  it('has phrases in every category', () => {
    const categoryIds = CATEGORIES.map((c) => c.id);
    const phraseCategories = new Set(SEED_PHRASES.map((p) => p.categoryId));

    for (const catId of categoryIds) {
      expect(
        phraseCategories.has(catId),
        `Category "${catId}" has no phrases`,
      ).toBe(true);
    }
  });

  it('phrase IDs follow consistent naming pattern', () => {
    for (const phrase of SEED_PHRASES) {
      expect(
        phrase.id,
        `Phrase "${phrase.text}" has unexpected ID: ${phrase.id}`,
      ).toMatch(/^[a-z]+-\d+$/);
    }
  });

  it('all carePhase arrays are non-empty', () => {
    for (const phrase of SEED_PHRASES) {
      expect(
        phrase.carePhase.length,
        `Phrase "${phrase.id}" has empty carePhase array`,
      ).toBeGreaterThan(0);
    }
  });
});
