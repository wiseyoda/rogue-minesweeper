/**
 * Tests for grid creation and setup.
 * @module engine/grid.test
 */

import { describe, it, expect } from 'vitest';
import {
  createGrid,
  placeMonsters,
  getAdjacentPositions,
  calculateAdjacentCounts,
  initializeGrid,
} from './grid';
import type { CellPosition } from '@/types';

describe('createGrid', () => {
  it('creates a grid with correct dimensions', () => {
    const grid = createGrid({ rows: 5, cols: 7, monsterCount: 0 });

    expect(grid.length).toBe(5);
    expect(grid[0]?.length).toBe(7);
  });

  it('creates all cells as unrevealed', () => {
    const grid = createGrid({ rows: 3, cols: 3, monsterCount: 0 });

    for (const row of grid) {
      for (const cell of row) {
        expect(cell.isRevealed).toBe(false);
      }
    }
  });

  it('creates all cells with no monsters', () => {
    const grid = createGrid({ rows: 3, cols: 3, monsterCount: 0 });

    for (const row of grid) {
      for (const cell of row) {
        expect(cell.isMonster).toBe(false);
      }
    }
  });

  it('creates all cells with zero adjacent monster count', () => {
    const grid = createGrid({ rows: 3, cols: 3, monsterCount: 0 });

    for (const row of grid) {
      for (const cell of row) {
        expect(cell.adjacentMonsters).toBe(0);
      }
    }
  });

  it('creates all cells as unflagged', () => {
    const grid = createGrid({ rows: 3, cols: 3, monsterCount: 0 });

    for (const row of grid) {
      for (const cell of row) {
        expect(cell.isFlagged).toBe(false);
        expect(cell.isQuestion).toBe(false);
      }
    }
  });

  it('handles 1x1 grid', () => {
    const grid = createGrid({ rows: 1, cols: 1, monsterCount: 0 });

    expect(grid.length).toBe(1);
    expect(grid[0]?.length).toBe(1);
  });
});

describe('placeMonsters', () => {
  it('places exactly the specified number of monsters', () => {
    const grid = createGrid({ rows: 5, cols: 5, monsterCount: 0 });
    const withMonsters = placeMonsters(grid, 5);

    let monsterCount = 0;
    for (const row of withMonsters) {
      for (const cell of row) {
        if (cell.isMonster) monsterCount++;
      }
    }

    expect(monsterCount).toBe(5);
  });

  it('excludes the specified position from monster placement', () => {
    const grid = createGrid({ rows: 5, cols: 5, monsterCount: 0 });
    const exclude: CellPosition = { row: 2, col: 2 };

    // Place many monsters to ensure excluded position is respected
    for (let i = 0; i < 100; i++) {
      const withMonsters = placeMonsters(grid, 24, exclude);
      expect(withMonsters[2]?.[2]?.isMonster).toBe(false);
    }
  });

  it('handles monster count larger than available positions', () => {
    const grid = createGrid({ rows: 2, cols: 2, monsterCount: 0 });
    const withMonsters = placeMonsters(grid, 10);

    let monsterCount = 0;
    for (const row of withMonsters) {
      for (const cell of row) {
        if (cell.isMonster) monsterCount++;
      }
    }

    expect(monsterCount).toBe(4); // Max possible
  });

  it('handles zero monster count', () => {
    const grid = createGrid({ rows: 3, cols: 3, monsterCount: 0 });
    const withMonsters = placeMonsters(grid, 0);

    for (const row of withMonsters) {
      for (const cell of row) {
        expect(cell.isMonster).toBe(false);
      }
    }
  });

  it('returns immutable grid (does not modify original)', () => {
    const grid = createGrid({ rows: 3, cols: 3, monsterCount: 0 });
    const original = grid[1]?.[1];
    placeMonsters(grid, 9);

    expect(grid[1]?.[1]).toBe(original);
    expect(grid[1]?.[1]?.isMonster).toBe(false);
  });
});

describe('getAdjacentPositions', () => {
  const grid = createGrid({ rows: 5, cols: 5, monsterCount: 0 });

  it('returns 8 adjacent positions for center cell', () => {
    const adjacent = getAdjacentPositions(grid, { row: 2, col: 2 });
    expect(adjacent.length).toBe(8);
  });

  it('returns 3 adjacent positions for corner cell', () => {
    const topLeft = getAdjacentPositions(grid, { row: 0, col: 0 });
    expect(topLeft.length).toBe(3);

    const bottomRight = getAdjacentPositions(grid, { row: 4, col: 4 });
    expect(bottomRight.length).toBe(3);
  });

  it('returns 5 adjacent positions for edge cell', () => {
    const topEdge = getAdjacentPositions(grid, { row: 0, col: 2 });
    expect(topEdge.length).toBe(5);

    const leftEdge = getAdjacentPositions(grid, { row: 2, col: 0 });
    expect(leftEdge.length).toBe(5);
  });

  it('returns correct positions for center cell', () => {
    const adjacent = getAdjacentPositions(grid, { row: 2, col: 2 });
    const positions = adjacent.map((p) => `${p.row},${p.col}`).sort();

    expect(positions).toEqual(['1,1', '1,2', '1,3', '2,1', '2,3', '3,1', '3,2', '3,3']);
  });
});

