/**
 * Metrics tracking and aggregation for simulation results.
 * @module scripts/balance-sim/metrics
 */

import type {
  RunResult,
  SessionResult,
  AggregatedStats,
  SessionAggregatedStats,
  BalanceWarning,
} from './types.ts';
import { GAME_CONSTANTS } from './config.ts';

/**
 * Calculate percentile value from sorted array.
 */
function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, Math.min(index, sorted.length - 1))] ?? 0;
}

/**
 * Calculate mean of array.
 */
function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/**
 * Calculate standard deviation.
 */
function stdDev(values: number[]): number {
  if (values.length === 0) return 0;
  const avg = mean(values);
  const squaredDiffs = values.map((v) => Math.pow(v - avg, 2));
  return Math.sqrt(mean(squaredDiffs));
}

/**
 * Aggregate results from multiple simulation runs.
 */
export function aggregateRunResults(runs: RunResult[]): AggregatedStats {
  if (runs.length === 0) {
    return createEmptyStats();
  }

  // Floor progression stats
  const floors = runs.map((r) => r.finalFloor).sort((a, b) => a - b);
  const floorStats = {
    mean: mean(floors),
    median: percentile(floors, 50),
    min: floors[0] ?? 0,
    max: floors[floors.length - 1] ?? 0,
    p10: percentile(floors, 10),
    p25: percentile(floors, 25),
    p75: percentile(floors, 75),
    p90: percentile(floors, 90),
    stdDev: stdDev(floors),
  };

  // Death distribution by floor
  const deathsByFloor: Record<number, number> = {};
  for (const run of runs) {
    deathsByFloor[run.finalFloor] = (deathsByFloor[run.finalFloor] ?? 0) + 1;
  }

  // Gold stats
  const goldValues = runs.map((r) => r.totalGoldEarned).sort((a, b) => a - b);
  const goldStats = {
    mean: mean(goldValues),
    median: percentile(goldValues, 50),
    min: goldValues[0] ?? 0,
    max: goldValues[goldValues.length - 1] ?? 0,
    stdDev: stdDev(goldValues),
  };

  // Gold per floor
  const goldByFloor: Record<number, number[]> = {};
  for (const run of runs) {
    for (const floor of run.floorResults) {
      if (!goldByFloor[floor.floor]) {
        goldByFloor[floor.floor] = [];
      }
      goldByFloor[floor.floor]?.push(floor.goldEarned);
    }
  }
  const goldPerFloor: Record<number, { mean: number; samples: number }> = {};
  for (const [floor, values] of Object.entries(goldByFloor)) {
    goldPerFloor[parseInt(floor)] = {
      mean: mean(values),
      samples: values.length,
    };
  }

  // Item purchase rates
  const itemCounts: Record<string, number> = {};
  const itemByFloor: Record<string, Record<number, number>> = {};

  for (const run of runs) {
    for (const [itemId, count] of Object.entries(run.itemPurchaseCounts)) {
      itemCounts[itemId] = (itemCounts[itemId] ?? 0) + count;
    }
    for (const floor of run.floorResults) {
      for (const itemId of floor.itemsPurchased) {
        if (!itemByFloor[itemId]) {
          itemByFloor[itemId] = {};
        }
        const floorMap = itemByFloor[itemId];
        if (floorMap) {
          floorMap[floor.floor] = (floorMap[floor.floor] ?? 0) + 1;
        }
      }
    }
  }

  const itemPurchaseRate: Record<string, number> = {};
  for (const [itemId, count] of Object.entries(itemCounts)) {
    itemPurchaseRate[itemId] = count / runs.length;
  }

  // Survival metrics
  const totalDamageBlocked = runs.reduce((sum, r) => sum + r.totalDamageBlocked, 0);
  const totalDamageTaken = runs.reduce((sum, r) => sum + r.totalDamageTaken, 0);

  // Survival rate by floor
  const survivalRateByFloor: Record<number, number> = {};
  const maxFloor = Math.max(...floors);
  for (let floor = 1; floor <= maxFloor; floor++) {
    const reachedFloor = runs.filter((r) => r.finalFloor >= floor).length;
    survivalRateByFloor[floor] = reachedFloor / runs.length;
  }

  return {
    runCount: runs.length,
    floorReached: floorStats,
    deathsByFloor,
    goldPerRun: goldStats,
    goldPerFloor,
    itemPurchaseRate,
    itemPurchaseByFloor: itemByFloor,
    averageDamageBlocked: totalDamageBlocked / runs.length,
    averageDamageTaken: totalDamageTaken / runs.length,
    survivalRateByFloor,
  };
}

