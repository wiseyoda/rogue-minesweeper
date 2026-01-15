/**
 * Win condition checking utilities.
 * @module engine/win-condition
 */

import type { Grid } from '@/types';

/**
 * Counts the number of safe (non-monster) cells in the grid.
 */
export function getSafeCellCount(grid: Grid): number {
  let count = 0;

  for (const row of grid) {
    for (const cell of row) {
      if (!cell.isMonster) {
        count++;
      }
    }
  }

  return count;
}

/**
 * Counts the number of revealed cells in the grid.
 */
export function getRevealedCount(grid: Grid): number {
  let count = 0;

  for (const row of grid) {
    for (const cell of row) {
      if (cell.isRevealed) {
        count++;
      }
    }
  }

  return count;
}

/**
 * Counts the number of revealed non-monster cells in the grid.
 */
export function getRevealedSafeCellCount(grid: Grid): number {
  let count = 0;

  for (const row of grid) {
    for (const cell of row) {
      if (cell.isRevealed && !cell.isMonster) {
        count++;
      }
    }
  }

  return count;
}

/**
 * Checks if the win condition is met.
 * Win when all non-monster cells are revealed.
 * Flagging monsters is NOT required.
 */
export function checkWinCondition(grid: Grid): boolean {
  const safeCells = getSafeCellCount(grid);
  const revealedSafeCells = getRevealedSafeCellCount(grid);

  return safeCells > 0 && revealedSafeCells === safeCells;
}
