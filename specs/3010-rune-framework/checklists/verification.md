# Phase 3010: Rune Framework - Verification Checklist

## Post-Implementation Verification

### Type System (US-1)
- [ ] V-001: RuneCategory type includes all 4 categories
- [ ] V-002: RuneRarity type includes all 4 rarities
- [ ] V-003: RuneTrigger type includes all 4 triggers
- [ ] V-004: RuneDefinition interface has all required fields
- [ ] V-005: Types exported from src/types/index.ts

### Rune Definitions (US-2)
- [ ] V-006: All 8 runes defined in src/data/runes.ts
- [ ] V-007: Each rune has unique ID
- [ ] V-008: Each category has at least 2 runes
- [ ] V-009: getRune() helper returns correct rune by ID
- [ ] V-010: getRandomRunes() returns specified count of unique runes

### Rune Inventory (US-3)
- [ ] V-011: PlayerState includes equippedRunes array
- [ ] V-012: equippedRunes initialized to empty array on new run
- [ ] V-013: equipRune action adds rune to array (max 3)
- [ ] V-014: replaceRune action swaps rune at index
- [ ] V-015: Runes cleared on startNewRun

### Floor Shop Integration (US-4)
- [ ] V-016: availableRuneRewards in RunState
- [ ] V-017: generateRuneRewards creates 3 random runes
- [ ] V-018: Rune Rewards section visible in FloorShop
- [ ] V-019: RuneCard displays rune info correctly
- [ ] V-020: Selecting rune equips it to player
- [ ] V-021: Selected rune marked as selected in UI

### Effect Processing (US-5)
- [ ] V-022: onFloorStart runes trigger at level start
- [ ] V-023: onReveal runes trigger on tile reveal
- [ ] V-024: onDamage runes trigger when taking damage
- [ ] V-025: Passive rune modifiers apply to calculations
- [ ] V-026: Scout's Eye reveals 2 safe tiles at floor start
- [ ] V-027: Midas Touch applies +25% gold bonus

### Rune Display (US-6)
- [ ] V-028: RunesPanel shows equipped runes
- [ ] V-029: Empty slots show dashed placeholder
- [ ] V-030: Rune icons display correctly
- [ ] V-031: Hover shows rune name/effect tooltip

### Code Quality
- [ ] V-032: TypeScript compiles with no errors
- [ ] V-033: ESLint passes with no errors
- [ ] V-034: No console errors during gameplay
- [ ] V-035: Follows existing code patterns

### Constitution Compliance
- [ ] V-036: All rune effects are passive (no buttons)
- [ ] V-037: Information runes enhance deduction mechanics
- [ ] V-038: Rune selection creates meaningful choices
