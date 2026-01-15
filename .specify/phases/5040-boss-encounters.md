---
phase: "5040"
name: boss-encounters
status: not_started
created: 2026-01-14
---

# 5040 - Boss Encounters

**Goal**: Implement boss floors every 3rd level.

## Scope

- Boss floor detection (level 3, 6, 9...)
- Boss spawn rules
- Boss abilities
- Boss rewards
- Victory conditions

## Deliverables

| File | Description |
|------|-------------|
| `src/engine/boss.ts` | Boss logic |
| `src/data/bosses.ts` | Boss definitions |
| `src/components/game/BossHealth.tsx` | Boss HP bar |
| `src/components/ui/BossIntro.tsx` | Boss entrance |

## Verification Gate

- [ ] Boss appears on floor 3, 6, 9...
- [ ] Boss has HP bar
- [ ] Boss uses abilities
- [ ] Boss drops extra loot
- [ ] DM reacts to boss defeat

## Estimated Complexity

**Medium** - Special encounter rules.

## Boss Roster

| Boss | Floor | HP | Ability |
|------|-------|----|---------|
| Dragon | 3 | 5 | Fire Breath |
| Beholder | 6 | 8 | Eye Rays |
| Lich | 9 | 10 | Summon Skeletons |
| Demon Lord | 12 | 15 | All abilities |

## Notes

- Bosses are teaching moments
- Each boss tests different skills
- Floor 12+ = random boss with scaling
