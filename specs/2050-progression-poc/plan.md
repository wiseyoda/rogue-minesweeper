# Phase 2050: Progression POC - Implementation Plan

## Technical Context

### Current Architecture
- **State Management**: Zustand with immer middleware
  - `gameStore.ts` - Current run state (grid, player, phase)
  - `metaStore.ts` - Persistent progression (stats, upgrades, metaGold)
- **UI Components**: React with Panel wrapper for consistency
- **Persistence**: localStorage via Zustand persist middleware
- **Solver**: `src/engine/solver.ts` - constraint-based safe tile detection

### Key Files
| File | Purpose |
|------|---------|
| `src/stores/metaStore.ts` | Stats and upgrade persistence |
| `src/stores/gameStore.ts` | Run state and actions |
| `src/data/shopItems.ts` | Shop item definitions |
| `src/engine/solver.ts` | Auto-solve logic for safe tiles |
| `src/components/sidebar/Sidebar.tsx` | Main sidebar container |
| `src/components/ui/Panel.tsx` | Reusable panel component |

### Constitution Compliance Check
| Principle | Status | Notes |
|-----------|--------|-------|
| I. Information Is Power | PASS | Reveal Scroll provides information advantage |
| II. The Dungeon Is Alive | N/A | Not applicable this phase |
| III. Emergent Complexity | PASS | Building on established systems |
| IV. Resource Tension | PASS | Reveal Scroll is expensive, gold choices matter |
| V. Passive Mastery | PASS | No active abilities added |
| VI. Juice Is Holistic | PENDING | Stats display should feel satisfying |
| VII. Move Fast, Iterate Often | PASS | Produces playable build |

## Implementation Phases

### Phase A: Enhanced Stats Tracking (Foundation)
Extend `metaStore.ts` to track additional statistics.

**Changes to GameStats interface**:
```typescript
interface GameStats {
  highestLevelOverall: number;  // Existing
  maxGoldRun: number;           // Existing
  totalRuns: number;            // Existing (make required)
  totalGoldEarned: number;      // NEW: Lifetime gold
}
```

**Update `recordRunEnd` action** to track lifetime gold.

### Phase B: Reveal Scroll Shop Item
Add new shop item that uses solver logic.

**Item Definition** (`shopItems.ts`):
```typescript
{
  id: 'reveal-scroll',
  name: 'Reveal Scroll',
  description: 'Reveal all logically safe tiles',
  cost: 150,
  rarity: 'rare',
  apply: (state) => {
    state.nextLevelBuffs.revealScroll = true;
  },
}
```

**Integration Points**:
1. Add `revealScroll` buff to PlayerState.nextLevelBuffs
2. Add `useRevealScroll` action to gameStore
3. Trigger solver on buff activation at level start

### Phase C: HighScores Component
Create `src/components/ui/HighScores.tsx`.

**Data Requirements**:
- Best level reached (from metaStore.stats.highestLevelOverall)
- Best gold in single run (from metaStore.stats.maxGoldRun)
- Total runs (from metaStore.stats.totalRuns)
- Total gold earned (from metaStore.stats.totalGoldEarned)

**UI Design**:
- Panel wrapper for consistency
- Compact stat rows with icons
- Trophy icon for "Best" values
- Gold coin icon for gold stats

### Phase D: RunStats Component
Create `src/components/ui/RunStats.tsx`.

**Data Requirements**:
- Current level (from gameStore.run.level)
- Current gold (from gameStore.player.gold)
- Personal best comparison (from metaStore.stats)

**UI Design**:
- Compact inline display
- Comparison arrows (green up, red down)
- Integrates into Sidebar between VitalsPanel and RunesPanel

### Phase E: Integration & Polish
1. Add RunStats to Sidebar
2. Add HighScores access (button or menu)
3. Verify complete game loop works
4. Test persistence across browser refresh

## Detailed Design

### A. Stats Enhancement

**File**: `src/types/game.ts`
- Make `totalRuns` required
- Add `totalGoldEarned: number`

**File**: `src/stores/metaStore.ts`
- Update `recordRunEnd` to accumulate `totalGoldEarned`
- Initialize new field in `createDefaultGameStats`

### B. Reveal Scroll

**File**: `src/types/player.ts`
- Add `revealScroll?: boolean` to `NextLevelBuffs`

**File**: `src/data/shopItems.ts`
- Add reveal-scroll item definition

