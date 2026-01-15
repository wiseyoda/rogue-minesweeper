/**
 * Game session and state types.
 * @module types/game
 */

import type { Grid, GridConfig } from './grid';
import type { PlayerState } from './player';

/**
 * Current phase of the game.
 * Used for UI state management and game flow.
 */
export type GamePhase =
  | 'playing' // Active gameplay on a floor
  | 'shopping' // Inter-level shop (between floors)
  | 'gameOver' // Player died, showing results
  | 'upgradeShop'; // End-of-run permanent upgrade shop

/**
 * Statistics tracked across all runs.
 * Persisted to localStorage.
 */
export interface GameStats {
  /** Highest floor ever reached */
  highestLevelOverall: number;
  /** Maximum gold held in a single run */
  maxGoldRun: number;
  /** Total number of runs played (optional, for analytics) */
  totalRuns?: number;
  /** Total number of deaths (optional, for analytics) */
  totalDeaths?: number;
}

/**
 * State for the current run/level.
 * Resets each floor (except level counter).
 */
export interface RunState {
  /** Current floor/level number (1-indexed) */
  level: number;
  /** Current game phase */
  phase: GamePhase;
  /** Number of cells revealed this floor */
  revealedCount: number;
  /** Number of flags placed this floor */
  flagsPlaced: number;
  /** True if player took damage this floor (for shieldBattery) */
  damageTakenThisLevel: boolean;
  /** True if player hasn't clicked yet (for firstClickSafety) */
  isFirstClick: boolean;
}

/**
 * Complete game state.
 * Combines all runtime state for a game session.
 */
export interface GameState {
  /** The dungeon grid */
  grid: Grid;
  /** Grid configuration (dimensions, monster count) */
  gridConfig: GridConfig;
  /** Player resources and buffs */
  player: PlayerState;
  /** Current run progress */
  run: RunState;
  /** Is the game over? (convenience flag) */
  gameOver: boolean;
}

/**
 * Creates initial run state for a new floor.
 */
export function createInitialRunState(level: number = 1): RunState {
  return {
    level,
    phase: 'playing',
    revealedCount: 0,
    flagsPlaced: 0,
    damageTakenThisLevel: false,
    isFirstClick: true,
  };
}

/**
 * Creates default game stats for a new player.
 */
export function createDefaultGameStats(): GameStats {
  return {
    highestLevelOverall: 1,
    maxGoldRun: 0,
    totalRuns: 0,
    totalDeaths: 0,
  };
}

/**
 * Calculates grid config based on current level.
 * Grid grows with difficulty as player progresses.
 */
export function calculateLevelGridConfig(level: number): GridConfig {
  const rows = Math.min(8 + level, 20);
  const cols = Math.min(8 + level, 30);
  const monsterCount = Math.min(
    5 + Math.floor(level * 2.5),
    Math.floor(rows * cols * 0.3)
  );

  return { rows, cols, monsterCount };
}
