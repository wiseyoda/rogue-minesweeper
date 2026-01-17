/**
 * Meta store - persistent progression state management.
 * @module stores/metaStore
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { MetaStore } from './types';
import {
  createDefaultGameStats,
  createDefaultPlayerStats,
  isLeveledUpgrade,
  isUnlockableUpgrade,
  getUpgradeCost,
} from '@/types';
import { createInitialUpgradeRegistry } from '@/data/permanentUpgrades';

/**
 * Initial state for the meta store.
 */
const initialState = {
  stats: createDefaultGameStats(),
  playerStats: createDefaultPlayerStats(),
  upgrades: createInitialUpgradeRegistry(),
  metaGold: 0,
} as const;

/**
 * Meta store hook.
 * Manages persistent progression data across runs.
 * Uses localStorage for persistence.
 */
export const useMetaStore = create<MetaStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        ...initialState,

        // Actions
        recordRunEnd: (level: number, gold: number) => {
          set((state) => {
            // Update highest level
            if (level > state.stats.highestLevelOverall) {
              state.stats.highestLevelOverall = level;
            }

            // Update max gold
            if (gold > state.stats.maxGoldRun) {
              state.stats.maxGoldRun = gold;
            }

            // Increment total runs
            state.stats.totalRuns = (state.stats.totalRuns ?? 0) + 1;
          });
        },

        purchaseUpgrade: (id: string): boolean => {
          const { upgrades, metaGold } = get();
          const upgrade = upgrades[id];
          if (!upgrade) return false;

          // Check if purchasable (level/unlock status)
          if (isLeveledUpgrade(upgrade)) {
            if (upgrade.level >= upgrade.maxLevel) return false;
          } else if (isUnlockableUpgrade(upgrade)) {
            if (upgrade.unlocked) return false;
          }

          // Check gold sufficiency
          const cost = getUpgradeCost(upgrade);
          if (metaGold < cost) return false;

          // Apply upgrade and deduct gold
          set((state) => {
            const targetUpgrade = state.upgrades[id];
            if (!targetUpgrade) return;

            // Deduct gold
            state.metaGold -= cost;

            if (isLeveledUpgrade(targetUpgrade)) {
              targetUpgrade.level += 1;
            } else if (isUnlockableUpgrade(targetUpgrade)) {
              targetUpgrade.unlocked = true;
            }
          });

          return true;
        },

        applyAllUpgrades: () => {
          set((state) => {
            // Reset to defaults first
            const freshStats = createDefaultPlayerStats();
            state.playerStats = freshStats;

            // Apply each purchased upgrade
            Object.values(state.upgrades).forEach((upgrade) => {
              const shouldApply =
                (isLeveledUpgrade(upgrade) && upgrade.level > 0) ||
                (isUnlockableUpgrade(upgrade) && upgrade.unlocked);

              if (shouldApply) {
                // Apply upgrade effect - for leveled upgrades, apply once per level
                if (isLeveledUpgrade(upgrade)) {
                  for (let i = 0; i < upgrade.level; i++) {
                    upgrade.apply(state.playerStats);
                  }
                } else {
                  upgrade.apply(state.playerStats);
                }
              }
            });
          });
        },

        reset: () => {
          set(() => ({
            stats: createDefaultGameStats(),
            playerStats: createDefaultPlayerStats(),
            upgrades: createInitialUpgradeRegistry(),
            metaGold: 0,
          }));
        },

        addMetaGold: (amount: number) => {
          set((state) => {
            state.metaGold += amount;
          });
        },

        initializeUpgrades: () => {
          set((state) => {
            // Merge fresh definitions with existing upgrades to preserve purchased state
            // but update name, description, costs, etc. from source of truth
            const fresh = createInitialUpgradeRegistry();
            Object.keys(fresh).forEach((key) => {
              const freshUpgrade = fresh[key];
              const existingUpgrade = state.upgrades[key];

              if (!freshUpgrade) return;

              if (!existingUpgrade) {
                // New upgrade - add it
                state.upgrades[key] = freshUpgrade;
              } else {
                // Existing upgrade - update definition but preserve progress
                if (isLeveledUpgrade(existingUpgrade) && isLeveledUpgrade(freshUpgrade)) {
                  // Keep the level, update everything else
                  const preservedLevel = existingUpgrade.level;
                  state.upgrades[key] = {
                    ...freshUpgrade,
                    level: Math.min(preservedLevel, freshUpgrade.maxLevel),
                  };
                } else if (isUnlockableUpgrade(existingUpgrade) && isUnlockableUpgrade(freshUpgrade)) {
                  // Keep the unlocked status, update everything else
                  state.upgrades[key] = {
                    ...freshUpgrade,
                    unlocked: existingUpgrade.unlocked,
                  };
                } else {
                  // Type changed - use fresh (shouldn't happen in practice)
                  state.upgrades[key] = freshUpgrade;
                }
              }
            });

            // Remove any upgrades that no longer exist in definitions
            Object.keys(state.upgrades).forEach((key) => {
              if (!fresh[key]) {
                delete state.upgrades[key];
              }
            });
          });
        },
      })),
      {
        name: 'dungeon-delver-meta',
        partialize: (state) => ({
          stats: state.stats,
          playerStats: state.playerStats,
          upgrades: state.upgrades,
          metaGold: state.metaGold,
        }),
      }
    ),
    { name: 'MetaStore' }
  )
);
