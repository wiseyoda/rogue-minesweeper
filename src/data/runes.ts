/**
 * Rune definitions for the rune framework.
 * @module data/runes
 */

import type { RuneDefinition } from '@/types';

/**
 * All available runes in the game.
 * Organized by category for easy filtering.
 */
export const RUNES: RuneDefinition[] = [
  // === INFORMATION RUNES ===
  {
    id: 'scout-eye',
    name: "Scout's Eye",
    description: 'Reveal 2 safe tiles at floor start',
    category: 'information',
    rarity: 'uncommon',
    icon: '👁️',
    effect: {
      trigger: 'onFloorStart',
      description: 'Reveal 2 safe tiles',
      magnitude: 2,
    },
    stackable: true,
    cost: 50,
  },
  {
    id: 'oracle-sight',
    name: "Oracle's Sight",
    description: '10% chance to reveal bonus tile',
    category: 'information',
    rarity: 'uncommon',
    icon: '🔮',
    effect: {
      trigger: 'onReveal',
      description: '10% bonus reveal',
      magnitude: 0.1,
    },
    stackable: true,
    cost: 65,
  },
  {
    id: 'danger-sense',
    name: 'Danger Sense',
    description: 'See danger numbers for tiles 2 squares away',
    category: 'information',
    rarity: 'common',
    icon: '⚠️',
    effect: {
      trigger: 'passive',
      description: 'Extended danger vision',
    },
    stackable: false,
    cost: 30,
  },
  {
    id: 'prophecy',
    name: 'Prophecy',
    description: '20% chance to highlight the safest tile',
    category: 'information',
    rarity: 'rare',
    icon: '🌟',
    effect: {
      trigger: 'onFloorStart',
      description: '20% chance to mark safest tile',
      magnitude: 0.2,
    },
    stackable: false,
    cost: 80,
  },
  {
    id: 'omniscience',
    name: 'Omniscience',
    description: '15% chance per monster to reveal its location',
    category: 'information',
    rarity: 'legendary',
    icon: '👁️‍🗨️',
    effect: {
      trigger: 'onFloorStart',
      description: '15% chance to mark each monster',
      magnitude: 0.15,
    },
    stackable: false,
    cost: 150,
  },

  // === DEFENSE RUNES ===
  {
    id: 'stone-skin',
    name: 'Stone Skin',
    description: 'First hit each floor reduced by 1',
    category: 'defense',
    rarity: 'uncommon',
    icon: '🪨',
    effect: {
      trigger: 'passive',
      description: '-1 first damage per floor',
      magnitude: 1,
    },
    stackable: true,
    cost: 40,
  },
  {
    id: 'lucky-charm',
    name: 'Lucky Charm',
    description: '20% chance to negate damage',
    category: 'defense',
    rarity: 'uncommon',
    icon: '🍀',
    effect: {
      trigger: 'onDamage',
      description: '20% dodge chance',
      magnitude: 0.2,
    },
    stackable: false,
    cost: 60,
  },
  {
    id: 'hardy',
    name: 'Hardy',
    description: '+1 Max HP',
    category: 'defense',
    rarity: 'common',
    icon: '❤️',
    effect: {
      trigger: 'passive',
      description: '+1 Max HP',
      magnitude: 1,
    },
    stackable: true,
    cost: 35,
  },
  {
    id: 'shield-bearer',
    name: 'Shield Bearer',
    description: '+1 Shield at floor start',
    category: 'defense',
    rarity: 'common',
    icon: '🛡️',
    effect: {
      trigger: 'onFloorStart',
      description: '+1 Shield at floor start',
      magnitude: 1,
    },
    stackable: true,
    cost: 40,
  },
  {
    id: 'iron-skin',
    name: 'Iron Skin',
    description: '25% damage reduction',
    category: 'defense',
    rarity: 'uncommon',
    icon: '🔩',
    effect: {
      trigger: 'onDamage',
      description: '25% damage reduction',
      magnitude: 0.25,
    },
    stackable: false,
    cost: 55,
  },
  {
    id: 'undying',
    name: 'Undying',
    description: 'Heal 1 HP every 50 reveals',
    category: 'defense',
    rarity: 'legendary',
    icon: '💀',
    effect: {
      trigger: 'onReveal',
      description: 'Heal 1 HP per 50 reveals',
      magnitude: 50,
    },
    stackable: false,
    cost: 150,
  },

  // === ECONOMY RUNES ===
  {
    id: 'midas-touch',
    name: 'Midas Touch',
    description: '+25% gold from all sources',
    category: 'economy',
    rarity: 'rare',
    icon: '✨',
    effect: {
      trigger: 'passive',
      description: '+25% gold',
      magnitude: 0.25,
    },
    stackable: true,
    cost: 60,
  },
  {
    id: 'treasure-sense',
    name: 'Treasure Sense',
    description: 'Reveal 1 safe tile at floor start',
    category: 'economy',
    rarity: 'common',
    icon: '💎',
    effect: {
      trigger: 'onFloorStart',
      description: 'Reveal 1 safe tile',
      magnitude: 1,
    },
    stackable: true,
    cost: 30,
  },
  {
    id: 'lucky-coin',
    name: 'Lucky Coin',
    description: '10% chance per tile to double gold',
    category: 'economy',
    rarity: 'common',
    icon: '🪙',
    effect: {
      trigger: 'onReveal',
      description: '10% double gold per tile',
      magnitude: 0.1,
    },
    stackable: true,
    cost: 25,
  },
  {
    id: 'bargain-hunter',
    name: 'Bargain Hunter',
    description: '10% discount on all shop prices',
    category: 'economy',
    rarity: 'common',
    icon: '🏷️',
    effect: {
      trigger: 'passive',
      description: '10% shop discount',
      magnitude: 0.1,
    },
    stackable: true,
    cost: 30,
  },
  {
    id: 'treasure-hunter',
    name: 'Treasure Hunter',
    description: '20% chance for gold cache on floor completion',
    category: 'economy',
    rarity: 'uncommon',
    icon: '💰',
    effect: {
      trigger: 'onFloorStart',
      description: '20% gold cache chance',
      magnitude: 0.2,
    },
    stackable: true,
    cost: 45,
  },
  {
    id: 'golden-goose',
    name: 'Golden Goose',
    description: '+100% gold, +50% shop prices',
    category: 'economy',
    rarity: 'legendary',
    icon: '🪿',
    effect: {
      trigger: 'passive',
      description: 'Double gold, higher prices',
      magnitude: 1.0,
    },
    stackable: false,
    cost: 100,
  },

  // === UTILITY RUNES ===
  {
    id: 'swift-feet',
    name: 'Swift Feet',
    description: 'Auto-flag when number satisfied',
    category: 'utility',
    rarity: 'common',
    icon: '🏃',
    effect: {
      trigger: 'passive',
      description: 'Auto-flag satisfied numbers',
    },
    stackable: false,
    cost: 30,
  },
  {
    id: 'second-chance',
    name: 'Second Chance',
    description: 'Survive fatal damage once per run',
    category: 'utility',
    rarity: 'rare',
    icon: '💫',
    effect: {
      trigger: 'onDamage',
      description: 'Survive death once',
      magnitude: 1,
    },
    stackable: false,
    cost: 125,
  },
];

