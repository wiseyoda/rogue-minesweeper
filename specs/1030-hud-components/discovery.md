# Discovery: HUD Components

**Phase**: 1030
**Created**: 2026-01-15

---

## Codebase Examination

### Existing State Structure

From `src/stores/gameStore.ts` and types, the HUD has access to:

**PlayerState** (from `player.ts`):
- `lives: number` - Current lives (0 = game over)
- `maxLives: number` - Maximum lives
- `shields: number` - Shield count (absorbs damage before lives)
- `gold: number` - Current gold
- `activeBuffs: ActiveBuffs` - Currently active buffs

**ActiveBuffs** interface includes:
- `extraLife`, `goldenGoose`, `goldMagnet`, `steadyHand`
- `forcefield` (number of charges)
- `scrapMetal`, `shieldBattery`

**RunState** (from `game.ts`):
- `level: number` - Current floor number
- `phase: GamePhase` - 'playing' | 'shopping' | 'gameOver' | 'upgradeShop'
- `revealedCount: number` - Cells revealed this floor
- `flagsPlaced: number` - Flags placed

**GridConfig**:
- `monsterCount` - Total monsters on floor (can calculate remaining)

### Existing Component Patterns

From Phase 1020 `src/components/game/`:
- Components use `memo()` for optimization
- Props interfaces named `{Component}Props`
- Barrel exports via `index.ts`
- Tailwind CSS with dungeon theme colors
- Tests use Vitest + Testing Library

### Available Theme Colors

```css
--color-dungeon-stone: #78716c    /* UI backgrounds */
--color-dungeon-amber: #f59e0b    /* Highlights, gold */
--color-dungeon-blood: #b91c1c    /* Danger, HP loss */
--color-dungeon-gold: #eab308     /* Gold, rewards */
--color-dungeon-shadow: #1c1917   /* Dark backgrounds */
--color-dungeon-parchment: #fef3c7 /* Light backgrounds */
```

### Current App.tsx Layout

App.tsx currently shows:
- Title "DUNGEON DELVER"
- Status text (Playing/Game Over/Level Complete)
- Progress counter (revealed / total cells)
- GameBoard component
- New Game button
- Instructions

The HUD components should replace/enhance the status section with proper visual displays.

### Design System Guidelines (from design-system.md)

HUD Elements:
- HP bar: Heart-based or classic bar
- Gold counter: Coin icon + number
- Floor indicator: Dungeon depth display
- Power-up indicators: Icon row

Animation:
- Keep animations snappy (< 200ms)
- Don't block gameplay
- Allow animation canceling

---

## Integration Points

1. **useGameStore hook** - Read player, run, and gridConfig state
2. **App.tsx** - Will integrate HUD between title and GameBoard
3. **Tailwind config** - Already has dungeon theme colors
4. **Component patterns** - Follow game/ components structure

---

## User Decisions

1. **HP Display Style**: **Health Bar** - Horizontal bar that depletes, showing maxLives as full width
2. **Message Area**: **Persistent Banner** - Dedicated message area below stats showing latest message, with queue support
3. **Buff Display**: Icons with charges (for buffs like forcefield that have charges)
4. **Monster Count**: Show remaining monsters (total - flagged correctly)

---

## Dependencies

- React 18 with hooks
- Zustand (useGameStore)
- Tailwind CSS with dungeon theme
- No new packages needed

---

## Notes

- Keep styling simple for Phase 1 (polish in Milestone 6)
- Structure should support future animations (Framer Motion)
- Current run state doesn't have message queue - may need to add in future
