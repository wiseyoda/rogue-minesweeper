/**
 * Tests for flag toggling.
 * @module engine/flag.test
 */

import { describe, it, expect } from 'vitest';
import { toggleFlag } from './flag';
import { createGrid } from './grid';

describe('toggleFlag', () => {
  describe('flag toggle cycle', () => {
    it('toggles unrevealed cell to flagged', () => {
      const grid = createGrid({ rows: 3, cols: 3, monsterCount: 0 });
      const result = toggleFlag(grid, { row: 1, col: 1 });

      expect(result.newState).toBe('flagged');
      expect(result.grid[1]?.[1]?.isFlagged).toBe(true);
      expect(result.grid[1]?.[1]?.isQuestion).toBe(false);
    });

    it('toggles flagged cell to question', () => {
      const grid = createGrid({ rows: 3, cols: 3, monsterCount: 0 });
      const first = toggleFlag(grid, { row: 1, col: 1 });
      const second = toggleFlag(first.grid, { row: 1, col: 1 });

      expect(second.newState).toBe('question');
      expect(second.grid[1]?.[1]?.isFlagged).toBe(false);
      expect(second.grid[1]?.[1]?.isQuestion).toBe(true);
    });

    it('toggles question cell to none', () => {
      const grid = createGrid({ rows: 3, cols: 3, monsterCount: 0 });
      const first = toggleFlag(grid, { row: 1, col: 1 });
      const second = toggleFlag(first.grid, { row: 1, col: 1 });
      const third = toggleFlag(second.grid, { row: 1, col: 1 });

      expect(third.newState).toBe('none');
      expect(third.grid[1]?.[1]?.isFlagged).toBe(false);
      expect(third.grid[1]?.[1]?.isQuestion).toBe(false);
    });

    it('completes full cycle: none → flagged → question → none', () => {
      const grid = createGrid({ rows: 3, cols: 3, monsterCount: 0 });

      const first = toggleFlag(grid, { row: 1, col: 1 });
      expect(first.newState).toBe('flagged');

      const second = toggleFlag(first.grid, { row: 1, col: 1 });
      expect(second.newState).toBe('question');

      const third = toggleFlag(second.grid, { row: 1, col: 1 });
      expect(third.newState).toBe('none');

      const fourth = toggleFlag(third.grid, { row: 1, col: 1 });
      expect(fourth.newState).toBe('flagged');
    });
  });

  describe('revealed cell rejection', () => {
    it('does not flag revealed cell', () => {
      const grid = createGrid({ rows: 3, cols: 3, monsterCount: 0 });
      grid[1][1] = { ...grid[1][1]!, isRevealed: true };

      const result = toggleFlag(grid, { row: 1, col: 1 });

      expect(result.newState).toBe('none');
      expect(result.grid[1]?.[1]?.isFlagged).toBe(false);
      expect(result.grid[1]?.[1]?.isQuestion).toBe(false);
    });

    it('returns unchanged grid for revealed cell', () => {
      const grid = createGrid({ rows: 3, cols: 3, monsterCount: 0 });
      grid[1][1] = { ...grid[1][1]!, isRevealed: true };

      const result = toggleFlag(grid, { row: 1, col: 1 });

      // Should return same grid reference (no changes)
      expect(result.grid).toBe(grid);
    });
  });

  describe('question mark toggle', () => {
    it('creates question mark from flagged state', () => {
      const grid = createGrid({ rows: 3, cols: 3, monsterCount: 0 });
      grid[1][1] = { ...grid[1][1]!, isFlagged: true };

      const result = toggleFlag(grid, { row: 1, col: 1 });

      expect(result.newState).toBe('question');
      expect(result.grid[1]?.[1]?.isQuestion).toBe(true);
    });

    it('clears question mark to none state', () => {
      const grid = createGrid({ rows: 3, cols: 3, monsterCount: 0 });
      grid[1][1] = { ...grid[1][1]!, isQuestion: true };

      const result = toggleFlag(grid, { row: 1, col: 1 });

      expect(result.newState).toBe('none');
      expect(result.grid[1]?.[1]?.isQuestion).toBe(false);
      expect(result.grid[1]?.[1]?.isFlagged).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('handles invalid position', () => {
      const grid = createGrid({ rows: 3, cols: 3, monsterCount: 0 });
      const result = toggleFlag(grid, { row: 10, col: 10 });

      expect(result.newState).toBe('none');
      expect(result.grid).toBe(grid);
    });

    it('does not modify original grid', () => {
      const grid = createGrid({ rows: 3, cols: 3, monsterCount: 0 });
      const original = grid[1]?.[1]?.isFlagged;

      toggleFlag(grid, { row: 1, col: 1 });

      expect(grid[1]?.[1]?.isFlagged).toBe(original);
    });

    it('handles corner cell', () => {
      const grid = createGrid({ rows: 3, cols: 3, monsterCount: 0 });
      const result = toggleFlag(grid, { row: 0, col: 0 });

      expect(result.newState).toBe('flagged');
      expect(result.grid[0]?.[0]?.isFlagged).toBe(true);
    });
  });
});
