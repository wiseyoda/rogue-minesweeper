# Implementation Plan: Phase 2010 - Floor Progression

## Technical Context

### Current Architecture
- **UI Framework**: React 18 with TypeScript
- **State**: Zustand with Immer middleware
- **Styling**: CSS custom properties + Tailwind
- **Engine**: Pure TypeScript functions in `src/engine/`
- **Existing Scaling**: `calculateLevelGridConfig()` in `src/types/game.ts`

### Target Architecture
- **Engine**: New `difficulty.ts` module with centralized scaling
- **State**: Updated `gameStore.ts` with gold bonus logic
- **Types**: Cleaned up `game.ts` (scaling moved to engine)

### Constitution Compliance Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Information Is Power | N/A | No information reveal changes |
| II. The Dungeon Is Alive | N/A | No DM changes |
| III. Emergent Complexity | N/A | No new mechanics |
| IV. Resource Tension | ✅ Aligns | Gold bonus adds reward layer |
| V. Passive Mastery | N/A | No progression changes |
| VI. Juice Is Holistic | N/A | No visual changes |
| VII. Move Fast | ✅ Aligns | Refactor enables faster balance tuning |

**No constitution violations identified.**

## Implementation Strategy

### Approach: Extract and Extend

This phase is primarily a refactoring with one feature addition:

1. **Extract**: Move scaling logic from `types/game.ts` to `engine/difficulty.ts`
2. **Centralize**: Create `DIFFICULTY_CONSTANTS` for all tunable values
3. **Extend**: Add gold bonus calculation and floor completion award
4. **Integrate**: Update gameStore to use new difficulty functions
5. **Verify**: Confirm buff carryover works correctly

### Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Breaking existing scaling behavior | Medium | High | Write tests first, match exact formulas |
| Circular import issues | Low | Medium | Keep difficulty.ts dependency-free |
| Buff carryover issues | Low | Medium | Add explicit test for buff persistence |

## Detailed Implementation Steps

### Phase A: Create Difficulty Module

#### A1. Create Engine File with Constants

**File**: `src/engine/difficulty.ts`

Create the constants object with all tunable values:
```typescript
export const DIFFICULTY_CONSTANTS = {
  // Grid scaling
  baseGridSize: 8,
  maxGridRows: 20,
  maxGridCols: 30,
  gridGrowthPerLevel: 1,

  // Monster scaling
  baseMonsterCount: 5,
  monsterGrowthPerLevel: 2.5,
  maxMonsterDensity: 0.3,

  // Rewards
  goldBonusPerLevel: 10,

  // Future: damage scaling (prep only)
  baseDamage: 1,
  damageGrowthPerLevel: 0,
} as const;
```

#### A2. Create FloorConfig Interface

**File**: `src/engine/difficulty.ts` (continued)

```typescript
export interface FloorConfig {
  rows: number;
  cols: number;
  monsterCount: number;
  goldBonus: number;
}

export interface MonsterDamageConfig {
  baseDamage: number;
  scaledDamage: number;
}
```

#### A3. Implement getFloorConfig Function

**File**: `src/engine/difficulty.ts` (continued)

Port logic from existing `calculateLevelGridConfig`:
```typescript
export function getFloorConfig(level: number): FloorConfig {
  const {
    baseGridSize,
    maxGridRows,
    maxGridCols,
    gridGrowthPerLevel,
    baseMonsterCount,
    monsterGrowthPerLevel,
    maxMonsterDensity,
    goldBonusPerLevel,
  } = DIFFICULTY_CONSTANTS;

  const rows = Math.min(baseGridSize + level * gridGrowthPerLevel, maxGridRows);
  const cols = Math.min(baseGridSize + level * gridGrowthPerLevel, maxGridCols);
  const monsterCount = Math.min(
    baseMonsterCount + Math.floor(level * monsterGrowthPerLevel),
    Math.floor(rows * cols * maxMonsterDensity)
  );
  const goldBonus = level * goldBonusPerLevel;

  return { rows, cols, monsterCount, goldBonus };
}
```

#### A4. Implement getMonsterDamage Function (Prep)

**File**: `src/engine/difficulty.ts` (continued)

```typescript
export function getMonsterDamage(level: number): MonsterDamageConfig {
  const { baseDamage, damageGrowthPerLevel } = DIFFICULTY_CONSTANTS;
  return {
    baseDamage,
    scaledDamage: baseDamage + Math.floor(level * damageGrowthPerLevel),
  };
}
```

#### A5. Create Engine Index Export

**File**: `src/engine/index.ts`

Add export for new difficulty module:
```typescript
export * from './difficulty';
```

