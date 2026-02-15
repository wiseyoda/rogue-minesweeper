# Feature Specification: 4020 - AI Provider Integration

**Feature Branch**: `4020-ai-provider-integration`
**Created**: 2026-02-15
**Status**: Draft
**Input**: User description: `/flow-orchestrate`

## User Scenarios & Testing

### User Story 1 - Primary Provider Response (Priority: P1)

As a player, I want the Dungeon Master system to generate dialogue from Gemini by default so that AI responses are fast and consistent with the planned provider stack.

**Why this priority**: Provider connectivity is the core objective of this phase and blocks all downstream AI DM features.

**Independent Test**: With Gemini configured, call the generation API using a sample `DungeonMasterContext` and verify a valid `DungeonMasterResponse` is returned without fallback.

**Acceptance Scenarios**:

1. **Given** a valid Gemini API key and valid context, **When** generation is requested, **Then** the system calls Gemini first and returns a parsed `DungeonMasterResponse`.
2. **Given** missing Claude key but valid Gemini key, **When** generation is requested, **Then** the system still succeeds via Gemini without requiring fallback.

---

### User Story 2 - Provider Failover and Local Fallback (Priority: P2)

As a player, I want the game to keep producing DM lines even when provider requests fail so that gameplay feedback never stalls.

**Why this priority**: Runtime resilience is required for a playable AI layer and is explicitly in phase goals.

**Independent Test**: Mock Gemini failure and Claude success; then mock both failures and verify local fallback lines are returned.

**Acceptance Scenarios**:

1. **Given** Gemini fails and Claude is configured, **When** generation is requested, **Then** Claude is attempted and its valid response is returned.
2. **Given** both providers fail or are unconfigured, **When** generation is requested, **Then** a deterministic local fallback line is returned with a valid mood.

---

### User Story 3 - Structured Response Parsing (Priority: P3)

As a developer, I want all model responses parsed into a strict contract so that downstream UI and trigger logic can rely on type-safe DM output.

**Why this priority**: Without strict parsing, provider output drift causes runtime breakage in later DM phases.

**Independent Test**: Feed raw model output strings (valid JSON, malformed JSON, partial JSON) into parser and verify normalized output or explicit parse failure.

**Acceptance Scenarios**:

1. **Given** valid JSON matching `DungeonMasterResponse`, **When** parser runs, **Then** it returns a typed object with allowed mood values.
2. **Given** malformed or incomplete JSON, **When** parser runs, **Then** it returns a parser error and generation wrapper triggers fallback behavior.

---

### User Story 4 - Request Cooldown (Priority: P4)

As a player, I want the DM request system to limit provider calls so that accidental spam does not flood APIs or degrade play.

**Why this priority**: Cost and reliability protection; required by phase notes and roadmap gate.

**Independent Test**: Trigger two generation calls within 30 seconds and verify second call does not hit provider APIs.

**Acceptance Scenarios**:

1. **Given** a successful provider call at time `t`, **When** another request occurs before `t + 30s`, **Then** provider calls are skipped and a fallback line is returned.
2. **Given** cooldown window has elapsed, **When** request is made, **Then** provider call is allowed again.

---

### Edge Cases

- What happens when provider returns non-JSON prose despite JSON instructions? Parser fails and fallback sequence continues.
- What happens when only one provider key is configured? Generation still works with available provider and then local fallback.
- What happens when a provider call hangs beyond timeout? Wrapper treats timeout as failure and advances fallback chain.
- What happens when `difficultyAdjustment` is outside expected range? Parser clamps/normalizes to `-1..1`.

## Requirements

### Functional Requirements

- **FR-001**: System MUST expose provider configuration for Gemini and Claude using Vercel AI SDK adapters.
- **FR-002**: System MUST attempt Gemini as the primary provider for generation.
- **FR-003**: System MUST attempt Claude as fallback when Gemini call fails, times out, or returns unparsable output.
- **FR-004**: System MUST return a local fallback line when provider attempts are unavailable or fail.
- **FR-005**: System MUST parse and validate model output into `DungeonMasterResponse` with fields:
  - `dialogue: string`
  - `mood: 'amused' | 'bored' | 'impressed' | 'vengeful' | 'curious'`
  - `difficultyAdjustment?: number` (normalized to `-1..1`)
  - `hintType?: 'rune_synergy' | 'monster_warning' | 'safe_path'`
  - `hintContent?: string`
- **FR-006**: System MUST enforce provider-call cooldown of 30 seconds between successful provider requests.
- **FR-007**: System MUST return metadata indicating generation source (`gemini`, `claude`, or `fallback`) for downstream observability.
- **FR-008**: System MUST provide deterministic fallback selection for tests (injectable RNG/selector).

### Non-Functional Requirements

- **NFR-001**: Implementation MUST avoid storing raw API keys in persisted stores or logs.
- **NFR-002**: Provider-call wrapper MUST be unit-testable without real network calls (dependency injection/mocking).
- **NFR-003**: TypeScript strict mode and ESLint MUST pass for all new AI integration modules.
- **NFR-004**: Provider timeout handling MUST cap each provider attempt to a bounded duration.

### Key Entities

- **DungeonMasterResponse**: Parsed DM output contract returned by generation wrapper.
- **ProviderCandidate**: Internal provider descriptor for ordered fallback attempts.
- **GenerationResult**: Wrapper result containing response payload and generation source metadata.
- **ProviderCooldownState**: Runtime cooldown helper derived from persisted dungeon rate-limit metadata.

## Success Criteria

### Measurable Outcomes

- **SC-001**: With Gemini available and mocked response valid, wrapper returns `source='gemini'` and valid `DungeonMasterResponse` in tests.
- **SC-002**: With Gemini failing and Claude succeeding, wrapper returns `source='claude'` and valid `DungeonMasterResponse`.
- **SC-003**: With both providers failing or disabled, wrapper returns `source='fallback'` with non-empty dialogue and valid mood.
- **SC-004**: Cooldown tests verify no provider invocation occurs for requests made within 30 seconds of prior provider success.

## Phase Goals Coverage

| # | Phase Goal | Requirement Coverage | Status |
|---|------------|----------------------|--------|
| 1 | Integrate Vercel AI SDK with multiple providers | FR-001, FR-002, FR-003 | COVERED |
| 2 | Configure Gemini provider (primary) | FR-001, FR-002 | COVERED |
| 3 | Configure Claude provider (fallback) | FR-001, FR-003 | COVERED |
| 4 | Implement response parsing | FR-005 | COVERED |
| 5 | Implement error handling and fallbacks | FR-003, FR-004, FR-008 | COVERED |
| 6 | Implement rate limiting | FR-006, NFR-004 | COVERED |

---

## Memory Promotion Markers

- `[PROMOTE]` Keep AI provider orchestration behind a pure, testable wrapper (`generate.ts`) so UI phases can integrate without network coupling.
