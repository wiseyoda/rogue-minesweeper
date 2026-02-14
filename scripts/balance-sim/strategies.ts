/**
 * Player decision-making strategies for simulation.
 * @module scripts/balance-sim/strategies
 */

import type { SimPlayerState, StrategyConfig, UpgradeLevels } from './types.ts';
import type { Random } from './random.ts';
import { GAME_CONSTANTS } from './config.ts';

/**
 * Available shop item for purchase decision.
 */
export interface AvailableItem {
  id: string;
  cost: number;
  rarity: string;
}

/**
 * Shop purchase decision result.
 */
export interface PurchaseDecision {
  itemId: string | null;
  shouldReroll: boolean;
}

/**
 * Generate shop items for a floor.
 */
export function generateShopItems(random: Random): AvailableItem[] {
  const allItems = Object.entries(GAME_CONSTANTS.shopItems).map(([id, item]) => ({
    id,
    cost: item.cost,
    rarity: item.rarity,
  }));

  // Select 4 items weighted by rarity (no duplicates)
  const selected: AvailableItem[] = [];
  const available = [...allItems];

  while (selected.length < GAME_CONSTANTS.shopItemCount && available.length > 0) {
    const weights = available.map((item) => GAME_CONSTANTS.rarityWeights[item.rarity] ?? 60);
    const picked = random.weightedPick(available, weights);

    if (picked) {
      selected.push(picked);
      const index = available.findIndex((i) => i.id === picked.id);
      if (index !== -1) {
        available.splice(index, 1);
      }
    }
  }

  return selected;
}

/**
 * Decide what to purchase from the shop.
 * Uses weighted random with situational multipliers.
 */
export function decideShopPurchase(
  player: SimPlayerState,
  availableItems: AvailableItem[],
  strategy: StrategyConfig,
  random: Random
): PurchaseDecision {
  // Filter to affordable items
  const affordable = availableItems.filter((item) => item.cost <= player.gold);

  if (affordable.length === 0) {
    // Can't afford anything - maybe reroll?
    // Reroll cost starts at rerollBaseCost (50g), so rerolling is expensive now
    if (player.gold >= GAME_CONSTANTS.rerollBaseCost && random.next() < 0.15) {
      return { itemId: null, shouldReroll: true };
    }
    return { itemId: null, shouldReroll: false };
  }

  // Calculate weights for each item based on strategy and situation
  const weights: number[] = affordable.map((item) => {
    let weight = strategy.itemWeights[item.id] ?? 1.0;

    // Situational multipliers
    const hpFraction = player.lives / player.maxLives;
    const isLowHp = hpFraction <= strategy.lowHpThreshold;
    const hasNoShields = player.shields === 0;

    switch (item.id) {
      case 'heal-potion':
        // Much more valuable when HP is low
        if (isLowHp) {
          weight *= strategy.lowHpHealMultiplier;
        }
        // Useless at full HP
        if (player.lives >= player.maxLives) {
          weight = 0;
        }
        break;

      case 'shield-orb':
        // More valuable when no shields
        if (hasNoShields) {
          weight *= strategy.noShieldMultiplier;
        }
        break;

      case 'max-hp-up':
        // Always valuable for survivability
        // Slightly more valuable when HP is low (it also heals)
        if (isLowHp) {
          weight *= 1.5;
        }
        break;

      case 'gold-magnet':
        // Less valuable if player is struggling to survive
        if (isLowHp && hasNoShields) {
          weight *= 0.3;
        }
        break;

      case 'peek-scroll':
        // Inventory item - good for risky situations, slight extra value at low HP
        if (isLowHp || hasNoShields) {
          weight *= 1.5;
        }
        break;
    }

    // Apply gold reserve consideration
    // Less likely to buy if it would leave us below reserve (unless critical)
    if (player.gold - item.cost < strategy.goldReserve) {
      // Critical need overrides reserve
      if (item.id === 'heal-potion' && player.lives === 1) {
        weight *= 2; // Desperate heal
      } else {
        weight *= 0.5;
      }
    }

    return Math.max(0, weight);
  });

  // Chance to not buy anything (save gold)
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const skipWeight = totalWeight * 0.1; // 10% relative chance to skip

  if (random.next() < skipWeight / (totalWeight + skipWeight)) {
    return { itemId: null, shouldReroll: false };
  }

  // Pick an item
  const picked = random.weightedPick(affordable, weights);

  return {
    itemId: picked?.id ?? null,
    shouldReroll: false,
  };
}

/**
 * Apply a shop item purchase to player state.
 */
