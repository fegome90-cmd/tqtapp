import type { TTSProvider, TTSConfig } from '../ports/TTSPort';

/**
 * Mock TTS Provider for development
 * Simulates TTS with a simple delay
 */
export class MockTTSProvider implements TTSProvider {
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  async speak(_text: string, _config?: TTSConfig): Promise<void> {
    // Stop any existing speech first
    this.stop();

    return new Promise((resolve) => {
      this.timeoutId = setTimeout(() => {
        this.timeoutId = null;
        resolve();
      }, 1200);
    });
  }

  stop(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
