# Tasks: Meta Progression

**Version**: 1.0.0
**Created**: 2026-01-15
**Phase**: 2030-meta-progression
**Plan**: specs/2030-meta-progression/plan.md

---

## Phase S: Setup

- [x] T001 [P1] Verify existing metaStore persistence key `dungeon-delver-meta`
- [x] T002 [P1] Verify localStorage persist middleware configuration

## Phase A: Type Extensions

- [x] T010 [P1] [US-1] Extend PlayerStats interface with goldFindBonus field `src/types/player.ts`
- [x] T011 [P1] [US-1] Extend PlayerStats interface with startingShields field `src/types/player.ts`
- [x] T012 [P1] [US-1] Extend PlayerStats interface with preparationLevel field `src/types/player.ts`
- [x] T013 [P1] [US-1] Update createDefaultPlayerStats() with new field defaults `src/types/player.ts`

## Phase B: Upgrade Definitions

- [x] T020 [P1] [US-1] Create permanentUpgrades.ts with PERMANENT_UPGRADES constant `src/data/permanentUpgrades.ts`
- [x] T021 [P1] [US-1] Define Vitality upgrade (leveled, +1 maxLives) `src/data/permanentUpgrades.ts`
- [x] T022 [P1] [US-1] Define Fortune upgrade (leveled, +10% gold find) `src/data/permanentUpgrades.ts`
- [x] T023 [P1] [US-1] Define Preparation upgrade (leveled, +1 random buff) `src/data/permanentUpgrades.ts`
- [x] T024 [P1] [US-1] Define Resilience upgrade (leveled, +1 shield) `src/data/permanentUpgrades.ts`
- [x] T025 [P1] [US-1] Define First Click Safety upgrade (unlockable) `src/data/permanentUpgrades.ts`
- [x] T026 [P1] [US-1] Export createInitialUpgradeRegistry() helper `src/data/permanentUpgrades.ts`

## Phase C: Meta Store Integration

- [x] T030 [P1] [US-2] Add metaGold field to MetaStoreState interface `src/stores/types.ts`
- [x] T031 [P1] [US-2] Add addMetaGold action to MetaStoreActions interface `src/stores/types.ts`
- [x] T032 [P1] [US-2] Implement metaGold field with initial value 0 `src/stores/metaStore.ts`
- [x] T033 [P1] [US-2] Implement addMetaGold(amount) action `src/stores/metaStore.ts`
- [x] T034 [P1] [US-2] Implement initializeUpgrades() to merge with PERMANENT_UPGRADES `src/stores/metaStore.ts`
- [x] T035 [P1] [US-2] Update purchaseUpgrade to check metaGold sufficiency `src/stores/metaStore.ts`
- [x] T036 [P1] [US-2] Update purchaseUpgrade to deduct cost from metaGold `src/stores/metaStore.ts`
- [x] T037 [P1] [US-2] Update persist partialize to include metaGold `src/stores/metaStore.ts`
- [x] T038 [P1] [US-4] Verify recordRunEnd increments totalRuns `src/stores/metaStore.ts`

## Phase D: Game Store Integration

- [x] T040 [P1] [US-3] Import useMetaStore in gameStore `src/stores/gameStore.ts`
- [x] T041 [P1] [US-3] Update startNewRun to read playerStats from metaStore `src/stores/gameStore.ts`
- [x] T042 [P1] [US-3] Apply playerStats.maxLives to initial player state `src/stores/gameStore.ts`
- [x] T043 [P1] [US-3] Apply playerStats.startingShields to initial shields `src/stores/gameStore.ts`
- [x] T044 [P1] [US-3] Apply playerStats.firstClickSafety flag `src/stores/gameStore.ts`
- [x] T045 [P1] [US-3] Create applyPreparationBuffs helper function `src/stores/gameStore.ts`
- [x] T046 [P1] [US-3] Implement random buff selection from nextLevelBuffs pool `src/stores/gameStore.ts`
- [x] T047 [P1] [US-3] Apply preparationLevel count of random buffs at run start `src/stores/gameStore.ts`
- [x] T048 [P1] [US-3] Create applyGoldFind helper: Math.floor(base * (1 + bonus)) `src/stores/gameStore.ts`
- [x] T049 [P1] [US-3] Apply goldFindBonus in revealCell gold calculation `src/stores/gameStore.ts`

## Phase E: Upgrade Shop UI

- [x] T050 [P1] [US-1] Create UpgradeShopModal component skeleton `src/components/ui/UpgradeShopModal.tsx`
- [x] T051 [P1] [US-1] Define UpgradeShopModalProps interface `src/components/ui/UpgradeShopModal.tsx`
- [x] T052 [P1] [US-1] Implement upgrade card grid layout `src/components/ui/UpgradeShopModal.tsx`
- [x] T053 [P1] [US-1] Create UpgradeCard subcomponent for individual upgrades `src/components/ui/UpgradeShopModal.tsx`
- [x] T054 [P1] [US-1] Display upgrade name and description `src/components/ui/UpgradeShopModal.tsx`
- [x] T055 [P1] [US-1] Display current level / max level indicator `src/components/ui/UpgradeShopModal.tsx`
- [x] T056 [P1] [US-1] Display upgrade cost (using getUpgradeCost) `src/components/ui/UpgradeShopModal.tsx`
- [x] T057 [P1] [US-1] Display current metaGold balance `src/components/ui/UpgradeShopModal.tsx`
- [x] T058 [P1] [US-2] Implement purchase button with disabled state logic `src/components/ui/UpgradeShopModal.tsx`
- [x] T059 [P1] [US-2] Wire purchase button to purchaseUpgrade action `src/components/ui/UpgradeShopModal.tsx`
- [x] T060 [P1] [US-2] Add visual feedback on successful purchase `src/components/ui/UpgradeShopModal.tsx`
- [x] T061 [P1] [US-2] Style maxed upgrades distinctly (dimmed/locked appearance) `src/components/ui/UpgradeShopModal.tsx`
- [x] T062 [P1] [US-1] Implement Continue button `src/components/ui/UpgradeShopModal.tsx`
- [x] T063 [P1] [US-1] Apply dungeon theme styling (stone, gold colors) `src/components/ui/UpgradeShopModal.tsx`

