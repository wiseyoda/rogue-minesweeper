# Verification Checklist: Phase 2020 - Floor Shop

**Purpose**: Post-implementation verification of floor shop functionality
**Created**: 2026-01-15
**Feature**: specs/2020-floor-shop/spec.md

## Shop Display

- [x] **SHP-01**: FloorShop modal renders when showShop is true
- [x] **SHP-02**: Shop displays 3-4 items
- [x] **SHP-03**: Player gold balance shown in header
- [x] **SHP-04**: Items show name, description, and cost
- [x] **SHP-05**: Reroll button displays with 10g cost
- [x] **SHP-06**: Continue button visible

## Item Catalog

- [x] **ITM-01**: heal-potion item exists with correct cost (30g)
- [x] **ITM-02**: max-hp-up item exists with correct cost (80g)
- [x] **ITM-03**: shield-orb item exists with correct cost (40g)
- [x] **ITM-04**: gold-magnet item exists with correct cost (60g)
- [x] **ITM-05**: reveal-scroll item exists with correct cost (50g)

## Purchase Flow

- [x] **PUR-01**: Can purchase item when gold >= cost
- [x] **PUR-02**: Gold deducted after purchase
- [x] **PUR-03**: Item effect applied after purchase
- [x] **PUR-04**: Purchased items disabled (cannot buy again)
- [x] **PUR-05**: Unaffordable items visually dimmed
- [x] **PUR-06**: Cannot click unaffordable items

## Shop Generation

- [x] **GEN-01**: generateShop() creates 3-4 items
- [x] **GEN-02**: No duplicate items in same shop
- [x] **GEN-03**: Items weighted by rarity

## Reroll

- [x] **RRL-01**: Reroll costs 10 gold
- [x] **RRL-02**: Reroll generates new item selection
- [x] **RRL-03**: Reroll disabled when gold < 10

## Item Effects

- [x] **EFF-01**: Heal Potion adds +1 HP (up to max)
- [x] **EFF-02**: Max HP Up adds +1 Max HP and +1 HP
- [x] **EFF-03**: Shield Orb adds +1 shield
- [x] **EFF-04**: Gold Magnet sets nextLevelBuffs.goldMagnet
- [x] **EFF-05**: Reveal Scroll sets nextLevelBuffs.revealTiles

## Phase Transition

- [x] **TRN-01**: Enter Shop button visible in WinModal
- [x] **TRN-02**: Clicking Enter Shop shows FloorShop
- [x] **TRN-03**: Continue button calls startLevel(level + 1)
- [x] **TRN-04**: Shop state cleared on exit

## Code Quality

- [x] **COD-01**: TypeScript compiles without errors (`npm run build`)
- [x] **COD-02**: All unit tests pass (`npm test`)
- [x] **COD-03**: No console errors in browser
- [x] **COD-04**: Components use existing Panel/Button styling

## Sign-Off

- [x] All shop display checks pass
- [x] All item catalog checks pass
- [x] All purchase flow checks pass
- [x] All shop generation checks pass
- [x] All reroll checks pass
- [x] All item effects checks pass
- [x] All phase transition checks pass
- [x] All code quality checks pass

**Verified By**: Claude Code
**Date**: 2026-01-15
