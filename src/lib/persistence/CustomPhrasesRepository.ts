import type { CustomPhrase } from '../../types';

const STORAGE_KEY = 'tqt-custom-phrases';

interface CustomPhrasesData {
  _version: number;
  phrases: CustomPhrase[];
}

function read(): CustomPhrasesData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { _version: 1, phrases: [] };
    const parsed = JSON.parse(raw) as CustomPhrasesData;
    if (!parsed.phrases || !Array.isArray(parsed.phrases)) {
      return { _version: 1, phrases: [] };
    }
    return parsed;
  } catch (error) {
    console.error(
      '[CustomPhrasesRepository] Failed to read from localStorage:',
      error,
    );
    return { _version: 1, phrases: [] };
  }
}

function write(data: CustomPhrasesData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error(
      '[CustomPhrasesRepository] Failed to write to localStorage:',
      error,
    );
  }
}

export const CustomPhrasesRepository = {
  getAll(): CustomPhrase[] {
    return read().phrases;
  },

  getById(id: string): CustomPhrase | undefined {
    return read().phrases.find((p) => p.id === id);
  },

  create(phrase: Omit<CustomPhrase, 'id' | 'createdAt'>): CustomPhrase {
    const text = phrase.text.trim();
    if (text.length === 0) {
      throw new Error('Phrase text cannot be empty');
    }
    if (text.length > 500) {
      throw new Error('Phrase text cannot exceed 500 characters');
    }
    const newPhrase: CustomPhrase = {
      ...phrase,
      text,
      id: `custom_${crypto.randomUUID()}`,
      createdAt: new Date().toISOString(),
    };
    const data = read();
    data.phrases.push(newPhrase);
    write(data);
    return newPhrase;
  },

  update(id: string, text: string): CustomPhrase {
    const data = read();
    const index = data.phrases.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`CustomPhrase with id "${id}" not found`);
    }
    data.phrases[index] = { ...data.phrases[index], text };
    write(data);
    return data.phrases[index];
  },

  delete(id: string): void {
    const data = read();
    data.phrases = data.phrases.filter((p) => p.id !== id);
    write(data);
  },
};
