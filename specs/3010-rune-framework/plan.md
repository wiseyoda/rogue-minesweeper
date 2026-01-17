# Phase 3010: Rune Framework - Implementation Plan

**Version**: 1.0.0
**Created**: 2026-01-17

---

## Technical Context

### Current Architecture

The game uses:
- **Zustand + Immer** for state management
- **TypeScript** with strict mode
- **React** functional components with hooks
- **Existing shop pattern** in `FloorShop.tsx` with `ShopItemCard.tsx`

### Relevant Files

| File | Current Purpose | Change Type |
|------|-----------------|-------------|
| `src/types/player.ts` | Player state types | Extend |
| `src/types/game.ts` | Run state types | Extend |
| `src/types/rune.ts` | N/A (new) | Create |
| `src/types/index.ts` | Type exports | Extend |
| `src/data/runes.ts` | N/A (new) | Create |
| `src/stores/gameStore.ts` | Game state management | Extend |
| `src/components/shop/FloorShop.tsx` | Post-floor shop | Extend |
| `src/components/shop/RuneCard.tsx` | N/A (new) | Create |
| `src/components/sidebar/RunesPanel.tsx` | Shows active buffs | Modify |

---

## Implementation Approach

### Phase A: Type Definitions

Create rune type system following existing patterns.

**Files:**
1. `src/types/rune.ts` - Rune interfaces and types
2. `src/types/player.ts` - Add `equippedRunes: string[]` to PlayerState
3. `src/types/game.ts` - Add `availableRuneRewards: string[]` to RunState
4. `src/types/index.ts` - Export new types

**Pattern Reference:** Follow `src/types/shop.ts` for item type patterns.

### Phase B: Rune Data

Define 8 runes with effects.

**Files:**
1. `src/data/runes.ts` - Rune definitions array and helper functions

**Rune Definitions:**

| ID | Name | Category | Rarity | Effect |
|----|------|----------|--------|--------|
| scout-eye | Scout's Eye | information | common | onFloorStart: Reveal 2 safe tiles |
| oracle-sight | Oracle's Sight | information | uncommon | onReveal: 10% reveal adjacent safe |
| stone-skin | Stone Skin | defense | common | passive: First damage -1 per floor |
| lucky-charm | Lucky Charm | defense | uncommon | onDamage: 20% negate |
| midas-touch | Midas Touch | economy | common | passive: +25% gold |
| treasure-sense | Treasure Sense | economy | uncommon | onFloorStart: Mark high-value tile |
| swift-feet | Swift Feet | utility | common | passive: Auto-flag when satisfied |
| second-chance | Second Chance | utility | rare | onDamage: Survive fatal (1x per run) |

### Phase C: Store Actions

Add rune management to gameStore.

**New Actions:**
- `equipRune(runeId: string)` - Equip rune to available slot
- `replaceRune(slotIndex: number, newRuneId: string)` - Replace existing rune
- `generateRuneRewards()` - Generate 3 random runes for shop
- `selectRuneReward(runeId: string)` - Pick reward and equip
- `clearEquippedRunes()` - Called on run start

**Existing Action Updates:**
- `startNewRun()` - Clear equipped runes
- `startLevel()` - Apply onFloorStart rune effects
- `revealCell()` - Apply onReveal rune effects
- `takeDamage()` - Apply onDamage rune effects (need to identify where damage is processed)

### Phase D: Effect Processing

Implement effect trigger hooks.

**Effect Functions:**
```typescript
// src/engine/runes.ts (new file)
export function applyOnFloorStartRunes(equippedRunes: string[], grid: Grid): Grid;
export function applyOnRevealRunes(equippedRunes: string[], revealed: Position): Position[];
export function applyOnDamageRunes(equippedRunes: string[], damage: number): { damage: number; blocked: boolean };
export function getPassiveRuneModifiers(equippedRunes: string[]): RuneModifiers;
```

**Integration Points:**
- `startLevel` action calls `applyOnFloorStartRunes`
- `revealCell` action calls `applyOnRevealRunes`
- Damage processing calls `applyOnDamageRunes`
- Gold calculation uses `getPassiveRuneModifiers().goldMultiplier`

### Phase E: Shop UI

Integrate rune selection into FloorShop.

**Components:**
1. `RuneCard.tsx` - Rune selection card (similar to ShopItemCard)
2. Update `FloorShop.tsx` - Add "Rune Rewards" section

**UI Flow:**
```
FloorShop
├── "Rune Rewards" Section Header
│   └── 3x RuneCard (selectable, FREE)
├── Divider
└── "Items" Section (existing)
    └── ShopItemCards (purchasable)
```

**RuneCard Features:**
- Rune icon and name
- Effect description
- Category badge (color-coded)
- Rarity border
- "Select" button (not "Buy")
- Selected state indicator

### Phase F: Sidebar Display

Update RunesPanel to show equipped runes.

**Changes:**
- Rename header "Active Runes" → "Equipped Runes"
- Display equipped runes from `player.equippedRunes`
- Show custom rune icons (can use emoji for POC)
- Keep 3-slot dashed placeholder pattern
- Add tooltip with rune name and effect

---

## Constitution Compliance Check

| Principle | Compliant? | Notes |
|-----------|------------|-------|
| I. Information Is Power | ✅ | Scout's Eye, Oracle's Sight, Treasure Sense focus on information |
| II. The Dungeon Is Alive | N/A | Not relevant to runes |
| III. Emergent Complexity | ✅ | Runes add depth without front-loading complexity |
| IV. Resource Tension | ✅ | Choosing 1 of 3 runes creates opportunity cost |
| V. Passive Mastery | ✅ | All effects are passive, no ability buttons |
| VI. Juice Is Holistic | ⚠️ | Basic styling for POC, polish in future phase |
| VII. Move Fast | ✅ | 8 runes is achievable POC scope |

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Effect processing complexity | Medium | Medium | Start with simple effects, iterate |
| Shop UI crowding | Low | Low | Use clear section headers |
| Rune balance issues | Medium | Low | POC - can adjust in future phases |
| State persistence bugs | Low | Medium | Follow existing patterns, test thoroughly |

---

## File Change Summary

| File | Change Type | Lines (est) |
|------|-------------|-------------|
| `src/types/rune.ts` | New | ~50 |
| `src/types/player.ts` | Modify | +5 |
| `src/types/game.ts` | Modify | +5 |
| `src/types/index.ts` | Modify | +5 |
| `src/data/runes.ts` | New | ~100 |
| `src/engine/runes.ts` | New | ~150 |
| `src/stores/gameStore.ts` | Modify | +100 |
| `src/components/shop/RuneCard.tsx` | New | ~80 |
| `src/components/shop/FloorShop.tsx` | Modify | +50 |
| `src/components/sidebar/RunesPanel.tsx` | Modify | +30 |

**Total Estimated:** ~575 lines of code

---

## Testing Strategy

### Unit Tests
- Rune effect functions (`applyOnFloorStartRunes`, etc.)
- State transitions (`equipRune`, `replaceRune`)
- Helper functions (`getRune`, `generateRandomRunes`)

### Integration Tests
- Floor shop displays rune rewards
- Selecting rune equips it
- Rune effects apply at correct triggers
- Runes clear on new run

### Manual Testing
- Play through multiple floors selecting runes
- Verify each rune effect works
- Test edge cases (full slots, duplicate runes)
