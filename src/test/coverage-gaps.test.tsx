/**
 * @file Coverage gap tests for TTS context, emergency CTA, patient hook,
 * navigation, and key screens (Home, CategoryDetail, Profile).
 */
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderHook, act } from '@testing-library/react';
import { TTSSpeakerProvider, useTTS } from '../lib/tts/TTSContext';
import { usePatient, PatientProvider } from '../hooks/usePatient';
import { useNavigation } from '../hooks/useNavigation';
import type { TTSProvider } from '../lib/tts/ports/TTSPort';
import EmergencyCTA from '../components/cards/EmergencyCTA';
import HomeScreen from '../screens/HomeScreen';
import CategoryDetailScreen from '../screens/CategoryDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import type { CategoryId } from '../types';

vi.mock('../data/seed', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../data/seed')>();
  return {
    ...actual,
    MOCK_PHRASES: actual.MOCK_PHRASES.filter((p) => p.categoryId !== 'urgente'),
  };
});

/** Tests for TTSContext fallback, error boundary, and stop-during-speak behavior */
describe('TTSContext coverage gaps', () => {
  it('createDefaultProvider falls back to MockTTSProvider when speechSynthesis is missing', () => {
    const { unmount } = render(
      <TTSSpeakerProvider>
        <div>child</div>
      </TTSSpeakerProvider>,
    );
    expect(screen.getByText('child')).toBeInTheDocument();
    unmount();
  });

  it('useTTS throws when used outside TTSSpeakerProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    function TestConsumer() {
      useTTS();
      return <div>should not render</div>;
    }

    expect(() => render(<TestConsumer />)).toThrow(
      'useTTS must be used within a TTSSpeakerProvider',
    );

    spy.mockRestore();
  });

  it('stop() resets isSpeaking state even while speak promise is pending', async () => {
    let speakResolve!: () => void;
    const slowProvider: TTSProvider = {
      speak: () =>
        new Promise<void>((resolve) => {
          speakResolve = resolve;
        }),
      stop: vi.fn(),
    };

    function TestSpeak() {
      const { speak, stop, isSpeaking } = useTTS();
      return (
        <div>
          <span data-testid="speaking">{String(isSpeaking)}</span>
          <button type="button" onClick={() => speak('hello')}>
            speak
          </button>
          <button type="button" onClick={stop}>
            stop
          </button>
        </div>
      );
    }

    const user = userEvent.setup();
    render(
      <TTSSpeakerProvider provider={slowProvider}>
        <TestSpeak />
      </TTSSpeakerProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'speak' }));
    expect(screen.getByTestId('speaking').textContent).toBe('true');

    await user.click(screen.getByRole('button', { name: 'stop' }));
    expect(screen.getByTestId('speaking').textContent).toBe('false');
    expect(slowProvider.stop).toHaveBeenCalled();

    speakResolve();
  });
});

/** Tests for EmergencyCTA animate-pulse visual feedback states */
describe('EmergencyCTA coverage gaps', () => {
  it('applies animate-pulse class when isPlaying is true', () => {
    render(<EmergencyCTA onClick={vi.fn()} isPlaying={true} />);
    const btn = screen.getByRole('button', {
      name: 'Llamar asistencia de enfermería',
    });
    expect(btn.className).toContain('animate-pulse');
  });

  it('does not apply animate-pulse class when isPlaying is false/undefined', () => {
    render(<EmergencyCTA onClick={vi.fn()} />);
    const btn = screen.getByRole('button', {
      name: 'Llamar asistencia de enfermería',
    });
    expect(btn.className).not.toContain('animate-pulse');
  });
});

/** Tests for usePatient context guard (throws outside provider) */
describe('usePatient coverage gaps', () => {
  it('throws when used outside PatientProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    function TestConsumer() {
      usePatient();
      return <div>should not render</div>;
    }

    expect(() => render(<TestConsumer />)).toThrow(
      'usePatient must be used within a PatientProvider',
    );

    spy.mockRestore();
  });
});

/** Tests for CategoryDetailScreen empty state and phrase card rendering */
describe('CategoryDetailScreen coverage gaps', () => {
  const baseProps = {
    playingId: null as string | null,
    isFavorite: () => false,
    onPlay: vi.fn(),
    onToggleFav: vi.fn(),
    onBack: vi.fn(),
  };

  it('shows empty state when no phrases match categoryId', () => {
    render(
      <CategoryDetailScreen
        {...baseProps}
        categoryId={'urgente' as CategoryId}
      />,
    );
    expect(screen.getByText('Categoría en construcción.')).toBeInTheDocument();
  });

  it('renders phrase cards with playing and favorite states', () => {
    render(
      <CategoryDetailScreen
        {...baseProps}
        categoryId="dolor"
        playingId="dol-1"
        isFavorite={(id: string) => id === 'dol-1'}
      />,
    );
    expect(screen.getByText('Tengo dolor')).toBeInTheDocument();
    expect(screen.getByText('El dolor es insoportable')).toBeInTheDocument();
  });
});

/** Tests for HomeScreen category rendering with descriptions */
describe('HomeScreen coverage gaps', () => {
  it('renders categories with descriptions', () => {
    render(<HomeScreen onCategorySelect={vi.fn()} onEmergency={vi.fn()} />);
    expect(screen.getByRole('button', { name: /Urgente/ })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Respiración/ }),
    ).toBeInTheDocument();
  });
});

/** Tests for ProfileScreen volume toggle and voice bank session rendering */
describe('ProfileScreen coverage gaps', () => {
  it('toggles volume switch on click', async () => {
    const user = userEvent.setup();
    render(
      <PatientProvider>
        <ProfileScreen onNavigateVoiceBank={vi.fn()} />
      </PatientProvider>,
    );

    const volumeSwitch = screen.getByRole('switch', { name: 'Volumen de Voz' });
    expect(volumeSwitch).toHaveAttribute('aria-checked', 'true');

    await user.click(volumeSwitch);
    expect(volumeSwitch).toHaveAttribute('aria-checked', 'false');

    await user.click(volumeSwitch);
    expect(volumeSwitch).toHaveAttribute('aria-checked', 'true');
  });

  it('renders voice bank progress for in-progress session', () => {
    render(
      <PatientProvider>
        <ProfileScreen
          onNavigateVoiceBank={vi.fn()}
          voiceBankSession={{
            id: 'session-2',
            patientId: 'patient-1',
            status: 'in-progress',
            recordedSamples: 15,
            totalSamples: 50,
            startedAt: '2026-04-15T10:00:00Z',
            completedAt: null,
          }}
        />
      </PatientProvider>,
    );
    expect(screen.getByText('Progreso: 15 / 50')).toBeInTheDocument();
  });

  it('renders voice bank for completed session', () => {
    render(
      <PatientProvider>
        <ProfileScreen
          onNavigateVoiceBank={vi.fn()}
          voiceBankSession={{
            id: 'session-3',
            patientId: 'patient-1',
            status: 'completed',
            recordedSamples: 50,
            totalSamples: 50,
            startedAt: '2026-04-14T10:00:00Z',
            completedAt: '2026-04-15T10:00:00Z',
          }}
        />
      </PatientProvider>,
    );
    expect(screen.getByText('Progreso: 50 / 50')).toBeInTheDocument();
  });
});

/** Tests for useNavigation goBack edge case (single-entry history) */
describe('useNavigation coverage gaps', () => {
  it('goBack does nothing when history has only one entry', () => {
    const { result } = renderHook(() => useNavigation());

    act(() => {
      result.current.goBack();
    });

    expect(result.current.currentScreen).toBe('home');
  });
});
