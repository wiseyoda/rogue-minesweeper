/**
 * Zustand store type definitions.
 * @module stores/types
 */

import type {
  Grid,
  GridConfig,
  PlayerState,
  RunState,
  GamePhase,
  GameStats,
  PlayerStats,
  PermanentUpgradeRegistry,
} from '@/types';

// ============================================================================
// gameStore Types
// ============================================================================

/**
 * State shape for the game store.
 * Contains all state for the current run.
 */
export interface GameStoreState {
  /** Current dungeon grid */
  grid: Grid | null;
  /** Configuration for the current grid */
  gridConfig: GridConfig;
  /** Player resources and buffs */
  player: PlayerState;
  /** Current run progress */
  run: RunState;
  /** True when player has died (computed from player.lives) */
  gameOver: boolean;
}

/**
 * Actions available on the game store.
 */
export interface GameStoreActions {
  /** Initialize a new run with fresh state */
  startNewRun: () => void;
  /** Initialize grid for a specific level */
  startLevel: (level: number) => void;
  /** Reveal a cell at the given position */
  revealCell: (row: number, col: number) => void;
  /** Toggle flag on a cell at the given position */
  toggleFlag: (row: number, col: number) => void;
  /** Apply damage to player (shields first, then lives) */
  takeDamage: (amount: number) => void;
  /** Add gold to player */
  addGold: (amount: number) => void;
  /** Add shields to player */
  addShield: (count: number) => void;
  /** Transition to a new game phase */
  setPhase: (phase: GamePhase) => void;
  /** Reset store to initial state */
  reset: () => void;
  /** Generate shop items for between-floor shop */
  generateShop: () => void;
  /** Purchase a shop item by ID (returns true if successful) */
  purchaseItem: (itemId: string) => boolean;
  /** Reroll shop items (costs gold, returns true if successful) */
  rerollShop: () => boolean;
  /** Toggle shop modal visibility */
  setShowShop: (show: boolean) => void;
}

/**
 * Complete game store type.
 */
export type GameStore = GameStoreState & GameStoreActions;

// ============================================================================
// metaStore Types
// ============================================================================

/**
 * State shape for the meta store.
 * Contains persistent progression data.
 */
export interface MetaStoreState {
  /** Overall game statistics */
  stats: GameStats;
  /** Permanent player stats (affected by upgrades) */
  playerStats: PlayerStats;
  /** Purchased permanent upgrades */
  upgrades: PermanentUpgradeRegistry;
}

/**
 * Actions available on the meta store.
 */
export interface MetaStoreActions {
  /** Record statistics from a completed run */
  recordRunEnd: (level: number, gold: number) => void;
  /** Purchase an upgrade (returns true if successful) */
  purchaseUpgrade: (id: string) => boolean;
  /** Apply all purchased upgrades to playerStats */
  applyAllUpgrades: () => void;
  /** Reset store to initial state (for testing) */
  reset: () => void;
}

/**
 * Complete meta store type.
 */
export type MetaStore = MetaStoreState & MetaStoreActions;

// ============================================================================
// uiStore Types
// ============================================================================

/**
 * Available modal types.
 */
export type ModalType = 'none' | 'settings' | 'help' | 'confirm';

/**
 * State shape for the UI store.
 */
export interface UIStoreState {
  /** Currently open modal */
  activeModal: ModalType;
  /** Sound effects enabled */
  soundEnabled: boolean;
  /** Background music enabled */
  musicEnabled: boolean;
}

/**
 * Actions available on the UI store.
 */
export interface UIStoreActions {
  /** Open a modal */
  openModal: (modal: ModalType) => void;
  /** Close the current modal */
  closeModal: () => void;
  /** Toggle sound effects */
  toggleSound: () => void;
  /** Toggle background music */
  toggleMusic: () => void;
}

/**
 * Complete UI store type.
 */
export type UIStore = UIStoreState & UIStoreActions;
