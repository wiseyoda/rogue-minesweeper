/**
 * Grid creation and setup operations.
 * @module engine/grid
 */

import type { Cell, CellPosition, Grid, GridConfig } from '@/types';
import { createEmptyCell } from '@/types';

/**
 * Creates an empty grid with the specified dimensions.
 * All cells start unrevealed with no monsters.
 */
export function createGrid(config: GridConfig): Grid {
  const grid: Grid = [];

  for (let row = 0; row < config.rows; row++) {
    const rowCells: Cell[] = [];
    for (let col = 0; col < config.cols; col++) {
      rowCells.push(createEmptyCell());
    }
    grid.push(rowCells);
  }

  return grid;
}

/**
 * Places monsters randomly on the grid.
 * @param grid - The grid to place monsters on
 * @param count - Number of monsters to place
 * @param exclude - Optional position to exclude from monster placement (for first-click safety)
 * @returns New grid with monsters placed
 */
export function placeMonsters(grid: Grid, count: number, exclude?: CellPosition): Grid {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;

  if (rows === 0 || cols === 0) {
    return grid;
  }

  // Build list of available positions
  const availablePositions: CellPosition[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (exclude && exclude.row === row && exclude.col === col) {
        continue;
      }
      availablePositions.push({ row, col });
    }
  }

  // Shuffle and take the first `count` positions
  const shuffled = [...availablePositions].sort(() => Math.random() - 0.5);
  const monsterPositions = shuffled.slice(0, Math.min(count, shuffled.length));

  // Create new grid with monsters
  const newGrid: Grid = grid.map((rowCells, row) =>
    rowCells.map((cell, col) => {
      const hasMonster = monsterPositions.some((pos) => pos.row === row && pos.col === col);
      if (hasMonster) {
        return { ...cell, isMonster: true };
      }
      return cell;
    }),
  );

  return newGrid;
}

/**
 * Gets all valid adjacent positions for a cell.
 * Returns positions in 8 directions (including diagonals).
 */
export function getAdjacentPositions(grid: Grid, position: CellPosition): CellPosition[] {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const { row, col } = position;

  const directions: [number, number][] = [
    [-1, -1],
    [-1, 0],
    [-1, 1], // top-left, top, top-right
    [0, -1],
    [0, 1], // left, right
    [1, -1],
    [1, 0],
    [1, 1], // bottom-left, bottom, bottom-right
  ];

  const adjacent: CellPosition[] = [];

  for (const direction of directions) {
    const newRow = row + direction[0];
    const newCol = col + direction[1];

    if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
      adjacent.push({ row: newRow, col: newCol });
    }
  }

  return adjacent;
}

/**
 * Calculates adjacent monster counts for all cells.
 * @returns New grid with adjacentMonsters populated
 */
export function calculateAdjacentCounts(grid: Grid): Grid {
  return grid.map((rowCells, row) =>
    rowCells.map((cell, col) => {
      const adjacentPositions = getAdjacentPositions(grid, { row, col });
      const adjacentMonsters = adjacentPositions.filter(
        (pos) => grid[pos.row]?.[pos.col]?.isMonster,
      ).length;

      return { ...cell, adjacentMonsters };
    }),
  );
}

/**
 * Initializes a complete grid with monsters and adjacent counts.
 * Use this for first-click safety by passing the first click position.
 * @param config - Grid configuration
 * @param firstClick - Optional first click position to exclude from monsters
 * @returns Fully initialized grid ready for gameplay
 */
export function initializeGrid(config: GridConfig, firstClick?: CellPosition): Grid {
  const emptyGrid = createGrid(config);
  const withMonsters = placeMonsters(emptyGrid, config.monsterCount, firstClick);
  const withCounts = calculateAdjacentCounts(withMonsters);

  return withCounts;
}
