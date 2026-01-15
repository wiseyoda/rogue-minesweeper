/**
 * Permanent upgrade definitions for meta-progression.
 * @module data/permanentUpgrades
 */

import type { LeveledUpgrade, UnlockableUpgrade, PermanentUpgradeRegistry } from '@/types';

/**
 * All available permanent upgrades.
 * These persist across runs and affect starting stats.
 */
export const PERMANENT_UPGRADES: PermanentUpgradeRegistry = {
  vitality: {
    type: 'leveled',
    name: 'Vitality',
    description: '+1 starting Max HP',
    baseCost: 100,
    level: 0,
    maxLevel: 3,
    costIncrease: 2,
    apply: (stats) => {
      stats.maxLives += 1;
    },
  } as LeveledUpgrade,

  fortune: {
    type: 'leveled',
    name: 'Fortune',
    description: '+10% gold find',
    baseCost: 150,
    level: 0,
    maxLevel: 5,
    costIncrease: 2,
    apply: (stats) => {
      stats.goldFindBonus += 0.10;
    },
  } as LeveledUpgrade,

  preparation: {
    type: 'leveled',
    name: 'Preparation',
    description: 'Start with random buff',
    baseCost: 200,
    level: 0,
    maxLevel: 3,
    costIncrease: 2,
    apply: (stats) => {
      stats.preparationLevel += 1;
    },
  } as LeveledUpgrade,

  resilience: {
    type: 'leveled',
    name: 'Resilience',
    description: '+1 starting shield',
    baseCost: 250,
    level: 0,
    maxLevel: 2,
    costIncrease: 2,
    apply: (stats) => {
      stats.startingShields += 1;
    },
  } as LeveledUpgrade,

  firstClickSafety: {
    type: 'unlockable',
    name: 'First Click Safety',
    description: 'First click never reveals monster',
    baseCost: 300,
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
