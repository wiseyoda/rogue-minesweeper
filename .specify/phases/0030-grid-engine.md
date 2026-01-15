---
phase: "0030"
name: grid-engine
status: not_started
created: 2026-01-14
---

# 0030 - Grid Engine

**Goal**: Implement pure Minesweeper logic as testable functions, independent of UI.

## Scope

- Grid creation (randomized monster placement)
- Adjacent monster counting
- Cell reveal logic
- Flood fill for empty cells
- Flag toggling
- Win condition checking
- First-click safety (ensure first click is safe)
- Grid scaling based on level

## Deliverables

| File | Description |
|------|-------------|
| `src/engine/grid.ts` | Core grid logic |
| `src/engine/reveal.ts` | Reveal and flood-fill logic |
| `src/engine/win-condition.ts` | Check if floor is cleared |
| `src/engine/index.ts` | Engine exports |
| `src/engine/__tests__/grid.test.ts` | Grid creation tests |
| `src/engine/__tests__/reveal.test.ts` | Reveal logic tests |

## Verification Gate

- [ ] `createGrid(rows, cols, monsterCount)` produces valid grid
- [ ] Adjacent counts are accurate
- [ ] Flood fill reveals all connected empty cells
- [ ] First click never hits a monster
- [ ] All tests pass

## Estimated Complexity

**Medium** - Core game logic requires careful implementation.

## API Design

```typescript
// grid.ts
function createGrid(config: GridConfig): Grid;
function placeMonsters(grid: Grid, count: number, exclude?: Position): Grid;
function calculateAdjacentCounts(grid: Grid): Grid;

// reveal.ts
function revealCell(grid: Grid, position: Position): RevealResult;
function floodFill(grid: Grid, position: Position): Grid;

// win-condition.ts
function checkWinCondition(grid: Grid): boolean;
function getSafeCellCount(grid: Grid): number;
```

## Notes

- All functions should be pure (no side effects)
- Grid is immutable - return new grid on changes
- This is the heart of the game - test thoroughly
