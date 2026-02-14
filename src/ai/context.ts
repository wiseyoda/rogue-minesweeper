/**
 * Dungeon Master context builder.
 * @module ai/context
 */

import type { Grid } from '@/types';
import type {
  DungeonMasterContext,
  DungeonMasterContextEnvelope,
  DungeonMasterRequestType,
  DungeonRunRecord,
} from '@/types';
import type { DungeonStoreState, GameStoreState, MetaStoreState } from '@/stores/types';
import { useDungeonStore } from '@/stores/dungeonStore';
import { useGameStore } from '@/stores/gameStore';
import { useMetaStore } from '@/stores/metaStore';

const MAX_RECENT_ACTIONS = 10;
const MAX_RECENT_DEATH_CAUSES = 5;
const MAX_FAVORITE_RUNES = 5;
export const CONTEXT_TOKEN_BUDGET = 2000;

/**
 * Raw state input used by buildDungeonMasterContext.
 */
export interface DungeonContextBuildInput {
  game: Pick<GameStoreState, 'grid' | 'gridConfig' | 'player' | 'run'>;
  meta: Pick<MetaStoreState, 'stats'>;
  dungeon: Pick<DungeonStoreState, 'runHistory' | 'recentActions' | 'nearDeathMoments'>;
  requestType: DungeonMasterRequestType;
}

/**
 * Estimate token usage from context JSON.
 * Uses a conservative char/4 approximation for provider planning.
 */
export function estimateContextTokens(context: DungeonMasterContext): number {
  return Math.ceil(JSON.stringify(context).length / 4);
}

/**
 * Build a context payload from explicit state input.
 */
export function buildDungeonMasterContext(
  input: DungeonContextBuildInput,
  tokenBudget: number = CONTEXT_TOKEN_BUDGET
): DungeonMasterContextEnvelope {
  const runHistory = input.dungeon.runHistory ?? [];
  const favoriteRunes = getFavoriteRunes(runHistory);
  const recentDeathCauses = getRecentDeathCauses(runHistory);
  const recentActions = getRecentActions(input.dungeon.recentActions ?? []);
  const monstersRemaining = getMonstersRemaining(input.game.grid, input.game.gridConfig.monsterCount);
  const bestFloor = getBestFloor(runHistory, input.meta.stats.highestLevelOverall);

  const baseContext: DungeonMasterContext = {
    totalRuns: Math.max(input.meta.stats.totalRuns, runHistory.length),
    bestFloor,
    favoriteRunes,
    recentDeathCauses,
    currentFloor: input.game.run.level,
    currentHP: Math.max(0, input.game.player.lives),
    currentGold: Math.max(0, input.game.player.gold),
    equippedRunes: [...input.game.player.equippedRunes],
    recentActions,
    tilesRevealed: Math.max(0, input.game.run.revealedCount),
    monstersRemaining,
    nearDeathMoments: Math.max(0, input.dungeon.nearDeathMoments),
    requestType: input.requestType,
  };

  return clampContextToBudget(baseContext, tokenBudget);
}

/**
 * Build a context payload directly from live stores.
 */
export function buildDungeonMasterContextFromStores(
  requestType: DungeonMasterRequestType,
  tokenBudget: number = CONTEXT_TOKEN_BUDGET
): DungeonMasterContextEnvelope {
  const game = useGameStore.getState();
  const meta = useMetaStore.getState();
  const dungeon = useDungeonStore.getState();

  return buildDungeonMasterContext(
    {
      game,
      meta,
      dungeon,
      requestType,
    },
    tokenBudget
  );
}

function getBestFloor(runHistory: DungeonRunRecord[], highestLevelOverall: number): number {
  let historyBest = 0;
  for (const record of runHistory) {
    if (record.level > historyBest) {
      historyBest = record.level;
    }
  }
  return Math.max(highestLevelOverall, historyBest);
}

function getRecentActions(actions: string[]): string[] {
  return actions
    .map((action) => action.trim())
    .filter((action) => action.length > 0)
    .slice(-MAX_RECENT_ACTIONS);
}

function getRecentDeathCauses(runHistory: DungeonRunRecord[]): string[] {
  const causes: string[] = [];

  for (let i = runHistory.length - 1; i >= 0; i--) {
    const record = runHistory[i];
    if (!record) {
      continue;
    }
    const normalizedCause = record.deathCause?.trim();
    if (record.result !== 'death' || !normalizedCause) {
      continue;
    }

    causes.push(normalizedCause);
    if (causes.length >= MAX_RECENT_DEATH_CAUSES) {
      break;
    }
  }

  return causes;
}

function getFavoriteRunes(runHistory: DungeonRunRecord[]): string[] {
  const runeCounts = new Map<string, number>();

  for (const record of runHistory) {
    for (const runeId of record.equippedRunes) {
      runeCounts.set(runeId, (runeCounts.get(runeId) ?? 0) + 1);
    }
  }

  return [...runeCounts.entries()]
    .sort((a, b) => {
      if (b[1] !== a[1]) {
        return b[1] - a[1];
      }
      return a[0].localeCompare(b[0]);
    })
    .slice(0, MAX_FAVORITE_RUNES)
    .map(([runeId]) => runeId);
}

function getMonstersRemaining(grid: Grid | null, fallback: number): number {
  if (!grid) {
    return Math.max(0, fallback);
  }

  let remaining = 0;

  for (const row of grid) {
    for (const cell of row) {
      if (cell.isMonster && !cell.isRevealed) {
        remaining += 1;
      }
    }
  }

  return remaining;
}

function clampContextToBudget(
  context: DungeonMasterContext,
  tokenBudget: number
): DungeonMasterContextEnvelope {
  const nextContext: DungeonMasterContext = {
    ...context,
    favoriteRunes: [...context.favoriteRunes],
    recentDeathCauses: [...context.recentDeathCauses],
    equippedRunes: [...context.equippedRunes],
    recentActions: [...context.recentActions],
  };

  let estimatedTokens = estimateContextTokens(nextContext);
  let truncated = false;

  while (estimatedTokens > tokenBudget && nextContext.recentActions.length > 0) {
    nextContext.recentActions.shift();
    truncated = true;
    estimatedTokens = estimateContextTokens(nextContext);
  }

  while (estimatedTokens > tokenBudget && nextContext.recentDeathCauses.length > 0) {
    nextContext.recentDeathCauses.pop();
    truncated = true;
    estimatedTokens = estimateContextTokens(nextContext);
  }

  while (estimatedTokens > tokenBudget && nextContext.favoriteRunes.length > 0) {
    nextContext.favoriteRunes.pop();
    truncated = true;
    estimatedTokens = estimateContextTokens(nextContext);
  }

  while (estimatedTokens > tokenBudget && nextContext.equippedRunes.length > 0) {
    nextContext.equippedRunes.pop();
    truncated = true;
    estimatedTokens = estimateContextTokens(nextContext);
  }

  return {
    context: nextContext,
    estimatedTokens,
    truncated,
  };
}
