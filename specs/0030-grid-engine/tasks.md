# Tasks: Grid Engine

**Phase**: 0030
**Plan**: plan.md
**Created**: 2026-01-14

---

## Task Phases

### Setup (T001-T003)

- [x] T001 [P1] Create engine types file with RevealResult and FlagResult types `src/engine/types.ts`
- [x] T002 [P1] Create engine barrel export file `src/engine/index.ts`
- [x] T003 [P1] Verify test framework works with engine directory

### Grid Module (T004-T011)

- [x] T004 [P1] Implement createGrid function `src/engine/grid.ts`
- [x] T005 [P1] Implement placeMonsters function with exclusion support `src/engine/grid.ts`
- [x] T006 [P1] Implement getAdjacentPositions helper `src/engine/grid.ts`
- [x] T007 [P1] Implement calculateAdjacentCounts function `src/engine/grid.ts`
- [x] T008 [P1] Implement initializeGrid convenience function `src/engine/grid.ts`
- [x] T009 [P1] Write tests for createGrid `src/engine/grid.test.ts`
- [x] T010 [P1] Write tests for placeMonsters including exclusion `src/engine/grid.test.ts`
- [x] T011 [P1] Write tests for calculateAdjacentCounts `src/engine/grid.test.ts`

### Reveal Module (T012-T018)

- [x] T012 [P1] Implement isValidPosition helper `src/engine/reveal.ts`
- [x] T013 [P1] Implement floodFill using iterative queue approach `src/engine/reveal.ts`
- [x] T014 [P1] Implement revealCell returning RevealResult `src/engine/reveal.ts`
- [x] T015 [P1] Write tests for single cell reveal `src/engine/reveal.test.ts`
- [x] T016 [P1] Write tests for monster hit detection `src/engine/reveal.test.ts`
- [x] T017 [P1] Write tests for flood fill scenarios `src/engine/reveal.test.ts`
- [x] T018 [P1] Write tests for edge and corner cells `src/engine/reveal.test.ts`

### Flag Module (T019-T022)

- [x] T019 [P1] Implement toggleFlag function `src/engine/flag.ts`
- [x] T020 [P1] Write tests for flag toggle cycle `src/engine/flag.test.ts`
- [x] T021 [P1] Write tests for revealed cell rejection `src/engine/flag.test.ts`
- [x] T022 [P1] Write tests for question mark toggle `src/engine/flag.test.ts`

### Win Condition Module (T023-T027)

- [x] T023 [P1] Implement getSafeCellCount function `src/engine/win-condition.ts`
- [x] T024 [P1] Implement getRevealedCount function `src/engine/win-condition.ts`
- [x] T025 [P1] Implement checkWinCondition function `src/engine/win-condition.ts`
- [x] T026 [P1] Write tests for win condition detection `src/engine/win-condition.test.ts`
- [x] T027 [P1] Write tests for progress counting `src/engine/win-condition.test.ts`

### Polish (T028-T032)

- [x] T028 [P2] Add JSDoc comments to all exported functions
- [x] T029 [P2] Update engine barrel exports with all public functions `src/engine/index.ts`
- [x] T030 [P2] Run typecheck and fix any issues
- [x] T031 [P2] Run lint and fix any issues
- [x] T032 [P2] Run full test suite and verify 100% coverage

---

## Dependencies

```
T001 → T002 → T003 (Setup chain)
T003 → T004-T008 (Grid impl requires test verification)
T006 → T007 (adjacentPositions used by calculateAdjacent)
T004-T008 → T009-T011 (Tests after impl)
T006 → T012 (isValidPosition similar to adjacentPositions)
T007 → T013-T014 (Reveal needs adjacent counts)
T012-T014 → T015-T018 (Tests after impl)
T014 → T019 (Flag can use reveal types)
T019 → T020-T022 (Tests after impl)
T014 → T023-T025 (Win condition needs reveal context)
T023-T025 → T026-T027 (Tests after impl)
All → T028-T032 (Polish after core impl)
```

---

## Priority Legend

- **P1**: Critical path - must complete
- **P2**: Important - should complete
- **P3**: Nice to have - if time permits

---

## Task Count

| Phase | Count | Priority |
|-------|-------|----------|
| Setup | 3 | P1 |
| Grid Module | 8 | P1 |
| Reveal Module | 7 | P1 |
| Flag Module | 4 | P1 |
| Win Condition | 5 | P1 |
| Polish | 5 | P2 |
| **Total** | **32** | |
