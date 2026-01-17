# Phase 3020: Information Runes - Implementation Plan

## Technical Context

### Existing Architecture
- **Rune Framework**: `src/data/runes.ts` (definitions), `src/engine/runes.ts` (effects)
- **Cell System**: `src/types/cell.ts` (Cell interface), `src/components/game/Tile.tsx` (rendering)
- **Game State**: `src/stores/gameStore.ts` (Zustand store with Immer)
- **Trigger System**: `applyOnFloorStartRunes()`, `applyOnRevealRunes()`, `getPassiveRuneModifiers()`

### New Components Needed
1. **Highlight Type System** - Cell property for visual indicators
2. **Prophecy Algorithm** - Safety scoring for tile prediction
3. **Extended Number Display** - Danger Sense UI changes

---

## Implementation Phases

### Phase 1: Cell Highlight Infrastructure

**Files**: `src/types/cell.ts`, `src/components/game/Tile.tsx`

1. Add highlight type to Cell interface:
```typescript
type HighlightType = 'prophecy' | 'omniscience' | null;

interface Cell {
  // existing...
  highlightType?: HighlightType;
}
```

2. Update Tile component:
- Add highlight overlay rendering
- Prophecy: green semi-transparent border/glow
- Omniscience: red tint overlay

### Phase 2: Rune Definitions

**File**: `src/data/runes.ts`

Add three new runes:
- `danger-sense` (common, 30g, passive)
- `prophecy` (rare, 80g, onFloorStart)
- `omniscience` (legendary, 150g, onFloorStart)

### Phase 3: Omniscience Implementation

**File**: `src/engine/runes.ts`

1. In `applyOnFloorStartRunes()`:
   - Check for omniscience rune
   - Iterate grid, set `highlightType: 'omniscience'` on monster cells

2. Clear highlights when cell is revealed/flagged (in gameStore)

### Phase 4: Prophecy Implementation

**Files**: `src/engine/runes.ts`, `src/stores/gameStore.ts`

1. Create `calculateSafestTile(grid, equippedRunes)` function:
   - Find unrevealed, unflagged tiles
   - Score each by safety (lower adjacent monster sum = safer)
   - Return position of safest tile

2. In `applyOnFloorStartRunes()`:
   - Check for prophecy rune
   - Calculate and highlight safest tile

3. In gameStore `revealCell()`:
   - After revealing, recalculate prophecy if equipped
   - Update highlight position

### Phase 5: Danger Sense Implementation

**Files**: `src/engine/runes.ts`, `src/components/game/Tile.tsx`

1. Create `getExtendedDangerCount(grid, row, col)` function:
   - Count monsters within 2 cells (not just adjacent)
   - Return extended count

2. Add `dangerSenseActive` to passive modifiers

3. In Tile component:
   - Check if danger sense active
   - Display extended count with visual indicator

---

## Risk Mitigation

### Performance
- Prophecy recalculation on every reveal could be slow
- Mitigation: Cache calculations, only recalc changed area

### Visual Clarity
- Multiple highlights could be confusing
- Mitigation: Clear hierarchy (omniscience < prophecy priority)

### Balance
- Omniscience is extremely powerful
- Mitigation: High cost (150g), legendary rarity

---

## Testing Strategy

### Unit Tests
- Prophecy safety scoring algorithm
- Extended danger count calculation
- Highlight type assignment

### Integration Tests
- Highlights render correctly in Tile
- Runes trigger at correct times
- Shop displays new runes

### Manual Testing
- Visual clarity of highlights
- Gameplay feel with each rune
- Performance on larger grids

---

## File Changes Summary

| File | Changes |
|------|---------|
| `src/types/cell.ts` | Add HighlightType, update Cell interface |
| `src/types/index.ts` | Export HighlightType |
| `src/data/runes.ts` | Add 3 new rune definitions |
| `src/engine/runes.ts` | Add highlight logic, safety algorithm |
| `src/components/game/Tile.tsx` | Render highlights, extended numbers |
| `src/stores/gameStore.ts` | Wire up highlight updates on reveal |
