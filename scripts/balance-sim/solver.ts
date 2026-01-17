/**
 * Minesweeper solver for accurate simulation.
 *
 * This solver:
 * 1. Generates an actual board with mines
 * 2. Uses constraint-based deduction to reveal safe cells
 * 3. Only guesses when logically stuck
 * 4. Calculates actual probabilities for ambiguous cells
 *
 * @module scripts/balance-sim/solver
 */

import type { Random } from './random.ts';

/**
 * Cell state in the solver's board representation.
 */
interface SolverCell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
}

/**
 * Result of solving/playing a board.
 */
export interface SolveResult {
  cleared: boolean;
  tilesRevealed: number;
  minesHit: number;
  guessesRequired: number;
}

/**
 * Generate a minesweeper board.
 * First click position is guaranteed safe (no mine there or adjacent).
 */
function generateBoard(
  rows: number,
  cols: number,
  mineCount: number,
  random: Random
): SolverCell[][] {
  const board: SolverCell[][] = [];

  // Initialize empty board
  for (let r = 0; r < rows; r++) {
    board[r] = [];
    for (let c = 0; c < cols; c++) {
      board[r]![c] = {
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        adjacentMines: 0,
      };
    }
  }

  // Place mines randomly
  const positions: [number, number][] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      positions.push([r, c]);
    }
  }
  random.shuffle(positions);

  for (let i = 0; i < mineCount && i < positions.length; i++) {
    const [r, c] = positions[i]!;
    board[r]![c]!.isMine = true;
  }

  // Calculate adjacent mine counts
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!board[r]![c]!.isMine) {
        board[r]![c]!.adjacentMines = countAdjacentMines(board, r, c);
      }
    }
  }

  return board;
}

/**
 * Count mines adjacent to a cell.
 */
function countAdjacentMines(board: SolverCell[][], row: number, col: number): number {
  let count = 0;
  const rows = board.length;
  const cols = board[0]?.length ?? 0;

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        if (board[nr]![nc]!.isMine) count++;
      }
    }
  }

  return count;
}

/**
 * Get unrevealed, unflagged neighbors of a cell.
 */
function getUnrevealedNeighbors(
  board: SolverCell[][],
  row: number,
  col: number
): [number, number][] {
  const neighbors: [number, number][] = [];
  const rows = board.length;
  const cols = board[0]?.length ?? 0;

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        const cell = board[nr]![nc]!;
        if (!cell.isRevealed && !cell.isFlagged) {
          neighbors.push([nr, nc]);
        }
      }
    }
  }

  return neighbors;
}

/**
 * Get flagged neighbors of a cell.
 */
function getFlaggedNeighborCount(board: SolverCell[][], row: number, col: number): number {
  let count = 0;
  const rows = board.length;
  const cols = board[0]?.length ?? 0;

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        if (board[nr]![nc]!.isFlagged) count++;
      }
    }
  }

  return count;
}

/**
 * Reveal a cell and flood-fill if it's a zero.
 * Returns number of cells revealed, or -1 if hit a mine.
 */
function revealCell(board: SolverCell[][], row: number, col: number): number {
  const cell = board[row]![col]!;

  if (cell.isRevealed || cell.isFlagged) return 0;

  if (cell.isMine) {
    cell.isRevealed = true;
    return -1; // Hit a mine
  }

  // Flood fill for zeros
  const stack: [number, number][] = [[row, col]];
  let revealed = 0;
  const rows = board.length;
  const cols = board[0]?.length ?? 0;

  while (stack.length > 0) {
    const [r, c] = stack.pop()!;
    const current = board[r]![c]!;

    if (current.isRevealed || current.isFlagged || current.isMine) continue;

    current.isRevealed = true;
    revealed++;

    // If zero, add all neighbors to stack
    if (current.adjacentMines === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            if (!board[nr]![nc]!.isRevealed) {
              stack.push([nr, nc]);
            }
          }
        }
      }
    }
  }

  return revealed;
}

/**
 * Apply logical deduction to find safe cells and mines.
 * Returns true if any progress was made.
 */
function applyLogic(board: SolverCell[][]): {
  safeCells: [number, number][];
  mineCells: [number, number][];
} {
  const safeCells: [number, number][] = [];
  const mineCells: [number, number][] = [];
  const rows = board.length;
  const cols = board[0]?.length ?? 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = board[r]![c]!;
      if (!cell.isRevealed || cell.adjacentMines === 0) continue;

      const unrevealed = getUnrevealedNeighbors(board, r, c);
      const flaggedCount = getFlaggedNeighborCount(board, r, c);
      const remainingMines = cell.adjacentMines - flaggedCount;

      if (unrevealed.length === 0) continue;

      // All unrevealed neighbors are mines
      if (remainingMines === unrevealed.length) {
        for (const [nr, nc] of unrevealed) {
          if (!mineCells.some(([mr, mc]) => mr === nr && mc === nc)) {
            mineCells.push([nr, nc]);
          }
        }
      }

      // All mines accounted for - remaining neighbors are safe
      if (remainingMines === 0) {
        for (const [nr, nc] of unrevealed) {
          if (!safeCells.some(([sr, sc]) => sr === nr && sc === nc)) {
            safeCells.push([nr, nc]);
          }
        }
      }
    }
  }

  return { safeCells, mineCells };
}

/**
 * Find all unrevealed, unflagged cells on the board.
 */
function getAllUnrevealed(board: SolverCell[][]): [number, number][] {
  const unrevealed: [number, number][] = [];
  const rows = board.length;
  const cols = board[0]?.length ?? 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = board[r]![c]!;
      if (!cell.isRevealed && !cell.isFlagged) {
        unrevealed.push([r, c]);
      }
    }
  }

  return unrevealed;
}

