/**
 * AI domain contracts for Dungeon Master context building.
 * @module types/ai
 */

/**
 * Request categories used to build prompt context for the Dungeon Master.
 */
export type DungeonMasterRequestType = 'taunt' | 'hint' | 'mood_update' | 'death' | 'victory';

/**
 * Outcome type for a recorded run summary.
 */
export type DungeonRunResult = 'death' | 'victory' | 'retreat';

/**
 * Persisted summary record for a completed run.
 */
export interface DungeonRunRecord {
  /** Run result category. */
  result: DungeonRunResult;
  /** Floor reached when the run ended. */
  level: number;
  /** Gold held at run end. */
  gold: number;
  /** Equipped rune IDs at run end. */
  equippedRunes: string[];
  /** Optional reason for death-oriented outcomes. */
  deathCause?: string;
  /** Number of near-death events during the run. */
  nearDeathMoments: number;
  /** ISO timestamp for run completion. */
  endedAt: string;
}

/**
 * Sliding-window request metadata used to prepare API throttling.
 */
export interface DungeonRateLimitState {
  /** Epoch milliseconds for current window start. */
  windowStartedAt: number;
  /** Number of requests consumed in current window. */
  requestCount: number;
  /** Window duration in milliseconds. */
  windowMs: number;
  /** Maximum allowed requests in the active window. */
  maxRequests: number;
}

/**
 * Context payload sent to AI providers in later phases.
 */
export interface DungeonMasterContext {
  // Player history
  totalRuns: number;
  bestFloor: number;
  favoriteRunes: string[];
  recentDeathCauses: string[];

  // Current run
  currentFloor: number;
  currentHP: number;
  currentGold: number;
  equippedRunes: string[];
  recentActions: string[];

  // Current situation
  tilesRevealed: number;
  monstersRemaining: number;
  nearDeathMoments: number;

  // Request type
  requestType: DungeonMasterRequestType;
}

/**
 * Rich builder result with context and diagnostics.
 */
export interface DungeonMasterContextEnvelope {
  context: DungeonMasterContext;
  estimatedTokens: number;
  truncated: boolean;
}

/**
 * Supported Dungeon Master mood states.
 */
export type DungeonMasterMood = 'amused' | 'bored' | 'impressed' | 'vengeful' | 'curious';

/**
 * Optional hint categories the Dungeon Master can return.
 */
export type DungeonMasterHintType = 'rune_synergy' | 'monster_warning' | 'safe_path';

/**
 * Structured Dungeon Master response contract consumed by the UI/trigger layers.
 */
export interface DungeonMasterResponse {
  dialogue: string;
  mood: DungeonMasterMood;
  difficultyAdjustment?: number;
  hintType?: DungeonMasterHintType;
  hintContent?: string;
}

/**
 * Source of a generated Dungeon Master response.
 */
export type DungeonMasterResponseSource = 'gemini' | 'claude' | 'fallback';

/**
 * Orchestrated generation result including source diagnostics.
 */
export interface DungeonMasterGenerationResult {
  response: DungeonMasterResponse;
  source: DungeonMasterResponseSource;
  providerErrors: Partial<Record<'gemini' | 'claude', string>>;
  cooldownActive: boolean;
}
