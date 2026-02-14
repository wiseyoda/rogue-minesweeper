# Tasks: 4010 - AI Context Builder

## Phase Goals Coverage

| # | Phase Goal | Spec Requirement(s) | Task(s) | Status |
|---|------------|---------------------|---------|--------|
| 1 | Build the system that collects player history for AI prompts. | FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-008, NFR-002 | T001-T018 | COVERED |

Coverage: 1/1 goals (100%)

---

## Progress Dashboard

**Overall**: 0/18 (0%)

---

## Phase 1: Setup

- [x] T001 [P1] Create AI domain contracts in `src/types/ai.ts`.
- [x] T002 [P1] Export AI types from `src/types/index.ts`.
- [x] T003 [P1] Add dungeon store state/action/type interfaces in `src/stores/types.ts`.

## Phase 2: Foundational

- [x] T004 [P1] Create `src/stores/dungeonStore.ts` with persisted state for run history, recent actions, near-death counters, and request window metadata.
- [x] T005 [P1] Export `useDungeonStore` and Dungeon store types from `src/stores/index.ts`.
- [x] T006 [P1] Create context aggregation helpers in `src/ai/context.ts` (`favoriteRunes`, `recentDeathCauses`, `monstersRemaining`, `estimateTokens`).
- [x] T007 [P1] Add public builders in `src/ai/context.ts` for state input and live-store input.

## Phase 3: User Story 1 - Current Context Snapshot (P1)

- [x] T008 [P2] [US01] Map current-run fields (`currentFloor`, `currentHP`, `currentGold`, `equippedRunes`) from game state in `src/ai/context.ts`.
- [x] T009 [P2] [US01] Map situation fields (`tilesRevealed`, `monstersRemaining`) from grid/run state in `src/ai/context.ts`.
- [x] T010 [P2] [US01] Enforce most-recent-10 truncation for `recentActions` in `src/ai/context.ts`.

## Phase 4: User Story 2 - History Tracking (P1)

- [x] T011 [P2] [US02] Implement `recordAction()` and action-buffer cap logic in `src/stores/dungeonStore.ts`.
- [x] T012 [P2] [US02] Implement `markNearDeathMoment()` and `resetNearDeathMoments()` in `src/stores/dungeonStore.ts`.
- [x] T013 [P2] [US02] Implement `recordRunResult()` and history-cap logic in `src/stores/dungeonStore.ts`.
- [x] T014 [P2] [US02] Aggregate `favoriteRunes` and `recentDeathCauses` deterministically in `src/ai/context.ts`.

## Phase 5: User Story 3 - Rate Limiting Preparation (P2)

- [x] T015 [P2] [US03] Implement `resetRateWindowIfExpired()` in `src/stores/dungeonStore.ts`.
- [x] T016 [P2] [US03] Implement `canRequestContext()` and `registerContextRequest()` in `src/stores/dungeonStore.ts`.
- [x] T017 [P2] [US03] Enforce estimated token-size guard (<2k) in `src/ai/context.ts`.

## Phase 6: Polish and Validation

- [x] T018 [P3] Add tests in `src/ai/__tests__/context.test.ts` and `src/stores/__tests__/dungeonStore.test.ts`, then run typecheck/lint/tests.
