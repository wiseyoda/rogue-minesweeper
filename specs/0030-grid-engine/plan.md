# Implementation Plan: Grid Engine

**Phase**: 0030
**Spec**: spec.md
**Created**: 2026-01-14

---

## Technical Context

### Existing Infrastructure

| Component | Location | Status |
|-----------|----------|--------|
| Core types (Cell, Grid, etc.) | `src/types/` | Complete |
| Vitest test framework | `vitest.config.ts` | Configured |
| TypeScript strict mode | `tsconfig.app.json` | Enabled |
| ESLint + Prettier | Project root | Configured |

### New Components

| Component | Location | Description |
|-----------|----------|-------------|
| Grid module | `src/engine/grid.ts` | Grid creation, monsters, counts |
| Reveal module | `src/engine/reveal.ts` | Cell reveal, flood fill |
| Flag module | `src/engine/flag.ts` | Flag toggling |
| Win condition module | `src/engine/win-condition.ts` | Win/progress checking |
| Engine barrel | `src/engine/index.ts` | Public exports |
| Grid tests | `src/engine/grid.test.ts` | Grid creation tests |
| Reveal tests | `src/engine/reveal.test.ts` | Reveal logic tests |
| Flag tests | `src/engine/flag.test.ts` | Flag toggle tests |
| Win tests | `src/engine/win-condition.test.ts` | Win condition tests |

---

## Constitution Compliance

| Principle | Impact | Compliance Approach |
|-----------|--------|---------------------|
| VII. Move Fast | High | Pure functions enable fast testing; modular design for incremental delivery |
| III. Emergent Complexity | Medium | Engine designed for extension (moving monsters can hook into reveal) |
| I. Information Is Power | Medium | Adjacent counts are core info; clean API for future rune effects |

**No violations identified.** Engine is foundational infrastructure.

---

## Architecture Decisions

### AD-1: Pure Functional Style

**Decision**: All engine functions are pure - no mutations, no side effects.

**Rationale**:
- Predictable behavior for testing
- Easy to reason about state transitions
- Enables time-travel debugging in future
- Aligns with Constitution principle VII (fast iteration through reliable tests)

**Trade-offs**:
- Slightly more memory usage (new grid per operation)
- For a 30x30 grid, this is negligible (~7KB per grid)

### AD-2: Module Organization

**Decision**: Separate modules by domain (grid, reveal, flag, win-condition).

**Rationale**:
- Clear separation of concerns
- Easy to locate relevant code
- Matches phase deliverable structure
- Enables independent testing

### AD-3: Result Objects

**Decision**: Use typed result objects (`RevealResult`, `FlagResult`) instead of tuples.

**Rationale**:
- Self-documenting code
- Extensible for future fields
- Better IDE autocomplete
- Type-safe destructuring

---

## Implementation Strategy

### Phase 1: Core Grid Operations

1. **grid.ts**: Create empty grid, place monsters, calculate adjacents
2. **grid.test.ts**: Unit tests for grid operations

### Phase 2: Cell Reveal Logic

1. **reveal.ts**: revealCell, floodFill, getAdjacentPositions
2. **reveal.test.ts**: Unit tests including flood fill scenarios

### Phase 3: Flag and Win Condition

1. **flag.ts**: toggleFlag
2. **win-condition.ts**: checkWinCondition, getSafeCellCount, getRevealedCount
3. **flag.test.ts**, **win-condition.test.ts**: Unit tests

### Phase 4: Integration and Polish

1. **index.ts**: Barrel exports
2. Integration tests spanning multiple modules
3. Documentation cleanup

---

## File Structure

```
src/engine/
├── index.ts              # Public API exports
├── types.ts              # Engine-specific types (RevealResult, FlagResult)
├── grid.ts               # Grid creation and setup
├── grid.test.ts          # Grid tests
├── reveal.ts             # Cell revealing and flood fill
├── reveal.test.ts        # Reveal tests
├── flag.ts               # Flag toggling
├── flag.test.ts          # Flag tests
├── win-condition.ts      # Win checking utilities
└── win-condition.test.ts # Win condition tests
```

---

## Type Definitions

New types to be added to `src/engine/types.ts`:

```typescript
/**
 * Result of revealing a cell.
 */
export interface RevealResult {
  /** Updated grid with revealed cell(s) */
  grid: Grid;
  /** True if a monster was hit */
  hitMonster: boolean;
  /** All positions that were revealed in this operation */
  revealedPositions: CellPosition[];
  /** True if win condition is now met */
  isWon: boolean;
}

/**
 * Result of toggling a flag.
 */
export interface FlagResult {
  /** Updated grid */
  grid: Grid;
  /** New state of the cell */
  newState: 'none' | 'flagged' | 'question';
}
```

---

## Testing Strategy

### Unit Test Coverage

| Module | Test File | Key Scenarios |
|--------|-----------|---------------|
| grid.ts | grid.test.ts | Empty grid, monster placement, exclusion, adjacent counts |
| reveal.ts | reveal.test.ts | Single reveal, monster hit, flood fill, edge cells |
| flag.ts | flag.test.ts | Toggle cycle, revealed cell rejection |
| win-condition.ts | win-condition.test.ts | Win detection, progress counting |

### Test Patterns

1. **AAA pattern**: Arrange, Act, Assert
2. **Edge cases**: Corners, edges, full grid, empty grid
3. **Deterministic**: Use known grid configurations, not random
4. **Isolation**: Each function tested independently

### Example Test Structure

```typescript
describe('createGrid', () => {
  it('creates a grid with correct dimensions', () => {
    const grid = createGrid({ rows: 5, cols: 5, monsterCount: 5 });
    expect(grid.length).toBe(5);
    expect(grid[0].length).toBe(5);
  });

  it('creates all cells as unrevealed', () => {
    const grid = createGrid({ rows: 3, cols: 3, monsterCount: 0 });
    for (const row of grid) {
      for (const cell of row) {
        expect(cell.isRevealed).toBe(false);
      }
    }
  });
});
```

---

## Dependencies

### Internal
- `@/types`: Cell, CellPosition, Grid, GridConfig, createEmptyCell

### External
- None (pure TypeScript, no runtime dependencies)

### Dev
- Vitest (already configured)

---

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Performance with large grids | Low | Medium | Benchmark at 30x30; optimize if needed |
| Flood fill stack overflow | Low | High | Use iterative approach with queue |
| Edge case bugs | Medium | Medium | Comprehensive test coverage |

---

## Success Metrics

- [ ] All tests pass: `npm run test:run`
- [ ] No type errors: `npm run typecheck`
- [ ] No lint errors: `npm run lint`
- [ ] 100% line coverage for engine modules
- [ ] Performance targets met (< 10ms grid creation)
