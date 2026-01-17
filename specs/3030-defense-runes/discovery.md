# Discovery: Phase 3030 - Defense Runes

## Codebase Examination

### Existing Rune System

**Location**: `src/data/runes.ts`, `src/engine/runes.ts`, `src/types/rune.ts`

**Current Defense Runes** (already implemented):
| Rune | Effect | Rarity | Category |
|------|--------|--------|----------|
| Stone Skin | First hit each floor reduced by 1 (stackable) | Uncommon | defense |
| Lucky Charm | 20% chance to negate damage | Uncommon | defense |
| Second Chance | Survive fatal damage once per run | Rare | utility |

**Rune Effect Triggers**: `passive`, `onReveal`, `onFloorStart`, `onDamage`

### Player State Mechanics

**Location**: `src/types/player.ts`

Relevant existing fields:
- `lives: number` - Current HP (0 = game over)
- `maxLives: number` - Maximum HP (can be increased)
- `shields: number` - Absorb damage before lives
- `secondChanceUsed: boolean` - Tracks if Second Chance was consumed

**Existing buff system** supports:
- `nextLevelBuffs.shields` - Grant shields at level start
- Shield battery buff mechanics

### Engine Integration Points

**Location**: `src/engine/runes.ts`

Key functions:
- `applyOnFloorStartRunes()` - Called at floor start
- `applyOnRevealRunes()` - Called after each reveal
- `applyOnDamageRunes()` - Called when player takes damage
- `getPassiveRuneModifiers()` - Returns passive effect modifiers

**Damage processing** in `applyOnDamageRunes()`:
1. Stone Skin reduction (first hit)
2. Lucky Charm dodge check (20%)
3. Second Chance survival check

### Run State Tracking

**Location**: `src/types/game.ts`

- `revealedCount: number` - Tracks tiles revealed this floor
- `damageTakenThisLevel: number` - For shield battery logic

**Note**: No cross-floor reveal counter exists currently (needed for Undying rune).

---

## Clarified Requirements

Based on user discussion:

### Runes to Implement

| Rune | Rarity | Effect | Implementation Notes |
|------|--------|--------|---------------------|
| **Hardy** | Common | +1 Max HP | Increase `maxLives` when equipped |
| **Shield Bearer** | Common | +1 Shield at floor start | Add to `applyOnFloorStartRunes()` |
| **Iron Skin** | Uncommon | 25% damage reduction | Apply after Stone Skin, before Lucky Charm |
| **Undying** | Legendary | Heal 1 HP per 50 reveals | **Cross-floor counter required** |

### Skipped Runes

- **Phoenix Feather** - Redundant with existing "Second Chance" rune

### Special Requirements

**Undying Counter**:
- Must persist across floors (not reset on floor transition)
- If player reveals 35 tiles in floor 1, next 15 reveals (floor 2) should trigger heal
- Counter resets after healing (not after floor change)
- Requires new state field: `undyingRevealCount: number`

---

## Technical Constraints

1. **Constitution Compliance**: No global state outside stores
2. **Existing Patterns**: Follow `applyOn*Runes()` pattern
3. **Testing**: Each rune needs unit tests
4. **Stacking**: Hardy and Shield Bearer should be stackable

---

## Integration Points

1. **PlayerState** - Add `undyingRevealCount` for Undying tracking
2. **RuneModifiers** - Add `damageReductionPercent` for Iron Skin
3. **applyOnFloorStartRunes()** - Add Shield Bearer logic
4. **applyOnDamageRunes()** - Add Iron Skin reduction
5. **applyOnRevealRunes()** - Add Undying heal check
6. **getPassiveRuneModifiers()** - Add Hardy maxLives effect
