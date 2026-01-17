# Implementation Plan: Phase 3030 - Defense Runes

## Technical Context

### Existing Architecture

**Rune System**:
- Definitions: `src/data/runes.ts` - RUNES array with RuneDefinition objects
- Engine: `src/engine/runes.ts` - Effect processing functions
- Types: `src/types/rune.ts` - RuneDefinition, RuneModifiers, RuneTrigger

**Player State**:
- `src/types/player.ts` - PlayerState, PlayerStats interfaces
- `src/stores/gameStore.ts` - Zustand store for game state

**Effect Triggers**:
| Trigger | Function | When Called |
|---------|----------|-------------|
| passive | `getPassiveRuneModifiers()` | On modifiers calculation |
| onFloorStart | `applyOnFloorStartRunes()` | Floor initialization |
| onReveal | `applyOnRevealRunes()` | After tile reveal |
| onDamage | `applyOnDamageRunes()` | When player takes damage |

### Constitution Compliance Check

| Principle | Compliance |
|-----------|------------|
| I. Information Is Power | N/A (defense runes, not information) |
| IV. Resource Tension | **YES** - Runes enhance HP/shield scarcity decisions |
| V. Passive Mastery | **YES** - All runes are passive effects |
| VII. Move Fast, Iterate Often | **YES** - Builds on existing rune framework |

**Note**: Defense runes complement information runes by creating meaningful HP/shield tradeoffs.

---

## Implementation Strategy

### Phase 1: Type & State Updates

1. Add `undyingRevealCount` to PlayerState
2. Add `damageReductionPercent` and `maxLivesBonus` to RuneModifiers
3. Update `createDefaultRuneModifiers()` and `createInitialPlayerState()`

### Phase 2: Rune Definitions

Add 4 runes to `src/data/runes.ts`:
- `hardy` (passive, stackable)
- `shield-bearer` (onFloorStart, stackable)
- `iron-skin` (onDamage, non-stackable)
- `undying` (onReveal, non-stackable)

### Phase 3: Engine Functions

1. **Hardy**: Update `getPassiveRuneModifiers()` to calculate `maxLivesBonus`
2. **Shield Bearer**: Update `applyOnFloorStartRunes()` to grant shields
3. **Iron Skin**: Update `applyOnDamageRunes()` to apply percentage reduction
4. **Undying**: Update `applyOnRevealRunes()` to track reveals and heal

### Phase 4: Store Integration

Update gameStore to:
- Apply Hardy's maxLives bonus on rune equip
- Track `undyingRevealCount` across floors
- Reset counter appropriately on heal

### Phase 5: Testing

Unit tests for each rune effect and integration tests for damage pipeline.

---

## Detailed Implementation

### 1. Type Updates

**`src/types/player.ts`** - Add to PlayerState:
```typescript
/** Tracks reveals for Undying rune (persists across floors, resets on heal) */
undyingRevealCount: number;
```

**`src/types/rune.ts`** - Add to RuneModifiers:
```typescript
/** Percentage damage reduction (0.0-1.0) from Iron Skin */
damageReductionPercent: number;
/** Max lives bonus from Hardy runes */
maxLivesBonus: number;
```

### 2. Rune Definitions

