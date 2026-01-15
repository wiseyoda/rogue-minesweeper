---
phase: '7030'
name: leaderboards
status: not_started
created: 2026-01-14
---

# 7030 - Leaderboards

**Goal**: Implement global high score tracking.

## Scope

- Vercel KV setup
- Score submission
- Leaderboard retrieval
- Anti-cheat basics
- Leaderboard UI

## Deliverables

| File                                | Description                  |
| ----------------------------------- | ---------------------------- |
| `src/api/leaderboard.ts`            | API routes                   |
| `src/components/ui/Leaderboard.tsx` | Leaderboard display          |
| `app/api/scores/route.ts`           | Next.js API route (if using) |
| Vercel KV configuration             |                              |

## Verification Gate

- [ ] Can submit score
- [ ] Can view leaderboard
- [ ] Scores sorted correctly
- [ ] Basic anti-cheat works
- [ ] Daily/weekly separate boards

## Estimated Complexity

**Medium** - Backend setup.

## Score Entry

```typescript
interface ScoreEntry {
  id: string;
  playerName: string;
  floor: number;
  gold: number;
  seed: string;
  timestamp: number;
  checksum: string; // basic anti-cheat
}
```

## Notes

- Keep it simple - don't over-engineer anti-cheat
- Vercel KV is Redis-compatible
- Consider anonymous vs named entries
