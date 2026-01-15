---
phase: "2010"
name: floor-progression
status: not_started
created: 2026-01-14
---

# 2010 - Floor Progression

**Goal**: Implement multi-floor runs with scaling difficulty.

## Scope

- Level advancement on floor clear
- Grid scaling (size increases with level)
- Monster density scaling
- Monster damage scaling (future prep)
- Gold reward per floor
- Buff carryover between floors

## Deliverables

| File | Description |
|------|-------------|
| `src/engine/difficulty.ts` | Scaling calculations |
| `src/engine/floor-transition.ts` | Floor completion logic |
| `src/stores/gameStore.ts` | Updated: level progression |
| `src/engine/__tests__/difficulty.test.ts` | Scaling tests |

## Verification Gate

- [ ] Floor 1: 6x6 grid, 10% monsters
- [ ] Floor 5: larger grid, more monsters
- [ ] Floor 10: significantly harder
- [ ] Gold bonus increases per floor
- [ ] Buffs carry over correctly
- [ ] Can reach floor 10+

## Estimated Complexity

**Low** - Straightforward scaling logic.

## Scaling Formula

```typescript
interface FloorConfig {
  rows: number;      // min(8 + level, 20)
  cols: number;      // min(8 + level, 30)
  monsterCount: number; // min(5 + level * 2.5, rows * cols * 0.3)
  goldBonus: number;    // level * 10
}
```

## Notes

- Port logic from existing POC
- Keep scaling numbers tunable (constants file)
- Don't over-complicate - can tune through playtesting
