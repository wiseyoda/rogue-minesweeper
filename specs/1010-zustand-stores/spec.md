# Specification: Zustand Stores

**Phase**: 1010
**Status**: Draft
**Created**: 2026-01-15

---

## Overview

Set up Zustand state management for Dungeon Delver with three stores:
- **gameStore**: Current run state (grid, player, run progress)
- **metaStore**: Permanent progression (stats, upgrades) with LocalStorage persistence
- **uiStore**: UI state (modals, settings)

This replaces the POC's useState-based approach with proper state management.

---

## Goals

1. **Unified Game State**: Single gameStore for all run state
2. **Persistence**: metaStore persists across browser sessions
3. **Type Safety**: Full TypeScript types using existing type definitions
4. **Clean Actions**: Immer middleware for immutable state updates
5. **Debuggable**: Devtools middleware for development

---

## Functional Requirements

### FR-1: gameStore

**FR-1.1**: Store shape matches existing types
- Use `Grid`, `PlayerState`, `RunState` from `@/types`
- Include `gridConfig: GridConfig` for level scaling

**FR-1.2**: Core actions for gameplay
- `startNewRun()` - Initialize new run with default stats
- `startLevel(level)` - Initialize grid for a level
- `revealCell(row, col)` - Reveal cell, handle damage/win
- `toggleFlag(row, col)` - Toggle flag state
- `takeDamage(amount)` - Reduce shields/lives
- `addGold(amount)` - Add gold to player
- `addShield(count)` - Add shields to player
- `setPhase(phase)` - Transition game phase
- `reset()` - Reset to initial state

**FR-1.3**: Computed/derived state
- `gameOver` - Derived from player.lives === 0
- Win condition check after reveals

### FR-2: metaStore

**FR-2.1**: Persistent state with LocalStorage
- Use Zustand `persist` middleware
- Storage key: `dungeon-delver-meta`

**FR-2.2**: Store shape
- `stats: GameStats` - Overall statistics
- `playerStats: PlayerStats` - Permanent player stats
- `upgrades: PermanentUpgradeRegistry` - Purchased upgrades

**FR-2.3**: Actions
- `recordRunEnd(level, gold)` - Update stats after run
- `purchaseUpgrade(id)` - Purchase and apply upgrade
- `applyAllUpgrades()` - Apply all upgrades to playerStats
- `reset()` - Reset to defaults (for testing)

### FR-3: uiStore

**FR-3.1**: UI state management
- `activeModal` - Current modal or 'none'
- `soundEnabled` - Sound effects toggle
- `musicEnabled` - Music toggle

**FR-3.2**: Actions
- `openModal(modal)` - Open a modal
- `closeModal()` - Close current modal
- `toggleSound()` - Toggle sound setting
- `toggleMusic()` - Toggle music setting

---

## Technical Requirements

### TR-1: Dependencies

Install required packages:
- `zustand` - State management
- `immer` - Immutable state updates (for middleware)

### TR-2: Middleware Configuration

```typescript
// Pattern for all stores
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

const useStore = create<StoreType>()(
  devtools(
    immer((set, get) => ({
      // state and actions
    })),
    { name: 'StoreName' }
  )
);
```

### TR-3: Persistence Configuration

```typescript
// metaStore only
import { persist } from 'zustand/middleware';

const useMetaStore = create<MetaStoreType>()(
  devtools(
    persist(
      immer((set, get) => ({
        // state and actions
      })),
      { name: 'dungeon-delver-meta' }
    ),
    { name: 'MetaStore' }
  )
);
```

### TR-4: Engine Integration

Store actions should call engine functions:
```typescript
revealCell: (row, col) => {
  const { grid } = get();
  if (!grid) return;

  const result = engineRevealCell(grid, { row, col });
  set((state) => {
    state.grid = result.grid;
    state.run.revealedCount += result.revealedPositions.length;

    if (result.hitMonster) {
      // Handle damage
    }
    if (result.isWon) {
      // Handle win
    }
  });
};
```

---

## API Design

### gameStore Types

```typescript
interface GameStoreState {
  grid: Grid | null;
  gridConfig: GridConfig;
  player: PlayerState;
  run: RunState;
  gameOver: boolean;
}

interface GameStoreActions {
  startNewRun: () => void;
  startLevel: (level: number) => void;
  revealCell: (row: number, col: number) => void;
  toggleFlag: (row: number, col: number) => void;
  takeDamage: (amount: number) => void;
  addGold: (amount: number) => void;
  addShield: (count: number) => void;
  setPhase: (phase: GamePhase) => void;
  reset: () => void;
}

type GameStore = GameStoreState & GameStoreActions;
```

### metaStore Types

```typescript
interface MetaStoreState {
  stats: GameStats;
  playerStats: PlayerStats;
  upgrades: PermanentUpgradeRegistry;
}

interface MetaStoreActions {
  recordRunEnd: (level: number, gold: number) => void;
  purchaseUpgrade: (id: string) => boolean;
  applyAllUpgrades: () => void;
  reset: () => void;
}

type MetaStore = MetaStoreState & MetaStoreActions;
```

### uiStore Types

```typescript
type ModalType = 'none' | 'settings' | 'help' | 'confirm';

interface UIStoreState {
  activeModal: ModalType;
  soundEnabled: boolean;
  musicEnabled: boolean;
}

interface UIStoreActions {
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
  toggleSound: () => void;
  toggleMusic: () => void;
}

type UIStore = UIStoreState & UIStoreActions;
```

---

## Non-Functional Requirements

### NFR-1: Type Safety

- All stores have full TypeScript types
- No `any` types
- Strict mode compliance

### NFR-2: Test Coverage

- Unit tests for store actions
- Test persistence for metaStore
- Test state transitions

### NFR-3: Performance

- No performance concerns for stores
- Immer handles structural sharing

---

## Constraints

1. **Use existing types**: Import from `@/types`, don't duplicate
2. **Middleware order**: devtools(persist(immer(...))) for metaStore
3. **Engine purity**: Store actions call engine functions, engine stays pure

---

## Out of Scope

- POC migration (Phase 1020 will use stores)
- Actual upgrade definitions (Phase 2030)
- Rune state management (Milestone 3)
- Sound/music implementation (Milestone 6)

---

## Acceptance Criteria

- [ ] Zustand and immer installed
- [ ] gameStore created with all actions
- [ ] metaStore created with persistence
- [ ] uiStore created
- [ ] Store exports in index.ts
- [ ] TypeScript compiles with strict mode
- [ ] Unit tests pass for key operations
- [ ] metaStore persists across page refresh

---

## Dependencies

### Uses
- `@/types` - All type definitions
- `@/engine` - Grid operations

### Used By
- Phase 1020 (Game Board UI) - Will use gameStore
- Phase 1030 (HUD Components) - Will use all stores
- Phase 2030 (Meta Progression) - Will extend metaStore

---

## Constitution Compliance

| Principle | Impact | Notes |
|-----------|--------|-------|
| VII. Move Fast | High | Clean stores enable rapid feature development |
| IV. Resource Tension | Medium | Stores track HP, gold, shields correctly |

No violations. This is foundational infrastructure.
