# Requirements Checklist: 3060 - Rune System POC

## Functional Requirements

### FR-001 Rune Catalog Coverage
- [ ] Rune catalog contains 10+ runes
- [ ] Information, defense, economy, and utility categories are present
- [ ] Catalog remains the single source of truth for shop rune offers

### FR-002 Tile Reveal Drop Logic
- [ ] Safe-tile reveal path triggers rune-drop roll
- [ ] Drop chance uses configurable constants
- [ ] RNG behavior is mockable in tests

### FR-003 Drop-To-Shop Integration
- [ ] Dropped rune IDs persist until shop generation
- [ ] Shop rune offers include dropped runes
- [ ] Baseline random rune offers still appear when no drops occur

### FR-004 Rune Purchase Preservation
- [ ] Dropped rune offers use existing price modifier logic
- [ ] Replacement flow still works at max slots
- [ ] Removal fee calculation still uses shop modifiers

### FR-005 Synergy Discoverability
- [ ] Active synergy detection still updates correctly
- [ ] New synergy discovery notification still appears once
- [ ] Active synergies remain visible in sidebar panel

### FR-006 Drop Balance Controls
- [ ] Drop frequency cap exists per floor
- [ ] Balance constants prevent runaway rune inflation
- [ ] Balance behavior is covered by tests

## Non-Functional Requirements

### NFR-001 Testability
- [ ] Drop flow has unit and store integration tests
- [ ] Tests can force deterministic drop outcomes

### NFR-002 Regression Safety
- [ ] Existing rune/shop/synergy tests pass
- [ ] No regression in existing economy modifier behavior

### NFR-003 Constitution Compliance
- [ ] Rune changes remain passive-only
- [ ] No active ability controls introduced

## Success Criteria Traceability

| Success Criteria | Verification Method |
|------------------|---------------------|
| SC-001 | Unit test validates rune catalog coverage |
| SC-002 | Store integration test validates dropped rune purchase path |
| SC-003 | Store regression test validates synergy discovery and notification |
| SC-004 | USER GATE manual test script validates distinct build archetypes |
