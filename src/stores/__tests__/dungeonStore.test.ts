/**
 * Tests for dungeonStore.
 * @module stores/__tests__/dungeonStore
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { useDungeonStore } from '../dungeonStore';

describe('dungeonStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useDungeonStore.getState().reset();
  });

  it('should start with empty history and action buffers', () => {
    const state = useDungeonStore.getState();

    expect(state.runHistory).toEqual([]);
    expect(state.recentActions).toEqual([]);
    expect(state.nearDeathMoments).toBe(0);
    expect(state.rateLimit.requestCount).toBe(0);
  });

  it('should trim action history to configured cap', () => {
    const store = useDungeonStore.getState();
    for (let i = 1; i <= 55; i++) {
      store.recordAction(`action-${i}`);
    }

    const state = useDungeonStore.getState();
    expect(state.recentActions).toHaveLength(50);
    expect(state.recentActions[0]).toBe('action-6');
    expect(state.recentActions[49]).toBe('action-55');
  });

  it('should track and reset near-death moments', () => {
    const store = useDungeonStore.getState();
    store.markNearDeathMoment();
    store.markNearDeathMoment();
    store.markNearDeathMoment();
    expect(useDungeonStore.getState().nearDeathMoments).toBe(3);

    store.resetNearDeathMoments();
    expect(useDungeonStore.getState().nearDeathMoments).toBe(0);
  });

  it('should record run results and reset near-death counter', () => {
    const store = useDungeonStore.getState();
    store.markNearDeathMoment();
    store.markNearDeathMoment();

    store.recordRunResult({
      result: 'death',
      level: 4,
      gold: 77,
      equippedRunes: ['lucky-coin'],
      deathCause: 'spike trap',
    });

    const state = useDungeonStore.getState();
    expect(state.runHistory).toHaveLength(1);
    expect(state.runHistory[0].nearDeathMoments).toBe(2);
    expect(state.runHistory[0].deathCause).toBe('spike trap');
    expect(state.nearDeathMoments).toBe(0);
  });

  it('should cap run history to 100 entries', () => {
    const store = useDungeonStore.getState();

    for (let i = 1; i <= 101; i++) {
      store.recordRunResult({
        result: 'death',
        level: i,
        gold: i,
        equippedRunes: [],
        deathCause: `cause-${i}`,
      });
    }

    const state = useDungeonStore.getState();
    expect(state.runHistory).toHaveLength(100);
    expect(state.runHistory[0].level).toBe(2);
    expect(state.runHistory[99].level).toBe(101);
  });

  it('should enforce request window limits and reset after expiration', () => {
    const store = useDungeonStore.getState();
    const now = 1000;

    for (let i = 0; i < 20; i++) {
      expect(store.registerContextRequest(now + i)).toBe(true);
    }

    expect(store.canRequestContext(now + 10)).toBe(false);
    expect(store.registerContextRequest(now + 11)).toBe(false);

    const nextWindow = now + 60_000;
    store.resetRateWindowIfExpired(nextWindow);
    expect(store.canRequestContext(nextWindow)).toBe(true);
    expect(store.registerContextRequest(nextWindow)).toBe(true);
  });
});

