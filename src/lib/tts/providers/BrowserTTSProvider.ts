import type { TTSProvider, TTSConfig } from '../ports/TTSPort';

/** Web Speech API based TTS provider for browser environments */
export class BrowserTTSProvider implements TTSProvider {
  /**
   * @throws {Error} when Web Speech API unavailable
   */
  constructor() {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      throw new Error(
        'Web Speech API is not available in this environment. Cannot initialize BrowserTTSProvider.',
      );
    }
  }

  /**
   * @param text - The text to speak
   * @param config - Optional TTS configuration (rate, pitch, voice)
   * @returns {Promise<void>} Resolves when speech completes, rejects on error
   */
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

  /** Cancels any ongoing speech */
  stop(): void {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }
}
