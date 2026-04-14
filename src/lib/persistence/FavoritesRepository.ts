const STORAGE_KEY = 'tqt-favorites';

interface FavoritesData {
  _version: number;
  ids: string[];
}

function read(): FavoritesData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { _version: 1, ids: [] };
    const parsed = JSON.parse(raw) as FavoritesData;
    if (!parsed.ids || !Array.isArray(parsed.ids)) {
      return { _version: 1, ids: [] };
    }
    return parsed;
  } catch {
    return { _version: 1, ids: [] };
  }
}

function write(data: FavoritesData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage unavailable or quota exceeded
  }
}

export const FavoritesRepository = {
  getFavorites(): string[] {
    return read().ids;
  },

  addFavorite(id: string): void {
    const data = read();
    if (!data.ids.includes(id)) {
      data.ids.push(id);
      write(data);
    }
  },

  removeFavorite(id: string): void {
    const data = read();
    data.ids = data.ids.filter((existing) => existing !== id);
    write(data);
  },

  isFavorite(id: string): boolean {
    return read().ids.includes(id);
  },
};
