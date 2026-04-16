import type { TTSProvider, TTSConfig } from '../ports/TTSPort';

export class BrowserTTSProvider implements TTSProvider {
  constructor() {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      throw new Error(
        'Web Speech API is not available in this environment. Cannot initialize BrowserTTSProvider.',
      );
    }
  }

  async speak(text: string, config?: TTSConfig): Promise<void> {
    this.stop();

    return new Promise<void>((resolve, reject) => {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';

        if (config?.rate !== undefined) {
          utterance.rate = config.rate;
        }
        if (config?.pitch !== undefined) {
          utterance.pitch = config.pitch;
        }
        if (config?.voice) {
          const voices = window.speechSynthesis.getVoices();
          const match = voices.find((v) =>
            v.name.includes(config.voice as string),
          );
          if (match) {
            utterance.voice = match;
          }
        }

        utterance.onend = () => {
          resolve();
        };

        utterance.onerror = (event) => {
          reject(new Error(`Speech synthesis error: ${event.error}`));
        };

        window.speechSynthesis.speak(utterance);
      } catch (error) {
        reject(
          new Error(
            `Failed to initialize speech synthesis: ${error instanceof Error ? error.message : String(error)}`,
          ),
        );
      }
    });
  }

  stop(): void {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }
}
