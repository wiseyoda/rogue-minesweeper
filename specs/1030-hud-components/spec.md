# Specification: HUD Components

**Phase**: 1030
**Created**: 2026-01-15
**Status**: Draft

---

## Overview

Build the Heads-Up Display (HUD) components that show player stats and game information during gameplay. The HUD provides at-a-glance visibility of player health, resources, level progress, active buffs, and game messages.

### Goals

1. **Player Awareness**: Show health, shields, gold, and level at all times
2. **Feedback System**: Display game messages for events (damage, loot, level complete)
3. **Buff Visibility**: Show active buffs with charge indicators
4. **Dungeon Theme**: Use existing dungeon color palette and styling

### Non-Goals

- Animation/juice effects (deferred to Phase 6xxx polish)
- Sound effects (deferred to Phase 6xxx audio)
- Keyboard shortcuts for HUD interaction
- Tooltip explanations for buffs (future enhancement)

---

## Component Architecture

### File Structure

```
src/components/hud/
├── HUD.tsx              # Main container, composes all HUD elements
├── HealthBar.tsx        # HP display as horizontal bar
├── ShieldDisplay.tsx    # Shield icons/count
├── GoldCounter.tsx      # Gold amount with icon
├── LevelIndicator.tsx   # Current floor number
├── MonsterCounter.tsx   # Remaining monsters count
├── BuffBar.tsx          # Active buff icons with charges
├── MessageArea.tsx      # Persistent message banner
├── index.ts             # Barrel exports
└── __tests__/
    ├── HealthBar.test.tsx
    ├── GoldCounter.test.tsx
    ├── BuffBar.test.tsx
    └── HUD.test.tsx
```

---

## Functional Requirements

### FR-1: HUD Container

**FR-1.1**: HUD component MUST read state from useGameStore
**FR-1.2**: HUD MUST display all child components in a consistent layout
**FR-1.3**: HUD layout MUST be responsive (stack on narrow viewports)

### FR-2: Health Bar

**FR-2.1**: HealthBar MUST display current lives as a filled portion of total maxLives
**FR-2.2**: HealthBar MUST use `dungeon-blood` color for the filled portion
**FR-2.3**: HealthBar MUST show numeric value (e.g., "3/5")
**FR-2.4**: HealthBar MUST update immediately when lives change

### FR-3: Shield Display

**FR-3.1**: ShieldDisplay MUST show current shield count
**FR-3.2**: ShieldDisplay MUST use a shield icon (text placeholder "🛡" for MVP)
**FR-3.3**: ShieldDisplay SHOULD be hidden when shields = 0

### FR-4: Gold Counter

**FR-4.1**: GoldCounter MUST display current gold amount
**FR-4.2**: GoldCounter MUST use `dungeon-gold` color
**FR-4.3**: GoldCounter MUST show gold icon (text placeholder "💰" for MVP)

### FR-5: Level Indicator

**FR-5.1**: LevelIndicator MUST show current level/floor number
**FR-5.2**: LevelIndicator format: "Level X" or "L X"
**FR-5.3**: LevelIndicator MUST use `dungeon-amber` color for emphasis

### FR-6: Monster Counter

**FR-6.1**: MonsterCounter MUST show remaining unflagged monsters
**FR-6.2**: Remaining = gridConfig.monsterCount - (correctly placed flags)
**FR-6.3**: MonsterCounter SHOULD use a monster icon (text "M" for MVP)

### FR-7: Buff Bar

**FR-7.1**: BuffBar MUST display icons for each active buff
**FR-7.2**: Buffs with charges (e.g., forcefield) MUST show charge count
**FR-7.3**: BuffBar SHOULD be hidden when no buffs are active
**FR-7.4**: BuffBar MUST support displaying multiple buffs simultaneously

### FR-8: Message Area

**FR-8.1**: MessageArea MUST display the most recent game message
**FR-8.2**: MessageArea MUST persist until next message arrives
**FR-8.3**: MessageArea SHOULD support message types (info, warning, success)
**FR-8.4**: Initial message SHOULD be empty or show "Click to start"

---

## Non-Functional Requirements

### NFR-1: Performance

**NFR-1.1**: Components MUST use React.memo for optimization
**NFR-1.2**: State selectors MUST be granular to prevent unnecessary re-renders

### NFR-2: Styling

**NFR-2.1**: Use Tailwind CSS with existing dungeon theme colors
**NFR-2.2**: Follow 32px minimum touch target for any interactive elements
**NFR-2.3**: Support dark dungeon background context

### NFR-3: Testing

**NFR-3.1**: Unit tests for each component
**NFR-3.2**: Integration test for HUD reading from store

---

## Data Model

### Store Selectors Used

```typescript
// From gameStore
const player = useGameStore((s) => s.player);      // PlayerState
const run = useGameStore((s) => s.run);            // RunState
const gridConfig = useGameStore((s) => s.gridConfig); // GridConfig

// Derived values
const lives = player.lives;
const maxLives = player.maxLives;
const shields = player.shields;
const gold = player.gold;
const activeBuffs = player.activeBuffs;
const level = run.level;
const flagsPlaced = run.flagsPlaced;
const monstersRemaining = gridConfig.monsterCount - flagsPlaced;
```

### Message Type (New)

```typescript
interface GameMessage {
  text: string;
  type: 'info' | 'warning' | 'success' | 'danger';
  timestamp: number;
}
```

Note: Message queue may be added to uiStore in a future phase. For MVP, HUD can accept message as prop or derive from game state.

---

## UI Layout

```
┌──────────────────────────────────────────────────────────────┐
│  ♥♥♥▒▒ 3/5  │  🛡 2  │  💰 150  │  L 5  │  M: 8 remaining   │
├──────────────────────────────────────────────────────────────┤
│  [Buff1] [Buff2] [Buff3: 2]                                  │
├──────────────────────────────────────────────────────────────┤
│  "Monster hit! 2 lives remaining"                            │
└──────────────────────────────────────────────────────────────┘
```

### Responsive Behavior

- **Wide (>640px)**: Single row for stats, buff bar below
- **Narrow (<640px)**: Stats wrap to 2 rows, buff bar below

---

## Integration

### App.tsx Changes

Replace current inline status display with HUD component:

```tsx
// Before
<div className="mb-4 text-center">
  <p>{getStatusText(...)}</p>
  <p>Progress: {revealed}/{total}</p>
</div>

// After
<HUD />
```

### Store Changes

None required for MVP. Message queue enhancement deferred to future phase.

---

## Out of Scope

- HP bar animation on damage
- Gold counter animation on change
- Buff tooltip on hover
- Message fade-out animation
- Sound effects for HUD updates
- Keyboard navigation for HUD
