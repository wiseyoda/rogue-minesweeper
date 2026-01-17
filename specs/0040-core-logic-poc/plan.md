# Implementation Plan: Core Logic POC

**Phase**: 0040
**Spec**: spec.md
**Created**: 2026-01-15

---

## Technical Context

### Existing Infrastructure

| Component | Location | Status |
|-----------|----------|--------|
| Grid engine | `src/engine/` | Complete |
| Core types | `src/types/` | Complete |
| App entry | `src/App.tsx` | Placeholder (to be replaced) |
| Tailwind CSS | Project root | Configured with dungeon theme |

### Engine API Available

```typescript
// From @/engine
initializeGrid(config: GridConfig, firstClick?: CellPosition): Grid
revealCell(grid: Grid, position: CellPosition): RevealResult
toggleFlag(grid: Grid, position: CellPosition): FlagResult
getSafeCellCount(grid: Grid): number
getRevealedSafeCellCount(grid: Grid): number
```

---

## Constitution Compliance

| Principle | Impact | Compliance Approach |
|-----------|--------|---------------------|
| VII. Move Fast | High | Throwaway POC - minimal code, no polish |

**No violations identified.** This is validation infrastructure.

---

## Architecture Decisions

### AD-1: Inline Everything in App.tsx

**Decision**: All POC code lives in App.tsx - no component extraction.

**Rationale**:
- This is throwaway code
- Simpler to read and validate
- Will be completely replaced in Phase 1020
- Faster to implement

**Trade-offs**:
- Larger single file (acceptable for POC)
- Not a pattern to follow in production

### AD-2: CSS Grid for Layout

**Decision**: Use CSS Grid with Tailwind for grid rendering.

**Rationale**:
- Natural fit for 2D grid
- Tailwind already configured
- No additional dependencies

### AD-3: Text-Based Cell Rendering

**Decision**: Use single characters for cell states (M, F, ?, numbers).

**Rationale**:
- Fastest to implement
- Clear visual distinction
- No need for icons or images
- Will be replaced with proper styling

---

## Implementation Strategy

### Phase 1: Basic Structure

1. Replace App.tsx with POC structure
2. Add state hooks (grid, gameState, isFirstClick)
3. Render empty 8x8 grid shell

### Phase 2: Cell Rendering

1. Map grid cells to visual elements
2. Implement cell state display logic
3. Color numbers by value

### Phase 3: Click Handlers

1. Implement left-click handler (reveal)
2. Implement right-click handler (flag toggle)
3. Handle first-click initialization

### Phase 4: Game State

1. Track and display game status
2. Show progress counter
3. Add reset button

---

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/App.tsx` | Replace | Full POC implementation |

---

## State Design

```typescript
// Game state
type GameState = 'idle' | 'playing' | 'won' | 'lost';

// Component state
const [grid, setGrid] = useState<Grid | null>(null);
const [gameState, setGameState] = useState<GameState>('idle');
const [isFirstClick, setIsFirstClick] = useState(true);
```

### State Transitions

```
idle → (first click) → playing
playing → (hit monster) → lost
playing → (all safe revealed) → won
won/lost → (reset) → idle
```

---

## Cell Display Logic

```typescript
function getCellDisplay(cell: Cell, gameState: GameState): string {
  // Always show monsters when game is over (lost)
  if (gameState === 'lost' && cell.isMonster) return 'M';

  // Unrevealed states
  if (!cell.isRevealed) {
    if (cell.isFlagged) return 'F';
    if (cell.isQuestion) return '?';
    return '';
  }

  // Revealed states
  if (cell.isMonster) return 'M';
  if (cell.adjacentMonsters === 0) return '';
  return cell.adjacentMonsters.toString();
}
```

---

## Color Scheme (Minimal)

Using existing Tailwind dungeon colors:

| Element | Color |
|---------|-------|
| Unrevealed cell | `bg-dungeon-stone` |
| Revealed empty | `bg-dungeon-parchment` |
| Monster | `bg-dungeon-blood text-white` |
| Flag | `text-dungeon-gold` |
| Number 1-2 | `text-blue-600` |
| Number 3-4 | `text-green-600` |
| Number 5-6 | `text-red-600` |
| Number 7-8 | `text-purple-600` |

---

## Dependencies

### Internal
- `@/engine` - All engine functions
- `@/types` - Cell, CellPosition, Grid, GridConfig

### External
- None (using existing packages only)

---

## Testing Strategy

This is a USER GATE phase - manual testing only.

No automated tests required for throwaway POC.

---

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Engine bugs not caught | Low | High | Comprehensive manual testing |
| Right-click issues | Medium | Low | Test in multiple browsers |

---

## Success Metrics

Manual verification by user:
- [ ] Grid displays correctly
- [ ] All click interactions work
- [ ] Game state transitions correct
- [ ] Engine functions exercised
