# Requirements Checklist: 3040 - Economy Runes

## Functional Requirements

### FR-01: Lucky Coin Rune
- [ ] Rune definition exists with correct properties (id, category, rarity, cost, trigger)
- [ ] 10% proc chance per tile revealed
- [ ] Proc chance increases with multiple copies (stackable)
- [ ] Doubles gold output for triggered tiles (1g → 2g)
- [ ] Works independently for each tile in cascade reveals

### FR-02: Bargain Hunter Rune
- [ ] Rune definition exists with correct properties
- [ ] 10% discount applied to shop item prices
- [ ] 10% discount applied to rune purchase prices
- [ ] 10% discount applied to reroll costs
- [ ] Discount stacks with multiple copies
- [ ] Minimum price is 1g (no free items)

### FR-03: Treasure Hunter Rune
- [ ] Rune definition exists with correct properties
- [ ] 20% chance triggers on floor completion
- [ ] Chance increases with multiple copies (stackable)
- [ ] Gold cache amount = 10-25% of floor completion bonus (random)
- [ ] Cache triggers immediately after floor cleared (before shop transition)
- [ ] Notification displays gold amount earned

### FR-04: Golden Goose Rune
- [ ] Rune definition exists with correct properties
- [ ] +100% gold multiplier (doubles all gold earned)
- [ ] +50% shop price increase on all purchases
- [ ] Non-stackable (only one can be equipped)
- [ ] Price increase applies before discount calculation

### FR-05: Price Calculation System
- [ ] New `shopDiscount` modifier in RuneModifiers
- [ ] New `shopPriceIncrease` modifier in RuneModifiers
- [ ] Price formula: `floor(base * (1 + increase) * (1 - discount))`
- [ ] Modifiers calculated in `getPassiveRuneModifiers()`
- [ ] Minimum price enforced at 1g

### FR-06: Shop Integration
- [ ] `purchaseItem()` uses modified price calculation
- [ ] `selectRuneReward()` uses modified price calculation
- [ ] `getRerollCost()` uses modified price calculation
- [ ] Removal fees also affected by modifiers

## Non-Functional Requirements

### NFR-01: Performance
- [ ] Lucky Coin proc check adds negligible latency
- [ ] Price calculations cached per shop visit

### NFR-02: Code Quality
- [ ] All new code follows existing patterns
- [ ] TypeScript strict mode compliance
- [ ] No ESLint errors
- [ ] Functions have JSDoc comments

### NFR-03: Testing
- [ ] Unit tests for all rune effects
- [ ] Unit tests for price calculation
- [ ] Tests for edge cases (0 price, 100% discount)
- [ ] Tests for modifier stacking

## Acceptance Criteria Summary

| Requirement | Testable Criteria |
|-------------|-------------------|
| Lucky Coin | Roll 1000 tiles, ~10% should double |
| Bargain Hunter | 30g item costs 27g with one rune |
| Treasure Hunter | Roll 100 floors, ~20 should trigger cache |
| Golden Goose | 100g floor = 200g earned, 30g item = 45g cost |
| Combined | Goose + Bargain = 100g → 150g → 135g (price) |
