/**
 * Tests for permanentUpgrades data and effects.
 * @module data/__tests__/permanentUpgrades.test
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  PERMANENT_UPGRADES,
  createInitialUpgradeRegistry,
} from '../permanentUpgrades';
import { createDefaultPlayerStats, type PlayerStats } from '@/types/player';

describe('permanentUpgrades', () => {
  describe('PERMANENT_UPGRADES', () => {
    it('should export 5 upgrades', () => {
      expect(Object.keys(PERMANENT_UPGRADES)).toHaveLength(5);
    });

    it('should have unique IDs', () => {
      const ids = Object.keys(PERMANENT_UPGRADES);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have all required upgrades', () => {
      expect(PERMANENT_UPGRADES.vitality).toBeDefined();
      expect(PERMANENT_UPGRADES.fortune).toBeDefined();
      expect(PERMANENT_UPGRADES.preparation).toBeDefined();
      expect(PERMANENT_UPGRADES.resilience).toBeDefined();
      expect(PERMANENT_UPGRADES.firstClickSafety).toBeDefined();
    });
  });

  describe('Vitality upgrade', () => {
    let stats: PlayerStats;

    beforeEach(() => {
      stats = createDefaultPlayerStats();
    });

    it('should be a leveled upgrade', () => {
      expect(PERMANENT_UPGRADES.vitality.type).toBe('leveled');
    });

    it('should increase maxLives by 1 when applied', () => {
      const initialMaxLives = stats.maxLives;
      PERMANENT_UPGRADES.vitality.apply(stats);
      expect(stats.maxLives).toBe(initialMaxLives + 1);
    });

    it('should have maxLevel of 7', () => {
      const upgrade = PERMANENT_UPGRADES.vitality;
      if (upgrade.type === 'leveled') {
        expect(upgrade.maxLevel).toBe(7);
      }
    });
  });

  describe('Fortune upgrade', () => {
    let stats: PlayerStats;

    beforeEach(() => {
      stats = createDefaultPlayerStats();
    });

    it('should be a leveled upgrade', () => {
      expect(PERMANENT_UPGRADES.fortune.type).toBe('leveled');
    });

    it('should increase goldFindBonus by 0.01 when applied', () => {
      const initialBonus = stats.goldFindBonus;
      PERMANENT_UPGRADES.fortune.apply(stats);
      expect(stats.goldFindBonus).toBeCloseTo(initialBonus + 0.01);
    });

    it('should have maxLevel of 100', () => {
      const upgrade = PERMANENT_UPGRADES.fortune;
      if (upgrade.type === 'leveled') {
        expect(upgrade.maxLevel).toBe(100);
      }
    });
  });

  describe('Preparation upgrade', () => {
    let stats: PlayerStats;

    beforeEach(() => {
      stats = createDefaultPlayerStats();
    });

    it('should be a leveled upgrade', () => {
      expect(PERMANENT_UPGRADES.preparation.type).toBe('leveled');
    });

    it('should increase preparationLevel by 1 when applied', () => {
      const initialLevel = stats.preparationLevel;
      PERMANENT_UPGRADES.preparation.apply(stats);
      expect(stats.preparationLevel).toBe(initialLevel + 1);
    });

    it('should have maxLevel of 5', () => {
      const upgrade = PERMANENT_UPGRADES.preparation;
      if (upgrade.type === 'leveled') {
        expect(upgrade.maxLevel).toBe(5);
      }
    });
  });

  describe('Resilience upgrade', () => {
    let stats: PlayerStats;

    beforeEach(() => {
      stats = createDefaultPlayerStats();
    });

    it('should be a leveled upgrade', () => {
      expect(PERMANENT_UPGRADES.resilience.type).toBe('leveled');
    });

    it('should increase startingShields by 1 when applied', () => {
      const initialShields = stats.startingShields;
      PERMANENT_UPGRADES.resilience.apply(stats);
      expect(stats.startingShields).toBe(initialShields + 1);
    });

    it('should have maxLevel of 5', () => {
      const upgrade = PERMANENT_UPGRADES.resilience;
      if (upgrade.type === 'leveled') {
        expect(upgrade.maxLevel).toBe(5);
      }
    });
  });

  describe('First Click Safety upgrade', () => {
    let stats: PlayerStats;

    beforeEach(() => {
      stats = createDefaultPlayerStats();
    });

    it('should be an unlockable upgrade', () => {
      expect(PERMANENT_UPGRADES.firstClickSafety.type).toBe('unlockable');
    });

    it('should set firstClickSafety to true when applied', () => {
      expect(stats.firstClickSafety).toBe(false);
      PERMANENT_UPGRADES.firstClickSafety.apply(stats);
      expect(stats.firstClickSafety).toBe(true);
    });
  });

  describe('createInitialUpgradeRegistry', () => {
    it('should return all 5 upgrades', () => {
      const registry = createInitialUpgradeRegistry();
      expect(Object.keys(registry)).toHaveLength(5);
    });

    it('should have all upgrades at level 0 or not unlocked', () => {
      const registry = createInitialUpgradeRegistry();

      Object.values(registry).forEach((upgrade) => {
        if (upgrade.type === 'leveled') {
          expect(upgrade.level).toBe(0);
        } else if (upgrade.type === 'unlockable') {
          expect(upgrade.unlocked).toBe(false);
        }
      });
    });

    it('should return copies not references', () => {
      const registry1 = createInitialUpgradeRegistry();
      const registry2 = createInitialUpgradeRegistry();

      // Modifying one should not affect the other
      if (registry1.vitality.type === 'leveled') {
        registry1.vitality.level = 5;
      }

      if (registry2.vitality.type === 'leveled') {
        expect(registry2.vitality.level).toBe(0);
      }
    });
  });
});
