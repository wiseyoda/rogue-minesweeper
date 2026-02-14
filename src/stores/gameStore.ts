/**
 * Game store - current run state management.
 * @module stores/gameStore
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { GameStore } from './types';
import type { GamePhase, Grid, NextLevelBuffs, SynergyNotification } from '@/types';
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
import { countRune, getRandomRunes, getRune } from '@/data/runes';
import { getSynergy } from '@/data/synergies';
import { useMetaStore } from './metaStore';
import { findCertainMoves } from '@/engine/solver';
import {
  applyOnDamageRunes,
  applyOnFloorStartRunes,
  applyOnRevealRunes,
  applyHighlightRunes,
  applyAutoFlag,
  getPassiveRuneModifiers,
  checkUndyingHeal,
  calculateShopPrice,
  checkTreasureCache,
  clearHighlights,
  findSafestTile,
} from '@/engine/runes';
import {
  findActiveSynergyIds,
  getNewlyDiscoveredSynergyIds,
  getSynergyModifiers,
} from '@/engine/synergies';

/** Maximum number of rune slots a player can have equipped. */
const MAX_RUNE_SLOTS = 3;

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
 * Apply gold find bonus multiplier and rune modifiers.
 * @param baseGold Base gold amount
 * @param bonus Gold find bonus (0.1 = +10%)
 * @param equippedRunes Array of equipped rune IDs
 * @returns Final gold amount (floored)
 */
function applyGoldFind(baseGold: number, bonus: number, equippedRunes: string[] = []): number {
  const runeModifiers = getPassiveRuneModifiers(equippedRunes);
  return Math.floor(baseGold * (1 + bonus) * runeModifiers.goldMultiplier);
}

/**
 * Reveal random safe tiles and return updated grid + count.
 */
function revealRandomSafeTiles(
  grid: Grid,
  tilesToReveal: number
): { grid: Grid; revealedCount: number } {
  if (tilesToReveal <= 0) return { grid, revealedCount: 0 };

  let currentGrid = grid;
  let revealedCount = 0;
  const safeTiles: Array<{ row: number; col: number }> = [];

  for (let r = 0; r < currentGrid.length; r++) {
    const gridRow = currentGrid[r];
    if (!gridRow) continue;
    for (let c = 0; c < gridRow.length; c++) {
      const cell = gridRow[c];
      if (cell && !cell.isRevealed && !cell.isMonster && !cell.isFlagged) {
        safeTiles.push({ row: r, col: c });
      }
    }
  }

  const shuffled = [...safeTiles].sort(() => Math.random() - 0.5);
  const toReveal = shuffled.slice(0, Math.min(tilesToReveal, shuffled.length));

  for (const tilePos of toReveal) {
    const revealResult = engineRevealCell(currentGrid, tilePos);
    currentGrid = revealResult.grid;
    revealedCount += revealResult.revealedPositions.length;
  }

  return { grid: currentGrid, revealedCount };
}

/**
 * Force prophecy highlight on the safest tile.
 */
function applyGuaranteedProphecyHighlight(grid: Grid): Grid {
  const clearedGrid = clearHighlights(grid, 'prophecy');
  const safestPos = findSafestTile(clearedGrid);

  if (!safestPos) return clearedGrid;

  return clearedGrid.map((row, r) =>
    row.map((cell, c) => {
      if (r === safestPos.row && c === safestPos.col) {
        return { ...cell, highlightType: 'prophecy' };
      }
      return cell;
    })
  );
}

/**
 * Build a synergy discovery notification payload.
 */
function buildSynergyNotification(synergyId: string): SynergyNotification | undefined {
  const synergy = getSynergy(synergyId);
  if (!synergy) return undefined;

  return {
    id: synergy.id,
    name: synergy.name,
    description: synergy.description,
  };
}

/**
 * Compute active/discovered synergy state for a rune loadout.
 */
