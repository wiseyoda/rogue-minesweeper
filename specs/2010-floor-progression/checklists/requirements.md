# Requirements Checklist: Floor Progression

**Purpose**: Verify all functional requirements from spec.md are properly defined
**Created**: 2026-01-15
**Feature**: specs/2010-floor-progression/spec.md

## Functional Requirements

- [x] REQ-001 FR-001: Scaling logic extracted to `engine/difficulty.ts`
- [x] REQ-002 FR-002: Gold bonus of `level * 10` awarded on floor completion
- [x] REQ-003 FR-003: Player buffs (shields) persist between floors
- [x] REQ-004 FR-004: `FloorConfig` interface exported from difficulty module
- [x] REQ-005 FR-005: `getFloorConfig(level)` function implemented and tested
- [x] REQ-006 FR-006: `MonsterDamageConfig` interface defined (prep only)

## Technical Requirements

- [x] REQ-007 TR-1: `engine/difficulty.ts` file created
- [x] REQ-008 TR-1: `engine/__tests__/difficulty.test.ts` file created
- [x] REQ-009 TR-2: `gameStore.ts` updated to import difficulty functions
- [x] REQ-010 TR-2: `types/game.ts` updated (calculateLevelGridConfig removed)
- [x] REQ-011 TR-2: `WinModal.tsx` displays gold bonus
- [x] REQ-012 TR-3: `DIFFICULTY_CONSTANTS` object contains all tunable values
- [x] REQ-013 TR-4: gameStore uses `getFloorConfig` for level initialization

## Non-Functional Requirements

- [x] REQ-014 NFR-1: All functions fully typed with TypeScript (no `any`)
- [x] REQ-015 NFR-2: Unit tests cover levels 1, 5, 10, 20
- [x] REQ-016 NFR-2: Unit tests cover edge cases (level 0, level 100)
- [x] REQ-017 NFR-3: All tunable values in single constants object

## Acceptance Criteria

- [x] REQ-018 AC-1: `getFloorConfig(level)` returns correct values for levels 1-20
- [x] REQ-019 AC-2: Gold bonus awarded on floor completion (verified in UI)
- [x] REQ-020 AC-3: Player shields carry over between floors
- [x] REQ-021 AC-4: TypeScript compiles with strict mode
- [x] REQ-022 AC-5: All unit tests pass

## Notes

- Check items off as completed: `[x]`
- Items are numbered sequentially for easy reference
- Link to relevant code locations when marking complete
