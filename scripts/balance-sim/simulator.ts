/**
 * Core Monte Carlo simulation engine.
 * @module scripts/balance-sim/simulator
 */

import type {
  SimulationConfig,
  UpgradeLevels,
  SimPlayerState,
  FloorResult,
  RunResult,
  SessionResult,
} from './types.ts';
import type { Random } from './random.ts';
import { createRandom } from './random.ts';
import { getFloorConfig, simulateFloorClear } from './board-model.ts';
import {
  generateShopItems,
  decideShopPurchase,
  applyShopPurchase,
  decideMetaUpgrade,
  applyMetaUpgrade,
  createPlayerFromUpgrades,
} from './strategies.ts';
import { GAME_CONSTANTS } from './config.ts';

/**
 * Progress callback for reporting simulation status.
 */
export type ProgressCallback = (completed: number, total: number) => void;

/**
 * Simulate a single run from start to death.
 */
export function simulateRun(
  config: SimulationConfig,
  upgrades: UpgradeLevels,
  random: Random
): RunResult {
  const player = createPlayerFromUpgrades(upgrades, random);
  const floorResults: FloorResult[] = [];
  const itemPurchaseCounts: Record<string, number> = {};

  let currentFloor = config.startingFloor;
  let totalGoldEarned = 0;
  let totalGoldSpent = 0;
  let totalDamageBlocked = 0;
  let totalDamageTaken = 0;

  // Run until death
  while (player.lives > 0) {
    const floorResult = simulateFloor(
      currentFloor,
      player,
      config,
      random,
      itemPurchaseCounts
    );

    floorResults.push(floorResult);
    totalGoldEarned += floorResult.goldEarned;
    totalGoldSpent += floorResult.goldSpent;
    totalDamageBlocked += floorResult.damageBlocked;
    totalDamageTaken += floorResult.damageTaken;

    if (!floorResult.survived) {
      break;
    }

    currentFloor++;
  }

  // Meta gold is the gold remaining at death
  const metaGoldEarned = player.gold;

  return {
    finalFloor: currentFloor,
    totalGoldEarned,
    totalGoldSpent,
    metaGoldEarned,
    totalDamageBlocked,
    totalDamageTaken,
    floorResults,
    itemPurchaseCounts,
    causeOfDeath: player.lives === 0 ? 'monster' : 'none',
    livesAtDeath: player.lives,
    shieldsAtDeath: player.shields,
  };
}

/**
 * Simulate a single floor.
 */
function simulateFloor(
  level: number,
  player: SimPlayerState,
  config: SimulationConfig,
  random: Random,
  itemPurchaseCounts: Record<string, number>
): FloorResult {
  const floorConfig = getFloorConfig(level);
  const itemsPurchased: string[] = [];

  // Apply pending buffs from previous shop
  if (player.hasGoldMagnet) {
    // Gold magnet is consumed this floor
  }
  const revealedAtStart = player.pendingRevealTiles;
  player.pendingRevealTiles = 0;

  // Calculate available hits (shields + lives, plus first-hit immunity if applicable)
  let availableHits = player.shields + player.lives;
  if (!player.firstMonsterHitUsed) {
    availableHits += 1; // Extra "free" hit
  }

  // Simulate floor clear attempt
  const boardResult = simulateFloorClear(floorConfig, availableHits, random, revealedAtStart);

  // Calculate gold earned
  let goldFromTiles = boardResult.goldFromTiles;
  if (player.hasGoldMagnet) {
    goldFromTiles *= 2;
  }
  const goldBonus = player.goldFindBonus;
  goldFromTiles = Math.floor(goldFromTiles * (1 + goldBonus));

  // Add floor completion bonus if survived
  let floorBonus = 0;
  if (boardResult.cleared) {
    floorBonus = floorConfig.goldBonus;
  }

  const goldEarned = goldFromTiles + floorBonus;
  player.gold += goldEarned;

  // Apply damage from monster hits
  let damageBlocked = 0;
  let damageTaken = 0;
  let monstersRemaining = boardResult.monstersHit;

  // First hit immunity
  if (!player.firstMonsterHitUsed && monstersRemaining > 0) {
    player.firstMonsterHitUsed = true;
    monstersRemaining--;
    damageBlocked += 1;
  }

  // Shields absorb damage
  while (monstersRemaining > 0 && player.shields > 0) {
    player.shields--;
    monstersRemaining--;
    damageBlocked++;
  }

  // Remaining damage goes to lives
  while (monstersRemaining > 0 && player.lives > 0) {
    player.lives--;
    monstersRemaining--;
    damageTaken++;
  }

  // Reset gold magnet (consumed for this floor)
  player.hasGoldMagnet = false;

  // If survived, go to shop phase
  let goldSpent = 0;
  if (player.lives > 0 && boardResult.cleared) {
    // Shop phase
    const shopResult = simulateShopPhase(player, config, random, itemsPurchased);
    goldSpent = shopResult.goldSpent;

    for (const itemId of itemsPurchased) {
      itemPurchaseCounts[itemId] = (itemPurchaseCounts[itemId] ?? 0) + 1;
    }
  }

  return {
    floor: level,
    survived: player.lives > 0 && boardResult.cleared,
    goldEarned,
    goldSpent,
    damageBlocked,
    damageTaken,
    itemsPurchased,
    monstersHit: boardResult.monstersHit,
    tilesRevealed: boardResult.tilesRevealed,
  };
}

