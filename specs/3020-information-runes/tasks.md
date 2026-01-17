# Phase 3020: Information Runes - Tasks

## Setup Tasks

- [x] T001 [P0] Add HighlightType to `src/types/cell.ts`
- [x] T002 [P0] Add highlightType property to Cell interface in `src/types/cell.ts`
- [x] T003 [P0] Export HighlightType from `src/types/index.ts`

## Rune Definitions

- [x] T004 [P1] Add Danger Sense rune definition to `src/data/runes.ts`
- [x] T005 [P1] Add Prophecy rune definition to `src/data/runes.ts`
- [x] T006 [P1] Add Omniscience rune definition to `src/data/runes.ts`

## Tile Rendering

- [x] T007 [P0] Add highlight overlay styles to `src/components/game/Tile.tsx`
- [x] T008 [P0] Render prophecy highlight (green glow) in Tile component
- [x] T009 [P0] Render omniscience highlight (red tint) in Tile component

## Omniscience Implementation

- [x] T010 [P1] Add omniscience logic to applyOnFloorStartRunes in `src/engine/runes.ts`
- [x] T011 [P1] Mark all monster cells with 'omniscience' highlight at floor start
- [x] T012 [P1] Clear omniscience highlight when cell is revealed in gameStore

## Prophecy Implementation

- [x] T013 [P1] Create calculateSafestTile function in `src/engine/runes.ts`
- [x] T014 [P1] Implement safety scoring algorithm (adjacent number sum)
- [x] T015 [P1] Add prophecy logic to applyOnFloorStartRunes
- [x] T016 [P1] Update prophecy highlight after each reveal in gameStore
- [x] T017 [P1] Clear previous prophecy highlight before setting new one

## Danger Sense Implementation

- [x] T018 [P2] Create getExtendedDangerCount function in `src/engine/runes.ts`
- [x] T019 [P2] Add dangerSenseActive to RuneModifiers in `src/types/rune.ts`
- [x] T020 [P2] Update getPassiveRuneModifiers to set dangerSenseActive
- [x] T021 [P2] Update Tile to display extended count when danger sense active
- [x] T022 [P2] Add visual indicator for extended numbers (different color/format)

## Integration Tasks

- [x] T023 [P1] Wire up highlight clearing in gameStore revealCell
- [x] T024 [P1] Wire up highlight clearing in gameStore toggleFlag
- [x] T025 [P1] Call applyHighlightRunes after grid initialization in startLevel
- [x] T026 [P1] Create applyHighlightRunes function for prophecy/omniscience recalc

## Polish Tasks

- [x] T027 [P3] TypeScript compile check - no errors
- [ ] T028 [P3] Test all three runes appear in shop
- [ ] T029 [P3] Test prophecy highlight updates correctly
- [ ] T030 [P3] Test omniscience marks all monsters

## Verification Checklist

- [ ] V001: Danger Sense rune works (extended numbers visible)
- [ ] V002: Prophecy rune works (safest tile highlighted green)
- [ ] V003: Omniscience rune works (all monsters tinted red)
- [ ] V004: Highlights clear appropriately on reveal/flag
- [ ] V005: New runes integrate with shop and rune panel
- [ ] V006: TypeScript compiles without errors
