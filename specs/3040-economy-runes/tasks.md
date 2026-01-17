# Tasks: 3040 - Economy Runes

**Phase**: 3040-economy-runes
**Generated**: 2026-01-17

---

## Phases

### Phase 1: Setup

- [x] T001 [P1] Create test file skeleton `src/engine/__tests__/economyRunes.test.ts`

### Phase 2: Foundational

- [x] T002 [P1] Add `shopDiscount` and `shopPriceIncrease` fields to `RuneModifiers` in `src/types/rune.ts`
- [x] T003 [P1] Update `createDefaultRuneModifiers()` with default values (0) in `src/types/rune.ts`
- [x] T004 [P1] Add `calculateShopPrice()` utility function in `src/engine/runes.ts`
- [x] T005 [P1] Add tests for `calculateShopPrice()` in `src/engine/__tests__/economyRunes.test.ts`

### Phase 3: US-01 - Gold-Focused Build (Lucky Coin)

- [x] T006 [P1] [US01] Add Lucky Coin rune definition to `RUNES[]` in `src/data/runes.ts`
- [x] T007 [P2] [US01] Implement Lucky Coin proc logic (per-tile, 10% chance, doubles gold) in `src/stores/gameStore.ts`
- [x] T008 [P2] [US01] Add unit tests for Lucky Coin proc chance in `src/engine/__tests__/economyRunes.test.ts`

### Phase 4: US-02 - Budget Shopper Build (Bargain Hunter)

- [x] T009 [P1] [US02] Add Bargain Hunter rune definition to `RUNES[]` in `src/data/runes.ts`
- [x] T010 [P2] [US02] Add Bargain Hunter case to `getPassiveRuneModifiers()` in `src/engine/runes.ts`
- [x] T011 [P2] [US02] Update `purchaseItem()` to use `calculateShopPrice()` in `src/stores/gameStore.ts`
- [x] T012 [P2] [US02] Update `selectRuneReward()` to use `calculateShopPrice()` in `src/stores/gameStore.ts`
- [x] T013 [P2] [US02] Update reroll cost calculation to use `calculateShopPrice()` in `src/stores/gameStore.ts`
- [x] T014 [P2] [US02] Add unit tests for Bargain Hunter discount in `src/engine/__tests__/economyRunes.test.ts`

### Phase 5: US-03 - Risk/Reward Trade-off (Golden Goose)

- [x] T015 [P1] [US03] Add Golden Goose rune definition to `RUNES[]` in `src/data/runes.ts`
- [x] T016 [P2] [US03] Add Golden Goose case to `getPassiveRuneModifiers()` in `src/engine/runes.ts`
- [x] T017 [P2] [US03] Add unit tests for Golden Goose dual modifier in `src/engine/__tests__/economyRunes.test.ts`
- [x] T018 [P3] [US03] Add integration test for Golden Goose + Bargain Hunter combination

### Phase 6: US-04 - Floor Completion Bonuses (Treasure Hunter)

- [x] T019 [P1] [US04] Add Treasure Hunter rune definition to `RUNES[]` in `src/data/runes.ts`
- [x] T020 [P2] [US04] Add `checkTreasureCache()` function in `src/engine/runes.ts`
- [x] T021 [P2] [US04] Integrate Treasure Hunter check in floor completion logic in `src/stores/gameStore.ts`
- [x] T022 [P2] [US04] Add unit tests for Treasure Hunter proc and gold amount in `src/engine/__tests__/economyRunes.test.ts`

### Phase 7: Polish

- [x] T023 [P3] Run full test suite and fix any failures
- [x] T024 [P3] Run ESLint and fix any errors
- [x] T025 [P3] Run TypeScript strict mode check and fix any errors

---

## Task Dependencies

```
T001 (test skeleton)
  └─> T005, T008, T014, T017, T018, T022

T002 + T003 (type changes)
  └─> T004, T010, T016

T004 (calculateShopPrice)
  └─> T005, T011, T012, T013

T006 (Lucky Coin def)
  └─> T007, T008

T009 (Bargain Hunter def)
  └─> T010, T014

T015 (Golden Goose def)
  └─> T016, T017, T018

T019 (Treasure Hunter def)
  └─> T020, T021, T022

T011, T012, T013 (shop integration)
  └─> T023 (test suite)
```

---

## Execution Order

1. **Setup**: T001
2. **Foundational**: T002, T003, T004, T005
3. **Definitions**: T006, T009, T015, T019 (parallel)
4. **Engine Logic**: T007, T010, T016, T020 (parallel)
5. **Store Integration**: T011, T012, T013, T021 (parallel)
6. **Testing**: T008, T014, T017, T018, T022 (parallel)
7. **Polish**: T023, T024, T025 (sequential)

---

## Priority Legend

- **P1**: Foundational - blocks other work
- **P2**: Core functionality - main implementation
- **P3**: Polish - quality and verification
