# Verification Checklist: Meta Progression

**Phase**: 2030
**Purpose**: Post-completion verification for /speckit.verify
**Created**: 2026-01-15

---

## Core Functionality

### Upgrade Persistence
- [x] V001: Fresh browser - upgrades registry initialized with 5 upgrades
- [x] V002: Purchase upgrade - level persists after page refresh
- [x] V003: Purchase multiple upgrades - all persist after refresh
- [x] V004: MetaGold balance persists after page refresh
- [x] V005: Clear localStorage - upgrades reinitialize correctly

### Upgrade Purchase Flow
- [x] V010: Can purchase upgrade when gold >= cost
- [x] V011: Cannot purchase when gold < cost
- [x] V012: Cannot purchase when at maxLevel
- [x] V013: Gold deducted equals getUpgradeCost() result
- [x] V014: Leveled upgrade level increments by 1 on purchase
- [x] V015: Unlockable upgrade sets unlocked = true on purchase

### Upgrade Application
- [x] V020: Vitality level 1 - start with 4 maxLives (3 + 1)
- [x] V021: Vitality level 3 - start with 6 maxLives (3 + 3)
- [x] V022: Fortune level 1 - gold gains are 1.1x base
- [x] V023: Fortune level 5 - gold gains are 1.5x base
- [x] V024: Resilience level 1 - start with 1 shield
- [x] V025: Resilience level 2 - start with 2 shields
- [x] V026: First Click Safety - first monster click flags instead of damages
- [x] V027: Preparation level 1 - 1 random buff at run start
- [x] V028: Preparation level 3 - 3 random buffs at run start

### Statistics Tracking
- [x] V030: totalRuns increments on each death
- [x] V031: highestLevelOverall updates when new best
- [x] V032: highestLevelOverall does NOT decrease on worse run
- [x] V033: maxGoldRun updates when new best
- [x] V034: maxGoldRun does NOT decrease on worse run

---

## Game Flow

### Death to Upgrade Shop Flow
- [x] V040: Death shows GameOverModal
- [x] V041: GameOverModal "Continue" transitions to upgradeShop phase
- [x] V042: Player gold transfers to metaGold on death
- [x] V043: UpgradeShopModal displays when phase is upgradeShop
- [x] V044: UpgradeShopModal "Continue" starts new run

### Upgrade Shop UI
- [x] V050: All 5 upgrades displayed in shop
- [x] V051: Each upgrade shows name
- [x] V052: Each upgrade shows description
- [x] V053: Each upgrade shows current level / max level
- [x] V054: Each upgrade shows cost
- [x] V055: MetaGold balance displayed
- [x] V056: Purchase button disabled when can't afford
- [x] V057: Purchase button disabled when maxed
- [x] V058: Visual feedback on successful purchase
- [x] V059: Maxed upgrades visually distinguished

---

## Edge Cases

### Gold Edge Cases
- [x] V060: Purchase with exact gold amount succeeds
- [x] V061: Purchase with 0 gold fails gracefully
- [x] V062: Multiple rapid purchases handled correctly
- [x] V063: Gold find bonus rounds down (no fractional gold)

### Upgrade Edge Cases
- [x] V070: All upgrades at max - shop still usable
- [x] V071: New game - no upgrades applied (all at level 0)
- [x] V072: Reset store - clears all upgrade progress

### Preparation Buff Edge Cases
- [x] V080: Random buff selection is actually random (not always same buff)
- [x] V081: Available buffs include: goldMagnet, shields, revealTiles
- [x] V082: Multiple preparation buffs can stack same buff type

---

## Tests

### Test Suite Passes
- [x] V090: `pnpm test` passes all tests
- [x] V091: No test warnings or skipped tests
- [x] V092: permanentUpgrades tests pass
- [x] V093: metaStore tests pass
- [x] V094: gameStore tests pass
- [x] V095: UpgradeShopModal tests pass

### Code Quality
- [x] V100: `pnpm lint` passes
- [x] V101: `pnpm typecheck` passes
- [x] V102: No console errors in browser

---

## From Phase Requirements

### Verification Gate (from ROADMAP)
- [x] VG01: Upgrades persist after page refresh
- [x] VG02: Purchased upgrades apply at run start
- [x] VG03: Can't exceed max level per upgrade
- [x] VG04: Stats track correctly (total runs, best floor)
