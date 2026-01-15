# Specification: Phase 0020 - Core Types

> **Phase**: 0020 - core-types
> **Goal**: Define all TypeScript types for the game domain
> **Status**: In Progress

---

## Overview

This phase establishes the complete TypeScript type system for Dungeon Delver. All types model the existing POC functionality while providing extensibility for future phases (Runes, AI DM, Moving Monsters).

---

## Functional Requirements

### FR-1: Cell Types

Define types for individual grid cells (tiles).

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1.1 | Define `Cell` interface with monster, revealed, flagged, question, exit, and adjacentMonsters properties | P0 |
| FR-1.2 | Define `CellPosition` type for row/col coordinates | P0 |
| FR-1.3 | Add JSDoc comments explaining each property | P0 |

**Type Definition**:
```typescript
/** A single cell in the dungeon grid */
interface Cell {
  /** True if this cell contains a monster */
  isMonster: boolean;
  /** True if player has revealed this cell */
  isRevealed: boolean;
  /** True if player has flagged this cell as dangerous */
  isFlagged: boolean;
  /** True if player marked with question mark (unsure) */
  isQuestion: boolean;
  /** True if this is the exit to the next floor */
  isExit: boolean;
  /** Number of adjacent cells containing monsters (0-8) */
  adjacentMonsters: number;
}

/** Position of a cell in the grid */
interface CellPosition {
  row: number;
  col: number;
}
```

### FR-2: Grid Types

Define types for the game grid structure.

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-2.1 | Define `Grid` as a 2D array of `Cell` | P0 |
| FR-2.2 | Define `GridConfig` with rows, cols, monsterCount | P0 |
| FR-2.3 | Define `GridDimensions` for size calculations | P1 |

**Type Definition**:
```typescript
/** The dungeon grid - 2D array of cells */
type Grid = Cell[][];

/** Configuration for generating a new grid */
interface GridConfig {
  rows: number;
  cols: number;
  monsterCount: number;
}

/** Grid size information */
interface GridDimensions {
  rows: number;
  cols: number;
  totalCells: number;
  safeCells: number;
}
```

### FR-3: Player Types

Define types for player state during a run.

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-3.1 | Define `PlayerState` with lives, shields, gold | P0 |
| FR-3.2 | Define `PlayerStats` for permanent upgrades | P0 |
| FR-3.3 | Define `ActiveBuffs` and `NextLevelBuffs` types | P0 |
| FR-3.4 | Use discriminated union for buff effects | P1 |

**Type Definition**:
```typescript
/** Active buff effects (apply during current level) */
interface ActiveBuffs {
  extraLife?: boolean;
  goldenGoose?: boolean;
  goldMagnet?: boolean;
  steadyHand?: boolean;
  forcefield?: number;
  scrapMetal?: boolean;
  shieldBattery?: boolean;
}

/** Buffs that apply at the start of next level */
interface NextLevelBuffs {
  revealTiles?: number;
  shields?: number;
  masterGoggles?: boolean;
  monsterTracker?: number;
  eliteMonsterTracker?: boolean;
  monsterRepellent?: boolean;
  steadyHand?: boolean;
  goldMagnet?: boolean;
  scrapMetal?: boolean;
  shieldBattery?: boolean;
  forcefield?: number;
}

/** Player state during a run */
interface PlayerState {
  lives: number;
  maxLives: number;
  shields: number;
  gold: number;
  activeBuffs: ActiveBuffs;
  nextLevelBuffs: NextLevelBuffs;
}

/** Permanent player statistics (persist across runs) */
interface PlayerStats {
  maxLives: number;
  startingGold: number;
  firstClickSafety: boolean;
}
```

### FR-4: Monster Types

Define types for static monsters (movement in Phase 4).

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-4.1 | Define `MonsterTier` as union type | P0 |
| FR-4.2 | Define `Monster` interface with id, name, tier, damage | P0 |
| FR-4.3 | Add placeholder properties for Phase 4 (canMove, movePattern) | P1 |

**Type Definition**:
```typescript
/** Monster difficulty tier */
type MonsterTier = 1 | 2 | 3 | 'boss';

/** Movement pattern for monsters (Phase 4) */
type MovePattern = 'static' | 'random' | 'chase' | 'patrol';

/** Monster definition */
interface Monster {
  id: string;
  name: string;
  tier: MonsterTier;
  damage: number;
  goldDrop: [min: number, max: number];

  // Phase 4+ properties (optional for now)
  canMove?: boolean;
  moveSpeed?: number;
  movePattern?: MovePattern;
  hp?: number;
  ability?: string;
}
```

