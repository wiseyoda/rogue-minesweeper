# Requirements Checklist: Zustand Stores

**Phase**: 1010
**Spec**: spec.md

---

## Functional Requirements

### FR-1: gameStore
- [ ] FR-1.1: Store shape uses Grid, PlayerState, RunState, GridConfig types
- [ ] FR-1.2a: startNewRun() initializes fresh run state
- [ ] FR-1.2b: startLevel(level) creates grid for specified level
- [ ] FR-1.2c: revealCell(row, col) reveals cell and updates state
- [ ] FR-1.2d: toggleFlag(row, col) toggles flag on cell
- [ ] FR-1.2e: takeDamage(amount) reduces shields then lives
- [ ] FR-1.2f: addGold(amount) adds gold to player
- [ ] FR-1.2g: addShield(count) adds shields to player
- [ ] FR-1.2h: setPhase(phase) transitions game phase
- [ ] FR-1.2i: reset() resets store to initial state
- [ ] FR-1.3: gameOver computed from player.lives === 0

### FR-2: metaStore
- [ ] FR-2.1: Uses persist middleware with LocalStorage
- [ ] FR-2.2a: stats field using GameStats type
- [ ] FR-2.2b: playerStats field using PlayerStats type
- [ ] FR-2.2c: upgrades field using PermanentUpgradeRegistry type
- [ ] FR-2.3a: recordRunEnd() updates stats correctly
- [ ] FR-2.3b: purchaseUpgrade() applies upgrade and returns success
- [ ] FR-2.3c: applyAllUpgrades() applies all upgrades to playerStats
- [ ] FR-2.3d: reset() resets to default state

### FR-3: uiStore
- [ ] FR-3.1a: activeModal field with ModalType
- [ ] FR-3.1b: soundEnabled boolean field
- [ ] FR-3.1c: musicEnabled boolean field
- [ ] FR-3.2a: openModal() sets active modal
- [ ] FR-3.2b: closeModal() sets modal to 'none'
- [ ] FR-3.2c: toggleSound() toggles sound setting
- [ ] FR-3.2d: toggleMusic() toggles music setting

---

## Technical Requirements

### TR-1: Dependencies
- [ ] zustand package installed
- [ ] immer package installed

### TR-2: Middleware
- [ ] devtools middleware configured for all stores
- [ ] immer middleware configured for all stores

### TR-3: Persistence
- [ ] persist middleware configured for metaStore
- [ ] Storage key is 'dungeon-delver-meta'

### TR-4: Engine Integration
- [ ] revealCell calls engine revealCell function
- [ ] toggleFlag calls engine toggleFlag function
- [ ] startLevel calls engine initializeGrid function

---

## Non-Functional Requirements

### NFR-1: Code Quality
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] All types imported from @/types

### NFR-2: Testing
- [ ] gameStore actions tested
- [ ] metaStore persistence tested
- [ ] uiStore actions tested

---

## Acceptance Criteria

- [ ] Zustand and immer installed
- [ ] gameStore created with all actions
- [ ] metaStore created with persistence
- [ ] uiStore created
- [ ] Store exports in index.ts
- [ ] TypeScript compiles with strict mode
- [ ] Unit tests pass
- [ ] metaStore persists across page refresh
