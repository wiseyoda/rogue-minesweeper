/**
 * Tests for defense rune effects.
 * @module engine/__tests__/defenseRunes.test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  applyOnDamageRunes,
  applyOnFloorStartRunes,
  getPassiveRuneModifiers,
  checkUndyingHeal,
} from '../runes';
import type { Grid } from '@/types';

// Helper to create a simple test grid
function createTestGrid(rows: number, cols: number, monsterPositions: Array<{row: number, col: number}> = []): Grid {
  const grid: Grid = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      const isMonster = monsterPositions.some(p => p.row === r && p.col === c);
      row.push({
        isRevealed: false,
        isMonster,
        isFlagged: false,
        adjacentMonsters: 0,
      });
    }
    grid.push(row);
  }
  return grid;
}

describe('Hardy rune', () => {
  it('should add maxLivesBonus to modifiers', () => {
    const modifiers = getPassiveRuneModifiers(['hardy']);
    expect(modifiers.maxLivesBonus).toBe(1);
  });

  it('should stack maxLivesBonus for multiple Hardy runes', () => {
    const modifiers = getPassiveRuneModifiers(['hardy', 'hardy']);
    expect(modifiers.maxLivesBonus).toBe(2);
  });

  it('should not affect modifiers without Hardy', () => {
    const modifiers = getPassiveRuneModifiers(['stone-skin', 'lucky-charm']);
    expect(modifiers.maxLivesBonus).toBe(0);
  });
});

describe('Shield Bearer rune', () => {
  it('should grant shields at floor start', () => {
    const grid = createTestGrid(5, 5, [{row: 2, col: 2}]);
    const result = applyOnFloorStartRunes(grid, ['shield-bearer']);
    expect(result.shieldsGranted).toBe(1);
  });

  it('should stack shields for multiple Shield Bearer runes', () => {
    const grid = createTestGrid(5, 5, [{row: 2, col: 2}]);
    const result = applyOnFloorStartRunes(grid, ['shield-bearer', 'shield-bearer']);
    expect(result.shieldsGranted).toBe(2);
  });

  it('should not grant shields without Shield Bearer', () => {
    const grid = createTestGrid(5, 5, [{row: 2, col: 2}]);
    const result = applyOnFloorStartRunes(grid, ['stone-skin']);
    expect(result.shieldsGranted).toBe(0);
  });
});

describe('Iron Skin rune', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should reduce damage by 25%', () => {
    // 4 damage * 0.75 = 3
    const result = applyOnDamageRunes(4, ['iron-skin'], false, false, 5);
    expect(result.finalDamage).toBe(3);
  });

  it('should have minimum damage of 1', () => {
    // 1 damage * 0.75 = 0.75, should be clamped to 1
    const result = applyOnDamageRunes(1, ['iron-skin'], false, false, 5);
    expect(result.finalDamage).toBe(1);
  });

  it('should apply after Stone Skin', () => {
    // First hit: Stone Skin reduces 2 -> 1, then Iron Skin: 1 * 0.75 = 0.75 -> 1 (minimum)
    const result = applyOnDamageRunes(2, ['stone-skin', 'iron-skin'], true, false, 5);
    expect(result.finalDamage).toBe(1);
  });

  it('should apply before Lucky Charm', () => {
    // Mock random to always trigger Lucky Charm (returns < 0.2)
    vi.spyOn(Math, 'random').mockReturnValue(0.1);

    // 4 damage, Iron Skin: 4 * 0.75 = 3, Lucky Charm: negates
    const result = applyOnDamageRunes(4, ['iron-skin', 'lucky-charm'], false, false, 5);
    expect(result.finalDamage).toBe(0);
    expect(result.damageNegated).toBe(true);
  });
});

describe('Undying rune', () => {
  it('should track reveal count', () => {
    const result = checkUndyingHeal(['undying'], 0, 10);
    expect(result.newRevealCount).toBe(10);
    expect(result.shouldHeal).toBe(false);
  });

  it('should trigger heal at 50 reveals', () => {
    const result = checkUndyingHeal(['undying'], 45, 5);
    expect(result.shouldHeal).toBe(true);
    expect(result.newRevealCount).toBe(0); // Reset to 0 after heal
  });

  it('should carry over excess reveals after heal', () => {
    const result = checkUndyingHeal(['undying'], 45, 10);
    expect(result.shouldHeal).toBe(true);
    expect(result.newRevealCount).toBe(5); // 55 - 50 = 5
  });

  it('should persist count across multiple checks', () => {
    // Simulate floor 1: 35 reveals
    const result1 = checkUndyingHeal(['undying'], 0, 35);
    expect(result1.newRevealCount).toBe(35);
    expect(result1.shouldHeal).toBe(false);

    // Simulate floor 2: 15 more reveals (total 50)
    const result2 = checkUndyingHeal(['undying'], result1.newRevealCount, 15);
    expect(result2.shouldHeal).toBe(true);
    expect(result2.newRevealCount).toBe(0);
  });

  it('should not track without Undying rune', () => {
    const result = checkUndyingHeal(['stone-skin'], 0, 100);
    expect(result.newRevealCount).toBe(0);
    expect(result.shouldHeal).toBe(false);
  });
});

describe('Damage pipeline order', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should apply Stone Skin -> Iron Skin -> Lucky Charm -> Second Chance', () => {
    // Mock random to NOT trigger Lucky Charm
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    // 4 damage, first hit:
    // 1. Stone Skin: 4 - 1 = 3
    // 2. Iron Skin: 3 * 0.75 = 2.25 -> 2
    // 3. Lucky Charm: 50% random, doesn't proc
    // 4. Second Chance: not fatal
    const result = applyOnDamageRunes(
      4,
      ['stone-skin', 'iron-skin', 'lucky-charm', 'second-chance'],
      true, // first damage
      true, // second chance available
      5
    );

    expect(result.finalDamage).toBe(2);
    expect(result.damageNegated).toBe(false);
    expect(result.secondChanceUsed).toBe(false);
  });

  it('should trigger Second Chance on fatal damage', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    // 3 damage with 2 lives = fatal, Second Chance saves
    const result = applyOnDamageRunes(
      3,
      ['second-chance'],
      false,
      true, // second chance available
      2 // current lives
    );

    expect(result.finalDamage).toBe(1); // Reduced to leave 1 HP
    expect(result.secondChanceUsed).toBe(true);
  });
});
