/**
 * Tests for Dungeon Master generation fallback chain.
 * @module ai/__tests__/generate
 */

import { describe, expect, it } from 'vitest';
import type { DungeonMasterContext } from '@/types';
import { createDungeonMasterGenerator } from '../generate';

const baseContext: DungeonMasterContext = {
  totalRuns: 3,
  bestFloor: 7,
  favoriteRunes: ['oracle-sight'],
  recentDeathCauses: ['trap'],
  currentFloor: 4,
  currentHP: 2,
  currentGold: 55,
  equippedRunes: ['hardy'],
  recentActions: ['revealed (2,3)'],
  tilesRevealed: 11,
  monstersRemaining: 5,
  nearDeathMoments: 1,
  requestType: 'hint',
};

function buildResponseJson(overrides: Partial<Record<string, unknown>> = {}): string {
  return JSON.stringify({
    dialogue: 'The walls are listening.',
    mood: 'curious',
    ...overrides,
  });
}

describe('createDungeonMasterGenerator', () => {
  it('uses Gemini first and short-circuits on success', async () => {
    const calls: string[] = [];
    const generator = createDungeonMasterGenerator({
      config: {
        geminiModel: 'gemini-2.5-flash',
        claudeModel: 'claude-3-5-haiku-latest',
        providerTimeoutMs: 6_000,
        cooldownMs: 30_000,
      },
      invokeProvider: async ({ provider }) => {
        calls.push(provider);
        if (provider === 'gemini') {
          return buildResponseJson();
        }
        return buildResponseJson({ dialogue: 'Claude fallback' });
      },
    });

    const result = await generator.generate(baseContext);

    expect(result.source).toBe('gemini');
    expect(result.response.mood).toBe('curious');
    expect(calls).toEqual(['gemini']);
  });

  it('falls back to Claude when Gemini fails', async () => {
    const calls: string[] = [];
    const generator = createDungeonMasterGenerator({
      config: {
        geminiModel: 'gemini-2.5-flash',
        claudeModel: 'claude-3-5-haiku-latest',
        providerTimeoutMs: 6_000,
        cooldownMs: 30_000,
      },
      invokeProvider: async ({ provider }) => {
        calls.push(provider);
        if (provider === 'gemini') {
          throw new Error('gemini_down');
        }
        return buildResponseJson({ dialogue: 'Claude has entered the chat.' });
      },
    });

    const result = await generator.generate(baseContext);

    expect(result.source).toBe('claude');
    expect(result.response.dialogue).toContain('Claude');
    expect(result.providerErrors.gemini).toBe('gemini_down');
    expect(calls).toEqual(['gemini', 'claude']);
  });

  it('returns local fallback when both providers fail', async () => {
    const generator = createDungeonMasterGenerator({
      config: {
        geminiModel: 'gemini-2.5-flash',
        claudeModel: 'claude-3-5-haiku-latest',
        providerTimeoutMs: 6_000,
        cooldownMs: 30_000,
      },
      random: () => 0,
      invokeProvider: async () => {
        throw new Error('provider_failed');
      },
    });

    const result = await generator.generate(baseContext);

    expect(result.source).toBe('fallback');
    expect(result.response.dialogue.length).toBeGreaterThan(0);
    expect(result.providerErrors.gemini).toBe('provider_failed');
    expect(result.providerErrors.claude).toBe('provider_failed');
  });

  it('enforces cooldown and skips provider calls during active window', async () => {
    let currentTime = 1_000;
    const calls: string[] = [];

    const generator = createDungeonMasterGenerator({
      config: {
        geminiModel: 'gemini-2.5-flash',
        claudeModel: 'claude-3-5-haiku-latest',
        providerTimeoutMs: 6_000,
        cooldownMs: 30_000,
      },
      now: () => currentTime,
      random: () => 0,
      invokeProvider: async ({ provider }) => {
        calls.push(provider);
        return buildResponseJson();
      },
    });

    const first = await generator.generate(baseContext);
    currentTime = 2_000;
    const second = await generator.generate(baseContext);

    expect(first.source).toBe('gemini');
    expect(second.source).toBe('fallback');
    expect(second.cooldownActive).toBe(true);
    expect(calls).toEqual(['gemini']);
  });
});
