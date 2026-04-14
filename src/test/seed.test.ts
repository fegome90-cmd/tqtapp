import { describe, expect, it } from 'vitest';
import {
  CATEGORIES,
  SEED_PHRASES,
  MOCK_PHRASES,
  LEGACY_ID_MAP,
} from '../data/seed';
import type { CategoryId } from '../types';

describe('CATEGORIES', () => {
  it('has at least 8 categories', () => {
    expect(CATEGORIES.length).toBeGreaterThanOrEqual(8);
  });

  it('each category has required fields', () => {
    for (const cat of CATEGORIES) {
      expect(typeof cat.id).toBe('string');
      expect(typeof cat.title).toBe('string');
      expect(typeof cat.icon).toBe('string');
      expect(typeof cat.color).toBe('string');
    }
  });

  it('contains expected categories including gratitud', () => {
    const ids = CATEGORIES.map((c) => c.id);
    expect(ids).toContain('dolor');
    expect(ids).toContain('respiracion');
    expect(ids).toContain('emociones');
    expect(ids).toContain('urgente');
    expect(ids).toContain('gratitud');
  });

  it('has 9 categories total', () => {
    expect(CATEGORIES.length).toBe(9);
  });
});

describe('SEED_PHRASES', () => {
  it('has at least 30 phrases', () => {
    expect(SEED_PHRASES.length).toBeGreaterThanOrEqual(30);
  });

  it('each phrase has required fields', () => {
    for (const phrase of SEED_PHRASES) {
      expect(typeof phrase.id).toBe('string');
      expect(typeof phrase.text).toBe('string');
      expect(typeof phrase.categoryId).toBe('string');
      expect(phrase.isCustom).toBe(false);
      expect(Array.isArray(phrase.carePhase)).toBe(true);
      expect(typeof phrase.isEmergency).toBe('boolean');
      expect(typeof phrase.sortOrder).toBe('number');
    }
  });

  it('all phrase categoryIds are valid CategoryId values', () => {
    const validIds: CategoryId[] = [
      'urgente',
      'dolor',
      'respiracion',
      'secreciones',
      'posicion',
      'familia',
      'necesidades',
      'emociones',
      'gratitud',
    ];
    for (const phrase of SEED_PHRASES) {
      expect(validIds).toContain(phrase.categoryId);
    }
  });

  it('all IDs are unique', () => {
    const ids = SEED_PHRASES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('each category has at least 2 phrases', () => {
    const categories = CATEGORIES.map((c) => c.id);
    for (const catId of categories) {
      const phrases = SEED_PHRASES.filter((p) => p.categoryId === catId);
      expect(phrases.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('dolor category has at least 4 phrases', () => {
    const dolorPhrases = SEED_PHRASES.filter((p) => p.categoryId === 'dolor');
    expect(dolorPhrases.length).toBeGreaterThanOrEqual(4);
  });

  it('uses stable string IDs (not numeric)', () => {
    for (const phrase of SEED_PHRASES) {
      expect(phrase.id).toMatch(/^[a-z]+-\d+$/);
    }
  });

  it('contains laringectomía-total specific content', () => {
    const texts = SEED_PHRASES.map((p) => p.text);
    // Clinical terms specific to laryngectomy
    expect(texts.some((t) => t.toLowerCase().includes('cánula'))).toBe(true);
    expect(texts.some((t) => t.toLowerCase().includes('secreciones'))).toBe(
      true,
    );
    expect(texts.some((t) => t.toLowerCase().includes('cirugía'))).toBe(true);
  });

  it('urgente phrases are marked as emergency', () => {
    const urgPhrases = SEED_PHRASES.filter((p) => p.categoryId === 'urgente');
    for (const phrase of urgPhrases) {
      expect(phrase.isEmergency).toBe(true);
    }
  });
});

describe('MOCK_PHRASES backward compatibility', () => {
  it('is a non-empty array', () => {
    expect(MOCK_PHRASES.length).toBeGreaterThan(0);
  });

  it('each phrase has id, text, categoryId', () => {
    for (const phrase of MOCK_PHRASES) {
      expect(typeof phrase.id).toBe('string');
      expect(typeof phrase.text).toBe('string');
      expect(typeof phrase.categoryId).toBe('string');
    }
  });

  it('ids are unique', () => {
    const ids = MOCK_PHRASES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('LEGACY_ID_MAP', () => {
  it('maps all 18 old IDs (p1-p18)', () => {
    expect(Object.keys(LEGACY_ID_MAP).length).toBe(18);
    for (let i = 1; i <= 18; i++) {
      expect(LEGACY_ID_MAP[`p${i}`]).toBeDefined();
    }
  });

  it('maps to valid seed phrase IDs', () => {
    const seedIds = new Set(SEED_PHRASES.map((p) => p.id));
    for (const newId of Object.values(LEGACY_ID_MAP)) {
      expect(seedIds.has(newId)).toBe(true);
    }
  });
});
