import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { MainApp } from '../App';
import App from '../App';
import { TTSSpeakerProvider } from '../lib/tts/TTSContext';
import { PatientProvider } from '../hooks/usePatient';
import type { TTSConfig } from '../lib/tts/ports/TTSPort';

class RejectingTTSProvider {
  async speak(_text: string, _config?: TTSConfig): Promise<void> {
    throw new Error('TTS failed');
  }
  stop(): void {}
  isSpeaking(): boolean {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Home tab
// ---------------------------------------------------------------------------
describe('Home tab', () => {
  it('renders greeting, emergency button and category grid', () => {
    render(<App />);
    expect(screen.getByText('Buen día, Paciente')).toBeInTheDocument();
    expect(screen.getByText('Llamado de Asistencia')).toBeInTheDocument();
    expect(screen.getByText('Categorías Frecuentes')).toBeInTheDocument();
  });

  it('renders all nine category buttons', () => {
    render(<App />);
    for (const label of [
      'Urgente',
      'Respiración',
      'Aspiración',
      'Dolor',
      'Posición',
      'Familia',
      'Necesidades',
      'Emociones',
      'Gratitud',
    ]) {
      // CategoryCard buttons include icon aria-label + title + description in accessible name
      expect(
        screen.getByRole('button', { name: new RegExp(label) }),
      ).toBeInTheDocument();
    }
  });

  it('emergency button is clickable and renders CTA', async () => {
    const user = userEvent.setup();
    render(<App />);

    const btn = screen
      .getAllByRole('button')
      .find((b) =>
        b.textContent?.includes('Llamado de Asistencia'),
      ) as HTMLButtonElement;
    expect(btn).toBeInTheDocument();
    await user.click(btn);
    // Button exists and was clicked without error
    expect(btn.textContent).toContain('Llamado de Asistencia');
  });
});

// ---------------------------------------------------------------------------
// Category detail
// ---------------------------------------------------------------------------
describe('Category detail', () => {
  it('navigates to a category and shows its phrases', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /Dolor/ }));

    expect(screen.getByText('Dolor')).toBeInTheDocument();
    expect(screen.getByText('Tengo dolor')).toBeInTheDocument();
    expect(screen.getByText('El dolor es insoportable')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Volver' })).toBeInTheDocument();
  });

