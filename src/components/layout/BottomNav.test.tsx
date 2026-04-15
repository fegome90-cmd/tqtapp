import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import BottomNav from './BottomNav';
import type { TabId } from './BottomNav';

const tabLabels: Record<TabId, string> = {
  home: 'Inicio',
  talk: 'Escribir',
  history: 'Favoritos',
  profile: 'Perfil',
};

function getButton(label: string): HTMLButtonElement {
  const btn = screen.getByText(label).closest('button');
  expect(btn).toBeTruthy();
  return btn as HTMLButtonElement;
}

function setup(currentTab: TabId = 'home') {
  const onTabChange = vi.fn();
  return {
    onTabChange,
    user: userEvent.setup(),
    ...render(<BottomNav currentTab={currentTab} onTabChange={onTabChange} />),
  };
}

describe('BottomNav', () => {
  it('renders 4 tabs with Spanish labels', () => {
    setup('home');

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);

    for (const label of Object.values(tabLabels)) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it('highlights active tab with aria-current="page"', () => {
    setup('home');

    const activeTab = getButton(tabLabels.home);
    expect(activeTab).toHaveAttribute('aria-current', 'page');
  });

  it('calls onTabChange with correct tab when clicked', async () => {
    const { onTabChange, user } = setup('home');

    await user.click(screen.getByText(tabLabels.talk));
    expect(onTabChange).toHaveBeenCalledWith('talk');

    await user.click(screen.getByText(tabLabels.profile));
    expect(onTabChange).toHaveBeenCalledWith('profile');
  });

  it('does not have aria-current on inactive tabs', () => {
    setup('home');

    const inactiveIds: TabId[] = ['talk', 'history', 'profile'];
    for (const id of inactiveIds) {
      const button = getButton(tabLabels[id]);
      expect(button).not.toHaveAttribute('aria-current');
    }
  });

  it('renders nav element with aria-label="Navegación principal"', () => {
    setup('home');

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Navegación principal');
  });

  it('each tab is a button element', () => {
    setup('home');

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);
    buttons.forEach((btn) => {
      expect(btn.tagName).toBe('BUTTON');
    });
  });

  it('active tab has distinct styling vs inactive', () => {
    setup('home');

    const activeButton = getButton(tabLabels.home);
    const inactiveButton = getButton(tabLabels.talk);

    expect(activeButton.className).toContain('bg-primary-container');
    expect(inactiveButton.className).toContain('text-outline-variant');
    expect(activeButton.className).not.toBe(inactiveButton.className);
  });

  it('switches active tab correctly (rerender with different currentTab)', () => {
    const onTabChange = vi.fn();
    const { rerender } = render(
      <BottomNav currentTab="home" onTabChange={onTabChange} />,
    );

    const homeButtonBefore = getButton(tabLabels.home);
    const talkButtonBefore = getButton(tabLabels.talk);
    expect(homeButtonBefore).toHaveAttribute('aria-current', 'page');
    expect(talkButtonBefore).not.toHaveAttribute('aria-current');

    rerender(<BottomNav currentTab="talk" onTabChange={onTabChange} />);

    const talkButtonAfter = getButton(tabLabels.talk);
    const homeButtonAfter = getButton(tabLabels.home);
    expect(talkButtonAfter).toHaveAttribute('aria-current', 'page');
    expect(homeButtonAfter).not.toHaveAttribute('aria-current');
  });
});
