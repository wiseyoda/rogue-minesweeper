# Tasks: Zustand Stores

**Phase**: 1010
**Created**: 2026-01-15

---

## Task List

### 1. Setup
- [x] T001 Install zustand and immer packages
- [x] T002 Create `src/stores/` directory structure
- [x] T003 Create `src/stores/types.ts` with store type definitions

### 2. gameStore Implementation
- [x] T004 Create `src/stores/gameStore.ts` with initial state
- [x] T005 Implement startNewRun action
- [x] T006 Implement startLevel action with grid initialization
- [x] T007 Implement revealCell action with engine integration
- [x] T008 Implement toggleFlag action with engine integration
- [x] T009 Implement takeDamage action (shields first, then lives)
- [x] T010 Implement addGold action
- [x] T011 Implement addShield action
- [x] T012 Implement setPhase action
- [x] T013 Implement reset action
- [x] T014 Add gameOver computed check

### 3. metaStore Implementation
- [x] T015 Create `src/stores/metaStore.ts` with persist middleware
- [x] T016 Implement recordRunEnd action
- [x] T017 Implement purchaseUpgrade action (structure only)
- [x] T018 Implement applyAllUpgrades action (structure only)
- [x] T019 Implement reset action

### 4. uiStore Implementation
- [x] T020 Create `src/stores/uiStore.ts` with initial state
- [x] T021 Implement openModal and closeModal actions
- [x] T022 Implement toggleSound and toggleMusic actions

### 5. Exports and Integration
- [x] T023 Create `src/stores/index.ts` barrel exports

### 6. Testing
- [x] T024 Create `src/stores/__tests__/gameStore.test.ts`
- [x] T025 Test startNewRun and startLevel actions
- [x] T026 Test revealCell and toggleFlag actions
- [x] T027 Test takeDamage action (shields first)
- [x] T028 Test reset action
- [x] T029 Create `src/stores/__tests__/metaStore.test.ts`
- [x] T030 Test recordRunEnd action
- [x] T031 Test persistence across store recreation
- [x] T032 Create `src/stores/__tests__/uiStore.test.ts`
- [x] T033 Test modal state actions
- [x] T034 Test settings toggle actions

### 7. Verification
- [x] T035 Run typecheck
- [x] T036 Run lint
- [x] T037 Run tests
- [x] T038 Run build

---

## Task Dependencies

```
T001 → T002 → T003 → T004
                      ↓
              T005 → T006 → T007 → T008
                              ↓
                      T009 → T010 → T011 → T012 → T013 → T014
                                                    ↓
                                              T015 → T016 → T017 → T018 → T019
                                                                    ↓
                                                            T020 → T021 → T022
                                                                          ↓
                                                                    T023 → T024...T034
                                                                                    ↓
                                                                            T035 → T036 → T037 → T038
```

---

## Detailed Task Breakdown

### T001: Install dependencies

```bash
pnpm add zustand immer
```

### T003: Store types

```typescript
// src/stores/types.ts
import type {
  Grid,
  GridConfig,
  PlayerState,
  RunState,
  GamePhase,
  GameStats,
  PlayerStats,
  PermanentUpgradeRegistry,
} from '@/types';

// gameStore types
export interface GameStoreState {
  grid: Grid | null;
  gridConfig: GridConfig;
  player: PlayerState;
  run: RunState;
  gameOver: boolean;
}

export interface GameStoreActions {
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

export type GameStore = GameStoreState & GameStoreActions;

// metaStore types
export interface MetaStoreState {
  stats: GameStats;
  playerStats: PlayerStats;
  upgrades: PermanentUpgradeRegistry;
}

export interface MetaStoreActions {
  recordRunEnd: (level: number, gold: number) => void;
  purchaseUpgrade: (id: string) => boolean;
  applyAllUpgrades: () => void;
  reset: () => void;
}

export type MetaStore = MetaStoreState & MetaStoreActions;

// uiStore types
export type ModalType = 'none' | 'settings' | 'help' | 'confirm';

export interface UIStoreState {
  activeModal: ModalType;
  soundEnabled: boolean;
  musicEnabled: boolean;
}

export interface UIStoreActions {
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
  toggleSound: () => void;
  toggleMusic: () => void;
}

export type UIStore = UIStoreState & UIStoreActions;
```

### T007: revealCell action

```typescript
revealCell: (row, col) => {
  const { grid, run } = get();
  if (!grid || run.phase !== 'playing') return;

  const position = { row, col };

  // Handle first click initialization
  if (run.isFirstClick) {
    const newGrid = initializeGrid(get().gridConfig, position);
    const result = engineRevealCell(newGrid, position);
    set((state) => {
      state.grid = result.grid;
      state.run.isFirstClick = false;
      state.run.revealedCount += result.revealedPositions.length;
    });

    if (result.isWon) {
      get().setPhase('shopping');
    }
    return;
  }

  const result = engineRevealCell(grid, position);
  set((state) => {
    state.grid = result.grid;
    state.run.revealedCount += result.revealedPositions.length;
  });

  if (result.hitMonster) {
    get().takeDamage(1);
  }

  if (result.isWon && !get().gameOver) {
    get().setPhase('shopping');
  }
},
```

### T009: takeDamage action

```typescript
takeDamage: (amount) => {
  set((state) => {
    let remaining = amount;

    // Absorb with shields first
    if (state.player.shields > 0) {
      const absorbed = Math.min(state.player.shields, remaining);
      state.player.shields -= absorbed;
      remaining -= absorbed;
    }

    // Apply remaining damage to lives
    if (remaining > 0) {
      state.player.lives = Math.max(0, state.player.lives - remaining);
      state.run.damageTakenThisLevel = true;
    }

    // Check game over
    if (state.player.lives === 0) {
      state.gameOver = true;
      state.run.phase = 'gameOver';
    }
  });
},
```

---

## Estimated Complexity

**Total tasks**: 38
**Estimated lines of code**: ~400
**New files**: 8 (4 store files + 3 test files + 1 types file)
