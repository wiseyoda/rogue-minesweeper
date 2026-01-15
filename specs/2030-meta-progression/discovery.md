# Discovery: Phase 2030 - Meta Progression

## Codebase Examination Summary

### Existing Infrastructure Found

**Meta Store (`src/stores/metaStore.ts`)**
The meta store already has comprehensive infrastructure for permanent upgrades:
- Uses Zustand with `persist` middleware (localStorage)
- Has `PermanentUpgradeRegistry` for storing purchased upgrades
- `purchaseUpgrade(id)` action for buying upgrades
- `applyAllUpgrades()` action to apply effects at run start
- Types support both `LeveledUpgrade` (multiple purchases) and `UnlockableUpgrade` (one-time)
- Cost calculation with `getUpgradeCost()` utility function

**Upgrade Type System (`src/types/shop.ts`)**
Well-defined discriminated union:
- `LeveledUpgrade`: level, maxLevel, costIncrease multiplier
- `UnlockableUpgrade`: simple boolean unlocked flag
- `apply(stats: PlayerStats)` function on each upgrade
- `canPurchaseUpgrade()` utility for validation

**Player Stats (`src/types/player.ts`)**
Current permanent stats structure:
```typescript
interface PlayerStats {
  maxLives: number;     // Default: 3
  startingGold: number; // Default: 0
  firstClickSafety: boolean; // Default: false
}
```

**Game Stats (`src/types/game.ts`)**
Tracked across runs:
- `highestLevelOverall`
- `maxGoldRun`
- `totalRuns` (optional)
- `totalDeaths` (optional)

### Integration Points Identified

1. **Game Store (`src/stores/gameStore.ts:50-60`)**
   - `startNewRun()` currently uses `createDefaultPlayerStats()`
   - Comment notes: "In future, get playerStats from metaStore"
   - Need to integrate `useMetaStore().playerStats` here

2. **Game Over Flow (`src/components/ui/GameOverModal.tsx`)**
   - Shows run stats: level, gold, tiles, monsters, damage
   - "Try Again" button triggers `onRetry`
   - Need to add upgrade shop phase before retry

3. **Game Phase System (`src/types/game.ts`)**
   - Already has `GamePhase = 'upgradeShop'` defined
   - Not yet implemented in game flow

### Gap Analysis

**What exists:**
- Type definitions for permanent upgrades
- Meta store with persistence
- Purchase and apply logic
- Player stats affected by upgrades

**What's missing:**
1. **Upgrade definitions**: No actual upgrade data (Vitality, Fortune, etc.)
2. **Upgrade initialization**: Upgrades registry is empty by default
3. **Integration**: gameStore doesn't read from metaStore yet
4. **UI component**: No UpgradeShopModal component
5. **Flow integration**: upgradeShop phase not triggered after death
6. **Gold deduction**: purchaseUpgrade doesn't deduct gold

### Phase Scope Clarifications

From phase file, intended upgrades:
| Upgrade | Cost | Effect | Max Level |
|---------|------|--------|-----------|
| Vitality | 100g | +1 starting Max HP | 3 |
| Fortune | 150g | +10% gold find | 5 |
| Preparation | 200g | Start with random buff | 3 |
| Resilience | 250g | +1 starting shield | 2 |
| First Click Safety | 300g | First click never monster | 1 |

**Note:** "Fortune" (+10% gold find) and "Preparation" (random buff) require mechanics not yet implemented:
- Gold find multiplier doesn't exist in PlayerStats
- Random buff application needs new system

## User Intent Confirmation

Based on codebase analysis, this phase requires:
1. Creating upgrade definitions in `src/data/permanentUpgrades.ts`
2. Extending `PlayerStats` for new stats (goldFindBonus, startingShields)
3. Updating metaStore to initialize with defined upgrades
4. Wiring gameStore.startNewRun() to use metaStore.playerStats
5. Adding gold deduction to purchase flow
6. Creating UpgradeShopModal UI component
7. Triggering upgradeShop phase on death

## Clarifications Confirmed

**Gold Find Mechanic (Fortune upgrade)**
- Applies to ALL gold sources: tile reveals, monster drops (future), any gold gain
- Add `goldFindBonus: number` to PlayerStats (default: 0)
- Apply multiplier: `gold * (1 + goldFindBonus)` in all gold-granting code

**Preparation Buff Pool**
- Draw from nextLevelBuffs only: goldMagnet, shields, revealTiles
- Each level adds 1 random buff at run start
- These buffs already integrate with existing systems

**Shop Flow**
- Always show after death: GameOver -> UpgradeShop -> Try Again
- Players must acknowledge upgrade shop before retrying
- Builds familiarity with meta progression system
