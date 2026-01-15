# Requirements Checklist: UI Integration POC

**Phase**: 1040
**Created**: 2026-01-15

---

## Functional Requirements

### FR-1: Gold Rewards
- [ ] REQ-001 Each revealed safe tile awards 1 gold
- [ ] REQ-002 Cascading reveal awards gold for all revealed tiles
- [ ] REQ-003 Gold counter in HUD updates immediately
- [ ] REQ-004 Monster tiles do not award gold

### FR-2: Win Modal
- [ ] REQ-005 Modal appears when all safe tiles revealed
- [ ] REQ-006 Title displays "Level Complete!"
- [ ] REQ-007 Shows tiles revealed count
- [ ] REQ-008 Shows gold collected this level
- [ ] REQ-009 Shows monsters flagged count
- [ ] REQ-010 "Continue" button advances to next level
- [ ] REQ-011 Modal uses semi-transparent backdrop
- [ ] REQ-012 Modal styled with dungeon theme
- [ ] REQ-013 Modal is centered on screen

### FR-3: Game Over Modal
- [ ] REQ-014 Modal appears when lives reach 0
- [ ] REQ-015 Title displays "You Died!"
- [ ] REQ-016 Shows level reached
- [ ] REQ-017 Shows total gold collected
- [ ] REQ-018 Shows tiles revealed this level
- [ ] REQ-019 Shows monsters flagged this level
- [ ] REQ-020 Shows damage taken
- [ ] REQ-021 "Try Again" button starts fresh run
- [ ] REQ-022 Modal uses semi-transparent backdrop
- [ ] REQ-023 Modal styled with dungeon theme
- [ ] REQ-024 Modal is centered on screen

### FR-4: GameContainer
- [ ] REQ-025 Composes HUD and GameBoard
- [ ] REQ-026 Conditionally renders WinModal
- [ ] REQ-027 Conditionally renders GameOverModal
- [ ] REQ-028 Reads state from gameStore

### FR-5: Component Reorganization
- [ ] REQ-029 GameContainer extracts game-specific logic from App.tsx
- [ ] REQ-030 App.tsx remains simple entry point
- [ ] REQ-031 All existing functionality preserved

---

## Non-Functional Requirements

### NFR-1: Performance
- [ ] REQ-032 Modals appear within 100ms of trigger
- [ ] REQ-033 Gold counter updates without visible re-renders

### NFR-2: Accessibility
- [ ] REQ-034 Modals trap focus when open
- [ ] REQ-035 Modal content is screen reader accessible
- [ ] REQ-036 Escape key does not dismiss modals (intentional)

### NFR-3: Styling
- [ ] REQ-037 Modals use dungeon theme colors
- [ ] REQ-038 Semi-transparent backdrop (dungeon-shadow/80)
- [ ] REQ-039 Consistent with HUD component styling

---

## Code Quality

- [ ] REQ-040 TypeScript compiles without errors
- [ ] REQ-041 ESLint passes without errors
- [ ] REQ-042 Build succeeds
- [ ] REQ-043 All unit tests pass
- [ ] REQ-044 Components use React.memo where appropriate
- [ ] REQ-045 Props interfaces properly typed

---

## Summary

| Category | Count |
|----------|-------|
| Gold Rewards | 4 |
| Win Modal | 9 |
| Game Over Modal | 11 |
| GameContainer | 4 |
| Reorganization | 3 |
| Performance | 2 |
| Accessibility | 3 |
| Styling | 3 |
| Code Quality | 6 |
| **Total** | **45** |
