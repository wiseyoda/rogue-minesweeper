# Phase 2050: Progression POC - Tasks

## Setup

- [x] T001 [P1] Create specs directory structure and verify branch

## Phase A: Enhanced Stats Tracking

- [x] T002 [P1] [US-1] Update GameStats interface in types/game.ts - add totalGoldEarned, make totalRuns required
- [x] T003 [P1] [US-1] Update createDefaultGameStats in types/game.ts - initialize new field
- [x] T004 [P1] [US-1] Update metaStore recordRunEnd action to track totalGoldEarned

## Phase B: Reveal Scroll Shop Item

- [x] T005 [P1] [US-3] Add revealScroll to NextLevelBuffs in types/player.ts
- [x] T006 [P1] [US-3] Add reveal-scroll item definition to data/shopItems.ts
- [x] T007 [P1] [US-3] Add applyRevealScroll action to stores/gameStore.ts
- [x] T008 [P1] [US-3] Integrate reveal scroll activation in startLevel action
- [x] T009 [P2] [US-3] Add RevealScrollIcon to icons (if not exists)

## Phase C: HighScores Component

- [x] T010 [P1] [US-1] Create HighScores.tsx component with Panel wrapper
- [x] T011 [P1] [US-1] Add stat rows for best level, best gold, total runs, total gold
- [x] T012 [P2] [US-1] Add icons for stat rows (trophy, gold, etc.)
- [x] T013 [P2] [US-1] Add formatting helpers for large numbers

## Phase D: RunStats Component

- [x] T014 [P1] [US-2] Create RunStats.tsx component with compact design
- [x] T015 [P1] [US-2] Add comparison indicators (new best, tied, below)
- [x] T016 [P1] [US-2] Integrate RunStats into Sidebar component

## Phase E: Integration & Polish

- [x] T017 [P1] [US-4] Add HighScores access point (sidebar button or menu)
- [x] T018 [P2] [US-4] Verify game loop works end-to-end
- [x] T019 [P2] [US-4] Test persistence across browser refresh
- [x] T020 [P3] [US-4] Add visual polish to stats components

## Verification

- [x] T021 [P1] Run TypeScript type check
- [x] T022 [P1] Run ESLint
- [ ] T023 [P2] Manual playtest of complete game loop
