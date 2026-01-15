/**
 * Game store - current run state management.
 * @module stores/gameStore
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { GameStore } from './types';
import type { GamePhase, NextLevelBuffs } from '@/types';
import {
  createInitialPlayerState,
  createInitialRunState,
  createDefaultPlayerStats,
} from '@/types';
import { getFloorConfig } from '@/engine/difficulty';
import {
  initializeGrid,
  revealCell as engineRevealCell,
  toggleFlag as engineToggleFlag,
} from '@/engine';
import {
  generateShopItems,
  getShopItem,
  REROLL_COST,
} from '@/data/shopItems';
import { useMetaStore } from './metaStore';

/**
 * Available buffs for Preparation upgrade random selection.
 */
const PREPARATION_BUFF_POOL: (keyof NextLevelBuffs)[] = [
  'goldMagnet',
  'shields',
  'revealTiles',
];

/**
 * Apply random preparation buffs to player state.
 * @param count Number of random buffs to apply
 * @param player Player state to modify (mutable)
 */
function applyPreparationBuffs(count: number, player: { nextLevelBuffs: NextLevelBuffs }): void {
  for (let i = 0; i < count; i++) {
    const buffKey = PREPARATION_BUFF_POOL[Math.floor(Math.random() * PREPARATION_BUFF_POOL.length)];

    switch (buffKey) {
      case 'goldMagnet':
        player.nextLevelBuffs.goldMagnet = true;
        break;
      case 'shields':
        player.nextLevelBuffs.shields = (player.nextLevelBuffs.shields ?? 0) + 1;
        break;
      case 'revealTiles':
        player.nextLevelBuffs.revealTiles = (player.nextLevelBuffs.revealTiles ?? 0) + 3;
        break;
    }
  }
}

/**
 * Apply gold find bonus multiplier.
 * @param baseGold Base gold amount
 * @param bonus Gold find bonus (0.1 = +10%)
 * @returns Final gold amount (floored)
 */
function applyGoldFind(baseGold: number, bonus: number): number {
  return Math.floor(baseGold * (1 + bonus));
}

/**
 * Initial state for the game store.
 */
const initialState = {
  grid: null,
  gridConfig: getFloorConfig(1),
  player: createInitialPlayerState(createDefaultPlayerStats()),
  run: createInitialRunState(1),
  gameOver: false,
} as const;

/**
 * Game store hook.
 * Manages all state for the current game run.
 */
