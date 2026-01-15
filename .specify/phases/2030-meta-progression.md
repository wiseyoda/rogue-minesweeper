---
phase: '2030'
name: meta-progression
status: not_started
created: 2026-01-14
---

# 2030 - Meta Progression

**Goal**: Implement permanent upgrades that persist across runs.

## Scope

- Permanent upgrade definitions
- Upgrade purchase logic
- Apply upgrades at run start
- Track purchase counts per upgrade
- Upgrade cap per type

## Deliverables

| File                                     | Description               |
| ---------------------------------------- | ------------------------- |
| `src/data/permanentUpgrades.ts`          | Upgrade definitions       |
| `src/stores/metaStore.ts`                | Updated: upgrade tracking |
| `src/engine/upgrades.ts`                 | Apply upgrades logic      |
| `src/stores/__tests__/metaStore.test.ts` | Persistence tests         |

## Verification Gate

- [ ] Upgrades persist after page refresh
- [ ] Purchased upgrades apply at run start
- [ ] Can't exceed max level per upgrade
- [ ] Stats track correctly (total runs, best floor)

## Estimated Complexity

**Low** - Data persistence already set up.

## Permanent Upgrades

| Upgrade            | Cost | Effect                    | Max Level |
| ------------------ | ---- | ------------------------- | --------- |
| Vitality           | 100g | +1 starting Max HP        | 3         |
| Fortune            | 150g | +10% gold find            | 5         |
| Preparation        | 200g | Start with random buff    | 3         |
| Resilience         | 250g | +1 starting shield        | 2         |
| First Click Safety | 300g | First click never monster | 1         |

## Notes

- Gold carries over from death
- Upgrades scale in cost (100g, 200g, 400g for same upgrade)
- Consider unlock requirements (future)
