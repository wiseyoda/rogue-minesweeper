/**
 * Game session and state types.
 * @module types/game
 */

import type { Grid, GridConfig } from './grid';
import type { PlayerState } from './player';
import type { ShopItem } from './item';

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
  /** Total number of runs played */
  totalRuns: number;
  /** Total number of deaths (optional, for analytics) */
  totalDeaths?: number;
  /** Total gold earned across all runs (lifetime) */
  totalGoldEarned: number;
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
  /** Damage taken this floor (for shieldBattery and stats) */
  damageTakenThisLevel: number;
  /** True if player hasn't clicked yet (for firstClickSafety) */
  isFirstClick: boolean;
  /** Total damage taken this run (for game over stats) */
  totalDamageTaken: number;
  /** Current shop items (populated when entering shop) */
  shopItems: ShopItem[];
  /** IDs of items purchased this shop visit */
  purchasedIds: string[];
  /** Number of times shop has been rerolled this visit */
  rerollCount: number;
  /** Whether the shop modal is currently shown */
  showShop: boolean;
  /** Number of safe tiles to reveal at level start (from Reveal Scroll buff) */
  pendingRevealTiles?: number;
  /** True if first monster hit hasn't been used yet (for firstClickSafety upgrade) */
  firstMonsterHit: boolean;
  /** True if solver-based reveal should be applied after first click */
  pendingRevealScroll?: boolean;
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
    damageTakenThisLevel: 0,
    isFirstClick: true,
    totalDamageTaken: 0,
    shopItems: [],
    purchasedIds: [],
    rerollCount: 0,
    showShop: false,
    firstMonsterHit: false,
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
    totalGoldEarned: 0,
  };
}

/**
 * @deprecated Use getFloorConfig from @/engine/difficulty instead.
 * Kept temporarily for backwards compatibility during migration.
 */
export { getFloorConfig as calculateLevelGridConfig } from '@/engine/difficulty';
