/**
 * Tests for cell revealing and flood fill.
 * @module engine/reveal.test
 */

import { describe, it, expect } from 'vitest';
import { revealCell, floodFill, isValidPosition } from './reveal';
import { createGrid, calculateAdjacentCounts } from './grid';
import type { Grid } from '@/types';

/**
 * Helper to create a grid with a specific pattern.
 * M = monster, . = empty
 */
function createTestGrid(pattern: string[]): Grid {
  const grid: Grid = pattern.map((row) =>
    row.split('').map((char) => ({
      isMonster: char === 'M',
      isRevealed: false,
      isFlagged: false,
      isQuestion: false,
      isExit: false,
      adjacentMonsters: 0,
    })),
  );

  return calculateAdjacentCounts(grid);
}

describe('isValidPosition', () => {
  const grid = createGrid({ rows: 5, cols: 5, monsterCount: 0 });

  it('returns true for valid center position', () => {
    expect(isValidPosition(grid, { row: 2, col: 2 })).toBe(true);
  });

  it('returns true for valid corner positions', () => {
    expect(isValidPosition(grid, { row: 0, col: 0 })).toBe(true);
    expect(isValidPosition(grid, { row: 4, col: 4 })).toBe(true);
  });

  it('returns false for negative row', () => {
    expect(isValidPosition(grid, { row: -1, col: 2 })).toBe(false);
  });

  it('returns false for negative col', () => {
    expect(isValidPosition(grid, { row: 2, col: -1 })).toBe(false);
  });

  it('returns false for row out of bounds', () => {
    expect(isValidPosition(grid, { row: 5, col: 2 })).toBe(false);
  });

  it('returns false for col out of bounds', () => {
    expect(isValidPosition(grid, { row: 2, col: 5 })).toBe(false);
  });
});

describe('revealCell', () => {
  describe('single cell reveal', () => {
    it('reveals a numbered cell', () => {
      const grid = createTestGrid(['.M.', '...', '...']);
      const result = revealCell(grid, { row: 1, col: 0 });

      expect(result.hitMonster).toBe(false);
      expect(result.revealedPositions).toHaveLength(1);
      expect(result.revealedPositions[0]).toEqual({ row: 1, col: 0 });
      expect(result.grid[1]?.[0]?.isRevealed).toBe(true);
    });

    it('does not modify original grid', () => {
      const grid = createTestGrid(['...', '...', '...']);
      revealCell(grid, { row: 1, col: 1 });

      expect(grid[1]?.[1]?.isRevealed).toBe(false);
    });

    it('returns unchanged grid for already revealed cell', () => {
      const grid = createTestGrid(['...', '...', '...']);
      const firstReveal = revealCell(grid, { row: 1, col: 1 });
      const secondReveal = revealCell(firstReveal.grid, { row: 1, col: 1 });

      expect(secondReveal.revealedPositions).toHaveLength(0);
    });

    it('returns unchanged grid for invalid position', () => {
      const grid = createTestGrid(['...', '...', '...']);
      const result = revealCell(grid, { row: 10, col: 10 });

      expect(result.revealedPositions).toHaveLength(0);
      expect(result.hitMonster).toBe(false);
    });
  });

  describe('monster hit detection', () => {
    it('detects monster hit', () => {
      const grid = createTestGrid(['M..', '...', '...']);
      const result = revealCell(grid, { row: 0, col: 0 });

      expect(result.hitMonster).toBe(true);
      expect(result.grid[0]?.[0]?.isRevealed).toBe(true);
    });

    it('does not win when hitting monster', () => {
      const grid = createTestGrid(['M', '.']);
      const result = revealCell(grid, { row: 0, col: 0 });

      expect(result.hitMonster).toBe(true);
      expect(result.isWon).toBe(false);
    });
  });

  describe('flagged cells', () => {
    it('does not reveal flagged cell', () => {
      const grid = createTestGrid(['...', '...', '...']);
      grid[1][1] = { ...grid[1][1]!, isFlagged: true };

      const result = revealCell(grid, { row: 1, col: 1 });

      expect(result.revealedPositions).toHaveLength(0);
      expect(result.grid[1]?.[1]?.isRevealed).toBe(false);
    });

    it('does not reveal question-marked cell', () => {
      const grid = createTestGrid(['...', '...', '...']);
      grid[1][1] = { ...grid[1][1]!, isQuestion: true };

      const result = revealCell(grid, { row: 1, col: 1 });

      expect(result.revealedPositions).toHaveLength(0);
    });
  });
});

