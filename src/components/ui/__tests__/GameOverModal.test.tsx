/**
 * GameOverModal component tests.
 * @module components/ui/__tests__/GameOverModal.test
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameOverModal } from '../GameOverModal';

describe('GameOverModal', () => {
  const defaultProps = {
    levelReached: 3,
    totalGold: 150,
    tilesRevealed: 45,
    monstersFlagged: 12,
    damageTaken: 4,
    onRetry: vi.fn(),
  };

  it('renders with correct title', () => {
    render(<GameOverModal {...defaultProps} />);
    expect(screen.getByText('You Died!')).toBeInTheDocument();
  });

  it('displays level reached stat', () => {
    render(<GameOverModal {...defaultProps} levelReached={7} />);
    expect(screen.getByText('Level Reached')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('displays total gold stat', () => {
    render(<GameOverModal {...defaultProps} totalGold={250} />);
    expect(screen.getByText('Total Gold')).toBeInTheDocument();
    expect(screen.getByText('250')).toBeInTheDocument();
  });

  it('displays tiles revealed stat', () => {
    render(<GameOverModal {...defaultProps} tilesRevealed={100} />);
    expect(screen.getByText('Tiles Revealed')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('displays monsters flagged stat', () => {
    render(<GameOverModal {...defaultProps} monstersFlagged={20} />);
    expect(screen.getByText('Monsters Flagged')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  it('displays damage taken stat', () => {
    render(<GameOverModal {...defaultProps} damageTaken={6} />);
    expect(screen.getByText('Damage Taken')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
  });

  it('calls onRetry when Try Again button is clicked', () => {
    const onRetry = vi.fn();
    render(<GameOverModal {...defaultProps} onRetry={onRetry} />);

    fireEvent.click(screen.getByText('Try Again'));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('has correct accessibility attributes', () => {
    render(<GameOverModal {...defaultProps} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'gameover-modal-title');
  });
});
