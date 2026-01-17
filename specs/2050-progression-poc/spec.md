# Phase 2050: Progression POC - Specification

## Overview

**Goal**: Complete playable roguelike loop with all progression systems integrated.

**Constitution Alignment**: Completes Phase 1 (Core Loop) per Constitution development phases. Implements Resource Tension (Principle IV) through meaningful gold spending, and Move Fast, Iterate Often (Principle VII) by producing a fully playable build.

## User Stories

### US-1: Stats Dashboard
**As a** player completing runs
**I want** to see my best performances displayed
**So that** I can track my progress and have goals to beat

**Acceptance Criteria**:
- High score display shows best level reached
- Best gold collected shown
- Total runs tracked
- Stats persist across browser sessions

### US-2: Run Stats Display
**As a** player during a run
**I want** to see my current run statistics
**So that** I know how well I'm doing compared to previous attempts

**Acceptance Criteria**:
- Current level displayed
- Gold collected this run shown
- Can compare to personal best inline

### US-3: Reveal Scroll Item
**As a** player in the floor shop
**I want** to purchase a Reveal Scroll
**So that** I can safely reveal tiles that are logically deducible

**Acceptance Criteria**:
- Reveal Scroll available in shop (rare, expensive)
- Uses same solver logic as auto-solve
- Reveals only deducible tiles (not entire board)
- Single use per purchase

### US-4: Complete Game Loop
**As a** player
**I want** the entire roguelike loop to work seamlessly
**So that** I experience the "one more run" feeling

**Acceptance Criteria**:
- Start run → Floor 1
- Clear floor → Floor shop → Continue
- Die → Game over stats → Meta shop
- Purchase upgrades → Start new run
- Upgrades apply correctly
- High scores update on run end

## Functional Requirements

### FR-1: HighScores Component
Create `src/components/ui/HighScores.tsx`:
- Display best level reached
- Display max gold in single run
- Display total runs completed
- Styled with Panel wrapper for consistency
- Accessible from sidebar or main menu

### FR-2: RunStats Component
Create `src/components/ui/RunStats.tsx`:
- Display current level
- Display current gold
- Show comparison indicator to personal best
- Compact design for sidebar integration
- Note: Lives/shields already shown in VitalsPanel

### FR-3: Reveal Scroll Shop Item
Add to `src/data/shopItems.ts`:
```typescript
{
  id: 'reveal-scroll',
  name: 'Reveal Scroll',
  description: 'Reveal all logically safe tiles',
  cost: 150,  // Expensive
  rarity: 'rare',
  apply: (state) => {
    // Set buff to trigger solver at level start
    state.nextLevelBuffs.revealScroll = true;
  }
}
```
Note: Shop already limits to 1 purchase per visit via purchasedIds tracking.

### FR-4: Solver Integration
Connect Reveal Scroll to existing solver logic:
- Location: `src/engine/solver.ts`
- Behavior: Same as dev auto-solve button
- Reveals tiles that can be logically deduced as safe
- Does NOT reveal entire board

### FR-5: Enhanced Stats Tracking
Extend `src/stores/metaStore.ts` GameStats:
```typescript
interface GameStats {
  highestLevelOverall: number;
  maxGoldRun: number;
  totalRuns: number;
  totalGoldEarned: number;  // Lifetime gold
  averageLevel?: number;    // Optional
  bestStreak?: number;      // Optional: consecutive floors without damage
}
```

## Non-Functional Requirements

### NFR-1: Persistence
All stats must persist via localStorage using Zustand persist middleware.

### NFR-2: Performance
Stats calculations should not impact gameplay performance.

### NFR-3: UI Consistency
All new components must use existing Panel wrapper and design system colors.

## Technical Approach

### Stats Dashboard
1. Create HighScores component with Panel wrapper
2. Subscribe to metaStore for stats data
3. Format numbers with thousands separators
4. Add subtle animations for personal best indicators

### Run Stats
1. Create compact RunStats component
2. Subscribe to gameStore for current run data
3. Show comparison arrows (up/down) vs personal best
4. Integrate into Sidebar component

### Reveal Scroll
1. Add item definition to shopItems.ts
2. Add `useRevealScroll` action to gameStore
3. Connect to solver.runSolver() for tile deduction
4. Update UI to show scroll in inventory/buffs

### Integration Points
- `FloorShop.tsx` - Reveal Scroll appears in shop
- `Sidebar.tsx` - RunStats integration
- `GamePage.tsx` or menu - HighScores access
- `metaStore.ts` - Enhanced stats tracking

## Out of Scope
- Leaderboards (multiplayer feature, future phase)
- Achievement system (future phase)
- Sound effects (phase 6020)
- Damage scaling with level
- Run replay functionality

## Dependencies
- Existing solver logic in `src/engine/solver.ts`
- Existing shop system in `src/components/shop/`
- Existing meta store in `src/stores/metaStore.ts`
- Panel component for UI consistency

## Risks & Mitigations
| Risk | Mitigation |
|------|------------|
| Solver reveals too many tiles | Already balanced - only reveals logical deductions |
| Stats UI too busy | Keep RunStats compact, HighScores separate |
| localStorage quota | Stats are small, not a concern |

## Success Metrics
- User can complete 10+ runs without encountering bugs
- High scores persist across browser refresh
- "One more run" feeling emerges through play
- Reveal Scroll feels powerful but fair
