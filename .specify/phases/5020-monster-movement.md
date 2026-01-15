---
phase: '5020'
name: monster-movement
status: not_started
created: 2026-01-14
---

# 5020 - Monster Movement

**Goal**: Implement monster movement patterns.

## Scope

- Monster movement types (static, random, chase)
- Movement speed (tiles per turn)
- Path calculation
- Collision detection
- Visual movement indicators

## Deliverables

| File                                  | Description              |
| ------------------------------------- | ------------------------ |
| `src/engine/monsters.ts`              | Monster AI               |
| `src/engine/pathfinding.ts`           | Simple pathfinding       |
| `src/types/monster.ts`                | Updated: movement        |
| `src/components/game/MonsterPath.tsx` | Path preview (with rune) |

## Verification Gate

- [ ] Static monsters don't move
- [ ] Random movers move randomly
- [ ] Chasers move toward revealed area
- [ ] Movement speed respected
- [ ] Collision damages player

## Estimated Complexity

**High** - Complex game logic.

## Monster Movement Types

| Type       | Behavior             | Speed |
| ---------- | -------------------- | ----- |
| Static     | Never moves          | 0     |
| Random     | Random adjacent tile | 1     |
| Chase      | Move toward player   | 1     |
| Fast Chase | Move toward player   | 2     |
| Patrol     | Fixed pattern        | 1     |

## Notes

- Monsters only exist in unrevealed tiles
- Collision with revealed area = damage
- Some runes predict movement paths
