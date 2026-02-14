# Feature Specification: Rune Synergies

**Feature Branch**: `3050-rune-synergies`
**Created**: 2026-02-14
**Status**: Draft
**Input**: Phase file `.specify/phases/3050-rune-synergies.md`

## User Scenarios & Testing

### User Story 1 - Discovering Rune Combos (Priority: P1)

As a player building a rune loadout, I want synergy combos to activate automatically when I equip specific rune pairs so that build planning feels rewarding and discoverable.

**Why this priority**: Combo detection is the core phase objective and blocks all other synergy behavior.

**Independent Test**: Equip required runes for each defined synergy and confirm active synergy IDs update immediately.

**Acceptance Scenarios**:

1. **Given** the player equips a required rune pair, **When** synergy detection runs, **Then** the matching synergy becomes active.
2. **Given** the player removes a required rune, **When** detection runs, **Then** the synergy deactivates.
3. **Given** the player has rune sets for multiple synergies, **When** detection runs, **Then** all matching synergies are active simultaneously.

### User Story 2 - Receiving Synergy Bonuses (Priority: P1)

As a player, I want active synergies to grant passive bonuses so that combos change outcomes during floor start, shopping, and combat.

**Why this priority**: Detection without gameplay impact would fail phase goals.

**Independent Test**: Activate a synergy and verify modified values at target hook points (floor bonus, shields, second-chance HP, prophecy trigger, shop prices).

**Acceptance Scenarios**:

1. **Given** Greedy is active, **When** floor completes, **Then** floor completion gold bonus is increased by 50%.
2. **Given** Fortified Deal is active, **When** a new floor starts, **Then** player gains +1 extra shield and +5% additional shop discount.
3. **Given** Immortal is active, **When** Second Chance prevents death, **Then** player survives with one additional HP versus baseline.
4. **Given** Seer is active, **When** floor starts, **Then** prophecy highlight is guaranteed.

### User Story 3 - Seeing Discovery Feedback (Priority: P2)

As a player, I want a clear discovery notification and active synergy list so that I understand when combos unlock and what effects are currently active.

**Why this priority**: Communication is required by the phase verification gate and makes bonuses legible.

**Independent Test**: Trigger a first-time synergy activation and verify one notification appears; verify active synergies are visible in the sidebar UI.

**Acceptance Scenarios**:

1. **Given** a synergy is activated for the first time in the run, **When** activation occurs, **Then** a discovery notification appears with synergy name and effect summary.
2. **Given** a discovered synergy deactivates and later reactivates, **When** reactivation occurs, **Then** no duplicate first-discovery notification appears.
3. **Given** one or more synergies are active, **When** the sidebar renders, **Then** each active synergy is listed.

### Edge Cases

- Equipping duplicate stackable runes should not break pair-based synergy checks.
- A synergy requiring non-stackable runes should still activate deterministically.
- Discovery notification should not trigger during run initialization when no new synergy was actually discovered.
- Synergy modifiers should compose safely with existing rune modifiers and respect minimum price constraints.

## Requirements

### Functional Requirements

- **FR-001**: System MUST define synergy data in a dedicated source file with stable IDs, names, required rune IDs, and passive effect descriptors.
- **FR-002**: System MUST expose a pure detection function that returns all active synergies for a given `equippedRunes` array.
- **FR-003**: System MUST support simultaneous activation of multiple synergies.
- **FR-004**: System MUST track first-time discoveries per run and return newly discovered synergy IDs.
- **FR-005**: System MUST apply Greedy bonus as +50% floor completion gold bonus.
- **FR-006**: System MUST apply Fortified Deal bonuses as +1 floor-start shield and +5% additional shop discount.
- **FR-007**: System MUST apply Immortal bonus so Second Chance leaves one additional HP compared to baseline behavior.
- **FR-008**: System MUST apply Seer bonus to guarantee prophecy highlight at floor start.
- **FR-009**: System MUST apply Hunter's Vision bonus as +1 additional safe tile reveal at floor start.
- **FR-010**: System MUST generate a discovery notification payload when a synergy is first discovered in the current run.
- **FR-011**: System MUST render an on-screen synergy discovery notification component.
- **FR-012**: System MUST display currently active synergies in the rune sidebar UI.
- **FR-013**: System MUST reset discovered and active synergy state when starting a new run.
- **FR-014**: System MUST preserve existing rune behavior when no synergies are active.

### Non-Functional Requirements

- **NFR-001**: Synergy detection and modifier computation MUST be pure and unit testable.
- **NFR-002**: Added logic MUST not require new runtime dependencies.
- **NFR-003**: Synergy integration MUST pass TypeScript strict checks and ESLint.
- **NFR-004**: New UI elements MUST render on both desktop and mobile layouts without overlap breakage.

### Key Entities

- **SynergyDefinition**: Declarative combo definition with `id`, `name`, `description`, `requiredRunes`, and `effects`.
- **ActiveSynergyState**: Runtime list of active synergy IDs derived from equipped runes.
- **SynergyModifiers**: Aggregated bonuses derived from active synergy IDs and applied at store hook points.
- **SynergyDiscoveryNotification**: UI payload for first-discovery event (synergy id, name, description).

## Success Criteria

### Measurable Outcomes

- **SC-001**: All five defined synergies activate/deactivate correctly under unit tests.
- **SC-002**: Bonus effects for floor bonus, floor-start shield, second-chance HP, prophecy guarantee, and shop discount are covered by automated tests and pass.
- **SC-003**: Discovery notification appears exactly once per synergy per run in tested flows.
- **SC-004**: Multiple synergies can be active at once and all corresponding modifiers are applied in a single run.
- **SC-005**: `pnpm test`, `pnpm lint`, and `pnpm typecheck` pass after implementation.

## Goal Coverage Matrix

| Phase Goal | Requirements |
|-----------|--------------|
| Synergy definition system | FR-001 |
| Combo detection engine | FR-002, FR-003, FR-004 |
| Synergy bonus effects | FR-005, FR-006, FR-007, FR-008, FR-009, FR-014 |
| Synergy discovery notification | FR-010, FR-011 |
| Synergy display in UI | FR-012 |
