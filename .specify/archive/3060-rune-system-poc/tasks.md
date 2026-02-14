# Tasks: 3060 - Rune System POC

## Phase Goals Coverage

| # | Phase Goal | Spec Requirement(s) | Task(s) | Status |
|---|------------|---------------------|---------|--------|
| 1 | Playable game with 10+ runes and synergies | FR-001, FR-005 | T001, T006, T009, T010 | COVERED |
| 2 | Integrate all runes from previous phases | FR-001, FR-004 | T001, T004, T005, T008 | COVERED |
| 3 | Runes drop from revealed tiles | FR-002, FR-003, FR-006 | T002, T003, T004, T006, T007 | COVERED |
| 4 | Runes purchasable in shop | FR-004 | T004, T005, T008 | COVERED |
| 5 | Synergies discoverable and apply bonuses | FR-005 | T004, T009 | COVERED |
| 6 | Balance tuning yields distinct viable builds | FR-006, NFR-001, NFR-002 | T003, T006, T007, T010, T011 | COVERED |

Coverage: 6/6 goals (100%)

---

## Progress Dashboard

**Overall**: 0/11 (0%)  
**Current**: Setup

---

## Phase 1: Setup

- [x] T001 Audit and lock rune catalog invariants (10+ runes and category coverage) in `src/data/runes.ts` and `src/data/__tests__/runes.poc.test.ts`

## Phase 2: Foundational (Blocking)

- [x] T002 Add run-state fields for per-floor rune drops and reset behavior in `src/types/game.ts` and `src/stores/gameStore.ts`
- [x] T003 [P] Add tile rune-drop helper with chance/cap constants in `src/engine/runes.ts`
- [x] T004 Integrate drop rolling in reveal flows and merge dropped offers into shop generation in `src/stores/gameStore.ts`
- [x] T005 Preserve dropped-rune purchase UX in shop rendering and messaging in `src/components/shop/FloorShop.tsx`

## Phase 3: User Story 1 - Tile Drop To Shop (P1)

- [x] T006 [P] Add unit tests for drop chance, cap, and deterministic RNG behavior in `src/engine/__tests__/runeDrops.test.ts`
- [x] T007 [P] Add integration tests for reveal -> drop -> shop offer flow in `src/stores/__tests__/gameStore.runeDrops.test.ts`

## Phase 4: User Story 2 - Purchase & Economy Integrity (P1)

- [x] T008 [P] Extend shop purchase tests for dropped rune offers and modifier-aware pricing in `src/stores/__tests__/gameStore.shop.test.ts`

## Phase 5: User Story 3 - Synergy Discoverability (P2)

- [x] T009 [P] Extend game store regression tests for drop flow compatibility with synergy discovery/notification in `src/stores/__tests__/gameStore.test.ts`

## Phase 6: Polish & Verification

- [x] T010 Add build-coverage balance test for archetype viability signals in `src/data/__tests__/runes.poc.test.ts`
- [x] T011 Run verification commands (`pnpm test`, `pnpm lint`, `pnpm typecheck`) and resolve issues in touched files

## Dependencies & Execution Order

1. T001 -> T002/T003
2. T002 + T003 -> T004
3. T004 -> T005/T006/T007/T008/T009
4. T006/T007/T008/T009 -> T010
5. T010 -> T011
