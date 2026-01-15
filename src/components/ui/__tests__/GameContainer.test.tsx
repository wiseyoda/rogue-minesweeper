/**
 * GameContainer component tests.
 * @module components/ui/__tests__/GameContainer.test
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

  it('renders HUD component', () => {
    render(<GameContainer message={null} />);
    // HUD should render health bar with progressbar role
    expect(screen.getByRole('progressbar', { name: 'Health' })).toBeInTheDocument();
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

  it('shows GameOverModal when gameOver is true', () => {
    useGameStore.getState().startLevel(1);
    // Set lives to 1 and take damage to trigger game over
    useGameStore.setState({ player: { ...useGameStore.getState().player, lives: 0 }, gameOver: true });
    render(<GameContainer message={null} />);
    expect(screen.getByText('You Died!')).toBeInTheDocument();
  });

  it('passes message prop to HUD', () => {
    render(<GameContainer message={{ text: 'Test message', type: 'info' }} />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });
});
