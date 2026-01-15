# Implementation Plan: Meta Progression

**Phase**: 2030
**Status**: Draft
**Created**: 2026-01-15

---

## Technical Context

### Architecture Overview

This feature integrates with the existing Zustand-based state management architecture:

```
┌─────────────────────────────────────────────────────┐
│                    React UI                          │
├─────────────────────────────────────────────────────┤
│  UpgradeShopModal (NEW)  │  GameOverModal (MODIFY)  │
├─────────────────────────────────────────────────────┤
│                  Zustand Stores                      │
│  gameStore (MODIFY)  │  metaStore (MODIFY)          │
├─────────────────────────────────────────────────────┤
│                  Data Layer                          │
│  permanentUpgrades.ts (NEW)                         │
├─────────────────────────────────────────────────────┤
│                  Type Definitions                    │
│  player.ts (MODIFY)  │  shop.ts (EXISTING)          │
└─────────────────────────────────────────────────────┘
```

### Constitution Alignment Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Information Is Power | N/A | Meta system, not core gameplay |
| II. The Dungeon Is Alive | N/A | No DM integration this phase |
| III. Emergent Complexity | PASS | Upgrades enhance, not replace core loop |
| IV. Resource Tension | PASS | Gold must balance shop vs upgrades |
| V. Passive Mastery | PASS | Upgrades are passive stat modifiers |
| VI. Juice Is Holistic | PARTIAL | Basic UI; polish in future phase |
| VII. Move Fast, Iterate Often | PASS | Minimal implementation, playable quickly |

### Existing Patterns to Follow

1. **Type System**: Use discriminated unions (`type: 'leveled' | 'unlockable'`)
2. **Store Pattern**: Zustand with immer middleware, devtools in dev
3. **Persistence**: Zustand persist to localStorage
4. **Component Pattern**: memo() for performance, dungeon-themed CSS
5. **Testing**: Vitest with @testing-library/react

---

## Implementation Phases

### Phase A: Data Layer (Foundation)

**Goal**: Define upgrade data and extend type system.

**Files**:
- `src/data/permanentUpgrades.ts` (NEW)
- `src/types/player.ts` (MODIFY)
- `src/types/index.ts` (MODIFY)

**Implementation**:

1. Extend PlayerStats interface:
```typescript
interface PlayerStats {
  maxLives: number;          // Existing
  startingGold: number;      // Existing
  firstClickSafety: boolean; // Existing
  goldFindBonus: number;     // NEW: 0.0 = no bonus, 0.1 = +10%
  startingShields: number;   // NEW: shields at run start
  preparationLevel: number;  // NEW: count of random buffs
}
```

2. Create upgrade definitions with apply functions that modify PlayerStats.

3. Export `PERMANENT_UPGRADES` constant and initialization helper.

### Phase B: Meta Store Integration

**Goal**: Wire up upgrade purchasing and application.

**Files**:
- `src/stores/metaStore.ts` (MODIFY)
- `src/stores/types.ts` (MODIFY)
- `src/stores/__tests__/metaStore.test.ts` (MODIFY)

**Implementation**:

1. Add `metaGold` field to track upgrade currency
2. Add `initializeUpgrades()` to populate registry on first load
3. Modify `purchaseUpgrade()` to deduct gold
4. Ensure upgrades persist correctly in localStorage

### Phase C: Game Store Integration

**Goal**: Apply purchased upgrades at run start.

**Files**:
- `src/stores/gameStore.ts` (MODIFY)
- `src/stores/__tests__/gameStore.test.ts` (MODIFY)

**Implementation**:

1. `startNewRun()` reads `playerStats` from metaStore
2. Apply preparation buffs (random nextLevelBuffs)
3. Apply startingShields to initial player state
4. Apply goldFindBonus multiplier in gold-granting code

### Phase D: Gold Find System

**Goal**: Apply gold multiplier to all gold sources.

**Files**:
- `src/stores/gameStore.ts` (MODIFY)

**Implementation**:

1. Create helper: `applyGoldFind(base: number, bonus: number): number`
2. Apply in `revealCell` gold grants
3. Apply in any other future gold sources

### Phase E: Upgrade Shop UI

**Goal**: Create upgrade purchase interface.

**Files**:
- `src/components/ui/UpgradeShopModal.tsx` (NEW)
- `src/components/ui/__tests__/UpgradeShopModal.test.tsx` (NEW)

