---
phase: '3020'
name: information-runes
status: not_started
created: 2026-01-14
---

# 3020 - Information Runes

**Goal**: Implement runes that reveal, predict, and illuminate (core fantasy).

## Scope

- Scout's Eye: See random monster at floor start
- Danger Sense: See danger numbers +1 range
- Monster Lens: Numbers show monster TYPE count
- Prophecy: Highlight safest tile
- Omniscience: See all monster locations

## Deliverables

| File                                            | Description                  |
| ----------------------------------------------- | ---------------------------- |
| `src/data/runes/informationRunes.ts`            | Information rune definitions |
| `src/engine/runes/information.ts`               | Information rune effects     |
| `src/engine/__tests__/informationRunes.test.ts` | Effect tests                 |

## Verification Gate

- [ ] Scout's Eye reveals random monster
- [ ] Danger Sense expands vision
- [ ] Monster Lens changes number display
- [ ] Prophecy highlights safe tile
- [ ] Omniscience shows all monsters

## Estimated Complexity

**Medium** - Each rune needs visual and logic.

## Rune Details

| Rune         | Rarity    | Effect                                       |
| ------------ | --------- | -------------------------------------------- |
| Scout's Eye  | Common    | See 1 random monster location at floor start |
| Danger Sense | Common    | Danger numbers show +1 range                 |
| Monster Lens | Uncommon  | Revealed numbers show monster TYPE count     |
| Prophecy     | Rare      | Highlight safest tile to click               |
| Omniscience  | Legendary | See all monster locations (not types)        |

## Notes

- These are the core "information is power" runes
- Should feel like cheating at Minesweeper
- Each should meaningfully change decision-making