export function applyShopPurchase(player: SimPlayerState, itemId: string): void {
  const itemConfig = GAME_CONSTANTS.shopItems[itemId];
  if (!itemConfig) return;

  player.gold -= itemConfig.cost;

  switch (itemId) {
    case 'heal-potion':
      player.lives = Math.min(player.lives + 1, player.maxLives);
      break;
    case 'shield-orb':
      player.shields += 1;
      break;
    case 'max-hp-up':
      player.maxLives += 1;
      player.lives += 1;
      break;
    case 'gold-magnet':
      player.hasGoldMagnet = true;
      break;
    case 'peek-scroll':
      player.peekScrolls += 1;
      break;
  }
}

/**
 * Decide which permanent upgrade to purchase.
 */
export function decideMetaUpgrade(
  metaGold: number,
  currentUpgrades: UpgradeLevels,
  strategy: StrategyConfig,
  _random: Random
): string | null {
  void _random;
  // Go through priority list and buy first affordable upgrade
  for (const upgradeId of strategy.upgradePriority) {
    const upgradeConfig = GAME_CONSTANTS.upgrades[upgradeId];
    if (!upgradeConfig) continue;

    const canPurchase = canPurchaseUpgrade(upgradeId, currentUpgrades, metaGold);
    if (canPurchase) {
      return upgradeId;
    }
  }

  return null;
}

/**
 * Check if an upgrade can be purchased.
 */
function canPurchaseUpgrade(
  upgradeId: string,
  currentUpgrades: UpgradeLevels,
  metaGold: number
): boolean {
  const config = GAME_CONSTANTS.upgrades[upgradeId];
  if (!config) return false;

  const cost = getUpgradeCost(upgradeId, currentUpgrades);

  if (upgradeId === 'firstClickSafety') {
    return !currentUpgrades.firstClickSafety && metaGold >= cost;
  }

  const currentLevel = currentUpgrades[upgradeId as keyof Omit<UpgradeLevels, 'firstClickSafety'>];
  if (typeof currentLevel !== 'number') return false;

  const maxLevel = config.maxLevel ?? 1;
  return currentLevel < maxLevel && metaGold >= cost;
}

/**
 * Get the cost of an upgrade at its current level.
 */
export function getUpgradeCost(upgradeId: string, currentUpgrades: UpgradeLevels): number {
  const config = GAME_CONSTANTS.upgrades[upgradeId];
  if (!config) return Infinity;

  if (upgradeId === 'firstClickSafety') {
    return config.baseCost;
  }

  const currentLevel = currentUpgrades[upgradeId as keyof Omit<UpgradeLevels, 'firstClickSafety'>];
  if (typeof currentLevel !== 'number') return Infinity;

  // Use flat costs if defined, otherwise use formula
  if (config.flatCosts && currentLevel < config.flatCosts.length) {
    const cost = config.flatCosts[currentLevel];
    if (cost !== undefined) {
      return cost;
    }
  }

  const costIncrease = config.costIncrease ?? 2;
  return Math.floor(config.baseCost * Math.pow(costIncrease, currentLevel));
}

/**
 * Apply a permanent upgrade purchase.
 */
export function applyMetaUpgrade(
  upgradeId: string,
  upgrades: UpgradeLevels,
  metaGold: number
): { upgrades: UpgradeLevels; metaGold: number } {
  const cost = getUpgradeCost(upgradeId, upgrades);
  const newUpgrades = { ...upgrades };
  const newMetaGold = metaGold - cost;

  if (upgradeId === 'firstClickSafety') {
    newUpgrades.firstClickSafety = true;
  } else {
    const key = upgradeId as keyof Omit<UpgradeLevels, 'firstClickSafety'>;
    newUpgrades[key] = (newUpgrades[key] ?? 0) + 1;
  }

  return { upgrades: newUpgrades, metaGold: newMetaGold };
}

/**
 * Create initial player state from upgrades.
 */
export function createPlayerFromUpgrades(
  upgrades: UpgradeLevels,
  random: Random
): SimPlayerState {
  const maxLives = GAME_CONSTANTS.baseMaxLives + upgrades.vitality;
  const goldFindBonus = upgrades.fortune * 0.1;
  const startingShields = upgrades.resilience;

  // Apply preparation buffs
  let hasGoldMagnet = false;
  let pendingRevealTiles = 0;
  let shields = startingShields;

  for (let i = 0; i < upgrades.preparation; i++) {
    const buffType = random.int(0, 2);
    switch (buffType) {
      case 0:
        hasGoldMagnet = true;
        break;
      case 1:
        shields += 1;
        break;
      case 2:
        pendingRevealTiles += 3;
        break;
    }
  }

  return {
    lives: maxLives,
    maxLives,
    shields,
    gold: GAME_CONSTANTS.baseStartingGold,
    goldFindBonus,
    hasGoldMagnet,
    pendingRevealTiles,
    peekScrolls: 0,
    firstMonsterHitUsed: !upgrades.firstClickSafety,
  };
}
