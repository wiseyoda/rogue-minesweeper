/**
 * WinModal component tests.
 * @module components/ui/__tests__/WinModal.test
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WinModal } from '../WinModal';

describe('WinModal', () => {
  const defaultProps = {
    tilesRevealed: 25,
    goldCollected: 25,
    monstersAvoided: 5,
    floorBonus: 10,
    onEnterShop: vi.fn(),
  };

  it('renders with correct title', () => {
    render(<WinModal {...defaultProps} />);
    expect(screen.getByText('Level Complete!')).toBeInTheDocument();
  });

  it('displays tiles revealed stat', () => {
    render(<WinModal {...defaultProps} tilesRevealed={42} goldCollected={100} monstersAvoided={7} />);
    expect(screen.getByText('Tiles Revealed')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('displays gold collected stat', () => {
    render(<WinModal {...defaultProps} tilesRevealed={10} goldCollected={42} />);
    expect(screen.getByText('Gold Collected')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('displays monsters avoided stat', () => {
    render(<WinModal {...defaultProps} monstersAvoided={8} />);
    expect(screen.getByText('Monsters Avoided')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
  });

  it('displays floor bonus stat', () => {
    render(<WinModal {...defaultProps} floorBonus={50} />);
    expect(screen.getByText('Floor Bonus')).toBeInTheDocument();
    expect(screen.getByText('+50')).toBeInTheDocument();
  });

  it('calls onEnterShop when Enter Shop button is clicked', () => {
    const onEnterShop = vi.fn();
    render(<WinModal {...defaultProps} onEnterShop={onEnterShop} />);

    fireEvent.click(screen.getByText('Enter Shop'));

    expect(onEnterShop).toHaveBeenCalledTimes(1);
  });

  it('has correct accessibility attributes', () => {
    render(<WinModal {...defaultProps} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'win-modal-title');
  });
});
