/**
 * Tests for gameStore.
 * @module stores/__tests__/gameStore.test
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../gameStore';

describe('gameStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useGameStore.getState().reset();
  });

  describe('initial state', () => {
    it('should have null grid initially', () => {
      const state = useGameStore.getState();
      expect(state.grid).toBeNull();
    });

    it('should have default player values', () => {
      const state = useGameStore.getState();
      expect(state.player.lives).toBeGreaterThan(0);
      expect(state.player.gold).toBe(0);
      expect(state.player.shields).toBe(0);
    });

    it('should have gameOver false initially', () => {
      const state = useGameStore.getState();
      expect(state.gameOver).toBe(false);
    });
  });

  describe('startNewRun', () => {
    it('should reset all state to initial values', () => {
      // Modify state first
      useGameStore.setState({ gameOver: true });
      useGameStore.getState().addGold(100);

      // Start new run
      useGameStore.getState().startNewRun();

      const state = useGameStore.getState();
      expect(state.gameOver).toBe(false);
      expect(state.player.gold).toBe(0);
      expect(state.grid).toBeNull();
      expect(state.run.level).toBe(1);
    });
  });

  describe('startLevel', () => {
    it('should set level and reset level-specific state', () => {
      useGameStore.getState().startLevel(3);

      const state = useGameStore.getState();
      expect(state.run.level).toBe(3);
      expect(state.run.phase).toBe('playing');
      expect(state.run.revealedCount).toBeGreaterThanOrEqual(0); // May have initial reveals from runes
      expect(state.run.flagsPlaced).toBe(0);
      // Grid is pre-initialized now, so isFirstClick is false after startLevel
      expect(state.run.isFirstClick).toBe(false);
    });

    it('should update grid config for the level', () => {
      useGameStore.getState().startLevel(5);

      const state = useGameStore.getState();
      // Grid config should be calculated for level 5
      expect(state.gridConfig.rows).toBeGreaterThan(8);
      expect(state.gridConfig.cols).toBeGreaterThan(8);
    });

    it('should activate fortified-deal synergy and apply extra floor-start shield', () => {
      useGameStore.setState((state) => {
        state.player.equippedRunes = ['shield-bearer', 'bargain-hunter'];
      });

      useGameStore.getState().startLevel(1);

      const state = useGameStore.getState();
      expect(state.run.activeSynergyIds).toContain('fortified-deal');
      expect(state.player.shields).toBeGreaterThanOrEqual(2);
    });

    it('should only notify on first synergy discovery per run', () => {
      useGameStore.setState((state) => {
        state.player.equippedRunes = ['lucky-coin', 'treasure-hunter'];
      });

      useGameStore.getState().startLevel(1);
      expect(useGameStore.getState().run.synergyNotification?.id).toBe('greedy');
      expect(useGameStore.getState().run.discoveredSynergyIds).toContain('greedy');

      useGameStore.getState().dismissSynergyNotification();
      useGameStore.getState().startLevel(2);

      expect(useGameStore.getState().run.discoveredSynergyIds).toContain('greedy');
      expect(useGameStore.getState().run.synergyNotification).toBeUndefined();
    });
  });

  describe('revealCell', () => {
    it('should initialize grid on first click', () => {
      useGameStore.getState().startLevel(1);

      // First click
      useGameStore.getState().revealCell(0, 0);

      const state = useGameStore.getState();
      expect(state.grid).not.toBeNull();
      expect(state.run.isFirstClick).toBe(false);
      expect(state.run.revealedCount).toBeGreaterThan(0);
    });

    it('should not reveal when not in playing phase', () => {
      useGameStore.getState().startLevel(1);
      useGameStore.getState().revealCell(0, 0); // Initialize grid
      useGameStore.getState().setPhase('shopping');

      const revealedBefore = useGameStore.getState().run.revealedCount;
      useGameStore.getState().revealCell(1, 1);

      expect(useGameStore.getState().run.revealedCount).toBe(revealedBefore);
    });
  });

  describe('toggleFlag', () => {
    it('should toggle flag state', () => {
      useGameStore.getState().startLevel(1);
      useGameStore.getState().revealCell(0, 0); // Initialize grid

      const grid = useGameStore.getState().grid;
      if (!grid) throw new Error('Grid should be initialized');

      // Find an unrevealed cell
      let targetRow = -1;
      let targetCol = -1;
      for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
          if (!grid[r][c].isRevealed) {
            targetRow = r;
            targetCol = c;
            break;
          }
        }
        if (targetRow >= 0) break;
      }

      if (targetRow >= 0) {
        useGameStore.getState().toggleFlag(targetRow, targetCol);
        const newGrid = useGameStore.getState().grid;
        expect(newGrid?.[targetRow][targetCol].isFlagged).toBe(true);
      }
    });

    it('should not toggle flag when not in playing phase', () => {
      useGameStore.getState().startLevel(1);
      useGameStore.getState().setPhase('shopping');

      const flagsBefore = useGameStore.getState().run.flagsPlaced;
      useGameStore.getState().toggleFlag(0, 0);

      expect(useGameStore.getState().run.flagsPlaced).toBe(flagsBefore);
    });
  });

  describe('takeDamage', () => {
    it('should absorb damage with shields first', () => {
      useGameStore.getState().addShield(2);
      const livesBefore = useGameStore.getState().player.lives;

      useGameStore.getState().takeDamage(1);

      const state = useGameStore.getState();
      expect(state.player.shields).toBe(1);
      expect(state.player.lives).toBe(livesBefore);
    });

    it('should damage lives after shields are depleted', () => {
      useGameStore.getState().addShield(1);
      const livesBefore = useGameStore.getState().player.lives;

      useGameStore.getState().takeDamage(3);

      const state = useGameStore.getState();
      expect(state.player.shields).toBe(0);
      expect(state.player.lives).toBe(livesBefore - 2);
    });

    it('should set gameOver when lives reach 0', () => {
      const lives = useGameStore.getState().player.lives;

      useGameStore.getState().takeDamage(lives);

      const state = useGameStore.getState();
      expect(state.player.lives).toBe(0);
      expect(state.gameOver).toBe(true);
      expect(state.run.phase).toBe('gameOver');
    });

    it('should increment damageTakenThisLevel when damage is taken', () => {
      useGameStore.getState().takeDamage(1);
      expect(useGameStore.getState().run.damageTakenThisLevel).toBe(1);

      useGameStore.getState().takeDamage(2);
      expect(useGameStore.getState().run.damageTakenThisLevel).toBe(3);
    });

    it('should grant Immortal bonus HP when Second Chance triggers', () => {
      useGameStore.setState((state) => {
        state.player.equippedRunes = ['second-chance'];
        state.player.lives = 2;
        state.run.activeSynergyIds = ['immortal'];
      });

      useGameStore.getState().takeDamage(3);

      const state = useGameStore.getState();
      expect(state.player.secondChanceUsed).toBe(true);
      expect(state.player.lives).toBe(2);
    });
  });

  describe('addGold', () => {
    it('should increase player gold', () => {
      useGameStore.getState().addGold(50);

      expect(useGameStore.getState().player.gold).toBe(50);
    });

    it('should accumulate gold', () => {
      useGameStore.getState().addGold(30);
      useGameStore.getState().addGold(20);

      expect(useGameStore.getState().player.gold).toBe(50);
    });
  });

  describe('addShield', () => {
    it('should increase player shields', () => {
      useGameStore.getState().addShield(2);

      expect(useGameStore.getState().player.shields).toBe(2);
    });
  });

  describe('setPhase', () => {
    it('should update run phase', () => {
      useGameStore.getState().setPhase('shopping');

      expect(useGameStore.getState().run.phase).toBe('shopping');
    });

    it('should award floor bonus when transitioning to shopping', () => {
      // Start at level 3 (30 gold bonus)
      useGameStore.getState().startLevel(3);
      const goldBefore = useGameStore.getState().player.gold;

      // Transition to shopping (floor complete)
      useGameStore.getState().setPhase('shopping');

      // Should have floor bonus added (level * 10 = 30)
      expect(useGameStore.getState().player.gold).toBe(goldBefore + 30);
    });

    it('should apply Greedy synergy floor bonus multiplier', () => {
      useGameStore.getState().startLevel(3); // base floor bonus: 30
      useGameStore.setState((state) => {
        state.run.activeSynergyIds = ['greedy'];
      });

      const goldBefore = useGameStore.getState().player.gold;
      useGameStore.getState().setPhase('shopping');

      expect(useGameStore.getState().player.gold).toBe(goldBefore + 45);
    });
  });

  describe('floor progression', () => {
    it('should reset shields to starting value on level transition (shields are temporary)', () => {
      // Start level 1 with some shields
      useGameStore.getState().startLevel(1);
      useGameStore.getState().addShield(3);

      // Verify shields are set
      expect(useGameStore.getState().player.shields).toBe(3);

      // Start level 2 (simulating floor completion)
      useGameStore.getState().startLevel(2);

      // Shields should reset to starting shields (0 without resilience upgrade)
      expect(useGameStore.getState().player.shields).toBe(0);
    });

    it('should preserve gold across level transitions', () => {
      // Start level 1 with some gold
      useGameStore.getState().startLevel(1);
      useGameStore.getState().addGold(50);

      // Verify gold is set
      expect(useGameStore.getState().player.gold).toBe(50);

      // Start level 2 (simulating floor completion)
      useGameStore.getState().startLevel(2);

      // Gold should still be there
      expect(useGameStore.getState().player.gold).toBe(50);
    });
  });

  describe('reset', () => {
    it('should return to initial state', () => {
      // Modify state
      useGameStore.getState().addGold(100);
      useGameStore.getState().addShield(5);
      useGameStore.setState({ gameOver: true });

      // Reset
      useGameStore.getState().reset();

      const state = useGameStore.getState();
      expect(state.player.gold).toBe(0);
      expect(state.player.shields).toBe(0);
      expect(state.gameOver).toBe(false);
      expect(state.grid).toBeNull();
    });
  });

  describe('dismissSynergyNotification', () => {
    it('should clear the active synergy notification', () => {
      useGameStore.setState((state) => {
        state.run.synergyNotification = {
          id: 'greedy',
          name: 'Greedy',
          description: '+50% floor completion bonus',
        };
      });

      useGameStore.getState().dismissSynergyNotification();
      expect(useGameStore.getState().run.synergyNotification).toBeUndefined();
    });
  });
});
