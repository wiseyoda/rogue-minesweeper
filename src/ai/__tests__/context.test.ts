/**
 * Tests for AI context builder.
 * @module ai/__tests__/context
 */

import { describe, expect, it } from 'vitest';
import { buildDungeonMasterContext } from '../context';
import {
  createDefaultGameStats,
  createDefaultPlayerStats,
  createEmptyCell,
  createInitialPlayerState,
  createInitialRunState,
} from '@/types';
import type { DungeonRunRecord } from '@/types';
import type { DungeonContextBuildInput } from '../context';

function createBuildInput(overrides?: Partial<DungeonContextBuildInput>): DungeonContextBuildInput {
  return {
    game: {
      grid: null,
      gridConfig: {
        rows: 2,
        cols: 2,
        monsterCount: 1,
      },
      player: createInitialPlayerState(createDefaultPlayerStats()),
      run: createInitialRunState(1),
      ...overrides?.game,
    },
    meta: {
      stats: createDefaultGameStats(),
      ...overrides?.meta,
    },
    dungeon: {
      runHistory: [],
      recentActions: [],
      nearDeathMoments: 0,
      ...overrides?.dungeon,
    },
    requestType: overrides?.requestType ?? 'taunt',
  };
}

function createRunRecord(overrides?: Partial<DungeonRunRecord>): DungeonRunRecord {
  return {
    result: 'death',
    level: 1,
    gold: 0,
    equippedRunes: [],
    nearDeathMoments: 0,
    endedAt: '2026-02-14T00:00:00.000Z',
    ...overrides,
  };
}

describe('buildDungeonMasterContext', () => {
  it('should serialize current run state fields', () => {
    const hiddenMonster = { ...createEmptyCell(), isMonster: true };
    const safeRevealed = { ...createEmptyCell(), isRevealed: true };
    const safeHidden = createEmptyCell();

    const input = createBuildInput({
      game: {
        grid: [
          [hiddenMonster, safeRevealed],
          [safeHidden, safeHidden],
        ],
        gridConfig: {
          rows: 2,
          cols: 2,
          monsterCount: 1,
        },
        player: {
          ...createInitialPlayerState(createDefaultPlayerStats()),
          lives: 2,
          gold: 150,
          equippedRunes: ['oracle-sight', 'hardy'],
        },
        run: {
          ...createInitialRunState(4),
          level: 4,
          revealedCount: 6,
        },
      },
      requestType: 'hint',
    });

    const result = buildDungeonMasterContext(input);

    expect(result.context.currentFloor).toBe(4);
    expect(result.context.currentHP).toBe(2);
    expect(result.context.currentGold).toBe(150);
    expect(result.context.equippedRunes).toEqual(['oracle-sight', 'hardy']);
    expect(result.context.tilesRevealed).toBe(6);
    expect(result.context.monstersRemaining).toBe(1);
    expect(result.context.requestType).toBe('hint');
  });

  it('should cap recent actions to the most recent 10 entries', () => {
    const actions = Array.from({ length: 14 }, (_, index) => `action-${index + 1}`);

    const result = buildDungeonMasterContext(
      createBuildInput({
        dungeon: {
          runHistory: [],
          recentActions: actions,
          nearDeathMoments: 0,
        },
      })
    );

    expect(result.context.recentActions).toHaveLength(10);
    expect(result.context.recentActions[0]).toBe('action-5');
    expect(result.context.recentActions[9]).toBe('action-14');
  });

  it('should aggregate favorite runes and recent death causes deterministically', () => {
    const runHistory: DungeonRunRecord[] = [
      createRunRecord({
        result: 'death',
        equippedRunes: ['lucky-coin', 'hardy'],
        deathCause: 'spike trap',
        level: 2,
      }),
      createRunRecord({
        result: 'victory',
        equippedRunes: ['lucky-coin', 'bargain-hunter'],
        level: 5,
      }),
      createRunRecord({
        result: 'death',
        equippedRunes: ['bargain-hunter'],
        deathCause: 'boss slam',
        level: 3,
      }),
    ];

    const result = buildDungeonMasterContext(
      createBuildInput({
        dungeon: {
          runHistory,
          recentActions: [],
          nearDeathMoments: 3,
        },
      })
    );

    expect(result.context.favoriteRunes).toEqual(['bargain-hunter', 'lucky-coin', 'hardy']);
    expect(result.context.recentDeathCauses).toEqual(['boss slam', 'spike trap']);
    expect(result.context.bestFloor).toBe(5);
    expect(result.context.nearDeathMoments).toBe(3);
  });

  it('should truncate fields to stay within token budget', () => {
    const longAction = 'x'.repeat(1200);
    const actions = Array.from({ length: 20 }, () => longAction);

    const result = buildDungeonMasterContext(
      createBuildInput({
        dungeon: {
          runHistory: [createRunRecord({ deathCause: 'giant trap chain collapse' })],
          recentActions: actions,
          nearDeathMoments: 1,
        },
      }),
      2000
    );

    expect(result.truncated).toBe(true);
    expect(result.estimatedTokens).toBeLessThanOrEqual(2000);
    expect(result.context.recentActions.length).toBeLessThan(10);
  });

  it('should use fallback monster count when grid is null', () => {
    const result = buildDungeonMasterContext(
      createBuildInput({
        game: {
          grid: null,
          gridConfig: {
            rows: 8,
            cols: 8,
            monsterCount: 10,
          },
          player: createInitialPlayerState(createDefaultPlayerStats()),
          run: createInitialRunState(1),
        },
      })
    );

    expect(result.context.monstersRemaining).toBe(10);
  });
});

