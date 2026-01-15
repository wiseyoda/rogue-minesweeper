# Feature Specification: Meta Progression

**Phase**: 2030
**Status**: Draft
**Created**: 2026-01-15

---

## Overview

Implement permanent upgrades that persist across runs, allowing players to spend accumulated gold on lasting improvements to their starting stats.

### Goal

Enable meaningful meta-progression by allowing gold earned during runs to be spent on permanent upgrades that affect future runs.

### Success Criteria

- [ ] Upgrades persist in localStorage after page refresh
- [ ] Purchased upgrades apply automatically at run start
- [ ] Cannot exceed max level per upgrade type
- [ ] Stats track correctly (total runs, best floor)
- [ ] Gold properly deducted when purchasing upgrades

---

## User Stories

### US-1: View Available Upgrades

**As a** player who just died
**I want to** see what permanent upgrades I can purchase
**So that** I can spend my accumulated gold on lasting improvements

**Acceptance Criteria:**
- Upgrade shop displays after death (before Try Again)
- Each upgrade shows: name, description, current level, max level, cost
- Locked upgrades (at max level) are visually distinguished
- Current gold balance displayed prominently
- "Continue" button proceeds to Try Again/new run

### US-2: Purchase Upgrades

**As a** player with gold
**I want to** buy permanent upgrades
**So that** my next runs start stronger

**Acceptance Criteria:**
- Can purchase upgrade if: gold >= cost AND level < maxLevel
- Gold deducted immediately on purchase
- Level increments (or unlocks for one-time upgrades)
- Visual feedback on successful purchase
- Cannot purchase if insufficient gold or maxed

### US-3: Apply Upgrades at Run Start

**As a** player starting a new run
**I want** my purchased upgrades to take effect automatically
**So that** I benefit from my meta-progression investment

**Acceptance Criteria:**
- Vitality: Start with +1 Max HP per level (affects both maxLives and lives)
- Fortune: +10% gold find per level (multiplicative on all gold gains)
- Preparation: Apply 1 random buff per level at run start
- Resilience: Start with +1 shield per level
- First Click Safety: First click on monster flags instead of damages

### US-4: Persistent Statistics

**As a** returning player
**I want** my progress tracked across sessions
**So that** I can see my improvement over time

**Acceptance Criteria:**
- Total runs counter increments on each death
- Highest floor ever reached updates when beaten
- Max gold in a single run tracked
- Stats persist across browser sessions

---

## Functional Requirements

### FR-1: Upgrade Definitions

Create permanent upgrade data at `src/data/permanentUpgrades.ts`:

| ID | Name | Type | Base Cost | Max Level | Cost Increase | Effect |
|----|------|------|-----------|-----------|---------------|--------|
| vitality | Vitality | leveled | 100 | 3 | 2x | +1 maxLives |
| fortune | Fortune | leveled | 150 | 5 | 2x | +0.10 goldFindBonus |
| preparation | Preparation | leveled | 200 | 3 | 2x | +1 random buff |
| resilience | Resilience | leveled | 250 | 2 | 2x | +1 startingShields |
| firstClickSafety | First Click Safety | unlockable | 300 | 1 | - | firstClickSafety = true |

### FR-2: PlayerStats Extension

Extend `PlayerStats` interface:

```typescript
interface PlayerStats {
  maxLives: number;        // Default: 3, affected by Vitality
  startingGold: number;    // Default: 0 (unused currently)
  firstClickSafety: boolean; // Default: false, affected by First Click Safety
  goldFindBonus: number;   // NEW: Default: 0, affected by Fortune
  startingShields: number; // NEW: Default: 0, affected by Resilience
  preparationLevel: number; // NEW: Default: 0, for random buff count
}
```

### FR-3: Meta Store Integration

Update metaStore to:
1. Initialize with defined upgrades at startup
2. Track metaGold (gold available for upgrades)
3. Deduct gold when purchasing upgrades
4. Persist upgrade state and gold

### FR-4: Game Store Integration

Update gameStore.startNewRun() to:
1. Read playerStats from metaStore
2. Apply stats to initial player state
3. Call applyPreparationBuffs() for random buffs
4. Apply starting shields from Resilience

### FR-5: Gold Find Application

Update all gold-granting code to apply goldFindBonus:
- gameStore.revealCell(): Gold from safe tile reveals
- Any future gold sources (monster drops, etc.)

Formula: `finalGold = Math.floor(baseGold * (1 + goldFindBonus))`

### FR-6: Upgrade Shop UI

Create UpgradeShopModal component:
- Grid of upgrade cards
- Each card: icon, name, description, level indicator, cost
- Purchase button (disabled if can't afford or maxed)
- Gold balance display
- "Continue" button to proceed

### FR-7: Game Flow Integration

Modify death handling:
1. Player dies -> setPhase('gameOver')
2. GameOver shows -> record stats with recordRunEnd()
3. GameOver "Continue" -> setPhase('upgradeShop')
4. Upgrade shop "Continue" -> startNewRun()

---

## Non-Functional Requirements

### NFR-1: Persistence

- All upgrade data stored in localStorage via Zustand persist
- Storage key: 'dungeon-delver-meta' (existing)
- Survives browser close/refresh

### NFR-2: Performance

- Upgrade application at run start < 10ms
- No perceptible delay when purchasing upgrades

### NFR-3: Accessibility

- Upgrade cards keyboard navigable
- Clear visual states for purchasable/maxed/locked
- Color not sole indicator of state

---

## Technical Constraints

### TC-1: Existing Architecture

- Must integrate with existing Zustand store patterns
- Follow existing type patterns (discriminated unions)
- Match existing UI component patterns (dungeon theme)

### TC-2: Type Safety

- All upgrade effects must be type-safe
- No runtime type assertions for upgrade application
- Leverage existing type guards (isLeveledUpgrade, isUnlockableUpgrade)

---

## Out of Scope

- Unlock requirements for upgrades (all available from start)
- Upgrade tree/dependencies
- Visual effects for upgrade application
- Sound effects for purchases
- Undo/refund purchases

---

## Dependencies

- Phase 2010 (floor progression) - completed
- Phase 2020 (floor shop) - completed

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Breaking localStorage migration | Medium | High | Version localStorage schema, handle migration |
| Gold economy imbalance | Medium | Medium | Start conservative, can adjust costs later |
| Random buff feels unfair | Low | Low | Preparation buffs are all positive |

---

## Open Questions

None - all clarified during discovery phase.
