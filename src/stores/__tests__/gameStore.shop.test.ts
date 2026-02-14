/**
 * Tests for gameStore shop functionality.
 * @module stores/__tests__/gameStore.shop.test
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../gameStore';
import { REROLL_BASE_COST, SHOP_ITEM_COUNT, getRerollCost } from '@/data/shopItems';

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

    it('should include dropped rune offers when present', () => {
      useGameStore.setState((state) => {
        state.run.tileDroppedRuneIds = ['lucky-coin', 'treasure-hunter'];
      });

      useGameStore.getState().generateShop();
      const offers = useGameStore.getState().run.availableRuneRewards;

      expect(offers).toContain('lucky-coin');
      expect(offers).toContain('treasure-hunter');
      expect(offers.length).toBeGreaterThanOrEqual(2);
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

    it('should apply shield-orb to nextLevelBuffs', () => {
      useGameStore.getState().purchaseItem('shield-orb');

      expect(useGameStore.getState().player.nextLevelBuffs.shields).toBe(1);
    });

    it('should apply shield-orb shields at next level start', () => {
      useGameStore.getState().purchaseItem('shield-orb');

      // Start next level to apply the buff
      useGameStore.getState().startLevel(2);

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

    it('should apply peek-scroll to inventory', () => {
      useGameStore.getState().purchaseItem('peek-scroll');

      expect(useGameStore.getState().player.peekScrolls).toBe(1);
    });

    it('should apply fortified-deal synergy discount on purchases', () => {
      useGameStore.setState((state) => {
        state.player.equippedRunes = ['bargain-hunter'];
        state.run.activeSynergyIds = ['fortified-deal'];
      });

      const goldBefore = useGameStore.getState().player.gold;
      useGameStore.getState().purchaseItem('heal-potion'); // 30g -> floor(30 * 0.85) = 25

      expect(useGameStore.getState().player.gold).toBe(goldBefore - 25);
    });
  });

  describe('rerollShop', () => {
    beforeEach(() => {
      useGameStore.getState().addGold(100);
      useGameStore.getState().generateShop();
    });

    it('should deduct reroll cost', () => {
      const goldBefore = useGameStore.getState().player.gold;
      const rerollCost = getRerollCost(0); // First reroll

      useGameStore.getState().rerollShop();

      expect(useGameStore.getState().player.gold).toBe(goldBefore - rerollCost);
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
        state.player.gold = REROLL_BASE_COST - 1;
      });

      const result = useGameStore.getState().rerollShop();

      expect(result).toBe(false);
    });

    it('should track escalating reroll cost', () => {
      useGameStore.getState().addGold(200); // Ensure enough for multiple rerolls

      const goldBefore = useGameStore.getState().player.gold;
      useGameStore.getState().rerollShop(); // First reroll (50g)
      expect(useGameStore.getState().player.gold).toBe(goldBefore - 50);
      expect(useGameStore.getState().run.rerollCount).toBe(1);

      const goldAfterFirst = useGameStore.getState().player.gold;
      useGameStore.getState().rerollShop(); // Second reroll (75g)
      expect(useGameStore.getState().player.gold).toBe(goldAfterFirst - 75);
      expect(useGameStore.getState().run.rerollCount).toBe(2);
    });

    it('should keep purchasedIds after reroll', () => {
      useGameStore.getState().purchaseItem('heal-potion');

      useGameStore.getState().rerollShop();

      expect(useGameStore.getState().run.purchasedIds).toContain('heal-potion');
    });

    it('should apply fortified-deal synergy discount on reroll cost', () => {
      useGameStore.setState((state) => {
        state.player.equippedRunes = ['bargain-hunter'];
        state.run.activeSynergyIds = ['fortified-deal'];
      });

      const goldBefore = useGameStore.getState().player.gold;
      useGameStore.getState().rerollShop(); // 50g -> floor(50 * 0.85) = 42

      expect(useGameStore.getState().player.gold).toBe(goldBefore - 42);
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

  describe('usePeekScroll', () => {
    beforeEach(() => {
      // Initialize grid first by starting level and revealing a cell
      useGameStore.getState().startLevel(1);
      useGameStore.getState().revealCell(0, 0);
    });

    it('should return false if no scrolls', () => {
      expect(useGameStore.getState().player.peekScrolls).toBe(0);
      const result = useGameStore.getState().usePeekScroll();
      expect(result).toBe(false);
    });

    it('should return false if not in playing phase', () => {
      useGameStore.setState((state) => {
        state.player.peekScrolls = 1;
        state.run.phase = 'shopping';
      });

      const result = useGameStore.getState().usePeekScroll();
      expect(result).toBe(false);
      expect(useGameStore.getState().player.peekScrolls).toBe(1); // Not consumed
    });

    it('should decrement peekScrolls on use', () => {
      useGameStore.setState((state) => {
        state.player.peekScrolls = 3;
      });

      useGameStore.getState().usePeekScroll();

      expect(useGameStore.getState().player.peekScrolls).toBe(2);
    });

    it('should increase revealedCount by 1', () => {
      useGameStore.setState((state) => {
        state.player.peekScrolls = 1;
      });

      const revealedBefore = useGameStore.getState().run.revealedCount;
      useGameStore.getState().usePeekScroll();

      expect(useGameStore.getState().run.revealedCount).toBe(revealedBefore + 1);
    });

    it('should award gold for revealed tile', () => {
      useGameStore.setState((state) => {
        state.player.peekScrolls = 1;
        state.player.gold = 100;
      });

      useGameStore.getState().usePeekScroll();

      expect(useGameStore.getState().player.gold).toBe(101); // +1 gold
    });

    it('should return true on successful use', () => {
      useGameStore.setState((state) => {
        state.player.peekScrolls = 1;
      });

      const result = useGameStore.getState().usePeekScroll();
      expect(result).toBe(true);
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

  describe('getRuneRemovalFee', () => {
    it('should apply rune and synergy discounts to removal fee', () => {
      useGameStore.setState((state) => {
        state.player.equippedRunes = ['bargain-hunter'];
        state.run.activeSynergyIds = ['fortified-deal'];
      });

      const fee = useGameStore.getState().getRuneRemovalFee('midas-touch'); // 60/2=30 -> floor(30 * 0.85)=25
      expect(fee).toBe(25);
    });
  });

  describe('selectRuneReward with dropped offers', () => {
    it('applies modifier-aware pricing when buying a dropped rune offer', () => {
      useGameStore.setState((state) => {
        state.player.gold = 100;
        state.player.equippedRunes = ['bargain-hunter'];
        state.run.activeSynergyIds = ['fortified-deal'];
        state.run.tileDroppedRuneIds = ['lucky-coin'];
      });

      useGameStore.getState().generateShop();
      expect(useGameStore.getState().run.availableRuneRewards).toContain('lucky-coin');

      const goldBefore = useGameStore.getState().player.gold;
      const purchased = useGameStore.getState().selectRuneReward('lucky-coin');

      // 25g rune with 15% total discount = floor(21.25) = 21
      expect(purchased).toBe(true);
      expect(useGameStore.getState().player.gold).toBe(goldBefore - 21);
      expect(useGameStore.getState().player.equippedRunes).toContain('lucky-coin');
    });
  });
});
