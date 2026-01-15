---
phase: '0020'
name: core-types
status: not_started
created: 2026-01-14
---

# 0020 - Core Types

**Goal**: Define all TypeScript types for the game domain, establishing the data model.

## Scope

- Define cell/tile types
- Define grid types
- Define player state types
- Define monster types (static for now)
- Define item/buff types
- Define shop types
- Define game session types
- Add type exports
- Write type documentation comments

## Deliverables

| File                   | Description                                   |
| ---------------------- | --------------------------------------------- |
| `src/types/cell.ts`    | Cell state (revealed, flagged, monster, etc.) |
| `src/types/grid.ts`    | Grid configuration and state                  |
| `src/types/player.ts`  | HP, gold, shields, buffs                      |
| `src/types/monster.ts` | Monster definitions                           |
| `src/types/item.ts`    | Items, buffs, temporary effects               |
| `src/types/shop.ts`    | Shop items and pricing                        |
| `src/types/game.ts`    | Game session, run state                       |
| `src/types/index.ts`   | Central export                                |

## Verification Gate

- [ ] All types compile with strict TypeScript
- [ ] Types have JSDoc comments
- [ ] Types model existing POC functionality
- [ ] No `any` types used
- [ ] Unit tests for type guards (if any)

## Estimated Complexity

**Low** - Pure type definitions, no logic.

## Type Examples

```typescript
// cell.ts
interface Cell {
  isMonster: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  isQuestion: boolean;
  isExit: boolean;
  adjacentMonsters: number;
}

// player.ts
interface PlayerState {
  hp: number;
  maxHp: number;
  shields: number;
  gold: number;
  activeBuffs: Buff[];
}
```

## Notes

- Model current POC features first
- Add placeholder types for future features (runes, DM mood)
- Use discriminated unions where appropriate
