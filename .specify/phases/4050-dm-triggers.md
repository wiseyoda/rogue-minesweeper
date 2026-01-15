---
phase: "4050"
name: dm-triggers
status: not_started
created: 2026-01-14
---

# 4050 - DM Triggers

**Goal**: Define when the DM speaks during gameplay.

## Scope

- Floor start triggers
- Near-death triggers
- Death triggers
- Boss victory triggers
- Synergy discovery triggers
- Idle/slow play triggers

## Deliverables

| File | Description |
|------|-------------|
| `src/ai/triggers.ts` | Trigger definitions |
| `src/engine/dm-hooks.ts` | Game loop hooks |
| `src/stores/dungeonStore.ts` | Updated: last spoke tracking |

## Verification Gate

- [ ] DM speaks at floor start
- [ ] DM speaks on near-death
- [ ] DM speaks on death
- [ ] DM speaks on boss clear
- [ ] Rate limiting prevents spam
- [ ] Synergy hints work (30% chance)

## Estimated Complexity

**Low** - Event-driven hooks.

## Trigger Points

| Trigger | Frequency | Content |
|---------|-----------|---------|
| Floor Start | Every floor | Mood update + intro taunt |
| Near Death | Once per near-death | Taunt or (rarely) hint |
| Death | On death | Death commentary |
| Boss Victory | On boss kill | Reaction |
| Synergy Found | 30% chance | Hint about synergy |
| Idle | After 30s inactivity | Encouragement/mockery |

## Notes

- Max 1 DM message per 30 seconds
- Near-death = survived with 1 HP
- Queue messages if multiple triggers