/**
 * Aggregate results from session mode simulations.
 */
export function aggregateSessionResults(sessions: SessionResult[]): SessionAggregatedStats {
  // Flatten all runs for base stats
  const allRuns = sessions.flatMap((s) => s.runs);
  const baseStats = aggregateRunResults(allRuns);

  // Meta-progression stats
  const upgradeAdoptionRate: Record<string, number> = {};
  const upgradePurchaseCounts: Record<string, number[]> = {};

  for (const session of sessions) {
    for (const [upgradeId, count] of Object.entries(session.upgradesPurchased)) {
      if (!upgradePurchaseCounts[upgradeId]) {
        upgradePurchaseCounts[upgradeId] = [];
      }
      upgradePurchaseCounts[upgradeId]?.push(count);
    }
  }

  for (const [upgradeId, counts] of Object.entries(upgradePurchaseCounts)) {
    const totalPurchased = counts.reduce((sum, c) => sum + c, 0);
    upgradeAdoptionRate[upgradeId] = totalPurchased / sessions.length;
  }

  // Average runs to max each upgrade (rough estimate)
  const averageRunsToMaxUpgrade: Record<string, number> = {};
  for (const upgradeId of Object.keys(GAME_CONSTANTS.upgrades)) {
    const config = GAME_CONSTANTS.upgrades[upgradeId];
    if (config?.maxLevel) {
      // Estimate based on average gold per run and cost curve
      const avgGoldPerRun = baseStats.goldPerRun.mean;
      let totalCost = 0;
      for (let level = 0; level < config.maxLevel; level++) {
        totalCost += config.baseCost * Math.pow(config.costIncrease ?? 2, level);
      }
      averageRunsToMaxUpgrade[upgradeId] = avgGoldPerRun > 0 ? totalCost / avgGoldPerRun : Infinity;
    }
  }

  // Meta gold efficiency
  const totalMetaGoldEarned = sessions.reduce((sum, s) => sum + s.totalMetaGoldEarned, 0);
  const totalMetaGoldSpent = sessions.reduce((sum, s) => sum + s.totalMetaGoldSpent, 0);
  const metaGoldEfficiency = totalMetaGoldEarned > 0 ? totalMetaGoldSpent / totalMetaGoldEarned : 0;

  return {
    ...baseStats,
    upgradeAdoptionRate,
    averageRunsToMaxUpgrade,
    metaGoldEfficiency,
  };
}

/**
 * Create empty stats object.
 */
function createEmptyStats(): AggregatedStats {
  return {
    runCount: 0,
    floorReached: {
      mean: 0,
      median: 0,
      min: 0,
      max: 0,
      p10: 0,
      p25: 0,
      p75: 0,
      p90: 0,
      stdDev: 0,
    },
    deathsByFloor: {},
    goldPerRun: { mean: 0, median: 0, min: 0, max: 0, stdDev: 0 },
    goldPerFloor: {},
    itemPurchaseRate: {},
    itemPurchaseByFloor: {},
    averageDamageBlocked: 0,
    averageDamageTaken: 0,
    survivalRateByFloor: {},
  };
}

/**
 * Analyze stats and generate balance warnings.
 */
