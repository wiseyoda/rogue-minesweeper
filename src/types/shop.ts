/**
 * Permanent upgrade and meta-shop types.
 * @module types/shop
 */

import type { PlayerStats } from './player';

/**
 * Base properties for all permanent upgrades.
 */
interface BaseUpgrade {
  /** Display name */
  name: string;
  /** Effect description */
  description: string;
  /** Base gold cost (may be modified by level) */
  baseCost: number;
  /**
   * Apply this upgrade's effect to player stats.
   * @param stats - Permanent player stats (mutable)
   */
  apply: (stats: PlayerStats) => void;
}

/**
 * An upgrade that can be purchased multiple times.
 * Each level increases cost and effect.
 */
export interface LeveledUpgrade extends BaseUpgrade {
  /** Discriminator for type narrowing */
  type: 'leveled';
  /** Current upgrade level (0 = not purchased) */
  level: number;
  /** Maximum purchasable level */
  maxLevel: number;
  /** Cost multiplier per level (e.g., 2 = double each level) */
  costIncrease: number;
}

/**
 * A one-time unlock upgrade.
 * Can only be purchased once.
 */
export interface UnlockableUpgrade extends BaseUpgrade {
  /** Discriminator for type narrowing */
  type: 'unlockable';
  /** Whether this upgrade has been purchased */
  unlocked: boolean;
}

/**
 * Any permanent upgrade type.
 * Use discriminated union for type-safe handling.
 */
export type PermanentUpgrade = LeveledUpgrade | UnlockableUpgrade;

/**
 * Registry mapping upgrade keys to their definitions.
 */
export type PermanentUpgradeRegistry = Record<string, PermanentUpgrade>;

/**
 * Type guard for leveled upgrades.
 */
export function isLeveledUpgrade(
  upgrade: PermanentUpgrade
): upgrade is LeveledUpgrade {
  return upgrade.type === 'leveled';
}

/**
 * Type guard for unlockable upgrades.
 */
export function isUnlockableUpgrade(
  upgrade: PermanentUpgrade
): upgrade is UnlockableUpgrade {
  return upgrade.type === 'unlockable';
}

/**
 * Calculates the current cost of an upgrade.
 */
export function getUpgradeCost(upgrade: PermanentUpgrade): number {
  if (isLeveledUpgrade(upgrade)) {
    return Math.floor(
      upgrade.baseCost * Math.pow(upgrade.costIncrease, upgrade.level)
    );
  }
  return upgrade.baseCost;
}

/**
 * Checks if an upgrade can be purchased.
 */
export function canPurchaseUpgrade(
  upgrade: PermanentUpgrade,
  gold: number
): boolean {
  const cost = getUpgradeCost(upgrade);

  if (isLeveledUpgrade(upgrade)) {
    return upgrade.level < upgrade.maxLevel && gold >= cost;
  }

  if (isUnlockableUpgrade(upgrade)) {
    return !upgrade.unlocked && gold >= cost;
  }

  return false;
}
