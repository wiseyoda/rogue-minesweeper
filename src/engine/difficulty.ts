/**
 * Difficulty and scaling calculations.
 * Centralized constants for game balance tuning.
 * @module engine/difficulty
 */

import type { GridConfig } from '@/types';

/**
 * Tunable constants for difficulty scaling.
 * All game balance values should be defined here.
 */
export const DIFFICULTY_CONSTANTS = {
  // Grid scaling
  baseGridSize: 8,
  maxGridRows: 20,
  maxGridCols: 30,
  gridGrowthPerLevel: 1,

  // Monster scaling
  baseMonsterCount: 5,
  monsterGrowthPerLevel: 2.5,
  maxMonsterDensity: 0.3,

  // Rewards
  goldBonusPerLevel: 10,

  // Future: damage scaling (prep only - not implemented)
  baseDamage: 1,
  damageGrowthPerLevel: 0,
} as const;

/**
 * Floor configuration for a given level.
 * Includes all parameters needed to initialize a floor.
 */
export interface FloorConfig extends GridConfig {
  /** Gold bonus awarded on floor completion */
  goldBonus: number;
}

/**
 * Monster damage configuration for a given level.
 * Prep for future damage scaling system.
 */
export interface MonsterDamageConfig {
  /** Base damage before scaling */
  baseDamage: number;
  /** Actual damage after level scaling applied */
  scaledDamage: number;
}

/**
 * Calculate floor configuration for a given level.
 * Grid grows with difficulty as player progresses.
 *
 * @param level - The current floor number (1-indexed)
 * @returns FloorConfig with rows, cols, monsterCount, and goldBonus
 */
export function getFloorConfig(level: number): FloorConfig {
  const {
    baseGridSize,
    maxGridRows,
    maxGridCols,
    gridGrowthPerLevel,
    baseMonsterCount,
    monsterGrowthPerLevel,
    maxMonsterDensity,
    goldBonusPerLevel,
  } = DIFFICULTY_CONSTANTS;

  const rows = Math.min(baseGridSize + level * gridGrowthPerLevel, maxGridRows);
  const cols = Math.min(baseGridSize + level * gridGrowthPerLevel, maxGridCols);
  const monsterCount = Math.min(
    baseMonsterCount + Math.floor(level * monsterGrowthPerLevel),
    Math.floor(rows * cols * maxMonsterDensity)
  );
  const goldBonus = level * goldBonusPerLevel;

  return { rows, cols, monsterCount, goldBonus };
}

/**
 * Calculate monster damage for a given level.
 * Currently returns base damage only (scaling not implemented).
 *
 * @param level - The current floor number (1-indexed)
 * @returns MonsterDamageConfig with baseDamage and scaledDamage
 */
export function getMonsterDamage(level: number): MonsterDamageConfig {
  const { baseDamage, damageGrowthPerLevel } = DIFFICULTY_CONSTANTS;

  return {
    baseDamage,
    scaledDamage: baseDamage + Math.floor(level * damageGrowthPerLevel),
  };
}
