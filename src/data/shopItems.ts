/**
 * Shop item definitions and generation utilities.
 * @module data/shopItems
 */

import type { ShopItem, ItemRarity } from '@/types/item';
import { RARITY_WEIGHTS } from '@/types/item';

/**
 * Base reroll cost in gold.
 */
export const REROLL_BASE_COST = 50;

/**
 * Reroll cost increment per use (Balatro-style escalation).
 */
export const REROLL_INCREMENT = 25;

/**
 * Calculate reroll cost based on number of previous rerolls this shop visit.
 * @param rerollCount Number of times shop has been rerolled this visit
 * @returns Cost for the next reroll
 */
export function getRerollCost(rerollCount: number): number {
  return REROLL_BASE_COST + rerollCount * REROLL_INCREMENT;
}

/**
 * Number of items to generate for the shop.
 */
export const SHOP_ITEM_COUNT = 2;

/**
 * All available shop items.
 * Items are applied to PlayerState when purchased.
 */
export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'heal-potion',
    name: 'Heal Potion',
    description: 'Restore 1 HP',
    cost: 30,
    rarity: 'common',
    apply: (state) => {
      state.lives = Math.min(state.lives + 1, state.maxLives);
    },
  },
  {
    id: 'max-hp-up',
    name: 'Max HP Up',
    description: '+1 Max HP',
    cost: 80,
    rarity: 'uncommon',
    apply: (state) => {
      state.maxLives += 1;
      state.lives += 1;
    },
  },
  {
    id: 'shield-orb',
    name: 'Shield Orb',
    description: '+1 Shield (this floor only)',
    cost: 40,
    rarity: 'common',
    apply: (state) => {
      state.shields += 1;
    },
  },
  {
    id: 'gold-magnet',
    name: 'Gold Magnet',
    description: '2x gold next floor',
    cost: 60,
    rarity: 'rare',
    apply: (state) => {
      state.nextLevelBuffs.goldMagnet = true;
    },
  },
  {
    id: 'peek-scroll',
    name: 'Peek Scroll',
    description: '+1 Peek Scroll (peek at 1 tile)',
    cost: 50,
    rarity: 'uncommon',
    apply: (state) => {
      state.peekScrolls += 1;
    },
  },
  {
    id: 'reveal-scroll',
    name: 'Reveal Scroll',
    description: 'Reveal all logically safe tiles next floor',
    cost: 150,
    rarity: 'rare',
    apply: (state) => {
      state.nextLevelBuffs.revealScroll = true;
    },
  },
];

/**
 * Get shop item by ID.
 */
export function getShopItem(id: string): ShopItem | undefined {
  return SHOP_ITEMS.find((item) => item.id === id);
}

/**
 * Calculate total weight for rarity-based selection.
 */
function getTotalWeight(items: ShopItem[]): number {
  return items.reduce((sum, item) => {
    const rarity = item.rarity ?? 'common';
    return sum + RARITY_WEIGHTS[rarity];
  }, 0);
}

/**
 * Select a random item weighted by rarity.
 * @param items Available items to choose from
 * @returns Selected item
 */
function selectWeightedItem(items: ShopItem[]): ShopItem {
  // Safety check - should never be called with empty array
  if (items.length === 0) {
    throw new Error('selectWeightedItem called with empty items array');
  }

  const totalWeight = getTotalWeight(items);
  let random = Math.random() * totalWeight;

  for (const item of items) {
    const rarity = item.rarity ?? 'common';
    const weight = RARITY_WEIGHTS[rarity];
    random -= weight;
    if (random <= 0) {
      return item;
    }
  }

  // Fallback to first item (guaranteed to exist after safety check above)
  return items[0] as ShopItem;
}

/**
 * Generate a random selection of shop items.
 * Items are selected based on rarity weights with no duplicates.
 *
 * @param count Number of items to generate (default: SHOP_ITEM_COUNT)
 * @returns Array of selected shop items
 */
export function generateShopItems(count: number = SHOP_ITEM_COUNT): ShopItem[] {
  // Can't generate more items than available
  const maxCount = Math.min(count, SHOP_ITEMS.length);
  const selectedItems: ShopItem[] = [];
  const availableItems = [...SHOP_ITEMS];

  while (selectedItems.length < maxCount && availableItems.length > 0) {
    const selected = selectWeightedItem(availableItems);
    selectedItems.push(selected);

    // Remove selected item from available pool
    const index = availableItems.findIndex((item) => item.id === selected.id);
    if (index !== -1) {
      availableItems.splice(index, 1);
    }
  }

  return selectedItems;
}

/**
 * Group items by rarity for display or analysis.
 */
export function groupItemsByRarity(): Record<ItemRarity, ShopItem[]> {
  return {
    common: SHOP_ITEMS.filter((item) => item.rarity === 'common'),
    uncommon: SHOP_ITEMS.filter((item) => item.rarity === 'uncommon'),
    rare: SHOP_ITEMS.filter((item) => item.rarity === 'rare'),
    legendary: SHOP_ITEMS.filter((item) => item.rarity === 'legendary'),
  };
}
