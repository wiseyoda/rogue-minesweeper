/**
 * Permanent upgrade definitions for meta-progression.
 * @module data/permanentUpgrades
 */

import type { LeveledUpgrade, UnlockableUpgrade, PermanentUpgradeRegistry } from '@/types';

/**
 * All available permanent upgrades.
 * These persist across runs and affect starting stats.
 *
 * Balance targets (1-2 upgrades affordable per run at ~2,600g median):
 * - Fortune: Long tail progression (100 levels, base 1K, ~600K total)
 * - Vitality: Expensive milestones (7 levels, ~135K total)
 * - Resilience: Medium investment (5 levels, ~28.5K total)
 * - Preparation: Medium investment (5 levels, ~29.5K total)
 * - Monster Ward: Early-game goal (2K)
 */
export const PERMANENT_UPGRADES: PermanentUpgradeRegistry = {
  fortune: {
    type: 'leveled',
    name: 'Fortune',
    description: '+1% gold find',
    baseCost: 1000,
    level: 0,
    maxLevel: 100,
    costIncrease: 1.03,
    apply: (stats) => {
      stats.goldFindBonus += 0.01;
    },
  } as LeveledUpgrade,

  vitality: {
    type: 'leveled',
    name: 'Vitality',
    description: '+1 starting Max HP',
    baseCost: 5000,
    level: 0,
    maxLevel: 7,
    costIncrease: 1, // Not used - flatCosts takes precedence
    flatCosts: [5000, 8000, 12000, 17000, 23000, 30000, 40000],
    apply: (stats) => {
      stats.maxLives += 1;
    },
  } as LeveledUpgrade,

  resilience: {
    type: 'leveled',
    name: 'Resilience',
    description: '+1 starting shield',
    baseCost: 1000,
    level: 0,
    maxLevel: 5,
    costIncrease: 1, // Not used - flatCosts takes precedence
    flatCosts: [1000, 2500, 5000, 8000, 12000],
    apply: (stats) => {
      stats.startingShields += 1;
    },
  } as LeveledUpgrade,

  preparation: {
    type: 'leveled',
    name: 'Preparation',
    description: 'Start with random buff',
    baseCost: 1500,
    level: 0,
    maxLevel: 5,
    costIncrease: 1, // Not used - flatCosts takes precedence
    flatCosts: [1500, 3000, 5000, 8000, 12000],
    apply: (stats) => {
      stats.preparationLevel += 1;
    },
  } as LeveledUpgrade,

  firstClickSafety: {
    type: 'unlockable',
    name: 'Monster Ward',
    description: 'First monster hit per run deals no damage',
    baseCost: 2000,
    unlocked: false,
    apply: (stats) => {
      stats.firstClickSafety = true;
    },
  } as UnlockableUpgrade,
};

/**
 * Create a fresh upgrade registry with all upgrades at initial state.
 * Used for initializing or resetting the meta store.
 */
export function createInitialUpgradeRegistry(): PermanentUpgradeRegistry {
  return Object.entries(PERMANENT_UPGRADES).reduce(
    (registry, [key, upgrade]) => {
      if (upgrade.type === 'leveled') {
        registry[key] = {
          ...upgrade,
          level: 0,
        };
      } else {
        registry[key] = {
          ...upgrade,
          unlocked: false,
        };
      }
      return registry;
    },
    {} as PermanentUpgradeRegistry
  );
}

/**
 * Get upgrade IDs as array for iteration.
 */
export const UPGRADE_IDS = Object.keys(PERMANENT_UPGRADES);
