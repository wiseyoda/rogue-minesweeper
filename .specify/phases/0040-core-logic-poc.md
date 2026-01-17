---
phase: "0040"
name: core-logic-poc
status: not_started
created: 2026-01-14
user_gate: true
---

# 0040 - Core Logic POC

**Goal**: Create a minimal test page demonstrating the grid engine works correctly.

## Scope

- Simple React component rendering grid
- Basic CSS for cells (revealed/hidden/flagged)
- Click handlers connected to engine
- Display adjacent counts
- Monster reveal on hit
- Win detection message

## Deliverables

| File | Description |
|------|-------------|
| `src/pages/PocPage.tsx` | POC test page |
| `src/components/poc/SimpleGrid.tsx` | Minimal grid renderer |
| `src/styles/poc.css` | Basic styling for POC |
| `src/App.tsx` | Route to POC page |

## Verification Gate - USER GATE

User must manually verify:

- [ ] Grid renders correctly (8x8 default)
- [ ] Left-click reveals cells
- [ ] Numbers show adjacent monster count (0-8)
- [ ] Empty cells (0) trigger flood fill
- [ ] Right-click toggles flag
- [ ] Clicking monster shows it was a monster
- [ ] Clearing all safe cells shows "You win!"
- [ ] Grid can be reset

## Estimated Complexity

**Low** - Minimal UI, just proves engine works.

## Notes

- This is throwaway UI - just for validation
- No styling polish needed
- No HP, gold, or progression yet
- Must pass before proceeding to Milestone 1
