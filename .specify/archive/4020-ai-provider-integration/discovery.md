# Discovery: 4020 - AI Provider Integration

**Phase**: `4020-ai-provider-integration`
**Created**: 2026-02-15
**Status**: Complete

## Phase Context

**Source**: `.specify/phases/4020-ai-provider-integration.md`
**Goal**: Integrate Vercel AI SDK with Gemini as primary provider, Claude as fallback, structured response parsing, and request throttling/fallback behavior.

---

## Codebase Examination

### Related Implementations

| Location | Description | Relevance |
|----------|-------------|-----------|
| `src/ai/context.ts` | Builds `DungeonMasterContext` payload and enforces token budget trimming. | Upstream input to provider generation; must remain compatible. |
| `src/types/ai.ts` | Defines `DungeonMasterContext`, request types, run telemetry, and rate-limit state shape. | Primary location for new `DungeonMasterResponse` and provider-layer contracts. |
| `src/stores/dungeonStore.ts` | Persists `rateLimit` window counters and helper methods (`canRequestContext`, `registerContextRequest`). | Existing throttling primitive to adapt for provider call pacing. |
| `src/stores/types.ts` | Declares `DungeonStoreState` and action signatures. | Must stay aligned if rate-limit behavior is adjusted. |
| `src/components/sidebar/DMPanel.tsx` | Current static DM panel (`"Your fate unfolds..."`). | Future consumer for generated dialogue; this phase should not couple tightly to UI yet. |
| `package.json` | No AI SDK/provider dependencies currently present. | Requires dependency installation for Vercel AI SDK and provider adapters. |

### Existing Patterns & Conventions

- **Pure helpers in `src/ai/` + tests beside module**: `src/ai/context.ts` and `src/ai/__tests__/context.test.ts` keep logic isolated and highly testable.
- **Store persistence via Zustand + immer**: `dungeonStore` serializes minimal telemetry to localStorage; side effects are encapsulated in actions.
- **Strong typing and explicit JSDoc**: Types and functions include domain docs and small focused interfaces.
- **Path alias imports (`@/`)**: Preferred import style for internal modules.

### Integration Points

- **Provider orchestration layer**: New modules should live in `src/ai/` (`providers.ts`, `generate.ts`, `parser.ts`, `fallback.ts`) and be consumed by upcoming DM trigger/UI phases.
- **Rate-limiting**: Reuse existing store window metadata where practical, but enforce the phase-level requirement of max one provider request every 30 seconds.
- **Environment configuration**: Add provider keys in `.env.example` and isolate env parsing in one config module.
- **Type exports**: New AI contracts should be exported from `src/types/index.ts`.

### Constraints Discovered

- **Frontend-only runtime**: The current app is client-rendered with Vite; `VITE_*` env vars are public. Secret management is out-of-scope for this phase and should be documented as a known risk.
- **No provider SDK dependencies yet**: Must add and lock required packages before implementation.
- **No current generation pipeline**: Context builder exists, but no provider call/parsing/fallback pipeline is implemented.
- **Phase boundary**: UI dialogue rendering and personality prompt tuning belong primarily to later phases (4030/4040).

---

## Requirements Sources

### From Phase File (`.specify/phases/4020-ai-provider-integration.md`)

- Integrate Vercel AI SDK.
- Configure Gemini provider as primary.
- Configure Claude provider as fallback.
- Parse provider responses into `DungeonMasterResponse`.
- Add error handling and pre-written fallback lines.
- Add rate limiting to avoid spam.

### From Memory Documents

- **Constitution Principle II (Dungeon Is Alive)**: AI responses must support consistent dungeon personality downstream.
- **Constitution Principle VII (Move Fast, Iterate Often)**: Deliver a narrow but working provider abstraction in this phase.
- **Tech Stack**: Approved AI stack is Vercel AI SDK + Gemini + Claude; optional GPT remains future-compatible.

### From Existing Code

- Existing `DungeonMasterContext` shape in `src/types/ai.ts` is the input contract for generation.
- Existing `DungeonRateLimitState` and store helpers can anchor throttling implementation.

---

## Scope Clarification

### Confirmed Understanding

**What this phase will do**:
- Add provider configuration and a generation wrapper that attempts Gemini first, then Claude, then local fallback lines.
- Parse model output into a strict `DungeonMasterResponse` shape.
- Enforce a 30-second request cooldown before external provider calls.
- Include deterministic tests for parser, limiter, and fallback sequencing.

**What this phase will not do**:
- Build final DM dialogue UI/animation behavior.
- Implement full personality prompt library (deeper tuning in 4040).
- Solve production-grade secret storage beyond documenting env setup.

**User confirmed**: Implicit via `/flow-orchestrate` run; no blocking ambiguity remains.

---

## Recommendations for SPECIFY

### Should Include in Spec

- Strict `DungeonMasterResponse` validation contract.
- Provider fallback order and failure handling rules.
- Explicit cooldown requirement (1 call per 30s).
- Local fallback lines contract to preserve gameplay continuity.

### Should Exclude from Spec (Non-Goals)

- UI rendering concerns (dialogue placement/animation).
- Remote proxy/server-side key management.
- Multi-provider ranking/experimentation beyond Gemini→Claude fallback.

### Potential Risks

- Browser env key exposure if used directly in production builds.
- Provider output drift requiring parser hardening.
- Test fragility if provider SDK APIs change.

### Questions Deferred to Later Phases

- Exact personality prompt corpus and mood progression heuristics.
- UI timing/queue behavior for when dialogue interrupts gameplay.
