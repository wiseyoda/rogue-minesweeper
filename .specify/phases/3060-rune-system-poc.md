---
phase: "3060"
name: rune-system-poc
status: not_started
created: 2026-01-14
user_gate: true
---

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
