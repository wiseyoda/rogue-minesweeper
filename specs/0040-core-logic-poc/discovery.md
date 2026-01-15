# Discovery: Core Logic POC (Phase 0040)

## Phase Context

**Goal**: Create a minimal test page demonstrating the grid engine works correctly.

**Gate Type**: USER GATE - User must manually verify the implementation works.

**From ROADMAP**: This is throwaway UI just for validation. No styling polish needed.

---

## Codebase Findings

### Grid Engine (from Phase 0030)

The grid engine is fully implemented in `src/engine/` with:

**Types:**
- `RevealResult` - `{ grid, hitMonster, revealedPositions, isWon }`
- `FlagResult` - `{ grid, newState }`
- `FlagState` - `'none' | 'flagged' | 'question'`

**Functions:**
- `initializeGrid(config, firstClick?)` - Creates complete grid with monsters and counts
- `revealCell(grid, position)` - Reveals a cell, handles flood fill
- `toggleFlag(grid, position)` - Cycles flag state
- `checkWinCondition(grid)` - Returns true if won

### Current App Structure

- `src/App.tsx` - Simple placeholder component
- `src/main.tsx` - React entry point with StrictMode
- No routing configured yet
- Empty `src/components/`, `src/pages/` directories

### Styling

- Tailwind CSS v4 with custom theme
- Dungeon colors: `dungeon-stone`, `dungeon-amber`, `dungeon-blood`, `dungeon-gold`, `dungeon-shadow`, `dungeon-parchment`
- Fonts: `font-cinzel` (headings), `font-merriweather` (body)

### TypeScript Configuration

- Strict mode enabled
- Path alias: `@/*` → `./src/*`
- `noUncheckedIndexedAccess: true` - requires safe array access

---

## Implementation Approach

### Option A: Modify App.tsx Directly (Recommended)

Simplest approach - just replace App.tsx content with the POC.
- Pros: No routing setup needed, fast to implement
- Cons: Replaces current landing page

### Option B: Add Simple Routing

Add react-router-dom for `/poc` route.
- Pros: Keeps landing page, cleaner separation
- Cons: Adds dependency, more setup

### Recommendation

**Option A** - Since this is throwaway UI and the "landing page" is just a placeholder, modifying App.tsx directly is fastest. When we build the real UI, we'll restructure properly.

---

## Technical Approach

### State Management

Use React `useState` for:
- `grid: Grid | null` - Current grid state
- `gameState: 'playing' | 'won' | 'lost'` - Current game status
- `isFirstClick: boolean` - For first-click safety

### Event Handling

- Left-click: Reveal cell (call `revealCell`)
- Right-click: Toggle flag (call `toggleFlag`)
- Reset button: Re-initialize grid

### Grid Rendering

Use CSS Grid layout:
```css
display: grid;
grid-template-columns: repeat(cols, minmax(0, 1fr));
```

### Cell Display Logic

| State | Display |
|-------|---------|
| Unrevealed | Empty, colored background |
| Revealed + Monster | Monster emoji or X |
| Revealed + Count > 0 | Number (colored by value) |
| Revealed + Count = 0 | Empty, different background |
| Flagged | Flag emoji |
| Question | ? symbol |

---

## Default Configuration

For POC validation:
- Grid size: 8x8 (64 cells)
- Monster count: 10 (~15% density)
- First-click safety: enabled

---

## Constitution Compliance

| Principle | Relevance | Notes |
|-----------|-----------|-------|
| VII. Move Fast | High | POC is explicitly "throwaway UI" |
| VI. Juice Is Holistic | Low | Deferred - POC doesn't need polish |
| All others | N/A | POC is pre-gameplay foundation |

No violations. This phase is explicitly validation-focused.

---

## Questions Resolved

Based on phase definition, all key decisions are already made:
- Grid size: 8x8 default
- POC approach: minimal, no polish
- Components: throwaway, will be replaced
