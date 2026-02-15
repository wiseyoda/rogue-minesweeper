# Implementation Plan: 4020 - AI Provider Integration

**Branch**: `4020-ai-provider-integration` | **Date**: 2026-02-15 | **Spec**: `specs/4020-ai-provider-integration/spec.md`
**Input**: Feature specification from `/specs/4020-ai-provider-integration/spec.md`

## Summary

Implement a provider orchestration layer in `src/ai/` that uses Vercel AI SDK to call Gemini first, falls back to Claude on error/unparsable output, then returns deterministic local fallback lines. Add strict response parsing and 30-second cooldown enforcement.

## Technical Context

**Language/Version**: TypeScript 5.x (strict)  
**Primary Dependencies**: `ai`, `@ai-sdk/google`, `@ai-sdk/anthropic`, `zod`  
**Storage**: Existing localStorage via Zustand persist (no new storage)  
**Testing**: Vitest 4.x  
**Target Platform**: Browser (Vite app)  
**Project Type**: Single web application  
**Performance Goals**: Provider wrapper remains non-blocking with bounded per-provider timeout  
**Constraints**: 30-second provider cooldown; no secret leakage to logs/persisted state  
**Scale/Scope**: One generation pipeline + parser + fallback library + tests

## Constitution Check

- **Principle II (Dungeon Is Alive)**: PASS. This phase enables the AI reaction layer required for living dungeon behavior.
- **Principle V (Passive Mastery)**: PASS. No active ability UI introduced.
- **Principle VII (Move Fast, Iterate Often)**: PASS. Implementation is modular and test-first with minimal coupling to future UI/prompt phases.
- **Risk Note**: Browser env vars are not secret. This phase documents config shape only; production secret proxying can be addressed in later infrastructure hardening.

## Project Structure

### Documentation (this feature)

```text
specs/4020-ai-provider-integration/
├── discovery.md
├── spec.md
├── requirements.md
├── plan.md
├── tasks.md
└── checklists/
    ├── implementation.md
    └── verification.md
```

### Source Code (repository root)

```text
src/
├── ai/
│   ├── context.ts                # Existing context builder (input)
│   ├── fallback.ts               # New fallback message catalog
│   ├── parser.ts                 # New strict response parsing
│   ├── providers.ts              # New provider client setup
│   ├── generate.ts               # New orchestration wrapper
│   └── __tests__/
│       ├── context.test.ts       # Existing tests
│       ├── parser.test.ts        # New
│       └── generate.test.ts      # New
├── types/
│   ├── ai.ts                     # Extend AI response/result contracts
│   └── index.ts                  # Re-export new contracts
└── stores/
    └── dungeonStore.ts           # Optional small cooldown helper alignment

.env.example                      # New env contract documentation
```

**Structure Decision**: Keep all provider integration isolated under `src/ai/` and expose typed entrypoints for later trigger/UI phases.

## Design Decisions

1. **Provider abstraction wrapper**
- Create an injectable `createDungeonMasterGenerator` factory to support test doubles and avoid hard SDK coupling in tests.

2. **Strict parser-first contract**
- Parse every provider output through a shared parser before returning response.
- Treat parse failure as provider failure to preserve strong downstream typing.

3. **Fallback sequence**
- Order: `gemini -> claude -> localFallback`.
- Return generation metadata (`source`, `providerError`) for diagnostics.

4. **Cooldown behavior**
- Track last successful provider invocation timestamp and block provider calls for 30 seconds.
- During cooldown, skip provider attempts and return local fallback immediately.

5. **Config isolation**
- Keep env parsing in a dedicated helper to avoid `import.meta.env` scattering.

## Testing Strategy

- **Unit tests (`parser.test.ts`)**:
  - valid payload parse
  - malformed JSON handling
  - enum/field normalization
- **Unit tests (`generate.test.ts`)**:
  - Gemini success short-circuit
  - Gemini failure -> Claude success
  - dual-provider failure -> local fallback
  - cooldown blocks provider calls
  - deterministic fallback selection
- **Type-level checks**:
  - compile-time validation of new response/result interfaces

## Dependencies and Risks

### New Dependencies
- `ai`
- `@ai-sdk/google`
- `@ai-sdk/anthropic`
- `zod`

### Risks
- SDK API surface drift: mitigate with narrow adapter wrapper and tests.
- Browser key exposure: document clearly in `.env.example`; avoid persistence/logging.
- Provider output inconsistency: mitigate with strict parser and fallback line safety net.

## Deferred Items

- Personality prompt tuning and voice consistency (Phase 4040)
- Dialogue rendering, animations, and mood indicator UI (Phase 4030)
- Server-side proxying of API keys (future infra hardening)

## Memory Promotion Markers

- `[MEMORY]` For external AI providers, always parse model output through a shared schema and fail closed into deterministic fallback lines.
