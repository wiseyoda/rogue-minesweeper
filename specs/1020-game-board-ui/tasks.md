# Tasks: Game Board UI

**Phase**: 1020
**Created**: 2026-01-15

---

## Task List

### 1. Setup
- [x] T001 Create `src/components/game/` directory
- [x] T002 Create `src/components/game/index.ts` barrel exports (empty initially)

### 2. Icon Components
- [x] T003 Create `src/components/game/NumberDisplay.tsx` with color mapping
- [x] T004 Create `src/components/game/FlagIcon.tsx`
- [x] T005 Create `src/components/game/MonsterIcon.tsx`
- [x] T006 Create `src/components/game/QuestionMark.tsx`

### 3. Tile Component
- [x] T007 Create `src/components/game/Tile.tsx` with TileProps interface
- [x] T008 Implement unrevealed state rendering
- [x] T009 Implement revealed empty state rendering
- [x] T010 Implement revealed number state (use NumberDisplay)
- [x] T011 Implement revealed monster state (use MonsterIcon)
- [x] T012 Implement flagged state (use FlagIcon)
- [x] T013 Implement question state (use QuestionMark)
- [x] T014 Add hover effect for unrevealed tiles
- [x] T015 Add click and right-click handlers
- [x] T016 Wrap Tile with React.memo

### 4. Touch Support
- [x] T017 Create `src/hooks/useLongPress.ts` hook
- [x] T018 Integrate long press with Tile component
- [x] T019 Test touch events don't interfere with click

### 5. GameBoard Component
- [x] T020 Create `src/components/game/GameBoard.tsx`
- [x] T021 Connect to useGameStore for grid and gridConfig
- [x] T022 Implement CSS Grid layout
- [x] T023 Handle null grid (render placeholder tiles)
- [x] T024 Wire revealCell action to tile clicks
- [x] T025 Wire toggleFlag action to right-clicks and long-press
- [x] T026 Prevent context menu on right-click
- [x] T027 Disable interactions when gameOver is true
- [x] T028 Add responsive sizing (min 32px, max 48px tiles)

### 6. Exports
- [x] T029 Update `src/components/game/index.ts` with all exports

### 7. Testing
- [x] T030 Create `src/components/game/__tests__/NumberDisplay.test.tsx`
- [x] T031 Test NumberDisplay renders correct color for 1-8
- [x] T032 Create `src/components/game/__tests__/Tile.test.tsx`
- [x] T033 Test Tile renders correct state for each cell type
- [x] T034 Test Tile click handlers are called
- [x] T035 Create `src/components/game/__tests__/GameBoard.test.tsx`
- [x] T036 Test GameBoard renders grid from store
- [x] T037 Test GameBoard handles null grid

### 8. Integration
- [x] T038 Update App.tsx to use GameBoard component
- [x] T039 Remove POC grid rendering from App.tsx
- [x] T040 Verify game works end-to-end

### 9. Verification
- [x] T041 Run typecheck
- [x] T042 Run lint
- [x] T043 Run tests
- [x] T044 Run build
- [x] T045 Manual test all tile states
- [x] T046 Manual test mobile touch (long press)

---

## Task Dependencies

```
T001 → T002 → T003, T004, T005, T006 (parallel)
                    ↓
            T007 → T008-T016 (sequential)
                    ↓
            T017 → T018 → T019
                    ↓
            T020 → T021-T028 (mostly sequential)
                    ↓
            T029 → T030-T037 (tests can parallelize)
                    ↓
            T038 → T039 → T040
                    ↓
            T041 → T042 → T043 → T044 → T045 → T046
```

---

## Detailed Task Breakdown

### T003: NumberDisplay Component

```typescript
// src/components/game/NumberDisplay.tsx
interface NumberDisplayProps {
  count: number; // 1-8
}

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

export function NumberDisplay({ count }: NumberDisplayProps) {
  return (
    <span className={`font-bold ${NUMBER_COLORS[count] ?? 'text-gray-500'}`}>
      {count}
    </span>
  );
}
```

### T007: Tile Component Structure

```typescript
// src/components/game/Tile.tsx
interface TileProps {
  cell: Cell;
  onClick: () => void;
  onRightClick: () => void;
  onLongPress: () => void;
  disabled: boolean;
}

// Determine what to render based on cell state
function getTileContent(cell: Cell, gameOver: boolean) {
  if (!cell.isRevealed) {
    if (cell.isFlagged) return <FlagIcon />;
    if (cell.isQuestion) return <QuestionMark />;
    // Show monsters on game over
    if (gameOver && cell.isMonster) return <MonsterIcon />;
    return null;
  }

  if (cell.isMonster) return <MonsterIcon />;
  if (cell.adjacentMonsters > 0) {
    return <NumberDisplay count={cell.adjacentMonsters} />;
  }
  return null;
}
```

### T017: useLongPress Hook

```typescript
// src/hooks/useLongPress.ts
export function useLongPress(
  onLongPress: () => void,
  delay: number = 500
) {
  const timerRef = useRef<number | null>(null);
  const isLongPress = useRef(false);

  const start = useCallback(() => {
    isLongPress.current = false;
    timerRef.current = window.setTimeout(() => {
      isLongPress.current = true;
      onLongPress();
    }, delay);
  }, [onLongPress, delay]);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return {
    onTouchStart: start,
    onTouchEnd: cancel,
    onTouchMove: cancel,
    isLongPress,
  };
}
```

### T022: CSS Grid Layout

```typescript
// In GameBoard.tsx
<div
  className="grid gap-1 p-2 bg-dungeon-shadow rounded"
  style={{
    gridTemplateColumns: `repeat(${gridConfig.cols}, minmax(32px, 48px))`,
  }}
>
  {/* Map grid to Tile components */}
</div>
```

---

## Estimated Complexity

**Total tasks**: 46
**Estimated lines of code**: ~500
**New files**: 12 (7 components + 1 hook + index + 3 test files)
