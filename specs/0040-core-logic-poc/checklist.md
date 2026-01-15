# Verification Checklist: Core Logic POC

**Phase**: 0040
**Created**: 2026-01-15

---

## Pre-Implementation Checklist

- [x] Spec document complete
- [x] Requirements document complete
- [x] Plan document complete
- [x] Tasks document complete
- [x] Analysis passed (no conflicts)

---

## Implementation Checklist

### Code Quality
- [x] TypeScript compiles without errors (`pnpm typecheck`)
- [x] ESLint passes (`pnpm lint`)
- [x] Build succeeds (`pnpm build`)
- [x] All tests pass (`pnpm test:run`) - 87 tests

### File Changes
- [x] `src/App.tsx` replaced with POC implementation
- [x] `src/App.test.tsx` updated for POC tests

---

## Functional Checklist

### Grid Display
- [ ] 8x8 grid renders on page load
- [ ] Cells show as unrevealed initially (stone color)
- [ ] Grid is centered on page

### Cell States
- [ ] Revealed empty cell shows lighter background
- [ ] Revealed numbered cell shows 1-8 with colored text
- [ ] Monster cell shows "M" with red background
- [ ] Flagged cell shows "F"
- [ ] Question cell shows "?"

### Interactions
- [ ] Left-click on unrevealed cell reveals it
- [ ] First click initializes grid (never hits monster)
- [ ] Clicking cell with 0 triggers flood fill
- [ ] Right-click cycles flag state
- [ ] Right-click prevents context menu
- [ ] Clicking revealed cell does nothing
- [ ] Clicking flagged cell does nothing (left-click)

### Game State
- [ ] Shows "Click to start" before first click
- [ ] Shows "Playing" during game
- [ ] Shows "You Win!" when all safe cells revealed
- [ ] Shows "Game Over!" when monster hit
- [ ] Shows revealed/total counter
- [ ] Reset button visible
- [ ] Reset starts new game

---

## USER GATE Verification

**These items require manual user verification:**

- [ ] Grid renders correctly (8x8)
- [ ] Left-click reveals cells
- [ ] Numbers show adjacent monster count (0-8)
- [ ] Empty cells (0) trigger flood fill
- [ ] Right-click toggles flag states (→ F → ? → none)
- [ ] Clicking monster shows game over
- [ ] Clearing all safe cells shows "You win!"
- [ ] Reset button starts new game
- [ ] First click is always safe

---

## Post-Implementation Checklist

- [ ] All tasks marked complete in tasks.md
- [ ] Requirements checklist updated
- [ ] Branch ready for merge
- [ ] User has verified all USER GATE items
