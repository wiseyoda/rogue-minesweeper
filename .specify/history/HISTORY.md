# Dungeon Delver Phase History

> Archived phases that have been completed.

**Last Updated**: 2026-01-14

---

## 3060 - **rune-system-poc**

**Completed**: 2026-02-14

# 3060 - Rune System POC

**Goal**: Playable game with 10+ runes and synergies.

## Scope

- All runes from previous phases integrated
- Runes drop from tiles
- Runes purchasable in shop
- Synergies discoverable
- Balance tuning

## Deliverables

| File | Description |
|------|-------------|
| `src/data/runes/index.ts` | All runes combined |
| Updated shop | Rune purchases |
| Updated tile drops | Rune drops |

## Verification Gate - USER GATE

User must manually verify rune system:

- [ ] Runes drop from revealed tiles
- [ ] Can purchase runes in shop
- [ ] 10+ runes implemented
- [ ] Runes affect gameplay meaningfully
- [ ] Information runes feel like "cheating"
- [ ] Defense runes provide survivability
- [ ] Economy runes increase gold
- [ ] Synergies discoverable
- [ ] Synergy bonuses apply
- [ ] Different builds feel different

## Estimated Complexity

**Medium** - Integration and balance testing.

## Success Criteria

Builds should emerge:
- "Information build": Stack reveal runes
- "Tank build": Stack defense runes
- "Gold rush build": Stack economy runes
- Hybrid builds with synergies

## Notes

- This completes Constitution Phase 2
- Runes are the "Joker" equivalent (Balatro)
- Discovery of synergies is half the fun
- Must pass before proceeding to Milestone 4

---

## 3050 - rune-synergies

**Completed**: 2026-02-14

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

---

## Completed Phases

*No phases completed yet.*

---

## Archive Process

When a phase is completed:

1. Mark as ✅ in ROADMAP.md
2. Run `specflow phase close NNNN`
3. Phase details moved here
4. Include completion notes

---

## Archive Format

```markdown
## NNNN - Phase Name (Completed YYYY-MM-DD)

**Original Goal**: ...

**What Was Built**:
- File 1
- File 2

**Deferred Items**:
- Item 1 (moved to backlog)

**Lessons Learned**:
- Lesson 1
```
