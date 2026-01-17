/**
 * Tests for shopItems data and generation.
 * @module data/__tests__/shopItems.test
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  SHOP_ITEMS,
  SHOP_ITEM_COUNT,
  REROLL_BASE_COST,
  REROLL_INCREMENT,
  getRerollCost,
  getShopItem,
  generateShopItems,
  groupItemsByRarity,
} from '../shopItems';
import type { PlayerState } from '@/types/player';

/**
 * Create a mock player state for testing item effects.
 */
function createMockPlayerState(): PlayerState {
  return {
    lives: 2,
    maxLives: 3,
    shields: 0,
    gold: 100,
    peekScrolls: 0,
    activeBuffs: {},
    nextLevelBuffs: {},
  };
}

describe('shopItems', () => {
  describe('constants', () => {
    it('should have correct reroll base cost', () => {
      expect(REROLL_BASE_COST).toBe(50);
    });

    it('should have correct reroll increment', () => {
      expect(REROLL_INCREMENT).toBe(25);
    });

    it('should calculate escalating reroll cost', () => {
      expect(getRerollCost(0)).toBe(50);
      expect(getRerollCost(1)).toBe(75);
      expect(getRerollCost(2)).toBe(100);
      expect(getRerollCost(3)).toBe(125);
    });

    it('should have correct shop item count', () => {
      expect(SHOP_ITEM_COUNT).toBe(2);
    });
  });

  describe('SHOP_ITEMS', () => {
    it('should have correct number of shop items', () => {
      expect(SHOP_ITEMS).toHaveLength(6);
    });

    it('should have unique IDs', () => {
      const ids = SHOP_ITEMS.map((item) => item.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have valid rarity for all items', () => {
      const validRarities = ['common', 'uncommon', 'rare', 'legendary'];
      SHOP_ITEMS.forEach((item) => {
        expect(validRarities).toContain(item.rarity);
      });
    });

    it('should have apply functions for all items', () => {
      SHOP_ITEMS.forEach((item) => {
        expect(typeof item.apply).toBe('function');
      });
    });
  });

  describe('item effects', () => {
    let state: PlayerState;

    beforeEach(() => {
      state = createMockPlayerState();
    });

    it('heal-potion should add 1 HP up to max', () => {
      const item = getShopItem('heal-potion');
      expect(item).toBeDefined();
      item!.apply(state, {} as never);
      expect(state.lives).toBe(3);
    });

    it('heal-potion should not exceed max HP', () => {
      state.lives = 3; // Already at max
      const item = getShopItem('heal-potion');
      item!.apply(state, {} as never);
      expect(state.lives).toBe(3);
    });

    it('max-hp-up should increase max HP and heal', () => {
      const item = getShopItem('max-hp-up');
      expect(item).toBeDefined();
      item!.apply(state, {} as never);
      expect(state.maxLives).toBe(4);
      expect(state.lives).toBe(3);
    });

    it('shield-orb should add 1 shield', () => {
      const item = getShopItem('shield-orb');
      expect(item).toBeDefined();
      item!.apply(state, {} as never);
      expect(state.shields).toBe(1);
    });

    it('gold-magnet should set nextLevelBuffs.goldMagnet', () => {
      const item = getShopItem('gold-magnet');
      expect(item).toBeDefined();
      item!.apply(state, {} as never);
      expect(state.nextLevelBuffs.goldMagnet).toBe(true);
    });

    it('peek-scroll should add to peekScrolls inventory', () => {
      const item = getShopItem('peek-scroll');
      expect(item).toBeDefined();
      item!.apply(state, {} as never);
      expect(state.peekScrolls).toBe(1);
    });

    it('peek-scroll should stack in inventory', () => {
      state.peekScrolls = 3;
      const item = getShopItem('peek-scroll');
      item!.apply(state, {} as never);
      expect(state.peekScrolls).toBe(4);
    });
  });

  describe('getShopItem', () => {
    it('should return item by ID', () => {
      const item = getShopItem('heal-potion');
      expect(item).toBeDefined();
      expect(item!.name).toBe('Heal Potion');
    });

    it('should return undefined for invalid ID', () => {
      const item = getShopItem('invalid-id');
      expect(item).toBeUndefined();
    });
  });

  describe('generateShopItems', () => {
    it('should generate default number of items', () => {
      const items = generateShopItems();
      expect(items).toHaveLength(SHOP_ITEM_COUNT);
    });

    it('should generate specified number of items', () => {
      const items = generateShopItems(3);
      expect(items).toHaveLength(3);
    });

    it('should not exceed available items', () => {
      const items = generateShopItems(100);
      expect(items.length).toBeLessThanOrEqual(SHOP_ITEMS.length);
    });

    it('should not have duplicate items', () => {
      // Run multiple times to catch randomness issues
      for (let i = 0; i < 10; i++) {
        const items = generateShopItems();
        const ids = items.map((item) => item.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
      }
    });

    it('should return valid ShopItem objects', () => {
      const items = generateShopItems();
      items.forEach((item) => {
        expect(item.id).toBeDefined();
        expect(item.name).toBeDefined();
        expect(item.cost).toBeGreaterThan(0);
        expect(typeof item.apply).toBe('function');
      });
    });
  });

  describe('groupItemsByRarity', () => {
    it('should group items correctly', () => {
      const grouped = groupItemsByRarity();

      expect(grouped.common.length).toBeGreaterThan(0);
      expect(grouped.uncommon.length).toBeGreaterThan(0);

      // All common items should have rarity 'common'
      grouped.common.forEach((item) => {
        expect(item.rarity).toBe('common');
      });

      // All uncommon items should have rarity 'uncommon'
      grouped.uncommon.forEach((item) => {
        expect(item.rarity).toBe('uncommon');
      });
    });
  });

  describe('item costs', () => {
    it('heal-potion costs 30g', () => {
      expect(getShopItem('heal-potion')?.cost).toBe(30);
    });

    it('max-hp-up costs 80g', () => {
      expect(getShopItem('max-hp-up')?.cost).toBe(80);
    });

    it('shield-orb costs 40g', () => {
      expect(getShopItem('shield-orb')?.cost).toBe(40);
    });

    it('gold-magnet costs 60g', () => {
      expect(getShopItem('gold-magnet')?.cost).toBe(60);
    });

    it('peek-scroll costs 50g', () => {
      expect(getShopItem('peek-scroll')?.cost).toBe(50);
    });
  });
});
