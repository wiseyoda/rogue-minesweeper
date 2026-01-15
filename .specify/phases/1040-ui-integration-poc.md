---
phase: '1040'
name: ui-integration-poc
status: not_started
created: 2026-01-14
user_gate: true
---

# 1040 - UI Integration POC

**Goal**: Integrate all UI components into a playable single-floor game.

## Scope

- Main game page combining board + HUD
- New game button
- Game over state handling
- Win state handling
- Floor completion (exit tile appears)

## Deliverables

| File                                    | Description          |
| --------------------------------------- | -------------------- |
| `src/pages/GamePage.tsx`                | Main game page       |
| `src/components/game/GameContainer.tsx` | Game + HUD layout    |
| `src/components/ui/NewGameButton.tsx`   | Reset game           |
| `src/components/ui/GameOverModal.tsx`   | Death screen         |
| `src/components/ui/WinModal.tsx`        | Floor cleared screen |

## Verification Gate - USER GATE

User must manually verify complete game loop:

- [ ] Start new game works
- [ ] Reveal tiles, see numbers
- [ ] Take damage, HP decreases
- [ ] Shields absorb damage first
- [ ] Collect gold from safe tiles
- [ ] Clear all safe tiles to win
- [ ] Exit tile appears on win
- [ ] Game over screen on death
- [ ] Can start new game after death
- [ ] Level counter shows "Level 1"

## Estimated Complexity

**Medium** - Integration of multiple components.

## Notes

**See `.specify/reference/ui-mockup-definitive.html` for definitive visual design.**

- This is the complete single-floor game
- No shops or progression yet (next milestone)
- Focus on tight, responsive gameplay feel
- Must pass before proceeding to Milestone 2
- Layout should match mockup: game board + sidebar (DM, Vitals, Runes)
- Use mockup atmosphere layers (brick, vignette, particles, scanlines)
