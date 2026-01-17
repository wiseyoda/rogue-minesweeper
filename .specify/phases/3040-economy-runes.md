---
phase: "3040"
name: economy-runes
status: not_started
created: 2026-01-14
---

# 3040 - Economy Runes

**Goal**: Implement runes that affect gold and loot.

## Scope

- Gold find runes
- Loot rarity runes
- Shop discount runes
- Gold generation runes

## Deliverables

| File | Description |
|------|-------------|
| `src/data/runes/economyRunes.ts` | Economy rune definitions |
| `src/engine/runes/economy.ts` | Economy rune effects |
| `src/engine/__tests__/economyRunes.test.ts` | Effect tests |

## Verification Gate

- [ ] Gold find increases gold drops
- [ ] Shop discounts work
- [ ] Bonus loot appears
- [ ] Gold generation triggers

## Estimated Complexity

**Low** - Numeric modifiers to economy.

## Rune Details

| Rune | Rarity | Effect |
|------|--------|--------|
| Lucky Coin | Common | +25% gold find |
| Bargain Hunter | Common | 10% shop discount |
| Treasure Hunter | Uncommon | 20% chance for bonus loot |
| Midas Touch | Rare | +1 gold per reveal |
| Golden Goose | Legendary | +100% gold, +50% prices |

## Notes

- Economy runes enable more shop purchases
- Creates tension: spend now vs save for meta
- Golden Goose is high-risk high-reward
