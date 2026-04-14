import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { FavoritesRepository } from '../lib/persistence/FavoritesRepository';
import { CustomPhrasesRepository } from '../lib/persistence/CustomPhrasesRepository';

// Node 25 provides a bare localStorage object without methods.
// Provide a working in-memory implementation scoped to this file.
const originalLocalStorage = globalThis.localStorage;
let store: Record<string, string> = {};

function createLocalStorage() {
  store = {};
  return {
    getItem(key: string) {
      return key in store ? store[key] : null;
    },
    setItem(key: string, value: string) {
      store[key] = String(value);
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key(_index: number) {
      return null;
    },
  };
}

beforeEach(() => {
  globalThis.localStorage = createLocalStorage() as Storage;
  vi.clearAllMocks();
});

afterEach(() => {
  globalThis.localStorage = originalLocalStorage;
});

// ---------------------------------------------------------------------------
// SC-LS-1: Persist favorites across reloads
// ---------------------------------------------------------------------------
describe('FavoritesRepository', () => {
  it('persists favorites across instances (SC-LS-1)', () => {
    FavoritesRepository.addFavorite('urg-1');

    // New instance reads from same localStorage
    const result = FavoritesRepository.getFavorites();
    expect(result).toContain('urg-1');
  });

  it('adds and checks favorites', () => {
    FavoritesRepository.addFavorite('dol-1');
    expect(FavoritesRepository.isFavorite('dol-1')).toBe(true);
    expect(FavoritesRepository.isFavorite('dol-2')).toBe(false);
  });

  it('removes favorites', () => {
    FavoritesRepository.addFavorite('urg-1');
    FavoritesRepository.removeFavorite('urg-1');
    expect(FavoritesRepository.isFavorite('urg-1')).toBe(false);
    expect(FavoritesRepository.getFavorites()).not.toContain('urg-1');
  });

  it('does not add duplicate favorites', () => {
    FavoritesRepository.addFavorite('urg-1');
    FavoritesRepository.addFavorite('urg-1');
    expect(
      FavoritesRepository.getFavorites().filter((id) => id === 'urg-1'),
    ).toHaveLength(1);
  });

  it('uses tqt-favorites storage key (SC-LS-7)', () => {
    const spy = vi.spyOn(localStorage, 'setItem');
    FavoritesRepository.addFavorite('urg-1');
    expect(spy).toHaveBeenCalledWith('tqt-favorites', expect.any(String));
    spy.mockRestore();
  });

  it('includes _version field in stored data (SC-LS-6)', () => {
    FavoritesRepository.addFavorite('urg-1');
    const raw = localStorage.getItem('tqt-favorites');
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed._version).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// SC-LS-4 & SC-LS-5: CustomPhrasesRepository
// ---------------------------------------------------------------------------
describe('CustomPhrasesRepository', () => {
  it('creates a custom phrase with auto-ID (SC-LS-4)', () => {
    const phrase = CustomPhrasesRepository.create({
      text: 'Necesito mi cánula',
      categoryId: 'respiracion',
      isCustom: true,
    });

    expect(phrase.id.startsWith('custom_')).toBe(true);
    expect(phrase.text).toBe('Necesito mi cánula');
    expect(phrase.categoryId).toBe('respiracion');
    expect(phrase.isCustom).toBe(true);
    expect(phrase.createdAt).toBeDefined();
  });

  it('getAll returns all created phrases', () => {
    CustomPhrasesRepository.create({
      text: 'Phrase 1',
      categoryId: 'dolor',
      isCustom: true,
    });
    CustomPhrasesRepository.create({
      text: 'Phrase 2',
      categoryId: 'emociones',
      isCustom: true,
    });

    const all = CustomPhrasesRepository.getAll();
    expect(all.length).toBeGreaterThanOrEqual(2);
  });

  it('getById finds a phrase by ID', () => {
    const created = CustomPhrasesRepository.create({
      text: 'Find me',
      categoryId: 'dolor',
      isCustom: true,
    });

    const found = CustomPhrasesRepository.getById(created.id);
    expect(found).toBeDefined();
    // Biome rule noNonNullAssertion: use optional chain
    expect(found?.text).toBe('Find me');
  });

  it('getById returns undefined for missing ID', () => {
    expect(CustomPhrasesRepository.getById('nonexistent')).toBeUndefined();
  });

  it('updates phrase text', () => {
    const created = CustomPhrasesRepository.create({
      text: 'Original',
      categoryId: 'dolor',
      isCustom: true,
    });

    const updated = CustomPhrasesRepository.update(created.id, 'Updated');
    expect(updated.text).toBe('Updated');
    expect(updated.id).toBe(created.id);
  });

  it('deletes a custom phrase (SC-LS-5)', () => {
    const created = CustomPhrasesRepository.create({
      text: 'Delete me',
      categoryId: 'dolor',
      isCustom: true,
    });

    CustomPhrasesRepository.delete(created.id);
    expect(CustomPhrasesRepository.getById(created.id)).toBeUndefined();
  });

  it('uses tqt-custom-phrases storage key (SC-LS-7)', () => {
    const spy = vi.spyOn(localStorage, 'setItem');
    CustomPhrasesRepository.create({
      text: 'Test',
      categoryId: 'dolor',
      isCustom: true,
    });
    expect(spy).toHaveBeenCalledWith('tqt-custom-phrases', expect.any(String));
    spy.mockRestore();
  });

  it('includes _version field in stored data (SC-LS-6)', () => {
    CustomPhrasesRepository.create({
      text: 'Test',
      categoryId: 'dolor',
      isCustom: true,
    });
    const raw = localStorage.getItem('tqt-custom-phrases');
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed._version).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// SC-LS-2 & SC-LS-3: useLocalStorage error handling
// ---------------------------------------------------------------------------
describe('localStorage error handling', () => {
  it('handles corrupt JSON gracefully (SC-LS-3)', () => {
    vi.spyOn(localStorage, 'getItem').mockReturnValueOnce('{invalid json');
    const result = FavoritesRepository.getFavorites();
    expect(result).toEqual([]);
  });

  it('handles unavailable localStorage (SC-LS-2)', () => {
    vi.spyOn(localStorage, 'getItem').mockImplementationOnce(() => {
      throw new Error('localStorage not available');
    });
    const result = FavoritesRepository.getFavorites();
    expect(result).toEqual([]);
  });

  it('handles write errors gracefully', () => {
    vi.spyOn(localStorage, 'setItem').mockImplementationOnce(() => {
      throw new Error('QuotaExceededError');
    });
    expect(() => FavoritesRepository.addFavorite('urg-1')).not.toThrow();
  });
});
