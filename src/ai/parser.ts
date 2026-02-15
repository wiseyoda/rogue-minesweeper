/**
 * Provider response parsing and validation.
 * @module ai/parser
 */

import { z } from 'zod';
import type { DungeonMasterResponse } from '@/types';

const moodSchema = z.enum(['amused', 'bored', 'impressed', 'vengeful', 'curious']);
const hintTypeSchema = z.enum(['rune_synergy', 'monster_warning', 'safe_path']);

const rawDungeonMasterResponseSchema = z.object({
  dialogue: z.string().trim().min(1),
  mood: moodSchema,
  difficultyAdjustment: z.number().finite().optional(),
  hintType: hintTypeSchema.optional(),
  hintContent: z.string().trim().min(1).optional(),
});

/**
 * Parsed response success shape.
 */
export interface DungeonMasterParseSuccess {
  ok: true;
  value: DungeonMasterResponse;
}

/**
 * Parsed response failure shape.
 */
export interface DungeonMasterParseFailure {
  ok: false;
  error: string;
}

export type DungeonMasterParseResult = DungeonMasterParseSuccess | DungeonMasterParseFailure;

function toObjectInput(input: unknown): unknown {
  if (typeof input !== 'string') {
    return input;
  }

  try {
    return JSON.parse(input);
  } catch {
    return undefined;
  }
}

/**
 * Parse provider output into strict DungeonMasterResponse contract.
 */
export function parseDungeonMasterResponse(input: unknown): DungeonMasterParseResult {
  const parsed = rawDungeonMasterResponseSchema.safeParse(toObjectInput(input));

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      ok: false,
      error: issue?.message ?? 'Invalid DungeonMasterResponse payload',
    };
  }

  const value = parsed.data;
  const normalizedDifficulty =
    value.difficultyAdjustment === undefined
      ? undefined
      : Math.max(-1, Math.min(1, value.difficultyAdjustment));

  const normalized: DungeonMasterResponse = {
    dialogue: value.dialogue,
    mood: value.mood,
    difficultyAdjustment: normalizedDifficulty,
    hintType: value.hintType,
    hintContent: value.hintType ? value.hintContent : undefined,
  };

  return {
    ok: true,
    value: normalized,
  };
}
