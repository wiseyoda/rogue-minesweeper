/**
 * Unit tests for HUD component.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { HUD } from '../HUD';
import { useGameStore } from '../../../stores/gameStore';

describe('HUD', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useGameStore.getState().reset();
  });

  it('renders HealthBar with correct values', () => {
    render(<HUD />);

    // Default max lives is 3
    expect(screen.getByText('3/3')).toBeInTheDocument();
  });

  it('renders GoldCounter', () => {
    render(<HUD />);

    // Default gold is 0, and gold icon should be present
    expect(screen.getByText('💰')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders LevelIndicator', () => {
    render(<HUD />);

    // Default level is 1
    expect(screen.getByText('L 1')).toBeInTheDocument();
  });

  it('renders MonsterCounter', () => {
    render(<HUD />);

    // Monster icon should be present
    expect(screen.getByText('👹')).toBeInTheDocument();
  });

  it('does not render ShieldDisplay when shields = 0', () => {
    render(<HUD />);

    // Shield icon should not be present when shields = 0
    expect(screen.queryByText('🛡')).not.toBeInTheDocument();
  });

  it('renders ShieldDisplay when shields > 0', () => {
    // Add shields to player
    useGameStore.getState().addShield(2);

    render(<HUD />);

    expect(screen.getByText('🛡')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders MessageArea with provided message', () => {
    render(<HUD message={{ text: 'Test message', type: 'info' }} />);

    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('renders empty MessageArea when no message', () => {
    render(<HUD />);

    // Should show the placeholder
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('updates when store state changes', () => {
    const { rerender } = render(<HUD />);

    // Add gold to the store - wrap in act since this triggers state updates
    act(() => {
      useGameStore.getState().addGold(100);
    });

    rerender(<HUD />);

    expect(screen.getByText('100')).toBeInTheDocument();
  });
});