export const useGameStore = create<GameStore>()(
  devtools(
    immer((set, get) => ({
      // Initial state
      ...initialState,

      // Actions
      startNewRun: () => {
        // Get playerStats from metaStore (applies all purchased upgrades)
        const metaStore = useMetaStore.getState();
        metaStore.applyAllUpgrades();
        const playerStats = metaStore.playerStats;

        set((state) => {
          state.grid = null;
          state.gridConfig = getFloorConfig(1);
          state.player = createInitialPlayerState(playerStats);
          state.run = createInitialRunState(1);
          state.gameOver = false;

          // Apply startingShields from Resilience upgrade
          if (playerStats.startingShields > 0) {
            state.player.shields = playerStats.startingShields;
          }

          // Apply Preparation upgrade (random buffs)
          if (playerStats.preparationLevel > 0) {
            applyPreparationBuffs(playerStats.preparationLevel, state.player);
          }
        });
      },

      startLevel: (level: number) => {
        const floorConfig = getFloorConfig(level);
        const isNewRun = level === 1;
        const { player } = get();
        const nextBuffs = player.nextLevelBuffs;
        set((state) => {
          state.grid = null;
          state.gridConfig = floorConfig;
          state.run.level = level;
          state.run.phase = 'playing';
          state.run.revealedCount = 0;
          state.run.flagsPlaced = 0;
          state.run.damageTakenThisLevel = 0;
          state.run.isFirstClick = true;
          // Clear shop state
          state.run.shopItems = [];
          state.run.purchasedIds = [];
          state.run.showShop = false;
          // Only reset total damage on new run, not new level
          if (isNewRun) {
            state.run.totalDamageTaken = 0;
          }
          // Clear activeBuffs from previous level (single-level buffs expire)
          state.player.activeBuffs = {};
          // Apply nextLevelBuffs to activeBuffs (T030)
          if (nextBuffs.goldMagnet) {
            state.player.activeBuffs.goldMagnet = true;
          }
          if (nextBuffs.shields && nextBuffs.shields > 0) {
            state.player.shields += nextBuffs.shields;
          }
          // Store revealTiles count in run state to apply after grid init
          if (nextBuffs.revealTiles && nextBuffs.revealTiles > 0) {
            state.run.pendingRevealTiles = nextBuffs.revealTiles;
          }
          // Clear nextLevelBuffs after applying (T031)
          state.player.nextLevelBuffs = {};
        });
      },

      revealCell: (row: number, col: number) => {
        const { grid, run, gridConfig } = get();
        if (run.phase !== 'playing') return;

        const position = { row, col };

        // Handle first click - initialize grid with first-click safety
        if (run.isFirstClick) {
          const newGrid = initializeGrid(gridConfig, position);
          const result = engineRevealCell(newGrid, position);
          let currentGrid = result.grid;
          let totalRevealed = result.revealedPositions.length;

          // Apply pending reveal tiles buff (from Reveal Scroll)
          const pendingReveal = run.pendingRevealTiles ?? 0;
          if (pendingReveal > 0) {
            // Find all unrevealed safe (non-monster) tiles
            const unrevealedSafe: Array<{ row: number; col: number }> = [];
            for (let r = 0; r < currentGrid.length; r++) {
              for (let c = 0; c < currentGrid[r].length; c++) {
                const cell = currentGrid[r][c];
                if (!cell.isRevealed && !cell.isMonster) {
                  unrevealedSafe.push({ row: r, col: c });
                }
              }
            }

            // Randomly reveal up to pendingReveal tiles
            const toReveal = Math.min(pendingReveal, unrevealedSafe.length);
            for (let i = 0; i < toReveal; i++) {
              // Pick a random unrevealed safe tile
              const randomIndex = Math.floor(Math.random() * unrevealedSafe.length);
              const tilePos = unrevealedSafe[randomIndex];
              unrevealedSafe.splice(randomIndex, 1);

              // Reveal it
              const revealResult = engineRevealCell(currentGrid, tilePos);
              currentGrid = revealResult.grid;
              totalRevealed += revealResult.revealedPositions.length;
            }
          }

          // Get gold find bonus from metaStore
          const goldFindBonus = useMetaStore.getState().playerStats.goldFindBonus;

          set((state) => {
            state.grid = currentGrid;
            state.run.isFirstClick = false;
            state.run.revealedCount += totalRevealed;
            state.run.pendingRevealTiles = undefined; // Clear the buff
            // Award 1 gold per revealed safe tile (2x if goldMagnet active, +goldFindBonus%)
            const goldMultiplier = state.player.activeBuffs.goldMagnet ? 2 : 1;
            const baseGold = totalRevealed * goldMultiplier;
            state.player.gold += applyGoldFind(baseGold, goldFindBonus);
          });

          // Check win condition after all reveals
          const currentState = get();
          const finalGrid = currentState.grid;
          if (finalGrid) {
            const totalCells = gridConfig.rows * gridConfig.cols;
            const safeTotal = totalCells - gridConfig.monsterCount;
            if (currentState.run.revealedCount >= safeTotal) {
              get().setPhase('shopping');
            }
          }
          return;
        }

        // Normal reveal
        if (!grid) return;

        // Don't reveal flagged cells
        const cell = grid[row]?.[col];
        if (!cell || cell.isRevealed || cell.isFlagged) return;

        const result = engineRevealCell(grid, position);

        // Get gold find bonus from metaStore
        const goldFindBonus = useMetaStore.getState().playerStats.goldFindBonus;

        set((state) => {
          state.grid = result.grid;
          state.run.revealedCount += result.revealedPositions.length;
          // Award 1 gold per revealed safe tile (subtract 1 if monster was hit)
          // 2x gold if goldMagnet active, +goldFindBonus%
          const goldToAdd = result.hitMonster
            ? result.revealedPositions.length - 1
            : result.revealedPositions.length;
          if (goldToAdd > 0) {
            const goldMultiplier = state.player.activeBuffs.goldMagnet ? 2 : 1;
            const baseGold = goldToAdd * goldMultiplier;
            state.player.gold += applyGoldFind(baseGold, goldFindBonus);
          }
        });

        // Handle monster hit
        if (result.hitMonster) {
          get().takeDamage(1);
        }

        // Handle win condition (only if not game over)
        if (result.isWon && !get().gameOver) {
          get().setPhase('shopping');
        }
      },

      toggleFlag: (row: number, col: number) => {
        const { grid, run } = get();
        if (!grid || run.phase !== 'playing') return;

        const position = { row, col };
        const result = engineToggleFlag(grid, position);

        set((state) => {
          state.grid = result.grid;

          // Track flag count changes
          if (result.newState === 'flagged') {
            state.run.flagsPlaced += 1;
          } else if (result.newState === 'none') {
            // Went from question back to none
            // flagsPlaced stays same (flag was already removed when going to question)
          } else if (result.newState === 'question') {
            state.run.flagsPlaced -= 1;
          }
        });
      },

      takeDamage: (amount: number) => {
        set((state) => {
          let remaining = amount;

          // Track total damage for stats
          state.run.totalDamageTaken += amount;

          // Absorb with shields first
          if (state.player.shields > 0) {
            const absorbed = Math.min(state.player.shields, remaining);
            state.player.shields -= absorbed;
            remaining -= absorbed;
          }

          // Apply remaining damage to lives
          if (remaining > 0) {
            state.player.lives = Math.max(0, state.player.lives - remaining);
          }

          // Track damage this level (includes shielded damage for monster count)
          state.run.damageTakenThisLevel += amount;

          // Check game over
          if (state.player.lives === 0) {
            state.gameOver = true;
            state.run.phase = 'gameOver';
          }
        });
      },

      addGold: (amount: number) => {
        set((state) => {
          state.player.gold += amount;
        });
      },

      addShield: (count: number) => {
        set((state) => {
          state.player.shields += count;
        });
      },

      setPhase: (phase: GamePhase) => {
        // Award floor completion bonus when transitioning to shopping
        if (phase === 'shopping') {
          const { run } = get();
          const floorBonus = getFloorConfig(run.level).goldBonus;
          set((state) => {
            state.player.gold += floorBonus;
            state.run.phase = phase;
          });
        } else {
          set((state) => {
            state.run.phase = phase;
          });
        }
      },

      reset: () => {
        set(() => ({ ...initialState }));
      },

      generateShop: () => {
        const items = generateShopItems();
        set((state) => {
          state.run.shopItems = items;
          state.run.purchasedIds = [];
        });
      },

      purchaseItem: (itemId: string) => {
        const { player, run } = get();
        const item = getShopItem(itemId);

        // Validate purchase
        if (!item) return false;
        if (player.gold < item.cost) return false;
        if (run.purchasedIds.includes(itemId)) return false;

        // Apply purchase
        set((state) => {
          state.player.gold -= item.cost;
          state.run.purchasedIds.push(itemId);
          // Apply item effect directly to player state
          item.apply(state.player, createDefaultPlayerStats());
        });

        return true;
      },

      rerollShop: () => {
        const { player } = get();

        // Check if can afford reroll
        if (player.gold < REROLL_COST) return false;

        // Deduct cost and regenerate
        const newItems = generateShopItems();
        set((state) => {
          state.player.gold -= REROLL_COST;
          state.run.shopItems = newItems;
          // Keep purchasedIds - can't re-buy previously purchased items
        });

        return true;
      },

      setShowShop: (show: boolean) => {
        set((state) => {
          state.run.showShop = show;
        });
      },
    })),
    { name: 'GameStore' }
  )
);
