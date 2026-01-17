---
phase: "3030"
name: defense-runes
status: not_started
created: 2026-01-14
---

# 3030 - Defense Runes

**Goal**: Implement runes that protect the player.

## Scope

- Vitality runes (HP/Max HP)
- Shield runes
- Armor runes (damage reduction)
- Second chance runes

## Deliverables

| File | Description |
|------|-------------|
| `src/data/runes/defenseRunes.ts` | Defense rune definitions |
| `src/engine/runes/defense.ts` | Defense rune effects |
| `src/engine/__tests__/defenseRunes.test.ts` | Effect tests |

## Verification Gate

- [ ] HP runes increase health
- [ ] Shield runes provide shields
- [ ] Armor reduces damage
- [ ] Second chance triggers on lethal

## Estimated Complexity

**Low** - Straightforward stat modifications.

## Rune Details

| Rune | Rarity | Effect |
|------|--------|--------|
| Hardy | Common | +1 Max HP |
| Shield Bearer | Common | +1 Shield at floor start |
| Iron Skin | Uncommon | 25% damage reduction |
| Phoenix Feather | Rare | Survive lethal once |
| Undying | Legendary | Heal 1 HP per 5 reveals |

## Notes

- Defense allows riskier play
- Should complement information runes
- Don't make player invincible
