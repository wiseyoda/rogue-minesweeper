/**
 * Default configuration for balance simulation.
 * Imports game data directly from source to stay in sync.
 * @module scripts/balance-sim/config
 */

import type { SimulationConfig, UpgradeLevels, StrategyConfig } from './types.ts';

// Import actual game data to stay in sync with the game
import { DIFFICULTY_CONSTANTS } from '../../src/engine/difficulty.ts';
import { SHOP_ITEMS, REROLL_BASE_COST, REROLL_INCREMENT, SHOP_ITEM_COUNT } from '../../src/data/shopItems.ts';
import { PERMANENT_UPGRADES } from '../../src/data/permanentUpgrades.ts';
import { RARITY_WEIGHTS } from '../../src/types/item.ts';
import { createDefaultPlayerStats } from '../../src/types/player.ts';
import { isLeveledUpgrade } from '../../src/types/shop.ts';

/**
 * Default starting upgrades (fresh player).
 */
export const DEFAULT_UPGRADES: UpgradeLevels = {
  vitality: 0,
  fortune: 0,
  preparation: 0,
  resilience: 0,
  firstClickSafety: false,
};

/**
 * Build default item weights from actual shop items.
 * New items will automatically get a default weight of 1.0.
 *
 * Weights reflect player behavior:
 * - Gold Magnet is almost always worth buying (high ROI)
 * - Healing is situational (only when HP is low)
 * - Shields are decent value
 * - Max HP is expensive but good long-term
 */
function buildDefaultItemWeights(): Record<string, number> {
  const weights: Record<string, number> = {};
  for (const item of SHOP_ITEMS) {
    // Assign sensible default weights based on item type
    switch (item.id) {
      case 'heal-potion':
        // Situational - weight is boosted when HP is low (see strategies.ts)
        weights[item.id] = 0.5;
        break;
      case 'shield-orb':
        weights[item.id] = 1.0;
        break;
      case 'max-hp-up':
        weights[item.id] = 1.0;
        break;
      case 'gold-magnet':
        // Almost always worth buying - high base weight
        weights[item.id] = 3.0;
        break;
      case 'peek-scroll':
        weights[item.id] = 0.8;
        break;
      default:
        // New items get a neutral weight
        weights[item.id] = 1.0;
    }
  }
  return weights;
}

/**
 * Build upgrade priority from actual upgrades.
 */
function buildUpgradePriority(): string[] {
  // Prioritize survivability, then economy, then utility
  const priority: string[] = [];
  const upgradeIds = Object.keys(PERMANENT_UPGRADES);

  // Add in preferred order if they exist
  const preferredOrder = ['vitality', 'resilience', 'fortune', 'firstClickSafety', 'preparation'];
  for (const id of preferredOrder) {
    if (upgradeIds.includes(id)) {
      priority.push(id);
    }
  }

  // Add any new upgrades not in our preferred list
  for (const id of upgradeIds) {
    if (!priority.includes(id)) {
      priority.push(id);
    }
  }

  return priority;
}

/**
 * Default strategy configuration.
 * Weighted random with smart decision-making.
 */
export const DEFAULT_STRATEGY: StrategyConfig = {
  // Base weights for item purchasing (relative priority)
  itemWeights: buildDefaultItemWeights(),

  // HP threshold for "low HP" state (as fraction of max)
  lowHpThreshold: 0.5,

  // Multiplier for heal items when HP is low
  lowHpHealMultiplier: 5.0,

  // Multiplier for shield items when no shields
  noShieldMultiplier: 3.0,

  // Minimum gold reserve (won't spend below this unless critical)
  goldReserve: 20,

  // Priority order for meta upgrades (left = highest priority)
  upgradePriority: buildUpgradePriority(),
};

/**
 * Default simulation configuration.
 */
export const DEFAULT_CONFIG: SimulationConfig = {
  runs: 10000,
  startingUpgrades: DEFAULT_UPGRADES,
  startingFloor: 1,
  seed: null,
  strategy: DEFAULT_STRATEGY,
  mode: 'single',
  sessions: 100,
  runsPerSession: 20,
};

/**
 * Game constants derived from actual game source.
 * This ensures simulation stays in sync with the game.
 */
const defaultPlayerStats = createDefaultPlayerStats();

