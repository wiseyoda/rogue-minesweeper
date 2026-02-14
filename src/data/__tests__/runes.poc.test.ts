/**
 * Rune catalog POC coverage tests.
 * @module data/__tests__/runes.poc.test
 */

import { describe, it, expect } from 'vitest';
import {
  RUNES,
  MINIMUM_POC_RUNE_COUNT,
  RUNE_CATEGORIES_FOR_POC,
  getRuneCatalogSummary,
  getRune,
} from '../runes';
import { SYNERGIES } from '../synergies';

describe('runes POC catalog invariants', () => {
  it('should have at least the minimum rune count for the POC gate', () => {
    expect(RUNES.length).toBeGreaterThanOrEqual(MINIMUM_POC_RUNE_COUNT);
  });

  it('should keep rune IDs unique', () => {
    const ids = RUNES.map((rune) => rune.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should represent every required rune category for build diversity', () => {
    const categories = new Set(RUNES.map((rune) => rune.category));
    for (const category of RUNE_CATEGORIES_FOR_POC) {
      expect(categories.has(category)).toBe(true);
    }
  });

  it('should report accurate catalog summary counts', () => {
    const summary = getRuneCatalogSummary();
    expect(summary.totalRunes).toBe(RUNES.length);

    const categoryTotal = Object.values(summary.byCategory).reduce(
      (acc, count) => acc + count,
      0
    );
    expect(categoryTotal).toBe(summary.totalRunes);
  });

  it('should provide enough rune depth for core build archetypes', () => {
    const summary = getRuneCatalogSummary();
    expect(summary.byCategory.information).toBeGreaterThanOrEqual(3);
    expect(summary.byCategory.defense).toBeGreaterThanOrEqual(3);
    expect(summary.byCategory.economy).toBeGreaterThanOrEqual(3);
  });

  it('should expose synergy coverage for information, defense, and economy archetypes', () => {
    const hasSynergyForCategory = (category: 'information' | 'defense' | 'economy') =>
      SYNERGIES.some((synergy) =>
        synergy.requiredRunes.some((runeId) => getRune(runeId)?.category === category)
      );

    expect(hasSynergyForCategory('information')).toBe(true);
    expect(hasSynergyForCategory('defense')).toBe(true);
    expect(hasSynergyForCategory('economy')).toBe(true);
  });

  it('should include at least one cross-category synergy for hybrid builds', () => {
    const crossCategorySynergies = SYNERGIES.filter((synergy) => {
      const categories = new Set(
        synergy.requiredRunes
          .map((runeId) => getRune(runeId)?.category)
          .filter((category): category is NonNullable<typeof category> => category !== undefined)
      );
      return categories.size >= 2;
    });

    expect(crossCategorySynergies.length).toBeGreaterThan(0);
  });
});
