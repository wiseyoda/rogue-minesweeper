# Verification Checklist: Phase 0020 - Core Types

> Run this checklist after implementation to verify phase completion.

---

## Automated Checks

### Build & Compilation
- [ ] `pnpm typecheck` passes with no errors
- [ ] `pnpm build` completes successfully
- [ ] No TypeScript errors in IDE

### Code Quality
- [ ] `pnpm lint` passes with no errors
- [ ] `pnpm format:check` passes

---

## Type File Verification

### Cell Types (`src/types/cell.ts`)
- [ ] `Cell` interface exists with all 6 properties
- [ ] `CellPosition` interface exists with row/col
- [ ] All types have JSDoc comments
- [ ] No `any` types used

### Grid Types (`src/types/grid.ts`)
- [ ] `Grid` type exists as `Cell[][]`
- [ ] `GridConfig` interface exists with 3 properties
- [ ] `GridDimensions` interface exists
- [ ] Imports `Cell` from cell.ts correctly

### Player Types (`src/types/player.ts`)
- [ ] `ActiveBuffs` interface with all buff properties
- [ ] `NextLevelBuffs` interface with all buff properties
- [ ] `PlayerState` interface with lives, shields, gold, buffs
- [ ] `PlayerStats` interface with permanent stats

### Monster Types (`src/types/monster.ts`)
- [ ] `MonsterTier` union type (1 | 2 | 3 | 'boss')
- [ ] `MovePattern` union type for Phase 4
- [ ] `Monster` interface with required and optional properties
- [ ] Optional Phase 4 properties marked with `?`

### Item Types (`src/types/item.ts`)
- [ ] `ItemRarity` union type (4 rarities)
- [ ] `ShopItem` interface with apply function type
- [ ] `ShopItemPool` interface for categorized items

### Shop Types (`src/types/shop.ts`)
- [ ] `BaseUpgrade` interface
- [ ] `LeveledUpgrade` interface with `type: 'leveled'`
- [ ] `UnlockableUpgrade` interface with `type: 'unlockable'`
- [ ] `PermanentUpgrade` discriminated union

### Game Types (`src/types/game.ts`)
- [ ] `GamePhase` union type
- [ ] `GameStats` interface
- [ ] `RunState` interface
- [ ] `GameState` interface composing all state

### Index Export (`src/types/index.ts`)
- [ ] All types exported from index.ts
- [ ] Type-only exports used (`export type`)
- [ ] Imports work: `import type { Cell } from '@/types'`

---

## Documentation Verification

- [ ] All exported interfaces have JSDoc comments
- [ ] All exported type aliases have JSDoc comments
- [ ] Property-level comments where non-obvious

---

## POC Compatibility

- [ ] Cell type matches POC cell structure
- [ ] Buff types cover all POC buff keys
- [ ] PlayerState covers all POC state properties
- [ ] Shop item structure matches POC items

---

## Verification Gate (from Phase Details)

- [ ] All types compile with strict TypeScript
- [ ] Types have JSDoc comments
- [ ] Types model existing POC functionality
- [ ] No `any` types used
- [ ] Unit tests for type guards (if any)

---

## Final Commands

```bash
# Run all verification
pnpm typecheck && pnpm lint && pnpm build

# Check for any type usage
grep -r "any" src/types/ | grep -v ".test." || echo "No 'any' found"

# Verify imports work
echo "import type { Cell, Grid, GameState } from '@/types'" | pnpm exec tsc --noEmit --allowImportingTsExtensions --moduleResolution bundler
```
