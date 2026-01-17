# Specification: Phase 3030 - Defense Runes

## Overview

**Goal**: Implement runes that protect the player through HP, shields, and damage mitigation.

**Scope**: Add 4 new defense runes that integrate with the existing rune framework.

## User Stories

### US-1: Hardy Rune (Max HP Increase)

**As a** player
**I want** a rune that increases my maximum HP
**So that** I can survive more hits and take greater risks

**Acceptance Criteria**:
- [ ] Hardy rune adds +1 to maxLives when equipped
- [ ] Stackable: multiple Hardy runes add +1 each
- [ ] Current HP increases proportionally when maxLives increases
- [ ] Rarity: Common, Cost: 35 gold

### US-2: Shield Bearer Rune (Floor Start Shields)

**As a** player
**I want** a rune that grants shields at the start of each floor
**So that** I have damage absorption for risky early moves

**Acceptance Criteria**:
- [ ] Shield Bearer grants +1 shield at floor start
- [ ] Stackable: multiple runes grant +1 each
- [ ] Shields absorb damage before HP (existing mechanic)
- [ ] Rarity: Common, Cost: 40 gold
- [ ] (Future) Visual feedback when shields are granted

### US-3: Iron Skin Rune (Damage Reduction)

**As a** player
**I want** a rune that reduces all incoming damage
**So that** I have consistent protection throughout the run

**Acceptance Criteria**:
- [ ] Iron Skin reduces incoming damage by 25%
- [ ] Applied after Stone Skin (first-hit reduction)
- [ ] Applied before Lucky Charm (dodge chance)
- [ ] Minimum damage is 1 (no free negation except Lucky Charm)
- [ ] Non-stackable (only one can be active)
- [ ] Rarity: Uncommon, Cost: 55 gold

### US-4: Undying Rune (Heal on Reveals)

**As a** player
**I want** a rune that heals me based on tiles revealed
**So that** careful play is rewarded with sustainability

**Acceptance Criteria**:
- [ ] Heal 1 HP every 50 tiles revealed
- [ ] Counter persists across floors (not reset on floor transition)
- [ ] Counter resets to 0 after heal triggers
- [ ] Cannot heal above maxLives
- [ ] Rarity: Legendary, Cost: 150 gold
- [ ] (Future) Visual feedback when heal triggers

## Functional Requirements

### FR-1: Rune Definitions

Add 4 new runes to `src/data/runes.ts`:

| ID | Name | Category | Rarity | Trigger | Effect |
|----|------|----------|--------|---------|--------|
| `hardy` | Hardy | defense | common | passive | +1 Max HP |
| `shield-bearer` | Shield Bearer | defense | common | onFloorStart | +1 Shield |
| `iron-skin` | Iron Skin | defense | uncommon | onDamage | 25% damage reduction |
| `undying` | Undying | defense | legendary | onReveal | Heal 1 HP per 50 reveals |

### FR-2: State Changes

**PlayerState** additions:
- `undyingRevealCount: number` - Tracks reveals for Undying rune (persists across floors)

**RuneModifiers** additions:
- `damageReductionPercent: number` - For Iron Skin (0.0-1.0 range)
- `maxLivesBonus: number` - For Hardy

### FR-3: Engine Integration

**Hardy**:
- Processed in `getPassiveRuneModifiers()`
- Applied when runes are equipped/unequipped
- Store applies bonus to `maxLives` and `lives` on equip

**Shield Bearer**:
- Processed in `applyOnFloorStartRunes()`
- Adds to `player.shields` at floor start

**Iron Skin**:
- Processed in `applyOnDamageRunes()`
- Applied after Stone Skin, before Lucky Charm
- Formula: `damage = Math.max(1, Math.floor(damage * 0.75))`

**Undying**:
- Processed in `applyOnRevealRunes()`
- Increments `undyingRevealCount` on each reveal
- When count >= 50: heal 1 HP, reset counter

### FR-4: Damage Processing Order

Updated damage pipeline:
1. Base damage from monster
2. Stone Skin: Subtract reduction (first hit only)
3. **Iron Skin: Multiply by 0.75, minimum 1**
4. Lucky Charm: 20% chance to negate
5. Second Chance: Survive fatal (if available)

## Non-Functional Requirements

### NFR-1: Testing

- Unit tests for each rune effect
- Integration test for damage pipeline order
- Edge case: Hardy unequip doesn't kill player
- Edge case: Undying counter persists through shop

### NFR-2: Performance

- No additional renders on rune calculations
- Counter updates should not trigger unnecessary state changes

## Out of Scope

- Rune visual effects/animations (future phase)
- Rune synergies or combos
- Rune leveling or upgrades
- UI changes to rune display
