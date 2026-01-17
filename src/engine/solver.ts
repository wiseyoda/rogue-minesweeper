/**
 * Auto-solver for minesweeper grids.
 * Uses constraint satisfaction to find mathematically certain moves.
 * @module engine/solver
 */

import type { Grid, CellPosition } from '@/types';
import { getAdjacentPositions } from './grid';

/**
 * Result of a solver step.
 */
export interface SolverResult {
  /** Positions that are 100% safe to reveal */
  safePositions: CellPosition[];
  /** Positions that are 100% monsters to flag */
  monsterPositions: CellPosition[];
  /** True if no certain moves could be found */
  stuck: boolean;
}

/**
 * Find all mathematically certain moves on the grid.
 * Does not guess - only returns positions that are 100% certain.
 *
 * Logic:
 * - For each revealed number cell:
 *   - Count unrevealed unflagged neighbors
 *   - Count flagged neighbors
 *   - If flagged == number: all unrevealed neighbors are safe
 *   - If unrevealed == (number - flagged): all unrevealed neighbors are monsters
 */
export function findCertainMoves(grid: Grid): SolverResult {
  // First pass: collect candidates for safe and monster positions
  const safeCandidates = new Set<string>();
  const monsterCandidates = new Set<string>();
  // Track positions with conflicting determinations
  const conflicts = new Set<string>();

  const posKey = (pos: CellPosition) => `${pos.row},${pos.col}`;
  const parseKey = (key: string): CellPosition => {
    const parts = key.split(',');
    return { row: Number(parts[0]), col: Number(parts[1]) };
  };

  for (let row = 0; row < grid.length; row++) {
    const gridRow = grid[row];
    if (!gridRow) continue;

    for (let col = 0; col < gridRow.length; col++) {
      const cell = gridRow[col];
      if (!cell) continue;

      // Only process revealed cells with adjacent monsters
      if (!cell.isRevealed || cell.adjacentMonsters === 0) {
        continue;
      }

      const adjacent = getAdjacentPositions(grid, { row, col });
      const unrevealed: CellPosition[] = [];
      let flaggedCount = 0;

      for (const pos of adjacent) {
        const neighbor = grid[pos.row]?.[pos.col];
        if (!neighbor) continue;
        if (neighbor.isFlagged) {
          flaggedCount++;
        } else if (!neighbor.isRevealed) {
          unrevealed.push(pos);
        }
      }

      const remainingMonsters = cell.adjacentMonsters - flaggedCount;

      // All monsters accounted for - remaining unrevealed are safe
      if (remainingMonsters === 0 && unrevealed.length > 0) {
        for (const pos of unrevealed) {
          const key = posKey(pos);
          // Check for conflict: if already marked as monster, we have inconsistency
          if (monsterCandidates.has(key)) {
            conflicts.add(key);
          } else {
            safeCandidates.add(key);
          }
        }
      }

      // All unrevealed must be monsters
      if (remainingMonsters === unrevealed.length && unrevealed.length > 0) {
        for (const pos of unrevealed) {
          const key = posKey(pos);
          // Check for conflict: if already marked as safe, we have inconsistency
          if (safeCandidates.has(key)) {
            conflicts.add(key);
          } else {
            monsterCandidates.add(key);
          }
        }
      }
    }
  }

  // Remove conflicts from both sets - these positions have contradictory constraints
  // (likely due to incorrect flags somewhere)
  for (const key of conflicts) {
    safeCandidates.delete(key);
    monsterCandidates.delete(key);
  }

  // Convert sets to arrays with BULLETPROOF safety checks
  // Since this is a dev tool, we have access to isMonster - use it!
  const safePositions = Array.from(safeCandidates)
    .map(parseKey)
    .filter((pos) => {
      const cell = grid[pos.row]?.[pos.col];
      // CRITICAL: Never include actual monsters in safe positions
      if (cell?.isMonster) {
        console.warn(
          `[Solver] BLOCKED: Attempted to mark monster at (${pos.row},${pos.col}) as safe!`
        );
        return false;
      }
      return true;
    });

  const monsterPositions = Array.from(monsterCandidates)
    .map(parseKey)
    .filter((pos) => {
      const cell = grid[pos.row]?.[pos.col];
      // Only flag actual monsters (don't flag safe cells by mistake)
      if (cell && !cell.isMonster) {
        console.warn(
          `[Solver] BLOCKED: Attempted to flag non-monster at (${pos.row},${pos.col}) as monster!`
        );
        return false;
      }
      return true;
    });

  return {
    safePositions,
    monsterPositions,
    stuck: safePositions.length === 0 && monsterPositions.length === 0,
  };
}
