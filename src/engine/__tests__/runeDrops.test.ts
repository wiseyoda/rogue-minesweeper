/**
 * Tests for tile-based rune drop helpers.
 * @module engine/__tests__/runeDrops.test
 */

import { describe, it, expect } from 'vitest';
import {
  TILE_RUNE_DROP_BASE_CHANCE,
  TILE_RUNE_DROP_MAX_CHANCE,
  TILE_RUNE_DROP_MAX_PER_FLOOR,
  getTileRuneDropChance,
  shouldDropRuneFromTile,
} from '../runes';

describe('tile rune drop helpers', () => {
  describe('getTileRuneDropChance', () => {
    it('returns base chance on floor 1', () => {
      expect(getTileRuneDropChance(1)).toBe(TILE_RUNE_DROP_BASE_CHANCE);
    });

    it('scales up with higher floor levels', () => {
      expect(getTileRuneDropChance(5)).toBeGreaterThan(getTileRuneDropChance(1));
    });

    it('caps chance at the configured maximum', () => {
      expect(getTileRuneDropChance(999)).toBe(TILE_RUNE_DROP_MAX_CHANCE);
    });
  });

  describe('shouldDropRuneFromTile', () => {
    it('returns false when per-floor drop cap is reached', () => {
      const dropped = shouldDropRuneFromTile(1, TILE_RUNE_DROP_MAX_PER_FLOOR, () => 0);
      expect(dropped).toBe(false);
    });

    it('supports deterministic true path via injected rng', () => {
      const dropped = shouldDropRuneFromTile(1, 0, () => 0);
      expect(dropped).toBe(true);
    });

    it('supports deterministic false path via injected rng', () => {
      const dropped = shouldDropRuneFromTile(1, 0, () => 0.99);
      expect(dropped).toBe(false);
    });
  });
});
