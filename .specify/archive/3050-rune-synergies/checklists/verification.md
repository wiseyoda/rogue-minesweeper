# Verification Checklist: 3050 - Rune Synergies

**Purpose**: Verify implementation quality and completeness after coding  
**Created**: 2026-02-14  
**Feature**: `specs/3050-rune-synergies/spec.md`  
**Phase**: 3050

## Acceptance Criteria Verification

- [x] V-001 US-01 scenarios pass (activation, deactivation, multi-synergy)
- [x] V-002 US-02 scenarios pass (all defined bonus effects)
- [x] V-003 US-03 scenarios pass (discovery notification + active list)
- [x] V-004 Edge cases pass (dedupe, no active synergies, duplicate runes)
- [x] V-005 Existing rune behavior unchanged when no synergies active

## Success Criteria Verification

- [x] V-010 SC-001: All five synergies activate/deactivate correctly under tests
- [x] V-011 SC-002: All synergy bonuses are validated by tests
- [x] V-012 SC-003: Discovery notification appears once per synergy per run
- [x] V-013 SC-004: Multiple simultaneous synergies apply cumulatively
- [x] V-014 SC-005: `pnpm test`, `pnpm lint`, `pnpm typecheck` all pass

## Functional Requirement Verification

- [x] V-020 FR-001: Synergy definitions exist in `src/data/synergies.ts`
- [x] V-021 FR-002/FR-003: Detection engine returns accurate active IDs for single and multiple combos
- [x] V-022 FR-004: Newly-discovered IDs computed correctly against run history
- [x] V-023 FR-005: Greedy applies +50% floor completion bonus
- [x] V-024 FR-006: Fortified Deal applies +1 floor-start shield and +5% shop discount
- [x] V-025 FR-007: Immortal modifies second-chance survival HP correctly
- [x] V-026 FR-008: Seer guarantees prophecy highlight at floor start
- [x] V-027 FR-009: Hunter's Vision grants +1 floor-start safe reveal
- [x] V-028 FR-010/FR-011: Notification payload emitted and component rendered
- [x] V-029 FR-012: Active synergy list rendered in rune sidebar
- [x] V-030 FR-013: Synergy state resets on new run
- [x] V-031 FR-014: No regression to existing rune behavior

## Non-Functional & Quality

- [x] V-040 NFR-001: Synergy engine functions are pure and unit-tested
- [x] V-041 NFR-002: No runtime dependency additions
- [x] V-042 NFR-003: Lint/type/tests pass in CI-local commands
- [x] V-043 NFR-004: Synergy UI is usable on desktop and mobile layouts

## Phase Goal Verification

- [x] V-050 Goal 1: Synergy definition system implemented
- [x] V-051 Goal 2: Combo detection engine implemented
- [x] V-052 Goal 3: Synergy bonus effects implemented
- [x] V-053 Goal 4: Synergy discovery notification implemented
- [x] V-054 Goal 5: Synergy display in UI implemented