/**
 * Minimum rune count required for the rune system POC gate.
 */
export const MINIMUM_POC_RUNE_COUNT = 10;

/**
 * Categories expected to be represented for build diversity.
 */
export const RUNE_CATEGORIES_FOR_POC: RuneDefinition['category'][] = [
  'information',
  'defense',
  'economy',
  'utility',
];

export interface RuneCatalogSummary {
  totalRunes: number;
  byCategory: Record<RuneDefinition['category'], number>;
}

/**
 * Summarize rune catalog coverage for balancing and gate checks.
 */
export function getRuneCatalogSummary(): RuneCatalogSummary {
  const byCategory: Record<RuneDefinition['category'], number> = {
    information: 0,
    defense: 0,
    economy: 0,
    utility: 0,
  };

  for (const rune of RUNES) {
    byCategory[rune.category] += 1;
  }

  return {
    totalRunes: RUNES.length,
    byCategory,
  };
}

/**
 * Get a rune by its ID.
 */
export function getRune(id: string): RuneDefinition | undefined {
  return RUNES.find((r) => r.id === id);
}

/**
 * Get all rune IDs.
 */
export function getAllRuneIds(): string[] {
  return RUNES.map((r) => r.id);
}

/**
 * Get random runes for shop rewards.
 * @param count Number of runes to return
 * @param excludeIds Rune IDs to exclude (e.g., already equipped)
 */
export function getRandomRunes(count: number, excludeIds: string[] = []): RuneDefinition[] {
  const available = RUNES.filter((r) => !excludeIds.includes(r.id));
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Get runes by category.
 */
export function getRunesByCategory(category: RuneDefinition['category']): RuneDefinition[] {
  return RUNES.filter((r) => r.category === category);
}

/**
 * Check if player has a specific rune equipped.
 */
export function hasRune(equippedRunes: string[], runeId: string): boolean {
  return equippedRunes.includes(runeId);
}

/**
 * Count how many of a specific rune are equipped (for stacking).
 */
export function countRune(equippedRunes: string[], runeId: string): number {
  return equippedRunes.filter((id) => id === runeId).length;
}