  it('back button returns to home', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /Dolor/ }));
    await user.click(screen.getByRole('button', { name: 'Volver' }));

    expect(screen.getByText('Categorías Frecuentes')).toBeInTheDocument();
  });

  it('shows phrases for urgente category (all categories have seed data)', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /Urgente/ }));

    expect(screen.getByText('Necesito ayuda urgente')).toBeInTheDocument();
    expect(screen.getByText('No puedo respirar')).toBeInTheDocument();
  });

  it('phrase play button sets playing state', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /Dolor/ }));

    const phraseBtn = screen
      .getByText('Tengo dolor')
      .closest('button') as HTMLButtonElement;
    await user.click(phraseBtn);

    // Indicator dot inside the button has the playing class
    const dot = phraseBtn.querySelector('div > div');
    expect(dot?.className).toContain('bg-primary-action');
  });

  it('adds a phrase to favorites', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /Dolor/ }));

    // dol-1 ('Tengo dolor') is NOT a default favorite (empty set)
    const card = screen.getByText('Tengo dolor').closest('div') as HTMLElement;
    const starBtn = within(card).getByLabelText('Agregar a favoritos');
    await user.click(starBtn);

    // Verify added: navigate to favs and check presence
    await user.click(screen.getByRole('button', { name: /^Favoritos$/i }));
    expect(screen.getByText('Tengo dolor')).toBeInTheDocument();
  });

  it('removes a phrase already in favorites', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /Dolor/ }));

    // First add 'Tengo dolor' to favorites
    const card = screen.getByText('Tengo dolor').closest('div') as HTMLElement;
    const starBtn = within(card).getByLabelText('Agregar a favoritos');
    await user.click(starBtn); // Add

    // Then click again to remove — label changed to "Quitar de favoritos"
    const card2 = screen.getByText('Tengo dolor').closest('div') as HTMLElement;
    const starBtn2 = within(card2).getByLabelText('Quitar de favoritos');
    await user.click(starBtn2); // Remove

    // Verify removed: navigate to favs and check absence
    await user.click(screen.getByRole('button', { name: /^Favoritos$/i }));
    expect(screen.queryByText('Tengo dolor')).not.toBeInTheDocument();
  });

  it('covers multiple categories (respiracion, emociones)', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /Respiración/ }));
    expect(screen.getByText('Me falta el aire')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Volver' }));

    await user.click(screen.getByRole('button', { name: /Emociones/ }));
    expect(screen.getByText('Tengo mucho miedo')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Talk tab
// ---------------------------------------------------------------------------
describe('Talk tab', () => {
  it('shows talk view on navigation', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /^Escribir$/i }));

    expect(screen.getByText('Texto Libre')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Toca para escribir…'),
    ).toBeInTheDocument();
    expect(screen.getByText('Dictado por voz y clonación')).toBeInTheDocument();
  });

  it('play button is disabled when textarea is empty', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /^Escribir$/i }));

    expect(
      screen.getByRole('button', { name: /Reproducir Mensaje/i }),
    ).toBeDisabled();
  });

  it('play button enables after typing', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /^Escribir$/i }));
    await user.type(screen.getByPlaceholderText('Toca para escribir…'), 'Hola');

    expect(
      screen.getByRole('button', { name: /Reproducir Mensaje/i }),
    ).not.toBeDisabled();
  });

  it('suggestion button sets text when textarea is empty', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /^Escribir$/i }));
    await user.click(screen.getByRole('button', { name: 'Sí' }));

    expect(screen.getByDisplayValue('Sí')).toBeInTheDocument();
  });

  it('suggestion button appends text when textarea has content', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /^Escribir$/i }));
    await user.type(screen.getByPlaceholderText('Toca para escribir…'), 'Hola');
    await user.click(screen.getByRole('button', { name: 'Gracias' }));

    expect(screen.getByDisplayValue('Hola Gracias')).toBeInTheDocument();
  });

  it('all five suggestion buttons are present', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /^Escribir$/i }));

    for (const label of ['Sí', 'No', 'Gracias', 'Por favor', 'Me duele']) {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
    }
  });

  it('play button triggers play without error', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /^Escribir$/i }));
    await user.type(screen.getByPlaceholderText('Toca para escribir…'), 'Test');

    const playBtn = screen.getByRole('button', { name: /Reproducir Mensaje/i });
    await user.click(playBtn);

    // Button was clicked without error — it becomes disabled while speaking
    expect(playBtn).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Favorites tab
