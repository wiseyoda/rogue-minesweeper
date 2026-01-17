# Phase 3020: Information Runes - Discovery

## Codebase Analysis

### Existing Rune System (Phase 3010)

**Location**: `src/data/runes.ts`, `src/engine/runes.ts`

Current information runes:
- **Scout's Eye** - Reveals 2 safe tiles at floor start (stackable)
- **Oracle's Sight** - 10% chance to reveal bonus tile on click (stackable)

Supported triggers: `onFloorStart`, `onReveal`, `onDamage`, `passive`

### Cell Type Analysis

**Location**: `src/types/cell.ts`

Current properties:
- `isMonster`, `isRevealed`, `isFlagged`, `isQuestion`, `isExit`, `adjacentMonsters`

**Missing for Phase 3020:**
- No visual highlight/indicator property for rune effects
- No way to show "predicted safe" or "revealed monster location"

### Tile Rendering

**Location**: `src/components/game/Tile.tsx`

Renders cells based on state. Would need to support:
- Highlight overlays for Prophecy (safest tile)
- Monster location indicator for Omniscience
- Extended number display for Danger Sense

---

## User Decisions

### Q1: Scout's Eye behavior
**Decision**: Keep current (reveal safe tiles)
- Already working and tested
- Revealing safe tiles is strategically useful

### Q2: Monster Lens
**Decision**: Defer to later phase
- Requires monster types (Milestone 5 scope)
- Will be implemented when Moving Monsters are added

### Q3: Visual highlighting system
**Decision**: Minimal - subtle color tints
- Add `highlightType` property to Cell
- CSS-based highlighting (simple implementation)

---

## Revised Scope

### In Scope
1. **Danger Sense** (Common) - Show danger numbers for tiles +1 range away
2. **Prophecy** (Rare) - Highlight safest tile to click
3. **Omniscience** (Legendary) - Show all monster locations with subtle indicator

### Out of Scope (Deferred)
- Monster Lens - Requires monster types (Phase 5010+)
- Scout's Eye changes - Keep existing safe-tile reveal behavior

### Technical Requirements
1. Add `highlightType` property to Cell type
2. Update Tile component to render highlights
3. Add new rune definitions
4. Implement highlight calculation logic
5. Wire up to rune trigger system

---

## Implementation Approach

### Cell Enhancement
```typescript
interface Cell {
  // existing...
  highlightType?: 'prophecy' | 'omniscience' | 'dangerSense' | null;
}
```

### Trigger Points
- **Danger Sense**: `passive` - affects number display calculation
- **Prophecy**: `onFloorStart` + after each reveal - recalculates safest tile
- **Omniscience**: `onFloorStart` - marks all monster cells

### Visual Design
- Prophecy: Soft green glow/border on safest tile
- Omniscience: Subtle red tint on monster cells (not revealed, just highlighted)
- Danger Sense: Extended number visibility (UI logic change)
