# Discovery: Zustand Stores (Phase 1010)

## Phase Context

**Goal**: Set up state management with Zustand, including LocalStorage persistence.

**From ROADMAP**: This is Milestone 1 - Game State & UI, first phase. The stores will replace the POC's useState-based state management.

---

## Codebase Findings

### Existing Type Definitions

Comprehensive types already exist in `src/types/`:

| Type | File | Description |
|------|------|-------------|
| `Grid` | `grid.ts` | 2D array of cells |
| `GridConfig` | `grid.ts` | Rows, cols, monsterCount |
| `PlayerState` | `player.ts` | Lives, shields, gold, buffs |
| `PlayerStats` | `player.ts` | Permanent stats (maxLives, etc.) |
| `ActiveBuffs` | `player.ts` | Current level buffs |
| `NextLevelBuffs` | `player.ts` | Queued buffs for next level |
| `GamePhase` | `game.ts` | 'playing' \| 'shopping' \| 'gameOver' \| 'upgradeShop' |
| `GameStats` | `game.ts` | Meta stats (highestLevel, totalRuns) |
| `RunState` | `game.ts` | Current run state (level, revealed, etc.) |
| `GameState` | `game.ts` | Complete game state composite |
| `PermanentUpgrade` | `shop.ts` | Leveled or Unlockable upgrade |

**Factory functions available**:
- `createInitialPlayerState(stats)` - Creates player state from stats
- `createInitialRunState(level)` - Creates run state for new floor
- `createDefaultGameStats()` - Creates empty meta stats
- `createDefaultPlayerStats()` - Creates default permanent stats
- `calculateLevelGridConfig(level)` - Gets grid config for a level

### Current POC State Management

The POC (`src/App.tsx`) uses React useState:
```typescript
const [grid, setGrid] = useState<Grid | null>(null);
const [gameState, setGameState] = useState<GameState>('idle');
const [isFirstClick, setIsFirstClick] = useState(true);
```

This needs to be migrated to Zustand stores.

### Engine Functions Available

From `@/engine`:
- `initializeGrid(config, firstClick?)` - Creates grid with monsters
- `revealCell(grid, position)` - Returns RevealResult with hitMonster, isWon
- `toggleFlag(grid, position)` - Returns FlagResult

### Target Location

The `src/stores/` directory doesn't exist yet - needs to be created.

---

## Store Architecture Analysis

### Proposed Store Separation

Based on phase definition and existing types:

| Store | Purpose | Persistence |
|-------|---------|-------------|
| `gameStore` | Current run state (grid, player, run) | Memory only |
| `metaStore` | Permanent progression (stats, upgrades) | LocalStorage |
| `uiStore` | UI state (modals, settings) | Memory only |

### gameStore Shape (from types)

```typescript
interface GameStoreState {
  // Grid state
  grid: Grid | null;
  gridConfig: GridConfig;

  // Player state (from PlayerState type)
  player: PlayerState;

  // Run state (from RunState type)
  run: RunState;

  // Computed
  gameOver: boolean;
}

interface GameStoreActions {
  // Run lifecycle
  startNewRun: () => void;
  startLevel: (level: number) => void;

  // Grid actions
  revealCell: (row: number, col: number) => void;
  toggleFlag: (row: number, col: number) => void;

  // Player actions
  takeDamage: (amount: number) => void;
  addGold: (amount: number) => void;
  addShield: (count: number) => void;

  // Phase transitions
  setPhase: (phase: GamePhase) => void;

  // Reset
  reset: () => void;
}
```

### metaStore Shape (from types)

```typescript
interface MetaStoreState {
  // Stats (from GameStats type)
  stats: GameStats;

  // Permanent player stats (from PlayerStats type)
  playerStats: PlayerStats;

  // Upgrades (from shop.ts types)
  upgrades: PermanentUpgradeRegistry;
}

interface MetaStoreActions {
  // Stats tracking
  recordRunEnd: (level: number, gold: number) => void;

  // Upgrade management
  purchaseUpgrade: (id: string, gold: number) => boolean;

  // Reset (for testing)
  reset: () => void;
}
```

### uiStore Shape

```typescript
interface UIStoreState {
  // Modal state
  activeModal: 'none' | 'settings' | 'help' | 'confirm';

  // Settings
  soundEnabled: boolean;
  musicEnabled: boolean;
}

interface UIStoreActions {
  openModal: (modal: UIStoreState['activeModal']) => void;
  closeModal: () => void;
  toggleSound: () => void;
  toggleMusic: () => void;
}
```

---

## Integration Points

### POC Migration

The POC will need to be updated to use stores:
1. Replace `useState` with store hooks
2. Replace inline handlers with store actions
3. Keep rendering logic (cell display helpers) in App.tsx

### Engine Integration

Store actions should call engine functions:
```typescript
revealCell: (row, col) => {
  const result = engineRevealCell(get().grid!, { row, col });
  set({ grid: result.grid });
  if (result.hitMonster) {
    get().takeDamage(1);
  }
  if (result.isWon) {
    // Handle win
  }
}
```

---

## Constitution Compliance

| Principle | Relevance | Notes |
|-----------|-----------|-------|
| VII. Move Fast | High | Clean store architecture enables fast iteration |
| IV. Resource Tension | Medium | Stores must track HP, gold, shields correctly |
| I. Information Is Power | Low | Stores are infrastructure, not gameplay |

No violations. This is foundational infrastructure.

---

## User Decisions

1. **Store granularity**: Single gameStore - keep all run state unified (simpler, aligns with existing GameState type)
2. **Middleware**: Devtools + Immer - enable both for debugging and cleaner nested state updates