**File**: `src/stores/gameStore.ts`
- Add `applyRevealScroll` action using `findCertainMoves`
- Call in `startLevel` if buff is active

**Solver Integration**:
```typescript
applyRevealScroll: () => {
  const result = findCertainMoves(get().grid);
  for (const pos of result.safePositions) {
    get().revealCell(pos.row, pos.col);
  }
}
```

### C. HighScores Component

**File**: `src/components/ui/HighScores.tsx`
```typescript
export function HighScores() {
  const stats = useMetaStore((s) => s.stats);

  return (
    <Panel title="Hall of Fame">
      <StatRow icon={<TrophyIcon />} label="Best Floor" value={stats.highestLevelOverall} />
      <StatRow icon={<GoldIcon />} label="Best Gold Run" value={formatGold(stats.maxGoldRun)} />
      <StatRow icon={<ScrollIcon />} label="Total Runs" value={stats.totalRuns} />
      <StatRow icon={<CoinStackIcon />} label="Total Gold" value={formatGold(stats.totalGoldEarned)} />
    </Panel>
  );
}
```

### D. RunStats Component

**File**: `src/components/ui/RunStats.tsx`
```typescript
export function RunStats() {
  const level = useGameStore((s) => s.run.level);
  const gold = useGameStore((s) => s.player.gold);
  const bestLevel = useMetaStore((s) => s.stats.highestLevelOverall);
  const bestGold = useMetaStore((s) => s.stats.maxGoldRun);

  const levelComparison = level > bestLevel ? 'new-best' : level === bestLevel ? 'tied' : 'below';
  const goldComparison = gold > bestGold ? 'new-best' : 'below';

  return (
    <Panel size="compact">
      <ComparisonRow label="Floor" value={level} comparison={levelComparison} />
      <ComparisonRow label="Gold" value={gold} comparison={goldComparison} />
    </Panel>
  );
}
```

## Data Flow

### Reveal Scroll Flow
```
Shop Purchase → apply(state.nextLevelBuffs.revealScroll = true)
→ Continue to next level
→ startLevel() detects buff
→ Call applyRevealScroll()
→ findCertainMoves(grid) returns safePositions
→ revealCell for each position
→ Clear buff
```

### Stats Recording Flow
```
Player dies → GameOverModal → Continue button
→ recordRunEnd(level, gold)
→ Update highestLevelOverall if beaten
→ Update maxGoldRun if beaten
→ Increment totalRuns
→ Add gold to totalGoldEarned
→ Persist to localStorage
```

## Testing Strategy

### Unit Tests
- `metaStore.recordRunEnd` correctly updates all stats
- `findCertainMoves` integration with reveal scroll
- `HighScores` renders correct data
- `RunStats` shows correct comparisons

### Integration Tests
- Complete game loop: run → shop → continue → die → meta shop → new run
- Stats persist across browser refresh
- Reveal Scroll reveals correct tiles

### Manual Verification (USER GATE)
Per phase requirements, user must verify:
- [ ] Start new run
- [ ] Clear 5+ floors
- [ ] Shop works between floors
- [ ] Buy items, see effects
- [ ] Die correctly
- [ ] Meta shop appears
- [ ] Buy permanent upgrades
- [ ] New run starts
- [ ] Upgrades apply
- [ ] Can reach floor 10+
- [ ] High scores persist

## File Changes Summary

| File | Action | Changes |
|------|--------|---------|
| `src/types/game.ts` | Modify | Add totalGoldEarned, make totalRuns required |
| `src/types/player.ts` | Modify | Add revealScroll to NextLevelBuffs |
| `src/stores/metaStore.ts` | Modify | Update recordRunEnd, add totalGoldEarned |
| `src/data/shopItems.ts` | Modify | Add reveal-scroll item |
| `src/stores/gameStore.ts` | Modify | Add applyRevealScroll action, call in startLevel |
| `src/components/ui/HighScores.tsx` | Create | Stats dashboard component |
| `src/components/ui/RunStats.tsx` | Create | Current run comparison component |
| `src/components/sidebar/Sidebar.tsx` | Modify | Add RunStats integration |

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Solver reveals too many tiles | Solver already balanced - only deduces |
| Stats migrations | Initialize new fields with defaults |
| UI clutter in sidebar | Keep RunStats compact |

## Dependencies

- Existing Panel component
- Existing solver logic
- Existing shop system
- Existing metaStore persistence
