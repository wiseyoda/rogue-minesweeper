# Implementation Plan: HUD Components

**Phase**: 1030
**Created**: 2026-01-15
**Status**: Draft

---

## Technical Context

### Existing Architecture

- **State Management**: Zustand gameStore with PlayerState, RunState, GridConfig
- **Component Patterns**: React 18 + memo + TypeScript interfaces
- **Styling**: Tailwind CSS with dungeon theme colors
- **Testing**: Vitest + Testing Library

### Integration Points

1. **useGameStore** - Read player, run, gridConfig state
2. **App.tsx** - Replace inline status with HUD component
3. **Tailwind config** - Use existing dungeon-* colors

---

## Constitution Compliance Check

| Principle | Alignment | Notes |
|-----------|-----------|-------|
| I. Information Is Power | **ALIGNED** | HUD displays information critical for decision-making |
| II. The Dungeon Is Alive | **N/A** | No AI DM interaction in this phase |
| III. Emergent Complexity | **ALIGNED** | Simple display, complexity via buffs shown |
| IV. Resource Tension | **ALIGNED** | HUD makes resource scarcity visible |
| V. Passive Mastery | **N/A** | No ability buttons, just display |
| VI. Juice Is Holistic | **DEFERRED** | Animations deferred to Phase 6xxx |
| VII. Move Fast | **ALIGNED** | MVP with text placeholders for icons |

**Verdict**: ✅ No constitution violations

---

## Component Architecture

### Component Hierarchy

```
HUD (container)
├── StatsRow (grid layout)
│   ├── HealthBar
│   ├── ShieldDisplay
│   ├── GoldCounter
│   ├── LevelIndicator
│   └── MonsterCounter
├── BuffBar
└── MessageArea
```

### Data Flow

```
gameStore ─┬─> HUD ─┬─> HealthBar (player.lives, player.maxLives)
           │        ├─> ShieldDisplay (player.shields)
           │        ├─> GoldCounter (player.gold)
           │        ├─> LevelIndicator (run.level)
           │        ├─> MonsterCounter (gridConfig.monsterCount, run.flagsPlaced)
           │        ├─> BuffBar (player.activeBuffs)
           │        └─> MessageArea (derived from state or prop)
```

---

## Component Specifications

### HUD.tsx

**Purpose**: Container component that reads state and composes all HUD elements.

```typescript
interface HUDProps {
  className?: string;
  message?: GameMessage | null;  // Optional external message
}
```

**Implementation**:
- Read state with granular selectors
- Derive message from game state if not provided
- Responsive layout: flex-wrap for narrow viewports

### HealthBar.tsx

**Purpose**: Display lives as horizontal progress bar.

```typescript
interface HealthBarProps {
  current: number;
  max: number;
}
```

**Implementation**:
- Bar width = (current / max) * 100%
- Filled portion: bg-dungeon-blood
- Empty portion: bg-dungeon-shadow/30
- Numeric display: "current/max"

### ShieldDisplay.tsx

**Purpose**: Display shield count with icon.

```typescript
interface ShieldDisplayProps {
  count: number;
}
```

**Implementation**:
- Hidden when count = 0
- Icon: text "🛡" (MVP placeholder)
- Show count next to icon

### GoldCounter.tsx

**Purpose**: Display gold amount with icon.

```typescript
interface GoldCounterProps {
  amount: number;
}
```

**Implementation**:
- Icon: text "💰" (MVP placeholder)
- Color: text-dungeon-gold
- Format: number with no leading zeros

### LevelIndicator.tsx

**Purpose**: Display current floor/level.

```typescript
interface LevelIndicatorProps {
  level: number;
}
```

**Implementation**:
- Format: "L {level}"
- Color: text-dungeon-amber

### MonsterCounter.tsx

**Purpose**: Display remaining monsters to find.

```typescript
interface MonsterCounterProps {
  total: number;
  flagged: number;
}
```

