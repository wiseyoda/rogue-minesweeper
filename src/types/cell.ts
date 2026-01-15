/**
 * Cell types for the dungeon grid.
 * @module types/cell
 */

/**
 * A single cell in the dungeon grid.
 * Represents the state of one tile that the player can interact with.
 */
export interface Cell {
  /** True if this cell contains a monster */
  isMonster: boolean;
  /** True if player has revealed this cell by clicking it */
  isRevealed: boolean;
  /** True if player has flagged this cell as dangerous (right-click) */
  isFlagged: boolean;
  /** True if player marked with question mark (unsure state) */
  isQuestion: boolean;
  /** True if this is the exit to the next floor (appears after clearing) */
  isExit: boolean;
  /** Number of adjacent cells containing monsters (0-8) */
  adjacentMonsters: number;
}

/**
 * Position of a cell in the grid.
 * Uses zero-based row/column indices.
 */
export interface CellPosition {
  /** Row index (0-based, top to bottom) */
  row: number;
  /** Column index (0-based, left to right) */
  col: number;
}

/**
 * Creates a default unrevealed cell.
 * Useful for initializing grids.
 */
export function createEmptyCell(): Cell {
  return {
    isMonster: false,
    isRevealed: false,
    isFlagged: false,
    isQuestion: false,
    isExit: false,
    adjacentMonsters: 0,
  };
}
