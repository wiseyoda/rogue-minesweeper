# Phase 3010: Rune Framework - Tasks

## Setup

- [x] T001 [P1] Create specs directory structure and verify branch

## Phase A: Type Definitions

- [x] T002 [P1] [US-1] Create src/types/rune.ts with RuneCategory, RuneRarity, RuneTrigger types
- [x] T003 [P1] [US-1] Add RuneEffect and RuneDefinition interfaces to src/types/rune.ts
- [x] T004 [P1] [US-3] Add equippedRunes: string[] to PlayerState in src/types/player.ts
- [x] T005 [P1] [US-4] Add availableRuneRewards: string[] to RunState in src/types/game.ts
- [x] T006 [P1] [US-1] Export rune types from src/types/index.ts

## Phase B: Rune Definitions

- [x] T007 [P1] [US-2] Create src/data/runes.ts with RUNES array
- [x] T008 [P1] [US-2] Add Scout's Eye rune (information, common, onFloorStart)
- [x] T009 [P1] [US-2] Add Oracle's Sight rune (information, uncommon, onReveal)
- [x] T010 [P1] [US-2] Add Stone Skin rune (defense, common, passive)
- [x] T011 [P1] [US-2] Add Lucky Charm rune (defense, uncommon, onDamage)
- [x] T012 [P1] [US-2] Add Midas Touch rune (economy, common, passive)
- [x] T013 [P1] [US-2] Add Treasure Sense rune (economy, uncommon, onFloorStart)
- [x] T014 [P1] [US-2] Add Swift Feet rune (utility, common, passive)
- [x] T015 [P1] [US-2] Add Second Chance rune (utility, rare, onDamage)
- [x] T016 [P1] [US-2] Add helper functions: getRune(), getRandomRunes()

## Phase C: Store Actions

- [x] T017 [P1] [US-3] Add equipRune action to gameStore
- [x] T018 [P1] [US-3] Add replaceRune action to gameStore
- [x] T019 [P1] [US-4] Add generateRuneRewards action to gameStore
- [x] T020 [P1] [US-4] Add selectRuneReward action to gameStore
- [x] T021 [P1] [US-3] Update startNewRun to clear equippedRunes (already handled by createInitialPlayerState)
- [x] T022 [P1] [US-3] Update createDefaultPlayerState to initialize equippedRunes: [] (already done)
- [x] T023 [P1] [US-4] Update createDefaultRunState to initialize availableRuneRewards: []

## Phase D: Effect Processing

- [x] T024 [P1] [US-5] Create src/engine/runes.ts for effect processing
- [x] T025 [P1] [US-5] Implement applyOnFloorStartRunes function
- [x] T026 [P1] [US-5] Implement applyOnRevealRunes function
- [x] T027 [P1] [US-5] Implement applyOnDamageRunes function
- [x] T028 [P1] [US-5] Implement getPassiveRuneModifiers function
- [x] T029 [P1] [US-5] Integrate onFloorStart effects into startLevel action (triggers not yet wired)
- [x] T030 [P1] [US-5] Integrate onReveal effects into revealCell action (triggers not yet wired)
- [x] T031 [P1] [US-5] Integrate onDamage effects into damage processing
- [x] T032 [P1] [US-5] Integrate gold multiplier from Midas Touch rune

## Phase E: Shop UI

- [x] T033 [P1] [US-4] Create src/components/shop/RuneCard.tsx component
- [x] T034 [P1] [US-4] Add rune icon/category color styling to RuneCard
- [x] T035 [P1] [US-4] Add rarity border styling to RuneCard
- [x] T036 [P1] [US-4] Add "Select" button and selected state to RuneCard
- [x] T037 [P1] [US-4] Update FloorShop.tsx to show "Rune Rewards" section
- [x] T038 [P1] [US-4] Generate rune rewards when entering shop phase
- [x] T039 [P1] [US-4] Handle rune selection in FloorShop (call selectRuneReward)
- [x] T040 [P2] [US-4] Add visual divider between runes and items sections

## Phase F: Sidebar Display

- [x] T041 [P1] [US-6] Update RunesPanel to read from player.equippedRunes
- [x] T042 [P1] [US-6] Add rune icons mapping for equipped runes display (uses rune.icon from definition)
- [x] T043 [P2] [US-6] Update header from "Active Runes" to "Equipped Runes"
- [x] T044 [P2] [US-6] Add tooltip showing rune name and effect on hover

## Verification

- [x] T045 [P1] Run TypeScript type check
- [x] T046 [P1] Run ESLint
- [ ] T047 [P2] Manual playtest of rune selection flow
- [ ] T048 [P2] Verify each rune effect triggers correctly
