/**
 * Game store - current run state management.
 * @module stores/gameStore
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { GameStore } from './types';
import type { GamePhase } from '@/types';
import {
  createInitialPlayerState,
  createInitialRunState,
  createDefaultPlayerStats,
  calculateLevelGridConfig,
} from '@/types';
import {
  initializeGrid,
  revealCell as engineRevealCell,
  toggleFlag as engineToggleFlag,
} from '@/engine';

/**
 * Initial state for the game store.
 */
const initialState = {
  grid: null,
  gridConfig: calculateLevelGridConfig(1),
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
        // In future, get playerStats from metaStore
        const playerStats = createDefaultPlayerStats();
        set((state) => {
          state.grid = null;
          state.gridConfig = calculateLevelGridConfig(1);
          state.player = createInitialPlayerState(playerStats);
          state.run = createInitialRunState(1);
          state.gameOver = false;
        });
      },

      startLevel: (level: number) => {
        const gridConfig = calculateLevelGridConfig(level);
        set((state) => {
          state.grid = null;
          state.gridConfig = gridConfig;
          state.run.level = level;
          state.run.phase = 'playing';
          state.run.revealedCount = 0;
          state.run.flagsPlaced = 0;
          state.run.damageTakenThisLevel = false;
          state.run.isFirstClick = true;
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

          set((state) => {
            state.grid = result.grid;
            state.run.isFirstClick = false;
            state.run.revealedCount += result.revealedPositions.length;
          });

          if (result.isWon) {
            get().setPhase('shopping');
          }
          return;
        }

        // Normal reveal
        if (!grid) return;

        // Don't reveal flagged cells
        const cell = grid[row]?.[col];
        if (!cell || cell.isRevealed || cell.isFlagged) return;

        const result = engineRevealCell(grid, position);

        set((state) => {
          state.grid = result.grid;
          state.run.revealedCount += result.revealedPositions.length;
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

          // Absorb with shields first
          if (state.player.shields > 0) {
            const absorbed = Math.min(state.player.shields, remaining);
            state.player.shields -= absorbed;
            remaining -= absorbed;
          }

          // Apply remaining damage to lives
          if (remaining > 0) {
            state.player.lives = Math.max(0, state.player.lives - remaining);
            state.run.damageTakenThisLevel = true;
          }

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
        set((state) => {
          state.run.phase = phase;
        });
      },

      reset: () => {
        set(() => ({ ...initialState }));
      },
    })),
    { name: 'GameStore' }
  )
);
