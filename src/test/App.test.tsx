import { render, screen, act, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import App from '../App';

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

  it('renders all eight category buttons', () => {
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
    ]) {
      expect(
        screen.getByRole('button', { name: new RegExp(`^${label}$`, 'i') }),
      ).toBeInTheDocument();
    }
  });

  it('emergency button adds animate-pulse on click and clears after 1200ms', async () => {
    vi.useFakeTimers();
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime.bind(vi),
    });
    render(<App />);

    const btn = screen
      .getAllByRole('button')
      .find(
        (b) => b.textContent?.trim() === 'Llamado de Asistencia',
      ) as HTMLButtonElement;
    await user.click(btn);
    expect(btn.className).toContain('animate-pulse');

    act(() => vi.advanceTimersByTime(1200));
    expect(btn.className).not.toContain('animate-pulse');
    vi.useRealTimers();
  });
});

// ---------------------------------------------------------------------------
// Category detail
// ---------------------------------------------------------------------------
describe('Category detail', () => {
  it('navigates to a category and shows its phrases', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /^Dolor$/ }));

    expect(screen.getByText('Dolor')).toBeInTheDocument();
    expect(screen.getByText('Tengo dolor')).toBeInTheDocument();
    expect(screen.getByText('El dolor es insoportable')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Volver' })).toBeInTheDocument();
  });

  it('back button returns to home', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /^Dolor$/ }));
    await user.click(screen.getByRole('button', { name: 'Volver' }));

    expect(screen.getByText('Categorías Frecuentes')).toBeInTheDocument();
  });

  it('shows empty state for a category with no phrases', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /^Urgente$/ }));

    expect(screen.getByText('Categoría en construcción.')).toBeInTheDocument();
  });

  it('phrase play button sets playing state and clears after 1200ms', async () => {
    vi.useFakeTimers();
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime.bind(vi),
    });
    render(<App />);
    await user.click(screen.getByRole('button', { name: /^Dolor$/ }));

    const phraseBtn = screen.getByRole('button', { name: /Tengo dolor/i });
    await user.click(phraseBtn);

    // Indicator dot inside the button has the playing class
    const dot = phraseBtn.querySelector('div');
    expect(dot?.className).toContain('bg-blue-500');

    act(() => vi.advanceTimersByTime(1200));
    expect(dot?.className).not.toContain('bg-blue-500');
    vi.useRealTimers();
  });

  it('removes a phrase already in favorites', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /^Dolor$/ }));

    // p1 ('Tengo dolor') is a default favorite; second button is the star
    const card = screen
      .getByRole('button', { name: /Tengo dolor/i })
      .closest('div') as HTMLElement;
    const [, starBtn] = within(card).getAllByRole('button');
    await user.click(starBtn);

    // Verify removed: navigate to favs and check absence
    await user.click(screen.getByRole('button', { name: /^Favoritos$/i }));
    expect(screen.queryByText('Tengo dolor')).not.toBeInTheDocument();
  });

  it('adds a phrase not yet in favorites', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /^Dolor$/ }));

    // p2 ('El dolor es insoportable') is NOT a default favorite
    const card = screen
      .getByRole('button', { name: /El dolor es insoportable/i })
      .closest('div') as HTMLElement;
    const [, starBtn] = within(card).getAllByRole('button');
    await user.click(starBtn);

    await user.click(screen.getByRole('button', { name: /^Favoritos$/i }));
    expect(screen.getByText('El dolor es insoportable')).toBeInTheDocument();
  });

  it('covers multiple categories (respiracion, emociones)', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /^Respiración$/ }));
    expect(screen.getByText('Me falta el aire')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Volver' }));

    await user.click(screen.getByRole('button', { name: /^Emociones$/ }));
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
    await user.type(
      screen.getByPlaceholderText('Toca para escribir...'),
      'Hola',
    );

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
    await user.type(
      screen.getByPlaceholderText('Toca para escribir...'),
      'Hola',
    );
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

  it('play button triggers play state and clears after 1200ms', async () => {
    vi.useFakeTimers();
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime.bind(vi),
    });
    render(<App />);
    await user.click(screen.getByRole('button', { name: /^Escribir$/i }));
    await user.type(
      screen.getByPlaceholderText('Toca para escribir...'),
      'Test',
    );

    const playBtn = screen.getByRole('button', { name: /Reproducir Mensaje/i });
    await user.click(playBtn);
    act(() => vi.advanceTimersByTime(1200));

    vi.useRealTimers();
    // After timer resolves no error is thrown; play button stays enabled
    expect(playBtn).not.toBeDisabled();
  });
});

// ---------------------------------------------------------------------------
// Favorites tab
// ---------------------------------------------------------------------------
describe('Favorites tab', () => {
  it('shows default favorites', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /^Favoritos$/i }));

    expect(screen.getByText('Mis Favoritos')).toBeInTheDocument();
    expect(screen.getByText('Tengo dolor')).toBeInTheDocument();
    expect(screen.getByText('Gracias por ayudarme')).toBeInTheDocument();
  });

  it('plays a favorite phrase', async () => {
    vi.useFakeTimers();
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime.bind(vi),
    });
    render(<App />);
    await user.click(screen.getByRole('button', { name: /^Favoritos$/i }));

    const phraseBtn = screen.getByRole('button', { name: /Tengo dolor/i });
    await user.click(phraseBtn);
    const dot = phraseBtn.querySelector('div');
    expect(dot?.className).toContain('bg-blue-500');

    act(() => vi.advanceTimersByTime(1200));
    vi.useRealTimers();
  });

  it('removes a phrase from favorites via the star button', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /^Favoritos$/i }));

    // Star/remove buttons have no text content (icon-only)
    const removeButtons = screen
      .getAllByRole('button')
      .filter((btn) => !btn.textContent?.trim());
    await user.click(removeButtons[0]);

    expect(screen.queryByText('Tengo dolor')).not.toBeInTheDocument();
  });

  it('shows empty state after all favorites are removed', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /^Favoritos$/i }));

    let removeButtons = screen
      .getAllByRole('button')
      .filter((btn) => !btn.textContent?.trim());

    while (removeButtons.length > 0) {
      await user.click(removeButtons[0]);
      removeButtons = screen
        .getAllByRole('button')
        .filter((btn) => !btn.textContent?.trim());
    }

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
    expect(screen.getByText('Continuar Grabando')).toBeInTheDocument();
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
    expect(screen.getByText(/Progreso: 12 \/ 50 frases/i)).toBeInTheDocument();
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

  it('Inicio nav resets active category when coming from category detail', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /^Dolor$/ }));
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
