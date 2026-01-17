/**
 * Grid types for the dungeon layout.
 * @module types/grid
 */

import type { Cell } from './cell';

/**
 * The dungeon grid - a 2D array of cells.
 * Indexed as grid[row][col].
 */
export type Grid = Cell[][];

/**
 * Configuration for generating a new grid.
 * Used when starting a new floor.
 */
export interface GridConfig {
  /** Number of rows in the grid */
  rows: number;
  /** Number of columns in the grid */
  cols: number;
  /** Number of monsters to place */
  monsterCount: number;
}

/**
 * Computed dimensions and statistics for a grid.
 * Derived from GridConfig but includes calculated values.
 */
export interface GridDimensions {
  /** Number of rows in the grid */
  rows: number;
  /** Number of columns in the grid */
  cols: number;
  /** Total number of cells (rows * cols) */
  totalCells: number;
  /** Number of safe cells (totalCells - monsterCount) */
  safeCells: number;
}

/**
 * Calculates grid dimensions from a config.
 */
export function calculateGridDimensions(config: GridConfig): GridDimensions {
  const totalCells = config.rows * config.cols;
  return {
    rows: config.rows,
    cols: config.cols,
    totalCells,
    safeCells: totalCells - config.monsterCount,
  };
}
