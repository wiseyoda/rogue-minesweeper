/**
 * Tests for Tile component.
 * @module components/game/__tests__/Tile.test
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tile } from '../Tile';
import type { Cell } from '@/types';

/**
 * Creates a test cell with default values.
 */
function createTestCell(overrides: Partial<Cell> = {}): Cell {
  return {
    isMonster: false,
    isRevealed: false,
    isFlagged: false,
    isQuestion: false,
    isExit: false,
    adjacentMonsters: 0,
    ...overrides,
  };
}

describe('Tile', () => {
  const defaultProps = {
    onClick: vi.fn(),
    onRightClick: vi.fn(),
    onLongPress: vi.fn(),
    disabled: false,
    gameOver: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('visual states', () => {
    it('should display unrevealed state with stone gradient background', () => {
      const cell = createTestCell({ isRevealed: false });
      render(<Tile {...defaultProps} cell={cell} />);

      const button = screen.getByRole('button');
      // Now using inline styles with CSS custom properties for 3D bevel effect
      expect(button).toHaveStyle({ width: 'var(--tile)' });
    });

    it('should display revealed empty state with dark background', () => {
      const cell = createTestCell({ isRevealed: true, adjacentMonsters: 0 });
      render(<Tile {...defaultProps} cell={cell} />);

      const button = screen.getByRole('button');
      // Now using var(--stone-900) for revealed tiles
      expect(button).toHaveStyle({ background: 'var(--stone-900)' });
    });

    it('should display revealed number state', () => {
      const cell = createTestCell({ isRevealed: true, adjacentMonsters: 3 });
      render(<Tile {...defaultProps} cell={cell} />);

      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should display revealed monster state with blood gradient', () => {
      const cell = createTestCell({ isRevealed: true, isMonster: true });
      render(<Tile {...defaultProps} cell={cell} />);

      const button = screen.getByRole('button');
      // Now uses SVG skull icon instead of M text
      expect(button.querySelector('svg')).toBeInTheDocument();
    });

    it('should display flagged state with SVG flag icon', () => {
      const cell = createTestCell({ isFlagged: true });
      render(<Tile {...defaultProps} cell={cell} />);

      // Now uses SVG flag icon instead of F text
      expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument();
    });

    it('should display question state with question mark', () => {
      const cell = createTestCell({ isQuestion: true });
      render(<Tile {...defaultProps} cell={cell} />);

      expect(screen.getByText('?')).toBeInTheDocument();
    });

    it('should show hidden monsters when game is over', () => {
      const cell = createTestCell({ isMonster: true, isRevealed: false });
      render(<Tile {...defaultProps} cell={cell} gameOver={true} />);

      // Now uses SVG skull icon
      expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('click handlers', () => {
    it('should call onClick when clicked', () => {
      const onClick = vi.fn();
      const cell = createTestCell();
      render(<Tile {...defaultProps} cell={cell} onClick={onClick} />);

      fireEvent.click(screen.getByRole('button'));

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should call onRightClick on context menu', () => {
      const onRightClick = vi.fn();
      const cell = createTestCell();
      render(
        <Tile {...defaultProps} cell={cell} onRightClick={onRightClick} />
      );

      fireEvent.contextMenu(screen.getByRole('button'));

      expect(onRightClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', () => {
      const onClick = vi.fn();
      const cell = createTestCell();
      render(
        <Tile {...defaultProps} cell={cell} onClick={onClick} disabled={true} />
      );

      fireEvent.click(screen.getByRole('button'));

      expect(onClick).not.toHaveBeenCalled();
    });

    it('should not call onRightClick when disabled', () => {
      const onRightClick = vi.fn();
      const cell = createTestCell();
      render(
        <Tile
          {...defaultProps}
          cell={cell}
          onRightClick={onRightClick}
          disabled={true}
        />
      );

      fireEvent.contextMenu(screen.getByRole('button'));

      expect(onRightClick).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should have aria-label for hidden tile', () => {
      const cell = createTestCell();
      render(<Tile {...defaultProps} cell={cell} />);

      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Hidden tile'
      );
    });

    it('should have aria-label for flagged tile', () => {
      const cell = createTestCell({ isFlagged: true });
      render(<Tile {...defaultProps} cell={cell} />);

      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Flagged tile'
      );
    });

    it('should have aria-label with adjacent monster count', () => {
      const cell = createTestCell({ isRevealed: true, adjacentMonsters: 5 });
      render(<Tile {...defaultProps} cell={cell} />);

      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        '5 adjacent monsters'
      );
    });

    it('should have aria-label for monster', () => {
      const cell = createTestCell({ isRevealed: true, isMonster: true });
      render(<Tile {...defaultProps} cell={cell} />);

      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Monster'
      );
    });
  });
});
