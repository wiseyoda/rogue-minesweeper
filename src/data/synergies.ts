/**
 * Rune synergy definitions and helpers.
 * @module data/synergies
 */

export interface SynergyEffect {
  /** Additional safe tiles revealed at floor start. */
  extraFloorStartReveals?: number;
  /** Multiplier applied to floor completion bonus (1.0 = no change). */
  floorBonusMultiplier?: number;
  /** Additional HP left after Second Chance triggers. */
  extraSecondChanceHp?: number;
  /** If true, prophecy highlight always triggers at floor start. */
  guaranteedProphecy?: boolean;
  /** Additional shields granted at floor start. */
  extraFloorStartShields?: number;
  /** Additional shop discount (0.05 = +5%). */
  extraShopDiscount?: number;
}

export interface SynergyDefinition {
  /** Stable synergy ID. */
  id: string;
  /** Display name shown in UI. */
  name: string;
  /** Human-readable effect summary. */
  description: string;
  /** Rune IDs required to activate this synergy. */
  requiredRunes: string[];
  /** Passive synergy effects. */
  effect: SynergyEffect;
}

/**
 * Fixed synergy set for phase 3050.
 */
export const SYNERGIES: SynergyDefinition[] = [
  {
    id: 'hunters-vision',
    name: "Hunter's Vision",
    description: '+1 safe reveal at floor start',
    requiredRunes: ['scout-eye', 'omniscience'],
    effect: {
      extraFloorStartReveals: 1,
    },
  },
  {
    id: 'greedy',
    name: 'Greedy',
    description: '+50% floor completion bonus',
    requiredRunes: ['lucky-coin', 'treasure-hunter'],
    effect: {
      floorBonusMultiplier: 1.5,
    },
  },
  {
    id: 'immortal',
    name: 'Immortal',
    description: 'Second Chance leaves +1 additional HP',
    requiredRunes: ['undying', 'second-chance'],
    effect: {
      extraSecondChanceHp: 1,
    },
  },
  {
    id: 'seer',
    name: 'Seer',
    description: 'Prophecy always triggers at floor start',
    requiredRunes: ['prophecy', 'danger-sense'],
    effect: {
      guaranteedProphecy: true,
    },
  },
  {
    id: 'fortified-deal',
    name: 'Fortified Deal',
    description: '+1 shield at floor start and +5% shop discount',
    requiredRunes: ['shield-bearer', 'bargain-hunter'],
    effect: {
      extraFloorStartShields: 1,
      extraShopDiscount: 0.05,
    },
  },
];

/**
 * Get a synergy by ID.
 */
export function getSynergy(id: string): SynergyDefinition | undefined {
  return SYNERGIES.find((synergy) => synergy.id === id);
}

/**
 * Get all synergy definitions.
 */
export function getAllSynergies(): SynergyDefinition[] {
  return SYNERGIES;
}
