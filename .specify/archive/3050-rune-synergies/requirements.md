# Requirements Checklist: 3050 - Rune Synergies

## Functional Requirements

### FR-001: Synergy Data Model
- [ ] Dedicated synergy definition file exists at `src/data/synergies.ts`
- [ ] Each synergy has unique `id`
- [ ] Each synergy includes `name`, `description`, and `requiredRunes`
- [ ] Each synergy encodes passive effect data for runtime application

### FR-002: Combo Detection Engine
- [ ] Pure function returns active synergy IDs from `equippedRunes`
- [ ] Detection requires all runes listed in `requiredRunes`
- [ ] Detection is order-independent for equipped rune arrays

### FR-003: Multiple Active Synergies
- [ ] Engine returns multiple active IDs when combos overlap
- [ ] Store state supports more than one active synergy at a time

### FR-004: Discovery Tracking
- [ ] Run state tracks discovered synergy IDs
- [ ] Newly discovered IDs are computed from previous discoveries
- [ ] Reactivation of already discovered synergy does not create duplicate discovery event

### FR-005: Greedy Bonus
- [ ] `lucky-coin + treasure-hunter` activates `greedy`
- [ ] Floor completion bonus is multiplied by 1.5 when active

### FR-006: Fortified Deal Bonus
- [ ] `shield-bearer + bargain-hunter` activates `fortified-deal`
- [ ] Player gets +1 extra shield at floor start
- [ ] Shop discount gains +0.05 additive bonus when active

### FR-007: Immortal Bonus
- [ ] `undying + second-chance` activates `immortal`
- [ ] Second Chance survival leaves +1 additional HP versus baseline

### FR-008: Seer Bonus
- [ ] `prophecy + danger-sense` activates `seer`
- [ ] Prophecy highlight is guaranteed at floor start when active

### FR-009: Hunter's Vision Bonus
- [ ] `scout-eye + omniscience` activates `hunters-vision`
- [ ] +1 safe tile is revealed at floor start when active

### FR-010: Discovery Notification Event
- [ ] Store emits notification payload for first-time discovery
- [ ] Notification includes synergy name and description/effect text

### FR-011: Notification UI
- [ ] `src/components/hud/SynergyNotification.tsx` exists
- [ ] Component renders notification content from store state
- [ ] Notification can be dismissed or auto-clears

### FR-012: Active Synergy Display
- [ ] Sidebar rune panel shows currently active synergies
- [ ] Active list updates when rune loadout changes

### FR-013: New Run Reset
- [ ] Starting a new run clears active synergy state
- [ ] Starting a new run clears discovered synergy history
- [ ] Starting a new run clears pending notification state

### FR-014: Backward Compatibility
- [ ] When no synergies are active, existing rune behavior remains unchanged

## Non-Functional Requirements

### NFR-001: Testability
- [ ] Synergy detection/modifier functions are pure and unit-tested

### NFR-002: Dependencies
- [ ] No new third-party runtime dependency added for this phase

### NFR-003: Quality Gates
- [ ] `pnpm test` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes

### NFR-004: Responsive UI
- [ ] Notification and active synergy list remain readable on desktop
- [ ] Notification and active synergy list remain readable on mobile layout

## Success Criteria Trace

| Success Criteria | Checklist Coverage |
|------------------|--------------------|
| SC-001 | FR-001, FR-002, FR-003 |
| SC-002 | FR-005, FR-006, FR-007, FR-008, FR-009 |
| SC-003 | FR-004, FR-010, FR-011 |
| SC-004 | FR-003, FR-012 |
| SC-005 | NFR-003 |
