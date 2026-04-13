import type { TTSProvider, TTSConfig } from '../ports/TTSPort';

/**
 * Mock TTS Provider for development
 * Simulates TTS with a simple delay
 */
export class MockTTSProvider implements TTSProvider {
  private speaking = false;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private pendingResolve: (() => void) | null = null;

  async speak(_text: string, _config?: TTSConfig): Promise<void> {
    // Stop any existing speech first (settles pending promise)
    this.stop();

    this.speaking = true;

    return new Promise((resolve) => {
      this.pendingResolve = resolve;
      this.timeoutId = setTimeout(() => {
        this.speaking = false;
        this.timeoutId = null;
        this.pendingResolve = null;
        resolve();
      }, 1200);
    });
  }

  stop(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    if (this.pendingResolve) {
      this.pendingResolve();
      this.pendingResolve = null;
    }
    this.speaking = false;
  }

  isSpeaking(): boolean {
    return this.speaking;
  }
}
