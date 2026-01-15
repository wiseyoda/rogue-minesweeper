# Discovery: Phase 2010 - Floor Progression

## Codebase Findings

### Existing Level/Floor Infrastructure

The game already has significant floor progression infrastructure:

1. **Grid Scaling** - `src/types/game.ts:103-112`
   - `calculateLevelGridConfig(level)` already implements scaling
   - Level 1: 9x9, 5 monsters → Level 10: 18x18, 30 monsters
   - Grid capped at 20x30, monsters at 30% of tiles

2. **Level Transitions** - `src/stores/gameStore.ts`
   - `startLevel(level)` initializes new levels with scaling
   - `startNewRun()` resets for fresh runs
   - Win condition transitions to 'shopping' phase automatically

3. **Win Condition** - `src/engine/win-condition.ts`
   - Detects when all safe tiles revealed
   - Returns `{isWon, remainingMonsters}` for UI display

4. **UI Transitions** - `src/components/game/GameContainer.tsx`
   - WinModal shows on level complete
   - "Continue" button calls `startLevel(run.level + 1)`
   - GameOverModal for death → retry flow

### What's Already Working

| Feature | Status | Location |
|---------|--------|----------|
| Grid scaling by level | ✅ Implemented | `types/game.ts` |
| Level advancement | ✅ Implemented | `gameStore.ts` |
| Win detection | ✅ Implemented | `engine/win-condition.ts` |
| Level complete UI | ✅ Implemented | `GameContainer.tsx` |
| Monster density scaling | ✅ Implemented | `calculateLevelGridConfig` |
| Gold per tile | ✅ Implemented | `gameStore.ts:92` |

### What Needs Work (Per Phase Scope)

| Feature | Status | Notes |
|---------|--------|-------|
| Monster damage scaling | ❌ Not implemented | All monsters do fixed damage |
| Gold bonus per floor | ❌ Not implemented | Only tile-by-tile gold |
| Buff carryover | ⚠️ Partial | Buffs exist but not tested |
| Difficulty constants file | ❌ Not implemented | Inline in `calculateLevelGridConfig` |
| Floor transition engine | ❌ Not implemented | Logic spread across files |

### Current Scaling Formula

```typescript
// From src/types/game.ts
rows = Math.min(8 + level, 20)       // 9 at L1, 18 at L10, cap 20
cols = Math.min(8 + level, 30)       // 9 at L1, 18 at L10, cap 30
monsters = Math.min(
  5 + Math.floor(level * 2.5),       // 5 at L1, 30 at L10
  Math.floor(rows * cols * 0.3)      // 30% cap
)
```

### Phase Scope Analysis

The phase file specifies:
- Level advancement on floor clear ✅ (exists)
- Grid scaling ✅ (exists)
- Monster density scaling ✅ (exists)
- Monster damage scaling (future prep) - needs work
- Gold reward per floor - needs work
- Buff carryover between floors - needs verification

**Assessment**: Most infrastructure exists. This phase is primarily:
1. Extracting scaling to a dedicated `difficulty.ts` module
2. Adding floor completion bonuses
3. Verifying buff carryover
4. Adding damage scaling foundation

### Key Integration Points

1. **gameStore.ts** - Will call new difficulty functions
2. **types/game.ts** - May move scaling functions out
3. **New: engine/difficulty.ts** - Centralized scaling logic
4. **New: engine/floor-transition.ts** - Floor completion bonuses

### Questions for Clarification

1. **Damage Scaling**: The phase mentions "Monster damage scaling (future prep)" - should monsters do more damage at higher floors in this phase, or just prepare the interface?

2. **Gold Bonus Formula**: Phase suggests `goldBonus = level * 10`. Is this bonus per floor completion, or does it modify per-tile gold?

3. **Buff Carryover**: Currently buffs are player state. Should any buffs expire between floors, or all carry over?
