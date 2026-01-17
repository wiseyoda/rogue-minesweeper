# Requirements Checklist: Phase 3030 - Defense Runes

## Rune Definitions

- [ ] REQ-001: Hardy rune definition added to RUNES array
- [ ] REQ-002: Shield Bearer rune definition added to RUNES array
- [ ] REQ-003: Iron Skin rune definition added to RUNES array
- [ ] REQ-004: Undying rune definition added to RUNES array

## Hardy Rune

- [ ] REQ-010: Hardy adds +1 to maxLives when equipped
- [ ] REQ-011: Hardy is stackable (multiple copies add +1 each)
- [ ] REQ-012: Current HP increases when maxLives increases via Hardy
- [ ] REQ-013: Hardy rarity is Common, cost is 35 gold

## Shield Bearer Rune

- [ ] REQ-020: Shield Bearer grants +1 shield at floor start
- [ ] REQ-021: Shield Bearer is stackable
- [ ] REQ-022: Shields work with existing absorption mechanic
- [ ] REQ-023: Shield Bearer rarity is Common, cost is 40 gold

## Iron Skin Rune

- [ ] REQ-030: Iron Skin reduces damage by 25%
- [ ] REQ-031: Iron Skin applies after Stone Skin reduction
- [ ] REQ-032: Iron Skin applies before Lucky Charm dodge
- [ ] REQ-033: Iron Skin minimum damage is 1 (no free negation)
- [ ] REQ-034: Iron Skin is non-stackable
- [ ] REQ-035: Iron Skin rarity is Uncommon, cost is 55 gold

## Undying Rune

- [ ] REQ-040: Undying heals 1 HP per 50 reveals
- [ ] REQ-041: Undying counter persists across floors
- [ ] REQ-042: Undying counter resets after heal triggers
- [ ] REQ-043: Undying cannot heal above maxLives
- [ ] REQ-044: Undying rarity is Legendary, cost is 150 gold

## State Management

- [ ] REQ-050: PlayerState includes undyingRevealCount field
- [ ] REQ-051: undyingRevealCount initializes to 0 on new run
- [ ] REQ-052: undyingRevealCount persists through floor transitions
- [ ] REQ-053: undyingRevealCount persists through shop visits

## Engine Integration

- [ ] REQ-060: getPassiveRuneModifiers returns maxLivesBonus for Hardy
- [ ] REQ-061: applyOnFloorStartRunes handles Shield Bearer
- [ ] REQ-062: applyOnDamageRunes handles Iron Skin
- [ ] REQ-063: applyOnRevealRunes handles Undying heal check

## Testing

- [ ] REQ-070: Unit tests for Hardy effect
- [ ] REQ-071: Unit tests for Shield Bearer effect
- [ ] REQ-072: Unit tests for Iron Skin effect
- [ ] REQ-073: Unit tests for Undying effect
- [ ] REQ-074: Integration test for damage pipeline order
