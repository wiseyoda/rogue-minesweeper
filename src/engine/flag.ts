/**
 * Flag toggling operations.
 * @module engine/flag
 */

import type { Grid, CellPosition } from '@/types';
import type { FlagResult, FlagState } from './types';
import { isValidPosition } from './reveal';

/**
 * Creates a deep copy of the grid.
 */
function copyGrid(grid: Grid): Grid {
  return grid.map((row) => row.map((cell) => ({ ...cell })));
}

/**
 * Gets the next flag state in the cycle.
 * Cycle: none → flagged → question → none
 */
function getNextFlagState(cell: { isFlagged: boolean; isQuestion: boolean }): FlagState {
  if (!cell.isFlagged && !cell.isQuestion) {
    return 'flagged';
  }
  if (cell.isFlagged) {
    return 'question';
  }
  return 'none';
}

/**
 * Toggles the flag state of a cell.
 * Only unrevealed cells can be flagged.
 * Cycle: unrevealed → flagged → question → unrevealed
 */
export function toggleFlag(grid: Grid, position: CellPosition): FlagResult {
  // Validate position
  if (!isValidPosition(grid, position)) {
    return {
      grid,
      newState: 'none',
    };
  }

  const cell = grid[position.row]?.[position.col];

  // Can't flag revealed cells
  if (!cell || cell.isRevealed) {
    return {
      grid,
      newState: 'none',
    };
  }

  const newState = getNextFlagState(cell);
  const newGrid = copyGrid(grid);

  const rowArr = newGrid[position.row];
  if (rowArr) {
    rowArr[position.col] = {
      ...cell,
      isFlagged: newState === 'flagged',
      isQuestion: newState === 'question',
    };
  }

  return {
    grid: newGrid,
    newState,
  };
}
