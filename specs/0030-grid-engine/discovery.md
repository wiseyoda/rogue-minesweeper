# Discovery: Grid Engine (Phase 0030)

## Phase Context

**Goal**: Implement pure Minesweeper logic as testable functions, independent of UI.

**From ROADMAP**: This is the core game engine that will be used by the React components. It must be pure (no side effects) and thoroughly tested.

---

## Codebase Findings

### Existing Type Definitions

All required types are already defined in `src/types/`:

| Type | File | Description |
|------|------|-------------|
| `Cell` | `cell.ts` | Single cell state (isMonster, isRevealed, isFlagged, adjacentMonsters) |
| `CellPosition` | `cell.ts` | Row/col position |
| `Grid` | `grid.ts` | 2D array of cells (`Cell[][]`) |
| `GridConfig` | `grid.ts` | Rows, cols, monsterCount |
| `GridDimensions` | `grid.ts` | Computed dimensions with totalCells, safeCells |

**Factory functions available**:
- `createEmptyCell()` - Creates unrevealed cell
- `calculateGridDimensions(config)` - Computes derived values
- `calculateLevelGridConfig(level)` - Gets grid config for a level

### Target Location

The `src/engine/` directory is empty and ready for implementation.

### Test Framework

Vitest 4.0.17 with:
- Global test functions (describe, it, expect)
- Testing Library for React components
- jest-dom matchers available
- Test command: `npm run test:run`

### Code Patterns Observed

1. **Pure functions**: All type utilities are pure functions returning new values
2. **Immutable style**: Grid is `Cell[][]` - functions should return new grids
3. **JSDoc comments**: All exports have documentation
4. **Module structure**: Types separate from implementations, barrel exports

---

## API Design (From Phase Definition)

```typescript
// grid.ts
function createGrid(config: GridConfig): Grid;
function placeMonsters(grid: Grid, count: number, exclude?: CellPosition): Grid;
function calculateAdjacentCounts(grid: Grid): Grid;

// reveal.ts
function revealCell(grid: Grid, position: CellPosition): RevealResult;
function floodFill(grid: Grid, position: CellPosition): Grid;

// win-condition.ts
function checkWinCondition(grid: Grid): boolean;
function getSafeCellCount(grid: Grid): number;
```

---

## Implementation Decisions Needed

### 1. RevealResult Return Type

The `revealCell` function needs to return more than just the grid:
- Whether a monster was hit
- List of revealed positions (for animation)
- Whether the game is won

**Options**:
- A) Rich result object with all info
- B) Simple grid return with state checks after

### 2. First-Click Safety Implementation

When `isFirstClick` is true, the first click must always be safe.

**Options**:
- A) Regenerate monster positions excluding clicked cell (simpler)
- B) Swap monster to another cell (faster, consistent RNG)

### 3. Flag Toggle Behavior

Standard Minesweeper has: unrevealed → flagged → question → unrevealed

**Options**:
- A) Three-state toggle (unrevealed ↔ flagged ↔ question)
- B) Two-state toggle (unrevealed ↔ flagged only)

### 4. Grid Coordinate System

Existing types define `grid[row][col]` with:
- row: 0-based, top to bottom
- col: 0-based, left to right

**Confirmed**: This matches standard array indexing. No changes needed.

---

## Constitution Compliance

| Principle | Relevance | Compliance Notes |
|-----------|-----------|------------------|
| VII. Move Fast | High | Pure functions enable fast testing and iteration |
| III. Emergent Complexity | Medium | Engine must support future moving monsters |
| I. Information Is Power | Medium | Adjacent counts are core information mechanic |

No violations identified. Engine is foundational infrastructure.

---

## User Decisions

1. **RevealResult type**: Rich result object with `{ grid, hitMonster, revealedPositions, isWon }`
2. **First-click safety**: Regenerate monsters after first click, excluding clicked cell
3. **Flag toggle**: Three-state cycle (unrevealed → flagged → question → unrevealed)
