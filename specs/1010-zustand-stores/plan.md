# Implementation Plan: Zustand Stores

**Phase**: 1010
**Spec**: spec.md
**Created**: 2026-01-15

---

## Technical Context

### Existing Infrastructure

| Component | Location | Status |
|-----------|----------|--------|
| Core types | `src/types/` | Complete |
| Engine functions | `src/engine/` | Complete |
| Type exports | `src/types/index.ts` | Complete |
| Engine exports | `src/engine/index.ts` | Complete |

### New Components

| Component | Location | Description |
|-----------|----------|-------------|
| Store types | `src/stores/types.ts` | Store-specific type definitions |
| Game store | `src/stores/gameStore.ts` | Current run state |
| Meta store | `src/stores/metaStore.ts` | Persistent progression |
| UI store | `src/stores/uiStore.ts` | UI state |
| Store exports | `src/stores/index.ts` | Barrel exports |
| Game store tests | `src/stores/__tests__/gameStore.test.ts` | Unit tests |
| Meta store tests | `src/stores/__tests__/metaStore.test.ts` | Unit tests |
| UI store tests | `src/stores/__tests__/uiStore.test.ts` | Unit tests |

---

## Constitution Compliance

| Principle | Impact | Compliance Approach |
|-----------|--------|---------------------|
| VII. Move Fast | High | Clean stores enable rapid feature development |
| IV. Resource Tension | Medium | Stores correctly track HP, gold, shields |

**No violations identified.** Stores are foundational infrastructure.

---

## Architecture Decisions

### AD-1: Middleware Stack Order

**Decision**: devtools(persist(immer(...))) for metaStore, devtools(immer(...)) for others.

**Rationale**:
- Immer innermost for clean state updates
- Persist wraps Immer for metaStore
- Devtools outermost for all stores (debugging)

### AD-2: Store Separation

**Decision**: Three separate stores (game, meta, ui) rather than one monolithic store.

**Rationale**:
- Clear separation of concerns
- Different persistence requirements
- Easier testing
- Matches existing type organization

### AD-3: Engine Integration

**Decision**: Store actions call engine functions, engine stays pure.

**Rationale**:
- Engine remains testable in isolation
- Stores handle side effects
- Clear responsibility boundaries

### AD-4: Default Upgrades Registry

**Decision**: Initialize with empty upgrades object, populate in Phase 2030.

**Rationale**:
- Phase 1010 focuses on infrastructure
- Upgrade definitions belong in meta-progression phase
- Registry structure is ready for later

---

## Implementation Strategy

### Phase 1: Setup

1. Install dependencies (zustand, immer)
2. Create `src/stores/` directory structure
3. Create store types file

### Phase 2: gameStore

1. Create store with state and initial values
2. Implement run lifecycle actions (startNewRun, startLevel)
3. Implement grid actions (revealCell, toggleFlag)
4. Implement player actions (takeDamage, addGold, addShield)
5. Implement phase transitions and reset
6. Add unit tests

### Phase 3: metaStore

1. Create store with persist middleware
2. Implement stats tracking (recordRunEnd)
3. Implement upgrade actions (purchaseUpgrade, applyAllUpgrades)
4. Add unit tests including persistence

### Phase 4: uiStore

1. Create store with state and actions
2. Add unit tests

### Phase 5: Integration

1. Create barrel exports
2. Verify all tests pass
3. Verify TypeScript compilation

---

## File Structure

```
src/stores/
├── index.ts              # Barrel exports
├── types.ts              # Store-specific types
├── gameStore.ts          # Game/run state
├── metaStore.ts          # Persistent progression
├── uiStore.ts            # UI state
└── __tests__/
    ├── gameStore.test.ts
    ├── metaStore.test.ts
    └── uiStore.test.ts
```

---

## Store Patterns

### gameStore Pattern

