# Phase 3020: Information Runes - Specification

## Overview

**Phase**: 3020 - information-runes
**Goal**: Implement runes that reveal, predict, and illuminate monster positions and safe paths.
**Theme**: "Information is Power" - core fantasy of the rune system.

---

## Requirements

### R1: Danger Sense Rune
**Priority**: P1
**Category**: Information

A common rune that extends the player's awareness of nearby danger.

**Behavior**:
- Trigger: `passive` (always active when equipped)
- Effect: Revealed tiles show danger numbers for adjacent AND 2-range tiles
- Visual: Numbers display with extended range indicator
- Stackable: No (binary effect - either have extended range or don't)

**Acceptance Criteria**:
- [ ] Danger Sense rune appears in shop rotation
- [ ] When equipped, revealed number tiles show count including 2-range monsters
- [ ] Extended numbers visually distinct (e.g., different color or format)
- [ ] Effect deactivates when rune is replaced

### R2: Prophecy Rune
**Priority**: P1
**Category**: Information

A rare rune that highlights the mathematically safest tile to click next.

**Behavior**:
- Trigger: `onFloorStart` + recalculates after each reveal
- Effect: Marks one unrevealed tile as "prophesied safe"
- Visual: Soft green glow/border on the tile
- Stackable: No (only one "safest" tile at a time)

**Algorithm**:
1. Find all unrevealed, unflagged tiles
2. For each, calculate "safety score" based on:
   - Adjacent revealed numbers (lower sum = safer)
   - Distance from known monsters
   - If tile is provably safe via constraint solving → highest priority
3. Highlight tile with best score

**Acceptance Criteria**:
- [ ] Prophecy rune appears in shop (rare tier)
- [ ] Highlighted tile has visible green indicator
- [ ] Highlight updates after each reveal
- [ ] If multiple tiles equally safe, pick randomly among them
- [ ] Highlight disappears when tile is clicked

### R3: Omniscience Rune
**Priority**: P1
**Category**: Information

A legendary rune that reveals all monster locations (without revealing the tiles).

**Behavior**:
- Trigger: `onFloorStart`
- Effect: All monster cells get a subtle visual indicator
- Visual: Faint red tint/glow (not full reveal, just awareness)
- Stackable: No (all monsters already shown)

**Acceptance Criteria**:
- [ ] Omniscience rune appears in shop (legendary tier, expensive)
- [ ] All monster tiles have visible red indicator at floor start
- [ ] Indicator persists until tile is revealed/flagged
- [ ] Does NOT reveal the tile or count as "revealed"
- [ ] Dramatically changes gameplay feel

### R4: Cell Highlight System
**Priority**: P0 (blocking)
**Category**: Technical

Add visual highlighting capability to cells for rune effects.

**Changes Required**:
1. Add `highlightType` property to `Cell` interface
2. Update `Tile` component to render highlight overlays
3. Add CSS/styles for each highlight type

**Highlight Types**:
- `prophecy`: Green glow for safest tile
- `omniscience`: Red tint for monster locations
- `dangerSense`: (optional) indicator for extended range numbers

**Acceptance Criteria**:
- [ ] Cell type includes optional `highlightType` property
- [ ] Tile renders appropriate visual for each highlight type
- [ ] Highlights don't interfere with existing cell states
- [ ] Performance acceptable (no lag with many highlights)

---

## Non-Goals

- **Monster Lens**: Deferred - requires monster types (Phase 5010+)
- **Scout's Eye changes**: Keep existing safe-tile reveal behavior
- **Elaborate animations**: Simple CSS highlights, no complex animations
- **Sound effects for runes**: Out of scope (Phase 6000+)

---

## Technical Context

### Files to Modify
- `src/types/cell.ts` - Add highlightType
- `src/data/runes.ts` - Add new rune definitions
- `src/engine/runes.ts` - Add highlight calculation logic
- `src/components/game/Tile.tsx` - Render highlights
- `src/stores/gameStore.ts` - Wire up highlight updates

### Dependencies
- Rune framework from Phase 3010
- Existing trigger system (`onFloorStart`, `passive`)
- Grid and cell types

---

## Rune Definitions

| Rune | ID | Rarity | Cost | Category | Trigger |
|------|----|--------|------|----------|---------|
| Danger Sense | `danger-sense` | Common | 30g | information | passive |
| Prophecy | `prophecy` | Rare | 80g | information | onFloorStart + onReveal |
| Omniscience | `omniscience` | Legendary | 150g | information | onFloorStart |

---

## Design Decisions

1. **Highlights are cell properties** (not separate overlay state)
   - Simpler to manage
   - Clears automatically when cell state changes

2. **Prophecy recalculates on every reveal**
   - Keeps the "safest tile" current
   - May have performance implications on large grids (acceptable for current 10x10)

3. **Omniscience shows ALL monsters immediately**
   - Very powerful - hence legendary rarity and high cost
   - Fundamentally changes gameplay (almost "easy mode")