### Phase B: Write Unit Tests

#### B1. Create Difficulty Tests

**File**: `src/engine/__tests__/difficulty.test.ts`

Test cases:
1. Level 1 returns correct config (9x9, ~8 monsters, 10 gold)
2. Level 5 returns correct config (13x13, ~18 monsters, 50 gold)
3. Level 10 returns correct config (18x18, ~30 monsters, 100 gold)
4. Level 20 caps at max grid size (20x30)
5. Edge case: level 0 returns base config
6. Edge case: level 100 caps appropriately
7. Monster count respects density cap
8. Gold bonus scales linearly

### Phase C: Update Game Store

#### C1. Import Difficulty Functions

**File**: `src/stores/gameStore.ts`

Replace inline scaling with import:
```typescript
import { getFloorConfig } from '@/engine/difficulty';
```

#### C2. Update startLevel Action

**File**: `src/stores/gameStore.ts`

Use `getFloorConfig` instead of inline calculation:
```typescript
startLevel: (level) => {
  const config = getFloorConfig(level);
  const grid = createGrid({
    rows: config.rows,
    cols: config.cols,
    monsterCount: config.monsterCount,
  });
  // ... rest of level setup
}
```

#### C3. Add Gold Bonus on Floor Completion

**File**: `src/stores/gameStore.ts`

In win handling logic, award floor bonus:
```typescript
// When win condition detected
const floorBonus = getFloorConfig(run.level).goldBonus;
set((state) => {
  state.player.gold += floorBonus;
});
```

### Phase D: Update Types

#### D1. Remove Redundant Function from types/game.ts

**File**: `src/types/game.ts`

Remove `calculateLevelGridConfig` function (now in difficulty.ts).
Keep type definitions.

#### D2. Update Any Imports

Search for and update any imports of `calculateLevelGridConfig` to use the new location.

### Phase E: Update WinModal

#### E1. Add Gold Bonus Display

**File**: `src/components/ui/WinModal.tsx`

Add prop and display for floor bonus:
```typescript
export interface WinModalProps {
  tilesRevealed: number;
  goldCollected: number;
  monstersAvoided: number;
  floorBonus: number;  // New prop
  onContinue: () => void;
}
```

Display bonus in stats section.

#### E2. Update GameContainer to Pass Bonus

**File**: `src/components/game/GameContainer.tsx`

Calculate and pass floor bonus to WinModal:
```typescript
import { getFloorConfig } from '@/engine/difficulty';

// In render
const floorBonus = getFloorConfig(run.level).goldBonus;
<WinModal ... floorBonus={floorBonus} />
```

### Phase F: Verification

#### F1. Verify Buff Carryover

Test that player shields persist between floors:
1. Start new run
2. Add shields (via damage or future shop)
3. Complete floor
4. Verify shields remain on next floor

Current implementation stores shields in `player` state which persists across `startLevel` calls, so this should already work.

#### F2. Manual Testing

1. Complete floor 1, verify 10 gold bonus awarded
2. Complete floor 5, verify 50 gold bonus awarded
3. Verify grid sizes scale correctly
4. Verify monster counts scale correctly

## File Change Summary

### New Files (2)

```
src/engine/difficulty.ts
src/engine/__tests__/difficulty.test.ts
```

### Modified Files (5)

```
src/stores/gameStore.ts          - Use getFloorConfig, add gold bonus
src/types/game.ts                - Remove calculateLevelGridConfig
src/engine/index.ts              - Export difficulty module
src/components/ui/WinModal.tsx   - Display floor bonus
src/components/game/GameContainer.tsx - Pass floor bonus to WinModal
```

## Dependencies

No new npm dependencies required.

## Testing Strategy

1. **Unit Tests**: Test all scaling functions with known inputs
2. **Integration Tests**: Verify gameStore uses correct values
3. **Manual Testing**: Play through floors 1-10 to verify feel
4. **Regression Check**: Ensure existing gameplay unchanged

## Success Criteria

- [ ] `engine/difficulty.ts` exports DIFFICULTY_CONSTANTS
- [ ] `getFloorConfig(1)` returns 9x9, ~8 monsters, 10 gold
- [ ] `getFloorConfig(5)` returns 13x13, ~18 monsters, 50 gold
- [ ] `getFloorConfig(10)` returns 18x18, ~30 monsters, 100 gold
- [ ] Gold bonus displayed in WinModal
- [ ] Gold bonus added to player on floor completion
- [ ] Player shields persist between floors
- [ ] All unit tests pass
- [ ] TypeScript compiles with no errors
- [ ] `calculateLevelGridConfig` removed from types/game.ts
