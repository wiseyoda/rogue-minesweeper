# Implementation Plan: 4010 - AI Context Builder

**Branch**: `4010-ai-context-builder` | **Date**: 2026-02-14 | **Spec**: `specs/4010-ai-context-builder/spec.md`

## Summary

Add the AI context domain layer by introducing new AI-specific types, a dedicated persisted `dungeonStore` for history telemetry, and pure context-builder utilities that serialize current run + history into a bounded payload.

## Technical Context

**Language/Version**: TypeScript 5.x  
**Primary Dependencies**: React, Zustand, Immer (existing project stack only)  
**Storage**: LocalStorage via Zustand `persist` middleware  
**Testing**: Vitest + existing unit-test patterns  
**Target Platform**: Browser (Vite web app)  
**Project Type**: Single project  
**Performance Goals**: Context build should be synchronous and sub-millisecond for typical state sizes  
**Constraints**: Keep payload compact (<2k estimated tokens), deterministic aggregation rules, no provider integration in this phase  
**Scale/Scope**: 4 primary deliverables, 15-20 tasks

## Constitution Check

- **Principle II: The Dungeon Is Alive**: Satisfied by introducing player-history capture and near-death telemetry.
- **Principle VII: Move Fast, Iterate Often**: Scope is limited to context preparation; provider/network complexity deferred.
- **Technology Stack Compliance**: Uses only approved tools from `tech-stack.md`.

## Project Structure (This Phase)

```text
specs/4010-ai-context-builder/
├── discovery.md
├── spec.md
├── requirements.md
├── plan.md
├── tasks.md
└── checklists/
    ├── implementation.md
    └── verification.md

src/
├── ai/
│   ├── context.ts
│   └── __tests__/context.test.ts
├── stores/
│   ├── dungeonStore.ts
│   ├── index.ts
│   ├── types.ts
│   └── __tests__/dungeonStore.test.ts
└── types/
    ├── ai.ts
    └── index.ts
```

## Implementation Phases

1. **Contracts and Typing**
   - Define AI request/context/history/rate-limit types.
   - Wire exports through central type barrel.

2. **State Foundation**
   - Add `dungeonStore` with persisted run history, action queue, near-death tracking, and rate-window metadata.
   - Expose actions for recording run results and requests.

3. **Context Builder**
   - Build pure helpers for aggregation (favorite runes, death causes, monsters remaining).
   - Add builder entry points (raw-state and from live stores).
   - Enforce action truncation and token budget guard.

4. **Validation**
   - Add focused unit tests for context and dungeon store behavior.
   - Run typecheck, lint, and test commands.

## Risks and Mitigations

- **Risk**: Context shape drifts from future provider expectations.
  - **Mitigation**: Keep contracts centralized in `src/types/ai.ts` and test against required fields.
- **Risk**: Payload size grows as history accumulates.
  - **Mitigation**: Hard caps on action/death arrays and estimated-token guard.
- **Risk**: Store persistence bugs produce stale context.
  - **Mitigation**: Unit tests for reset/window behavior and state transitions.
