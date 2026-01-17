/**
 * Shop integration tests - full purchase flow.
 * @module stores/__tests__/gameStore.shopIntegration.test
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../gameStore';
import { SHOP_ITEM_COUNT, REROLL_BASE_COST } from '@/data/shopItems';

describe('Shop Integration - Full Purchase Flow', () => {
  beforeEach(() => {
    // Reset store to clean state
    useGameStore.setState({
      grid: null,
      gameOver: false,
    });
    useGameStore.getState().startNewRun();
    useGameStore.getState().startLevel(1);
  });

  it('should complete full shop flow: win level -> enter shop -> purchase -> continue', () => {
    const store = useGameStore.getState();

    // Give player some gold for testing
    useGameStore.setState((state) => {
      state.player.gold = 200;
    });

    // Simulate completing a level (set phase to shopping)
    useGameStore.setState((state) => {
      state.run.phase = 'shopping';
    });

    // Step 1: Generate shop items
    store.generateShop();
    expect(useGameStore.getState().run.shopItems).toHaveLength(SHOP_ITEM_COUNT);

    // Step 2: Open shop
    store.setShowShop(true);
    expect(useGameStore.getState().run.showShop).toBe(true);

    // Step 3: Purchase an item
    const items = useGameStore.getState().run.shopItems;
    const itemToBuy = items[0];
    const goldBefore = useGameStore.getState().player.gold;

    const purchaseResult = store.purchaseItem(itemToBuy.id);
    expect(purchaseResult).toBe(true);
    expect(useGameStore.getState().player.gold).toBe(goldBefore - itemToBuy.cost);
    expect(useGameStore.getState().run.purchasedIds).toContain(itemToBuy.id);

    // Step 4: Cannot purchase same item again
    const secondPurchase = store.purchaseItem(itemToBuy.id);
    expect(secondPurchase).toBe(false);

    // Step 5: Close shop and continue to next level
    store.setShowShop(false);
    store.startLevel(2);

    expect(useGameStore.getState().run.level).toBe(2);
    expect(useGameStore.getState().run.phase).toBe('playing');
    expect(useGameStore.getState().run.shopItems).toHaveLength(0);
    expect(useGameStore.getState().run.purchasedIds).toHaveLength(0);
    expect(useGameStore.getState().run.showShop).toBe(false);
  });

  it('should apply heal-potion effect on purchase', () => {
    // Set up player with low health
    useGameStore.setState((state) => {
      state.player.lives = 1;
      state.player.maxLives = 3;
      state.player.gold = 100;
      state.run.phase = 'shopping';
    });

    useGameStore.getState().generateShop();

    // Find heal-potion in shop
    const items = useGameStore.getState().run.shopItems;
    const healPotion = items.find((item) => item.id === 'heal-potion');

    if (healPotion) {
      const livesBefore = useGameStore.getState().player.lives;
      useGameStore.getState().purchaseItem('heal-potion');
      expect(useGameStore.getState().player.lives).toBe(livesBefore + 1);
    }
  });

  it('should apply max-hp-up effect on purchase', () => {
    useGameStore.setState((state) => {
      state.player.maxLives = 3;
      state.player.lives = 3;
      state.player.gold = 100;
      state.run.phase = 'shopping';
    });

    useGameStore.getState().generateShop();

    const items = useGameStore.getState().run.shopItems;
    const maxHpUp = items.find((item) => item.id === 'max-hp-up');

    if (maxHpUp) {
      useGameStore.getState().purchaseItem('max-hp-up');
      expect(useGameStore.getState().player.maxLives).toBe(4);
      expect(useGameStore.getState().player.lives).toBe(4);
    }
  });

  it('should apply shield-orb effect on purchase', () => {
    useGameStore.setState((state) => {
      state.player.shields = 0;
      state.player.gold = 100;
      state.run.phase = 'shopping';
    });

    useGameStore.getState().generateShop();

    const items = useGameStore.getState().run.shopItems;
    const shieldOrb = items.find((item) => item.id === 'shield-orb');

    if (shieldOrb) {
      useGameStore.getState().purchaseItem('shield-orb');
      expect(useGameStore.getState().player.shields).toBe(1);
    }
  });

  it('should set goldMagnet buff for next level on gold-magnet purchase', () => {
    useGameStore.setState((state) => {
      state.player.gold = 100;
      state.run.phase = 'shopping';
    });

    useGameStore.getState().generateShop();

    const items = useGameStore.getState().run.shopItems;
    const goldMagnet = items.find((item) => item.id === 'gold-magnet');

    if (goldMagnet) {
      useGameStore.getState().purchaseItem('gold-magnet');
      expect(useGameStore.getState().player.nextLevelBuffs.goldMagnet).toBe(true);

      // After starting next level, goldMagnet should be in activeBuffs
      useGameStore.getState().startLevel(2);
      expect(useGameStore.getState().player.activeBuffs.goldMagnet).toBe(true);
      expect(useGameStore.getState().player.nextLevelBuffs.goldMagnet).toBeUndefined();
    }
  });

  it('should set revealScroll buff for next level on reveal-scroll purchase', () => {
    useGameStore.setState((state) => {
      state.player.gold = 200; // reveal-scroll costs 150
      state.run.phase = 'shopping';
    });

    useGameStore.getState().generateShop();

    const items = useGameStore.getState().run.shopItems;
    const revealScroll = items.find((item) => item.id === 'reveal-scroll');

    if (revealScroll) {
      useGameStore.getState().purchaseItem('reveal-scroll');
      expect(useGameStore.getState().player.nextLevelBuffs.revealScroll).toBe(true);

      // After starting next level, revealScroll buff should be cleared
      useGameStore.getState().startLevel(2);
      expect(useGameStore.getState().player.nextLevelBuffs.revealScroll).toBeUndefined();
    }
  });

  it('should handle reroll correctly during shop', () => {
    useGameStore.setState((state) => {
      state.player.gold = 100;
      state.run.phase = 'shopping';
    });

    useGameStore.getState().generateShop();
    const goldBefore = useGameStore.getState().player.gold;

    // Reroll (costs REROLL_BASE_COST = 50g)
    const result = useGameStore.getState().rerollShop();
    expect(result).toBe(true);
    expect(useGameStore.getState().player.gold).toBe(goldBefore - REROLL_BASE_COST);
    expect(useGameStore.getState().run.shopItems).toHaveLength(SHOP_ITEM_COUNT);
  });

  it('should clear activeBuffs between levels', () => {
    // Set up activeBuffs from previous level
    useGameStore.setState((state) => {
      state.player.activeBuffs = { goldMagnet: true };
    });

    // Start new level
    useGameStore.getState().startLevel(2);

    // activeBuffs should be cleared (unless restored from nextLevelBuffs)
    expect(useGameStore.getState().player.activeBuffs.goldMagnet).toBeUndefined();
  });

  it('should handle multiple purchases in same shop session', () => {
    useGameStore.setState((state) => {
      state.player.gold = 500;
      state.run.phase = 'shopping';
    });

    useGameStore.getState().generateShop();
    const items = useGameStore.getState().run.shopItems;

    // Buy first item
    useGameStore.getState().purchaseItem(items[0].id);
    expect(useGameStore.getState().run.purchasedIds).toHaveLength(1);

    // Buy second item
    useGameStore.getState().purchaseItem(items[1].id);
    expect(useGameStore.getState().run.purchasedIds).toHaveLength(2);

    // Verify both are marked as purchased
    expect(useGameStore.getState().run.purchasedIds).toContain(items[0].id);
    expect(useGameStore.getState().run.purchasedIds).toContain(items[1].id);
  });
});