**Implementation**:

1. Grid layout of upgrade cards
2. Each card: name, description, level/max, cost, purchase button
3. Gold balance display
4. Continue button to proceed
5. Follow dungeon theme from existing components

### Phase F: Game Flow Integration

**Goal**: Wire upgrade shop into death flow.

**Files**:
- `src/components/ui/GameOverModal.tsx` (MODIFY)
- `src/components/game/GameContainer.tsx` (MODIFY)

**Implementation**:

1. GameOverModal "Continue" sets phase to 'upgradeShop'
2. UpgradeShopModal "Continue" calls startNewRun()
3. Transfer remaining gold to metaGold on death

---

## Data Model

### Upgrade Definitions

```typescript
// src/data/permanentUpgrades.ts
export const PERMANENT_UPGRADES: Record<string, PermanentUpgrade> = {
  vitality: {
    type: 'leveled',
    name: 'Vitality',
    description: '+1 starting Max HP',
    baseCost: 100,
    level: 0,
    maxLevel: 3,
    costIncrease: 2,
    apply: (stats) => { stats.maxLives += 1; },
  },
  fortune: {
    type: 'leveled',
    name: 'Fortune',
    description: '+10% gold find',
    baseCost: 150,
    level: 0,
    maxLevel: 5,
    costIncrease: 2,
    apply: (stats) => { stats.goldFindBonus += 0.10; },
  },
  preparation: {
    type: 'leveled',
    name: 'Preparation',
    description: 'Start with random buff',
    baseCost: 200,
    level: 0,
    maxLevel: 3,
    costIncrease: 2,
    apply: (stats) => { stats.preparationLevel += 1; },
  },
  resilience: {
    type: 'leveled',
    name: 'Resilience',
    description: '+1 starting shield',
    baseCost: 250,
    level: 0,
    maxLevel: 2,
    costIncrease: 2,
    apply: (stats) => { stats.startingShields += 1; },
  },
  firstClickSafety: {
    type: 'unlockable',
    name: 'First Click Safety',
    description: 'First click never reveals monster',
    baseCost: 300,
    unlocked: false,
    apply: (stats) => { stats.firstClickSafety = true; },
  },
};
```

### State Shape Changes

```typescript
// metaStore additions
interface MetaStoreState {
  stats: GameStats;
  playerStats: PlayerStats;
  upgrades: PermanentUpgradeRegistry;
  metaGold: number;  // NEW: gold available for upgrades
}

interface MetaStoreActions {
  recordRunEnd: (level: number, gold: number) => void;
  purchaseUpgrade: (id: string) => boolean;
  applyAllUpgrades: () => void;
  reset: () => void;
  addMetaGold: (amount: number) => void;  // NEW
  initializeUpgrades: () => void;  // NEW
}
```

---

## Risk Mitigation

### localStorage Migration

The meta store already persists to `dungeon-delver-meta`. Adding new fields requires handling existing users.

**Strategy**:
- New fields have sensible defaults
- `initializeUpgrades()` merges defined upgrades with existing state
- Existing purchase state preserved if upgrade IDs match

### Gold Economy Balance

Upgrade costs affect game balance significantly.

**Strategy**:
- Start with costs from game-design.md (tested values)
- Can adjust via data file changes without code changes
- Track purchase rate in future analytics

---

## Testing Strategy

### Unit Tests

1. **permanentUpgrades.ts**
   - Each upgrade apply() modifies correct stat
   - Cost calculation matches expected formula

2. **metaStore**
   - purchaseUpgrade deducts correct gold
   - purchaseUpgrade respects maxLevel
   - applyAllUpgrades applies each upgrade N times
   - initializeUpgrades merges correctly

3. **gameStore**
   - startNewRun uses metaStore playerStats
   - Gold find multiplier applied correctly

### Integration Tests

1. Death flow transitions to upgrade shop
2. Purchase updates gold and upgrade level
3. New run applies all purchased upgrades
4. Stats persist after refresh

---

## Dependencies

- None - all required infrastructure exists

---

## Estimated Complexity

**Low-Medium**: Infrastructure exists, primarily data definition and wiring.

Key complexity areas:
- Preparation buff random selection
- Gold find multiplier integration
- localStorage migration safety
