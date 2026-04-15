import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PhraseCard from './PhraseCard';

const defaultProps = {
  text: 'Tengo dolor',
  isPlaying: false,
  isFavorite: false,
  onPlay: vi.fn(),
  onToggleFav: vi.fn(),
};

describe('PhraseCard', () => {
  it('renders phrase text', () => {
    render(<PhraseCard {...defaultProps} />);
    expect(screen.getByText('Tengo dolor')).toBeInTheDocument();
  });

  it('calls onPlay when play area clicked', async () => {
    const onPlay = vi.fn();
    const user = userEvent.setup();
    render(<PhraseCard {...defaultProps} onPlay={onPlay} />);

    await user.click(screen.getByRole('button', { name: 'Reproducir frase' }));
    expect(onPlay).toHaveBeenCalledOnce();
  });

  it('calls onToggleFav when star clicked', async () => {
    const onToggleFav = vi.fn();
    const user = userEvent.setup();
    render(<PhraseCard {...defaultProps} onToggleFav={onToggleFav} />);

    await user.click(
      screen.getByRole('button', { name: 'Agregar a favoritos' }),
    );
    expect(onToggleFav).toHaveBeenCalledOnce();
  });

  it('shows playing state (bg-primary-action scale-125 on inner dot)', () => {
    render(<PhraseCard {...defaultProps} isPlaying={true} />);

    const playBtn = screen.getByRole('button', { name: 'Reproducir frase' });
    const dot = playBtn.querySelector('div > div') as HTMLElement;
    expect(dot.className).toContain('bg-primary-action');
    expect(dot.className).toContain('scale-125');
  });

  it('shows idle state (bg-[var(--color-border)] on inner dot)', () => {
    render(<PhraseCard {...defaultProps} isPlaying={false} />);

    const playBtn = screen.getByRole('button', { name: 'Reproducir frase' });
    const dot = playBtn.querySelector('div > div') as HTMLElement;
    expect(dot.className).toContain('bg-[var(--color-border)]');
  });

  it('shows filled star when isFavorite=true', () => {
    render(<PhraseCard {...defaultProps} isFavorite={true} />);

    const starBtn = screen.getByRole('button', { name: 'Quitar de favoritos' });
    const svg = starBtn.querySelector('svg') as SVGSVGElement;
    const classList = svg.getAttribute('class') ?? '';
    expect(classList).toContain('fill-yellow-400');
    expect(classList).toContain('text-yellow-400');
  });

  it('shows outline star when isFavorite=false', () => {
    render(<PhraseCard {...defaultProps} isFavorite={false} />);

    const starBtn = screen.getByRole('button', { name: 'Agregar a favoritos' });
    const svg = starBtn.querySelector('svg') as SVGSVGElement;
    const classList = svg.getAttribute('class') ?? '';
    expect(classList).toContain('text-muted');
    expect(classList).not.toContain('fill-yellow-400');
  });

  it('has correct dynamic aria-labels', () => {
    const { rerender } = render(
      <PhraseCard {...defaultProps} isFavorite={true} />,
    );
    expect(
      screen.getByRole('button', { name: 'Quitar de favoritos' }),
    ).toBeInTheDocument();

    rerender(<PhraseCard {...defaultProps} isFavorite={false} />);
    expect(
      screen.getByRole('button', { name: 'Agregar a favoritos' }),
    ).toBeInTheDocument();
  });
});
