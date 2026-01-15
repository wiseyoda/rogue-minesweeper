/**
 * Tests for win condition checking.
 * @module engine/win-condition.test
 */

import { describe, it, expect } from 'vitest';
import {
  checkWinCondition,
  getSafeCellCount,
  getRevealedCount,
  getRevealedSafeCellCount,
} from './win-condition';
import { createGrid, calculateAdjacentCounts } from './grid';
import type { Grid } from '@/types';

/**
 * Helper to create a grid with a specific pattern.
 * M = monster, . = empty, R = revealed empty, r = revealed numbered
 */
function createTestGrid(pattern: string[]): Grid {
  const grid: Grid = pattern.map((row) =>
    row.split('').map((char) => ({
      isMonster: char === 'M',
      isRevealed: char === 'R' || char === 'r',
      isFlagged: false,
      isQuestion: false,
      isExit: false,
      adjacentMonsters: 0,
    })),
  );

  return calculateAdjacentCounts(grid);
}

describe('getSafeCellCount', () => {
  it('counts all cells when no monsters', () => {
    const grid = createGrid({ rows: 3, cols: 3, monsterCount: 0 });
    expect(getSafeCellCount(grid)).toBe(9);
  });

  it('excludes monster cells from count', () => {
    const grid = createTestGrid(['M..', '...', '...']);
    expect(getSafeCellCount(grid)).toBe(8);
  });

  it('handles grid with all monsters', () => {
    const grid = createTestGrid(['M']);
    expect(getSafeCellCount(grid)).toBe(0);
  });

  it('handles multiple monsters', () => {
    const grid = createTestGrid(['MMM', '...', 'MMM']);
    expect(getSafeCellCount(grid)).toBe(3);
  });
});

describe('getRevealedCount', () => {
  it('returns zero for unrevealed grid', () => {
    const grid = createGrid({ rows: 3, cols: 3, monsterCount: 0 });
    expect(getRevealedCount(grid)).toBe(0);
  });

  it('counts revealed cells', () => {
    const grid = createTestGrid(['R..', '...', '...']);
    expect(getRevealedCount(grid)).toBe(1);
  });

  it('counts multiple revealed cells', () => {
    const grid = createTestGrid(['RRR', 'RRR', '...']);
    expect(getRevealedCount(grid)).toBe(6);
  });

  it('counts revealed monsters', () => {
    const grid = createTestGrid(['M..', '...', '...']);
    grid[0][0] = { ...grid[0][0]!, isRevealed: true }; // Reveal the monster

    expect(getRevealedCount(grid)).toBe(1);
  });
});

describe('getRevealedSafeCellCount', () => {
  it('returns zero for unrevealed grid', () => {
    const grid = createGrid({ rows: 3, cols: 3, monsterCount: 0 });
    expect(getRevealedSafeCellCount(grid)).toBe(0);
  });

  it('counts only revealed non-monster cells', () => {
    const grid = createTestGrid(['R..', 'M..', '...']);
    expect(getRevealedSafeCellCount(grid)).toBe(1);
  });

  it('does not count revealed monsters', () => {
    const grid = createTestGrid(['M..', '...', '...']);
    grid[0][0] = { ...grid[0][0]!, isRevealed: true }; // Reveal the monster

    expect(getRevealedSafeCellCount(grid)).toBe(0);
  });
});

describe('checkWinCondition', () => {
  describe('win detection', () => {
    it('returns true when all safe cells are revealed', () => {
      const grid = createTestGrid(['MR', 'RR']);
      expect(checkWinCondition(grid)).toBe(true);
    });

    it('returns true for single safe cell grid', () => {
      const grid = createTestGrid(['R']);
      expect(checkWinCondition(grid)).toBe(true);
    });

    it('returns true when safe cells revealed alongside monsters', () => {
      const grid = createTestGrid(['MRR', 'RRR', 'MMR']);
      expect(checkWinCondition(grid)).toBe(true);
    });
  });

  describe('non-win states', () => {
    it('returns false when safe cells remain unrevealed', () => {
      const grid = createTestGrid(['M.', 'R.']);
      expect(checkWinCondition(grid)).toBe(false);
    });

    it('returns false for completely unrevealed grid', () => {
      const grid = createGrid({ rows: 3, cols: 3, monsterCount: 1 });
      expect(checkWinCondition(grid)).toBe(false);
    });

    it('returns false when any safe cell unrevealed', () => {
      const grid = createTestGrid(['MRRR', 'RRRR', 'RRRR', 'RRR.']);
      expect(checkWinCondition(grid)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('returns false for grid with only monsters', () => {
      const grid = createTestGrid(['M']);
      expect(checkWinCondition(grid)).toBe(false);
    });

    it('does not require monsters to be flagged', () => {
      // All safe cells revealed, monster unflagged
      const grid = createTestGrid(['M', 'R']);
      expect(checkWinCondition(grid)).toBe(true);
    });

    it('does not require monsters to be revealed', () => {
      // All safe cells revealed, monster unrevealed
      const grid = createTestGrid(['M', 'R']);
      expect(checkWinCondition(grid)).toBe(true);
    });

    it('handles revealed monster correctly', () => {
      // All safe cells revealed, monster also revealed (game over scenario)
      const grid = createTestGrid(['R', 'R']);
      grid[0][0] = { ...grid[0][0]!, isMonster: true }; // Make first cell a revealed monster

      // Should still count as win if all safe cells revealed
      expect(checkWinCondition(grid)).toBe(true);
    });
  });
});

describe('progress counting', () => {
  it('calculates progress correctly', () => {
    const grid = createTestGrid(['M...', '....', '....', '....']);

    // 15 safe cells total
    expect(getSafeCellCount(grid)).toBe(15);

    // Reveal some cells
    const partialGrid = createTestGrid(['MRRR', 'RRRR', '....', '....']);

    expect(getRevealedSafeCellCount(partialGrid)).toBe(7);
    expect(checkWinCondition(partialGrid)).toBe(false);
  });

  it('tracks progress to completion', () => {
    const grid = createTestGrid(['M..', 'RRR', 'RRR']);

    expect(getSafeCellCount(grid)).toBe(8);
    expect(getRevealedSafeCellCount(grid)).toBe(6);
    expect(checkWinCondition(grid)).toBe(false);

    // Reveal remaining safe cells
    const winGrid = createTestGrid(['MRR', 'RRR', 'RRR']);

    expect(getRevealedSafeCellCount(winGrid)).toBe(8);
    expect(checkWinCondition(winGrid)).toBe(true);
  });
});
