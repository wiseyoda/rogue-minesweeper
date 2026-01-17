# Discovery: 3040 - Economy Runes

## Codebase Examination Summary

### Current State

#### Existing Economy Runes (Partially Implemented)

1. **Midas Touch** (rare, 60g, stackable)
   - Definition: `src/data/runes.ts:182-196`
   - Effect: +25% gold from all sources
   - **Implementation: COMPLETE** - Applied via `getPassiveRuneModifiers()` in `src/engine/runes.ts:525-528`
   - Used in `applyGoldFind()` at `src/stores/gameStore.ts:82-84`

2. **Treasure Sense** (common, 30g, stackable)
   - Definition: `src/data/runes.ts:197-211`
   - Effect: Reveal 1 safe tile at floor start
   - **Implementation: COMPLETE** - Applied via `applyOnFloorStartRunes()` in `src/engine/runes.ts:326-350`

#### Runes Specified in Phase (New)

From `.specify/phases/3040-economy-runes.md`:

| Rune | Rarity | Effect | Implementation Needed |
|------|--------|--------|----------------------|
| Lucky Coin | Common | +25% gold find | New definition + passive modifier |
| Bargain Hunter | Common | 10% shop discount | New definition + shop price modifier |
| Treasure Hunter | Uncommon | 20% chance for bonus loot | New definition + loot generation hook |
| Midas Touch | Rare | +1 gold per reveal | **Already exists** (different effect: +25% gold) |
| Golden Goose | Legendary | +100% gold, +50% prices | New definition + dual modifier |

**Conflict Detected**: Phase spec says "Midas Touch: +1 gold per reveal" but codebase has "+25% gold multiplier"

### Integration Points

#### Gold System (`src/stores/gameStore.ts`)

1. **Per-tile gold** (lines 297-303, 534-537):
   - Uses `applyGoldFind(baseGold, goldFindBonus, equippedRunes)`
   - Already applies rune gold multiplier

2. **Floor completion bonus** (lines 418-426):
   - `level * 10` gold at shopping phase transition
   - Does NOT currently apply gold modifiers

3. **Scrap metal passive** (lines 530-537):
   - 1 gold every 5 seconds
   - Does NOT apply gold modifiers

#### Shop System (`src/data/shopItems.ts`, `src/stores/gameStore.ts`)

1. **Item purchase** (lines 452-465):
   - Direct `item.cost` comparison and deduction
   - **No discount mechanism exists**

2. **Rune purchase** (lines 679-714):
   - Direct `rune.cost` comparison
   - **No discount mechanism exists**

3. **Reroll cost** (shopItems.ts:24-26):
   - `REROLL_BASE_COST + rerollCount * REROLL_INCREMENT`
   - **No discount mechanism exists**

#### Loot System

- **Rune rewards**: `generateRuneRewards()` in gameStore.ts uses `getRandomRunes(3, excludeIds)`
- **Shop items**: `generateShopItems()` uses rarity weights
- **No "bonus loot" mechanism** currently exists

### Required Changes

#### 1. New RuneModifiers Fields (`src/types/rune.ts`)

```typescript
interface RuneModifiers {
  // Existing fields...
  shopDiscount: number;      // 0.0 = no discount, 0.1 = 10% discount
  shopPriceIncrease: number; // 0.0 = no increase, 0.5 = 50% higher prices
  bonusLootChance: number;   // 0.0-1.0, chance for extra rewards
  flatGoldPerReveal: number; // Additional gold per tile reveal
}
```

#### 2. Shop Discount Application

Need to modify:
- `purchaseItem()` - Apply discount to `item.cost`
- `selectRuneReward()` - Apply discount to `rune.cost`
- `getRerollCost()` - Apply discount to reroll cost

#### 3. Bonus Loot Mechanism

Options:
- A) Extra shop item after floor completion
- B) Extra rune choice (4 instead of 3)
- C) Chance for duplicate rune reward

Recommend: **Option B** (simplest, most valuable)

#### 4. Golden Goose Trade-off

Dual modifier: +100% gold AND +50% prices
- Affects gold earning (double `goldMultiplier`)
- Affects shop spending (negative `shopDiscount` or positive `shopPriceIncrease`)

### Patterns to Follow

1. **Rune definitions**: Add to `RUNES[]` array in `src/data/runes.ts`
2. **Passive effects**: Add cases in `getPassiveRuneModifiers()` in `src/engine/runes.ts`
3. **Triggered effects**: Use existing trigger functions (`onFloorStart`, `onReveal`, etc.)
4. **Tests**: Follow pattern in `src/engine/__tests__/` (Vitest)

### Open Questions

1. **Midas Touch conflict**: Keep existing implementation (+25% gold) or change to phase spec (+1 gold per reveal)?
2. **Lucky Coin vs Midas Touch**: Both increase gold - are these distinct enough? Lucky Coin (+25% find) vs Midas Touch (+25% all sources)?
3. **Treasure Hunter loot type**: Extra shop item, extra rune choice, or gold cache?
4. **Golden Goose price increase**: Apply to shop items only, or also runes and rerolls?

## Clarification Decisions

### Midas Touch Conflict
**Decision**: Keep existing implementation (+25% gold from all sources). No change needed.

### Lucky Coin Design
**Decision**: 10% chance per tile revealed to double gold output for that tile.
- Trigger: `onReveal` (per individual tile)
- Stackable: Yes (increases chance per rune)
- Example: With 2 Lucky Coins, 20% chance per tile to get 2g instead of 1g

### Treasure Hunter Bonus Loot
**Decision**: Gold cache (random gold bonus) at floor completion.
- Trigger: `onFloorStart` or when entering shop
- Effect: 20% chance for bonus gold (suggested: 10-25% of floor bonus)
- Stackable: Yes (increases chance)

### Golden Goose Scope
**Decision**: Price increase applies to ALL shop prices (items + runes + rerolls).
- Creates true trade-off: earn 2x gold, spend 1.5x
- Net positive (+33% purchasing power) but risky if unlucky

## Final Rune Specifications

| Rune | Rarity | Cost | Effect | Trigger | Stackable |
|------|--------|------|--------|---------|-----------|
| Lucky Coin | Common | 25g | 10% chance per tile to double gold | onReveal | Yes |
| Bargain Hunter | Common | 30g | 10% shop discount | passive | Yes |
| Treasure Hunter | Uncommon | 45g | 20% chance for gold cache at floor end | onFloorStart | Yes |
| Golden Goose | Legendary | 100g | +100% gold, +50% all shop prices | passive | No |

Note: Midas Touch (existing, +25% gold multiplier) remains unchanged.

## Phase Scope Clarification

Based on phase file, codebase analysis, and user clarifications, this phase will:

1. Add 4 new economy runes (Lucky Coin, Bargain Hunter, Treasure Hunter, Golden Goose)
2. Implement shop discount system (new `shopDiscount` modifier)
3. Implement shop price increase system (new `shopPriceIncrease` modifier)
4. Implement Lucky Coin's per-tile gold doubling
5. Implement Treasure Hunter's gold cache bonus
6. Add tests for all new effects
