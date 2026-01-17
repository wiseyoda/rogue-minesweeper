/**
 * Player state and statistics types.
 * @module types/player
 */

/**
 * Buffs that are active during the current level.
 * These apply immediately and may be consumed.
 */
export interface ActiveBuffs {
  /** If true, next death restores full lives instead */
  extraLife?: boolean;
  /** If true, gain 1 gold every 5 seconds for the run */
  goldenGoose?: boolean;
  /** If true, double all gold earned from tiles */
  goldMagnet?: boolean;
  /** If true, next monster hit is negated */
  steadyHand?: boolean;
  /** Number of remaining forcefield charges (immune to monster) */
  forcefield?: number;
  /** If true, gain 1 gold for every 10 tiles revealed */
  scrapMetal?: boolean;
  /** If true, gain 1 life if level completed without damage */
  shieldBattery?: boolean;
}

/**
 * Buffs that will apply at the start of the next level.
 * Purchased in the inter-level shop.
 */
export interface NextLevelBuffs {
  /** Number of random safe tiles to reveal at level start */
  revealTiles?: number;
  /** Number of shields to grant at level start */
  shields?: number;
  /** If true, reveal all '0' tiles at level start */
  masterGoggles?: boolean;
  /** Number of random monsters to auto-flag at level start */
  monsterTracker?: number;
  /** If true, flag 25% of all monsters at level start */
  eliteMonsterTracker?: boolean;
  /** If true, reduce monster count by 10% */
  monsterRepellent?: boolean;
  /** Steady hand buff for next level */
  steadyHand?: boolean;
  /** Gold magnet buff for next level */
  goldMagnet?: boolean;
  /** Scrap metal buff for next level */
  scrapMetal?: boolean;
  /** Shield battery buff for next level */
  shieldBattery?: boolean;
  /** Forcefield charges for next level */
  forcefield?: number;
  /** If true, use solver to reveal all logically deducible safe tiles */
  revealScroll?: boolean;
}

/**
 * Player state during a run.
 * Tracks current health, resources, and active effects.
 */
export interface PlayerState {
  /** Current lives (0 = game over) */
  lives: number;
  /** Maximum lives (can be increased by upgrades) */
  maxLives: number;
  /** Current shields (absorb damage before lives) */
  shields: number;
  /** Current gold (currency for shops) */
  gold: number;
  /** Number of peek scrolls in inventory (reveal one tile when used) */
  peekScrolls: number;
  /** Buffs active during current level */
  activeBuffs: ActiveBuffs;
  /** Buffs to apply at next level start */
  nextLevelBuffs: NextLevelBuffs;
  /** Equipped rune IDs (max 3, persist for entire run) */
  equippedRunes: string[];
  /** Whether Second Chance rune has been used this run */
  secondChanceUsed: boolean;
}

/**
 * Permanent player statistics.
 * These persist across runs and are modified by permanent upgrades.
 */
export interface PlayerStats {
  /** Maximum lives at run start */
  maxLives: number;
  /** Gold at run start */
  startingGold: number;
  /** If true, first click on a monster flags it instead of taking damage */
  firstClickSafety: boolean;
  /** Gold find bonus multiplier (0.0 = no bonus, 0.1 = +10%) */
  goldFindBonus: number;
  /** Number of shields at run start */
  startingShields: number;
  /** Number of random buffs to apply at run start (from Preparation upgrade) */
  preparationLevel: number;
}

/**
 * Creates default player state for a new run.
 */
export function createInitialPlayerState(stats: PlayerStats): PlayerState {
  return {
    lives: stats.maxLives,
    maxLives: stats.maxLives,
    shields: 0,
    gold: stats.startingGold,
    peekScrolls: 0,
    activeBuffs: {},
    nextLevelBuffs: {},
    equippedRunes: [],
    secondChanceUsed: false,
  };
}

/**
 * Creates default player stats (before any upgrades).
 */
export function createDefaultPlayerStats(): PlayerStats {
  return {
    maxLives: 3,
    startingGold: 0,
    firstClickSafety: false,
    goldFindBonus: 0,
    startingShields: 0,
    preparationLevel: 0,
  };
}