export function analyzeBalance(stats: AggregatedStats): BalanceWarning[] {
  const warnings: BalanceWarning[] = [];

  // Check for difficulty spikes
  const survivalFloors = Object.entries(stats.survivalRateByFloor).sort(
    ([a], [b]) => parseInt(a) - parseInt(b)
  );

  for (let i = 1; i < survivalFloors.length; i++) {
    const [prevFloor, prevRate] = survivalFloors[i - 1] ?? [0, 1];
    const [currFloor, currRate] = survivalFloors[i] ?? [0, 1];

    if (prevRate !== undefined && currRate !== undefined) {
      const dropRate = prevRate - currRate;
      if (dropRate > 0.15) {
        warnings.push({
          severity: 'warning',
          category: 'progression',
          message: `Difficulty spike detected: Floor ${currFloor} has ${(dropRate * 100).toFixed(1)}% survival drop from Floor ${prevFloor}`,
          data: { floor: currFloor, prevFloor, dropRate },
        });
      }
    }
  }

  // Check for very low survival rates
  for (const [floor, rate] of Object.entries(stats.survivalRateByFloor)) {
    if (rate < 0.1 && parseInt(floor) < 15) {
      warnings.push({
        severity: 'critical',
        category: 'progression',
        message: `Floor ${floor} has <10% survival rate - may be too difficult`,
        data: { floor: parseInt(floor), survivalRate: rate },
      });
    }
  }

  // Check for item balance issues
  // Calculate purchases per floor to normalize for run length
  const avgFloors = stats.floorReached.mean;
  for (const [itemId, rate] of Object.entries(stats.itemPurchaseRate)) {
    const purchasesPerFloor = avgFloors > 0 ? rate / avgFloors : rate;

    // Flag if item is purchased more than once per floor on average
    if (purchasesPerFloor > 1.0) {
      warnings.push({
        severity: 'warning',
        category: 'items',
        message: `${itemId} purchased ${purchasesPerFloor.toFixed(2)}x per floor - potentially too strong`,
        data: { itemId, purchaseRate: rate, purchasesPerFloor },
      });
    }

    // Flag if item is rarely purchased (less than once per 10 floors)
    if (purchasesPerFloor < 0.1 && avgFloors >= 5) {
      warnings.push({
        severity: 'info',
        category: 'items',
        message: `${itemId} purchased only ${(purchasesPerFloor * 100).toFixed(0)}% of floors - may be overpriced or underpowered`,
        data: { itemId, purchaseRate: rate, purchasesPerFloor },
      });
    }
  }

  // Check average floor reached
  if (stats.floorReached.mean < 5) {
    warnings.push({
      severity: 'warning',
      category: 'progression',
      message: `Average run ends at floor ${stats.floorReached.mean.toFixed(1)} - game may be too difficult`,
      data: { averageFloor: stats.floorReached.mean },
    });
  }
  if (stats.floorReached.mean > 15) {
    warnings.push({
      severity: 'info',
      category: 'progression',
      message: `Average run ends at floor ${stats.floorReached.mean.toFixed(1)} - game may be too easy`,
      data: { averageFloor: stats.floorReached.mean },
    });
  }

  // Check gold economy
  if (stats.goldPerRun.mean < 100) {
    warnings.push({
      severity: 'info',
      category: 'economy',
      message: `Average gold per run is ${stats.goldPerRun.mean.toFixed(0)} - players may struggle to afford items`,
      data: { averageGold: stats.goldPerRun.mean },
    });
  }

  return warnings;
}

/**
 * Analyze session-specific balance issues.
 */
export function analyzeSessionBalance(stats: SessionAggregatedStats): BalanceWarning[] {
  const warnings = analyzeBalance(stats);

  // Check upgrade adoption
  for (const [upgradeId, rate] of Object.entries(stats.upgradeAdoptionRate)) {
    if (rate > 3) {
      warnings.push({
        severity: 'info',
        category: 'upgrades',
        message: `${upgradeId} purchased ${rate.toFixed(1)}x per session - high priority upgrade`,
        data: { upgradeId, adoptionRate: rate },
      });
    }
    if (rate < 0.5) {
      warnings.push({
        severity: 'info',
        category: 'upgrades',
        message: `${upgradeId} purchased only ${rate.toFixed(1)}x per session - may be too expensive or weak`,
        data: { upgradeId, adoptionRate: rate },
      });
    }
  }

  // Check meta gold efficiency
  if (stats.metaGoldEfficiency < 0.5) {
    warnings.push({
      severity: 'info',
      category: 'economy',
      message: `Only ${(stats.metaGoldEfficiency * 100).toFixed(0)}% of meta-gold is being spent - upgrade costs may be too high`,
      data: { efficiency: stats.metaGoldEfficiency },
    });
  }

  return warnings;
}
