# Implementation Plan: Phase 0020 - Core Types

> **Phase**: 0020 - core-types
> **Goal**: Define all TypeScript types for the game domain
> **Complexity**: Low (pure type definitions, no logic)

---

## Technical Context

### Current State
- React + TypeScript project scaffolded (Phase 0010)
- `src/types/` directory exists with `.gitkeep`
- TypeScript strict mode enabled with `noUncheckedIndexedAccess`
- POC code archived in `.archive/poc/` for reference

### Target State
- Complete type system in `src/types/`
- All game concepts typed
- Central export via `index.ts`
- Full JSDoc documentation

---

## Constitution Compliance

| Principle | Compliance | Notes |
|-----------|------------|-------|
| I. Information Is Power | N/A | Types phase, no mechanics |
| II. The Dungeon Is Alive | N/A | AI types deferred to Phase 4 |
| III. Emergent Complexity | Compliant | Types model simple base game |
| IV. Resource Tension | Compliant | HP, gold, shields typed |
| V. Passive Mastery | Compliant | Buff types are passive |
| VI. Juice Is Holistic | N/A | No visual/audio types yet |
| VII. Move Fast | Compliant | Minimal scope, clear deliverables |

---

## Implementation Strategy

### Approach: Bottom-Up Type Building

Build types from atomic → composite:
1. **Primitives**: Basic types like `MonsterTier`, `ItemRarity`
2. **Components**: Cell, Position, Buff types
3. **Aggregates**: Grid, PlayerState, GameState
4. **Exports**: Central index.ts

### File Structure

```
src/types/
├── cell.ts        # Cell, CellPosition
├── grid.ts        # Grid, GridConfig, GridDimensions
├── player.ts      # PlayerState, PlayerStats, Buffs
├── monster.ts     # Monster, MonsterTier
├── item.ts        # ShopItem, ItemRarity, ShopItemPool
├── shop.ts        # PermanentUpgrade types
├── game.ts        # GameState, GamePhase, RunState
└── index.ts       # Central exports
```

---

## Implementation Phases

### Phase A: Foundation Types (Cell, Grid, Position)
1. Create `cell.ts` with Cell and CellPosition
2. Create `grid.ts` with Grid, GridConfig, GridDimensions
3. All types have JSDoc comments

### Phase B: Player Types
1. Create `player.ts` with PlayerState, PlayerStats
2. Define ActiveBuffs and NextLevelBuffs interfaces
3. Document buff effects in comments

### Phase C: Entity Types
1. Create `monster.ts` with Monster, MonsterTier
2. Create `item.ts` with ShopItem, ItemRarity
3. Add Phase 4 placeholders for monster movement

### Phase D: Game Session Types
1. Create `shop.ts` with upgrade discriminated union
2. Create `game.ts` with GameState, GamePhase, RunState
3. Ensure all types compose correctly

### Phase E: Integration
1. Create `index.ts` with all exports
2. Run typecheck to verify
3. Update any `.gitkeep` files to actual content

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Type conflicts with future phases | Use optional properties for future features |
| Strict mode array access issues | Use proper index checks in game logic |
| Circular dependencies | Keep type files independent |

---

## Verification Approach

1. **Compile Check**: `pnpm typecheck` passes
2. **Export Check**: All types importable from `@/types`
3. **Documentation Check**: All exports have JSDoc
4. **No-Any Check**: Grep for `any` type usage

---

## Dependencies

- None (pure type definitions)

## Blockers

- None identified

---

## Estimated Scope

| Metric | Estimate |
|--------|----------|
| Files Created | 8 |
| Lines of Code | ~300 |
| Complexity | Low |
