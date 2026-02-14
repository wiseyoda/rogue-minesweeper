/**
 * Synergy detection and modifier aggregation.
 * @module engine/synergies
 */

import { getSynergy, SYNERGIES } from '@/data/synergies';
import type { SynergyDefinition } from '@/data/synergies';

export interface SynergyModifiers {
  /** Additional safe reveals granted at floor start. */
  extraFloorStartReveals: number;
  /** Floor completion bonus multiplier. */
  floorBonusMultiplier: number;
  /** Additional HP left by Second Chance. */
  extraSecondChanceHp: number;
  /** Force prophecy highlight at floor start. */
  guaranteedProphecy: boolean;
  /** Additional shields granted at floor start. */
  extraFloorStartShields: number;
  /** Additional shop discount. */
  extraShopDiscount: number;
}

/**
 * Create default synergy modifiers.
 */
export function createDefaultSynergyModifiers(): SynergyModifiers {
  return {
    extraFloorStartReveals: 0,
    floorBonusMultiplier: 1,
    extraSecondChanceHp: 0,
    guaranteedProphecy: false,
    extraFloorStartShields: 0,
    extraShopDiscount: 0,
  };
}

/**
 * Find all active synergies for a rune loadout.
 */
export function findActiveSynergyIds(equippedRunes: string[]): string[] {
  const equipped = new Set(equippedRunes);

  return SYNERGIES.filter((synergy) => synergy.requiredRunes.every((runeId) => equipped.has(runeId))).map(
    (synergy) => synergy.id
  );
}

/**
 * Get full synergy definitions for currently active synergies.
 */
export function findActiveSynergies(equippedRunes: string[]): SynergyDefinition[] {
  const activeIds = findActiveSynergyIds(equippedRunes);

  return activeIds
    .map((id) => getSynergy(id))
    .filter((synergy): synergy is SynergyDefinition => synergy !== undefined);
}

/**
 * Calculate combined modifiers from active synergies.
 */
export function getSynergyModifiers(activeSynergyIds: string[]): SynergyModifiers {
  const modifiers = createDefaultSynergyModifiers();

  for (const synergyId of activeSynergyIds) {
    const synergy = getSynergy(synergyId);
    if (!synergy) continue;

    if (synergy.effect.extraFloorStartReveals) {
      modifiers.extraFloorStartReveals += synergy.effect.extraFloorStartReveals;
    }

    if (synergy.effect.floorBonusMultiplier) {
      modifiers.floorBonusMultiplier *= synergy.effect.floorBonusMultiplier;
    }

    if (synergy.effect.extraSecondChanceHp) {
      modifiers.extraSecondChanceHp += synergy.effect.extraSecondChanceHp;
    }

    if (synergy.effect.guaranteedProphecy) {
      modifiers.guaranteedProphecy = true;
    }

    if (synergy.effect.extraFloorStartShields) {
      modifiers.extraFloorStartShields += synergy.effect.extraFloorStartShields;
    }

    if (synergy.effect.extraShopDiscount) {
      modifiers.extraShopDiscount += synergy.effect.extraShopDiscount;
    }
  }

  return modifiers;
}

/**
 * Return synergy IDs that are newly discovered this check.
 */
export function getNewlyDiscoveredSynergyIds(
  activeSynergyIds: string[],
  discoveredSynergyIds: string[]
): string[] {
  const discovered = new Set(discoveredSynergyIds);
  return activeSynergyIds.filter((id) => !discovered.has(id));
}
