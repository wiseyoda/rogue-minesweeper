# Requirements Checklist: Grid Engine

**Phase**: 0030
**Spec**: spec.md

---

## Functional Requirements

### FR-1: Grid Creation
- [ ] FR-1.1: Create empty grid with specified dimensions
- [ ] FR-1.2: Place monsters randomly with exclusion support
- [ ] FR-1.3: Calculate adjacent monster counts (8-directional)

### FR-2: Cell Reveal
- [ ] FR-2.1: Reveal cell returns RevealResult with grid/hit/positions/won
- [ ] FR-2.2: Flood fill reveals connected empty cells
- [ ] FR-2.3: First-click safety via monster placement exclusion

### FR-3: Flag Toggle
- [ ] FR-3.1: Three-state cycle (unrevealed → flagged → question → unrevealed)
- [ ] FR-3.2: Only unrevealed cells can be flagged

### FR-4: Win Condition
- [ ] FR-4.1: Win when all non-monster cells revealed
- [ ] FR-4.2: Safe cell count utility

---

## Non-Functional Requirements

### NFR-1: Performance
- [ ] Grid creation < 10ms for 30x30
- [ ] Reveal operation < 5ms
- [ ] Win check < 1ms

### NFR-2: Test Coverage
- [ ] 100% line coverage for engine modules
- [ ] Edge cases covered
- [ ] Deterministic tests

### NFR-3: Code Quality
- [ ] All functions have JSDoc
- [ ] No `any` types
- [ ] Follows project coding standards

---

## Acceptance Criteria

- [ ] `createGrid(rows, cols, monsterCount)` produces valid grid
- [ ] Adjacent counts are accurate for all cells
- [ ] Flood fill reveals all connected empty cells
- [ ] First click never hits a monster
- [ ] Flag toggles through three states correctly
- [ ] Win condition detects when all safe cells revealed
- [ ] All tests pass with `npm run test:run`
