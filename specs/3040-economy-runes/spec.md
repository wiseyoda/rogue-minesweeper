# Specification: 3040 - Economy Runes

**Phase**: 3040-economy-runes
**Status**: Draft
**Created**: 2026-01-17

---

## Overview

Implement four new economy-focused runes that affect gold generation and shop pricing, plus the necessary infrastructure to support shop discounts and price modifications.

### Goals

1. Add variety to economy-based build strategies
2. Create meaningful trade-offs with Golden Goose
3. Enable "gold farming" playstyles through rune synergies
4. Extend the passive rune modifier system for shop pricing

### Non-Goals

- Active abilities (violates Constitution Principle V)
- Changes to existing Midas Touch rune
- New shop items or meta-progression changes

---

## User Stories

### US-01: Gold-Focused Build

**As a** player who enjoys accumulating resources,
**I want** runes that increase my gold income,
**So that** I can afford more items and runes each run.

**Acceptance Criteria**:
- [ ] Lucky Coin provides chance to double gold per tile
- [ ] Lucky Coin stacks for higher proc chance
- [ ] Golden Goose doubles all gold earned

### US-02: Budget Shopper Build

**As a** player who likes shopping for deals,
**I want** runes that reduce shop prices,
**So that** I can stretch my gold further.

**Acceptance Criteria**:
- [ ] Bargain Hunter reduces all shop prices by 10%
- [ ] Bargain Hunter stacks (20%, 30%, etc.)
- [ ] Discount applies to items, runes, and rerolls

### US-03: Risk/Reward Trade-off

**As a** player who enjoys high-risk strategies,
**I want** a powerful rune with a significant downside,
**So that** I can make interesting strategic choices.

**Acceptance Criteria**:
- [ ] Golden Goose provides +100% gold
- [ ] Golden Goose increases all shop prices by 50%
- [ ] Net effect is profitable but creates tension

### US-04: Floor Completion Bonuses

**As a** player progressing through floors,
**I want** chances for bonus gold rewards,
**So that** I feel rewarded for completing floors.

**Acceptance Criteria**:
- [ ] Treasure Hunter has 20% chance per floor for gold cache
- [ ] Treasure Hunter stacks for higher proc chance
- [ ] Gold cache amount scales with floor level

---

## Rune Specifications

### Lucky Coin

| Property | Value |
|----------|-------|
| ID | `lucky-coin` |
| Category | Economy |
| Rarity | Common |
| Cost | 25g |
| Stackable | Yes |
| Icon | `<coin emoji>` |
| Trigger | onReveal |
| Effect | 10% chance per tile to double gold output |

**Implementation Notes**:
- Triggers per individual tile revealed (not per click)
- With cascade reveals, each tile rolls independently
- Stackable: 2 runes = 20% chance, 3 runes = 30% chance
- Doubles the 1g base gold (becomes 2g for that tile)

### Bargain Hunter

| Property | Value |
|----------|-------|
| ID | `bargain-hunter` |
| Category | Economy |
| Rarity | Common |
| Cost | 30g |
| Stackable | Yes |
| Icon | `<tag/label emoji>` |
| Trigger | Passive |
| Effect | 10% discount on all shop prices |

