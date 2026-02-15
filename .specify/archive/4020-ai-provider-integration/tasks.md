# Tasks: 4020 - AI Provider Integration

## Phase Goals Coverage

| # | Phase Goal | Spec Requirement(s) | Task(s) | Status |
|---|------------|---------------------|---------|--------|
| 1 | Integrate Vercel AI SDK with multiple providers | FR-001, FR-002, FR-003 | T001-T007 | COVERED |
| 2 | Configure Gemini provider (primary) | FR-001, FR-002 | T005, T007, T012 | COVERED |
| 3 | Configure Claude provider (fallback) | FR-001, FR-003 | T005, T007, T013 | COVERED |
| 4 | Implement response parsing | FR-005 | T004, T008, T014 | COVERED |
| 5 | Implement error handling and fallbacks | FR-003, FR-004, FR-008 | T003, T007, T013, T015 | COVERED |
| 6 | Implement rate limiting | FR-006, NFR-004 | T006, T007, T016 | COVERED |

Coverage: 6/6 goals (100%)

---

## Progress Dashboard

> Last updated: 2026-02-15T10:25:00-05:00

| Phase | Status | Progress |
|-------|--------|----------|
| Setup | PENDING | 0/2 |
| Foundational | PENDING | 0/6 |
| User Story 1 (Gemini Primary) | PENDING | 0/2 |
| User Story 2 (Fallback Chain) | PENDING | 0/2 |
| User Story 3 (Parser Contract) | PENDING | 0/2 |
| User Story 4 (Cooldown) | PENDING | 0/2 |
| Polish | PENDING | 0/2 |

**Overall**: 0/18 (0%) | **Current**: None

---

**Input**: Design documents from `/specs/4020-ai-provider-integration/`
**Prerequisites**: `plan.md`, `spec.md`
**Tests**: Required for parser, generator fallback order, and cooldown behavior

## Requirements Coverage

| Requirement | Has Task? | Task IDs |
|-------------|-----------|----------|
| FR-001 | Yes | T001, T005, T007 |
| FR-002 | Yes | T005, T007, T010 |
| FR-003 | Yes | T005, T007, T011 |
| FR-004 | Yes | T003, T007, T012 |
| FR-005 | Yes | T004, T008, T009, T013, T014 |
| FR-006 | Yes | T006, T007, T015, T016 |
| FR-007 | Yes | T007, T008, T010 |
| FR-008 | Yes | T003, T007, T012, T016 |
| NFR-001 | Yes | T002, T005, T007 |
| NFR-002 | Yes | T007, T009, T010, T011, T012, T016 |
| NFR-003 | Yes | T017, T018 |
| NFR-004 | Yes | T005, T006, T007, T015 |

## Phase 1: Setup

- [x] T001 Add AI dependencies (`ai`, `@ai-sdk/google`, `@ai-sdk/anthropic`, `zod`) to `package.json`
- [x] T002 Create `.env.example` with `VITE_GEMINI_API_KEY`, `VITE_CLAUDE_API_KEY`, and provider timeout/cooldown config defaults

---

## Phase 2: Foundational (Blocking)

- [x] T003 Create local fallback catalog + helper in `src/ai/fallback.ts`
- [x] T004 Create strict response parser and schema in `src/ai/parser.ts`
- [x] T005 Create provider configuration helpers in `src/ai/providers.ts`
- [x] T006 Create cooldown utility (30-second gate) in `src/ai/rateLimit.ts`
- [x] T007 Create generation orchestration wrapper in `src/ai/generate.ts` (Gemini -> Claude -> fallback)
- [x] T008 Extend AI contracts and exports in `src/types/ai.ts` and `src/types/index.ts`

---

## Phase 3: User Story 1 - Gemini Primary (P1)

- [x] T009 [P] [US1] Add parser unit tests for valid Gemini response payloads in `src/ai/__tests__/parser.test.ts`
- [x] T010 [US1] Add generator unit test ensuring Gemini success short-circuits fallback chain in `src/ai/__tests__/generate.test.ts`

---

## Phase 4: User Story 2 - Fallback Chain (P2)

- [x] T011 [P] [US2] Add generator unit test for Gemini failure -> Claude success in `src/ai/__tests__/generate.test.ts`
- [x] T012 [US2] Add generator unit test for provider-unavailable/double-failure -> local fallback in `src/ai/__tests__/generate.test.ts`

---

## Phase 5: User Story 3 - Parser Contract (P3)

- [x] T013 [P] [US3] Add parser unit tests for malformed/partial payload failure cases in `src/ai/__tests__/parser.test.ts`
- [x] T014 [US3] Add parser unit tests for optional field normalization (`difficultyAdjustment`, `hintType`) in `src/ai/__tests__/parser.test.ts`

---

## Phase 6: User Story 4 - Cooldown Enforcement (P4)

- [x] T015 [P] [US4] Add cooldown utility unit tests for 30-second gating in `src/ai/__tests__/rateLimit.test.ts`
- [x] T016 [US4] Add generator unit test verifying cooldown skips provider calls and returns fallback in `src/ai/__tests__/generate.test.ts`

---

## Phase 7: Polish & Cross-Cutting

- [x] T017 Run and fix targeted AI tests via `pnpm vitest src/ai/__tests__`
- [x] T018 Run and fix full quality gates: `pnpm lint && pnpm typecheck && pnpm test:run`

---

## Dependencies & Execution Order

- T001-T002 before all code changes.
- T003-T008 are foundational and block user story validation tasks.
- T009-T016 may run after T003-T008, with `[P]` tasks parallelizable.
- T017-T018 run after implementation and tests are complete.

## Notes

- Task IDs follow CLI parse format `- [ ] T### ...`.
- Keep provider interactions injectable/mocked in tests to avoid live network calls.
- Preserve deterministic fallback behavior for repeatable CI results.
