import {
  createContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  useContext,
  type ReactNode,
} from 'react';
import { MockTTSProvider } from './providers/MockTTSProvider';
import { BrowserTTSProvider } from './providers/BrowserTTSProvider';
import type { TTSProvider as ITTSProvider, TTSConfig } from './ports/TTSPort';

function createDefaultProvider(): ITTSProvider {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      return new BrowserTTSProvider();
    } catch {
      return new MockTTSProvider();
    }
  }
  return new MockTTSProvider();
}

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
    () => customProvider || createDefaultProvider(),
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

export function useTTS() {
  const context = useContext(TTSContext);
  if (!context) {
    throw new Error('useTTS must be used within a TTSSpeakerProvider');
  }
  return context;
}