```typescript
// Hardy - Common defense rune
{
  id: 'hardy',
  name: 'Hardy',
  description: '+1 Max HP',
  category: 'defense',
  rarity: 'common',
  icon: '❤️',
  effect: {
    trigger: 'passive',
    description: '+1 Max HP',
    magnitude: 1,
  },
  stackable: true,
  cost: 35,
}

// Shield Bearer - Common defense rune
{
  id: 'shield-bearer',
  name: 'Shield Bearer',
  description: '+1 Shield at floor start',
  category: 'defense',
  rarity: 'common',
  icon: '🛡️',
  effect: {
    trigger: 'onFloorStart',
    description: '+1 Shield at floor start',
    magnitude: 1,
  },
  stackable: true,
  cost: 40,
}

// Iron Skin - Uncommon defense rune
{
  id: 'iron-skin',
  name: 'Iron Skin',
  description: '25% damage reduction',
  category: 'defense',
  rarity: 'uncommon',
  icon: '🔩',
  effect: {
    trigger: 'onDamage',
    description: '25% damage reduction',
    magnitude: 0.25,
  },
  stackable: false,
  cost: 55,
}

// Undying - Legendary defense rune
{
  id: 'undying',
  name: 'Undying',
  description: 'Heal 1 HP every 50 reveals',
  category: 'defense',
  rarity: 'legendary',
  icon: '💀',
  effect: {
    trigger: 'onReveal',
    description: 'Heal 1 HP per 50 reveals',
    magnitude: 50,
  },
  stackable: false,
  cost: 150,
}
```

### 3. Engine Updates

**`applyOnFloorStartRunes()`** - Add Shield Bearer:
```typescript
// Shield Bearer: +1 shield per rune at floor start
const shieldBearerCount = countRune(equippedRunes, 'shield-bearer');
if (shieldBearerCount > 0) {
  // Return shields to grant (store handles adding to player.shields)
  shieldsGranted = shieldBearerCount;
}
```

**`applyOnDamageRunes()`** - Add Iron Skin (after Stone Skin, before Lucky Charm):
```typescript
// Iron Skin: 25% damage reduction (minimum 1 damage)
if (finalDamage > 0 && equippedRunes.includes('iron-skin')) {
  finalDamage = Math.max(1, Math.floor(finalDamage * 0.75));
}
```

**`applyOnRevealRunes()`** - Add Undying:
```typescript
// Undying: Track reveals, heal at 50
const hasUndying = equippedRunes.includes('undying');
if (hasUndying) {
  // Store handles incrementing undyingRevealCount
  // If count >= 50: heal 1 HP, reset counter
  shouldHeal = newUndyingCount >= 50;
}
```

**`getPassiveRuneModifiers()`** - Add Hardy:
```typescript
case 'hardy':
  // +1 max lives (stackable)
  modifiers.maxLivesBonus += 1;
  break;
```

### 4. Store Integration

**On rune equip (Hardy)**:
- Calculate `maxLivesBonus` from modifiers
- If `maxLivesBonus > 0`: increase `maxLives` and `lives` by bonus amount

**On reveal (Undying)**:
- Increment `undyingRevealCount`
- If count >= 50 and lives < maxLives: heal 1, reset counter

**On floor start (Shield Bearer)**:
- Add `shieldsGranted` to `player.shields`

---

## File Changes Summary

| File | Change Type | Description |
|------|-------------|-------------|
| `src/types/player.ts` | Modify | Add `undyingRevealCount` to PlayerState |
| `src/types/rune.ts` | Modify | Add `damageReductionPercent`, `maxLivesBonus` to RuneModifiers |
| `src/data/runes.ts` | Modify | Add 4 new rune definitions |
| `src/engine/runes.ts` | Modify | Update 4 effect functions |
| `src/stores/gameStore.ts` | Modify | Handle new rune effects |
| `src/engine/__tests__/defenseRunes.test.ts` | Create | Unit tests for new runes |

---

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Hardy unequip kills player | Low | Clamp lives to maxLives on unequip |
| Undying counter lost on death | Low | Counter resets on new run (expected) |
| Iron Skin + Stone Skin stacking | Low | Clear damage order documented |
| Shield Bearer overwrites existing shields | Low | Additive, not replacement |

---

## Testing Strategy

1. **Unit Tests**: Each rune effect in isolation
2. **Integration**: Damage pipeline order verification
3. **Edge Cases**:
   - Hardy unequip with lives > new maxLives
   - Undying at maxLives (no heal, counter still tracks)
   - Multiple Shield Bearers stacking
4. **Manual Playtest**: Feel and balance check
