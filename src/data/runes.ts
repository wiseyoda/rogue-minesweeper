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
    cost: 50,
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
    description: 'Highlights the safest tile to click',
    category: 'information',
    rarity: 'rare',
    icon: '🌟',
    effect: {
      trigger: 'onFloorStart',
      description: 'Mark safest tile',
    },
    stackable: false,
    cost: 80,
  },
  {
    id: 'omniscience',
    name: 'Omniscience',
    description: 'See all monster locations (not revealed)',
    category: 'information',
    rarity: 'legendary',
    icon: '👁️‍🗨️',
    effect: {
      trigger: 'onFloorStart',
      description: 'Reveal all monsters',
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
    rarity: 'common',
    icon: '🪨',
    effect: {
      trigger: 'passive',
      description: '-1 first damage per floor',
      magnitude: 1,
    },
    stackable: true,
    cost: 25,
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

  // === ECONOMY RUNES ===
  {
    id: 'midas-touch',
    name: 'Midas Touch',
    description: '+25% gold from all sources',
    category: 'economy',
    rarity: 'common',
    icon: '✨',
    effect: {
      trigger: 'passive',
      description: '+25% gold',
      magnitude: 0.25,
    },
    stackable: true,
    cost: 35,
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
    cost: 100,
  },
];

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
