/**
 * GameContainer component tests.
 * @module components/ui/__tests__/GameContainer.test
 *
 * Note: GameContainer no longer renders HUD - it now renders Panel + GameBoard.
 * The message prop is kept for compatibility but is not displayed (moved to DM Panel).
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useGameStore } from '@/stores/gameStore';
import { GameContainer } from '@/components/game/GameContainer';

describe('GameContainer', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useGameStore.getState().reset();
  });

  it('renders GameBoard inside Panel', () => {
    render(<GameContainer message={null} />);
    // GameBoard should render with grid (tiles as buttons)
    expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
  });

  it('renders GameBoard component', () => {
    // Start level to initialize grid
    useGameStore.getState().startLevel(1);
    render(<GameContainer message={null} />);
    // GameBoard should render with grid
    expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
  });

  it('does not show WinModal when phase is playing', () => {
    useGameStore.getState().startLevel(1);
    render(<GameContainer message={null} />);
    expect(screen.queryByText('Level Complete!')).not.toBeInTheDocument();
  });

  it('shows WinModal when phase is shopping', () => {
    useGameStore.getState().startLevel(1);
    useGameStore.getState().setPhase('shopping');
    render(<GameContainer message={null} />);
    expect(screen.getByText('Level Complete!')).toBeInTheDocument();
  });

  it('does not show GameOverModal when gameOver is false', () => {
    useGameStore.getState().startLevel(1);
    render(<GameContainer message={null} />);
    expect(screen.queryByText('You Died!')).not.toBeInTheDocument();
  });

  it('shows GameOverModal when gameOver is true and phase is gameOver', () => {
    useGameStore.getState().startLevel(1);
    // Set lives to 0 and trigger game over (phase must be 'gameOver' to show modal)
    useGameStore.setState({
      player: { ...useGameStore.getState().player, lives: 0 },
      gameOver: true,
      run: { ...useGameStore.getState().run, phase: 'gameOver' },
    });
    render(<GameContainer message={null} />);
    expect(screen.getByText('You Died!')).toBeInTheDocument();
  });

  it('accepts message prop for compatibility', () => {
    // Message prop is kept for compatibility but displayed in DM Panel (Sidebar), not here
    render(<GameContainer message={{ text: 'Test message', type: 'info' }} />);
    // GameBoard should still render
    expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
  });
});
