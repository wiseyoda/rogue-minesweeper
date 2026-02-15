# Requirements Checklist: 4020 - AI Provider Integration

## Functional Requirements

### FR-001: Provider Configuration
- [ ] Gemini and Claude provider adapters are defined using Vercel AI SDK packages
- [ ] Provider configuration handles missing API keys safely

### FR-002: Gemini Primary Path
- [ ] Generation wrapper attempts Gemini first
- [ ] Successful Gemini response returns `source='gemini'`

### FR-003: Claude Fallback Path
- [ ] Claude attempt is triggered after Gemini failure or invalid output
- [ ] Successful Claude response returns `source='claude'`

### FR-004: Local Fallback Path
- [ ] Local fallback lines exist for each supported mood/request context
- [ ] Wrapper returns `source='fallback'` when both providers fail or are unavailable

### FR-005: Response Parsing
- [ ] Parser validates required fields for `DungeonMasterResponse`
- [ ] Mood values are constrained to allowed enum
- [ ] Optional fields (`difficultyAdjustment`, `hintType`, `hintContent`) are validated/normalized

### FR-006: Cooldown Enforcement
- [ ] Provider call is blocked when 30-second cooldown is active
- [ ] Cooldown expires correctly and allows subsequent provider call

### FR-007: Source Metadata
- [ ] Generation result includes explicit source metadata (`gemini`/`claude`/`fallback`)

### FR-008: Deterministic Fallback Selection
- [ ] Fallback selection logic can be deterministic under test

## Non-Functional Requirements

### NFR-001: Secret Safety
- [ ] API keys are read from env/config only
- [ ] No API key values are logged or persisted in stores

### NFR-002: Testability
- [ ] Provider invocations are mockable in unit tests
- [ ] Network-free tests cover parser, fallback chain, and cooldown

### NFR-003: Quality Gates
- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes
- [ ] `pnpm test:run` passes for AI modules

### NFR-004: Timeout Boundaries
- [ ] Provider call timeout is explicitly configured and tested

## Success Criteria Traceability

| Success Criteria | Mapped Requirements |
|------------------|---------------------|
| SC-001 | FR-001, FR-002, FR-005 |
| SC-002 | FR-001, FR-003, FR-005 |
| SC-003 | FR-004, FR-005, FR-008 |
| SC-004 | FR-006, NFR-004 |
