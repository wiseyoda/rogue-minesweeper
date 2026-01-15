/**
 * Monster types for dungeon creatures.
 * @module types/monster
 */

/**
 * Monster difficulty tier.
 * Higher tiers are more dangerous and appear on later floors.
 */
export type MonsterTier = 1 | 2 | 3 | 'boss';

/**
 * Movement pattern for monsters (Phase 4+).
 * Determines how monsters move after player actions.
 */
export type MovePattern = 'static' | 'random' | 'chase' | 'patrol';

/**
 * Monster ability identifier (Phase 4+).
 * References specific ability implementations.
 */
export type MonsterAbility = 'web' | 'fire_breath' | 'phase' | 'summon';

/**
 * Definition of a monster type.
 * Used for monster templates, not individual instances.
 */
export interface Monster {
  /** Unique identifier for this monster type */
  id: string;
  /** Display name */
  name: string;
  /** Difficulty tier */
  tier: MonsterTier;
  /** Damage dealt to player on reveal */
  damage: number;
  /** Gold drop range [min, max] */
  goldDrop: [min: number, max: number];

  // Phase 4+ properties (optional placeholders)
  /** Whether this monster can move (Phase 4) */
  canMove?: boolean;
  /** Tiles moved per turn (Phase 4) */
  moveSpeed?: number;
  /** Movement behavior pattern (Phase 4) */
  movePattern?: MovePattern;
  /** Monster's own HP for combat (Phase 4) */
  hp?: number;
  /** Special ability identifier (Phase 4) */
  ability?: MonsterAbility;

  // Future properties
  /** Chance to drop a rune (0-100) (Phase 3) */
  runeDrop?: number;
}

/**
 * Monster roster for the game.
 * Maps monster IDs to their definitions.
 */
export type MonsterRoster = Record<string, Monster>;

/**
 * Default monster roster (MVP).
 * Only includes static monsters for Phase 1.
 */
export const DEFAULT_MONSTERS: MonsterRoster = {
  goblin: {
    id: 'goblin',
    name: 'Goblin',
    tier: 1,
    damage: 1,
    goldDrop: [1, 3],
    canMove: false,
    movePattern: 'static',
  },
  rat: {
    id: 'rat',
    name: 'Rat',
    tier: 1,
    damage: 1,
    goldDrop: [1, 2],
    canMove: false,
    movePattern: 'static',
  },
  skeleton: {
    id: 'skeleton',
    name: 'Skeleton',
    tier: 2,
    damage: 1,
    goldDrop: [2, 5],
    canMove: true,
    moveSpeed: 1,
    movePattern: 'chase',
  },
  spider: {
    id: 'spider',
    name: 'Spider',
    tier: 2,
    damage: 1,
    goldDrop: [2, 4],
    canMove: false,
    movePattern: 'static',
    ability: 'web',
  },
  orc: {
    id: 'orc',
    name: 'Orc',
    tier: 2,
    damage: 2,
    goldDrop: [3, 6],
    canMove: false,
    movePattern: 'static',
  },
  ghost: {
    id: 'ghost',
    name: 'Ghost',
    tier: 3,
    damage: 1,
    goldDrop: [4, 8],
    canMove: true,
    moveSpeed: 2,
    movePattern: 'chase',
    ability: 'phase',
  },
  dragon: {
    id: 'dragon',
    name: 'Dragon',
    tier: 'boss',
    damage: 3,
    goldDrop: [20, 50],
    canMove: true,
    moveSpeed: 1,
    movePattern: 'chase',
    hp: 5,
    ability: 'fire_breath',
  },
};
