import { describe, expect, it } from 'vitest';
import { CATEGORIES, MOCK_PHRASES } from '../data/mock';
import type { CategoryId } from '../types';

describe('CATEGORIES', () => {
  it('is a non-empty array', () => {
    expect(CATEGORIES.length).toBeGreaterThan(0);
  });

  it('each category has required fields', () => {
    for (const cat of CATEGORIES) {
      expect(typeof cat.id).toBe('string');
      expect(typeof cat.title).toBe('string');
      expect(typeof cat.icon).toBe('string');
      expect(typeof cat.color).toBe('string');
    }
  });

  it('contains expected categories', () => {
    const ids = CATEGORIES.map((c) => c.id);
    expect(ids).toContain('dolor');
    expect(ids).toContain('respiracion');
    expect(ids).toContain('emociones');
    expect(ids).toContain('urgente');
  });
});

describe('MOCK_PHRASES', () => {
  it('is a non-empty array', () => {
    expect(MOCK_PHRASES.length).toBeGreaterThan(0);
  });

  it('each phrase has required fields', () => {
    for (const phrase of MOCK_PHRASES) {
      expect(typeof phrase.id).toBe('string');
      expect(typeof phrase.text).toBe('string');
      expect(typeof phrase.categoryId).toBe('string');
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
    for (const phrase of MOCK_PHRASES) {
      expect(validIds).toContain(phrase.categoryId);
    }
  });

  it('ids are unique', () => {
    const ids = MOCK_PHRASES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