describe('floodFill', () => {
  it('reveals all connected empty cells', () => {
    // Pattern: monster in corner, rest empty
    const grid = createTestGrid(['M....', '.....', '.....', '.....', '.....']);
    const result = floodFill(grid, { row: 4, col: 4 });

    // Should reveal most cells except the monster and cells adjacent to it
    expect(result.revealedPositions.length).toBeGreaterThan(15);
  });

  it('stops at numbered cells but reveals them', () => {
    const grid = createTestGrid(['M..', '...', '...']);
    const result = floodFill(grid, { row: 2, col: 2 });

    // Should reveal cells around the empty space
    // Cell at (0,1) is adjacent to monster, so it's numbered
    // Flood fill should reveal it but not continue past it
    const revealedKeys = result.revealedPositions.map((p) => `${p.row},${p.col}`);

    // The cell adjacent to monster should be revealed
    expect(revealedKeys).toContain('0,1');
    expect(revealedKeys).toContain('1,0');
  });

  it('stops at grid edges', () => {
    const grid = createTestGrid(['...', '...', '...']);
    const result = floodFill(grid, { row: 0, col: 0 });

    // Should reveal all cells in empty grid
    expect(result.revealedPositions).toHaveLength(9);
  });

  it('does not reveal monsters', () => {
    const grid = createTestGrid(['M..', '...', '...']);
    const result = floodFill(grid, { row: 2, col: 2 });

    const hasMonsterRevealed = result.revealedPositions.some((p) => p.row === 0 && p.col === 0);
    expect(hasMonsterRevealed).toBe(false);
  });

  it('does not reveal flagged cells', () => {
    const grid = createTestGrid(['...', '...', '...']);
    grid[1][1] = { ...grid[1][1]!, isFlagged: true };

    const result = floodFill(grid, { row: 0, col: 0 });

    const hasFlaggedRevealed = result.revealedPositions.some((p) => p.row === 1 && p.col === 1);
    expect(hasFlaggedRevealed).toBe(false);
  });
});

describe('edge and corner cells', () => {
  it('correctly reveals from top-left corner', () => {
    const grid = createTestGrid(['...', '...', '..M']);
    const result = revealCell(grid, { row: 0, col: 0 });

    expect(result.hitMonster).toBe(false);
    expect(result.revealedPositions.length).toBeGreaterThan(0);
  });

  it('correctly reveals from bottom-right corner', () => {
    const grid = createTestGrid(['M..', '...', '...']);
    const result = revealCell(grid, { row: 2, col: 2 });

    expect(result.hitMonster).toBe(false);
    expect(result.revealedPositions.length).toBeGreaterThan(0);
  });

  it('correctly reveals from edge cell', () => {
    const grid = createTestGrid(['M..', '...', '...']);
    const result = revealCell(grid, { row: 0, col: 2 });

    expect(result.hitMonster).toBe(false);
    expect(result.grid[0]?.[2]?.isRevealed).toBe(true);
  });

  it('handles 1x1 grid with empty cell', () => {
    const grid = createTestGrid(['.']);
    const result = revealCell(grid, { row: 0, col: 0 });

    expect(result.hitMonster).toBe(false);
    expect(result.isWon).toBe(true);
    expect(result.revealedPositions).toHaveLength(1);
  });

  it('handles 1x1 grid with monster', () => {
    const grid = createTestGrid(['M']);
    const result = revealCell(grid, { row: 0, col: 0 });

    expect(result.hitMonster).toBe(true);
    expect(result.isWon).toBe(false);
  });
});

describe('win condition integration', () => {
  it('returns isWon: true when all safe cells revealed', () => {
    const grid = createTestGrid(['M', '.']);
    const result = revealCell(grid, { row: 1, col: 0 });

    expect(result.isWon).toBe(true);
  });

  it('returns isWon: false when safe cells remain', () => {
    const grid = createTestGrid(['M.', '..']);
    const result = revealCell(grid, { row: 1, col: 0 });

    // Only revealed one cell, others remain
    expect(result.isWon).toBe(false);
  });
});
