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
  getRerollCost,
} from '@/data/shopItems';
import { useMetaStore } from './metaStore';
import { findCertainMoves } from '@/engine/solver';

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
          state.run.rerollCount = 0;
          state.run.showShop = false;
          // Only reset total damage on new run, not new level
          if (isNewRun) {
            state.run.totalDamageTaken = 0;
          }
          // Clear activeBuffs from previous level (single-level buffs expire)
          state.player.activeBuffs = {};
          // Reset shields to starting amount (shields are temporary, don't carry over)
          const startingShields = useMetaStore.getState().playerStats.startingShields;
          state.player.shields = startingShields;
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
          // Store revealScroll flag for solver-based reveal after grid init
          if (nextBuffs.revealScroll) {
            state.run.pendingRevealScroll = true;
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
              const row = currentGrid[r];
              if (!row) continue;
              for (let c = 0; c < row.length; c++) {
                const cell = row[c];
                if (cell && !cell.isRevealed && !cell.isMonster) {
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
              if (!tilePos) break;
              unrevealedSafe.splice(randomIndex, 1);

              // Reveal it
              const revealResult = engineRevealCell(currentGrid, tilePos);
              currentGrid = revealResult.grid;
              totalRevealed += revealResult.revealedPositions.length;
            }
          }

          // Apply solver-based reveal (from Reveal Scroll shop item)
          const pendingRevealScroll = run.pendingRevealScroll ?? false;
          if (pendingRevealScroll) {
            const solverResult = findCertainMoves(currentGrid);
            for (const pos of solverResult.safePositions) {
              const revealResult = engineRevealCell(currentGrid, pos);
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
            state.run.pendingRevealScroll = undefined; // Clear the solver reveal buff
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
          // Check first click safety upgrade
          const { firstClickSafety } = useMetaStore.getState().playerStats;
          const { firstMonsterHit } = get().run;

          if (firstClickSafety && !firstMonsterHit) {
            // First click safety triggers! Don't take damage, monster is revealed
            set((state) => {
              state.run.firstMonsterHit = true;
            });
            // Note: We don't return here, still check win condition below
          } else {
            // Normal damage
            get().takeDamage(1);
          }
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
        const { player, run } = get();
        const rerollCost = getRerollCost(run.rerollCount);

        // Check if can afford reroll
        if (player.gold < rerollCost) return false;

        // Deduct cost, increment counter, and regenerate
        const newItems = generateShopItems();
        set((state) => {
          state.player.gold -= rerollCost;
          state.run.rerollCount += 1;
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

      usePeekScroll: () => {
        const { grid, run, player } = get();

        // Validate: must have scrolls, be playing, and have a grid
        if (player.peekScrolls < 1) return false;
        if (run.phase !== 'playing') return false;
        if (!grid) return false;

        // Find all unrevealed, non-flagged, non-monster (safe) tiles
        const safeTiles: Array<{ row: number; col: number }> = [];
        for (let r = 0; r < grid.length; r++) {
          const gridRow = grid[r];
          if (!gridRow) continue;
          for (let c = 0; c < gridRow.length; c++) {
            const cell = gridRow[c];
            if (cell && !cell.isRevealed && !cell.isFlagged && !cell.isMonster) {
              safeTiles.push({ row: r, col: c });
            }
          }
        }

        // No safe tiles to peek
        if (safeTiles.length === 0) return false;

        // Pick a random safe tile
        const randomIndex = Math.floor(Math.random() * safeTiles.length);
        const target = safeTiles[randomIndex];
        if (!target) return false;

        // Reveal just this one tile (mark as revealed, don't cascade)
        set((state) => {
          state.player.peekScrolls -= 1;
          const cell = state.grid?.[target.row]?.[target.col];
          if (cell) {
            cell.isRevealed = true;
            state.run.revealedCount += 1;
            // Award gold for revealed tile (with goldMagnet/goldFindBonus)
            const goldFindBonus = useMetaStore.getState().playerStats.goldFindBonus;
            const goldMultiplier = state.player.activeBuffs.goldMagnet ? 2 : 1;
            state.player.gold += applyGoldFind(1 * goldMultiplier, goldFindBonus);
          }
        });

        // Check win condition
        const currentState = get();
        const { gridConfig } = currentState;
        const totalCells = gridConfig.rows * gridConfig.cols;
        const safeTotal = totalCells - gridConfig.monsterCount;
        if (currentState.run.revealedCount >= safeTotal && !currentState.gameOver) {
          get().setPhase('shopping');
        }

        return true;
      },

      autoSolveStep: () => {
        const initialState = get();
        if (!initialState.grid || initialState.run.phase !== 'playing' || initialState.gameOver) {
          return { revealed: 0, flagged: 0, stuck: true };
        }

        const result = findCertainMoves(initialState.grid);

        // Flag all certain monsters (get fresh state each time to avoid stale references)
        for (const pos of result.monsterPositions) {
          const currentGrid = get().grid;
          const cell = currentGrid?.[pos.row]?.[pos.col];
          if (cell && !cell.isFlagged && !cell.isRevealed) {
            get().toggleFlag(pos.row, pos.col);
          }
        }

        // Reveal all certain safe cells (get fresh state each time)
        for (const pos of result.safePositions) {
          const currentGrid = get().grid;
          const cell = currentGrid?.[pos.row]?.[pos.col];
          if (cell && !cell.isRevealed && !cell.isFlagged) {
            get().revealCell(pos.row, pos.col);
          }
        }

        // Check win condition after all reveals (in case flood fill already revealed final cells)
        const currentState = get();
        if (!currentState.gameOver && currentState.run.phase === 'playing') {
          const { gridConfig } = currentState;
          const totalCells = gridConfig.rows * gridConfig.cols;
          const safeTotal = totalCells - gridConfig.monsterCount;
          if (currentState.run.revealedCount >= safeTotal) {
            get().setPhase('shopping');
          }
        }

        return {
          revealed: result.safePositions.length,
          flagged: result.monsterPositions.length,
          stuck: result.stuck,
        };
      },
    })),
    { name: 'GameStore' }
  )
);
