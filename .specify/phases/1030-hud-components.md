---
phase: "1030"
name: hud-components
status: not_started
created: 2026-01-14
---

# 1030 - HUD Components

**Goal**: Build the heads-up display showing player stats and game info.

## Scope

- HP display (hearts or bar)
- Shield display
- Gold counter
- Level/floor indicator
- Monster count remaining
- Active buffs display
- Message area for feedback

## Deliverables

| File | Description |
|------|-------------|
| `src/components/hud/HUD.tsx` | Main HUD container |
| `src/components/hud/HealthDisplay.tsx` | HP hearts/bar |
| `src/components/hud/ShieldDisplay.tsx` | Shield icons |
| `src/components/hud/GoldCounter.tsx` | Gold amount |
| `src/components/hud/LevelIndicator.tsx` | Current floor |
| `src/components/hud/BuffBar.tsx` | Active buff icons |
| `src/components/hud/MessageArea.tsx` | Game messages |
| `src/components/hud/index.ts` | HUD exports |

## Verification Gate

- [ ] HP updates when damage taken
- [ ] Shields display and deplete before HP
- [ ] Gold increments on tile reveal
- [ ] Level shows current floor number
- [ ] Active buffs show as icons
- [ ] Messages appear on events (damage, loot, win)

## Estimated Complexity

**Low** - Display components, data from store.

## Layout

```
┌────────────────────────────────────┐
│  ♥ ♥ ♥  |  🛡  |  💰 150  |  L5   │
├────────────────────────────────────┤
│  [buff] [buff]                     │
├────────────────────────────────────┤
│  "Monster hit! 2 lives remaining"  │
└────────────────────────────────────┘
```

## Notes

- Keep styling simple for now (polish in Milestone 6)
- Use Tailwind utilities
- Consider animation for value changes (later)
