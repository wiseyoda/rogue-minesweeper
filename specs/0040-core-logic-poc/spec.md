# Specification: Core Logic POC

**Phase**: 0040
**Status**: Draft
**Created**: 2026-01-15

---

## Overview

Create a minimal test page demonstrating the grid engine works correctly. This is a Proof of Concept (POC) to validate that the Phase 0030 grid engine functions properly before building the full game UI.

---

## Goals

1. **Validation**: Prove the grid engine works as expected
2. **User Gate**: Provide a playable interface for manual verification
3. **Throwaway UI**: No styling polish needed - just functional
4. **Minimal Scope**: Only what's needed to validate the engine

---

## Functional Requirements

### FR-1: Grid Display

**FR-1.1**: Render an 8x8 grid of cells
- Each cell displays its appropriate state
- Grid uses CSS Grid for layout
- Cells are clickable

**FR-1.2**: Cell state rendering
| Cell State | Display |
|------------|---------|
| Unrevealed | Stone-colored background |
| Revealed + Monster | Red "M" or monster indicator |
| Revealed + Count > 0 | Number (1-8) with colored text |
| Revealed + Count = 0 | Empty, lighter background |
| Flagged | Flag indicator (F) |
| Question | Question mark (?) |

### FR-2: User Interactions

**FR-2.1**: Left-click reveals cells
- Calls `revealCell()` from engine
- Handles first-click safety (initialize grid on first click)
- Triggers flood fill for empty cells

**FR-2.2**: Right-click toggles flags
- Calls `toggleFlag()` from engine
- Cycles: none → flagged → question → none
- Prevents default context menu

**FR-2.3**: Reset button
- Re-initializes grid with new random monsters
- Resets game state to playing

### FR-3: Game State Display

**FR-3.1**: Game status indicator
- Shows "Playing" during active game
- Shows "You Win!" when all safe cells revealed
- Shows "Game Over - Hit Monster!" when monster revealed

**FR-3.2**: Progress display
- Shows revealed cells / total safe cells
- Updates on each reveal

---

## Technical Approach

### State Management

Use React `useState` for:
- `grid: Grid | null` - Current grid state
- `gameState: 'idle' | 'playing' | 'won' | 'lost'` - Current game status
- `isFirstClick: boolean` - For first-click safety

### Component Structure

```
App.tsx (modified)
└── Grid rendering
    └── Cell components
```

Based on discovery, we will modify `App.tsx` directly rather than creating routing, since:
- The current App.tsx is just a placeholder
- No routing is configured yet
- This is throwaway UI that will be replaced

### Default Configuration

- Grid size: 8x8 (64 cells)
- Monster count: 10 (~15% density)
- First-click safety: enabled

---

## API Usage

Functions from `@/engine`:

```typescript
// Grid initialization (on first click)
initializeGrid(config: GridConfig, firstClick: CellPosition): Grid

// Cell reveal
revealCell(grid: Grid, position: CellPosition): RevealResult
// Returns: { grid, hitMonster, revealedPositions, isWon }

// Flag toggle
toggleFlag(grid: Grid, position: CellPosition): FlagResult
// Returns: { grid, newState }
```

---

## Non-Functional Requirements

### NFR-1: Simplicity

- No external state management (just useState)
- No routing
- Minimal CSS (functional only)
- No animations or transitions

### NFR-2: Accessibility (Minimal)

- Basic keyboard support not required for POC
- Screen reader support not required
- Focus states from Tailwind defaults

### NFR-3: Performance

- No performance requirements for POC
- Standard React rendering is sufficient

---

## Constraints

1. **Throwaway code**: This will be replaced by proper UI in Milestone 1
2. **No styling polish**: Functional appearance only
3. **Engine validation**: Must exercise all engine functions
4. **No new dependencies**: Use only existing packages

---

## Out of Scope

- HP, gold, or any game progression
- Dungeon theme styling
- Sound effects or animations
- Mobile responsiveness
- Accessibility features
- Zustand state management
- Routing
- Multiple difficulty levels

---

## Acceptance Criteria (USER GATE)

User must manually verify:

- [ ] Grid renders correctly (8x8)
- [ ] Left-click reveals cells
- [ ] Numbers show adjacent monster count (0-8)
- [ ] Empty cells (0) trigger flood fill
- [ ] Right-click toggles flag states
- [ ] Clicking monster shows game over
- [ ] Clearing all safe cells shows "You win!"
- [ ] Reset button starts new game
- [ ] First click is always safe

---

## Dependencies

### Uses
- `@/engine` - All engine functions
- `@/types` - Cell, CellPosition, Grid, GridConfig

### Used By
- Phase 1010 (Zustand Stores) - Will replace state management
- Phase 1020 (Game Board UI) - Will replace grid rendering

---

## Constitution Compliance

| Principle | Relevance | Notes |
|-----------|-----------|-------|
| VII. Move Fast | High | POC is explicitly "throwaway UI" |
| VI. Juice Is Holistic | Low | Deferred - POC doesn't need polish |
| All others | N/A | POC is pre-gameplay foundation |

No violations. This phase is explicitly validation-focused.
