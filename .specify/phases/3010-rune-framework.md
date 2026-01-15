---
phase: '3010'
name: rune-framework
status: not_started
created: 2026-01-14
---

# 3010 - Rune Framework

**Goal**: Build the foundational rune system architecture.

## Scope

- Rune type definitions
- Rune effect system
- Rune stacking logic
- Rune inventory (equipped runes)
- Rune drops from tiles
- Rune display in HUD

## Deliverables

| File                             | Description             |
| -------------------------------- | ----------------------- |
| `src/types/rune.ts`              | Rune type definitions   |
| `src/engine/runes.ts`            | Rune effect processing  |
| `src/data/runes.ts`              | Rune definitions        |
| `src/stores/gameStore.ts`        | Updated: rune inventory |
| `src/components/hud/RuneBar.tsx` | Equipped runes display  |

## Verification Gate

- [ ] Rune types defined (info, defense, economy, utility)
- [ ] Runes can be collected
- [ ] Runes display in HUD
- [ ] Rune effects process correctly
- [ ] Multiple runes stack

## Estimated Complexity

**Medium** - Core system that many features depend on.

## Rune System Design

```typescript
interface Rune {
  id: string;
  name: string;
  category: 'information' | 'defense' | 'economy' | 'utility';
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  description: string;
  effect: RuneEffect;
  stackable: boolean;
}

interface RuneEffect {
  trigger: 'passive' | 'onReveal' | 'onFloorStart' | 'onDamage';
  action: RuneAction;
  magnitude?: number;
}
```

## Notes

- Runes are PASSIVE only (constitution principle)
- No active abilities or cooldowns
- Effects modify game state, not add buttons
