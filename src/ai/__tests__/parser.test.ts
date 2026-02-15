/**
 * Tests for Dungeon Master response parser.
 * @module ai/__tests__/parser
 */

import { describe, expect, it } from 'vitest';
import { parseDungeonMasterResponse } from '../parser';

describe('parseDungeonMasterResponse', () => {
  it('parses valid payload strings', () => {
    const result = parseDungeonMasterResponse(
      JSON.stringify({
        dialogue: 'Careful now.',
        mood: 'curious',
        difficultyAdjustment: 0.5,
        hintType: 'safe_path',
        hintContent: 'Check adjacent low-risk tiles.',
      })
    );

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.value.dialogue).toBe('Careful now.');
    expect(result.value.mood).toBe('curious');
    expect(result.value.difficultyAdjustment).toBe(0.5);
    expect(result.value.hintType).toBe('safe_path');
  });

  it('rejects malformed payloads', () => {
    const malformed = parseDungeonMasterResponse('{"dialogue": "oops"');
    const missingField = parseDungeonMasterResponse(
      JSON.stringify({
        mood: 'amused',
      })
    );

    expect(malformed.ok).toBe(false);
    expect(missingField.ok).toBe(false);
  });

  it('normalizes optional fields and clamps difficulty', () => {
    const result = parseDungeonMasterResponse(
      JSON.stringify({
        dialogue: 'You made it... barely.',
        mood: 'impressed',
        difficultyAdjustment: 42,
        hintContent: 'This should be removed because hintType is missing.',
      })
    );

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.value.difficultyAdjustment).toBe(1);
    expect(result.value.hintType).toBeUndefined();
    expect(result.value.hintContent).toBeUndefined();
  });
});
