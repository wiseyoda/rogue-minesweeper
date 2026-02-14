/**
 * Dungeon store - AI context telemetry and history state.
 * @module stores/dungeonStore
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { DungeonStore } from './types';
import type { DungeonRunRecord } from '@/types';

const ACTION_HISTORY_LIMIT = 50;
const RUN_HISTORY_LIMIT = 100;
const DEFAULT_RATE_WINDOW_MS = 60_000;
const DEFAULT_MAX_REQUESTS = 20;

/**
 * Initial state for the dungeon store.
 */
const initialState = {
  runHistory: [] as DungeonRunRecord[],
  recentActions: [] as string[],
  nearDeathMoments: 0,
  rateLimit: {
    windowStartedAt: 0,
    requestCount: 0,
    windowMs: DEFAULT_RATE_WINDOW_MS,
    maxRequests: DEFAULT_MAX_REQUESTS,
  },
} as const;

/**
 * Dungeon store hook.
 * Persists history and request-window state for AI context generation.
 */
export const useDungeonStore = create<DungeonStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        recordAction: (action: string) => {
          const value = action.trim();
          if (!value) return;

          set((state) => {
            state.recentActions.push(value);
            if (state.recentActions.length > ACTION_HISTORY_LIMIT) {
              state.recentActions.splice(0, state.recentActions.length - ACTION_HISTORY_LIMIT);
            }
          });
        },

        markNearDeathMoment: () => {
          set((state) => {
            state.nearDeathMoments += 1;
          });
        },

        resetNearDeathMoments: () => {
          set((state) => {
            state.nearDeathMoments = 0;
          });
        },

        recordRunResult: (record) => {
          set((state) => {
            const runRecord: DungeonRunRecord = {
              result: record.result,
              level: record.level,
              gold: record.gold,
              equippedRunes: [...record.equippedRunes],
              deathCause: record.deathCause?.trim() || undefined,
              nearDeathMoments: record.nearDeathMoments ?? state.nearDeathMoments,
              endedAt: record.endedAt ?? new Date().toISOString(),
            };

            state.runHistory.push(runRecord);
            if (state.runHistory.length > RUN_HISTORY_LIMIT) {
              state.runHistory.splice(0, state.runHistory.length - RUN_HISTORY_LIMIT);
            }

            state.nearDeathMoments = 0;
          });
        },

        resetRateWindowIfExpired: (now: number = Date.now()) => {
          set((state) => {
            const { windowStartedAt, windowMs } = state.rateLimit;
            const shouldReset = windowStartedAt === 0 || now - windowStartedAt >= windowMs;

            if (shouldReset) {
              state.rateLimit.windowStartedAt = now;
              state.rateLimit.requestCount = 0;
            }
          });
        },

        canRequestContext: (now: number = Date.now()) => {
          get().resetRateWindowIfExpired(now);
          const { rateLimit } = get();
          return rateLimit.requestCount < rateLimit.maxRequests;
        },

        registerContextRequest: (now: number = Date.now()) => {
          get().resetRateWindowIfExpired(now);

          if (!get().canRequestContext(now)) {
            return false;
          }

          set((state) => {
            state.rateLimit.requestCount += 1;
            if (state.rateLimit.windowStartedAt === 0) {
              state.rateLimit.windowStartedAt = now;
            }
          });

          return true;
        },

        reset: () => {
          set(() => ({
            runHistory: [],
            recentActions: [],
            nearDeathMoments: 0,
            rateLimit: {
              windowStartedAt: 0,
              requestCount: 0,
              windowMs: DEFAULT_RATE_WINDOW_MS,
              maxRequests: DEFAULT_MAX_REQUESTS,
            },
          }));
        },
      })),
      {
        name: 'dungeon-delver-dungeon',
        partialize: (state) => ({
          runHistory: state.runHistory,
          recentActions: state.recentActions,
          nearDeathMoments: state.nearDeathMoments,
          rateLimit: state.rateLimit,
        }),
      }
    ),
    { name: 'DungeonStore' }
  )
);

