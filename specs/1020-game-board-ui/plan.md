# Implementation Plan: Game Board UI

**Phase**: 1020
**Created**: 2026-01-15

---

## Technical Context

### Existing Dependencies
- React 18 with hooks
- Zustand 4.x with immer middleware
- Tailwind CSS with custom dungeon theme
- TypeScript 5.x strict mode
- Vitest for testing

### Store Integration
The gameStore (Phase 1010) provides:
- `grid: Grid | null` - Current game grid
- `gridConfig: GridConfig` - Dimensions and monster count
- `run: RunState` - Phase, first click flag, revealed count
- `gameOver: boolean` - Game end state
- Actions: `revealCell(row, col)`, `toggleFlag(row, col)`, `startLevel(level)`

### Existing UI Code
`App.tsx` contains POC implementation with:
- Grid rendering (CSS Grid)
- Cell display logic (helper functions)
- Number color mapping (1-8)
- Click handlers (left/right)

---

## Constitution Compliance

| Principle | Impact | Compliance |
|-----------|--------|------------|
| I. Information Is Power | N/A - UI only | N/A |
| II. The Dungeon Is Alive | N/A - No AI yet | N/A |
| III. Emergent Complexity | N/A - UI only | N/A |
| IV. Resource Tension | N/A - UI only | N/A |
| V. Passive Mastery | N/A - No abilities | N/A |
| VI. Juice Is Holistic | Structure for animations | **ALIGNED** - Granular components support future animation work |
| VII. Move Fast, Iterate Often | Reuse POC patterns | **ALIGNED** - Extract and improve, don't rewrite |

---

## Architecture Design

### Component Hierarchy

```
GameBoard (container)
  └── Tile[] (grid layout)
        ├── NumberDisplay (revealed + adjacent > 0)
        ├── FlagIcon (flagged state)
        ├── MonsterIcon (revealed monster)
        └── QuestionMark (question state)
```

### Data Flow

```
                    ┌─────────────────┐
                    │   useGameStore  │
                    │  (grid, config) │
                    └────────┬────────┘
                             │ subscribe
                             ▼
                    ┌─────────────────┐
                    │    GameBoard    │
                    │  - Read grid    │
                    │  - Pass actions │
                    └────────┬────────┘
                             │ props
                             ▼
            ┌────────────────┼────────────────┐
            │                │                │
            ▼                ▼                ▼
      ┌──────────┐    ┌──────────┐    ┌──────────┐
      │   Tile   │    │   Tile   │    │   Tile   │
      │ - onClick│    │ - onClick│    │ - onClick│
      └────┬─────┘    └──────────┘    └──────────┘
           │
           ▼
  ┌─────────────────┐
  │  NumberDisplay  │
  │  FlagIcon       │
  │  MonsterIcon    │
  └─────────────────┘
```

### File Structure

```
src/components/game/
├── GameBoard.tsx       # Main container (connects to store)
├── Tile.tsx            # Individual tile (memoized)
├── NumberDisplay.tsx   # Colored number 1-8
├── FlagIcon.tsx        # Flag marker
├── MonsterIcon.tsx     # Monster reveal
├── QuestionMark.tsx    # Question mark state
├── index.ts            # Barrel exports
└── __tests__/
    ├── GameBoard.test.tsx
    ├── Tile.test.tsx
    └── NumberDisplay.test.tsx
```

---

## Implementation Strategy

### Phase 1: Base Components (No Store)

Create components with props-only interface:
1. NumberDisplay - Pure component, no dependencies
2. FlagIcon - Pure component
3. MonsterIcon - Pure component
4. QuestionMark - Pure component
5. Tile - Composes child components based on cell state

### Phase 2: GameBoard Container

1. Connect to gameStore
2. Implement grid rendering with CSS Grid
3. Wire up click handlers
4. Handle null grid (placeholder display)

### Phase 3: Touch Support

1. Add long-press detection for flag toggle
2. Test on mobile viewport

### Phase 4: Polish & Testing

1. Add React.memo to Tile
2. Performance testing with large grids
3. Unit tests for components

---

## Component Interfaces

### GameBoard

```typescript
interface GameBoardProps {
  className?: string;
}

// Uses useGameStore internally
// No props for grid/actions - reads from store
```

### Tile

```typescript
interface TileProps {
  cell: Cell;
  onClick: () => void;
  onRightClick: () => void;
  onLongPress: () => void;
  disabled: boolean;
}
```

### NumberDisplay

```typescript
interface NumberDisplayProps {
  count: number; // 1-8
}
```

### FlagIcon, MonsterIcon, QuestionMark

```typescript
// No props - pure presentation
interface IconProps {}
```

---

## Styling Strategy

### Tailwind Classes

Use existing dungeon theme:
- `bg-dungeon-stone` - Unrevealed tiles
- `bg-dungeon-parchment` - Revealed safe tiles
- `bg-dungeon-blood` - Monster tiles
- `text-dungeon-gold` - Flag icon

### Number Colors

Map from POC:
```typescript
const NUMBER_COLORS: Record<number, string> = {
  1: 'text-blue-600',
  2: 'text-green-600',
  3: 'text-red-600',
  4: 'text-purple-600',
  5: 'text-amber-600',
  6: 'text-cyan-600',
  7: 'text-gray-800',
  8: 'text-gray-600',
};
```

### CSS Grid

```typescript
style={{
  gridTemplateColumns: `repeat(${cols}, minmax(32px, 48px))`,
}}
```

---

## Long Press Implementation

Use a custom hook for cross-platform touch support:

```typescript
function useLongPress(
  onLongPress: () => void,
  delay: number = 500
): {
  onTouchStart: () => void;
  onTouchEnd: () => void;
  onTouchMove: () => void;
}
```

Key considerations:
- Cancel on touch move (scrolling)
- Clear timer on touch end (short tap)
- Don't interfere with click handler

---

## Testing Strategy

### Unit Tests

1. **NumberDisplay**: Renders correct color for each number 1-8
2. **Tile**: Renders correct child component for each state
3. **GameBoard**: Renders correct number of tiles based on gridConfig

### Integration Tests

1. Click on tile calls `revealCell`
2. Right-click calls `toggleFlag`
3. Disabled state prevents interactions

### Visual Testing (Manual)

1. All tile states render correctly
2. Grid is responsive
3. Touch events work on mobile

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Performance with 600 tiles | React.memo on Tile, test early |
| Touch/mouse event conflicts | Separate handlers, test both |
| Store updates causing re-renders | Selective subscriptions, memo |

---

## Dependencies on Other Phases

### Requires (Complete)
- Phase 1010: Zustand stores (gameStore)

### Required By
- Phase 1030: HUD components (uses same patterns)
- Phase 1040: UI Integration POC (integrates all UI)

---

## Estimated Complexity

- **New Files**: 9 (6 components + index + 3 tests)
- **Lines of Code**: ~500
- **Risk Level**: Low (extracting existing POC code)
