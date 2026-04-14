import { useState, useCallback } from 'react';

export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
): {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  removeValue: () => void;
  isLoaded: boolean;
} {
  const prefixedKey = `tqt-${key}`;

  const [storedValue, setStoredValue] = useState<{ data: T; loaded: boolean }>(
    () => {
      try {
        const item = localStorage.getItem(prefixedKey);
        if (item === null) {
          return { data: defaultValue, loaded: true };
        }
        const parsed = JSON.parse(item) as T;
        return { data: parsed, loaded: true };
      } catch {
        return { data: defaultValue, loaded: true };
      }
    },
  );

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const nextValue = value instanceof Function ? value(prev.data) : value;
        try {
          localStorage.setItem(prefixedKey, JSON.stringify(nextValue));
        } catch {
          // localStorage unavailable or quota exceeded
        }
        return { data: nextValue, loaded: true };
      });
    },
    [prefixedKey],
  );

  const removeValue = useCallback(() => {
    try {
      localStorage.removeItem(prefixedKey);
    } catch {
      // localStorage unavailable
    }
    setStoredValue({ data: defaultValue, loaded: true });
  }, [prefixedKey, defaultValue]);

  return {
    value: storedValue.data,
    setValue,
    removeValue,
    isLoaded: storedValue.loaded,
  };
}
