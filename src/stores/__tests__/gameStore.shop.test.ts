/**
 * Tests for gameStore shop functionality.
 * @module stores/__tests__/gameStore.shop.test
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../gameStore';
import { REROLL_COST, SHOP_ITEM_COUNT } from '@/data/shopItems';

describe('gameStore shop', () => {
  beforeEach(() => {
    useGameStore.getState().reset();
    useGameStore.getState().startLevel(1);
  });

  describe('generateShop', () => {
    it('should populate shopItems with items', () => {
      useGameStore.getState().generateShop();
      const { run } = useGameStore.getState();

      expect(run.shopItems).toHaveLength(SHOP_ITEM_COUNT);
      expect(run.purchasedIds).toHaveLength(0);
    });

    it('should reset purchasedIds when generating new shop', () => {
      // Buy something first
      useGameStore.getState().addGold(100);
      useGameStore.getState().generateShop();
      useGameStore.getState().purchaseItem('heal-potion');

      expect(useGameStore.getState().run.purchasedIds).toHaveLength(1);

      // Generate new shop
      useGameStore.getState().generateShop();

      expect(useGameStore.getState().run.purchasedIds).toHaveLength(0);
    });
  });

  describe('purchaseItem', () => {
    beforeEach(() => {
      useGameStore.getState().addGold(100);
      useGameStore.getState().generateShop();
    });

    it('should deduct gold on purchase', () => {
      const goldBefore = useGameStore.getState().player.gold;
      useGameStore.getState().purchaseItem('heal-potion'); // costs 30g

      expect(useGameStore.getState().player.gold).toBe(goldBefore - 30);
    });

    it('should add item to purchasedIds', () => {
      useGameStore.getState().purchaseItem('heal-potion');

      expect(useGameStore.getState().run.purchasedIds).toContain('heal-potion');
    });

    it('should return true on successful purchase', () => {
      const result = useGameStore.getState().purchaseItem('heal-potion');

      expect(result).toBe(true);
    });

    it('should return false if not enough gold', () => {
      useGameStore.setState((state) => {
        state.player.gold = 0;
      });

      const result = useGameStore.getState().purchaseItem('heal-potion');

      expect(result).toBe(false);
    });

    it('should return false if already purchased', () => {
      useGameStore.getState().purchaseItem('heal-potion');

      const result = useGameStore.getState().purchaseItem('heal-potion');

      expect(result).toBe(false);
    });

    it('should return false for invalid item ID', () => {
      const result = useGameStore.getState().purchaseItem('invalid-item');

      expect(result).toBe(false);
    });

    it('should apply heal-potion effect', () => {
      // Set lives below max
      useGameStore.setState((state) => {
        state.player.lives = 1;
        state.player.maxLives = 3;
      });

      useGameStore.getState().purchaseItem('heal-potion');

      expect(useGameStore.getState().player.lives).toBe(2);
    });

    it('should apply shield-orb effect', () => {
      useGameStore.getState().purchaseItem('shield-orb');

      expect(useGameStore.getState().player.shields).toBe(1);
    });

    it('should apply max-hp-up effect', () => {
      const maxBefore = useGameStore.getState().player.maxLives;
      const livesBefore = useGameStore.getState().player.lives;

      useGameStore.getState().purchaseItem('max-hp-up');

      expect(useGameStore.getState().player.maxLives).toBe(maxBefore + 1);
      expect(useGameStore.getState().player.lives).toBe(livesBefore + 1);
    });

    it('should apply gold-magnet buff', () => {
      useGameStore.getState().purchaseItem('gold-magnet');

      expect(useGameStore.getState().player.nextLevelBuffs.goldMagnet).toBe(
        true
      );
    });

    it('should apply reveal-scroll buff', () => {
      useGameStore.getState().purchaseItem('reveal-scroll');

      expect(useGameStore.getState().player.nextLevelBuffs.revealTiles).toBe(5);
    });
  });

  describe('rerollShop', () => {
    beforeEach(() => {
      useGameStore.getState().addGold(100);
      useGameStore.getState().generateShop();
    });

    it('should deduct reroll cost', () => {
      const goldBefore = useGameStore.getState().player.gold;

      useGameStore.getState().rerollShop();

      expect(useGameStore.getState().player.gold).toBe(
        goldBefore - REROLL_COST
      );
    });

    it('should generate new items', () => {
      useGameStore.getState().rerollShop();

      const itemsAfter = useGameStore.getState().run.shopItems;

      // Items should be regenerated (may be different, may be same due to randomness)
      expect(itemsAfter).toHaveLength(SHOP_ITEM_COUNT);
    });

    it('should return true on successful reroll', () => {
      const result = useGameStore.getState().rerollShop();

      expect(result).toBe(true);
    });

    it('should return false if not enough gold', () => {
      useGameStore.setState((state) => {
        state.player.gold = REROLL_COST - 1;
      });

      const result = useGameStore.getState().rerollShop();

      expect(result).toBe(false);
    });

    it('should keep purchasedIds after reroll', () => {
      useGameStore.getState().purchaseItem('heal-potion');

      useGameStore.getState().rerollShop();

      expect(useGameStore.getState().run.purchasedIds).toContain('heal-potion');
    });
  });

  describe('setShowShop', () => {
    it('should set showShop to true', () => {
      useGameStore.getState().setShowShop(true);

      expect(useGameStore.getState().run.showShop).toBe(true);
    });

    it('should set showShop to false', () => {
      useGameStore.getState().setShowShop(true);
      useGameStore.getState().setShowShop(false);

      expect(useGameStore.getState().run.showShop).toBe(false);
    });
  });

  describe('startLevel clears shop state', () => {
    it('should clear shopItems on new level', () => {
      useGameStore.getState().generateShop();
      expect(useGameStore.getState().run.shopItems.length).toBeGreaterThan(0);

      useGameStore.getState().startLevel(2);

      expect(useGameStore.getState().run.shopItems).toHaveLength(0);
    });

    it('should clear purchasedIds on new level', () => {
      useGameStore.getState().addGold(100);
      useGameStore.getState().generateShop();
      useGameStore.getState().purchaseItem('heal-potion');

      useGameStore.getState().startLevel(2);

      expect(useGameStore.getState().run.purchasedIds).toHaveLength(0);
    });

    it('should set showShop to false on new level', () => {
      useGameStore.getState().setShowShop(true);

      useGameStore.getState().startLevel(2);

      expect(useGameStore.getState().run.showShop).toBe(false);
    });
  });
});
