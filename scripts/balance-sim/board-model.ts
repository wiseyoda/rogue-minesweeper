/**
 * Board simulation for Monte Carlo balance testing.
 *
 * Uses a real minesweeper solver that:
 * 1. Generates actual boards with mines
 * 2. Uses constraint-based deduction to reveal safe cells
 * 3. Only guesses when logically stuck
 * 4. Calculates actual probabilities for ambiguous cells
 *
 * This provides accurate simulation of skilled player behavior.
 *
 * @module scripts/balance-sim/board-model
 */

import { GAME_CONSTANTS } from './config.ts';
import type { Random } from './random.ts';
import { solveBoard } from './solver.ts';

/**
 * Floor configuration derived from level.
 */
export interface FloorConfig {
  level: number;
  rows: number;
  cols: number;
  totalCells: number;
  monsterCount: number;
  safeCells: number;
  monsterDensity: number;
  goldBonus: number;
}

/**
 * Result of simulating a floor clear attempt.
 */
export interface BoardSimResult {
  cleared: boolean;
  tilesRevealed: number;
  monstersHit: number;
  goldFromTiles: number;
  forcedGuesses: number;
}

/**
 * Calculate floor configuration for a given level.
 */
export function getFloorConfig(level: number): FloorConfig {
  const {
    baseGridSize,
    maxGridRows,
    maxGridCols,
    gridGrowthPerLevel,
    baseMonsterCount,
    monsterGrowthPerLevel,
    maxMonsterDensity,
    goldBonusPerLevel,
  } = GAME_CONSTANTS;

  const rows = Math.min(baseGridSize + level * gridGrowthPerLevel, maxGridRows);
  const cols = Math.min(baseGridSize + level * gridGrowthPerLevel, maxGridCols);
  const totalCells = rows * cols;

  const monsterCount = Math.min(
    baseMonsterCount + Math.floor(level * monsterGrowthPerLevel),
    Math.floor(totalCells * maxMonsterDensity)
  );

  const safeCells = totalCells - monsterCount;
  const monsterDensity = monsterCount / totalCells;
  const goldBonus = level * goldBonusPerLevel;

  return {
    level,
    rows,
    cols,
    totalCells,
    monsterCount,
    safeCells,
    monsterDensity,
    goldBonus,
  };
}

/**
 * Simulate attempting to clear a floor using the real solver.
 *
 * This generates an actual minesweeper board, applies logical deduction,
 * and only makes guesses when truly stuck. Much more accurate than heuristics.
 */
export function simulateFloorClear(
  config: FloorConfig,
  availableHits: number,
  random: Random,
  revealedAtStart: number = 0
): BoardSimResult {
  // Use the real solver
  const result = solveBoard(
    config.rows,
    config.cols,
    config.monsterCount,
    random,
    availableHits,
    revealedAtStart
  );

  const goldFromTiles = result.tilesRevealed * GAME_CONSTANTS.goldPerTile;

  return {
    cleared: result.cleared,
    tilesRevealed: result.tilesRevealed,
    monstersHit: result.minesHit,
    goldFromTiles,
    forcedGuesses: result.guessesRequired,
  };
}

/**
 * Calculate expected monster hits to clear a floor.
 * Useful for difficulty analysis.
 */
export function expectedMonstersHit(config: FloorConfig): number {
  // Rough estimate based on density
  const expectedGuesses = 0.3 * Math.pow(config.monsterDensity / 0.15, 2);
  const avgHitRate = 0.35; // 1 - base success rate

  return expectedGuesses * avgHitRate;
}

/**
 * Calculate probability of surviving a floor given available hits.
 * Uses simulation to estimate.
 */
export function survivalProbability(
  config: FloorConfig,
  availableHits: number,
  sampleSize: number,
  random: Random
): number {
  let survivals = 0;

  for (let i = 0; i < sampleSize; i++) {
    const result = simulateFloorClear(config, availableHits, random);
    if (result.cleared) {
      survivals++;
    }
  }

  return survivals / sampleSize;
}
