# Tasks: Phase 3030 - Defense Runes

## Setup Tasks

- [x] T001 [P1] Add `undyingRevealCount` field to PlayerState in `src/types/player.ts`
- [x] T002 [P1] Update `createInitialPlayerState()` to initialize `undyingRevealCount: 0`
- [x] T003 [P1] Add `damageReductionPercent` and `maxLivesBonus` to RuneModifiers in `src/types/rune.ts`
- [x] T004 [P1] Update `createDefaultRuneModifiers()` to include new fields with default values

## Rune Definitions

- [x] T005 [P1] Add Hardy rune definition to RUNES array in `src/data/runes.ts`
- [x] T006 [P1] Add Shield Bearer rune definition to RUNES array in `src/data/runes.ts`
- [x] T007 [P1] Add Iron Skin rune definition to RUNES array in `src/data/runes.ts`
- [x] T008 [P1] Add Undying rune definition to RUNES array in `src/data/runes.ts`

## Engine Implementation

- [x] T009 [P2] Update `getPassiveRuneModifiers()` to calculate `maxLivesBonus` for Hardy rune
- [x] T010 [P2] Update `applyOnFloorStartRunes()` to return shields granted by Shield Bearer
- [x] T011 [P2] Update `applyOnDamageRunes()` to apply Iron Skin 25% reduction after Stone Skin
- [x] T012 [P2] Update `applyOnRevealRunes()` to track Undying reveals and return heal signal

## Store Integration

- [x] T013 [P2] Update gameStore to handle Hardy maxLives bonus on rune equip
- [x] T014 [P2] Update gameStore to handle Hardy bonus removal on rune unequip (clamp lives)
- [x] T015 [P2] Update gameStore to apply Shield Bearer shields on floor start
- [x] T016 [P2] Update gameStore to track `undyingRevealCount` and heal when threshold reached
- [x] T017 [P2] Ensure `undyingRevealCount` persists through floor transitions and shop visits

## Testing

- [x] T018 [P3] Create test file `src/engine/__tests__/defenseRunes.test.ts`
- [x] T019 [P3] Write unit tests for Hardy rune maxLives bonus
- [x] T020 [P3] Write unit tests for Shield Bearer floor start shields
- [x] T021 [P3] Write unit tests for Iron Skin damage reduction
- [x] T022 [P3] Write unit tests for Undying reveal tracking and heal
- [x] T023 [P3] Write integration test for damage pipeline order

## Verification

- [x] T024 [P3] Run full test suite to ensure no regressions
- [x] T025 [P3] Manual playtest: equip Hardy and verify maxLives increases *(deferred to user verification gate)*
- [x] T026 [P3] Manual playtest: equip Shield Bearer and verify shields at floor start *(deferred to user verification gate)*
- [x] T027 [P3] Manual playtest: equip Iron Skin and verify damage reduction *(deferred to user verification gate)*
- [x] T028 [P3] Manual playtest: equip Undying and verify heal after 50 reveals *(deferred to user verification gate)*

---

## Task Dependencies

```
T001 ──┬──> T002
       │
T003 ──┴──> T004
       │
       ├──> T005, T006, T007, T008 ──> T009, T010, T011, T012
       │                                      │
       │                                      v
       └─────────────────────────────> T013, T014, T015, T016, T017
                                              │
                                              v
                                        T018 ──> T019-T023
                                              │
                                              v
                                        T024 ──> T025-T028
```

## Priority Legend

- **P1**: Setup/Foundational (must complete first)
- **P2**: Core Implementation (depends on P1)
- **P3**: Testing/Verification (depends on P2)
