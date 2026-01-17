/**
 * Rune type definitions for the rune framework.
 * @module types/rune
 */

/**
 * Rune categories aligned with game pillars.
 */
export type RuneCategory = 'information' | 'defense' | 'economy' | 'utility';

/**
 * Rune rarity tiers.
 */
export type RuneRarity = 'common' | 'uncommon' | 'rare' | 'legendary';

/**
 * When rune effects trigger.
 */
export type RuneTrigger = 'passive' | 'onReveal' | 'onFloorStart' | 'onDamage';

/**
 * Rune effect configuration.
 */
export interface RuneEffect {
  /** When this effect triggers */
  trigger: RuneTrigger;
  /** Human-readable effect description */
  description: string;
  /** Effect magnitude (percentage, count, etc.) */
  magnitude?: number;
}

/**
 * Complete rune definition.
 */
export interface RuneDefinition {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Full description shown in UI */
  description: string;
  /** Rune category for grouping/filtering */
  category: RuneCategory;
  /** Rarity tier */
  rarity: RuneRarity;
  /** Icon (emoji for POC) */
  icon: string;
  /** Effect configuration */
  effect: RuneEffect;
  /** Whether duplicates stack */
  stackable: boolean;
  /** Gold cost to purchase */
  cost: number;
}

/**
 * Passive rune modifiers applied during gameplay.
 */
export interface RuneModifiers {
  /** Gold multiplier (1.0 = no change) */
  goldMultiplier: number;
  /** Damage reduction for first hit per floor */
  firstHitReduction: number;
  /** Whether auto-flagging is enabled */
  autoFlag: boolean;
  /** Whether danger sense is active (shows extended danger numbers) */
  dangerSenseActive: boolean;
}

/**
 * Create default rune modifiers with no effects.
 */
export function createDefaultRuneModifiers(): RuneModifiers {
  return {
    goldMultiplier: 1.0,
    firstHitReduction: 0,
    autoFlag: false,
    dangerSenseActive: false,
  };
}
