/**
 * Tests for difficulty scaling module.
 * @module engine/__tests__/difficulty.test
 */

import { describe, it, expect } from 'vitest';
import {
  DIFFICULTY_CONSTANTS,
  getFloorConfig,
  getMonsterDamage,
  type FloorConfig,
  type MonsterDamageConfig,
} from '../difficulty';

describe('DIFFICULTY_CONSTANTS', () => {
  it('should have all required constants', () => {
    expect(DIFFICULTY_CONSTANTS.baseGridSize).toBe(8);
    expect(DIFFICULTY_CONSTANTS.maxGridRows).toBe(20);
    expect(DIFFICULTY_CONSTANTS.maxGridCols).toBe(30);
    expect(DIFFICULTY_CONSTANTS.gridGrowthPerLevel).toBe(1);
    expect(DIFFICULTY_CONSTANTS.baseMonsterCount).toBe(5);
    expect(DIFFICULTY_CONSTANTS.monsterGrowthPerLevel).toBe(2.5);
    expect(DIFFICULTY_CONSTANTS.maxMonsterDensity).toBe(0.3);
    expect(DIFFICULTY_CONSTANTS.goldBonusPerLevel).toBe(10);
    expect(DIFFICULTY_CONSTANTS.baseDamage).toBe(1);
    expect(DIFFICULTY_CONSTANTS.damageGrowthPerLevel).toBe(0);
  });
});

describe('getFloorConfig', () => {
  it('should return correct config for level 1', () => {
    const config: FloorConfig = getFloorConfig(1);

    expect(config.rows).toBe(9); // 8 + 1 * 1
    expect(config.cols).toBe(9);
    expect(config.monsterCount).toBe(7); // 5 + floor(1 * 2.5) = 7
    expect(config.goldBonus).toBe(10); // 1 * 10
  });

  it('should return correct config for level 5', () => {
    const config: FloorConfig = getFloorConfig(5);

    expect(config.rows).toBe(13); // 8 + 5 * 1
    expect(config.cols).toBe(13);
    expect(config.monsterCount).toBe(17); // 5 + floor(5 * 2.5) = 17
    expect(config.goldBonus).toBe(50); // 5 * 10
  });

  it('should return correct config for level 10', () => {
    const config: FloorConfig = getFloorConfig(10);

    expect(config.rows).toBe(18); // 8 + 10 * 1
    expect(config.cols).toBe(18);
    expect(config.monsterCount).toBe(30); // 5 + floor(10 * 2.5) = 30
    expect(config.goldBonus).toBe(100); // 10 * 10
  });

  it('should cap grid size at maximum for level 20', () => {
    const config: FloorConfig = getFloorConfig(20);

    expect(config.rows).toBe(20); // capped at maxGridRows
    expect(config.cols).toBe(28); // 8 + 20 * 1 = 28, under maxGridCols
    expect(config.goldBonus).toBe(200); // 20 * 10
  });

  it('should cap grid size at maximum for level 30', () => {
    const config: FloorConfig = getFloorConfig(30);

    expect(config.rows).toBe(20); // capped at maxGridRows
    expect(config.cols).toBe(30); // capped at maxGridCols
    expect(config.goldBonus).toBe(300); // 30 * 10
  });

  it('should respect monster density cap', () => {
    const config: FloorConfig = getFloorConfig(100);

    const maxAllowed = Math.floor(config.rows * config.cols * 0.3);
    expect(config.monsterCount).toBeLessThanOrEqual(maxAllowed);
  });

  it('should handle edge case of level 0', () => {
    const config: FloorConfig = getFloorConfig(0);

    expect(config.rows).toBe(8); // 8 + 0 * 1
    expect(config.cols).toBe(8);
    expect(config.monsterCount).toBe(5); // 5 + floor(0 * 2.5) = 5
    expect(config.goldBonus).toBe(0); // 0 * 10
  });

  it('should scale gold bonus linearly', () => {
    expect(getFloorConfig(1).goldBonus).toBe(10);
    expect(getFloorConfig(2).goldBonus).toBe(20);
    expect(getFloorConfig(3).goldBonus).toBe(30);
    expect(getFloorConfig(10).goldBonus).toBe(100);
  });
});

describe('getMonsterDamage', () => {
  it('should return base damage of 1', () => {
    const config: MonsterDamageConfig = getMonsterDamage(1);

    expect(config.baseDamage).toBe(1);
    expect(config.scaledDamage).toBe(1); // No scaling implemented
  });

  it('should return same damage for all levels (scaling not implemented)', () => {
    expect(getMonsterDamage(1).scaledDamage).toBe(1);
    expect(getMonsterDamage(5).scaledDamage).toBe(1);
    expect(getMonsterDamage(10).scaledDamage).toBe(1);
    expect(getMonsterDamage(100).scaledDamage).toBe(1);
  });
});