describe('calculateAdjacentCounts', () => {
  it('calculates zero counts when no monsters', () => {
    const grid = createGrid({ rows: 3, cols: 3, monsterCount: 0 });
    const withCounts = calculateAdjacentCounts(grid);

    for (const row of withCounts) {
      for (const cell of row) {
        expect(cell.adjacentMonsters).toBe(0);
      }
    }
  });

  it('calculates correct count for single monster', () => {
    // Create grid with monster in center
    const grid = createGrid({ rows: 3, cols: 3, monsterCount: 0 });
    grid[1][1] = { ...grid[1][1]!, isMonster: true };

    const withCounts = calculateAdjacentCounts(grid);

    // All 8 surrounding cells should have count 1
    expect(withCounts[0]?.[0]?.adjacentMonsters).toBe(1);
    expect(withCounts[0]?.[1]?.adjacentMonsters).toBe(1);
    expect(withCounts[0]?.[2]?.adjacentMonsters).toBe(1);
    expect(withCounts[1]?.[0]?.adjacentMonsters).toBe(1);
    expect(withCounts[1]?.[2]?.adjacentMonsters).toBe(1);
    expect(withCounts[2]?.[0]?.adjacentMonsters).toBe(1);
    expect(withCounts[2]?.[1]?.adjacentMonsters).toBe(1);
    expect(withCounts[2]?.[2]?.adjacentMonsters).toBe(1);

    // Center (monster) should have count 0
    expect(withCounts[1]?.[1]?.adjacentMonsters).toBe(0);
  });

  it('calculates correct count for corner monster', () => {
    const grid = createGrid({ rows: 3, cols: 3, monsterCount: 0 });
    grid[0][0] = { ...grid[0][0]!, isMonster: true };

    const withCounts = calculateAdjacentCounts(grid);

    // Adjacent to corner
    expect(withCounts[0]?.[1]?.adjacentMonsters).toBe(1);
    expect(withCounts[1]?.[0]?.adjacentMonsters).toBe(1);
    expect(withCounts[1]?.[1]?.adjacentMonsters).toBe(1);

    // Not adjacent
    expect(withCounts[0]?.[2]?.adjacentMonsters).toBe(0);
    expect(withCounts[2]?.[0]?.adjacentMonsters).toBe(0);
    expect(withCounts[2]?.[2]?.adjacentMonsters).toBe(0);
  });

  it('calculates count of 8 when surrounded by monsters', () => {
    // Create 3x3 grid with all borders as monsters
    const grid = createGrid({ rows: 3, cols: 3, monsterCount: 0 });
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (row !== 1 || col !== 1) {
          grid[row][col] = { ...grid[row][col]!, isMonster: true };
        }
      }
    }

    const withCounts = calculateAdjacentCounts(grid);
    expect(withCounts[1]?.[1]?.adjacentMonsters).toBe(8);
  });
});

describe('initializeGrid', () => {
  it('creates a fully initialized grid with monsters and counts', () => {
    const grid = initializeGrid({ rows: 5, cols: 5, monsterCount: 5 });

    // Check monster count
    let monsterCount = 0;
    for (const row of grid) {
      for (const cell of row) {
        if (cell.isMonster) monsterCount++;
      }
    }
    expect(monsterCount).toBe(5);
  });

  it('excludes first click position from monsters', () => {
    const firstClick: CellPosition = { row: 2, col: 2 };

    // Run multiple times to verify randomness respects exclusion
    for (let i = 0; i < 50; i++) {
      const grid = initializeGrid({ rows: 5, cols: 5, monsterCount: 24 }, firstClick);
      expect(grid[2]?.[2]?.isMonster).toBe(false);
    }
  });

  it('calculates adjacent counts correctly', () => {
    // Use a grid where we can predict counts
    const grid = initializeGrid({ rows: 3, cols: 3, monsterCount: 0 });

    // With no monsters, all counts should be 0
    for (const row of grid) {
      for (const cell of row) {
        expect(cell.adjacentMonsters).toBe(0);
      }
    }
  });
});
