---
phase: '5030'
name: monster-abilities
status: not_started
created: 2026-01-14
---

# 5030 - Monster Abilities

**Goal**: Implement special monster abilities.

## Scope

- Ability system framework
- Web (slow player)
- Fire Breath (AoE damage)
- Phase (ignores walls)
- Summon (creates minions)

## Deliverables

| File                                    | Description        |
| --------------------------------------- | ------------------ |
| `src/engine/abilities.ts`               | Ability effects    |
| `src/types/ability.ts`                  | Ability types      |
| `src/data/monsters.ts`                  | Updated: abilities |
| `src/components/game/AbilityEffect.tsx` | Visual effects     |

## Verification Gate

- [ ] Spider webs slow player
- [ ] Dragon fire damages AoE
- [ ] Ghost phases through walls
- [ ] Abilities trigger correctly
- [ ] Visual feedback for abilities

## Estimated Complexity

**Medium** - Multiple ability types.

## Monster Abilities

| Monster  | Ability     | Effect                                  |
| -------- | ----------- | --------------------------------------- |
| Spider   | Web         | Player can only reveal 1 tile next turn |
| Dragon   | Fire Breath | Reveals 3x3 area (damages if monster)   |
| Ghost    | Phase       | Ignores unrevealed tile boundaries      |
| Lich     | Summon      | Creates skeleton on death               |
| Beholder | Eye Ray     | Random debuff                           |

## Notes

- Abilities add tactics layer
- Should counter certain rune builds
- Visual feedback essential
