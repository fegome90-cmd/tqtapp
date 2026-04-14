import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Force MockTTSProvider in tests by removing speechSynthesis
// This ensures TTSContext falls back to the mock provider that resolves predictably
// BrowserTTSProvider requires real Web Speech API which jsdom doesn't fully implement
if (typeof globalThis.window !== 'undefined') {
  delete globalThis.window.speechSynthesis;
}

afterEach(() => {
  cleanup();
  // Use real timers in case a previous test left fake timers active
  vi.useRealTimers();
  // Clear any pending timers from TTS or handlePlay
  vi.clearAllTimers();
  // Clear localStorage to prevent state bleeding between tests
  if (typeof localStorage !== 'undefined' && typeof localStorage.clear === 'function') {
    localStorage.clear();
  }
});
