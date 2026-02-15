/**
 * Central type exports for Dungeon Delver.
 * Import types from '@/types' for convenience.
 *
 * @example
 * ```typescript
 * import type { Cell, Grid, GameState } from '@/types';
 * import { createEmptyCell, calculateLevelGridConfig } from '@/types';
 * ```
 *
 * @module types
 */

// Cell types
export type { Cell, CellPosition, HighlightType } from './cell';
export { createEmptyCell } from './cell';

// Grid types
export type { Grid, GridConfig, GridDimensions } from './grid';
export { calculateGridDimensions } from './grid';

// Player types
export type {
  ActiveBuffs,
  NextLevelBuffs,
  PlayerState,
  PlayerStats,
} from './player';
export { createInitialPlayerState, createDefaultPlayerStats } from './player';

// Monster types
export type {
  MonsterTier,
  MovePattern,
  MonsterAbility,
  Monster,
  MonsterRoster,
} from './monster';
export { DEFAULT_MONSTERS } from './monster';

// Item types
export type {
  ItemRarity,
  ShopItem,
  ShopItemPool,
  ShopItemDisplay,
} from './item';
export { RARITY_WEIGHTS, getRarityClass } from './item';

// Shop/upgrade types
export type {
  LeveledUpgrade,
  UnlockableUpgrade,
  PermanentUpgrade,
  PermanentUpgradeRegistry,
} from './shop';
export {
  isLeveledUpgrade,
  isUnlockableUpgrade,
  getUpgradeCost,
  canPurchaseUpgrade,
} from './shop';

// Game session types
export type { GamePhase, GameStats, RunState, GameState, SynergyNotification } from './game';
export {
  createInitialRunState,
  createDefaultGameStats,
  calculateLevelGridConfig,
} from './game';

// Rune types
export type {
  RuneCategory,
  RuneRarity,
  RuneTrigger,
  RuneEffect,
  RuneDefinition,
  RuneModifiers,
} from './rune';
export { createDefaultRuneModifiers } from './rune';

// AI types
export type {
  DungeonMasterRequestType,
  DungeonRunResult,
  DungeonRunRecord,
  DungeonRateLimitState,
  DungeonMasterContext,
  DungeonMasterContextEnvelope,
  DungeonMasterMood,
  DungeonMasterHintType,
  DungeonMasterResponse,
  DungeonMasterResponseSource,
  DungeonMasterGenerationResult,
} from './ai';
