import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BrowserTTSProvider } from '../lib/tts/providers/BrowserTTSProvider';

const mockSpeak = vi.fn();
const mockCancel = vi.fn();
const mockGetVoices = vi.fn();

// Mock SpeechSynthesisUtterance — it's a global constructor used directly
// by BrowserTTSProvider (not via window.SpeechSynthesisUtterance)
class MockUtterance {
  lang = '';
  rate = 1;
  pitch = 1;
  voice: SpeechSynthesisVoice | null = null;
  onend: (() => void) | null = null;
  onerror: ((event: SpeechSynthesisErrorEvent) => void) | null = null;
  constructor(public text: string) {}
}

describe('BrowserTTSProvider', () => {
  let originalSpeechSynthesisUtterance: typeof SpeechSynthesisUtterance;

  beforeEach(() => {
    vi.restoreAllMocks();
    mockGetVoices.mockReturnValue([{ name: 'Spanish ES', lang: 'es-ES' }]);

    // Save and replace the global constructor
    originalSpeechSynthesisUtterance = globalThis.SpeechSynthesisUtterance;
    // @ts-expect-error — mocking browser global for test
    globalThis.SpeechSynthesisUtterance = MockUtterance;

    // Mock window.speechSynthesis
    Object.defineProperty(globalThis, 'window', {
      value: {
        speechSynthesis: {
          speak: mockSpeak,
          cancel: mockCancel,
          getVoices: mockGetVoices,
        },
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
    // restoring browser global
    globalThis.SpeechSynthesisUtterance = originalSpeechSynthesisUtterance;
  });

  it('initializes when speech synthesis available', () => {
    expect(() => new BrowserTTSProvider()).not.toThrow();
  });

  it('throws when speech synthesis missing', () => {
    Object.defineProperty(globalThis, 'window', { value: {}, writable: true });
    expect(() => new BrowserTTSProvider()).toThrow('not available');
  });

  it('calls speak with utterance', async () => {
    mockSpeak.mockImplementation((utterance: MockUtterance) => {
      utterance.onend?.();
    });

    const provider = new BrowserTTSProvider();
    await provider.speak('test');
    expect(mockSpeak).toHaveBeenCalledTimes(1);
    expect(mockSpeak.mock.calls[0][0]).toBeInstanceOf(MockUtterance);
    expect(mockSpeak.mock.calls[0][0].text).toBe('test');
  });

  it('cancels before speak', async () => {
    mockSpeak.mockImplementation((utterance: MockUtterance) => {
      utterance.onend?.();
    });

    const provider = new BrowserTTSProvider();
    await provider.speak('test');
    expect(mockCancel).toHaveBeenCalled();
  });

  it('calls stop', () => {
    const provider = new BrowserTTSProvider();
    provider.stop();
    expect(mockCancel).toHaveBeenCalled();
  });

  it('handles empty config', async () => {
    mockSpeak.mockImplementation((utterance: MockUtterance) => {
      utterance.onend?.();
    });

    const provider = new BrowserTTSProvider();
    await provider.speak('test', {});
    expect(mockSpeak).toHaveBeenCalled();
  });

  it('handles rate config', async () => {
    mockSpeak.mockImplementation((utterance: MockUtterance) => {
      utterance.onend?.();
    });

    const provider = new BrowserTTSProvider();
    await provider.speak('test', { rate: 2 });
    const utterance = mockSpeak.mock.calls[0][0] as MockUtterance;
    expect(utterance.rate).toBe(2);
  });

  it('handles pitch config', async () => {
    mockSpeak.mockImplementation((utterance: MockUtterance) => {
      utterance.onend?.();
    });

    const provider = new BrowserTTSProvider();
    await provider.speak('test', { pitch: 0.5 });
    const utterance = mockSpeak.mock.calls[0][0] as MockUtterance;
    expect(utterance.pitch).toBe(0.5);
  });

  it('handles voice config', async () => {
    mockSpeak.mockImplementation((utterance: MockUtterance) => {
      utterance.onend?.();
    });

    const provider = new BrowserTTSProvider();
    await provider.speak('test', { voice: 'Spanish' });
    expect(mockGetVoices).toHaveBeenCalled();
    const utterance = mockSpeak.mock.calls[0][0] as MockUtterance;
    expect(utterance.voice).toEqual({ name: 'Spanish ES', lang: 'es-ES' });
  });

  it('handles stop without window', () => {
    const provider = new BrowserTTSProvider();
    Object.defineProperty(globalThis, 'window', {
      value: { speechSynthesis: undefined },
      writable: true,
    });
    expect(() => provider.stop()).not.toThrow();
  });

  it('rejects on speech synthesis error', async () => {
    mockSpeak.mockImplementation((utterance: MockUtterance) => {
      utterance.onerror?.({ error: 'network' } as SpeechSynthesisErrorEvent);
    });

    const provider = new BrowserTTSProvider();
    await expect(provider.speak('test')).rejects.toThrow(
      'Speech synthesis error: network',
    );
  });
});
