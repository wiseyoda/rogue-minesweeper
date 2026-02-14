# Tasks: Floor Progression

## Progress Dashboard

> Last updated: 2026-01-15T18:39:55Z | Run `specflow status` to refresh

| Phase | Status | Progress |
|-------|--------|----------|
| Setup (Shared Infrastructure) | DONE | 2/2 |
| User Story 1 - Floor Completion Bonus (Priority: P1) | DONE | 5/5 |
| User Story 2 - Progressive Difficulty (Priority: P1) | DONE | 2/2 |
| User Story 3 - Buff Persistence (Priority: P2) | DONE | 1/1 |
| Polish & Cross-Cutting Concerns | DONE | 2/2 |

**Overall**: 12/12 (100%) | **Current**: None

### Quick Status

- [x] T001 Create `src/engine/difficulty.ts` with DIFFICULTY_CONSTANTS and type exports
- [x] T002 Create `src/engine/__tests__/difficulty.test.ts` with test scaffolding
- [x] T003 Implement `getFloorConfig(level)` function in `src/engine/difficulty.ts`
- [x] T004 [P] Write unit tests for `getFloorConfig` at levels 1, 5, 10, 20 in `src/engine/__tests__/difficulty.test.ts`
- [x] T005 Update `src/stores/gameStore.ts` to import and use `getFloorConfig` for level initialization
- [x] T006 Add gold bonus award logic to win handler in `src/stores/gameStore.ts`
- [x] T007 Update `src/components/ui/WinModal.tsx` to display floor bonus (add `floorBonus` prop)
- [x] T008 Remove `calculateLevelGridConfig` from `src/types/game.ts`
- [x] T009 Update any remaining imports to use `getFloorConfig` from `@/engine/difficulty`
- [x] T010 Add integration test verifying shields persist across `startLevel` calls in `src/stores/__tests__/gameStore.test.ts`
---

**Input**: Design documents from `/specs/2010-floor-progression/`
**Prerequisites**: plan.md (required), spec.md (required)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create difficulty module foundation

- [x] T001 Create `src/engine/difficulty.ts` with DIFFICULTY_CONSTANTS and type exports
- [x] T002 Create `src/engine/__tests__/difficulty.test.ts` with test scaffolding

---

## Phase 2: User Story 1 - Floor Completion Bonus (Priority: P1)

**Goal**: Award gold bonus when player completes a floor

**Independent Test**: Complete floor 1, verify gold increased by level * 10

### Implementation for User Story 1

- [x] T003 Implement `getFloorConfig(level)` function in `src/engine/difficulty.ts`
- [x] T004 [P] Write unit tests for `getFloorConfig` at levels 1, 5, 10, 20 in `src/engine/__tests__/difficulty.test.ts`
- [x] T005 Update `src/stores/gameStore.ts` to import and use `getFloorConfig` for level initialization
- [x] T006 Add gold bonus award logic to win handler in `src/stores/gameStore.ts`
- [x] T007 Update `src/components/ui/WinModal.tsx` to display floor bonus (add `floorBonus` prop)

**Checkpoint**: Floor completion now awards gold bonus visible in UI

---

## Phase 3: User Story 2 - Progressive Difficulty (Priority: P1)

**Goal**: Ensure grid/monster scaling uses centralized constants

**Independent Test**: Compare floor 1 vs floor 5 grid sizes

### Implementation for User Story 2

- [x] T008 Remove `calculateLevelGridConfig` from `src/types/game.ts`
- [x] T009 Update any remaining imports to use `getFloorConfig` from `@/engine/difficulty`

**Checkpoint**: All scaling uses centralized difficulty module

---

## Phase 4: User Story 3 - Buff Persistence (Priority: P2)

**Goal**: Verify player buffs carry over between floors

**Independent Test**: Start with shields, complete floor, verify shields remain

### Implementation for User Story 3

- [x] T010 Add integration test verifying shields persist across `startLevel` calls in `src/stores/__tests__/gameStore.test.ts`

**Checkpoint**: Buff carryover confirmed working

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Damage prep and final cleanup

- [x] T011 Implement `getMonsterDamage(level)` stub function in `src/engine/difficulty.ts` (returns base damage only)
- [x] T012 Export difficulty module from `src/engine/index.ts`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **User Story 1 (Phase 2)**: Depends on T001 (difficulty.ts file created)
- **User Story 2 (Phase 3)**: Depends on T003 (getFloorConfig implemented)
- **User Story 3 (Phase 4)**: Can run in parallel with User Story 2
- **Polish (Phase 5)**: Can run in parallel with other phases

### Within User Story 1

1. T003 (getFloorConfig) → T004 (tests can run parallel)
2. T003 → T005 (gameStore needs getFloorConfig)
3. T005 → T006 (gold bonus logic after store update)
4. T006 → T007 (UI after state logic)

### Parallel Opportunities

- T004 (tests) can run alongside T003 implementation
- T011, T012 can run in parallel with any phase
- T008, T009 can run after T003

---

## Notes

- This is a small refactoring phase with one feature addition
- Most infrastructure already exists - primarily moving code
- Verify existing tests pass after each change
- Run `npm test` after each task to catch regressions
