/**
 * Tests for GameBoard component.
 * @module components/game/__tests__/GameBoard.test
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameBoard } from '../GameBoard';
import { useGameStore } from '@/stores';
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

/**
 * Creates a test grid of specified dimensions.
 */
function createTestGrid(rows: number, cols: number): Cell[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => createTestCell())
  );
}

describe('GameBoard', () => {
  beforeEach(() => {
    // Reset store to default state
    useGameStore.getState().reset();
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render placeholder tiles when grid is null', () => {
      // Store has null grid by default after reset
      useGameStore.setState({
        grid: null,
        gridConfig: { rows: 3, cols: 3, monsterCount: 1 },
      });

      render(<GameBoard />);

      // Should render 3x3 = 9 buttons
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(9);
    });

    it('should render tiles from grid when available', () => {
      const grid = createTestGrid(2, 4);
      useGameStore.setState({
        grid,
        gridConfig: { rows: 2, cols: 4, monsterCount: 1 },
      });

      render(<GameBoard />);

      // Should render 2x4 = 8 buttons
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(8);
    });

    it('should render correct number of columns in grid', () => {
      useGameStore.setState({
        grid: null,
        gridConfig: { rows: 2, cols: 5, monsterCount: 1 },
      });

      const { container } = render(<GameBoard />);

      // Check grid template columns style
      const gridElement = container.firstChild as HTMLElement;
      expect(gridElement.style.gridTemplateColumns).toContain('repeat(5');
    });

    it('should show revealed numbers', () => {
      const grid = createTestGrid(2, 2);
      grid[0][0] = createTestCell({ isRevealed: true, adjacentMonsters: 3 });
      grid[0][1] = createTestCell({ isRevealed: true, adjacentMonsters: 1 });

      useGameStore.setState({
        grid,
        gridConfig: { rows: 2, cols: 2, monsterCount: 1 },
      });

      render(<GameBoard />);

      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('should show flagged tiles', () => {
      const grid = createTestGrid(2, 2);
      grid[0][0] = createTestCell({ isFlagged: true });

      useGameStore.setState({
        grid,
        gridConfig: { rows: 2, cols: 2, monsterCount: 1 },
      });

      render(<GameBoard />);

      expect(screen.getByText('F')).toBeInTheDocument();
    });
  });

  describe('game over state', () => {
    it('should reveal all monsters when gameOver is true', () => {
      const grid = createTestGrid(2, 2);
      grid[0][0] = createTestCell({ isMonster: true, isRevealed: false });
      grid[1][1] = createTestCell({ isMonster: true, isRevealed: false });

      useGameStore.setState({
        grid,
        gridConfig: { rows: 2, cols: 2, monsterCount: 2 },
        gameOver: true,
      });

      render(<GameBoard />);

      // Should show 2 monster icons
      const monsters = screen.getAllByText('M');
      expect(monsters).toHaveLength(2);
    });
  });

  describe('styling', () => {
    it('should have dungeon-shadow background', () => {
      useGameStore.setState({
        grid: null,
        gridConfig: { rows: 2, cols: 2, monsterCount: 1 },
      });

      const { container } = render(<GameBoard />);

      const gridElement = container.firstChild as HTMLElement;
      expect(gridElement).toHaveClass('bg-dungeon-shadow');
    });

    it('should apply custom className', () => {
      useGameStore.setState({
        grid: null,
        gridConfig: { rows: 2, cols: 2, monsterCount: 1 },
      });

      const { container } = render(<GameBoard className="custom-class" />);

      const gridElement = container.firstChild as HTMLElement;
      expect(gridElement).toHaveClass('custom-class');
    });
  });
});
