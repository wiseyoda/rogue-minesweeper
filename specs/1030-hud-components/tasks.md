# Tasks: HUD Components

**Phase**: 1030
**Created**: 2026-01-15
**Status**: In Progress

---

## Setup Tasks

- [x] T001 Create `src/components/hud/` directory
- [x] T002 Create `src/components/hud/__tests__/` directory
- [x] T003 Create `src/components/hud/index.ts` barrel export

---

## Simple Display Components

### GoldCounter
- [x] T004 Create `GoldCounter.tsx` with props interface
- [x] T005 Implement gold icon and amount display
- [x] T006 Apply dungeon-gold color styling

### LevelIndicator
- [x] T007 Create `LevelIndicator.tsx` with props interface
- [x] T008 Implement "L {level}" format display
- [x] T009 Apply dungeon-amber color styling

### ShieldDisplay
- [x] T010 Create `ShieldDisplay.tsx` with props interface
- [x] T011 Implement shield icon and count display
- [x] T012 Hide component when shields = 0

### MonsterCounter
- [x] T013 Create `MonsterCounter.tsx` with props interface
- [x] T014 Implement monster icon and remaining count
- [x] T015 Calculate remaining = total - flagged

---

## Complex Display Components

### HealthBar
- [x] T016 Create `HealthBar.tsx` with props interface
- [x] T017 Implement progress bar with percentage width
- [x] T018 Apply dungeon-blood for filled, shadow for empty
- [x] T019 Add numeric "current/max" display

### BuffBar
- [x] T020 Create `BuffBar.tsx` with props interface
- [x] T021 Create BUFF_ICONS mapping (name -> icon)
- [x] T022 Implement buff icon rendering with charges
- [x] T023 Hide component when no buffs active

### MessageArea
- [x] T024 Create `MessageArea.tsx` with GameMessage interface
- [x] T025 Implement message type styling (info/warning/success/danger)
- [x] T026 Add default empty state display

---

## Container Components

### HUD
- [x] T027 Create `HUD.tsx` container component
- [x] T028 Add granular store selectors for each stat
- [x] T029 Compose all child components in layout
- [x] T030 Implement responsive flex-wrap layout

---

## Integration

- [x] T031 Update barrel export with all components
- [x] T032 Update App.tsx to import HUD component
- [x] T033 Replace inline status display with HUD
- [x] T034 Verify HUD displays correct store values

---

## Testing

### Unit Tests
- [x] T035 Create `GoldCounter.test.tsx` - renders amount, correct color
- [x] T036 Create `HealthBar.test.tsx` - renders bar, percentage, numeric
- [x] T037 Create `BuffBar.test.tsx` - renders buffs, handles empty
- [x] T038 Create `HUD.test.tsx` - renders all children

### Integration Tests
- [x] T039 Test HUD responds to store state changes
- [x] T040 Test all components render from store

---

## Verification

- [x] T041 Run `pnpm typecheck` - passes
- [x] T042 Run `pnpm lint` - passes
- [x] T043 Run `pnpm test:run` - all tests pass
- [x] T044 Run `pnpm build` - succeeds
- [x] T045 Manual test: HP bar updates on damage
- [x] T046 Manual test: Gold counter shows correct value
- [x] T047 Manual test: Level indicator shows floor number

---

## Summary

| Category | Tasks | Description |
|----------|-------|-------------|
| Setup | 3 | Directory structure, barrel export |
| Simple Components | 12 | GoldCounter, LevelIndicator, ShieldDisplay, MonsterCounter |
| Complex Components | 11 | HealthBar, BuffBar, MessageArea |
| Container | 4 | HUD composition and layout |
| Integration | 4 | App.tsx updates |
| Testing | 6 | Unit and integration tests |
| Verification | 7 | Build checks and manual testing |
| **Total** | **47** | |

---

## Dependencies

```
T001 ──> T002 ──> T003
              ↓
      ┌───────┴───────┐
      ↓               ↓
Simple (T004-T015)  Complex (T016-T026)
      ↓               ↓
      └───────┬───────┘
              ↓
        HUD Container (T027-T030)
              ↓
        Integration (T031-T034)
              ↓
        Testing (T035-T040)
              ↓
        Verification (T041-T047)
```
