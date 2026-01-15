---
phase: '1020'
name: game-board-ui
status: not_started
created: 2026-01-14
---

# 1020 - Game Board UI

**Goal**: Build the main game board component with proper React patterns.

## Scope

- GameBoard container component
- Tile component with all states
- Click handlers connected to store
- Responsive grid layout
- Basic Tailwind styling
- Visual states (hidden, revealed, flagged, monster, number)

## Deliverables

| File                                    | Description               |
| --------------------------------------- | ------------------------- |
| `src/components/game/GameBoard.tsx`     | Main board container      |
| `src/components/game/Tile.tsx`          | Individual tile component |
| `src/components/game/NumberDisplay.tsx` | Colored number (1-8)      |
| `src/components/game/index.ts`          | Game component exports    |
| `src/styles/game.css`                   | Game-specific styles      |

## Verification Gate

- [ ] Grid renders from store state
- [ ] Tiles display all visual states
- [ ] Left click triggers reveal
- [ ] Right click triggers flag toggle
- [ ] Numbers are color-coded (1=blue, 2=green, etc.)
- [ ] Grid is responsive (fits screen)
- [ ] No visual glitches on rapid clicking

## Estimated Complexity

**Medium** - Core UI component, needs polish.

## Component API

```tsx
// GameBoard.tsx
interface GameBoardProps {
  onTileClick: (row: number, col: number) => void;
  onTileRightClick: (row: number, col: number) => void;
}

// Tile.tsx
interface TileProps {
  cell: Cell;
  onClick: () => void;
  onRightClick: () => void;
}
```

## Notes

**See `.specify/reference/ui-mockup-definitive.html` for definitive visual design.**

- Use CSS Grid for layout
- Consider memo for Tile to prevent unnecessary re-renders
- **40px tiles** with 2px gap (from mockup)
- **No rounded corners** on tiles
- Use mockup colors and number color scale (1-8)
- **3D beveled appearance** with top-left light source