```typescript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { GameStore } from './types';
import type { PlayerState, RunState, GridConfig } from '@/types';
import {
  createInitialPlayerState,
  createInitialRunState,
  createDefaultPlayerStats,
  calculateLevelGridConfig,
} from '@/types';
import { initializeGrid, revealCell as engineRevealCell, toggleFlag as engineToggleFlag } from '@/engine';

const initialPlayerState: PlayerState = createInitialPlayerState(createDefaultPlayerStats());
const initialRunState: RunState = createInitialRunState(1);
const initialGridConfig: GridConfig = calculateLevelGridConfig(1);

export const useGameStore = create<GameStore>()(
  devtools(
    immer((set, get) => ({
      // State
      grid: null,
      gridConfig: initialGridConfig,
      player: initialPlayerState,
      run: initialRunState,
      gameOver: false,

      // Actions
      startNewRun: () => {
        const playerStats = createDefaultPlayerStats(); // Will get from metaStore
        set((state) => {
          state.grid = null;
          state.player = createInitialPlayerState(playerStats);
          state.run = createInitialRunState(1);
          state.gameOver = false;
        });
      },

      // ... more actions
    })),
    { name: 'GameStore' }
  )
);
```

### metaStore Pattern

```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { MetaStore } from './types';
import { createDefaultGameStats, createDefaultPlayerStats } from '@/types';

export const useMetaStore = create<MetaStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // State
        stats: createDefaultGameStats(),
        playerStats: createDefaultPlayerStats(),
        upgrades: {},

        // Actions
        recordRunEnd: (level, gold) => {
          set((state) => {
            state.stats.totalRuns = (state.stats.totalRuns ?? 0) + 1;
            if (level > state.stats.highestLevelOverall) {
              state.stats.highestLevelOverall = level;
            }
            if (gold > state.stats.maxGoldRun) {
              state.stats.maxGoldRun = gold;
            }
          });
        },

        // ... more actions
      })),
      { name: 'dungeon-delver-meta' }
    ),
    { name: 'MetaStore' }
  )
);
```

---

## Testing Strategy

### Unit Test Coverage

| Store | Test File | Key Scenarios |
|-------|-----------|---------------|
| gameStore | gameStore.test.ts | Run lifecycle, grid actions, player actions |
| metaStore | metaStore.test.ts | Stats tracking, persistence |
| uiStore | uiStore.test.ts | Modal state, settings toggles |

### Test Patterns

```typescript
import { act } from '@testing-library/react';
import { useGameStore } from '../gameStore';

describe('gameStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useGameStore.getState().reset();
  });

  it('starts a new run with fresh state', () => {
    // Arrange
    const store = useGameStore.getState();

    // Act
    act(() => {
      store.startNewRun();
    });

    // Assert
    const state = useGameStore.getState();
    expect(state.player.lives).toBe(3);
    expect(state.run.level).toBe(1);
  });
});
```

### Persistence Testing

```typescript
describe('metaStore persistence', () => {
  it('persists stats across store recreation', () => {
    // Record a run
    act(() => {
      useMetaStore.getState().recordRunEnd(5, 100);
    });

    // Get localStorage data
    const stored = localStorage.getItem('dungeon-delver-meta');
    expect(stored).toBeTruthy();

    const parsed = JSON.parse(stored!);
    expect(parsed.state.stats.highestLevelOverall).toBe(5);
  });
});
```

---

## Dependencies

### Internal
- `@/types` - All type definitions
- `@/engine` - Grid operations

### External
- `zustand` - State management
- `immer` - Immutable updates

### Dev
- `vitest` - Testing (already configured)

---

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Middleware order bugs | Low | Medium | Follow established pattern |
| Persistence corruption | Low | High | Version storage schema |
| Type mismatches | Low | Medium | Use existing types |

---

## Success Metrics

- [ ] All stores compile with strict TypeScript
- [ ] gameStore resets correctly on new run
- [ ] metaStore persists across page refresh
- [ ] Store actions update state correctly
- [ ] Tests pass for key store operations
