# Specification: Floor Progression

**Phase**: 2010
**Status**: Draft
**Created**: 2026-01-15

---

## Overview

Extract floor progression scaling logic into a dedicated module and add floor completion bonuses. Most infrastructure already exists in `types/game.ts` and `gameStore.ts` - this phase refactors for maintainability and adds missing gold bonus functionality.

**Discovery Finding**: Existing `calculateLevelGridConfig()` already implements grid/monster scaling. This phase extracts it to `engine/difficulty.ts` for centralized tuning and adds floor completion rewards.

---

## Goals

1. **Centralized Difficulty**: Extract all scaling constants to `engine/difficulty.ts`
2. **Floor Bonuses**: Award gold bonus when completing a floor
3. **Buff Carryover**: Verify and document that buffs persist between floors
4. **Damage Prep**: Add interface for monster damage scaling (not implemented yet)

---

## User Scenarios & Testing

### User Story 1 - Floor Completion Bonus (Priority: P1)

Player clears all safe tiles on a floor and receives a gold bonus before advancing.

**Why this priority**: Core progression reward - players need incentive beyond per-tile gold.

**Independent Test**: Complete floor 1, verify gold increased by bonus amount before level 2 starts.

**Acceptance Scenarios**:

1. **Given** player on floor 1 with 50 gold, **When** all safe tiles revealed, **Then** player receives 10 gold bonus (level * 10) and gold shows 60+
2. **Given** player on floor 5, **When** floor cleared, **Then** gold bonus is 50 (5 * 10)
3. **Given** player completes floor, **When** WinModal displays, **Then** bonus is shown in stats

---

### User Story 2 - Progressive Difficulty (Priority: P1)

Each floor increases in size and monster count, making the game progressively harder.

**Why this priority**: Core roguelike loop - difficulty must scale to maintain challenge.

**Independent Test**: Start new run, compare floor 1 grid vs floor 5 grid sizes.

**Acceptance Scenarios**:

1. **Given** floor 1, **When** level starts, **Then** grid is 9x9 with ~8 monsters
2. **Given** floor 5, **When** level starts, **Then** grid is 13x13 with ~18 monsters
3. **Given** floor 10, **When** level starts, **Then** grid is 18x18 with ~30 monsters

---

### User Story 3 - Buff Persistence (Priority: P2)

Player's active buffs carry over between floors, maintaining strategic choices.

**Why this priority**: Buffs from shop purchases must persist to have value.

**Independent Test**: Start floor with shield buff active, complete floor, verify buff still active on next floor.

**Acceptance Scenarios**:

1. **Given** player has 2 shields on floor 1, **When** floor completed, **Then** shields remain at 2 on floor 2
2. **Given** player purchased buff in shop, **When** next floor starts, **Then** buff is still active

---

### Edge Cases

- What happens at floor 20+ when grid caps at max size?
  - Grid stays at 20x30, monster count at 30% cap
- How does damage taken affect floor bonus?
  - No effect - bonus is based purely on floor number
- What if player has 0 gold when completing floor?
  - Bonus still awarded, gold becomes positive

---

## Requirements

### Functional Requirements

- **FR-001**: System MUST extract scaling logic to `engine/difficulty.ts` module
- **FR-002**: System MUST award gold bonus of `level * 10` on floor completion
- **FR-003**: System MUST preserve player buffs (shields, active effects) between floors
- **FR-004**: System MUST expose `FloorConfig` interface for all floor parameters
- **FR-005**: System MUST provide `getFloorConfig(level)` function for scaling calculations
- **FR-006**: System MUST define `MonsterDamageConfig` interface for future damage scaling

### Key Entities

- **FloorConfig**: Encapsulates all per-floor parameters (rows, cols, monsterCount, goldBonus)
- **DifficultyConstants**: Tunable constants for scaling formulas (baseGridSize, gridGrowth, monsterGrowth, etc.)

---

## Technical Requirements

### TR-1: New Files

| File | Description |
|------|-------------|
| `src/engine/difficulty.ts` | Scaling calculations and constants |
| `src/engine/__tests__/difficulty.test.ts` | Unit tests for scaling |

### TR-2: Modified Files

