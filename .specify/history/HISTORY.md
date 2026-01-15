# Dungeon Delver Phase History

> Archived phases that have been completed.

**Last Updated**: 2026-01-15

---

# 2030 - Meta Progression (Completed 2026-01-15)

**Goal**: Implement permanent upgrades that persist across runs using metaGold currency.

**What Was Built**:

- `src/data/permanentUpgrades.ts` - 5 upgrade definitions with cost/effect systems
- `src/components/ui/UpgradeShopModal.tsx` - Upgrade purchase modal
- `src/stores/metaStore.ts` - Upgrade registry with localStorage persistence
- `src/stores/gameStore.ts` - Upgrade application at run start
- `src/types/player.ts` - PlayerStats type with upgrade tracking
- `specs/2030-meta-progression/` - Full specification and tasks

**Upgrades Implemented**:

| Upgrade | Effect | Max Level |
|---------|--------|-----------|
| Vitality | +1 max HP per level | 5 |
| Fortune | +10% gold find per level | 5 |
| Resilience | +1 starting shield per level | 2 |
| First Click Safety | First monster flags instead of damages | 1 |
| Preparation | Random buffs at run start | 3 |

**Deferred Items**:

- BL-001: First Click Safety game logic not implemented (High priority, target Phase 2031)
- BL-002: UpgradeShopModal visual polish (Low priority, target Phase 6010)

**Stats**:

- Tasks: 76/76 complete
- Tests: 349 passing
- PR: #25

---

# 2020 - Floor Shop

**Goal**: Build the between-floor shop for run-lasting power-ups.

## Scope

- Shop UI modal
- Item catalog (HP, shields, buffs)
- Gold spending
- Item purchase flow
- Shop appears after each floor
- Continue button to proceed

## Deliverables

| File                                | Description               |
| ----------------------------------- | ------------------------- |
| `src/components/shop/FloorShop.tsx` | Shop modal                |
| `src/components/shop/ShopItem.tsx`  | Purchasable item          |
| `src/components/shop/ItemGrid.tsx`  | Item layout               |
| `src/data/shopItems.ts`             | Item definitions          |
| `src/stores/gameStore.ts`           | Updated: purchasing logic |

## Verification Gate

- [ ] Shop appears after clearing floor
- [ ] Items display with name, cost, description
- [ ] Can purchase if enough gold
- [ ] Gold deducted on purchase
- [ ] Can't purchase if insufficient gold
- [ ] Purchased items apply effect
- [ ] Continue button advances to next floor

## Estimated Complexity

**Medium** - UI + logic integration.

## Shop Items (MVP)

| Item          | Cost | Effect                |
| ------------- | ---- | --------------------- |
| Heal Potion   | 30g  | +1 HP                 |
| Max HP Up     | 80g  | +1 Max HP             |
| Shield Orb    | 40g  | +1 Shield             |
| Gold Magnet   | 60g  | 2x gold next floor    |
| Reveal Scroll | 50g  | Reveal 5 random tiles |

## Notes

- Port items from existing POC
- Randomize shop selection (3-4 items)
- Add reroll option (10g)

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

| File                                  | Description                 |
| ------------------------------------- | --------------------------- |
| `src/engine/grid.ts`                  | Core grid logic             |
| `src/engine/reveal.ts`                | Reveal and flood-fill logic |
| `src/engine/win-condition.ts`         | Check if floor is cleared   |
| `src/engine/index.ts`                 | Engine exports              |
| `src/engine/__tests__/grid.test.ts`   | Grid creation tests         |
| `src/engine/__tests__/reveal.test.ts` | Reveal logic tests          |

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

---

## Completed Phases

_No phases completed yet._

---

## Archive Process

When a phase is completed:

1. Mark as ✅ in ROADMAP.md
2. Run `speckit phase archive NNNN`
3. Phase details moved here
4. Include completion notes

---

## Archive Format

```markdown
## NNNN - Phase Name (Completed YYYY-MM-DD)

**Original Goal**: ...

**What Was Built**:

- File 1
- File 2

**Deferred Items**:

- Item 1 (moved to backlog)

**Lessons Learned**:

- Lesson 1
```
