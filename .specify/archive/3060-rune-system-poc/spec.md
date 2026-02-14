# Feature Specification: 3060 - Rune System POC

**Feature Branch**: `3060-rune-system-poc`
**Created**: 2026-02-14
**Status**: Draft
**Input**: Phase file `.specify/phases/3060-rune-system-poc.md`

## Overview

Phase 3060 finalizes the rune milestone into a playable POC by wiring tile-based rune drops into the existing shop loop, preserving synergy discovery, and defining measurable build-diversity verification for the USER GATE.

## User Scenarios & Testing

### User Story 1 - Earn Runes Through Play (Priority: P1)

As a player clearing tiles, I want runes to drop from revealed tiles so that floor gameplay directly influences my build options.

**Independent Test**: Complete a floor while revealing safe tiles and confirm dropped runes appear as purchasable rune offers in the next shop.

**Acceptance Scenarios**:

1. **Given** the player reveals safe tiles during gameplay, **When** tile-drop RNG succeeds, **Then** dropped rune offers are recorded for the current floor.
2. **Given** the floor transitions to shop, **When** rune offers are generated, **Then** dropped rune offers are included in the shop rune list.

### User Story 2 - Buildcraft Through Rune Economy (Priority: P1)

As a player, I want to buy runes with existing pricing modifiers so that economy choices and rune effects remain meaningful.

**Independent Test**: Purchase dropped and non-dropped rune offers while using discount/increase runes and confirm final prices are applied correctly.

**Acceptance Scenarios**:

1. **Given** shop modifiers are active, **When** purchasing any rune offer, **Then** the final rune price uses existing modifier logic.
2. **Given** max rune slots are full, **When** selecting a rune offer, **Then** replacement flow and fees continue to work.

### User Story 3 - Discover Synergies And Distinct Builds (Priority: P2)

As a player, I want synergies to be discoverable and impactful so that different rune combinations create distinct run outcomes.

**Independent Test**: Activate at least three known synergy combinations and verify discovery notifications, active synergy listing, and passive effects.

**Acceptance Scenarios**:

1. **Given** a valid rune combination is equipped, **When** run state refreshes, **Then** active synergy IDs and discovery tracking update correctly.
2. **Given** a newly discovered synergy is activated, **When** the UI updates, **Then** a discovery notification is shown and can be dismissed.

### Edge Cases

- What happens when tile-drop RNG produces duplicate rune IDs in a single floor?
- What happens when no tile drops occur on a floor (shop must still provide baseline rune offers)?
- What happens when drop chance and floor scaling would exceed balance caps?

## Requirements

### Functional Requirements

- **FR-001**: System MUST expose at least 10 purchasable runes from the unified rune catalog (`src/data/runes.ts`).
- **FR-002**: System MUST roll rune-drop chances during safe tile reveal events using configurable balance constants.
- **FR-003**: System MUST carry dropped rune offers into the subsequent floor shop rune offerings.
- **FR-004**: System MUST preserve existing rune purchase pricing logic (discount/increase/replacement fees) for both dropped and baseline rune offers.
- **FR-005**: System MUST preserve synergy activation, discovery tracking, and UI discoverability during and after tile-drop integration.
- **FR-006**: System MUST cap rune-drop frequency per floor to maintain balance and prevent economy breakage.

### Non-Functional Requirements

- **NFR-001**: Tile-drop integration MUST remain fully covered by deterministic unit/integration tests through controlled RNG mocking.
- **NFR-002**: Existing shop and synergy test suites MUST pass without regression.
- **NFR-003**: Implementation MUST conform to passive-only rune behavior (no active ability controls).

## Success Criteria

- **SC-001**: Automated tests confirm rune catalog size is `>= 10` and includes all expected categories.
- **SC-002**: Automated store integration test confirms at least one dropped rune can appear in shop offers and be purchased.
- **SC-003**: Automated regression test confirms synergy discovery/notification still works after drop integration.
- **SC-004**: USER GATE manual playtest confirms distinct build archetypes (information/tank/gold/hybrid) feel different in practice.

## Phase Goals Coverage

| # | Phase Goal | Spec Requirement(s) | Status |
|---|------------|---------------------|--------|
| 1 | Playable game with 10+ runes and synergies | FR-001, FR-005, SC-001, SC-003 | PARTIAL |
| 2 | Integrate all runes from previous phases | FR-001, FR-004 | PARTIAL |
| 3 | Runes drop from revealed tiles | FR-002, FR-003, FR-006 | PARTIAL |
| 4 | Runes purchasable in shop | FR-004, SC-002 | PARTIAL |
| 5 | Synergies discoverable and apply bonuses | FR-005, SC-003 | PARTIAL |
| 6 | Balance tuning yields distinct viable builds | FR-006, NFR-001, SC-004 | PARTIAL |

All goals have requirement-level coverage and are ready for task mapping.
