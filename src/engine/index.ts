/**
 * Grid engine - pure Minesweeper logic.
 * @module engine
 */

// Types
export type { RevealResult, FlagResult, FlagState } from './types';

// Grid operations
export {
  createGrid,
  placeMonsters,
  calculateAdjacentCounts,
  initializeGrid,
  getAdjacentPositions,
} from './grid';

// Reveal operations
export { revealCell, floodFill, isValidPosition } from './reveal';

// Flag operations
export { toggleFlag } from './flag';

// Win condition
export {
  checkWinCondition,
  getSafeCellCount,
  getRevealedCount,
  getRevealedSafeCellCount,
} from './win-condition';