| File | Changes |
|------|---------|
| `src/stores/gameStore.ts` | Import from difficulty.ts, add gold bonus on floor clear |
| `src/types/game.ts` | Remove `calculateLevelGridConfig` (moved to engine) |
| `src/components/ui/WinModal.tsx` | Display gold bonus in stats |

### TR-3: Difficulty Module API

```typescript
// src/engine/difficulty.ts

/** Tunable constants for difficulty scaling */
export const DIFFICULTY_CONSTANTS = {
  baseGridSize: 8,
  maxGridRows: 20,
  maxGridCols: 30,
  gridGrowthPerLevel: 1,

  baseMonsterCount: 5,
  monsterGrowthPerLevel: 2.5,
  maxMonsterDensity: 0.3,

  goldBonusPerLevel: 10,

  // Future: damage scaling
  baseDamage: 1,
  damageGrowthPerLevel: 0,
} as const;

/** Floor configuration returned by getFloorConfig */
export interface FloorConfig {
  rows: number;
  cols: number;
  monsterCount: number;
  goldBonus: number;
}

/** Future: monster damage configuration */
export interface MonsterDamageConfig {
  baseDamage: number;
  scaledDamage: number;
}

/** Calculate floor configuration for a given level */
export function getFloorConfig(level: number): FloorConfig;

/** Calculate monster damage for a given level (prep for future) */
export function getMonsterDamage(level: number): MonsterDamageConfig;
```

### TR-4: gameStore Integration

```typescript
// In startLevel or win handler
const config = getFloorConfig(level);
// Use config.rows, config.cols, config.monsterCount for grid

// On floor completion
const floorBonus = getFloorConfig(run.level).goldBonus;
set((state) => {
  state.player.gold += floorBonus;
});
```

---

## Non-Functional Requirements

### NFR-1: Type Safety

- All functions fully typed with TypeScript
- FloorConfig and constants exported for type consumers
- No `any` types

### NFR-2: Test Coverage

- Unit tests for `getFloorConfig` at levels 1, 5, 10, 20
- Test edge cases (level 0, level 100)
- Test gold bonus calculation

### NFR-3: Maintainability

- All tunable values in `DIFFICULTY_CONSTANTS` object
- Easy to adjust balance through constant changes
- Clear documentation of scaling formulas

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: All scaling logic consolidated in single `difficulty.ts` file
- **SC-002**: Floor completion awards correct gold bonus (verifiable in UI)
- **SC-003**: Player shields persist between floors (verifiable through gameplay)
- **SC-004**: Unit tests cover all scaling edge cases (100% function coverage)

---

## Constraints

1. **No gameplay changes**: Scaling formulas match existing behavior
2. **No UI redesign**: Only update WinModal to show bonus
3. **Damage prep only**: `getMonsterDamage` returns base damage (no scaling yet)

---

## Out of Scope

- Shop UI (Phase 2020)
- Meta progression/permanent upgrades (Phase 2030)
- Actual monster damage scaling (future milestone)
- New buff types or effects
- Floor transition animations

---

## Acceptance Criteria

- [ ] `engine/difficulty.ts` created with exported constants and functions
- [ ] `getFloorConfig(level)` returns correct values for levels 1-20
- [ ] `DIFFICULTY_CONSTANTS` object contains all tunable values
- [ ] `gameStore.ts` imports and uses difficulty functions
- [ ] Gold bonus awarded on floor completion
- [ ] WinModal shows gold bonus in stats
- [ ] Player shields carry over between floors
- [ ] Unit tests pass for difficulty calculations
- [ ] TypeScript compiles with strict mode
- [ ] `calculateLevelGridConfig` removed from types/game.ts

---

## Dependencies

### Uses
- `@/types` - Grid, PlayerState types
- `@/stores/gameStore` - Integration point

### Used By
- Phase 2020 (Floor Shop) - Will use FloorConfig for shop offerings
- Phase 5040 (Boss Encounters) - Will use damage scaling

---

## Constitution Compliance

| Principle | Impact | Notes |
|-----------|--------|-------|
| VII. Move Fast | High | Centralized constants enable rapid balance tuning |
| IV. Resource Tension | Medium | Gold bonus adds reward layer to progression |
| I. Grid Foundation | Low | Maintains minesweeper core, just better organized |

No violations. This is refactoring plus one new feature (gold bonus).
