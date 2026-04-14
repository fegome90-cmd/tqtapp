import { useState, useCallback } from 'react';
import type { CustomPhrase } from '../types';
import { CustomPhrasesRepository } from '../lib/persistence/CustomPhrasesRepository';

export function useCustomPhrases() {
  const [phrases, setPhrases] = useState<CustomPhrase[]>(() =>
    CustomPhrasesRepository.getAll(),
  );

  const getAll = useCallback(() => phrases, [phrases]);

  const create = useCallback(
    (data: { text: string; categoryId: CustomPhrase['categoryId'] }) => {
      const newPhrase = CustomPhrasesRepository.create({
        text: data.text,
        categoryId: data.categoryId,
        isCustom: true,
      });
      setPhrases((prev) => [...prev, newPhrase]);
      return newPhrase;
    },
    [],
  );

  const remove = useCallback((id: string) => {
    CustomPhrasesRepository.delete(id);
    setPhrases((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return { phrases, getAll, create, delete: remove };
}
