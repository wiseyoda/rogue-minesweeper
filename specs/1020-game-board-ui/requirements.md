# Requirements Checklist: Game Board UI

**Phase**: 1020
**Created**: 2026-01-15

---

## Functional Requirements

### FR-1: GameBoard Component
- [ ] REQ-001 GameBoard reads grid from gameStore
- [ ] REQ-002 GameBoard reads gridConfig from gameStore
- [ ] REQ-003 GameBoard renders CSS Grid layout
- [ ] REQ-004 GameBoard handles null grid (placeholder tiles)
- [ ] REQ-005 GameBoard passes click handlers to Tiles
- [ ] REQ-006 Left click calls revealCell(row, col)
- [ ] REQ-007 Right click calls toggleFlag(row, col)
- [ ] REQ-008 Right click prevents context menu

### FR-2: Tile Component
- [ ] REQ-009 Tile displays unrevealed state (stone background)
- [ ] REQ-010 Tile displays revealed empty state (parchment, no content)
- [ ] REQ-011 Tile displays revealed number state (parchment, NumberDisplay)
- [ ] REQ-012 Tile displays revealed monster state (blood, MonsterIcon)
- [ ] REQ-013 Tile displays flagged state (stone, FlagIcon)
- [ ] REQ-014 Tile displays question state (stone, "?")
- [ ] REQ-015 Tile has hover effect on unrevealed
- [ ] REQ-016 Tile disables interaction when gameOver

### FR-3: NumberDisplay Component
- [ ] REQ-017 NumberDisplay shows number 1-8
- [ ] REQ-018 Number 1 is blue
- [ ] REQ-019 Number 2 is green
- [ ] REQ-020 Number 3 is red
- [ ] REQ-021 Number 4 is purple
- [ ] REQ-022 Number 5 is amber
- [ ] REQ-023 Number 6 is cyan
- [ ] REQ-024 Number 7 is dark gray
- [ ] REQ-025 Number 8 is medium gray
- [ ] REQ-026 Numbers are bold and centered

### FR-4: FlagIcon Component
- [ ] REQ-027 FlagIcon displays gold/amber color
- [ ] REQ-028 FlagIcon is centered in tile

### FR-5: MonsterIcon Component
- [ ] REQ-029 MonsterIcon displays white on blood background
- [ ] REQ-030 MonsterIcon is centered in tile

### FR-6: Responsive Grid
- [ ] REQ-031 Tiles are minimum 32px
- [ ] REQ-032 Grid fits within viewport width
- [ ] REQ-033 Touch events work for reveal (tap) and flag (long press)

---

## Non-Functional Requirements

### NFR-1: Performance
- [ ] REQ-034 Tile components use React.memo
- [ ] REQ-035 Grid renders at 60fps (600 tiles)

### NFR-2: Code Quality
- [ ] REQ-036 TypeScript compiles without errors
- [ ] REQ-037 ESLint passes
- [ ] REQ-038 Unit tests exist for key behaviors
- [ ] REQ-039 Build succeeds

---

## Technical Constraints

- [ ] REQ-040 Uses useGameStore hook
- [ ] REQ-041 No local state for game logic
- [ ] REQ-042 Uses existing types from @/types
- [ ] REQ-043 Uses Tailwind CSS
- [ ] REQ-044 Uses dungeon theme colors

---

## Summary

| Category | Count |
|----------|-------|
| Functional | 33 |
| Non-Functional | 6 |
| Technical | 5 |
| **Total** | **44** |
