# Tasks: Phase 0020 - Core Types

> **Total Tasks**: 17
> **Phase**: 0020 - core-types

---

## Setup Tasks

- [x] T001 [P0] Remove `.gitkeep` placeholder from `src/types/` directory

---

## Phase A: Foundation Types

- [x] T002 [P0] [FR-1.1] Create `src/types/cell.ts` with `Cell` interface containing isMonster, isRevealed, isFlagged, isQuestion, isExit, adjacentMonsters properties
- [x] T003 [P0] [FR-1.2] Add `CellPosition` interface with row and col properties to `src/types/cell.ts`
- [x] T004 [P0] [FR-1.3] Add JSDoc comments to all types in `src/types/cell.ts`
- [x] T005 [P0] [FR-2.1] Create `src/types/grid.ts` with `Grid` type as `Cell[][]`
- [x] T006 [P0] [FR-2.2] Add `GridConfig` interface with rows, cols, monsterCount to `src/types/grid.ts`
- [x] T007 [P1] [FR-2.3] Add `GridDimensions` interface with rows, cols, totalCells, safeCells to `src/types/grid.ts`

---

## Phase B: Player Types

- [x] T008 [P0] [FR-3.3] Create `src/types/player.ts` with `ActiveBuffs` and `NextLevelBuffs` interfaces
- [x] T009 [P0] [FR-3.1] Add `PlayerState` interface with lives, maxLives, shields, gold, activeBuffs, nextLevelBuffs to `src/types/player.ts`
- [x] T010 [P0] [FR-3.2] Add `PlayerStats` interface with maxLives, startingGold, firstClickSafety to `src/types/player.ts`

---

## Phase C: Entity Types

- [x] T011 [P0] [FR-4.1] Create `src/types/monster.ts` with `MonsterTier` union type (1 | 2 | 3 | 'boss')
- [x] T012 [P0] [FR-4.2] Add `Monster` interface with id, name, tier, damage, goldDrop to `src/types/monster.ts`
- [x] T013 [P1] [FR-4.3] Add Phase 4 placeholder properties (canMove, moveSpeed, movePattern, hp, ability) to Monster interface
- [x] T014 [P0] [FR-5.1, FR-5.2] Create `src/types/item.ts` with `ItemRarity` union and `ShopItem` interface

---

## Phase D: Game Session Types

- [x] T015 [P0] [FR-6.1, FR-6.2, FR-6.3] Create `src/types/shop.ts` with `LeveledUpgrade`, `UnlockableUpgrade`, and `PermanentUpgrade` discriminated union
- [x] T016 [P0] [FR-7.1, FR-7.2, FR-7.3, FR-7.4] Create `src/types/game.ts` with `GamePhase`, `GameStats`, `RunState`, and `GameState` interfaces

---

## Phase E: Integration

- [x] T017 [P0] [FR-8.1, FR-8.2, FR-8.3] Create `src/types/index.ts` with type-only exports from all type files

---

## Dependency Graph

```
T001 (setup)
  └── T002-T004 (cell.ts)
        └── T005-T007 (grid.ts) - depends on Cell
              └── T016 (game.ts) - depends on Grid
  └── T008-T010 (player.ts)
        └── T016 (game.ts) - depends on PlayerState
  └── T011-T013 (monster.ts)
  └── T014 (item.ts)
        └── T015 (shop.ts) - depends on PlayerStats
              └── T016 (game.ts)
  └── T017 (index.ts) - depends on all type files
```

---

## Notes

- All tasks are pure type definitions (no runtime logic)
- Tasks can mostly be parallelized within phases
- T017 must be last (depends on all other files)
