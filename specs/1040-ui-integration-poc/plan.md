# Implementation Plan: UI Integration POC

**Phase**: 1040
**Created**: 2026-01-15
**Status**: Draft

---

## Constitution Compliance Check

| Principle | Compliance | Notes |
|-----------|------------|-------|
| I. Information Is Power | ✅ N/A | UI phase, no game mechanics |
| II. Dungeon Is Alive | ✅ Partial | Messages in modals (taunts come Phase 4) |
| III. Emergent Complexity | ✅ Aligned | Starting simple |
| IV. Resource Tension | ✅ Aligned | Gold rewards create meaning |
| V. Passive Mastery | ✅ N/A | No abilities added |
| VI. Juice Is Holistic | ✅ Important | Modal feel matters |
| VII. Move Fast | ✅ Aligned | Simple POC approach |

**Result**: No violations. Proceed with implementation.

---

## Technical Context

### Existing Patterns

**Component Structure** (from `src/components/hud/`):
```typescript
// Standard pattern
export interface ComponentProps {
  propName: type;
}

export const Component = memo(function Component(props: ComponentProps) {
  // Implementation
});
```

**Store Access** (from `src/components/hud/HUD.tsx`):
```typescript
// Granular selectors for performance
const selectValue = (state: ReturnType<typeof useGameStore.getState>) =>
  state.path.to.value;

// In component
const value = useGameStore(selectValue);
```

**Styling** (from design-system.md):
- Dungeon theme colors: `dungeon-parchment`, `dungeon-stone`, `dungeon-blood`, `dungeon-shadow`
- Font: `font-cinzel` for titles, `font-mono` for numbers
- Transitions: `transition-colors`, `duration-300`

### Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | 18.x | Component framework |
| zustand | 4.x | State management |
| tailwindcss | 3.x | Styling |

No new packages required.

---

## Component Specifications

### WinModal

**File**: `src/components/ui/WinModal.tsx`

```typescript
export interface WinModalProps {
  /** Tiles revealed this level */
  tilesRevealed: number;
  /** Gold collected this level */
  goldCollected: number;
  /** Monsters successfully flagged */
  monstersFlagged: number;
  /** Called when Continue button clicked */
  onContinue: () => void;
}

export const WinModal = memo(function WinModal(props: WinModalProps) {
  // Render modal with backdrop
  // Display stats in dungeon-themed panel
  // Continue button at bottom
});
```

**Styling**:
- Backdrop: `fixed inset-0 bg-dungeon-shadow/80 flex items-center justify-center z-50`
- Panel: `bg-dungeon-parchment p-8 rounded-lg shadow-xl max-w-sm w-full`
- Title: `text-2xl font-cinzel text-dungeon-gold`
- Stats: `font-mono text-dungeon-stone`
- Button: `bg-dungeon-gold text-dungeon-parchment hover:bg-dungeon-gold/80`

### GameOverModal

**File**: `src/components/ui/GameOverModal.tsx`

```typescript
export interface GameOverModalProps {
  /** Final level reached */
  levelReached: number;
  /** Total gold collected in run */
  totalGold: number;
  /** Tiles revealed this level */
  tilesRevealed: number;
  /** Monsters flagged this level */
  monstersFlagged: number;
  /** Total damage taken in run */
  damageTaken: number;
  /** Called when Try Again button clicked */
  onRetry: () => void;
}

export const GameOverModal = memo(function GameOverModal(props: GameOverModalProps) {
  // Similar structure to WinModal
  // Different color scheme (blood/danger colors)
});
```

**Styling**:
- Title: `text-2xl font-cinzel text-dungeon-blood`
- Stats: Same as WinModal
- Button: `bg-dungeon-blood text-dungeon-parchment hover:bg-dungeon-blood/80`

### GameContainer

**File**: `src/components/game/GameContainer.tsx`

```typescript
export interface GameContainerProps {
  /** Current game message to display */
  message: GameMessage | null;
}

export const GameContainer = memo(function GameContainer({
  message
}: GameContainerProps) {
  // Read state from store
  const run = useGameStore(selectRun);
  const gameOver = useGameStore(selectGameOver);
  const player = useGameStore(selectPlayer);
  const gridConfig = useGameStore(selectGridConfig);

  // Get actions
  const startNewRun = useGameStore(selectStartNewRun);
  const startLevel = useGameStore(selectStartLevel);

  // Handlers
  const handleContinue = () => startLevel(run.level + 1);
  const handleRetry = () => { startNewRun(); startLevel(1); };

  // Calculate stats
  const totalSafeCells = gridConfig.rows * gridConfig.cols - gridConfig.monsterCount;

  return (
    <>
      <HUD message={message} />
      <GameBoard />

      {run.phase === 'shopping' && (
        <WinModal
          tilesRevealed={run.revealedCount}
          goldCollected={run.revealedCount} // 1 gold per tile
          monstersFlagged={run.flagsPlaced}
          onContinue={handleContinue}
        />
      )}

      {gameOver && (
        <GameOverModal
          levelReached={run.level}
          totalGold={player.gold}
          tilesRevealed={run.revealedCount}
          monstersFlagged={run.flagsPlaced}
          damageTaken={player.maxLives - player.lives + damageCalculation}
          onRetry={handleRetry}
        />
      )}
    </>
  );
});
```

