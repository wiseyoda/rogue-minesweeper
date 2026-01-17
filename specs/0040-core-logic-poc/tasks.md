# Tasks: Core Logic POC

**Phase**: 0040
**Created**: 2026-01-15

---

## Task List

### 1. Setup POC Structure
- [x] 1.1 Replace App.tsx imports with engine and type imports
- [x] 1.2 Define GameState type and config constants
- [x] 1.3 Add useState hooks for grid, gameState, isFirstClick

### 2. Grid Rendering
- [x] 2.1 Create CSS Grid container with 8 columns
- [x] 2.2 Map grid cells to div elements
- [x] 2.3 Implement getCellDisplay helper function
- [x] 2.4 Implement getCellBackgroundColor helper function
- [x] 2.5 Implement getNumberColor helper function

### 3. Click Handlers
- [x] 3.1 Implement handleLeftClick function
- [x] 3.2 Handle first-click grid initialization
- [x] 3.3 Handle monster hit (game over)
- [x] 3.4 Handle win condition
- [x] 3.5 Implement handleRightClick function for flag toggle
- [x] 3.6 Prevent context menu on right-click

### 4. Game State Display
- [x] 4.1 Add game status header (Playing/Won/Lost)
- [x] 4.2 Add progress counter (revealed/total)
- [x] 4.3 Add reset button
- [x] 4.4 Implement handleReset function

### 5. Styling
- [x] 5.1 Style grid container with gap and border
- [x] 5.2 Style cells with size, border, cursor
- [x] 5.3 Apply conditional cell colors
- [x] 5.4 Style game over and win states

### 6. Verification
- [x] 6.1 Run typecheck
- [x] 6.2 Run lint
- [x] 6.3 Run build
- [x] 6.4 Manual testing in browser (pending USER GATE)

---

## Task Dependencies

```
1.1 → 1.2 → 1.3 → 2.1 → 2.2
                    ↓
              2.3, 2.4, 2.5
                    ↓
              3.1 → 3.2 → 3.3 → 3.4
                    ↓
              3.5 → 3.6
                    ↓
              4.1 → 4.2 → 4.3 → 4.4
                    ↓
              5.1 → 5.2 → 5.3 → 5.4
                    ↓
              6.1 → 6.2 → 6.3 → 6.4
```

---

## Detailed Task Breakdown

### Task 1.1: Replace App.tsx imports

```typescript
import { useState } from 'react';
import type { Grid, CellPosition, GridConfig, Cell } from '@/types';
import { initializeGrid, revealCell, toggleFlag, getSafeCellCount, getRevealedSafeCellCount } from '@/engine';
```

### Task 1.2: Define types and constants

```typescript
type GameState = 'idle' | 'playing' | 'won' | 'lost';

const GRID_CONFIG: GridConfig = {
  rows: 8,
  cols: 8,
  monsterCount: 10,
};
```

### Task 1.3: Add state hooks

```typescript
const [grid, setGrid] = useState<Grid | null>(null);
const [gameState, setGameState] = useState<GameState>('idle');
const [isFirstClick, setIsFirstClick] = useState(true);
```

### Task 2.1: CSS Grid container

```tsx
<div className="grid grid-cols-8 gap-1">
  {/* cells */}
</div>
```

### Task 3.1: Left-click handler

```typescript
function handleLeftClick(row: number, col: number): void {
  if (gameState === 'won' || gameState === 'lost') return;

  const position: CellPosition = { row, col };

  if (isFirstClick) {
    // Initialize grid with first-click safety
    const newGrid = initializeGrid(GRID_CONFIG, position);
    const result = revealCell(newGrid, position);
    setGrid(result.grid);
    setIsFirstClick(false);
    setGameState('playing');
    if (result.isWon) setGameState('won');
    return;
  }

  if (!grid) return;

  const result = revealCell(grid, position);
  setGrid(result.grid);

  if (result.hitMonster) {
    setGameState('lost');
  } else if (result.isWon) {
    setGameState('won');
  }
}
```

### Task 3.5: Right-click handler

```typescript
function handleRightClick(e: React.MouseEvent, row: number, col: number): void {
  e.preventDefault();
  if (gameState === 'won' || gameState === 'lost') return;
  if (!grid) return;

  const position: CellPosition = { row, col };
  const result = toggleFlag(grid, position);
  setGrid(result.grid);
}
```

---

## Estimated Complexity

**Total tasks**: 22
**Estimated lines of code**: ~150
**Single file change**: App.tsx
