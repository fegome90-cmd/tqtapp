import {
  createContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  useContext,
  type ReactNode,
} from 'react';
import { MockTTSProvider } from './providers';
import type { TTSProvider as ITTSProvider, TTSConfig } from './ports/TTSPort';

interface TTSContextValue {
  speak: (text: string, config?: TTSConfig) => Promise<void>;
  stop: () => void;
  isSpeaking: boolean;
}

const TTSContext = createContext<TTSContextValue | null>(null);

interface TTSProviderProps {
  children: ReactNode;
  provider?: ITTSProvider;
}

export function TTSSpeakerProvider({
  children,
  provider: customProvider,
}: TTSProviderProps) {
  const [provider] = useState<ITTSProvider>(
    () => customProvider || new MockTTSProvider(),
  );
  const [speaking, setSpeaking] = useState(false);

  const speak = useCallback(
    async (text: string, config?: TTSConfig): Promise<void> => {
      setSpeaking(true);
      try {
        await provider.speak(text, config);
      } finally {
        setSpeaking(false);
      }
    },
    [provider],
  );

  const stop = useCallback(() => {
    provider.stop();
    setSpeaking(false);
  }, [provider]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      provider.stop();
    };
  }, [provider]);

  const value = useMemo(
    () => ({
      speak,
      stop,
      isSpeaking: speaking,
    }),
    [speak, stop, speaking],
  );

  return <TTSContext.Provider value={value}>{children}</TTSContext.Provider>;
}

// Hook para consumir el contexto TTS
export function useTTS() {
  const context = useContext(TTSContext);

  if (!context) {
    // Return default values if not wrapped by provider
    return {
      speak: async (_text: string, _config?: TTSConfig) => {},
      stop: () => {},
      isSpeaking: false,
    };
  }

  return context;
}

export { TTSContext };
