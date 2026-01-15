# Specification: Game Board UI

**Phase**: 1020
**Status**: Draft
**Created**: 2026-01-15

---

## Overview

Build the main game board component with proper React patterns, connecting to the Zustand gameStore for state management. This phase extracts the POC's inline rendering into reusable, granular components that can be enhanced with animations in Phase 6010.

---

## Goals

1. **Reusable Components**: Extract grid rendering from App.tsx into dedicated components
2. **Store Integration**: Connect UI to gameStore for state and actions
3. **Visual Polish**: All tile states render correctly with consistent styling
4. **Responsive Layout**: Grid fits within viewport on all screen sizes
5. **Animation Ready**: Granular component structure supports future animation work

---

## Functional Requirements

### FR-1: GameBoard Component

**FR-1.1**: Container for the game grid
- Reads `grid` and `gridConfig` from gameStore
- Renders CSS Grid layout based on gridConfig dimensions
- Passes click handlers to child Tile components

**FR-1.2**: Empty state handling
- When `grid` is null, render placeholder tiles using gridConfig
- Placeholder tiles are interactive (first click initializes game)

**FR-1.3**: Click coordination
- Left click on tile calls `revealCell(row, col)`
- Right click on tile calls `toggleFlag(row, col)`
- Prevent default context menu on right click

### FR-2: Tile Component

**FR-2.1**: Visual states
- **Unrevealed**: Stone background, clickable
- **Revealed (safe, 0 adjacent)**: Parchment background, empty
- **Revealed (safe, 1-8 adjacent)**: Parchment background, NumberDisplay
- **Revealed (monster)**: Blood background, MonsterIcon
- **Flagged**: Stone background, FlagIcon
- **Question mark**: Stone background, "?" text

**FR-2.2**: Interaction states
- Hover effect on unrevealed tiles
- No hover effect on revealed tiles
- Visual feedback on click (pressed state)

**FR-2.3**: Game over state
- When gameOver is true, reveal all monsters
- Disable click interactions

### FR-3: NumberDisplay Component

**FR-3.1**: Number rendering with colors
- 1: Blue (#2563eb)
- 2: Green (#16a34a)
- 3: Red (#dc2626)
- 4: Purple (#9333ea)
- 5: Amber (#d97706)
- 6: Cyan (#0891b2)
- 7: Gray dark (#1f2937)
- 8: Gray medium (#4b5563)

**FR-3.2**: Typography
- Bold font weight
- Centered in tile
- Legible at all tile sizes

### FR-4: FlagIcon Component

**FR-4.1**: Flag marker display
- Gold/amber color (dungeon-gold)
- Recognizable flag shape or "F" character
- Centered in tile

### FR-5: MonsterIcon Component

**FR-5.1**: Monster display
- White text on blood background
- "M" character or monster emoji
- High contrast for visibility

### FR-6: Responsive Grid

**FR-6.1**: Grid sizing
- Tiles minimum 32px, maximum 48px
- Grid fits within viewport width
- Horizontal scrolling as last resort for very large grids

**FR-6.2**: Mobile support
- Touch events work for reveal (tap) and flag (long press ~500ms)
- Grid scales down on narrow viewports

---

## Non-Functional Requirements

### NFR-1: Performance

**NFR-1.1**: Tile memoization
- Tile components should use React.memo to prevent unnecessary re-renders
- Only re-render when cell state changes

**NFR-1.2**: Render efficiency
- Grid of 20x30 (600 tiles) should render at 60fps
- Click response under 16ms

### NFR-2: Accessibility

**NFR-2.1**: Keyboard navigation (future phase)
- Structure should support future keyboard controls
- Not required for this phase

**NFR-2.2**: Screen reader support (future phase)
- Semantic HTML where possible
- ARIA labels can be added later

---

## Technical Constraints

### TC-1: Store Integration
- Use `useGameStore` hook from `@/stores`
- No local state for game logic (grid, phase, etc.)
- Local state only for UI concerns (hover, animations)

### TC-2: Existing Types
- Use `Cell`, `Grid`, `GridConfig` from `@/types`
- Use `GamePhase` type for phase checks

### TC-3: Styling
- Use Tailwind CSS classes
- Use existing dungeon theme colors from index.css
- Create game.css for game-specific styles only if needed

---

## Component Hierarchy

```
GameBoard (container)
├── Tile[] (grid of tiles)
│   ├── NumberDisplay (if revealed with adjacent > 0)
│   ├── FlagIcon (if flagged)
│   ├── MonsterIcon (if revealed monster)
│   └── (empty) (if unrevealed or revealed empty)
```

---

## File Structure

```
src/components/game/
├── GameBoard.tsx      # Main grid container
├── Tile.tsx           # Individual tile component
├── NumberDisplay.tsx  # Colored number (1-8)
├── FlagIcon.tsx       # Flag marker
├── MonsterIcon.tsx    # Monster reveal
├── QuestionMark.tsx   # Question mark state
├── index.ts           # Barrel exports
└── game.css           # Game-specific styles (optional)
```

---

## Out of Scope

- HUD components (lives, gold, level display) - Phase 1030
- Shop UI components - Phase 2020
- Animations and visual juice - Phase 6010
- Sound effects - Phase 6030
- Keyboard navigation - Phase 8030

---

## Acceptance Criteria

- [ ] GameBoard component renders grid from store
- [ ] Tile component displays all visual states correctly
- [ ] Left click triggers revealCell action
- [ ] Right click triggers toggleFlag action
- [ ] Numbers 1-8 display with correct colors
- [ ] Grid is responsive (fits screen)
- [ ] No visual glitches on rapid clicking
- [ ] TypeScript compiles without errors
- [ ] Unit tests pass for key behaviors
