/**
 * Tests for rune synergy detection and modifiers.
 * @module engine/__tests__/synergies.test
 */

import { describe, it, expect } from 'vitest';
import {
  createDefaultSynergyModifiers,
  findActiveSynergyIds,
  findActiveSynergies,
  getNewlyDiscoveredSynergyIds,
  getSynergyModifiers,
} from '../synergies';

describe('findActiveSynergyIds', () => {
  it('activates Hunter\'s Vision when scout-eye and omniscience are equipped', () => {
    const result = findActiveSynergyIds(['scout-eye', 'omniscience']);
    expect(result).toContain('hunters-vision');
  });

  it('does not activate when required runes are incomplete', () => {
    const result = findActiveSynergyIds(['scout-eye']);
    expect(result).not.toContain('hunters-vision');
  });

  it('supports multiple active synergies at once', () => {
    const result = findActiveSynergyIds([
      'scout-eye',
      'omniscience',
      'lucky-coin',
      'treasure-hunter',
      'shield-bearer',
      'bargain-hunter',
    ]);

    expect(result).toContain('hunters-vision');
    expect(result).toContain('greedy');
    expect(result).toContain('fortified-deal');
  });

  it('is order-independent', () => {
    const forward = findActiveSynergyIds(['prophecy', 'danger-sense']);
    const reverse = findActiveSynergyIds(['danger-sense', 'prophecy']);
    expect(forward).toEqual(reverse);
  });
});

describe('findActiveSynergies', () => {
  it('returns full definitions for active synergies', () => {
    const synergies = findActiveSynergies(['lucky-coin', 'treasure-hunter']);
    expect(synergies).toHaveLength(1);
    expect(synergies[0]?.id).toBe('greedy');
    expect(synergies[0]?.name).toBe('Greedy');
  });
});

describe('getSynergyModifiers', () => {
  it('returns default modifiers when no synergies are active', () => {
    const modifiers = getSynergyModifiers([]);
    expect(modifiers).toEqual(createDefaultSynergyModifiers());
  });

  it('applies Greedy floor bonus multiplier', () => {
    const modifiers = getSynergyModifiers(['greedy']);
    expect(modifiers.floorBonusMultiplier).toBe(1.5);
  });

  it('applies Fortified Deal shield and shop discount bonuses', () => {
    const modifiers = getSynergyModifiers(['fortified-deal']);
    expect(modifiers.extraFloorStartShields).toBe(1);
    expect(modifiers.extraShopDiscount).toBeCloseTo(0.05);
  });

  it('applies Immortal second-chance HP bonus', () => {
    const modifiers = getSynergyModifiers(['immortal']);
    expect(modifiers.extraSecondChanceHp).toBe(1);
  });

  it('applies Seer guaranteed prophecy bonus', () => {
    const modifiers = getSynergyModifiers(['seer']);
    expect(modifiers.guaranteedProphecy).toBe(true);
  });

  it('aggregates multiple modifiers when multiple synergies are active', () => {
    const modifiers = getSynergyModifiers(['hunters-vision', 'greedy', 'fortified-deal']);
    expect(modifiers.extraFloorStartReveals).toBe(1);
    expect(modifiers.floorBonusMultiplier).toBe(1.5);
    expect(modifiers.extraFloorStartShields).toBe(1);
    expect(modifiers.extraShopDiscount).toBeCloseTo(0.05);
  });
});

describe('getNewlyDiscoveredSynergyIds', () => {
  it('returns active IDs that are not yet discovered', () => {
    const result = getNewlyDiscoveredSynergyIds(
      ['hunters-vision', 'greedy', 'seer'],
      ['hunters-vision']
    );
    expect(result).toEqual(['greedy', 'seer']);
  });

  it('returns empty array when no new discoveries exist', () => {
    const result = getNewlyDiscoveredSynergyIds(['greedy'], ['greedy']);
    expect(result).toEqual([]);
  });
});
