/**
 * Cell revealing and flood fill operations.
 * @module engine/reveal
 */

import type { CellPosition, Grid } from '@/types';
import type { RevealResult } from './types';
import { getAdjacentPositions } from './grid';
import { checkWinCondition } from './win-condition';

/**
 * Checks if a position is valid within the grid bounds.
 */
export function isValidPosition(grid: Grid, position: CellPosition): boolean {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;

  return position.row >= 0 && position.row < rows && position.col >= 0 && position.col < cols;
}

/**
 * Creates a deep copy of the grid.
 */
function copyGrid(grid: Grid): Grid {
  return grid.map((row) => row.map((cell) => ({ ...cell })));
}

/**
 * Performs flood fill to reveal all connected empty cells.
 * Uses iterative BFS approach to avoid stack overflow.
 * @param grid - The grid to perform flood fill on
 * @param position - Starting position
 * @returns Object with updated grid and list of revealed positions
 */
export function floodFill(
  grid: Grid,
  position: CellPosition,
): { grid: Grid; revealedPositions: CellPosition[] } {
  const newGrid = copyGrid(grid);
  const revealedPositions: CellPosition[] = [];
  const queue: CellPosition[] = [position];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const current = queue.shift()!;
    const key = `${current.row},${current.col}`;

    if (visited.has(key)) continue;
    visited.add(key);

    const cell = newGrid[current.row]?.[current.col];
    if (!cell || cell.isRevealed || cell.isFlagged || cell.isMonster) continue;

    // Reveal this cell
    const rowArr = newGrid[current.row];
    if (rowArr) {
      rowArr[current.col] = { ...cell, isRevealed: true };
    }
    revealedPositions.push(current);

    // If empty (no adjacent monsters), continue flood fill
    if (cell.adjacentMonsters === 0) {
      const neighbors = getAdjacentPositions(newGrid, current);
      for (const neighbor of neighbors) {
        const neighborKey = `${neighbor.row},${neighbor.col}`;
        if (!visited.has(neighborKey)) {
          queue.push(neighbor);
        }
      }
    }
  }

  return { grid: newGrid, revealedPositions };
}

/**
 * Reveals a cell and returns the result.
 * If the cell is empty (adjacentMonsters === 0), performs flood fill.
 */
export function revealCell(grid: Grid, position: CellPosition): RevealResult {
  // Validate position
  if (!isValidPosition(grid, position)) {
    return {
      grid,
      hitMonster: false,
      revealedPositions: [],
      isWon: false,
    };
  }

  const cell = grid[position.row]?.[position.col];

  // Can't reveal if already revealed, flagged, or question
  if (!cell || cell.isRevealed || cell.isFlagged || cell.isQuestion) {
    return {
      grid,
      hitMonster: false,
      revealedPositions: [],
      isWon: checkWinCondition(grid),
    };
  }

  // Hit a monster
  if (cell.isMonster) {
    const newGrid = copyGrid(grid);
    const rowArr = newGrid[position.row];
    if (rowArr) {
      rowArr[position.col] = { ...cell, isRevealed: true };
    }

    return {
      grid: newGrid,
      hitMonster: true,
      revealedPositions: [position],
      isWon: false,
    };
  }

  // Empty cell or numbered cell
  if (cell.adjacentMonsters === 0) {
    // Flood fill
    const result = floodFill(grid, position);
    return {
      grid: result.grid,
      hitMonster: false,
      revealedPositions: result.revealedPositions,
      isWon: checkWinCondition(result.grid),
    };
  }

  // Numbered cell - just reveal this one
  const newGrid = copyGrid(grid);
  const rowArr = newGrid[position.row];
  if (rowArr) {
    rowArr[position.col] = { ...cell, isRevealed: true };
  }

  return {
    grid: newGrid,
    hitMonster: false,
    revealedPositions: [position],
    isWon: checkWinCondition(newGrid),
  };
}
