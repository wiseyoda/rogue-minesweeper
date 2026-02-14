# Tasks: 3050 - Rune Synergies

**Phase**: `3050-rune-synergies`  
**Generated**: 2026-02-14

---

## Phase 1: Setup

- [x] T001 [P1] Create phase test scaffold `src/engine/__tests__/synergies.test.ts`
- [x] T002 [P1] Add synergy data module `src/data/synergies.ts` with typed definitions

## Phase 2: Foundational Engine & Types

- [x] T003 [P1] Create synergy engine module `src/engine/synergies.ts` (detection + modifiers + discovery diff)
- [x] T004 [P1] Export synergy engine APIs from `src/engine/index.ts` as needed
- [x] T005 [P1] Add `SynergyDefinition` and `SynergyModifiers` types in `src/data/synergies.ts` (or dedicated types file if needed)
- [x] T006 [P1] Extend `RunState` in `src/types/game.ts` with `activeSynergyIds`, `discoveredSynergyIds`, and `synergyNotification`
- [x] T007 [P1] Update run-state initializer in `src/types/game.ts` for new synergy fields
- [x] T008 [P1] Update store contract in `src/stores/types.ts` for synergy notification dismissal action
- [x] T009 [P1] Add unit tests for synergy detection in `src/engine/__tests__/synergies.test.ts`
- [x] T010 [P1] Add unit tests for synergy modifier aggregation in `src/engine/__tests__/synergies.test.ts`
- [x] T011 [P1] Add unit tests for newly-discovered ID calculation in `src/engine/__tests__/synergies.test.ts`

## Phase 3: US-01 Combo Detection (P1)

- [x] T012 [P1] [US01] Add internal `refreshSynergies` helper in `src/stores/gameStore.ts`
- [x] T013 [P1] [US01] Recompute synergies in rune mutation paths (`equipRune`, `replaceRune`, `confirmRuneReplacement`, `selectRuneReward`)
- [x] T014 [P1] [US01] Recompute synergies at `startLevel` and reset synergy state in `startNewRun`
- [x] T015 [P1] [US01] Add store tests for activation/deactivation and multi-synergy activation in `src/stores/__tests__/gameStore.test.ts`

## Phase 4: US-02 Bonus Effects (P1)

- [x] T016 [P2] [US02] Apply Hunter's Vision floor-start extra reveal in `src/stores/gameStore.ts`
- [x] T017 [P2] [US02] Apply Seer guaranteed prophecy at floor start in `src/stores/gameStore.ts`
- [x] T018 [P2] [US02] Apply Fortified Deal extra shield at floor start in `src/stores/gameStore.ts`
- [x] T019 [P2] [US02] Apply Greedy floor completion bonus multiplier in `setPhase('shopping')`
- [x] T020 [P2] [US02] Apply Immortal second-chance bonus HP in damage pipeline
- [x] T021 [P2] [US02] Apply Fortified Deal extra shop discount in purchase/reroll/rune-buy/removal-fee price paths
- [x] T022 [P2] [US02] Add/extend store tests for all synergy bonuses in `src/stores/__tests__/gameStore.test.ts`
- [x] T023 [P2] [US02] Add shop-price synergy tests in `src/stores/__tests__/gameStore.shop.test.ts`

## Phase 5: US-03 Notification & UI (P2)

- [x] T024 [P2] [US03] Create `src/components/hud/SynergyNotification.tsx`
- [x] T025 [P2] [US03] Export notification component from `src/components/hud/index.ts`
- [x] T026 [P2] [US03] Render synergy notification in `src/components/sidebar/Sidebar.tsx`
- [x] T027 [P2] [US03] Extend `src/components/sidebar/RunesPanel.tsx` to display active synergy list
- [x] T028 [P2] [US03] Add store action to dismiss notification and wire auto/manual dismissal
- [x] T029 [P2] [US03] Add component test(s) for notification render/dismiss behavior

## Phase 6: Polish & Validation

- [x] T030 [P3] Verify no regressions in existing rune tests (`src/engine/__tests__/defenseRunes.test.ts`, `src/engine/__tests__/economyRunes.test.ts`)
- [x] T031 [P3] Run targeted tests for synergy + store + UI changes
- [x] T032 [P3] Run full quality gates: `pnpm test`, `pnpm lint`, `pnpm typecheck`
- [x] T033 [P3] Address any failing checks and finalize

---

## Task Dependencies

```
T001,T002 -> T003,T005
T003,T005 -> T009,T010,T011,T012
T006,T007,T008 -> T012
T012 -> T013,T014
T013,T014 -> T015
T012 -> T016,T017,T018,T019,T020,T021
T016..T021 -> T022,T023
T006,T012 -> T024,T026,T027,T028
T024 -> T025,T029
T015,T022,T023,T029 -> T030,T031
T031 -> T032 -> T033
```

## Goal Coverage

| Phase Goal | Primary Tasks |
|-----------|----------------|
| Synergy definition system | T002, T005 |
| Combo detection engine | T003, T009, T010, T011, T012, T013, T014 |
| Synergy bonus effects | T016, T017, T018, T019, T020, T021, T022, T023 |
| Synergy discovery notification | T024, T026, T028, T029 |
| Synergy display in UI | T027 |

## Requirements Coverage

| Requirement | Implementing Tasks |
|-------------|--------------------|
| FR-001 | T002, T005 |
| FR-002 | T003, T009 |
| FR-003 | T003, T012, T013, T015 |
| FR-004 | T003, T011, T012, T014 |
| FR-005 | T019, T022 |
| FR-006 | T018, T021, T022, T023 |
| FR-007 | T020, T022 |
| FR-008 | T017, T022 |
| FR-009 | T016, T022 |
| FR-010 | T012, T014, T028 |
| FR-011 | T024, T025, T026, T029 |
| FR-012 | T027 |
| FR-013 | T014 |
| FR-014 | T030, T031, T033 |