export const GAME_CONSTANTS = {
  // Grid scaling (from difficulty.ts)
  ...DIFFICULTY_CONSTANTS,

  // Gold per tile is always 1 (hardcoded in game logic)
  goldPerTile: 1,

  // Starting stats (from player.ts)
  baseMaxLives: defaultPlayerStats.maxLives,
  baseStartingGold: defaultPlayerStats.startingGold,
  baseStartingShields: defaultPlayerStats.startingShields,

  // Damage
  damagePerMonster: 1,

  // Shop (from shopItems.ts)
  rerollBaseCost: REROLL_BASE_COST,
  rerollIncrement: REROLL_INCREMENT,
  shopItemCount: SHOP_ITEM_COUNT,

  // Shop items - built dynamically from actual items
  shopItems: SHOP_ITEMS.reduce(
    (acc, item) => {
      acc[item.id] = { cost: item.cost, rarity: item.rarity ?? 'common' };
      return acc;
    },
    {} as Record<string, { cost: number; rarity: string }>
  ),

  // Rarity weights (from item.ts)
  rarityWeights: RARITY_WEIGHTS as Record<string, number>,

  // Permanent upgrades - built dynamically from actual upgrades
  upgrades: Object.entries(PERMANENT_UPGRADES).reduce(
    (acc, [key, upgrade]) => {
      if (isLeveledUpgrade(upgrade)) {
        acc[key] = {
          baseCost: upgrade.baseCost,
          maxLevel: upgrade.maxLevel,
          costIncrease: upgrade.costIncrease,
          flatCosts: upgrade.flatCosts,
        };
      } else {
        acc[key] = { baseCost: upgrade.baseCost };
      }
      return acc;
    },
    {} as Record<string, { baseCost: number; maxLevel?: number; costIncrease?: number; flatCosts?: number[] }>
  ),
} as const;

/**
 * Parse CLI arguments into config overrides.
 */
export function parseCliArgs(args: string[]): Partial<SimulationConfig> {
  const config: Partial<SimulationConfig> = {};
  const upgrades: Partial<UpgradeLevels> = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];

    switch (arg) {
      case '--runs':
      case '-r':
        config.runs = parseInt(nextArg ?? '10000', 10);
        i++;
        break;
      case '--mode':
      case '-m':
        config.mode = nextArg as 'single' | 'session';
        i++;
        break;
      case '--sessions':
        config.sessions = parseInt(nextArg ?? '100', 10);
        i++;
        break;
      case '--runs-per-session':
        config.runsPerSession = parseInt(nextArg ?? '20', 10);
        i++;
        break;
      case '--starting-floor':
        config.startingFloor = parseInt(nextArg ?? '1', 10);
        i++;
        break;
      case '--seed':
        config.seed = parseInt(nextArg ?? '0', 10);
        i++;
        break;
      case '--vitality':
        upgrades.vitality = parseInt(nextArg ?? '0', 10);
        i++;
        break;
      case '--fortune':
        upgrades.fortune = parseInt(nextArg ?? '0', 10);
        i++;
        break;
      case '--preparation':
        upgrades.preparation = parseInt(nextArg ?? '0', 10);
        i++;
        break;
      case '--resilience':
        upgrades.resilience = parseInt(nextArg ?? '0', 10);
        i++;
        break;
      case '--first-click-safety':
        upgrades.firstClickSafety = true;
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
    }
  }

  if (Object.keys(upgrades).length > 0) {
    config.startingUpgrades = { ...DEFAULT_UPGRADES, ...upgrades };
  }

  return config;
}

/**
 * Print CLI help message.
 */
function printHelp(): void {
  console.log(`
Balance Simulator - Monte Carlo simulation for game balance testing

Usage: pnpm sim [options]

Options:
  -r, --runs <n>           Number of simulation runs (default: 10000)
  -m, --mode <mode>        Simulation mode: single | session (default: single)
  --sessions <n>           Number of sessions for session mode (default: 100)
  --runs-per-session <n>   Runs per session in session mode (default: 20)
  --starting-floor <n>     Starting floor number (default: 1)
  --seed <n>               Random seed for reproducibility
  --vitality <n>           Starting vitality level (0-3)
  --fortune <n>            Starting fortune level (0-5)
  --preparation <n>        Starting preparation level (0-3)
  --resilience <n>         Starting resilience level (0-2)
  --first-click-safety     Enable first click safety upgrade
  -h, --help               Show this help message

Examples:
  pnpm sim                           # 10k single runs with no upgrades
  pnpm sim -r 50000                  # 50k runs for higher confidence
  pnpm sim -m session                # Multi-run session simulation
  pnpm sim --vitality 3 --fortune 2  # Test with specific upgrades
`);
}

/**
 * Merge partial config with defaults.
 */
export function mergeConfig(partial: Partial<SimulationConfig>): SimulationConfig {
  return {
    ...DEFAULT_CONFIG,
    ...partial,
    startingUpgrades: {
      ...DEFAULT_UPGRADES,
      ...partial.startingUpgrades,
    },
    strategy: {
      ...DEFAULT_STRATEGY,
      ...partial.strategy,
    },
  };
}