---

## Store Modifications

### Gold on Reveal

Modify `revealCell` in `gameStore.ts` to add gold:

```typescript
// In revealCell action
set((state) => {
  state.grid = result.grid;
  state.run.revealedCount += result.revealedPositions.length;
  // NEW: Add gold for revealed safe tiles (not monsters)
  state.player.gold += result.revealedPositions.length;
});
```

**Note**: Currently all revealed positions are safe (monster reveals trigger damage, not position tracking). If a monster is hit, `result.revealedPositions` contains only the monster tile, so gold is added before damage. Need to verify this behavior.

**Actually**: Looking at the code, `revealedPositions` includes the monster tile when hit. We should NOT add gold for monster tiles. Two options:

1. **Check monster count**: Subtract 1 if `result.hitMonster`
2. **Filter in engine**: Return only safe tiles in `revealedPositions`

**Decision**: Option 1 is simpler - adjust gold by -1 when hitting monster.

### Damage Tracking

Add `totalDamageTaken` to RunState for game over stats:

```typescript
interface RunState {
  // ...existing
  totalDamageTaken: number;
}
```

Initialize to 0 in `createInitialRunState` and `startLevel`.

Update `takeDamage` to increment `totalDamageTaken`.

---

## Implementation Order

1. **Setup** (T001-T003)
   - Create `src/components/ui/` directory
   - Create barrel export `index.ts`

2. **Store Updates** (T004-T008)
   - Add `totalDamageTaken` to RunState
   - Update `createInitialRunState`
   - Update `startLevel` to reset damage
   - Update `takeDamage` to track damage
   - Update `revealCell` to add gold

3. **Modal Components** (T009-T020)
   - Create WinModal with props interface
   - Implement backdrop overlay
   - Implement stats display
   - Implement Continue button
   - Create GameOverModal with props interface
   - Implement death-themed styling
   - Implement stats display
   - Implement Try Again button

4. **GameContainer** (T021-T026)
   - Create component with store access
   - Integrate HUD and GameBoard
   - Add conditional WinModal rendering
   - Add conditional GameOverModal rendering
   - Wire up handlers

5. **App.tsx Refactor** (T027-T030)
   - Import GameContainer
   - Replace inline HUD/Board with GameContainer
   - Keep title, instructions, New Game button
   - Clean up unused code

6. **Testing** (T031-T040)
   - WinModal unit tests
   - GameOverModal unit tests
   - GameContainer unit tests
   - Integration tests
   - Gold reward tests

7. **Verification** (T041-T047)
   - TypeScript compilation
   - ESLint
   - Build
   - Test run
   - USER GATE manual testing

---

## File Structure After Implementation

```
src/
├── components/
│   ├── game/
│   │   ├── GameBoard.tsx
│   │   ├── GameContainer.tsx  (NEW)
│   │   ├── index.ts           (UPDATE)
│   │   └── ...
│   ├── hud/
│   │   └── ...                (unchanged)
│   └── ui/
│       ├── index.ts           (NEW)
│       ├── WinModal.tsx       (NEW)
│       └── GameOverModal.tsx  (NEW)
├── stores/
│   └── gameStore.ts           (UPDATE)
├── types/
│   └── game.ts                (UPDATE - RunState)
└── App.tsx                    (UPDATE)
```

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Modal z-index conflicts | Low | Low | Use z-50, test with HUD |
| Gold calculation edge cases | Medium | Medium | Unit tests for cascades |
| Store state sync issues | Low | High | Test modal state triggers |

---

## Testing Strategy

### Unit Tests

**WinModal.test.tsx**:
- Renders with correct stats
- Continue button calls onContinue
- Styled correctly

**GameOverModal.test.tsx**:
- Renders with correct stats
- Try Again button calls onRetry
- Shows all stat fields

**GameContainer.test.tsx**:
- Renders HUD and GameBoard
- Shows WinModal when phase is shopping
- Shows GameOverModal when gameOver is true
- Hides modals when not applicable

### Integration Tests

**Gold rewards**:
- Single reveal adds 1 gold
- Cascade reveal adds correct gold
- Monster hit does not add gold for that tile

**State transitions**:
- Clearing all tiles triggers win modal
- Losing all lives triggers game over modal
- Button actions reset/advance state correctly

---

## Accessibility Considerations

1. **Focus management**: When modal opens, focus should move to modal content
2. **Escape handling**: Intentionally disabled (force button click for clear action)
3. **ARIA labels**: Modal should have `role="dialog"` and `aria-modal="true"`
4. **Screen reader**: Stats should be descriptive ("Level reached: 5")

---

## Performance Considerations

1. **Memoization**: All new components use `React.memo`
2. **Granular selectors**: Prevent unnecessary re-renders
3. **Lazy modals**: Modals only render when needed (conditional)