/**
 * Simulate the shop phase between floors.
 */
function simulateShopPhase(
  player: SimPlayerState,
  config: SimulationConfig,
  random: Random,
  itemsPurchased: string[]
): { goldSpent: number } {
  let goldSpent = 0;
  let shopItems = generateShopItems(random);
  let rerollCount = 0;
  const maxRerolls = 3; // Limit rerolls to prevent infinite loops

  // Keep shopping until player decides to stop or can't afford anything
  while (rerollCount < maxRerolls) {
    const decision = decideShopPurchase(player, shopItems, config.strategy, random);

    if (decision.shouldReroll && player.gold >= GAME_CONSTANTS.rerollCost) {
      player.gold -= GAME_CONSTANTS.rerollCost;
      goldSpent += GAME_CONSTANTS.rerollCost;
      shopItems = generateShopItems(random);
      rerollCount++;
      continue;
    }

    if (decision.itemId) {
      const item = shopItems.find((i) => i.id === decision.itemId);
      if (item && player.gold >= item.cost) {
        applyShopPurchase(player, decision.itemId);
        goldSpent += item.cost;
        itemsPurchased.push(decision.itemId);

        // Remove purchased item from shop
        shopItems = shopItems.filter((i) => i.id !== decision.itemId);

        // Continue shopping if items remain
        if (shopItems.length === 0) {
          break;
        }
        continue;
      }
    }

    // No purchase and no reroll - done shopping
    break;
  }

  return { goldSpent };
}

/**
 * Simulate a session of multiple runs with meta-progression.
 */
export function simulateSession(
  config: SimulationConfig,
  random: Random
): SessionResult {
  let upgrades = { ...config.startingUpgrades };
  let metaGold = 0;
  let totalMetaGoldEarned = 0;
  let totalMetaGoldSpent = 0;
  const runs: RunResult[] = [];
  const upgradesPurchased: Record<string, number> = {};

  for (let i = 0; i < config.runsPerSession; i++) {
    // Simulate a run
    const runResult = simulateRun(config, upgrades, random);
    runs.push(runResult);

    // Add meta gold from run
    metaGold += runResult.metaGoldEarned;
    totalMetaGoldEarned += runResult.metaGoldEarned;

    // Purchase upgrades between runs
    let purchasing = true;
    while (purchasing) {
      const upgradeId = decideMetaUpgrade(metaGold, upgrades, config.strategy, random);
      if (upgradeId) {
        const result = applyMetaUpgrade(upgradeId, upgrades, metaGold);
        const spent = metaGold - result.metaGold;
        totalMetaGoldSpent += spent;
        metaGold = result.metaGold;
        upgrades = result.upgrades;
        upgradesPurchased[upgradeId] = (upgradesPurchased[upgradeId] ?? 0) + 1;
      } else {
        purchasing = false;
      }
    }
  }

  return {
    runs,
    finalUpgrades: upgrades,
    upgradesPurchased,
    totalMetaGoldEarned,
    totalMetaGoldSpent,
  };
}

/**
 * Run the full simulation.
 */
export function runSimulation(
  config: SimulationConfig,
  onProgress?: ProgressCallback
): RunResult[] | SessionResult[] {
  const random = createRandom(config.seed);

  if (config.mode === 'single') {
    const results: RunResult[] = [];

    for (let i = 0; i < config.runs; i++) {
      results.push(simulateRun(config, config.startingUpgrades, random));

      if (onProgress && (i + 1) % 100 === 0) {
        onProgress(i + 1, config.runs);
      }
    }

    return results;
  } else {
    const results: SessionResult[] = [];

    for (let i = 0; i < config.sessions; i++) {
      results.push(simulateSession(config, random));

      if (onProgress && (i + 1) % 10 === 0) {
        onProgress(i + 1, config.sessions);
      }
    }

    return results;
  }
}
