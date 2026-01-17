# Discovery: Phase 0020 - Core Types

> **Phase**: 0020 - core-types
> **Goal**: Define all TypeScript types for the game domain
> **Status**: Discovery Complete

---

## Codebase Examination

### Existing Implementation (POC)

The archived POC in `.archive/poc/` uses plain JavaScript with implicit types. Key findings:

#### 1. Cell/Tile Structure (from `game.js:117-131`)
```javascript
{
  isMonster: false,
  isRevealed: false,
  isFlagged: false,
  isQuestion: false,
  isExit: false,
  adjacentMonsters: 0,
}
```

#### 2. Player/Run State (from `state.js:21-40`)
```javascript
{
  level: 1,
  lives: playerStats.maxLives,
  shields: 0,
  gold: playerStats.startingGold,
  gameOver: false,
  grid: [],
  rows: 0,
  cols: 0,
  monsterCount: 0,
  revealedCount: 0,
  flagsPlaced: 0,
  activeBuffs: {},
  nextLevelBuffs: {},
  damageTakenThisLevel: false,
  isFirstClick: true,
  goldInterval: null,
}
```

#### 3. Permanent Stats (from `state.js:6-10`)
```javascript
{
  maxLives: 3,
  startingGold: 0,
  firstClickSafety: false,
}
```

#### 4. Game Statistics (from `state.js:15-18`)
```javascript
{
  highestLevelOverall: 1,
  maxGoldRun: 0,
}
```

#### 5. Buff System
- **Active Buffs**: Apply during current level (`extraLife`, `goldenGoose`, `goldMagnet`, `steadyHand`, `forcefield`, `scrapMetal`, `shieldBattery`)
- **Next Level Buffs**: Apply at start of next level (`revealTiles`, `shields`, `masterGoggles`, `monsterTracker`, `eliteMonsterTracker`, `monsterRepellent`)

#### 6. Shop Items (from `temporaryItems.js`)
- Rarities: `common`, `uncommon`, `rare`, `legendary`
- Each item has: `id`, `name`, `description`, `cost`, `apply()` function

#### 7. Permanent Upgrades (from `permanentUpgrades.js`)
- Two types:
  - **Leveled**: Has `level`, `maxLevel`, `baseCost`, `costIncrease`
  - **Unlockable**: Has `unlocked: boolean`, `baseCost`

---

## Architecture Patterns (from memory docs)

### From `game-design.md`
- Monster interface with tiers: `1 | 2 | 3 | 'boss'`
- Monster abilities and movement patterns (Phase 4+)
- Rune categories: Information, Defense, Economy, Utility
- Rune rarities: Common, Uncommon, Rare, Legendary

### From `tech-stack.md`
- Zustand store slices: `gameStore`, `metaStore`, `dungeonStore`, `uiStore`
- AI context types: `DungeonMasterContext`, `DungeonMasterResponse`
- Type file organization: `types/game.ts`, `types/monsters.ts`, `types/runes.ts`, `types/ai.ts`

### From `constitution.md`
- Passive-only abilities (no active skills)
- Information-based rune effects
- Three progression tiers: Floor, Run, Permanent

---

## Type Categories Identified

Based on codebase analysis and memory docs:

### 1. Cell Types (`cell.ts`)
- `Cell` - Individual tile state
- `CellState` - Visual/interaction states

### 2. Grid Types (`grid.ts`)
- `Grid` - 2D array of cells
- `GridConfig` - Size, monster count, difficulty

### 3. Player Types (`player.ts`)
- `PlayerState` - HP, shields, gold, buffs
- `PlayerStats` - Permanent upgrades

### 4. Monster Types (`monster.ts`)
- `Monster` - Static monster definition
- `MonsterTier` - Tier enum/union
- Placeholder for movement (Phase 4)

### 5. Item/Buff Types (`item.ts`)
- `Buff` - Active/next-level effects
- `BuffType` - Union of all buff keys
- `ShopItem` - Purchasable items
- `ItemRarity` - Rarity tier

### 6. Shop Types (`shop.ts`)
- `PermanentUpgrade` - Meta upgrades
- `TemporaryItem` - Per-run items

### 7. Game Types (`game.ts`)
- `GameSession` - Current run state
- `RunStats` - Statistics for current run
- `GamePhase` - Playing, Shopping, GameOver

---

## Constraints Discovered

1. **Strict TypeScript** - `noUncheckedIndexedAccess` enabled, need careful array/object access
2. **No `any`** - All types must be explicit per phase requirements
3. **JSDoc comments** - Required for all exported types
4. **POC compatibility** - Types must model existing functionality first
5. **Future-proofing** - Placeholder types for Runes, AI DM, Moving Monsters

---

## Questions Resolved

This phase is well-defined with clear scope from the phase details and POC code. The types needed are straightforward extractions from existing JavaScript with TypeScript refinements.

No clarifying questions needed - proceeding to SPECIFY.

---

## Dependencies

- Phase 0010 (project-setup) - Complete
- TypeScript strict mode configured - Verified

## Next Steps

1. Create spec.md with detailed type specifications
2. Map POC concepts to typed interfaces
3. Include discriminated unions where appropriate
4. Add placeholder types for future phases
