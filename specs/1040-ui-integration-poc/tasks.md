# Tasks: UI Integration POC

**Phase**: 1040
**Created**: 2026-01-15
**Status**: Awaiting USER GATE

---

## Setup Tasks

- [x] T001 Create `src/components/ui/` directory
- [x] T002 Create `src/components/ui/__tests__/` directory
- [x] T003 Create `src/components/ui/index.ts` barrel export

---

## Store Updates

### Type Updates
- [x] T004 Add `totalDamageTaken: number` to RunState in `src/types/game.ts`
- [x] T005 Update `createInitialRunState` to initialize `totalDamageTaken: 0`

### gameStore Updates
- [x] T006 Update `startLevel` to reset `totalDamageTaken` to 0
- [x] T007 Update `takeDamage` to increment `totalDamageTaken`
- [x] T008 Update `revealCell` to add gold for revealed tiles

---

## Modal Components

### WinModal
- [x] T009 Create `WinModal.tsx` with props interface
- [x] T010 Implement backdrop overlay with `fixed inset-0`
- [x] T011 Implement panel with dungeon-parchment styling
- [x] T012 Implement title "Level Complete!" with dungeon-gold color
- [x] T013 Implement stats display (tiles, gold, monsters)
- [x] T014 Implement Continue button with handler

### GameOverModal
- [x] T015 Create `GameOverModal.tsx` with props interface
- [x] T016 Implement backdrop overlay with `fixed inset-0`
- [x] T017 Implement panel with dungeon-parchment styling
- [x] T018 Implement title "You Died!" with dungeon-blood color
- [x] T019 Implement stats display (level, gold, tiles, monsters, damage)
- [x] T020 Implement Try Again button with handler

---

## GameContainer Component

- [x] T021 Create `GameContainer.tsx` with props interface
- [x] T022 Add granular store selectors for required state
- [x] T023 Compose HUD and GameBoard
- [x] T024 Add conditional WinModal rendering when `phase === 'shopping'`
- [x] T025 Add conditional GameOverModal rendering when `gameOver === true`
- [x] T026 Implement onContinue and onRetry handlers

---

## App.tsx Refactor

- [x] T027 Import GameContainer from components/game
- [x] T028 Replace inline HUD + GameBoard with GameContainer
- [x] T029 Update message computation to pass to GameContainer
- [x] T030 Clean up any unused imports

---

## Barrel Export Updates

- [x] T031 Update `src/components/ui/index.ts` with all exports
- [x] T032 Update `src/components/game/index.ts` to export GameContainer

---

## Testing

### Unit Tests
- [x] T033 Create `WinModal.test.tsx` - renders stats, button works
- [x] T034 Create `GameOverModal.test.tsx` - renders stats, button works
- [x] T035 Create `GameContainer.test.tsx` - renders children, shows modals

### Integration Tests
- [x] T036 Test gold increases when revealing tiles
- [x] T037 Test WinModal appears when all safe tiles revealed
- [x] T038 Test GameOverModal appears when lives reach 0

### Store Tests
- [x] T039 Test totalDamageTaken increments correctly
- [x] T040 Test gold is added on cell reveal

---

## Verification

- [x] T041 Run `pnpm typecheck` - passes
- [x] T042 Run `pnpm lint` - passes
- [x] T043 Run `pnpm test:run` - all tests pass
- [x] T044 Run `pnpm build` - succeeds
- [ ] T045 Manual test: Start new game works
- [ ] T046 Manual test: Reveal tiles shows gold increase
- [ ] T047 Manual test: Clear all tiles shows win modal
- [ ] T048 Manual test: Lose all lives shows game over modal
- [ ] T049 Manual test: Continue/Try Again buttons work

---

## Summary

| Category | Tasks | Description |
|----------|-------|-------------|
| Setup | 3 | Directory structure, barrel export |
| Store Updates | 5 | RunState, gold rewards, damage tracking |
| Modal Components | 12 | WinModal, GameOverModal |
| GameContainer | 6 | Container component |
| App.tsx | 4 | Refactoring |
| Barrel Exports | 2 | Export updates |
| Testing | 8 | Unit and integration tests |
| Verification | 9 | Build checks and manual testing |
| **Total** | **49** | |

---

## Dependencies

```
T001 ──> T002 ──> T003
              ↓
      ┌───────┴───────┐
      ↓               ↓
Store (T004-T008)  Modals (T009-T020)
      ↓               ↓
      └───────┬───────┘
              ↓
        GameContainer (T021-T026)
              ↓
        App.tsx (T027-T030)
              ↓
        Exports (T031-T032)
              ↓
        Testing (T033-T040)
              ↓
        Verification (T041-T049)
```
