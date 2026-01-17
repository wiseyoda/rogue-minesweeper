# Verification Checklist: Grid Engine

**Phase**: 0030
**Purpose**: Post-implementation verification

---

## Functional Verification

### Grid Creation

- [ ] `createGrid({rows: 5, cols: 5, monsterCount: 0})` returns 5x5 grid
- [ ] All cells in new grid are unrevealed
- [ ] All cells in new grid have `adjacentMonsters: 0`

### Monster Placement

- [ ] `placeMonsters` places exactly `count` monsters
- [ ] Monsters are placed randomly (not predictable)
- [ ] Excluded position never receives a monster
- [ ] Monster count equals sum of `isMonster` flags

### Adjacent Counts

- [ ] Corner cells count max 3 neighbors
- [ ] Edge cells count max 5 neighbors
- [ ] Center cells count max 8 neighbors
- [ ] Cell with no adjacent monsters has `adjacentMonsters: 0`
- [ ] Cell surrounded by monsters has `adjacentMonsters: 8` (or max possible)

### Cell Reveal

- [ ] Revealing empty cell returns `hitMonster: false`
- [ ] Revealing monster returns `hitMonster: true`
- [ ] Revealed cell has `isRevealed: true`
- [ ] `revealedPositions` contains the revealed cell
- [ ] Already revealed cell returns unchanged grid

### Flood Fill

- [ ] Revealing cell with `adjacentMonsters: 0` triggers flood fill
- [ ] Flood fill reveals all connected empty cells
- [ ] Flood fill stops at numbered cells (but reveals them)
- [ ] Flood fill stops at edge of grid
- [ ] All revealed positions included in result

### First-Click Safety

- [ ] `initializeGrid(config, firstClick)` excludes first click from monsters
- [ ] First click is always safe when using initializeGrid

### Flag Toggle

- [ ] Unflagged cell → flagged after toggle
- [ ] Flagged cell → question after toggle
- [ ] Question cell → unflagged after toggle
- [ ] Revealed cell cannot be flagged (returns unchanged)

### Win Condition

- [ ] Win when all non-monster cells revealed
- [ ] Not a win if any non-monster cell unrevealed
- [ ] Flagging monsters not required for win
- [ ] `getSafeCellCount` returns correct count
- [ ] `getRevealedCount` returns correct count

---

## Code Quality

### Type Safety

- [ ] No `any` types in engine modules
- [ ] All functions have explicit return types
- [ ] All parameters have explicit types

### Documentation

- [ ] All exported functions have JSDoc
- [ ] Module-level documentation present
- [ ] Complex algorithms have inline comments

### Code Standards

- [ ] ESLint passes with no errors
- [ ] Prettier formatting correct
- [ ] No console.log statements

---

## Testing

### Test Execution

- [ ] `npm run test:run` passes
- [ ] All engine tests pass
- [ ] No skipped tests

### Coverage

- [ ] Line coverage >= 95% for engine modules
- [ ] Branch coverage >= 90%
- [ ] All edge cases tested

### Test Quality

- [ ] Tests are deterministic (no random failures)
- [ ] Tests use AAA pattern
- [ ] Tests are isolated (no shared state)

---

## Build Verification

- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds

---

## Integration Readiness

- [ ] All engine functions exported from `src/engine/index.ts`
- [ ] Types exported from `src/engine/types.ts`
- [ ] Import paths use `@/engine` alias
- [ ] No circular dependencies
