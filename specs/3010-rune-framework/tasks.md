# Phase 3010: Rune Framework - Tasks

## Setup

- [ ] T001 [P1] Create specs directory structure and verify branch

## Phase A: Type Definitions

- [ ] T002 [P1] [US-1] Create src/types/rune.ts with RuneCategory, RuneRarity, RuneTrigger types
- [ ] T003 [P1] [US-1] Add RuneEffect and RuneDefinition interfaces to src/types/rune.ts
- [ ] T004 [P1] [US-3] Add equippedRunes: string[] to PlayerState in src/types/player.ts
- [ ] T005 [P1] [US-4] Add availableRuneRewards: string[] to RunState in src/types/game.ts
- [ ] T006 [P1] [US-1] Export rune types from src/types/index.ts

## Phase B: Rune Definitions

- [ ] T007 [P1] [US-2] Create src/data/runes.ts with RUNES array
- [ ] T008 [P1] [US-2] Add Scout's Eye rune (information, common, onFloorStart)
- [ ] T009 [P1] [US-2] Add Oracle's Sight rune (information, uncommon, onReveal)
- [ ] T010 [P1] [US-2] Add Stone Skin rune (defense, common, passive)
- [ ] T011 [P1] [US-2] Add Lucky Charm rune (defense, uncommon, onDamage)
- [ ] T012 [P1] [US-2] Add Midas Touch rune (economy, common, passive)
- [ ] T013 [P1] [US-2] Add Treasure Sense rune (economy, uncommon, onFloorStart)
- [ ] T014 [P1] [US-2] Add Swift Feet rune (utility, common, passive)
- [ ] T015 [P1] [US-2] Add Second Chance rune (utility, rare, onDamage)
- [ ] T016 [P1] [US-2] Add helper functions: getRune(), getRandomRunes()

## Phase C: Store Actions

- [ ] T017 [P1] [US-3] Add equipRune action to gameStore
- [ ] T018 [P1] [US-3] Add replaceRune action to gameStore
- [ ] T019 [P1] [US-4] Add generateRuneRewards action to gameStore
- [ ] T020 [P1] [US-4] Add selectRuneReward action to gameStore
- [ ] T021 [P1] [US-3] Update startNewRun to clear equippedRunes
- [ ] T022 [P1] [US-3] Update createDefaultPlayerState to initialize equippedRunes: []
- [ ] T023 [P1] [US-4] Update createDefaultRunState to initialize availableRuneRewards: []

## Phase D: Effect Processing

- [ ] T024 [P1] [US-5] Create src/engine/runes.ts for effect processing
- [ ] T025 [P1] [US-5] Implement applyOnFloorStartRunes function
- [ ] T026 [P1] [US-5] Implement applyOnRevealRunes function
- [ ] T027 [P1] [US-5] Implement applyOnDamageRunes function
- [ ] T028 [P1] [US-5] Implement getPassiveRuneModifiers function
- [ ] T029 [P1] [US-5] Integrate onFloorStart effects into startLevel action
- [ ] T030 [P1] [US-5] Integrate onReveal effects into revealCell action
- [ ] T031 [P1] [US-5] Integrate onDamage effects into damage processing
- [ ] T032 [P1] [US-5] Integrate gold multiplier from Midas Touch rune

## Phase E: Shop UI

- [ ] T033 [P1] [US-4] Create src/components/shop/RuneCard.tsx component
- [ ] T034 [P1] [US-4] Add rune icon/category color styling to RuneCard
- [ ] T035 [P1] [US-4] Add rarity border styling to RuneCard
- [ ] T036 [P1] [US-4] Add "Select" button and selected state to RuneCard
- [ ] T037 [P1] [US-4] Update FloorShop.tsx to show "Rune Rewards" section
- [ ] T038 [P1] [US-4] Generate rune rewards when entering shop phase
- [ ] T039 [P1] [US-4] Handle rune selection in FloorShop (call selectRuneReward)
- [ ] T040 [P2] [US-4] Add visual divider between runes and items sections

## Phase F: Sidebar Display

- [ ] T041 [P1] [US-6] Update RunesPanel to read from player.equippedRunes
- [ ] T042 [P1] [US-6] Add rune icons mapping for equipped runes display
- [ ] T043 [P2] [US-6] Update header from "Active Runes" to "Equipped Runes"
- [ ] T044 [P2] [US-6] Add tooltip showing rune name and effect on hover

## Verification

- [ ] T045 [P1] Run TypeScript type check
- [ ] T046 [P1] Run ESLint
- [ ] T047 [P2] Manual playtest of rune selection flow
- [ ] T048 [P2] Verify each rune effect triggers correctly
