# Specification: 4010 - AI Context Builder

**Phase**: `4010-ai-context-builder`
**Created**: 2026-02-14
**Status**: Draft

## Overview

Implement the data-contract and state-aggregation layer that produces a compact, typed `DungeonMasterContext` object for future AI provider calls.

### Goals

1. Build the system that collects player history for AI prompts.

### Non-Goals

- Sending requests to external AI providers.
- Rendering DM dialogue in the UI.
- Prompt/personality tuning.

## Phase Goals Coverage

| # | Phase Goal | Spec Requirement(s) | Task(s) | Status |
|---|------------|---------------------|---------|--------|
| 1 | Build the system that collects player history for AI prompts. | FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-008, NFR-002 | T001-T018 | PARTIAL |

## User Scenarios and Testing

### User Story 1 - Build Current Context Snapshot (Priority: P1)

As the AI pipeline, I need a reliable snapshot of the current run so provider calls can react to the player's immediate situation.

**Independent Test**: Build context from mock states and verify all current-run fields are present and accurate.

**Acceptance Scenarios**:

1. **Given** an active run state, **When** context is built, **Then** current floor, HP, gold, equipped runes, revealed tiles, and remaining monsters are serialized.
2. **Given** the last 20 actions, **When** context is built, **Then** only the most recent 10 actions are included in chronological order.

### User Story 2 - Track Historical Signals (Priority: P1)

As the AI pipeline, I need player-history signals so the DM can reference patterns across runs.

**Independent Test**: Add run outcomes to `dungeonStore` and verify aggregated fields (best floor, favorites, death causes) in context.

**Acceptance Scenarios**:

1. **Given** persisted run history, **When** context is built, **Then** total runs, best floor, favorite runes, and recent death causes are derived deterministically.
2. **Given** no history exists, **When** context is built, **Then** history fields fall back to safe defaults (0/empty arrays).

### User Story 3 - Prepare for Rate Limiting (Priority: P2)

As the AI pipeline, I need request window metadata so future provider integration can throttle safely.

**Independent Test**: Simulate repeated request registration and verify window reset and allow/deny decisions.

**Acceptance Scenarios**:

1. **Given** requests within a configured window, **When** checking allowance, **Then** calls are allowed until threshold is reached.
2. **Given** a new time window starts, **When** checking allowance, **Then** counters reset automatically.

### Edge Cases

- Missing grid (`grid = null`) during run initialization should not crash context generation.
- Empty run history should still produce a valid context payload.
- Oversized action history should be truncated deterministically to keep context size predictable.

## Requirements

### Functional Requirements

- **FR-001**: System MUST define typed AI context contracts in `src/types/ai.ts`, including request type and run-history records.
- **FR-002**: System MUST create a `dungeonStore` in `src/stores/dungeonStore.ts` that persists AI-relevant history and action telemetry.
- **FR-003**: System MUST provide a context builder in `src/ai/context.ts` that combines game, meta, and dungeon state into a single object.
- **FR-004**: System MUST include current-run fields in context: `currentFloor`, `currentHP`, `currentGold`, `equippedRunes`, `recentActions`, `tilesRevealed`, `monstersRemaining`.
- **FR-005**: System MUST include history fields in context: `totalRuns`, `bestFloor`, `favoriteRunes`, `recentDeathCauses`, `nearDeathMoments`.
- **FR-006**: System MUST cap `recentActions` to the most recent 10 entries.
- **FR-007**: System MUST expose request-rate tracking helpers in `dungeonStore` for future provider throttling.
- **FR-008**: System MUST include unit tests in `src/ai/__tests__/context.test.ts` validating serialization and aggregation behavior.

### Non-Functional Requirements

- **NFR-001**: Context building MUST be deterministic for identical inputs.
- **NFR-002**: Context payload MUST remain under an estimated 2k-token budget using truncation when needed.
- **NFR-003**: New code MUST pass existing TypeScript, lint, and test quality gates.

### Key Entities

- **DungeonMasterContext**: Final provider-ready payload containing history, current-run snapshot, and request type.
- **DungeonRunRecord**: Persistent run summary used to derive favorite runes and recent death causes.
- **DungeonRateLimitState**: Sliding-window metadata used to prepare request throttling.

## Success Criteria

- **SC-001**: Context builder returns all required fields for each request type with no missing keys.
- **SC-002**: For synthetic large inputs, estimated token size remains `< 2000`.
- **SC-003**: Favorite rune and death-cause aggregation is deterministic and covered by tests.
- **SC-004**: `specflow check --gate implement` passes after implementation tasks complete.
