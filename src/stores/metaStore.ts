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
} from '@/types';

/**
 * Initial state for the meta store.
 */
const initialState = {
  stats: createDefaultGameStats(),
  playerStats: createDefaultPlayerStats(),
  upgrades: {},
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
          const upgrade = get().upgrades[id];
          if (!upgrade) return false;

          // Check if purchasable
          if (isLeveledUpgrade(upgrade)) {
            if (upgrade.level >= upgrade.maxLevel) return false;
          } else if (isUnlockableUpgrade(upgrade)) {
            if (upgrade.unlocked) return false;
          }

          // Apply upgrade
          set((state) => {
            const targetUpgrade = state.upgrades[id];
            if (!targetUpgrade) return;

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
            upgrades: {},
          }));
        },
      })),
      {
        name: 'dungeon-delver-meta',
        partialize: (state) => ({
          stats: state.stats,
          playerStats: state.playerStats,
          upgrades: state.upgrades,
        }),
      }
    ),
    { name: 'MetaStore' }
  )
);
