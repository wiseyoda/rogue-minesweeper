---
phase: "4010"
name: ai-context-builder
status: not_started
created: 2026-01-14
---

# 4010 - AI Context Builder

**Goal**: Build the system that collects player history for AI prompts.

## Scope

- Player history tracking
- Run statistics collection
- Current state serialization
- Context building for AI requests
- Rate limiting preparation

## Deliverables

| File | Description |
|------|-------------|
| `src/ai/context.ts` | Context builder |
| `src/types/ai.ts` | AI types |
| `src/stores/dungeonStore.ts` | DM state store |
| `src/ai/__tests__/context.test.ts` | Context tests |

## Verification Gate

- [ ] Context includes player history
- [ ] Context includes current run state
- [ ] Context serializes correctly
- [ ] Context size is reasonable (<2k tokens)

## Estimated Complexity

**Medium** - Data aggregation and formatting.

## Context Structure

```typescript
interface DungeonMasterContext {
  // Player history
  totalRuns: number;
  bestFloor: number;
  favoriteRunes: string[];
  recentDeathCauses: string[];

  // Current run
  currentFloor: number;
  currentHP: number;
  currentGold: number;
  equippedRunes: string[];
  recentActions: string[]; // last 10

  // Current situation
  tilesRevealed: number;
  monstersRemaining: number;
  nearDeathMoments: number;

  // Request type
  requestType: 'taunt' | 'hint' | 'mood_update' | 'death' | 'victory';
}
```

## Notes

- Keep context lean for fast responses
- Include enough history for personality
- Track "near death moments" for taunting