### FR-5: Item and Buff Types

Define types for shop items and buffs.

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-5.1 | Define `ItemRarity` union type | P0 |
| FR-5.2 | Define `ShopItem` interface with apply function type | P0 |
| FR-5.3 | Define `BuffEffect` for typed buff applications | P1 |

**Type Definition**:
```typescript
/** Item rarity tiers */
type ItemRarity = 'common' | 'uncommon' | 'rare' | 'legendary';

/** Shop item available for purchase */
interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  rarity?: ItemRarity;
  apply: (state: GameState, playerStats: PlayerStats) => void;
}

/** Categorized shop item pools */
interface ShopItemPool {
  common: ShopItem[];
  uncommon: ShopItem[];
  rare: ShopItem[];
  legendary: ShopItem[];
}
```

### FR-6: Shop Types

Define types for permanent upgrades and shop mechanics.

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-6.1 | Define `LeveledUpgrade` for upgrades with levels | P0 |
| FR-6.2 | Define `UnlockableUpgrade` for one-time purchases | P0 |
| FR-6.3 | Define `PermanentUpgrade` as discriminated union | P0 |

**Type Definition**:
```typescript
/** Base upgrade properties */
interface BaseUpgrade {
  name: string;
  description: string;
  baseCost: number;
  apply: (playerStats: PlayerStats) => void;
}

/** Upgrade with multiple levels */
interface LeveledUpgrade extends BaseUpgrade {
  type: 'leveled';
  level: number;
  maxLevel: number;
  costIncrease: number;
}

/** One-time unlockable upgrade */
interface UnlockableUpgrade extends BaseUpgrade {
  type: 'unlockable';
  unlocked: boolean;
}

/** All permanent upgrade types */
type PermanentUpgrade = LeveledUpgrade | UnlockableUpgrade;

/** Registry of all permanent upgrades */
type PermanentUpgradeRegistry = Record<string, PermanentUpgrade>;
```

### FR-7: Game Session Types

Define types for game state and run management.

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-7.1 | Define `GamePhase` for game state machine | P0 |
| FR-7.2 | Define `GameState` combining all runtime state | P0 |
| FR-7.3 | Define `GameStats` for cross-run statistics | P0 |
| FR-7.4 | Define `RunState` for current run tracking | P0 |

**Type Definition**:
```typescript
/** Current phase of the game */
type GamePhase = 'playing' | 'shopping' | 'gameOver' | 'upgradeShop';

/** Statistics tracked across all runs */
interface GameStats {
  highestLevelOverall: number;
  maxGoldRun: number;
  totalRuns?: number;
  totalDeaths?: number;
}

/** State for the current run/level */
interface RunState {
  level: number;
  phase: GamePhase;
  revealedCount: number;
  flagsPlaced: number;
  damageTakenThisLevel: boolean;
  isFirstClick: boolean;
}

/** Complete game state (combines all state) */
interface GameState {
  // Grid state
  grid: Grid;
  gridConfig: GridConfig;

  // Player state
  player: PlayerState;

  // Run state
  run: RunState;

  // Is the game over?
  gameOver: boolean;
}
```

### FR-8: Index Export

Central export file for all types.

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-8.1 | Create `index.ts` that re-exports all types | P0 |
| FR-8.2 | Group exports logically (cell, grid, player, etc.) | P1 |
| FR-8.3 | Use type-only exports where appropriate | P1 |

---

## Non-Functional Requirements

| ID | Requirement | Metric |
|----|-------------|--------|
| NFR-1 | All types compile with strict TypeScript | Zero errors |
| NFR-2 | All exported types have JSDoc comments | 100% coverage |
| NFR-3 | No `any` types used | Zero instances |
| NFR-4 | Type guards provided for discriminated unions | Where applicable |

---

## Out of Scope

- Rune system types (Phase 3020+)
- AI Dungeon Master types (Phase 4010+)
- Moving monster logic types (Phase 5010+)
- Audio/visual types (Phase 6000+)

Note: Placeholder properties may be included (e.g., `Monster.canMove`) but full implementation is deferred.

---

## Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| Phase 0010 - project-setup | Prerequisite | Complete |
| TypeScript strict mode | Configuration | Verified |
| POC archived code | Reference | Available |

---

## Acceptance Criteria

1. All type files created in `src/types/` directory
2. `pnpm typecheck` passes with no errors
3. All exported types have JSDoc documentation
4. Types accurately model POC functionality
5. Unit tests for any type guards