**Implementation**:
- Icon: text "M" (MVP placeholder)
- Display: remaining = total - flagged
- Note: "flagged" may not equal correctly flagged monsters; this is intentional (player uncertainty)

### BuffBar.tsx

**Purpose**: Display active buffs with optional charge counts.

```typescript
interface BuffBarProps {
  buffs: ActiveBuffs;
}

interface BuffIconProps {
  name: string;
  icon: string;
  charges?: number;
}
```

**Implementation**:
- Map ActiveBuffs to display icons
- Buffs with number values (forcefield) show charge count
- Hidden when no buffs active

### MessageArea.tsx

**Purpose**: Display game messages/feedback.

```typescript
interface MessageAreaProps {
  message?: GameMessage | null;
}

interface GameMessage {
  text: string;
  type: 'info' | 'warning' | 'success' | 'danger';
}
```

**Implementation**:
- Type-based styling (success=green, danger=red, etc.)
- Empty state: subtle "Click any cell to begin" or blank
- Future: Can be connected to message queue

---

## Styling Strategy

### Layout (Tailwind)

```css
/* HUD container */
.hud {
  @apply flex flex-col gap-2 w-full max-w-2xl mx-auto p-2;
  @apply bg-dungeon-shadow/80 rounded border border-dungeon-stone/30;
}

/* Stats row */
.stats-row {
  @apply flex flex-wrap items-center gap-4 justify-center;
}

/* Individual stat */
.stat-item {
  @apply flex items-center gap-1 text-sm font-mono;
}
```

### Color Usage

| Element | Color | Variable |
|---------|-------|----------|
| HP bar fill | Red | dungeon-blood |
| HP bar empty | Dark | dungeon-shadow |
| Shields | Gray/blue | dungeon-stone |
| Gold | Yellow | dungeon-gold |
| Level | Amber | dungeon-amber |
| Monster count | Stone | dungeon-stone |
| Message (danger) | Red | dungeon-blood |
| Message (success) | Green | green-600 |

---

## Testing Strategy

### Unit Tests

1. **HealthBar.test.tsx**
   - Renders correct percentage width
   - Shows correct numeric display
   - Updates on prop change

2. **GoldCounter.test.tsx**
   - Renders gold amount
   - Uses correct color class

3. **BuffBar.test.tsx**
   - Shows nothing when no buffs
   - Renders buff icons
   - Shows charge count for numbered buffs

4. **HUD.test.tsx**
   - Renders all child components
   - Reads from store correctly

### Integration Test

- HUD responds to store state changes
- Message updates when game events occur

---

## Implementation Order

1. **Setup** (T001-T003)
   - Create directory structure
   - Create barrel exports
   - Create test setup

2. **Simple Components** (T004-T010)
   - GoldCounter (simplest)
   - LevelIndicator
   - ShieldDisplay
   - MonsterCounter

3. **Complex Components** (T011-T016)
   - HealthBar (bar logic)
   - BuffBar (mapping logic)
   - MessageArea (type styling)

4. **Container** (T017-T020)
   - HUD container
   - Integration with store
   - App.tsx integration

5. **Testing** (T021-T025)
   - Unit tests
   - Integration tests

6. **Verification** (T026-T030)
   - TypeScript check
   - Lint
   - Build
   - Manual verification

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Message system complexity | Low | Low | MVP uses prop/derived state |
| Buff icon mapping | Low | Low | Simple key-to-icon map |
| Responsive layout issues | Medium | Low | Use flex-wrap, test viewports |
| Store selector performance | Low | Medium | Granular selectors from start |

---

## Dependencies

### External (None)
- Uses existing React, Zustand, Tailwind

### Internal
- gameStore types (PlayerState, RunState, GridConfig)
- Tailwind dungeon theme colors

---

## Out of Scope

Explicitly deferred to future phases:
- Animation on value changes (Phase 6xxx)
- Sound effects (Phase 6xxx)
- Tooltip for buff explanations
- Message queue in store
- Keyboard shortcuts