**Implementation Notes**:
- Adds `shopDiscount` to RuneModifiers
- Applies to: shop items, rune purchases, reroll costs
- Stackable: 2 runes = 20% discount, 3 runes = 30% discount
- Minimum price: 1g (can't go negative)
- Calculated after Golden Goose price increase

### Treasure Hunter

| Property | Value |
|----------|-------|
| ID | `treasure-hunter` |
| Category | Economy |
| Rarity | Uncommon |
| Cost | 45g |
| Stackable | Yes |
| Icon | `<treasure/chest emoji>` |
| Trigger | onFloorStart (next floor) |
| Effect | 20% chance for gold cache bonus |

**Implementation Notes**:
- Triggers immediately after floor completion (before shopping phase transition)
- Gold cache = 10-25% of floor bonus (random within range)
  - Level 5 floor bonus = 50g, cache = 5-12g
- Stackable: 2 runes = 40% chance, 3 runes = 60% chance
- Displays immediate notification when cache triggers ("Treasure Cache! +Xg")

### Golden Goose

| Property | Value |
|----------|-------|
| ID | `golden-goose` |
| Category | Economy |
| Rarity | Legendary |
| Cost | 100g |
| Stackable | No |
| Icon | `<goose/gold emoji>` |
| Trigger | Passive |
| Effect | +100% gold, +50% shop prices |

**Implementation Notes**:
- Adds +1.0 to `goldMultiplier` (total 2.0 = double gold)
- Adds +0.5 to new `shopPriceIncrease` modifier
- Non-stackable (one per build)
- Applied before Bargain Hunter discount
- Order: base price * (1 + shopPriceIncrease) * (1 - shopDiscount)

---

## Technical Changes

### RuneModifiers Extension

Add to `src/types/rune.ts`:

```typescript
interface RuneModifiers {
  // Existing fields...
  shopDiscount: number;       // 0.0 = no discount, 0.1 = 10% off
  shopPriceIncrease: number;  // 0.0 = no increase, 0.5 = +50%
}
```

Note: Treasure Hunter uses a separate `checkTreasureCache()` function rather than a modifier field.

### Price Calculation

New utility function for shop pricing:

```typescript
function calculatePrice(
  basePrice: number,
  modifiers: RuneModifiers
): number {
  const increased = basePrice * (1 + modifiers.shopPriceIncrease);
  const discounted = increased * (1 - modifiers.shopDiscount);
  return Math.max(1, Math.floor(discounted));
}
```

### Gold Doubling (Lucky Coin)

Add to `applyOnRevealRunes()` or create new return value:

```typescript
interface OnRevealResult {
  grid: Grid;
  bonusTilesRevealed: number;
  goldBonus: number;  // NEW: Lucky Coin bonus gold
}
```

### Treasure Cache

Add to shop transition logic:

```typescript
interface TreasureCacheResult {
  triggered: boolean;
  goldAmount: number;
}
```

---

## UI Considerations

### Shop Price Display

- Show original price with strikethrough if discounted
- Show modified price in gold color
- Example: `~~30g~~ 27g` (with Bargain Hunter)

### Gold Notifications

- Lucky Coin proc: Brief "+2g" float on tile
- Treasure Cache: Modal or banner "Treasure Cache! +25g"

### Golden Goose Warning

- Tooltip should clearly explain trade-off
- Consider color coding (gold + red) for dual nature

---

## Constitution Alignment

| Principle | Alignment |
|-----------|-----------|
| I. Information Is Power | Neutral - economy runes don't affect information |
| II. The Dungeon Is Alive | N/A |
| III. Emergent Complexity | Aligned - adds strategic depth through rune synergies |
| IV. Resource Tension | **Strongly aligned** - creates meaningful gold decisions |
| V. Passive Mastery | **Strongly aligned** - all effects are passive |
| VI. Juice Is Holistic | Needs visual feedback for procs |
| VII. Move Fast | Keep implementation simple, iterate |

---

## Test Coverage Required

1. **Unit Tests** (`src/engine/__tests__/economyRunes.test.ts`)
   - Lucky Coin proc chance calculation
   - Bargain Hunter discount stacking
   - Treasure Hunter cache generation
   - Golden Goose dual modifier
   - Price calculation with multiple modifiers

2. **Integration Tests**
   - Shop item purchase with discount
   - Rune purchase with discount
   - Reroll cost with discount
   - Gold accumulation with Lucky Coin
   - Multiple economy runes combined

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Economy inflation | Trivializes shop decisions | Tune gold cache amount, cap discount |
| Golden Goose too strong | Always-pick legendary | 50% price increase creates real cost |
| Lucky Coin variance | Feast/famine gameplay | Per-tile rolls smooth out over floor |
| Stacking too powerful | 3x Bargain Hunter = 30% off | Acceptable - uses all rune slots |

---

## Dependencies

- None - builds on existing rune infrastructure
- Existing: Midas Touch implementation (no changes)
- Existing: Shop system (needs price modification hooks)
