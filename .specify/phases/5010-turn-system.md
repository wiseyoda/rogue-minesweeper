---
phase: '5010'
name: turn-system
status: not_started
created: 2026-01-14
---

# 5010 - Turn System

**Goal**: Implement turn-based game loop for monster movement.

## Scope

- Turn counter
- Turn phases (player → monsters → resolution)
- Turn-based state management
- Turn indicator UI

## Deliverables

| File                                   | Description         |
| -------------------------------------- | ------------------- |
| `src/engine/turns.ts`                  | Turn management     |
| `src/types/turn.ts`                    | Turn types          |
| `src/stores/gameStore.ts`              | Updated: turn state |
| `src/components/hud/TurnIndicator.tsx` | Turn display        |

## Verification Gate

- [ ] Turn counter increments on player action
- [ ] Turn phases execute in order
- [ ] Turn indicator shows current turn
- [ ] Game loop pauses between phases

## Estimated Complexity

**Medium** - Game loop architecture change.

## Turn Flow

```
1. Player reveals tile
2. Process reveal (damage, loot)
3. Turn counter ++
4. Monster phase begins
5. Each moving monster acts
6. Check for player collision
7. Update UI
8. Back to step 1
```

## Notes

- Only some monsters move
- Movement happens after every reveal
- Turn counter visible in HUD
