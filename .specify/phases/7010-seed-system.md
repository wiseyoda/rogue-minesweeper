---
phase: "7010"
name: seed-system
status: not_started
created: 2026-01-14
---

# 7010 - Seed System

**Goal**: Implement deterministic RNG for shareable runs.

## Scope

- Seeded random number generator
- Seed encoding/decoding
- Seed display and copy
- Seed input for replay

## Deliverables

| File | Description |
|------|-------------|
| `src/engine/rng.ts` | Seeded RNG |
| `src/utils/seed.ts` | Seed encoding |
| `src/components/ui/SeedDisplay.tsx` | Show seed |
| `src/components/ui/SeedInput.tsx` | Enter seed |

## Verification Gate

- [ ] Same seed = same run
- [ ] Seed visible during run
- [ ] Can copy seed
- [ ] Can enter seed to replay
- [ ] Seed encoded nicely (readable)

## Estimated Complexity

**Medium** - Deterministic RNG is tricky.

## Seed Format

```
DDXX-YYYY-ZZZZ
  |    |    |
  |    |    └── Random component
  |    └─────── Time component
  └──────────── Daily component (for daily challenge)
```

## Notes

- Use established PRNG (mulberry32, xoshiro)
- All randomness must use seeded RNG
- Test determinism thoroughly
