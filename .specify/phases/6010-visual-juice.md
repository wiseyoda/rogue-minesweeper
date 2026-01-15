---
phase: '6010'
name: visual-juice
status: not_started
created: 2026-01-14
---

# 6010 - Visual Juice

**Goal**: Add satisfying visual feedback to all interactions.

## Scope

- Screen shake on damage
- Particle effects (gold, damage)
- Tile reveal animations
- Number pop animations
- Color pulses
- Framer Motion integration
- UpgradeShopModal polish (see BACKLOG.md BL-002)

## Deliverables

| File                                   | Description         |
| -------------------------------------- | ------------------- |
| `src/hooks/useScreenShake.ts`          | Screen shake hook   |
| `src/components/effects/Particles.tsx` | Particle system     |
| `src/components/game/Tile.tsx`         | Updated: animations |
| `src/styles/animations.css`            | Keyframe animations |

## Verification Gate

- [ ] Screen shakes on damage
- [ ] Gold floats up on collect
- [ ] Tiles animate on reveal
- [ ] Numbers pop into view
- [ ] Damage flashes red

## Estimated Complexity

**Medium** - Animation polish.

## Animation Priorities

1. Tile reveal (most common)
2. Damage taken (most important)
3. Gold pickup (satisfying)
4. Monster reveal (dramatic)
5. Win/lose (celebratory/dramatic)

## Notes

**See `.specify/reference/ui-mockup-definitive.html` for animation timing tokens.**

### Timing Tokens (MUST USE)

| Token | Duration | Usage |
|-------|----------|-------|
| `--tick` | 50ms | Instant feedback |
| `--beat` | 100ms | Quick transitions |
| `--breath` | 200ms | Standard animations |
| `--pulse` | 400ms | Noticeable effects |
| `--wave` | 800ms | Dramatic moments |

- Consider Framer Motion for complex sequences
- Respect `prefers-reduced-motion`
- Use mockup CSS custom properties for colors
