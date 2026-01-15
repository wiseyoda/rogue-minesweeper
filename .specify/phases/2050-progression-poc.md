---
phase: '2050'
name: progression-poc
status: not_started
created: 2026-01-14
user_gate: true
---

# 2050 - Progression POC

**Goal**: Complete playable roguelike loop with all progression systems.

## Scope

- Full game flow integration
- Run → Floor → Shop → Repeat → Death → Meta Shop → New Run
- High score tracking
- Stats display

## Deliverables

| File                               | Description            |
| ---------------------------------- | ---------------------- |
| `src/pages/GamePage.tsx`           | Updated: complete flow |
| `src/components/ui/HighScores.tsx` | Best runs display      |
| `src/components/ui/RunStats.tsx`   | Current run stats      |

## Verification Gate - USER GATE

User must manually verify complete roguelike loop:

- [ ] Start new run
- [ ] Clear multiple floors (5+)
- [ ] Shop between floors works
- [ ] Buy items, see effects
- [ ] Die at some point
- [ ] Meta shop appears with gold
- [ ] Buy permanent upgrades
- [ ] Start new run
- [ ] Upgrades apply at start
- [ ] Can reach floor 10+ with upgrades
- [ ] High scores persist across sessions

## Estimated Complexity

**Medium** - Integration testing of all systems.

## Success Criteria

"One more run" feeling should emerge:

- Death feels fair (player mistake)
- Progress feels meaningful
- Upgrades make future runs easier
- High score is satisfying to beat

## Notes

- This completes Constitution Phase 1
- Should be playable and fun
- Balance tuning happens through play
- Must pass before proceeding to Milestone 3
