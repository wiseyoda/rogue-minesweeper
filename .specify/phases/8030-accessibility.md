---
phase: '8030'
name: accessibility
status: not_started
created: 2026-01-14
---

# 8030 - Accessibility

**Goal**: Make the game accessible to all players.

## Scope

- Keyboard navigation
- Screen reader support
- Color contrast
- Reduced motion
- Focus indicators

## Deliverables

| File                            | Description       |
| ------------------------------- | ----------------- |
| Updated components              | A11y attributes   |
| `src/hooks/useReducedMotion.ts` | Motion preference |
| Accessibility audit             |                   |

## Verification Gate

- [ ] Full keyboard navigation
- [ ] Screen reader announces tiles
- [ ] Colors pass contrast check
- [ ] Reduced motion respected
- [ ] Focus visible at all times

## Estimated Complexity

**Medium** - Retrofitting accessibility.

## A11y Features

| Feature       | Implementation                |
| ------------- | ----------------------------- |
| Keyboard      | Arrow keys + Enter/Space      |
| Screen Reader | ARIA labels on tiles          |
| Color         | Symbols in addition to colors |
| Motion        | prefers-reduced-motion        |
| Focus         | Visible focus ring            |

## Notes

- Test with actual screen reader
- Consider color-blind modes
- Document keyboard shortcuts
