/**
 * Tests for first click safety upgrade logic.
 * @module stores/__tests__/gameStore.firstClickSafety.test
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../gameStore';
import { useMetaStore } from '../metaStore';
import { createInitialUpgradeRegistry } from '@/data/permanentUpgrades';
import type { UnlockableUpgrade } from '@/types';

/**
 * Helper to set up firstClickSafety upgrade as unlocked.
 */
function enableFirstClickSafetyUpgrade(): void {
  const upgrades = createInitialUpgradeRegistry();
  const firstClickSafety = upgrades.firstClickSafety as UnlockableUpgrade;
  firstClickSafety.unlocked = true;

  useMetaStore.setState((state) => ({
    ...state,
    upgrades,
  }));
  useMetaStore.getState().applyAllUpgrades();
}

/**
 * Reveal the pre-initialized safe center tile.
 */
function revealSafeCenterTile(): void {
  const { gridConfig } = useGameStore.getState();
  const centerRow = Math.floor(gridConfig.rows / 2);
  const centerCol = Math.floor(gridConfig.cols / 2);
  useGameStore.getState().revealCell(centerRow, centerCol);
}

describe('gameStore first click safety', () => {
  beforeEach(() => {
    // Reset both stores before each test
    useGameStore.getState().reset();
    localStorage.clear();

    // Reset metaStore to default state with empty upgrades
    useMetaStore.setState({
      stats: {
        highestLevelOverall: 1,
        maxGoldRun: 0,
        totalRuns: 0,
        totalDeaths: 0,
      },
      playerStats: {
        maxLives: 3,
        startingGold: 0,
        firstClickSafety: false,
        goldFindBonus: 0,
        startingShields: 0,
        preparationLevel: 0,
      },
      upgrades: createInitialUpgradeRegistry(),
      metaGold: 0,
    });
  });

  describe('firstMonsterHit tracking', () => {
    it('should initialize firstMonsterHit to false in new run', () => {
      useGameStore.getState().startNewRun();
      const state = useGameStore.getState();
      expect(state.run.firstMonsterHit).toBe(false);
    });

    it('should initialize firstMonsterHit to false in startLevel', () => {
      useGameStore.getState().startNewRun();
      useGameStore.getState().startLevel(2);
      const state = useGameStore.getState();
      // firstMonsterHit is only reset on new run, not new level
      expect(state.run.firstMonsterHit).toBe(false);
    });
  });

  describe('safety trigger behavior', () => {
    it('should NOT trigger safety when upgrade is not purchased', () => {
      // Verify no firstClickSafety upgrade
      expect(useMetaStore.getState().playerStats.firstClickSafety).toBe(false);

      useGameStore.getState().startNewRun();
      useGameStore.getState().startLevel(1);

      // Initialize grid with first click
      revealSafeCenterTile();

      const livesBefore = useGameStore.getState().player.lives;

      // Manually trigger takeDamage to simulate monster hit
      useGameStore.getState().takeDamage(1);

      const livesAfter = useGameStore.getState().player.lives;
      expect(livesAfter).toBe(livesBefore - 1);
    });

    it('should have firstClickSafety enabled when upgrade purchased', () => {
      // Enable firstClickSafety upgrade
      enableFirstClickSafetyUpgrade();

      // Verify upgrade is applied
      expect(useMetaStore.getState().playerStats.firstClickSafety).toBe(true);
    });

    it('should set firstMonsterHit to true and preserve lives after safety triggers', () => {
      // Enable firstClickSafety upgrade
      enableFirstClickSafetyUpgrade();

      useGameStore.getState().startNewRun();
      useGameStore.getState().startLevel(1);

      // Initialize grid
      revealSafeCenterTile();

      const grid = useGameStore.getState().grid;
      if (!grid) throw new Error('Grid should be initialized');

      // Find a monster cell that is NOT revealed
      let monsterRow = -1;
      let monsterCol = -1;
      for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
          const cell = grid[r][c];
          if (cell.isMonster && !cell.isRevealed) {
            monsterRow = r;
            monsterCol = c;
            break;
          }
        }
        if (monsterRow >= 0) break;
      }

      if (monsterRow >= 0) {
        const livesBefore = useGameStore.getState().player.lives;

        // Click on monster - should trigger first click safety
        useGameStore.getState().revealCell(monsterRow, monsterCol);

        const state = useGameStore.getState();
        // Lives should NOT be reduced (safety triggered)
        expect(state.player.lives).toBe(livesBefore);
        // Safety should now be used
        expect(state.run.firstMonsterHit).toBe(true);
        // Cell should be revealed (showing the monster)
        expect(state.grid?.[monsterRow][monsterCol].isRevealed).toBe(true);
        expect(state.grid?.[monsterRow][monsterCol].isMonster).toBe(true);
      } else {
        // No monster found to test - this is a rare edge case
        // Mark test as skipped without failure
        console.log('No unrevealed monster found in grid - skipping assertion');
      }
    });

    it('should take damage on second monster hit after safety used', () => {
      // Enable firstClickSafety upgrade
      enableFirstClickSafetyUpgrade();

      useGameStore.getState().startNewRun();
      useGameStore.getState().startLevel(1);

      // Initialize grid
      revealSafeCenterTile();

      const grid = useGameStore.getState().grid;
      if (!grid) throw new Error('Grid should be initialized');

      // Find two monster cells
      const monsters: Array<{ row: number; col: number }> = [];
      for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
          const cell = grid[r][c];
          if (cell.isMonster && !cell.isRevealed) {
            monsters.push({ row: r, col: c });
            if (monsters.length >= 2) break;
          }
        }
        if (monsters.length >= 2) break;
      }

      if (monsters.length >= 2) {
        // First monster hit - safety triggers
        useGameStore.getState().revealCell(monsters[0].row, monsters[0].col);
        expect(useGameStore.getState().run.firstMonsterHit).toBe(true);
        const livesAfterFirst = useGameStore.getState().player.lives;

        // Second monster hit - should take damage
        useGameStore.getState().revealCell(monsters[1].row, monsters[1].col);
        const livesAfterSecond = useGameStore.getState().player.lives;

        // Lives should be reduced on second hit
        expect(livesAfterSecond).toBeLessThan(livesAfterFirst);
      } else {
        // Less than 2 monsters found - skip
        console.log('Less than 2 unrevealed monsters found - skipping assertion');
      }
    });

    it('should reset safety between runs', () => {
      // Enable firstClickSafety upgrade
      enableFirstClickSafetyUpgrade();

      // First run
      useGameStore.getState().startNewRun();

      // Simulate using safety
      useGameStore.setState((state) => ({
        ...state,
        run: { ...state.run, firstMonsterHit: true },
      }));
      expect(useGameStore.getState().run.firstMonsterHit).toBe(true);

      // Start new run - safety should reset
      useGameStore.getState().startNewRun();
      expect(useGameStore.getState().run.firstMonsterHit).toBe(false);
    });
  });
});
