# Implementation Plan: 3040 - Economy Runes

**Phase**: 3040-economy-runes
**Status**: Draft
**Created**: 2026-01-17

---

## Technical Context

### Existing Architecture

The rune system follows a well-established pattern:

1. **Definitions** (`src/data/runes.ts`): Static rune data in `RUNES[]` array
2. **Types** (`src/types/rune.ts`): `RuneDefinition`, `RuneModifiers`, triggers
3. **Engine** (`src/engine/runes.ts`): Effect processing functions
4. **Store** (`src/stores/gameStore.ts`): State management and integration

### Key Integration Points

| File | Function | Integration Needed |
|------|----------|-------------------|
| `src/types/rune.ts` | `RuneModifiers` | Add `shopDiscount`, `shopPriceIncrease` |
| `src/engine/runes.ts` | `getPassiveRuneModifiers()` | Add Bargain Hunter, Golden Goose cases |
| `src/engine/runes.ts` | `applyOnRevealRunes()` | Add Lucky Coin gold bonus |
| `src/stores/gameStore.ts` | `purchaseItem()` | Apply price modifiers |
| `src/stores/gameStore.ts` | `selectRuneReward()` | Apply price modifiers |
| `src/data/shopItems.ts` | `getRerollCost()` | Apply price modifiers |
| `src/stores/gameStore.ts` | `setPhase('shopping')` | Add Treasure Hunter check |

---

## Implementation Phases

### Phase 1: Type System Extension

**Goal**: Extend RuneModifiers to support new economy effects

**Files**:
- `src/types/rune.ts`

**Changes**:
```typescript
interface RuneModifiers {
  // Existing fields remain unchanged
  goldMultiplier: number;
  firstHitReduction: number;
  autoFlag: boolean;
  dangerSenseActive: boolean;
  damageReductionPercent: number;
  maxLivesBonus: number;

  // New economy fields
  shopDiscount: number;       // 0.0-1.0 (percentage off)
  shopPriceIncrease: number;  // 0.0-1.0 (percentage increase)
}
```

Update `createDefaultRuneModifiers()` to include defaults:
```typescript
shopDiscount: 0,
shopPriceIncrease: 0,
```

### Phase 2: Rune Definitions

**Goal**: Add four new rune definitions

**Files**:
- `src/data/runes.ts`

**New Runes** (add to RUNES array in Economy section):

```typescript
// Lucky Coin
{
  id: 'lucky-coin',
  name: 'Lucky Coin',
  description: '10% chance per tile to double gold',
  category: 'economy',
  rarity: 'common',
  icon: '🪙',
  effect: {
    trigger: 'onReveal',
    description: '10% double gold per tile',
    magnitude: 0.1,
  },
  stackable: true,
  cost: 25,
},

// Bargain Hunter
{
  id: 'bargain-hunter',
  name: 'Bargain Hunter',
  description: '10% discount on all shop prices',
  category: 'economy',
  rarity: 'common',
  icon: '🏷️',
  effect: {
    trigger: 'passive',
    description: '10% shop discount',
    magnitude: 0.1,
  },
  stackable: true,
  cost: 30,
},

// Treasure Hunter
{
  id: 'treasure-hunter',
  name: 'Treasure Hunter',
  description: '20% chance for gold cache on floor completion',
  category: 'economy',
  rarity: 'uncommon',
  icon: '💰',
  effect: {
    trigger: 'onFloorStart',  // Triggers when next floor starts (after completion)
    description: '20% gold cache chance',
    magnitude: 0.2,
  },
  stackable: true,
  cost: 45,
},

// Golden Goose
{
  id: 'golden-goose',
  name: 'Golden Goose',
  description: '+100% gold, +50% shop prices',
  category: 'economy',
  rarity: 'legendary',
  icon: '🪿',
  effect: {
    trigger: 'passive',
    description: 'Double gold, higher prices',
    magnitude: 1.0,
  },
  stackable: false,
  cost: 100,
},
```

### Phase 3: Engine Implementation

**Goal**: Implement rune effect processing

