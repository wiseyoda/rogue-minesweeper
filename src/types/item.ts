/**
 * Item and shop item types.
 * @module types/item
 */

import type { PlayerState, PlayerStats } from './player';

/**
 * Item rarity tiers.
 * Affects drop rates and typically power level.
 */
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'legendary';

/**
 * Rarity weights for random selection.
 * Higher values = more common.
 */
export const RARITY_WEIGHTS: Record<ItemRarity, number> = {
  common: 60,
  uncommon: 25,
  rare: 10,
  legendary: 5,
};

/**
 * A purchasable item in the inter-level shop.
 * Items have immediate or next-level effects.
 */
export interface ShopItem {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Effect description */
  description: string;
  /** Gold cost to purchase */
  cost: number;
  /** Rarity tier (affects shop appearance) */
  rarity?: ItemRarity;
  /**
   * Apply this item's effect.
   * @param state - Current player state (mutable)
   * @param stats - Permanent player stats (for reference)
   */
  apply: (state: PlayerState, stats: PlayerStats) => void;
}

/**
 * Pool of shop items organized by rarity.
 * Used for random shop generation.
 */
export interface ShopItemPool {
  common: ShopItem[];
  uncommon: ShopItem[];
  rare: ShopItem[];
  legendary: ShopItem[];
}

/**
 * A shop item with display metadata for rendering.
 * Extended during shop population.
 */
export interface ShopItemDisplay extends ShopItem {
  /** CSS class for rarity styling */
  rarityClass: string;
  /** Resolved rarity for display */
  displayRarity: ItemRarity;
}

/**
 * Gets the CSS class for a rarity tier.
 */
export function getRarityClass(rarity: ItemRarity): string {
  return `rarity-${rarity}`;
}
