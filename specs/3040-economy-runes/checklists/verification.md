# Verification Checklist: 3040 - Economy Runes

**Phase**: 3040-economy-runes
**Purpose**: Post-completion verification

---

## Rune Definitions

### Lucky Coin
- [x] Rune appears in `RUNES[]` array
- [x] Correct ID: `lucky-coin`
- [x] Correct category: `economy`
- [x] Correct rarity: `common`
- [x] Correct cost: 25g
- [x] Stackable: true
- [x] Trigger: `onReveal`

### Bargain Hunter
- [x] Rune appears in `RUNES[]` array
- [x] Correct ID: `bargain-hunter`
- [x] Correct category: `economy`
- [x] Correct rarity: `common`
- [x] Correct cost: 30g
- [x] Stackable: true
- [x] Trigger: `passive`

### Treasure Hunter
- [x] Rune appears in `RUNES[]` array
- [x] Correct ID: `treasure-hunter`
- [x] Correct category: `economy`
- [x] Correct rarity: `uncommon`
- [x] Correct cost: 45g
- [x] Stackable: true
- [x] Trigger: `onFloorStart`

### Golden Goose
- [x] Rune appears in `RUNES[]` array
- [x] Correct ID: `golden-goose`
- [x] Correct category: `economy`
- [x] Correct rarity: `legendary`
- [x] Correct cost: 100g
- [x] Stackable: false
- [x] Trigger: `passive`

---

## Type System

- [x] `RuneModifiers` interface has `shopDiscount` field
- [x] `RuneModifiers` interface has `shopPriceIncrease` field
- [x] `createDefaultRuneModifiers()` returns `shopDiscount: 0`
- [x] `createDefaultRuneModifiers()` returns `shopPriceIncrease: 0`

---

## Engine Functions

### calculateShopPrice
- [x] Function exists in `src/engine/runes.ts`
- [x] Takes basePrice and modifiers as parameters
- [x] Applies price increase before discount
- [x] Enforces minimum price of 1g
- [x] Returns floored integer

### getPassiveRuneModifiers
- [x] Has case for `bargain-hunter`
- [x] Bargain Hunter adds 0.1 to shopDiscount per rune
- [x] Has case for `golden-goose`
- [x] Golden Goose adds 1.0 to goldMultiplier
- [x] Golden Goose sets shopPriceIncrease to 0.5

### checkTreasureCache
- [x] Function exists in `src/engine/runes.ts`
- [x] Returns triggered boolean and goldAmount
- [x] Uses 20% proc chance per rune (stackable)
- [x] Gold amount is 10-25% of floor bonus

---

## Store Integration

### purchaseItem
- [x] Gets rune modifiers before price check
- [x] Uses `calculateShopPrice()` for final price
- [x] Deducts correct modified amount

### selectRuneReward
- [x] Gets rune modifiers before price check
- [x] Uses `calculateShopPrice()` for rune cost
- [x] Uses `calculateShopPrice()` for removal fee

### Reroll
- [x] Gets rune modifiers before price check
- [x] Uses `calculateShopPrice()` for reroll cost

### Lucky Coin Gold
- [x] Per-tile check in reveal loop
- [x] 10% chance per rune (stackable)
- [x] Doubles gold for that tile when triggered

### Treasure Hunter
- [x] Check runs when floor is completed
- [x] Awards gold before shop transition
- [x] Proc chance stacks with multiple runes

---

## Test Coverage

- [x] Tests exist for `calculateShopPrice()`
- [x] Tests exist for Lucky Coin proc logic
- [x] Tests exist for Bargain Hunter discount stacking
- [x] Tests exist for Golden Goose dual modifier
- [x] Tests exist for Treasure Hunter proc and amount
- [x] Tests exist for Golden Goose + Bargain Hunter combination

---

## Quality Gates

- [x] TypeScript compiles with no errors
- [x] ESLint passes with no errors
- [x] All tests pass
- [x] No console errors in browser

---

## Phase Verification Gate (from ROADMAP)

- [x] Gold find increases gold drops (Midas Touch + Lucky Coin)
- [x] Shop discounts work (Bargain Hunter)
- [x] Bonus loot appears (Treasure Hunter gold cache)
- [x] Gold generation triggers (Lucky Coin per-tile proc)
