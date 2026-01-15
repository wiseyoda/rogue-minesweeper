# Discovery: Game Board UI

**Phase**: 1020
**Created**: 2026-01-15

---

## Codebase Examination

### Existing Implementation (POC in App.tsx)

The current POC has all game logic in `App.tsx` (lines 155-299):
- Grid rendering using CSS Grid with inline styling
- Cell display logic (getCellDisplay, getCellBackground, getCellTextColor)
- Click handlers for reveal and flag toggle
- Number colors (1=blue, 2=green, etc.)
- Game state display (status, progress)

**Key Functions to Extract**:
1. `getCellDisplay(cell, gameState)` - Returns cell text content
2. `getCellBackground(cell, gameState)` - Returns Tailwind background classes
3. `getCellTextColor(cell, gameState)` - Returns Tailwind text color classes
4. `getNumberColor(count)` - Returns color class for 1-8 numbers

### New Zustand Stores (Phase 1010)

`src/stores/gameStore.ts` provides:
- `grid: Grid | null` - The game grid
- `gridConfig: GridConfig` - Dimensions and monster count
- `player: PlayerState` - Lives, gold, shields
- `run: RunState` - Level, phase, flags, revealed count
- `gameOver: boolean`

**Actions**:
- `revealCell(row, col)` - Handles first click initialization
- `toggleFlag(row, col)` - Cycles flag → question → none
- `startLevel(level)` - Initializes grid config
- `startNewRun()` - Resets all state

### Type Definitions

`Cell` interface (`src/types/cell.ts`):
```typescript
interface Cell {
  isMonster: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  isQuestion: boolean;
  isExit: boolean;
  adjacentMonsters: number; // 0-8
}
```

`Grid` type: `Cell[][]` (2D array)

### Styling System

Current theme in `src/index.css`:
- `dungeon-stone`: #78716c (unrevealed tiles)
- `dungeon-amber`: #f59e0b (playing status)
- `dungeon-blood`: #b91c1c (monsters, danger)
- `dungeon-gold`: #eab308 (flags, loot)
- `dungeon-shadow`: #1c1917 (dark elements)
- `dungeon-parchment`: #fef3c7 (revealed safe cells)

Font: `font-cinzel` for titles, `font-merriweather` for body

### Design System Guidelines

From `.specify/memory/design-system.md`:
- **Tile size**: 32x32 pixels base (scalable)
- **Animations**: Quick (100-150ms), snappy
- **Number colors**: Already defined in POC
- **Pixel art**: `image-rendering: pixelated`

---

## Integration Points

### Store Connection

Components will use:
```typescript
const { grid, gridConfig, run, gameOver } = useGameStore();
const { revealCell, toggleFlag } = useGameStore();
```

### Rendering Flow

1. GameBoard reads grid from store
2. If grid is null, show empty placeholder grid using gridConfig
3. Map grid to Tile components
4. Tile components handle click events, call store actions

---

## Technical Decisions Needed

### 1. Component Architecture

**Decision: Granular Components** (User Choice)
- `GameBoard.tsx` - Container with grid loop and click handlers
- `Tile.tsx` - Individual tile with visual states
- `NumberDisplay.tsx` - Colored number display (1-8)
- `FlagIcon.tsx` - Flag marker icon
- `MonsterIcon.tsx` - Monster reveal icon
- More files but easier to add animations in Phase 6010

### 2. State Location

The POC currently tracks `isFirstClick` locally. The store already has `run.isFirstClick`.

**Decision**: Use store state exclusively - no local component state for game logic.

### 3. Styling Approach

**Option A: Tailwind Inline** (Current POC approach)
- Fast iteration
- All styles visible in component

**Option B: game.css with Custom Classes**
- Cleaner JSX
- Easier to override/theme later
- Recommended by phase scope

---

## Constraints from Existing Code

1. **Grid structure**: Must use `grid[row][col]` indexing
2. **Click handling**: Store expects `revealCell(row, col)` and `toggleFlag(row, col)`
3. **First click safety**: Handled by store, component just calls `revealCell`
4. **Number colors**: Must match existing (1=blue, 2=green, 3=red, 4=purple, 5=amber, 6=cyan, 7=gray800, 8=gray600)

---

## Confirmed Understanding

**Goal**: Extract game board UI from App.tsx POC into reusable components that connect to Zustand gameStore.

**Components to Create**:
1. `GameBoard.tsx` - Main container
2. `Tile.tsx` - Individual cell
3. `NumberDisplay.tsx` - Colored number (optional based on decision)
4. `index.ts` - Barrel exports
5. `game.css` - Game-specific styles

**NOT in Scope**:
- HUD components (lives, gold, level) - Phase 1030
- Shop UI - Phase 2020
- Animations - Phase 6010
- Sound effects - Phase 6030

---

## Questions Answered by Codebase

1. **Q: How is grid structured?** A: `Cell[][]`, indexed as `grid[row][col]`
2. **Q: What states does a tile have?** A: unrevealed, revealed, flagged, question, monster, number (0-8)
3. **Q: How are clicks handled?** A: `revealCell(row, col)` for left, `toggleFlag(row, col)` for right
4. **Q: What about first click?** A: Store handles initialization - component just calls `revealCell`
5. **Q: Number colors?** A: Defined in POC, 1-8 each have distinct color
