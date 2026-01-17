---
phase: "3050"
name: rune-synergies
status: not_started
created: 2026-01-14
---

# 3050 - Rune Synergies

**Goal**: Implement rune combo detection and bonus effects.

## Scope

- Synergy definition system
- Combo detection engine
- Synergy bonus effects
- Synergy discovery notification
- Synergy display in UI

## Deliverables

| File | Description |
|------|-------------|
| `src/data/synergies.ts` | Synergy definitions |
| `src/engine/synergies.ts` | Synergy detection |
| `src/components/hud/SynergyNotification.tsx` | Combo discovered UI |
| `src/engine/__tests__/synergies.test.ts` | Synergy tests |

## Verification Gate

- [ ] Synergies detected when runes collected
- [ ] Bonus effects apply
- [ ] Notification appears on discovery
- [ ] Multiple synergies can be active

## Estimated Complexity

**Medium** - Combinatorial logic.

## Synergy Examples

| Synergy | Runes | Bonus |
|---------|-------|-------|
| Hunter's Vision | Scout's Eye + Monster Lens | See monster types at floor start |
| Greedy | Lucky Coin + Treasure Hunter | +50% bonus loot |
| Immortal | Phoenix Feather + Undying | Heal 2 HP on revival |
| Seer | Prophecy + Omniscience | See which tiles are traps (future) |

## Notes

- Synergies should feel like discovery, not obvious
- Start with 5-6 synergies
- DM can hint at synergies (Milestone 4)
