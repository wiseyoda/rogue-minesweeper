---
phase: "7020"
name: daily-challenges
status: not_started
created: 2026-01-14
---

# 7020 - Daily Challenges

**Goal**: Implement daily/weekly challenge runs.

## Scope

- Daily seed generation
- Challenge mode UI
- Challenge restrictions (no upgrades?)
- Challenge leaderboard (local)
- Weekly seed rotation

## Deliverables

| File | Description |
|------|-------------|
| `src/engine/daily.ts` | Daily seed logic |
| `src/components/ui/DailyChallenge.tsx` | Challenge mode |
| `src/stores/metaStore.ts` | Updated: daily tracking |

## Verification Gate

- [ ] Daily seed same for everyone
- [ ] Daily resets at midnight
- [ ] Weekly challenge available
- [ ] Can only attempt daily once
- [ ] Best daily score tracked

## Estimated Complexity

**Low** - Time-based seed.

## Challenge Modes

| Mode | Reset | Rules |
|------|-------|-------|
| Daily | 24h | No permanent upgrades |
| Weekly | 7d | All upgrades, longer seed |
| Practice | Never | Any seed, no leaderboard |

## Notes

- Use UTC for consistency
- Consider timezone display
- Track attempt count
