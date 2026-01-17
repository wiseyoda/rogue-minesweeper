/**
 * Types for the Monte Carlo balance simulation.
 * @module scripts/balance-sim/types
 */

/**
 * Permanent upgrade levels for simulation.
 */
export interface UpgradeLevels {
  vitality: number;
  fortune: number;
  preparation: number;
  resilience: number;
  firstClickSafety: boolean;
}

/**
 * Player state during a simulated run.
 */
export interface SimPlayerState {
  lives: number;
  maxLives: number;
  shields: number;
  gold: number;
  goldFindBonus: number;
  hasGoldMagnet: boolean;
  pendingRevealTiles: number;
  peekScrolls: number;
  firstMonsterHitUsed: boolean;
}

/**
 * Result of simulating a single floor.
 */
export interface FloorResult {
  floor: number;
  survived: boolean;
  goldEarned: number;
  goldSpent: number;
  damageBlocked: number;
  damageTaken: number;
  itemsPurchased: string[];
  monstersHit: number;
  tilesRevealed: number;
}

/**
 * Result of a complete run simulation.
 */
export interface RunResult {
  finalFloor: number;
  totalGoldEarned: number;
  totalGoldSpent: number;
  metaGoldEarned: number;
  totalDamageBlocked: number;
  totalDamageTaken: number;
  floorResults: FloorResult[];
  itemPurchaseCounts: Record<string, number>;
  causeOfDeath: 'monster' | 'none';
  livesAtDeath: number;
  shieldsAtDeath: number;
}

/**
 * Result of a multi-run session simulation.
 */
export interface SessionResult {
  runs: RunResult[];
  finalUpgrades: UpgradeLevels;
  upgradesPurchased: Record<string, number>;
  totalMetaGoldEarned: number;
  totalMetaGoldSpent: number;
}

/**
 * Aggregated statistics from multiple simulation runs.
 */
export interface AggregatedStats {
  runCount: number;

  // Floor progression
  floorReached: {
    mean: number;
    median: number;
    min: number;
    max: number;
    p10: number;
    p25: number;
    p75: number;
    p90: number;
    stdDev: number;
  };

  // Death distribution by floor
  deathsByFloor: Record<number, number>;

  // Gold economy
  goldPerRun: {
    mean: number;
    median: number;
    min: number;
    max: number;
    stdDev: number;
  };
  goldPerFloor: Record<number, { mean: number; samples: number }>;

  // Item statistics
  itemPurchaseRate: Record<string, number>;
  itemPurchaseByFloor: Record<string, Record<number, number>>;

  // Survival metrics
  averageDamageBlocked: number;
  averageDamageTaken: number;
  survivalRateByFloor: Record<number, number>;
}

/**
 * Aggregated statistics for session mode.
 */
export interface SessionAggregatedStats extends AggregatedStats {
  // Meta-progression stats
  upgradeAdoptionRate: Record<string, number>;
  averageRunsToMaxUpgrade: Record<string, number>;
  metaGoldEfficiency: number;
}

/**
 * Configuration for the simulation.
 */
export interface SimulationConfig {
  /** Number of runs to simulate */
  runs: number;
  /** Starting upgrade levels */
  startingUpgrades: UpgradeLevels;
  /** Starting floor (for testing specific scenarios) */
  startingFloor: number;
  /** Seed for random number generator (null for random) */
  seed: number | null;
  /** Strategy configuration */
  strategy: StrategyConfig;
  /** Simulation mode */
  mode: 'single' | 'session';
  /** For session mode: number of sessions */
  sessions: number;
  /** For session mode: runs per session */
  runsPerSession: number;
}

/**
 * Strategy configuration for player decision-making.
 */
export interface StrategyConfig {
  /** Base weights for each shop item (higher = more likely to buy) */
  itemWeights: Record<string, number>;
  /** Multiplier when HP is below this threshold */
  lowHpThreshold: number;
  /** Weight multiplier for healing when HP is low */
  lowHpHealMultiplier: number;
  /** Weight multiplier for shields when shields = 0 */
  noShieldMultiplier: number;
  /** Minimum gold to keep in reserve */
  goldReserve: number;
  /** For meta upgrades: priority order */
  upgradePriority: string[];
}

/**
 * Balance warnings generated from analysis.
 */
export interface BalanceWarning {
  severity: 'info' | 'warning' | 'critical';
  category: 'progression' | 'economy' | 'items' | 'upgrades';
  message: string;
  data?: Record<string, unknown>;
}

/**
 * Complete simulation report.
 */
export interface SimulationReport {
  config: SimulationConfig;
  stats: AggregatedStats | SessionAggregatedStats;
  warnings: BalanceWarning[];
  timestamp: string;
  durationMs: number;
}
