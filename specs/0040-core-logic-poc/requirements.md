# Requirements Checklist: Core Logic POC

**Phase**: 0040
**Spec**: spec.md

---

## Functional Requirements

### FR-1: Grid Display
- [x] FR-1.1: Render 8x8 grid using CSS Grid
- [x] FR-1.2: Display unrevealed cells with stone background
- [x] FR-1.3: Display revealed monster cells with red "M"
- [x] FR-1.4: Display revealed numbered cells (1-8) with colored text
- [x] FR-1.5: Display revealed empty cells (0) with light background
- [x] FR-1.6: Display flagged cells with "F" indicator
- [x] FR-1.7: Display question cells with "?" indicator

### FR-2: User Interactions
- [x] FR-2.1: Left-click reveals cells
- [x] FR-2.2: First click initializes grid with safety
- [x] FR-2.3: Flood fill triggers on empty cells
- [x] FR-2.4: Right-click toggles flag state
- [x] FR-2.5: Context menu prevented on right-click
- [x] FR-2.6: Reset button re-initializes game

### FR-3: Game State
- [x] FR-3.1: Display "Playing" during active game
- [x] FR-3.2: Display "You Win!" when all safe cells revealed
- [x] FR-3.3: Display "Game Over!" when monster hit
- [x] FR-3.4: Display progress (revealed / total safe cells)

---

## Non-Functional Requirements

### NFR-1: Code Quality
- [x] No TypeScript errors
- [x] Follows project coding standards
- [x] Uses engine functions correctly

### NFR-2: Simplicity
- [x] Uses only React useState
- [x] No routing added
- [x] Minimal CSS (functional only)

---

## Acceptance Criteria (USER GATE)

These require manual user verification:

- [ ] Grid renders correctly (8x8)
- [ ] Left-click reveals cells
- [ ] Numbers show adjacent monster count (0-8)
- [ ] Empty cells (0) trigger flood fill
- [ ] Right-click toggles flag states
- [ ] Clicking monster shows game over
- [ ] Clearing all safe cells shows "You win!"
- [ ] Reset button starts new game
- [ ] First click is always safe
