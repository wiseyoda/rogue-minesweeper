# Discovery: 4010 - AI Context Builder

**Phase**: `4010-ai-context-builder`
**Created**: 2026-02-14
**Status**: Complete

## Phase Context

**Source**: `.specify/phases/4010-ai-context-builder.md`
**Goal**: Build the system that collects player history and current run state for AI prompt generation.

## Codebase Examination

### Related Implementations

| Location | Description | Relevance |
|----------|-------------|-----------|
| `src/stores/gameStore.ts` | Holds current run state (floor, HP/lives, gold, runes, revealed count) and floor transitions. | Primary source for current-run serialization. |
| `src/stores/metaStore.ts` | Persists long-term stats (`totalRuns`, `highestLevelOverall`, `maxGoldRun`). | Primary source for historical aggregate metrics. |
| `src/types/game.ts` | Defines `GameStats` and `RunState` types. | Required to keep AI context typing aligned with domain types. |
| `src/stores/types.ts` | Canonical pattern for Zustand store state/action interfaces. | New `dungeonStore` must follow this pattern. |
| `src/stores/index.ts` | Central store export surface. | New store must be exported here for app-wide use. |

### Existing Patterns and Conventions

- **Store architecture**: Zustand + `devtools` + `immer`; persisted stores use `persist` middleware.
- **Type ownership**: Shared domain types live in `src/types/*`; central re-exports in `src/types/index.ts`.
- **Testing style**: Vitest with direct store state assertions (`useXStore.getState()` + `setState` reset pattern).
- **Module style**: File-level module comments and strongly typed helpers.

### Integration Points

- **`gameStore` -> context builder**: Current run values and board-derived metrics (`tilesRevealed`, `monstersRemaining`).
- **`metaStore` -> context builder**: Lifetime progression signals (`totalRuns`, `bestFloor`).
- **`dungeonStore` -> context builder**: Recent action stream, death causes, near-death counters, request-rate metadata.

### Constraints Discovered

- `src/ai/` and `src/stores/dungeonStore.ts` do not exist yet; this phase starts from zero for AI context code.
- Historical death causes and action logs are not currently captured anywhere; the phase must establish this source of truth.
- Context payload must stay compact for future provider requests (<2k tokens target from phase gate).

## Requirements Sources

### From Phase File

- Build player history tracking.
- Collect run statistics.
- Serialize current state.
- Build request-ready AI context.
- Add rate limiting preparation hooks.

### From Memory Documents

- **Constitution Principle II (Dungeon Is Alive)**: AI context must preserve player history and react to player behavior.
- **Tech Stack**: Use TypeScript + Zustand patterns already established; do not introduce new state libraries.

## Scope Clarification

No additional clarification questions were required for this phase because the phase definition already specifies required context fields and deliverables.

### Confirmed Understanding

**What this phase delivers**:
- Typed AI context contracts.
- A deterministic context builder that combines game, meta, and dungeon history state.
- A dedicated `dungeonStore` for history/action/rate-limit tracking.
- Unit tests validating serialization and size constraints.

**What this phase does not deliver**:
- AI provider calls.
- Prompt templates/personality tuning.
- UI for Dungeon Master dialogue.

## Recommendations for Specify

### Should Include in Spec

- Explicit context schema and request type enum.
- Deterministic aggregation rules (favorite runes, recent deaths, action window).
- Size budget behavior (truncate to remain under target token count).

### Should Exclude from Spec

- Provider/network logic (phase 4020).
- Dialogue rendering UI (phase 4030).

### Risks

- If history capture is too sparse, DM responses will feel generic.
- If payload growth is unmanaged, provider latency/cost will rise.