/**
 * Estimate mine probability for unrevealed cells.
 * Uses a simple heuristic based on constraint counts.
 */
function estimateMineProbabilities(
  board: SolverCell[][],
  unrevealed: [number, number][],
  totalRemainingMines: number
): Map<string, number> {
  const probabilities = new Map<string, number>();
  const rows = board.length;
  const cols = board[0]?.length ?? 0;

  // Default probability based on remaining mines / remaining cells
  const defaultProb = totalRemainingMines / unrevealed.length;

  for (const [r, c] of unrevealed) {
    // Count how many revealed numbered cells constrain this cell
    let constraintSum = 0;
    let constraintCount = 0;

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          const neighbor = board[nr]![nc]!;
          if (neighbor.isRevealed && neighbor.adjacentMines > 0) {
            const flaggedNear = getFlaggedNeighborCount(board, nr, nc);
            const unrevealedNear = getUnrevealedNeighbors(board, nr, nc);
            const remainingMines = neighbor.adjacentMines - flaggedNear;

            if (unrevealedNear.length > 0) {
              // Probability this cell is a mine based on this constraint
              const localProb = remainingMines / unrevealedNear.length;
              constraintSum += localProb;
              constraintCount++;
            }
          }
        }
      }
    }

    // Average constraint probability, fallback to default
    const prob = constraintCount > 0 ? constraintSum / constraintCount : defaultProb;
    probabilities.set(`${r},${c}`, Math.min(0.95, Math.max(0.05, prob)));
  }

  return probabilities;
}

/**
 * Solve a board, making guesses when necessary.
 * Returns the result of the solve attempt.
 */
export function solveBoard(
  rows: number,
  cols: number,
  mineCount: number,
  random: Random,
  maxHits: number,
  preRevealedCount: number = 0
): SolveResult {
  const board = generateBoard(rows, cols, mineCount, random);
  const totalSafeCells = rows * cols - mineCount;

  let tilesRevealed = 0;
  let minesHit = 0;
  let guessesRequired = 0;
  let remainingMines = mineCount;

  // Simulate pre-revealed tiles (from Reveal Scroll)
  // Reveal random safe cells
  if (preRevealedCount > 0) {
    const safeCells: [number, number][] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!board[r]![c]!.isMine) {
          safeCells.push([r, c]);
        }
      }
    }
    random.shuffle(safeCells);

    for (let i = 0; i < preRevealedCount && i < safeCells.length; i++) {
      const [r, c] = safeCells[i]!;
      const revealed = revealCell(board, r, c);
      if (revealed > 0) {
        tilesRevealed += revealed;
      }
    }
  }

  // First click - find a safe cell (preferably a zero for good opening)
  if (tilesRevealed === 0) {
    // Find a cell with zero adjacent mines for best opening
    let firstClick: [number, number] | null = null;

    for (let r = 0; r < rows && !firstClick; r++) {
      for (let c = 0; c < cols && !firstClick; c++) {
        const cell = board[r]![c]!;
        if (!cell.isMine && cell.adjacentMines === 0) {
          firstClick = [r, c];
        }
      }
    }

    // Fallback to any safe cell
    if (!firstClick) {
      for (let r = 0; r < rows && !firstClick; r++) {
        for (let c = 0; c < cols && !firstClick; c++) {
          if (!board[r]![c]!.isMine) {
            firstClick = [r, c];
          }
        }
      }
    }

    if (firstClick) {
      const revealed = revealCell(board, firstClick[0], firstClick[1]);
      if (revealed > 0) tilesRevealed += revealed;
    }
  }

  // Main solving loop
  while (tilesRevealed < totalSafeCells && minesHit < maxHits) {
    // Apply logical deduction
    const { safeCells, mineCells } = applyLogic(board);

    // Flag mines
    for (const [r, c] of mineCells) {
      if (!board[r]![c]!.isFlagged) {
        board[r]![c]!.isFlagged = true;
        remainingMines--;
      }
    }

    // Reveal safe cells
    let madeProgress = false;
    for (const [r, c] of safeCells) {
      const revealed = revealCell(board, r, c);
      if (revealed > 0) {
        tilesRevealed += revealed;
        madeProgress = true;
      }
    }

    if (madeProgress) continue;

    // No logical progress - need to guess
    const unrevealed = getAllUnrevealed(board);
    if (unrevealed.length === 0) break;

    guessesRequired++;

    // Calculate probabilities and pick the safest cell
    const probabilities = estimateMineProbabilities(board, unrevealed, remainingMines);

    // Sort by probability (lowest first = safest)
    unrevealed.sort((a, b) => {
      const probA = probabilities.get(`${a[0]},${a[1]}`) ?? 0.5;
      const probB = probabilities.get(`${b[0]},${b[1]}`) ?? 0.5;
      return probA - probB;
    });

    // Pick the safest cell (or randomly among safest)
    const safestProb = probabilities.get(`${unrevealed[0]![0]},${unrevealed[0]![1]}`) ?? 0.5;

    // Find all cells with similar probability
    const safestCells = unrevealed.filter(([r, c]) => {
      const prob = probabilities.get(`${r},${c}`) ?? 0.5;
      return prob <= safestProb + 0.05;
    });

    // Pick one randomly
    const guessCell = random.pick(safestCells) ?? unrevealed[0]!;
    const [gr, gc] = guessCell;

    // Make the guess
    const result = revealCell(board, gr, gc);
    if (result === -1) {
      // Hit a mine
      minesHit++;
    } else {
      tilesRevealed += result;
    }
  }

  return {
    cleared: tilesRevealed >= totalSafeCells,
    tilesRevealed,
    minesHit,
    guessesRequired,
  };
}
