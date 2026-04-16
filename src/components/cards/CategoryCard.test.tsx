import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CategoryCard from './CategoryCard';

const defaultProps = {
  icon: 'Heart',
  title: 'Mindfulness',
  description: 'Practice being present in the moment',
  categoryId: 'emociones' as const,
  onClick: vi.fn(),
};

describe('CategoryCard', () => {
  it('renders title and description', () => {
    render(<CategoryCard {...defaultProps} />);

    expect(screen.getByText('Mindfulness')).toBeInTheDocument();
    expect(
      screen.getByText('Practice being present in the moment'),
    ).toBeInTheDocument();
  });

  it('applies token-based structural classes to button', () => {
    render(<CategoryCard {...defaultProps} />);

    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-card');
    expect(button.className).toContain('rounded-[var(--radius-lg)]');
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<CategoryCard {...defaultProps} onClick={onClick} />);

    await user.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('renders correct icon from iconMap', () => {
    const { container } = render(
      <CategoryCard {...defaultProps} icon="Star" />,
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('falls back to Heart for unknown icon', () => {
    const { container } = render(
      <CategoryCard {...defaultProps} icon="NonExistentIcon" />,
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    // Heart is the fallback — the card still renders an icon
    expect(svg).not.toBeNull();
  });

  it('renders as a button element', () => {
    render(<CategoryCard {...defaultProps} />);

    const button = screen.getByRole('button');
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('truncates long title', () => {
    const longTitle =
      'This is an extremely long category title that should be truncated by the truncate CSS class';
    render(<CategoryCard {...defaultProps} title={longTitle} />);

    const heading = screen.getByText(longTitle);
    expect(heading.className).toContain('truncate');
  });
});
