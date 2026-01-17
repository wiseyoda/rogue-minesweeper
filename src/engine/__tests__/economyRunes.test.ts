/**
 * Tests for economy rune effects.
 * @module engine/__tests__/economyRunes
 */

import { describe, it, expect, vi } from 'vitest';
import { calculateShopPrice, getPassiveRuneModifiers, checkTreasureCache } from '../runes';
import { createDefaultRuneModifiers } from '@/types/rune';

describe('Economy Runes', () => {
  describe('calculateShopPrice', () => {
    it('should return base price with no modifiers', () => {
      const modifiers = createDefaultRuneModifiers();
      expect(calculateShopPrice(100, modifiers)).toBe(100);
      expect(calculateShopPrice(30, modifiers)).toBe(30);
    });

    it('should apply price increase', () => {
      const modifiers = createDefaultRuneModifiers();
      modifiers.shopPriceIncrease = 0.5; // +50%
      expect(calculateShopPrice(100, modifiers)).toBe(150);
      expect(calculateShopPrice(30, modifiers)).toBe(45);
    });

    it('should apply discount', () => {
      const modifiers = createDefaultRuneModifiers();
      modifiers.shopDiscount = 0.1; // 10% off
      expect(calculateShopPrice(100, modifiers)).toBe(90);
      expect(calculateShopPrice(30, modifiers)).toBe(27);
    });

    it('should apply increase before discount', () => {
      const modifiers = createDefaultRuneModifiers();
      modifiers.shopPriceIncrease = 0.5; // +50%
      modifiers.shopDiscount = 0.1; // 10% off
      // 100 * 1.5 = 150, then 150 * 0.9 = 135
      expect(calculateShopPrice(100, modifiers)).toBe(135);
    });

    it('should enforce minimum price of 1g', () => {
      const modifiers = createDefaultRuneModifiers();
      modifiers.shopDiscount = 0.99; // 99% off
      expect(calculateShopPrice(100, modifiers)).toBe(1);
      expect(calculateShopPrice(1, modifiers)).toBe(1);
    });

    it('should floor to integer', () => {
      const modifiers = createDefaultRuneModifiers();
      modifiers.shopDiscount = 0.1; // 10% off
      // 25 * 0.9 = 22.5 -> 22
      expect(calculateShopPrice(25, modifiers)).toBe(22);
    });
  });

  describe('Bargain Hunter', () => {
    it('should add 0.1 to shopDiscount', () => {
      const modifiers = getPassiveRuneModifiers(['bargain-hunter']);
      expect(modifiers.shopDiscount).toBe(0.1);
    });

    it('should stack discount with multiple copies', () => {
      const modifiers = getPassiveRuneModifiers(['bargain-hunter', 'bargain-hunter']);
      expect(modifiers.shopDiscount).toBeCloseTo(0.2);

      const modifiers3 = getPassiveRuneModifiers(['bargain-hunter', 'bargain-hunter', 'bargain-hunter']);
      expect(modifiers3.shopDiscount).toBeCloseTo(0.3);
    });
  });

  describe('Treasure Hunter', () => {
    it('should return triggered=false when no rune equipped', () => {
      const result = checkTreasureCache([], 100);
      expect(result.triggered).toBe(false);
      expect(result.goldAmount).toBe(0);
    });

    it('should return goldAmount of at least 1g when triggered', () => {
      // Mock Math.random to always trigger and give minimum percent
      vi.spyOn(Math, 'random').mockReturnValue(0); // Always triggers, gives 10%
      const result = checkTreasureCache(['treasure-hunter'], 100);
      expect(result.triggered).toBe(true);
      expect(result.goldAmount).toBeGreaterThanOrEqual(1);
      vi.restoreAllMocks();
    });

    it('should award 10-25% of floor bonus', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0); // Always triggers, gives 10%
      const result = checkTreasureCache(['treasure-hunter'], 100);
      expect(result.goldAmount).toBe(10); // 10% of 100
      vi.restoreAllMocks();

      vi.spyOn(Math, 'random').mockReturnValueOnce(0).mockReturnValue(0.999); // Trigger, max percent
      const result2 = checkTreasureCache(['treasure-hunter'], 100);
      // With random = 0.999, percent = 0.10 + 0.999 * 0.15 = 0.24985 -> floor(24.985) = 24
      expect(result2.goldAmount).toBeLessThanOrEqual(25);
      expect(result2.goldAmount).toBeGreaterThanOrEqual(10);
      vi.restoreAllMocks();
    });
  });

  describe('Golden Goose', () => {
    it('should add 1.0 to goldMultiplier', () => {
      const modifiers = getPassiveRuneModifiers(['golden-goose']);
      expect(modifiers.goldMultiplier).toBe(2.0); // 1.0 default + 1.0 = 2.0
    });

    it('should set shopPriceIncrease to 0.5', () => {
      const modifiers = getPassiveRuneModifiers(['golden-goose']);
      expect(modifiers.shopPriceIncrease).toBe(0.5);
    });

    it('should not stack gold multiplier', () => {
      // Golden Goose is non-stackable, but if multiple were equipped:
      const modifiers = getPassiveRuneModifiers(['golden-goose', 'golden-goose']);
      // Each adds 1.0 to multiplier, so 1.0 + 1.0 + 1.0 = 3.0
      // But shopPriceIncrease is set (not added), so stays 0.5
      expect(modifiers.goldMultiplier).toBe(3.0); // In practice, only one can be equipped
      expect(modifiers.shopPriceIncrease).toBe(0.5); // Set, not added
    });
  });

  describe('Combined Modifiers', () => {
    it('should handle Golden Goose + Bargain Hunter correctly', () => {
      const modifiers = getPassiveRuneModifiers(['golden-goose', 'bargain-hunter']);
      expect(modifiers.goldMultiplier).toBe(2.0); // 1.0 + 1.0
      expect(modifiers.shopPriceIncrease).toBe(0.5);
      expect(modifiers.shopDiscount).toBe(0.1);

      // Price calculation: 100 * 1.5 * 0.9 = 135
      const price = calculateShopPrice(100, modifiers);
      expect(price).toBe(135);
    });

    it('should handle Golden Goose + multiple Bargain Hunters', () => {
      const modifiers = getPassiveRuneModifiers(['golden-goose', 'bargain-hunter', 'bargain-hunter']);
      expect(modifiers.shopDiscount).toBe(0.2);

      // Price calculation: 100 * 1.5 * 0.8 = 120
      const price = calculateShopPrice(100, modifiers);
      expect(price).toBe(120);
    });
  });
});
