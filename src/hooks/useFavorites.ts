import { useState, useCallback, useMemo } from 'react';
import { FavoritesRepository } from '../lib/persistence/FavoritesRepository';

export function useFavorites() {
  const [favoritesSet, setFavoritesSet] = useState<Set<string>>(() => {
    const stored = FavoritesRepository.getFavorites();
    return new Set(stored);
  });

  const isFavorite = useCallback(
    (id: string) => favoritesSet.has(id),
    [favoritesSet],
  );

  const toggleFavorite = useCallback((id: string) => {
    setFavoritesSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        FavoritesRepository.removeFavorite(id);
      } else {
        next.add(id);
        FavoritesRepository.addFavorite(id);
      }
      return next;
    });
  }, []);

  const favorites = useMemo(
    () => favoritesSet as ReadonlySet<string>,
    [favoritesSet],
  );

  return {
    favorites,
    isFavorite,
    toggleFavorite,
  };
}
