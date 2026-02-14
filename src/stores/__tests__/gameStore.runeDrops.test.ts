/**
 * Integration tests for tile-drop to shop offer flow.
 * @module stores/__tests__/gameStore.runeDrops.test
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useGameStore } from '../gameStore';
import { createEmptyCell } from '@/types/cell';

describe('gameStore rune drops', () => {
  beforeEach(() => {
    useGameStore.getState().reset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('adds dropped rune offers to the next generated shop', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    useGameStore.setState((state) => {
      state.grid = [[createEmptyCell()]];
      state.gridConfig = { rows: 1, cols: 1, monsterCount: 0 };
      state.run.phase = 'playing';
      state.run.level = 1;
      state.run.revealedCount = 0;
      state.player.peekScrolls = 1;
    });

    expect(useGameStore.getState().usePeekScroll()).toBe(true);

    const droppedRuneIds = useGameStore.getState().run.tileDroppedRuneIds;
    expect(droppedRuneIds.length).toBe(1);
    expect(useGameStore.getState().run.tileRuneDropCount).toBe(1);

    useGameStore.getState().generateShop();
    expect(useGameStore.getState().run.availableRuneRewards).toContain(droppedRuneIds[0]);
  });

  it('still generates baseline rune offers when no drops occur', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);

    useGameStore.setState((state) => {
      state.grid = [[createEmptyCell()]];
      state.gridConfig = { rows: 1, cols: 1, monsterCount: 0 };
      state.run.phase = 'playing';
      state.run.level = 1;
      state.run.revealedCount = 0;
      state.player.peekScrolls = 1;
    });

    expect(useGameStore.getState().usePeekScroll()).toBe(true);
    expect(useGameStore.getState().run.tileDroppedRuneIds).toHaveLength(0);

    useGameStore.getState().generateShop();
    expect(useGameStore.getState().run.availableRuneRewards.length).toBe(3);
  });

  it('resets tile drop tracking when starting a new level', () => {
    useGameStore.setState((state) => {
      state.run.tileDroppedRuneIds = ['lucky-coin'];
      state.run.tileRuneDropCount = 1;
    });

    useGameStore.getState().startLevel(2);

    expect(useGameStore.getState().run.tileDroppedRuneIds).toHaveLength(0);
    expect(useGameStore.getState().run.tileRuneDropCount).toBe(0);
  });
});
