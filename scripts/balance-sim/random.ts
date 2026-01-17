/**
 * Seeded random number generator for reproducible simulations.
 * Uses mulberry32 algorithm for fast, decent quality randomness.
 * @module scripts/balance-sim/random
 */

/**
 * Random number generator interface.
 */
export interface Random {
  /** Get next random number in [0, 1) */
  next(): number;
  /** Get random integer in [min, max] inclusive */
  int(min: number, max: number): number;
  /** Pick random element from array */
  pick<T>(array: T[]): T | undefined;
  /** Pick random element with weights */
  weightedPick<T>(items: T[], weights: number[]): T | undefined;
  /** Shuffle array in place */
  shuffle<T>(array: T[]): T[];
  /** Get current seed */
  getSeed(): number;
}

/**
 * Create a seeded random number generator.
 * Uses mulberry32 algorithm.
 */
export function createRandom(seed?: number | null): Random {
  // If no seed provided, use current time
  let state = seed ?? Date.now();
  const originalSeed = state;

  /**
   * Mulberry32 PRNG - fast and good quality for simulations.
   */
  function mulberry32(): number {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  function next(): number {
    return mulberry32();
  }

  function int(min: number, max: number): number {
    return Math.floor(next() * (max - min + 1)) + min;
  }

  function pick<T>(array: T[]): T | undefined {
    if (array.length === 0) return undefined;
    return array[int(0, array.length - 1)];
  }

  function weightedPick<T>(items: T[], weights: number[]): T | undefined {
    if (items.length === 0 || weights.length === 0) return undefined;

    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let random = next() * totalWeight;

    for (let i = 0; i < items.length; i++) {
      const weight = weights[i] ?? 0;
      random -= weight;
      if (random <= 0) {
        return items[i];
      }
    }

    return items[0];
  }

  function shuffle<T>(array: T[]): T[] {
    // Fisher-Yates shuffle
    for (let i = array.length - 1; i > 0; i--) {
      const j = int(0, i);
      const temp = array[i];
      array[i] = array[j] as T;
      array[j] = temp as T;
    }
    return array;
  }

  function getSeed(): number {
    return originalSeed;
  }

  return {
    next,
    int,
    pick,
    weightedPick,
    shuffle,
    getSeed,
  };
}