function computeSynergyState(equippedRunes: string[], discoveredSynergyIds: string[]): {
  activeSynergyIds: string[];
  discoveredSynergyIds: string[];
  synergyNotification?: SynergyNotification;
} {
  const activeSynergyIds = findActiveSynergyIds(equippedRunes);
  const newlyDiscoveredIds = getNewlyDiscoveredSynergyIds(activeSynergyIds, discoveredSynergyIds);
  const mergedDiscovered = newlyDiscoveredIds.length
    ? [...new Set([...discoveredSynergyIds, ...newlyDiscoveredIds])]
    : [...discoveredSynergyIds];

  return {
    activeSynergyIds,
    discoveredSynergyIds: mergedDiscovered,
    synergyNotification: newlyDiscoveredIds[0]
      ? buildSynergyNotification(newlyDiscoveredIds[0])
      : undefined,
  };
}

/**
 * Get combined rune + synergy modifiers for shop price calculations.
 */
function getEffectiveShopModifiers(equippedRunes: string[], activeSynergyIds: string[]) {
  const modifiers = getPassiveRuneModifiers(equippedRunes);
  const synergyModifiers = getSynergyModifiers(activeSynergyIds);
  modifiers.shopDiscount += synergyModifiers.extraShopDiscount;
  return modifiers;
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
        const { player, run } = get();
        const nextBuffs = player.nextLevelBuffs;
        const synergyState = computeSynergyState(player.equippedRunes, run.discoveredSynergyIds);
        const synergyModifiers = getSynergyModifiers(synergyState.activeSynergyIds);

        // Pre-initialize grid with safe center position
        const centerRow = Math.floor(floorConfig.rows / 2);
        const centerCol = Math.floor(floorConfig.cols / 2);
        let currentGrid = initializeGrid(floorConfig, { row: centerRow, col: centerCol });
        let totalRevealed = 0;

        // Apply onFloorStart rune effects immediately (Scout's Eye, Treasure Sense, Shield Bearer)
        let shieldsFromRunes = 0;
        if (player.equippedRunes.length > 0) {
          const floorStartResult = applyOnFloorStartRunes(currentGrid, player.equippedRunes);
          currentGrid = floorStartResult.grid;
          totalRevealed += floorStartResult.tilesRevealed;
          shieldsFromRunes = floorStartResult.shieldsGranted;
        }

        // Apply synergy floor-start reveal bonuses.
        if (synergyModifiers.extraFloorStartReveals > 0) {
          const revealResult = revealRandomSafeTiles(currentGrid, synergyModifiers.extraFloorStartReveals);
          currentGrid = revealResult.grid;
          totalRevealed += revealResult.revealedCount;
        }

        // Apply pending reveal tiles buff (from shop items)
        const pendingReveal = nextBuffs.revealTiles ?? 0;
        if (pendingReveal > 0) {
          const unrevealedSafe: Array<{ row: number; col: number }> = [];
          for (let r = 0; r < currentGrid.length; r++) {
            const gridRow = currentGrid[r];
            if (!gridRow) continue;
            for (let c = 0; c < gridRow.length; c++) {
              const cell = gridRow[c];
              if (cell && !cell.isRevealed && !cell.isMonster) {
                unrevealedSafe.push({ row: r, col: c });
              }
            }
          }
          const toReveal = Math.min(pendingReveal, unrevealedSafe.length);
          const shuffled = [...unrevealedSafe].sort(() => Math.random() - 0.5);
          for (let i = 0; i < toReveal; i++) {
            const tilePos = shuffled[i];
            if (!tilePos) break;
            const revealResult = engineRevealCell(currentGrid, tilePos);
            currentGrid = revealResult.grid;
            totalRevealed += revealResult.revealedPositions.length;
          }
        }

        // Apply solver-based reveal (from Reveal Scroll shop item)
        if (nextBuffs.revealScroll) {
          const solverResult = findCertainMoves(currentGrid);
          for (const pos of solverResult.safePositions) {
            const revealResult = engineRevealCell(currentGrid, pos);
            currentGrid = revealResult.grid;
            totalRevealed += revealResult.revealedPositions.length;
          }
        }

        // Apply highlight runes (Omniscience marks monsters, Prophecy marks safest tile)
        if (player.equippedRunes.length > 0) {
          currentGrid = applyHighlightRunes(currentGrid, player.equippedRunes);
        }

        // Seer synergy: force prophecy highlight when active.
        if (synergyModifiers.guaranteedProphecy) {
          currentGrid = applyGuaranteedProphecyHighlight(currentGrid);
        }

        set((state) => {
          state.grid = currentGrid;
          state.gridConfig = floorConfig;
          state.run.level = level;
          state.run.phase = 'playing';
          state.run.revealedCount = totalRevealed;
          state.run.flagsPlaced = 0;
          state.run.damageTakenThisLevel = 0;
          state.run.isFirstClick = false; // Grid is always pre-initialized now
          // Clear shop state
          state.run.shopItems = [];
          state.run.purchasedIds = [];
          state.run.rerollCount = 0;
          state.run.showShop = false;
          state.run.activeSynergyIds = synergyState.activeSynergyIds;
          state.run.discoveredSynergyIds = synergyState.discoveredSynergyIds;
          state.run.synergyNotification = synergyState.synergyNotification;
          // Only reset total damage on new run, not new level
          if (isNewRun) {
            state.run.totalDamageTaken = 0;
          }
          // Clear activeBuffs from previous level (single-level buffs expire)
          state.player.activeBuffs = {};
          // Reset shields to starting amount (shields are temporary, don't carry over)
          const startingShields = useMetaStore.getState().playerStats.startingShields;
          state.player.shields = startingShields;
          // Apply Shield Bearer rune shields
          if (shieldsFromRunes > 0) {
            state.player.shields += shieldsFromRunes;
          }
          // Apply synergy shield bonuses.
          if (synergyModifiers.extraFloorStartShields > 0) {
            state.player.shields += synergyModifiers.extraFloorStartShields;
          }
          // Apply nextLevelBuffs to activeBuffs (T030)
          if (nextBuffs.goldMagnet) {
            state.player.activeBuffs.goldMagnet = true;
          }
          if (nextBuffs.shields && nextBuffs.shields > 0) {
            state.player.shields += nextBuffs.shields;
          }
          // Clear nextLevelBuffs after applying (T031)
          state.player.nextLevelBuffs = {};
        });
      },

      revealCell: (row: number, col: number) => {
        const { grid, run, player } = get();
        if (run.phase !== 'playing') return;
        if (!grid) return;

        const position = { row, col };

        // Don't reveal flagged cells
        const cell = grid[row]?.[col];
        if (!cell || cell.isRevealed || cell.isFlagged) return;

        const result = engineRevealCell(grid, position);
        let currentGrid = result.grid;
        let totalRevealed = result.revealedPositions.length;

        // Apply onReveal rune effects (Oracle's Sight - chance for bonus reveal)
        if (!result.hitMonster && result.revealedPositions.length > 0) {
          const revealRuneResult = applyOnRevealRunes(currentGrid, player.equippedRunes, position);
          currentGrid = revealRuneResult.grid;
          totalRevealed += revealRuneResult.bonusTilesRevealed;
        }

        // Update highlight runes after reveal (Prophecy recalculates safest tile)
        if (player.equippedRunes.length > 0) {
          currentGrid = applyHighlightRunes(currentGrid, player.equippedRunes);
        }

        // Apply Swift Feet auto-flag if equipped
        const runeModifiers = getPassiveRuneModifiers(player.equippedRunes);
        let autoFlagged = 0;
        if (runeModifiers.autoFlag) {
          const autoFlagResult = applyAutoFlag(currentGrid);
          currentGrid = autoFlagResult.grid;
          autoFlagged = autoFlagResult.cellsFlagged;
        }

        // Get gold find bonus from metaStore
        const goldFindBonus = useMetaStore.getState().playerStats.goldFindBonus;
        const equippedRunesForGold = player.equippedRunes;

        // Check Undying rune heal condition
        const undyingResult = checkUndyingHeal(
          player.equippedRunes,
          player.undyingRevealCount,
          totalRevealed
        );

        set((state) => {
          state.grid = currentGrid;
          state.run.revealedCount += totalRevealed;
          state.run.flagsPlaced += autoFlagged;

          // Update Undying reveal count
          state.player.undyingRevealCount = undyingResult.newRevealCount;

          // Apply Undying heal if triggered (only if below maxLives)
          if (undyingResult.shouldHeal && state.player.lives < state.player.maxLives) {
            state.player.lives += 1;
          }

          // Award 1 gold per revealed safe tile (subtract 1 if monster was hit)
          // 2x gold if goldMagnet active, +goldFindBonus%, +rune modifiers
          // Lucky Coin: 10% chance per tile to double that tile's gold
          const tilesToAward = result.hitMonster
            ? result.revealedPositions.length - 1
            : totalRevealed;
          if (tilesToAward > 0) {
            const goldMagnetMultiplier = state.player.activeBuffs.goldMagnet ? 2 : 1;
            const luckyCount = countRune(equippedRunesForGold, 'lucky-coin');
            const luckyChance = 0.1 * luckyCount;

            // Calculate gold per tile with Lucky Coin check
            let totalGold = 0;
            for (let i = 0; i < tilesToAward; i++) {
              let tileGold = goldMagnetMultiplier;
              // Lucky Coin: 10% chance per rune to double this tile's gold
              if (luckyCount > 0 && Math.random() < luckyChance) {
                tileGold *= 2;
              }
              totalGold += tileGold;
            }

            state.player.gold += applyGoldFind(totalGold, goldFindBonus, equippedRunesForGold);
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
        const { player, run } = get();
        const synergyModifiers = getSynergyModifiers(run.activeSynergyIds);

        // Apply onDamage rune effects
        const isFirstDamageThisFloor = run.damageTakenThisLevel === 0;
        const secondChanceAvailable = !player.secondChanceUsed;
        const damageResult = applyOnDamageRunes(
          amount,
          player.equippedRunes,
          isFirstDamageThisFloor,
          secondChanceAvailable,
          player.lives
        );

        set((state) => {
          let remaining = damageResult.finalDamage;

          // Track total damage for stats (use original amount for analytics)
          state.run.totalDamageTaken += amount;

          // Track if second chance was used
          if (damageResult.secondChanceUsed) {
            state.player.secondChanceUsed = true;
          }

          // If damage was fully negated by runes, skip further processing
          if (remaining <= 0) {
            if (damageResult.secondChanceUsed && synergyModifiers.extraSecondChanceHp > 0) {
              state.player.lives = Math.min(
                state.player.maxLives,
                state.player.lives + synergyModifiers.extraSecondChanceHp
              );
            }
            state.run.damageTakenThisLevel += amount;
            return;
          }

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

          // Immortal synergy: grant additional HP when Second Chance triggers.
          if (damageResult.secondChanceUsed && synergyModifiers.extraSecondChanceHp > 0) {
            state.player.lives = Math.min(
              state.player.maxLives,
              state.player.lives + synergyModifiers.extraSecondChanceHp
            );
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
          const { run, player } = get();
          const baseFloorBonus = getFloorConfig(run.level).goldBonus;
          const synergyModifiers = getSynergyModifiers(run.activeSynergyIds);
          const floorBonus = Math.floor(baseFloorBonus * synergyModifiers.floorBonusMultiplier);

          // Treasure Hunter: 20% chance per rune for bonus gold cache
          const treasureResult = checkTreasureCache(player.equippedRunes, baseFloorBonus);

          set((state) => {
            state.player.gold += floorBonus;
            // Add treasure cache bonus if triggered
            if (treasureResult.triggered) {
              state.player.gold += treasureResult.goldAmount;
              // TODO: Display notification "Treasure Cache! +Xg"
            }
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
        const { player } = get();
        // Generate rune rewards, excluding already equipped
        const runeRewards = getRandomRunes(3, player.equippedRunes);

        set((state) => {
          state.run.shopItems = items;
          state.run.purchasedIds = [];
          state.run.availableRuneRewards = runeRewards.map((r) => r.id);
          state.run.runeSelected = false;
        });
      },

      purchaseItem: (itemId: string) => {
        const { player, run } = get();
        const item = getShopItem(itemId);

        // Validate purchase
        if (!item) return false;
        if (run.purchasedIds.includes(itemId)) return false;

        // Calculate price with rune + synergy modifiers.
        const modifiers = getEffectiveShopModifiers(player.equippedRunes, run.activeSynergyIds);
        const finalPrice = calculateShopPrice(item.cost, modifiers);

        if (player.gold < finalPrice) return false;

        // Apply purchase
        set((state) => {
          state.player.gold -= finalPrice;
          state.run.purchasedIds.push(itemId);
          // Apply item effect directly to player state
          item.apply(state.player, createDefaultPlayerStats());
        });

        return true;
      },

      rerollShop: () => {
        const { player, run } = get();
        const baseRerollCost = getRerollCost(run.rerollCount);

        // Calculate price with rune + synergy modifiers.
        const modifiers = getEffectiveShopModifiers(player.equippedRunes, run.activeSynergyIds);
        const finalRerollCost = calculateShopPrice(baseRerollCost, modifiers);

        // Check if can afford reroll
        if (player.gold < finalRerollCost) return false;

        // Deduct cost, increment counter, and regenerate
        const newItems = generateShopItems();
        set((state) => {
          state.player.gold -= finalRerollCost;
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
        const equippedRunesForGold = player.equippedRunes;
        set((state) => {
          state.player.peekScrolls -= 1;
          const cell = state.grid?.[target.row]?.[target.col];
          if (cell) {
            cell.isRevealed = true;
            state.run.revealedCount += 1;
            // Award gold for revealed tile (with goldMagnet/goldFindBonus/rune modifiers)
            // Lucky Coin: 10% chance per rune to double gold
            const goldFindBonus = useMetaStore.getState().playerStats.goldFindBonus;
            let tileGold = state.player.activeBuffs.goldMagnet ? 2 : 1;
            const luckyCount = countRune(equippedRunesForGold, 'lucky-coin');
            if (luckyCount > 0 && Math.random() < 0.1 * luckyCount) {
              tileGold *= 2;
            }
            state.player.gold += applyGoldFind(tileGold, goldFindBonus, equippedRunesForGold);
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

      equipRune: (runeId: string) => {
        const { player } = get();

        // Validate rune exists
        const rune = getRune(runeId);
        if (!rune) return false;

        // Check if already at max slots
        if (player.equippedRunes.length >= MAX_RUNE_SLOTS) return false;

        // Check if already equipped (for non-stackable runes)
        if (!rune.stackable && player.equippedRunes.includes(runeId)) return false;

        set((state) => {
          state.player.equippedRunes.push(runeId);

          // Hardy rune: increase maxLives and current lives
          if (runeId === 'hardy') {
            state.player.maxLives += 1;
            state.player.lives += 1;
          }

          const synergyState = computeSynergyState(
            state.player.equippedRunes,
            state.run.discoveredSynergyIds
          );
          state.run.activeSynergyIds = synergyState.activeSynergyIds;
          state.run.discoveredSynergyIds = synergyState.discoveredSynergyIds;
          state.run.synergyNotification = synergyState.synergyNotification;
        });

        return true;
      },

      replaceRune: (slotIndex: number, runeId: string) => {
        const { player } = get();

        // Validate slot index
        if (slotIndex < 0 || slotIndex >= player.equippedRunes.length) return false;

        // Validate rune exists
        const rune = getRune(runeId);
        if (!rune) return false;

        // Check if already equipped (for non-stackable runes)
        if (!rune.stackable && player.equippedRunes.includes(runeId)) return false;

        // Track the old rune being replaced (for Hardy unequip handling)
        const oldRuneId = player.equippedRunes[slotIndex];

        set((state) => {
          // Handle Hardy unequip - reduce maxLives and clamp current lives
          if (oldRuneId === 'hardy') {
            state.player.maxLives = Math.max(1, state.player.maxLives - 1);
            state.player.lives = Math.min(state.player.lives, state.player.maxLives);
          }

          state.player.equippedRunes[slotIndex] = runeId;

          // Handle Hardy equip via replacement
          if (runeId === 'hardy') {
            state.player.maxLives += 1;
            state.player.lives += 1;
          }

          const synergyState = computeSynergyState(
            state.player.equippedRunes,
            state.run.discoveredSynergyIds
          );
          state.run.activeSynergyIds = synergyState.activeSynergyIds;
          state.run.discoveredSynergyIds = synergyState.discoveredSynergyIds;
          state.run.synergyNotification = synergyState.synergyNotification;
        });

        return true;
      },

      generateRuneRewards: () => {
        const { player } = get();
        // Exclude already equipped runes (unless stackable)
        const excludeIds = player.equippedRunes;
        const rewards = getRandomRunes(3, excludeIds);

        set((state) => {
          state.run.availableRuneRewards = rewards.map((r) => r.id);
          state.run.runeSelected = false;
        });
      },

      selectRuneReward: (runeId: string) => {
        const { run, player } = get();

        // Can only select once per shop visit
        if (run.runeSelected) return false;

        // Validate rune is in available rewards
        if (!run.availableRuneRewards.includes(runeId)) return false;

        // Get rune cost and check affordability
        const rune = getRune(runeId);
        if (!rune) return false;

        // Calculate price with rune + synergy modifiers.
        const modifiers = getEffectiveShopModifiers(player.equippedRunes, run.activeSynergyIds);
        const finalRuneCost = calculateShopPrice(rune.cost, modifiers);
        const finalRemovalFee = calculateShopPrice(Math.floor(rune.cost / 2), modifiers);

        // Handle full rune slots - initiate replacement flow
        if (player.equippedRunes.length >= MAX_RUNE_SLOTS) {
          const totalCost = finalRuneCost + finalRemovalFee;

          if (player.gold < totalCost) return false;

          // Set pending replacement - UI will show slot selection
          set((state) => {
            state.run.pendingRuneReplacement = runeId;
          });
          return false; // Signal that slot selection is needed
        }

        // Normal purchase (not at max capacity)
        if (player.gold < finalRuneCost) return false;

        // Deduct gold and equip the rune
        set((state) => {
          state.player.gold -= finalRuneCost;
        });

        const equipped = get().equipRune(runeId);
        if (equipped) {
          set((state) => {
            state.run.runeSelected = true;
          });
        } else {
          // Refund if equip failed
          set((state) => {
            state.player.gold += finalRuneCost;
          });
        }

        return equipped;
      },

      clearRuneSelection: () => {
        set((state) => {
          state.run.runeSelected = false;
          state.run.pendingRuneReplacement = undefined;
        });
      },

      confirmRuneReplacement: (slotIndex: number) => {
        const { run, player } = get();
        const pendingRuneId = run.pendingRuneReplacement;

        if (!pendingRuneId) return false;
        if (slotIndex < 0 || slotIndex >= player.equippedRunes.length) return false;

        const rune = getRune(pendingRuneId);
        if (!rune) return false;

        // Calculate price with rune + synergy modifiers.
        const modifiers = getEffectiveShopModifiers(player.equippedRunes, run.activeSynergyIds);
        const finalRuneCost = calculateShopPrice(rune.cost, modifiers);
        const finalRemovalFee = calculateShopPrice(Math.floor(rune.cost / 2), modifiers);
        const totalCost = finalRuneCost + finalRemovalFee;

        if (player.gold < totalCost) return false;

        // Perform the replacement
        set((state) => {
          const oldRuneId = state.player.equippedRunes[slotIndex];
          state.player.gold -= totalCost;

          // Handle Hardy unequip when replacing.
          if (oldRuneId === 'hardy') {
            state.player.maxLives = Math.max(1, state.player.maxLives - 1);
            state.player.lives = Math.min(state.player.lives, state.player.maxLives);
          }

          state.player.equippedRunes[slotIndex] = pendingRuneId;

          // Handle Hardy equip via replacement.
          if (pendingRuneId === 'hardy') {
            state.player.maxLives += 1;
            state.player.lives += 1;
          }

          state.run.runeSelected = true;
          state.run.pendingRuneReplacement = undefined;

          const synergyState = computeSynergyState(
            state.player.equippedRunes,
            state.run.discoveredSynergyIds
          );
          state.run.activeSynergyIds = synergyState.activeSynergyIds;
          state.run.discoveredSynergyIds = synergyState.discoveredSynergyIds;
          state.run.synergyNotification = synergyState.synergyNotification;
        });

        return true;
      },

      cancelRuneReplacement: () => {
        set((state) => {
          state.run.pendingRuneReplacement = undefined;
        });
      },

      getRuneRemovalFee: (runeId: string) => {
        const { player, run } = get();
        const rune = getRune(runeId);
        if (!rune) return 0;
        const modifiers = getEffectiveShopModifiers(player.equippedRunes, run.activeSynergyIds);
        return calculateShopPrice(Math.floor(rune.cost / 2), modifiers);
      },

      dismissSynergyNotification: () => {
        set((state) => {
          state.run.synergyNotification = undefined;
        });
      },
    })),
    { name: 'GameStore' }
  )
);