**Files**:
- `src/engine/runes.ts`

#### 3a. Passive Modifiers

Update `getPassiveRuneModifiers()`:

```typescript
case 'bargain-hunter':
  modifiers.shopDiscount += 0.1;
  break;

case 'golden-goose':
  modifiers.goldMultiplier += 1.0;  // +100% = 2x total
  modifiers.shopPriceIncrease = 0.5;  // +50% prices (non-stackable)
  break;
```

#### 3b. Lucky Coin Effect

Update `applyOnRevealRunes()` to return gold bonus:

```typescript
export interface OnRevealResult {
  grid: Grid;
  bonusTilesRevealed: number;
  luckyGoldBonus: number;  // NEW
}

// In function body:
let luckyGoldBonus = 0;
const luckyCount = countRune(equippedRunes, 'lucky-coin');
if (luckyCount > 0) {
  const chance = 0.1 * luckyCount;
  // Check for each tile revealed in this action (passed as parameter)
  // For now, apply to the single revealed position
  if (Math.random() < chance) {
    luckyGoldBonus = 1;  // Additional 1g (doubles base 1g)
  }
}

return { grid: currentGrid, bonusTilesRevealed, luckyGoldBonus };
```

Note: Lucky Coin triggers per-tile. The caller (gameStore) handles iterating over revealed tiles.

#### 3c. Treasure Hunter Effect

Add new function:

```typescript
export interface TreasureCacheResult {
  triggered: boolean;
  goldAmount: number;
}

export function checkTreasureCache(
  equippedRunes: string[],
  floorBonus: number
): TreasureCacheResult {
  const treasureCount = countRune(equippedRunes, 'treasure-hunter');
  if (treasureCount === 0) {
    return { triggered: false, goldAmount: 0 };
  }

  const chance = 0.2 * treasureCount;  // 20% per rune
  if (Math.random() >= chance) {
    return { triggered: false, goldAmount: 0 };
  }

  // Gold = 10-25% of floor bonus (random)
  const minPercent = 0.10;
  const maxPercent = 0.25;
  const percent = minPercent + Math.random() * (maxPercent - minPercent);
  const goldAmount = Math.max(1, Math.floor(floorBonus * percent));

  return { triggered: true, goldAmount };
}
```

### Phase 4: Price Calculation Utility

**Goal**: Centralize price calculation with modifiers

**Files**:
- `src/engine/economy.ts` (NEW FILE) or add to `src/engine/runes.ts`

```typescript
/**
 * Calculate final shop price with rune modifiers.
 * Formula: base * (1 + priceIncrease) * (1 - discount)
 * @param basePrice Original item/rune cost
 * @param modifiers Rune modifiers with shopDiscount and shopPriceIncrease
 * @returns Final price (minimum 1g)
 */
export function calculateShopPrice(
  basePrice: number,
  modifiers: RuneModifiers
): number {
  const increased = basePrice * (1 + modifiers.shopPriceIncrease);
  const discounted = increased * (1 - modifiers.shopDiscount);
  return Math.max(1, Math.floor(discounted));
}
```

### Phase 5: Store Integration

**Goal**: Apply modifiers in gameStore

**Files**:
- `src/stores/gameStore.ts`

#### 5a. Shop Item Purchase

Update `purchaseItem()`:

```typescript
purchaseItem: (itemId: string) => {
  const { player } = get();
  const item = getShopItem(itemId);
  if (!item) return false;

  // Calculate price with modifiers
  const modifiers = getPassiveRuneModifiers(player.equippedRunes);
  const finalPrice = calculateShopPrice(item.cost, modifiers);

  if (player.gold < finalPrice) return false;

  set((state) => {
    state.player.gold -= finalPrice;
    // ... rest of purchase logic
  });
  return true;
},
```

#### 5b. Rune Purchase

Update `selectRuneReward()`:

```typescript
// Replace direct cost checks with calculated price
const modifiers = getPassiveRuneModifiers(player.equippedRunes);
const finalCost = calculateShopPrice(rune.cost, modifiers);
const removalFee = calculateShopPrice(Math.floor(rune.cost / 2), modifiers);
```

