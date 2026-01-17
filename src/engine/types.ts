/**
 * Engine-specific types for grid operations.
 * @module engine/types
 */

import type { CellPosition, Grid } from '@/types';

/**
 * Result of revealing a cell.
 * Contains the updated grid and metadata about the reveal operation.
 */
export interface RevealResult {
  /** Updated grid with revealed cell(s) */
  grid: Grid;
  /** True if a monster was hit */
  hitMonster: boolean;
  /** All positions that were revealed in this operation */
  revealedPositions: CellPosition[];
  /** True if win condition is now met */
  isWon: boolean;
}

/**
 * Possible states for a cell's flag status.
 */
export type FlagState = 'none' | 'flagged' | 'question';

/**
 * Result of toggling a flag on a cell.
 */
export interface FlagResult {
  /** Updated grid */
  grid: Grid;
  /** New state of the cell */
  newState: FlagState;
}
