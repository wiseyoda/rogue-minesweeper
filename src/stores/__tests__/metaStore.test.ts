/**
 * Tests for metaStore.
 * @module stores/__tests__/metaStore.test
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useMetaStore } from '../metaStore';
import { createInitialUpgradeRegistry } from '@/data/permanentUpgrades';
import type { LeveledUpgrade, UnlockableUpgrade } from '@/types';

describe('metaStore', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    vi.clearAllMocks();

    // Reset store state by directly setting to initial values
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
      upgrades: {},
      metaGold: 0,
    });
  });

  describe('initial state', () => {
    it('should have default game stats', () => {
      const state = useMetaStore.getState();
      expect(state.stats.highestLevelOverall).toBe(1);
      expect(state.stats.maxGoldRun).toBe(0);
      expect(state.stats.totalRuns).toBe(0);
    });

    it('should have default player stats', () => {
      const state = useMetaStore.getState();
      expect(state.playerStats.maxLives).toBeGreaterThan(0);
    });

    it('should have empty upgrades', () => {
      const state = useMetaStore.getState();
      expect(Object.keys(state.upgrades)).toHaveLength(0);
    });

    it('should have zero metaGold', () => {
      const state = useMetaStore.getState();
      expect(state.metaGold).toBe(0);
    });
  });

  describe('addMetaGold', () => {
    it('should add gold to metaGold', () => {
      useMetaStore.getState().addMetaGold(100);
      expect(useMetaStore.getState().metaGold).toBe(100);
    });

    it('should accumulate gold on multiple calls', () => {
      useMetaStore.getState().addMetaGold(50);
      useMetaStore.getState().addMetaGold(30);
      useMetaStore.getState().addMetaGold(20);
      expect(useMetaStore.getState().metaGold).toBe(100);
    });
  });

  describe('initializeUpgrades', () => {
    it('should initialize upgrades when empty', () => {
      useMetaStore.getState().initializeUpgrades();
      const upgrades = useMetaStore.getState().upgrades;
      expect(Object.keys(upgrades).length).toBeGreaterThan(0);
    });

    it('should preserve existing upgrade state when merging', () => {
      // First initialize with default state
      useMetaStore.getState().initializeUpgrades();

      // Add some gold and purchase an upgrade
      useMetaStore.setState((state) => ({
        ...state,
        metaGold: 500,
      }));

      // Get vitality and modify its level
      const upgrades = useMetaStore.getState().upgrades;
      if (upgrades.vitality && upgrades.vitality.type === 'leveled') {
        useMetaStore.setState((state) => ({
          ...state,
          upgrades: {
            ...state.upgrades,
            vitality: { ...upgrades.vitality, level: 2 } as LeveledUpgrade,
          },
        }));
      }

      // Re-initialize (should preserve existing state)
      useMetaStore.getState().initializeUpgrades();

      const finalVitality = useMetaStore.getState().upgrades.vitality;
      if (finalVitality && finalVitality.type === 'leveled') {
        expect(finalVitality.level).toBe(2);
      }
    });
  });

  describe('recordRunEnd', () => {
    it('should update highestLevelOverall when higher', () => {
      useMetaStore.getState().recordRunEnd(5, 100);

      expect(useMetaStore.getState().stats.highestLevelOverall).toBe(5);
    });

    it('should not lower highestLevelOverall', () => {
      useMetaStore.getState().recordRunEnd(10, 100);
      useMetaStore.getState().recordRunEnd(3, 50);

      expect(useMetaStore.getState().stats.highestLevelOverall).toBe(10);
    });

    it('should update maxGoldRun when higher', () => {
      useMetaStore.getState().recordRunEnd(1, 500);

      expect(useMetaStore.getState().stats.maxGoldRun).toBe(500);
    });

    it('should not lower maxGoldRun', () => {
      useMetaStore.getState().recordRunEnd(1, 500);
      useMetaStore.getState().recordRunEnd(2, 200);

      expect(useMetaStore.getState().stats.maxGoldRun).toBe(500);
    });

    it('should increment totalRuns', () => {
      useMetaStore.getState().recordRunEnd(1, 10);
      useMetaStore.getState().recordRunEnd(2, 20);
      useMetaStore.getState().recordRunEnd(3, 30);

      expect(useMetaStore.getState().stats.totalRuns).toBe(3);
    });
  });

  describe('purchaseUpgrade', () => {
    it('should return false for non-existent upgrade', () => {
      const result = useMetaStore.getState().purchaseUpgrade('nonexistent');

      expect(result).toBe(false);
    });

    it('should deduct correct metaGold when purchasing', () => {
      const upgrade: LeveledUpgrade = {
        type: 'leveled',
        name: 'Test',
        description: 'Test upgrade',
        baseCost: 100,
        level: 0,
        maxLevel: 5,
        costIncrease: 2,
        apply: () => {},
      };

      useMetaStore.setState((state) => ({
        ...state,
        upgrades: { ...state.upgrades, test: upgrade },
        metaGold: 500,
      }));

      useMetaStore.getState().purchaseUpgrade('test');

      expect(useMetaStore.getState().metaGold).toBe(400); // 500 - 100
    });

    it('should return false when insufficient metaGold', () => {
      const upgrade: LeveledUpgrade = {
        type: 'leveled',
        name: 'Test',
        description: 'Test upgrade',
        baseCost: 100,
        level: 0,
        maxLevel: 5,
        costIncrease: 2,
        apply: () => {},
      };

      useMetaStore.setState((state) => ({
        ...state,
        upgrades: { ...state.upgrades, test: upgrade },
        metaGold: 50, // Not enough for 100 cost
      }));

      const result = useMetaStore.getState().purchaseUpgrade('test');

      expect(result).toBe(false);
      expect(useMetaStore.getState().metaGold).toBe(50); // Gold unchanged
    });

    it('should deduct increased cost for higher levels', () => {
      const upgrade: LeveledUpgrade = {
        type: 'leveled',
        name: 'Test',
        description: 'Test upgrade',
        baseCost: 100,
        level: 1, // Already level 1
        maxLevel: 5,
        costIncrease: 2, // Cost doubles each level
        apply: () => {},
      };

      useMetaStore.setState((state) => ({
        ...state,
        upgrades: { ...state.upgrades, test: upgrade },
        metaGold: 500,
      }));

      useMetaStore.getState().purchaseUpgrade('test');

      // Cost at level 1 is baseCost * costIncrease = 100 * 2 = 200
      expect(useMetaStore.getState().metaGold).toBe(300); // 500 - 200
    });

    it('should return false when leveled upgrade at max level', () => {
      const maxedUpgrade: LeveledUpgrade = {
        type: 'leveled',
        name: 'Test',
        description: 'Test upgrade',
        baseCost: 100,
        level: 5,
        maxLevel: 5,
        costIncrease: 1.5,
        apply: () => {},
      };

      useMetaStore.setState((state) => ({
        ...state,
        upgrades: { ...state.upgrades, test: maxedUpgrade },
      }));

      const result = useMetaStore.getState().purchaseUpgrade('test');
      expect(result).toBe(false);
    });

    it('should return false when unlockable already unlocked', () => {
      const unlockedUpgrade: UnlockableUpgrade = {
        type: 'unlockable',
        name: 'Test',
        description: 'Test upgrade',
        baseCost: 100,
        unlocked: true,
        apply: () => {},
      };

      useMetaStore.setState((state) => ({
        ...state,
        upgrades: { ...state.upgrades, test: unlockedUpgrade },
      }));

      const result = useMetaStore.getState().purchaseUpgrade('test');
      expect(result).toBe(false);
    });

    it('should increment level for leveled upgrade', () => {
      const upgrade: LeveledUpgrade = {
        type: 'leveled',
        name: 'Test',
        description: 'Test upgrade',
        baseCost: 100,
        level: 0,
        maxLevel: 5,
        costIncrease: 1.5,
        apply: () => {},
      };

      useMetaStore.setState((state) => ({
        ...state,
        upgrades: { ...state.upgrades, test: upgrade },
        metaGold: 500, // Provide gold to purchase
      }));

      const result = useMetaStore.getState().purchaseUpgrade('test');

      expect(result).toBe(true);
      const updated = useMetaStore.getState().upgrades['test'];
      expect(updated.type === 'leveled' && updated.level).toBe(1);
    });

    it('should set unlocked for unlockable upgrade', () => {
      const upgrade: UnlockableUpgrade = {
        type: 'unlockable',
        name: 'Test',
        description: 'Test upgrade',
        baseCost: 100,
        unlocked: false,
        apply: () => {},
      };

      useMetaStore.setState((state) => ({
        ...state,
        upgrades: { ...state.upgrades, test: upgrade },
        metaGold: 500, // Provide gold to purchase
      }));

      const result = useMetaStore.getState().purchaseUpgrade('test');

      expect(result).toBe(true);
      const updated = useMetaStore.getState().upgrades['test'];
      expect(updated.type === 'unlockable' && updated.unlocked).toBe(true);
    });
  });

  describe('applyAllUpgrades', () => {
    it('should reset player stats before applying', () => {
      useMetaStore.setState((state) => ({
        ...state,
        playerStats: { ...state.playerStats, maxLives: 999 },
      }));

      useMetaStore.getState().applyAllUpgrades();

      // Should be back to default
      const state = useMetaStore.getState();
      expect(state.playerStats.maxLives).toBeLessThan(999);
    });

    it('should apply unlocked upgrades', () => {
      let applyCalled = false;
      const upgrade: UnlockableUpgrade = {
        type: 'unlockable',
        name: 'Test',
        description: 'Test upgrade',
        baseCost: 100,
        unlocked: true,
        apply: () => {
          applyCalled = true;
        },
      };

      useMetaStore.setState((state) => ({
        ...state,
        upgrades: { ...state.upgrades, test: upgrade },
      }));

      useMetaStore.getState().applyAllUpgrades();

      expect(applyCalled).toBe(true);
    });

    it('should apply leveled upgrades multiple times', () => {
      let applyCount = 0;
      const upgrade: LeveledUpgrade = {
        type: 'leveled',
        name: 'Test',
        description: 'Test upgrade',
        baseCost: 100,
        level: 3,
        maxLevel: 5,
        costIncrease: 1.5,
        apply: () => {
          applyCount++;
        },
      };

      useMetaStore.setState((state) => ({
        ...state,
        upgrades: { ...state.upgrades, test: upgrade },
      }));

      useMetaStore.getState().applyAllUpgrades();

      expect(applyCount).toBe(3);
    });

    it('should not apply unpurchased upgrades', () => {
      let applyCalled = false;
      const upgrade: LeveledUpgrade = {
        type: 'leveled',
        name: 'Test',
        description: 'Test upgrade',
        baseCost: 100,
        level: 0,
        maxLevel: 5,
        costIncrease: 1.5,
        apply: () => {
          applyCalled = true;
        },
      };

      useMetaStore.setState((state) => ({
        ...state,
        upgrades: { ...state.upgrades, test: upgrade },
      }));

      useMetaStore.getState().applyAllUpgrades();

      expect(applyCalled).toBe(false);
    });
  });

  describe('reset', () => {
    it('should reset stats to defaults', () => {
      useMetaStore.getState().recordRunEnd(10, 1000);

      useMetaStore.getState().reset();

      const state = useMetaStore.getState();
      expect(state.stats.highestLevelOverall).toBe(1);
      expect(state.stats.maxGoldRun).toBe(0);
    });

    it('should reset metaGold to zero', () => {
      useMetaStore.getState().addMetaGold(500);

      useMetaStore.getState().reset();

      expect(useMetaStore.getState().metaGold).toBe(0);
    });

    it('should reset upgrades to initial (unpurchased) state', () => {
      // First set up some purchased upgrades
      useMetaStore.setState((state) => ({
        ...state,
        upgrades: createInitialUpgradeRegistry(),
        metaGold: 1000,
      }));

      // Purchase an upgrade (vitality)
      useMetaStore.getState().purchaseUpgrade('vitality');
      const vitalityBeforeReset = useMetaStore.getState().upgrades.vitality;
      if (vitalityBeforeReset?.type === 'leveled') {
        expect(vitalityBeforeReset.level).toBe(1);
      }

      // Reset the store
      useMetaStore.getState().reset();

      // After reset, upgrades should be back to initial state (level 0)
      const upgrades = useMetaStore.getState().upgrades;
      const vitalityAfterReset = upgrades.vitality;
      if (vitalityAfterReset?.type === 'leveled') {
        expect(vitalityAfterReset.level).toBe(0);
      }
    });
  });

  describe('persistence', () => {
    it('should persist stats to localStorage', async () => {
      useMetaStore.getState().recordRunEnd(7, 350);

      // Wait for persist to complete
      await new Promise((resolve) => setTimeout(resolve, 10));

      const stored = localStorage.getItem('dungeon-delver-meta');
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);
      expect(parsed.state.stats.highestLevelOverall).toBe(7);
      expect(parsed.state.stats.maxGoldRun).toBe(350);
    });
  });
});
