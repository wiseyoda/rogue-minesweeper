# Requirements Checklist: Meta Progression

**Phase**: 2030
**Status**: Draft
**Created**: 2026-01-15

---

## Functional Requirements

### Data Layer
- [ ] R001: Create permanentUpgrades.ts with 5 upgrade definitions
- [ ] R002: Each upgrade has id, name, description, baseCost, maxLevel
- [ ] R003: Leveled upgrades have costIncrease multiplier
- [ ] R004: Each upgrade has apply(stats) function
- [ ] R005: Export PERMANENT_UPGRADES registry

### Type Extensions
- [ ] R006: Add goldFindBonus to PlayerStats (default: 0)
- [ ] R007: Add startingShields to PlayerStats (default: 0)
- [ ] R008: Add preparationLevel to PlayerStats (default: 0)
- [ ] R009: Update createDefaultPlayerStats() with new fields

### Meta Store
- [ ] R010: Initialize upgrades registry with PERMANENT_UPGRADES
- [ ] R011: Add metaGold field to track upgrade currency
- [ ] R012: Add addMetaGold(amount) action
- [ ] R013: Update purchaseUpgrade to deduct gold
- [ ] R014: Persist metaGold in localStorage

### Game Store Integration
- [ ] R015: startNewRun reads playerStats from metaStore
- [ ] R016: Apply maxLives from playerStats.maxLives
- [ ] R017: Apply startingShields to initial shields
- [ ] R018: Apply preparation buffs at run start
- [ ] R019: Apply firstClickSafety flag

### Gold Find System
- [ ] R020: Apply goldFindBonus multiplier in revealCell gold grants
- [ ] R021: Formula: Math.floor(baseGold * (1 + goldFindBonus))

### Upgrade Shop UI
- [ ] R022: Create UpgradeShopModal component
- [ ] R023: Display upgrade grid with cards
- [ ] R024: Show upgrade name, description, level, cost
- [ ] R025: Show current gold balance
- [ ] R026: Disable purchase button when can't afford
- [ ] R027: Disable purchase button when maxed
- [ ] R028: Visual feedback on purchase
- [ ] R029: Continue button to proceed

### Game Flow
- [ ] R030: GameOverModal triggers upgradeShop phase on continue
- [ ] R031: recordRunEnd saves stats before upgrade shop
- [ ] R032: Upgrade shop Continue triggers startNewRun
- [ ] R033: Gold from run available as metaGold

### Statistics Tracking
- [ ] R034: totalRuns increments on recordRunEnd
- [ ] R035: highestLevelOverall updates if beaten
- [ ] R036: maxGoldRun updates if beaten

---

## Non-Functional Requirements

### Persistence
- [ ] NFR01: Upgrades survive page refresh
- [ ] NFR02: Gold balance survives page refresh
- [ ] NFR03: Statistics survive page refresh

### Performance
- [ ] NFR04: Upgrade application < 10ms
- [ ] NFR05: No UI lag on purchase

### Accessibility
- [ ] NFR06: Keyboard navigation for upgrade cards
- [ ] NFR07: Visual state indicators (not just color)

---

## Test Requirements

### Unit Tests
- [ ] T001: permanentUpgrades.ts exports all 5 upgrades
- [ ] T002: Each upgrade apply() modifies stats correctly
- [ ] T003: Cost calculation correct for each level
- [ ] T004: purchaseUpgrade deducts correct amount
- [ ] T005: purchaseUpgrade respects maxLevel
- [ ] T006: applyAllUpgrades applies each upgrade correctly
- [ ] T007: goldFindBonus multiplier applied correctly

### Integration Tests
- [ ] T008: Death flow transitions to upgrade shop
- [ ] T009: Purchase updates both gold and upgrade level
- [ ] T010: New run applies all purchased upgrades
- [ ] T011: Stats persist after refresh (mock localStorage)
