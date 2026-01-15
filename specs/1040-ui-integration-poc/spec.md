# Specification: UI Integration POC

**Phase**: 1040
**Created**: 2026-01-15
**Status**: Draft

---

## Overview

Integrate all existing UI components (GameBoard, HUD) into a complete single-floor game experience with win/lose states, gold rewards, and proper modal feedback.

This is the **USER GATE** phase that produces the first fully playable game loop.

---

## Goals

1. Create a complete playable game experience
2. Add gold rewards for revealing safe tiles
3. Implement win and game over modal screens
4. Organize components into proper container structure

---

## Non-Goals (Deferred)

- Full loot library system (future phase 2025)
- Exit tile requiring click to advance (Phase 2010)
- Shop integration (Phase 2020)
- Multi-floor progression (Phase 2010)
- Dungeon Master taunts (Phase 4)

---

## Functional Requirements

### FR-1: Gold Rewards

**Description**: Players earn gold for revealing safe tiles.

**Behavior**:
- Each revealed safe tile awards 1 gold
- Gold is added immediately when tiles are revealed
- Cascading reveals (clicking a 0-tile) award gold for all revealed tiles
- Monster tiles do not award gold

**Acceptance Criteria**:
- [ ] Revealing a single safe tile adds 1 gold
- [ ] Cascading reveal of 10 tiles adds 10 gold
- [ ] Gold counter in HUD updates immediately

### FR-2: Win Modal

**Description**: Modal displayed when player clears all safe tiles.

**Trigger**: `run.phase` changes to `'shopping'` (all safe tiles revealed)

**Content**:
- Title: "Level Complete!"
- Stats summary:
  - Tiles revealed (count)
  - Gold collected (this level)
  - Monsters avoided (flagged count)
- Button: "Continue" (starts new level for now, shop integration later)

**Behavior**:
- Modal appears as overlay with semi-transparent backdrop
- Clicking "Continue" calls `startLevel(run.level + 1)` for now
- Escape key or backdrop click does nothing (must click button)

**Acceptance Criteria**:
- [ ] Modal appears when all safe tiles revealed
- [ ] Shows accurate stats from current level
- [ ] "Continue" advances to next level
- [ ] Modal is centered and styled with dungeon theme

### FR-3: Game Over Modal

**Description**: Modal displayed when player dies.

**Trigger**: `gameOver` becomes `true` (lives reach 0)

**Content**:
- Title: "You Died!"
- Stats summary:
  - Level reached
  - Total gold collected (run total)
  - Tiles revealed (this level)
  - Monsters flagged (this level)
  - Damage taken (total)
- Button: "Try Again"

**Behavior**:
- Modal appears as overlay with semi-transparent backdrop
- Clicking "Try Again" calls `startNewRun()` then `startLevel(1)`
- Escape key or backdrop click does nothing (must click button)

**Acceptance Criteria**:
- [ ] Modal appears when lives reach 0
- [ ] Shows accurate run statistics
- [ ] "Try Again" starts fresh run
- [ ] Modal is centered and styled with dungeon theme

### FR-4: GameContainer Component

**Description**: Container that wraps GameBoard and manages game flow.

**Responsibilities**:
- Render HUD above GameBoard
- Render modals when appropriate
- Handle New Game button
- Display instructions

**Props**: None (reads from store)

**Acceptance Criteria**:
- [ ] Composes HUD and GameBoard
- [ ] Conditionally renders WinModal when `phase === 'shopping'`
- [ ] Conditionally renders GameOverModal when `gameOver === true`

### FR-5: Component Reorganization

**Description**: Refactor App.tsx to use new component structure.

**Current Structure**:
```
App.tsx
├── HUD
├── GameBoard
├── New Game button
└── Instructions
```

**Target Structure**:
```
App.tsx
├── Header (title)
├── GameContainer
│   ├── HUD
│   ├── GameBoard
│   ├── WinModal (conditional)
│   └── GameOverModal (conditional)
├── New Game button
└── Instructions
```

**Acceptance Criteria**:
- [ ] GameContainer component extracts game-specific logic
- [ ] App.tsx becomes simpler entry point
- [ ] All existing functionality preserved

---

## Non-Functional Requirements

### NFR-1: Performance

- Modals must appear within 100ms of trigger
- Gold counter updates must not cause visible re-renders

### NFR-2: Accessibility

- Modals trap focus when open
- Modal content is readable by screen readers
- Escape key does not dismiss modals (intentional - force button use)

### NFR-3: Styling

- Modals use dungeon theme colors (dungeon-parchment, dungeon-stone, dungeon-blood)
- Semi-transparent backdrop (bg-dungeon-shadow/80)
- Consistent with HUD component styling

---

## Data Model Changes

### Store Updates

Add `goldEarnedThisLevel` to RunState or calculate from reveals.

Option A (track separately):
```typescript
interface RunState {
  // ... existing
  goldEarnedThisLevel: number;
}
```

Option B (calculate):
```typescript
// Gold earned = revealedCount (for non-monster tiles)
// This works since all safe reveals give 1 gold
```

**Decision**: Use Option B for simplicity - gold earned equals tiles revealed.

### New Types

```typescript
interface ModalProps {
  onAction: () => void;
}

interface WinModalProps extends ModalProps {
  tilesRevealed: number;
  goldCollected: number;
  monstersFlagged: number;
}

interface GameOverModalProps extends ModalProps {
  levelReached: number;
  totalGold: number;
  tilesRevealed: number;
  monstersFlagged: number;
  damageTaken: number;
}
```

---

## Component Architecture

```
src/components/
├── game/
│   ├── GameBoard.tsx      (existing)
│   ├── GameContainer.tsx  (NEW)
│   ├── Tile.tsx          (existing)
│   └── ...
├── hud/
│   ├── HUD.tsx           (existing)
│   └── ...
└── ui/
    ├── index.ts          (NEW)
    ├── WinModal.tsx      (NEW)
    └── GameOverModal.tsx (NEW)
```

---

## UI Layout

### Modal Layout

```
┌─────────────────────────────────────┐
│          (backdrop overlay)         │
│   ┌───────────────────────────┐     │
│   │      LEVEL COMPLETE!      │     │
│   │                           │     │
│   │   Tiles Revealed: 72     │     │
│   │   Gold Collected: 72     │     │
│   │   Monsters Avoided: 8    │     │
│   │                           │     │
│   │      [ Continue ]         │     │
│   └───────────────────────────┘     │
│                                     │
└─────────────────────────────────────┘
```

---

## Testing Strategy

### Unit Tests
- WinModal renders with correct stats
- GameOverModal renders with correct stats
- GameContainer renders all children

### Integration Tests
- Gold increases when revealing tiles
- WinModal appears when all safe tiles revealed
- GameOverModal appears when lives reach 0
- Button actions trigger correct store methods

---

## Verification Gate (USER GATE)

Manual verification required:

- [ ] Start new game works
- [ ] Reveal tiles, see numbers
- [ ] Take damage, HP decreases
- [ ] Shields absorb damage first
- [ ] Collect gold from safe tiles
- [ ] Clear all safe tiles to win
- [ ] Win modal shows correct stats
- [ ] Game over screen on death
- [ ] Game over modal shows correct stats
- [ ] Can start new game after death
- [ ] Level counter shows "Level 1"

---

## Dependencies

| Dependency | Phase | Status |
|------------|-------|--------|
| Zustand stores | 1010 | ✅ Complete |
| GameBoard UI | 1020 | ✅ Complete |
| HUD components | 1030 | ✅ Complete |

---

## Open Questions

None - all questions resolved in DISCOVER phase.

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-15 | Initial specification |
