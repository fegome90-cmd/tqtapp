import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { FavoritesRepository } from '../lib/persistence/FavoritesRepository';

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
    const parsed = JSON.parse(raw as string);
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