// ---------------------------------------------------------------------------
describe('Favorites tab', () => {
  it('shows empty state when no favorites exist', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /^Favoritos$/i }));

    expect(screen.getByText('Mis Favoritos')).toBeInTheDocument();
    expect(
      screen.getByText('Aún no tienes frases favoritas.'),
    ).toBeInTheDocument();
  });

  it('shows favorited phrases after adding them', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Navigate to Dolor and add a phrase
    await user.click(screen.getByRole('button', { name: /Dolor/ }));
    const card = screen.getByText('Tengo dolor').closest('div') as HTMLElement;
    const starBtn = within(card).getByLabelText('Agregar a favoritos');
    await user.click(starBtn);

    // Go to favorites
    await user.click(screen.getByRole('button', { name: /^Favoritos$/i }));
    expect(screen.getByText('Tengo dolor')).toBeInTheDocument();
  });

  it('plays a favorite phrase', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add a favorite first
    await user.click(screen.getByRole('button', { name: /Dolor/ }));
    const card = screen.getByText('Tengo dolor').closest('div') as HTMLElement;
    const starBtn = within(card).getByLabelText('Agregar a favoritos');
    await user.click(starBtn);

    await user.click(screen.getByRole('button', { name: /^Favoritos$/i }));

    const phraseBtn = screen
      .getByText('Tengo dolor')
      .closest('button') as HTMLButtonElement;
    await user.click(phraseBtn);
    const dot = phraseBtn.querySelector('div > div');
    expect(dot?.className).toContain('bg-primary-action');
  });

  it('removes a phrase from favorites via the star button', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add a favorite first
    await user.click(screen.getByRole('button', { name: /Dolor/ }));
    const card = screen.getByText('Tengo dolor').closest('div') as HTMLElement;
    const starBtn = within(card).getByLabelText('Agregar a favoritos');
    await user.click(starBtn);

    // Go to favorites and remove
    await user.click(screen.getByRole('button', { name: /^Favoritos$/i }));

    // Find the star button within the favorite phrase card
    const favCard = screen
      .getByText('Tengo dolor')
      .closest('div') as HTMLElement;
    const removeBtn = within(favCard).getByLabelText('Quitar de favoritos');
    await user.click(removeBtn);

    expect(screen.queryByText('Tengo dolor')).not.toBeInTheDocument();
  });

  it('shows empty state after all favorites are removed', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add a favorite first
    await user.click(screen.getByRole('button', { name: /Dolor/ }));
    const card = screen.getByText('Tengo dolor').closest('div') as HTMLElement;
    const starBtn = within(card).getByLabelText('Agregar a favoritos');
    await user.click(starBtn);

    // Go to favorites
    await user.click(screen.getByRole('button', { name: /^Favoritos$/i }));

    // Remove the favorite via its star button
    const favCard = screen
      .getByText('Tengo dolor')
      .closest('div') as HTMLElement;
    const removeBtn = within(favCard).getByLabelText('Quitar de favoritos');
    await user.click(removeBtn);

    expect(
      screen.getByText('Aún no tienes frases favoritas.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Marca la estrella en cualquier frase/i),
    ).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Profile tab
// ---------------------------------------------------------------------------
describe('Profile tab', () => {
  it('shows patient info and voice bank', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /^Perfil$/i }));

    expect(screen.getByText('Mi Perfil Clínico')).toBeInTheDocument();
    expect(screen.getByText('Mario Rojas')).toBeInTheDocument();
    expect(screen.getByText('Fase Preoperatoria')).toBeInTheDocument();
    expect(screen.getByText('Mi Banco de Voz')).toBeInTheDocument();
    expect(screen.getByText('Comenzar')).toBeInTheDocument();
  });

  it('shows accessibility section', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /^Perfil$/i }));

    expect(screen.getByText('Accesibilidad')).toBeInTheDocument();
    expect(screen.getByText('Volumen de Voz')).toBeInTheDocument();
  });

  it('shows surgical preparation section', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /^Perfil$/i }));

    expect(screen.getByText('Preparación Quirúrgica')).toBeInTheDocument();
    expect(screen.getByText('No iniciado')).toBeInTheDocument();
  });

  it('navigates to preop voice bank screen', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /^Perfil$/i }));

    // Click the voice bank card (it's a button)
    await user.click(screen.getByRole('button', { name: /Banco de Voz/i }));

    expect(screen.getByText('Banco de Voz')).toBeInTheDocument();
    expect(
      screen.getByText('Esta función estará disponible próximamente.'),
    ).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Bottom navigation
// ---------------------------------------------------------------------------
describe('Bottom navigation', () => {
  it('all four nav tabs are always visible', () => {
    render(<App />);
    for (const label of ['Inicio', 'Escribir', 'Favoritos', 'Perfil']) {
      expect(
        screen.getByRole('button', { name: new RegExp(`^${label}$`, 'i') }),
      ).toBeInTheDocument();
    }
  });

  it('Inicio nav resets to home from category detail', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /Dolor/ }));
    expect(screen.getByText('Tengo dolor')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^Inicio$/i }));
    expect(screen.getByText('Categorías Frecuentes')).toBeInTheDocument();
    expect(screen.queryByText('Tengo dolor')).not.toBeInTheDocument();
  });

  it('switches between all tabs without error', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /^Escribir$/i }));
    expect(screen.getByText('Texto Libre')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^Favoritos$/i }));
    expect(screen.getByText('Mis Favoritos')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^Perfil$/i }));
    expect(screen.getByText('Mi Perfil Clínico')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^Inicio$/i }));
    expect(screen.getByText('Buen día, Paciente')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// TTS error handling
// ---------------------------------------------------------------------------
describe('TTS error handling', () => {
  it('shows error banner when TTS fails and can be dismissed', async () => {
    const user = userEvent.setup();
    render(
      <PatientProvider>
        <TTSSpeakerProvider provider={new RejectingTTSProvider()}>
          <MainApp />
        </TTSSpeakerProvider>
      </PatientProvider>,
    );

    // Click emergency button to trigger TTS
    const btn = screen
      .getAllByRole('button')
      .find((b) =>
        b.textContent?.includes('Llamado de Asistencia'),
      ) as HTMLButtonElement;
    await user.click(btn);

    // Error banner should appear
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('No se pudo reproducir la frase.');

    // Dismiss button should clear the banner
    const dismissBtn = screen.getByRole('button', { name: /Cerrar error/i });
    await user.click(dismissBtn);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
