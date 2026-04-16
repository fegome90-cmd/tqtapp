/**
 * TTS Configuration interface
 */
export interface TTSConfig {
  voice?: string;
  rate?: number;
  pitch?: number;
}

/**
 * TTS Provider interface
 * Abstract contract for any TTS implementation
 */
export interface TTSProvider {
  /**
   * Speak the given text with optional configuration
   */
  speak(text: string, config?: TTSConfig): Promise<void>;

  /**
   * Stop any ongoing speech
   */
  stop(): void;
}
