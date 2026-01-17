# Specification: Grid Engine

**Phase**: 0030
**Status**: Draft
**Created**: 2026-01-14

---

## Overview

Implement pure Minesweeper logic as testable functions, independent of UI. This is the core game engine that handles grid creation, cell revealing, flood fill, flag toggling, and win condition checking.

---

## Goals

1. **Pure Functions**: All engine functions are pure - no side effects, no mutations
2. **Testable**: Comprehensive test coverage with deterministic behavior
3. **Type Safe**: Full TypeScript types with no `any`
4. **Immutable**: Return new grids rather than mutating existing ones

---

## Functional Requirements

### FR-1: Grid Creation

**FR-1.1**: Create an empty grid of specified dimensions
- Input: `GridConfig` (rows, cols, monsterCount)
- Output: `Grid` (2D array of empty cells)
- All cells start unrevealed with `adjacentMonsters: 0`

**FR-1.2**: Place monsters randomly on grid
- Input: Grid, count, optional excluded position
- Output: New grid with monsters placed
- Excluded position used for first-click safety
- Distribution is uniform random

**FR-1.3**: Calculate adjacent monster counts
- Input: Grid with monsters placed
- Output: Grid with `adjacentMonsters` populated
- Each cell gets count of neighboring monsters (0-8)
- Uses 8-directional adjacency (including diagonals)

### FR-2: Cell Reveal

**FR-2.1**: Reveal a single cell
- Input: Grid, CellPosition
- Output: `RevealResult` containing:
  - `grid`: Updated grid with cell revealed
  - `hitMonster`: Boolean if monster was hit
  - `revealedPositions`: Array of revealed positions
  - `isWon`: Boolean if win condition met

**FR-2.2**: Implement flood fill for empty cells
- When revealing a cell with `adjacentMonsters: 0`
- Automatically reveal all connected empty cells
- Stop at cells with `adjacentMonsters > 0` (but reveal them)
- Return all revealed positions

**FR-2.3**: First-click safety
- First click must never hit a monster
- Place monsters AFTER first click, excluding that position
- Caller tracks `isFirstClick` state

### FR-3: Flag Toggle

**FR-3.1**: Three-state flag cycle
- Unrevealed → Flagged → Question → Unrevealed
- Only works on unrevealed cells
- Revealed cells cannot be flagged

**FR-3.2**: Flag state tracking
- Input: Grid, CellPosition
- Output: New grid with toggled flag state
- Return unchanged grid if cell is revealed

### FR-4: Win Condition

**FR-4.1**: Check win condition
- Win when all non-monster cells are revealed
- Flagging monsters is NOT required
- Return boolean

**FR-4.2**: Count safe cells
- Return count of non-monster cells
- Used for progress tracking

---

## API Design

### Types

```typescript
/** Result of revealing a cell */
interface RevealResult {
  grid: Grid;
  hitMonster: boolean;
  revealedPositions: CellPosition[];
  isWon: boolean;
}

/** Result of toggling a flag */
interface FlagResult {
  grid: Grid;
  newState: 'none' | 'flagged' | 'question';
}
```

### Functions

```typescript
// grid.ts - Grid creation and setup
function createGrid(config: GridConfig): Grid;
function placeMonsters(grid: Grid, count: number, exclude?: CellPosition): Grid;
function calculateAdjacentCounts(grid: Grid): Grid;
function initializeGrid(config: GridConfig, firstClick?: CellPosition): Grid;
function getAdjacentPositions(grid: Grid, position: CellPosition): CellPosition[];

// reveal.ts - Cell revealing logic
function revealCell(grid: Grid, position: CellPosition): RevealResult;
function floodFill(grid: Grid, position: CellPosition): Grid;
function isValidPosition(grid: Grid, position: CellPosition): boolean;

// flag.ts - Flag toggling
function toggleFlag(grid: Grid, position: CellPosition): FlagResult;

// win-condition.ts - Win checking
function checkWinCondition(grid: Grid): boolean;
function getSafeCellCount(grid: Grid): number;
function getRevealedCount(grid: Grid): number;
```

---

## Non-Functional Requirements

### NFR-1: Performance

- Grid creation: < 10ms for 30x30 grid
- Reveal operation: < 5ms including flood fill
- Win check: < 1ms

### NFR-2: Test Coverage

- 100% line coverage for engine modules
- Edge cases covered (corners, edges, full grid)
- Deterministic tests using seeded random

### NFR-3: Code Quality

- All functions documented with JSDoc
- No `any` types
- Follows project coding standards

---

## Constraints

1. **No UI dependencies**: Engine must be independent of React
2. **Pure functions**: No mutations, side effects, or global state
3. **Existing types**: Use types from `@/types`, do not duplicate
4. **Standard patterns**: Follow code patterns from `src/types/` modules

---

## Out of Scope

- Moving monsters (Phase 4)
- Exit cell placement (handled by game state, not engine)
- Rune/ability effects (Phase 2)
- UI rendering or animations
- Random number generator seeding (use Math.random)

---

## Acceptance Criteria

- [ ] `createGrid(rows, cols, monsterCount)` produces valid grid
- [ ] Adjacent counts are accurate for all cells
- [ ] Flood fill reveals all connected empty cells
- [ ] First click never hits a monster
- [ ] Flag toggles through three states correctly
- [ ] Win condition correctly detects when all safe cells revealed
- [ ] All tests pass with `npm run test:run`

---

## Dependencies

### Uses
- `@/types` - Cell, CellPosition, Grid, GridConfig, GridDimensions

### Used By
- Phase 0040: Core Logic POC (integrates engine with React)
- Zustand game store (future)