## Phase F: Game Flow Integration

- [x] T070 [P1] [US-1] Modify GameOverModal Continue to set phase 'upgradeShop' `src/components/ui/GameOverModal.tsx`
- [x] T071 [P1] [US-2] Transfer player.gold to metaGold on death `src/components/game/GameContainer.tsx`
- [x] T072 [P1] [US-2] Add upgradeShop phase handling in GameContainer `src/components/game/GameContainer.tsx`
- [x] T073 [P1] [US-2] Render UpgradeShopModal when phase is 'upgradeShop' `src/components/game/GameContainer.tsx`
- [x] T074 [P1] [US-2] Wire UpgradeShopModal Continue to startNewRun `src/components/game/GameContainer.tsx`

## Phase G: Unit Tests

- [x] T080 [P2] Test: permanentUpgrades exports 5 upgrades `src/data/__tests__/permanentUpgrades.test.ts`
- [x] T081 [P2] Test: Vitality apply increases maxLives by 1 `src/data/__tests__/permanentUpgrades.test.ts`
- [x] T082 [P2] Test: Fortune apply increases goldFindBonus by 0.10 `src/data/__tests__/permanentUpgrades.test.ts`
- [x] T083 [P2] Test: Preparation apply increases preparationLevel by 1 `src/data/__tests__/permanentUpgrades.test.ts`
- [x] T084 [P2] Test: Resilience apply increases startingShields by 1 `src/data/__tests__/permanentUpgrades.test.ts`
- [x] T085 [P2] Test: First Click Safety apply sets firstClickSafety true `src/data/__tests__/permanentUpgrades.test.ts`
- [x] T086 [P2] Test: createInitialUpgradeRegistry returns all 5 upgrades `src/data/__tests__/permanentUpgrades.test.ts`

## Phase H: Store Tests

- [x] T090 [P2] Test: purchaseUpgrade deducts correct metaGold `src/stores/__tests__/metaStore.test.ts`
- [x] T091 [P2] Test: purchaseUpgrade fails when insufficient metaGold `src/stores/__tests__/metaStore.test.ts`
- [x] T092 [P2] Test: purchaseUpgrade fails when at maxLevel `src/stores/__tests__/metaStore.test.ts`
- [x] T093 [P2] Test: initializeUpgrades merges existing state correctly `src/stores/__tests__/metaStore.test.ts`
- [x] T094 [P2] Test: applyAllUpgrades applies leveled upgrade N times `src/stores/__tests__/metaStore.test.ts`
- [x] T095 [P2] Test: startNewRun uses metaStore playerStats `src/stores/__tests__/gameStore.test.ts`
- [x] T096 [P2] Test: goldFindBonus multiplier applied to gold gains `src/stores/__tests__/gameStore.test.ts`
- [x] T097 [P2] Test: startingShields applied at run start `src/stores/__tests__/gameStore.test.ts`
- [x] T098 [P2] Test: preparationLevel buffs applied at run start `src/stores/__tests__/gameStore.test.ts`

## Phase I: UI Tests

- [x] T100 [P2] Test: UpgradeShopModal renders all upgrades `src/components/ui/__tests__/UpgradeShopModal.test.tsx`
- [x] T101 [P2] Test: Purchase button disabled when can't afford `src/components/ui/__tests__/UpgradeShopModal.test.tsx`
- [x] T102 [P2] Test: Purchase button disabled when maxed `src/components/ui/__tests__/UpgradeShopModal.test.tsx`
- [x] T103 [P2] Test: Continue button calls onContinue `src/components/ui/__tests__/UpgradeShopModal.test.tsx`

## Phase P: Polish

- [x] T110 [P2] Run full test suite and fix any failures
- [x] T111 [P2] Verify persistence survives page refresh
- [x] T112 [P2] Verify stats track correctly across multiple runs
- [x] T113 [P2] Manual playtest: purchase upgrades, verify effects
- [x] T114 [P2] Run lint and type check, fix any issues

---

## Summary

| Phase | Description | Tasks |
|-------|-------------|-------|
| S | Setup | 2 |
| A | Type Extensions | 4 |
| B | Upgrade Definitions | 7 |
| C | Meta Store Integration | 9 |
| D | Game Store Integration | 10 |
| E | Upgrade Shop UI | 14 |
| F | Game Flow Integration | 5 |
| G | Unit Tests | 7 |
| H | Store Tests | 9 |
| I | UI Tests | 4 |
| P | Polish | 5 |
| **Total** | | **76** |