#### 5c. Reroll Cost

Update reroll logic to apply modifiers:

```typescript
const baseRerollCost = getRerollCost(shop.rerollCount);
const modifiers = getPassiveRuneModifiers(player.equippedRunes);
const finalRerollCost = calculateShopPrice(baseRerollCost, modifiers);
```

#### 5d. Lucky Coin Integration

Update reveal handling to apply per-tile bonus:

```typescript
// In handleCellReveal or reveal processing loop
for (const pos of revealedPositions) {
  // Existing gold logic...
  let goldForTile = 1;

  // Lucky Coin: 10% chance per tile per rune to double
  const luckyCount = countRune(equippedRunes, 'lucky-coin');
  if (luckyCount > 0 && Math.random() < 0.1 * luckyCount) {
    goldForTile *= 2;
  }

  state.player.gold += applyGoldFind(goldForTile * multiplier, bonus, equippedRunes);
}
```

#### 5e. Treasure Hunter Integration

Update floor completion transition:

```typescript
// In setPhase('shopping') or floor completion
if (phase === 'shopping') {
  const floorBonus = level * DIFFICULTY_CONSTANTS.goldBonusPerLevel;
  const treasureResult = checkTreasureCache(player.equippedRunes, floorBonus);

  if (treasureResult.triggered) {
    state.player.gold += treasureResult.goldAmount;
    // TODO: Display notification "Treasure Cache! +Xg"
  }

  // Existing floor bonus logic
  state.player.gold += applyGoldFind(floorBonus, ...);
}
```

### Phase 6: Testing

**Goal**: Comprehensive test coverage

**Files**:
- `src/engine/__tests__/economyRunes.test.ts` (NEW)

**Test Cases**:

```typescript
describe('Economy Runes', () => {
  describe('Lucky Coin', () => {
    it('should proc at approximately 10% rate');
    it('should stack proc chance with multiple copies');
    it('should double gold when proc succeeds');
  });

  describe('Bargain Hunter', () => {
    it('should apply 10% discount');
    it('should stack discount with multiple copies');
    it('should enforce minimum price of 1g');
    it('should apply to items, runes, and rerolls');
  });

  describe('Treasure Hunter', () => {
    it('should proc at approximately 20% rate');
    it('should stack proc chance');
    it('should award 10-25% of floor bonus');
  });

  describe('Golden Goose', () => {
    it('should double gold multiplier');
    it('should increase prices by 50%');
    it('should not stack');
  });

  describe('Price Calculation', () => {
    it('should apply increases before discounts');
    it('should handle combined Goose + Bargain Hunter');
    it('should floor to integer');
    it('should enforce minimum 1g');
  });
});
```

---

## File Changes Summary

| File | Type | Changes |
|------|------|---------|
| `src/types/rune.ts` | Modify | Add shopDiscount, shopPriceIncrease to RuneModifiers |
| `src/data/runes.ts` | Modify | Add 4 new rune definitions |
| `src/engine/runes.ts` | Modify | Add passive modifiers, Lucky Coin, Treasure Hunter |
| `src/stores/gameStore.ts` | Modify | Apply price modifiers in shop actions |
| `src/engine/__tests__/economyRunes.test.ts` | Create | New test file |

---

## Constitution Compliance

| Principle | Check |
|-----------|-------|
| V. Passive Mastery | ✅ All effects are passive, no active abilities |
| IV. Resource Tension | ✅ Creates meaningful gold decisions |
| VII. Move Fast | ✅ Building on existing patterns |

---

## Risks & Mitigation

| Risk | Mitigation |
|------|------------|
| Lucky Coin variance | Per-tile rolls smooth out; 10% is conservative |
| Price calculation errors | Centralized utility with tests |
| Breaking existing runes | Only additive changes, no modifications |
| Shop UI confusion | Clear price display with strikethrough for discounts |

---

## Open Questions

None - all clarified during DISCOVER phase.
