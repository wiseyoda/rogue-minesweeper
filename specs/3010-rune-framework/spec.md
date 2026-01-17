# Phase 3010: Rune Framework - Specification

**Version**: 1.0.0
**Status**: Draft
**Created**: 2026-01-17

---

## Overview

Build the foundational rune system that provides passive, information-focused abilities during runs. Runes are awarded as free rewards when completing floors and persist for the entire run.

### Goal

Implement a rune collection and equipment system that:
- Rewards players with rune choices after each floor
- Provides passive bonuses aligned with "information is power" principle
- Integrates with existing floor shop UI
- Creates meaningful build decisions through rune selection

### Non-Goals

- Active abilities or cooldowns (violates constitution)
- Permanent rune collection (run-only for this phase)
- Rune crafting or upgrading
- More than 8 runes (POC scope)

---

## User Stories

### US-1: Rune Type System
**As a** developer
**I want** well-defined rune types and effect structures
**So that** runes can be consistently created and processed

**Acceptance Criteria:**
- [ ] Rune interface includes: id, name, description, category, rarity, icon, effect
- [ ] Categories: information, defense, economy, utility
- [ ] Rarities: common, uncommon, rare, legendary
- [ ] Effect triggers: passive, onReveal, onFloorStart, onDamage
- [ ] Stackable flag determines if duplicates combine

### US-2: Rune Definitions
**As a** player
**I want** 6-8 distinct runes with unique passive effects
**So that** I can build different strategies each run

**Acceptance Criteria:**
- [ ] 2 information runes (reveal/prediction focused)
- [ ] 2 defense runes (damage mitigation)
- [ ] 2 economy runes (gold/resource focused)
- [ ] 2 utility runes (quality of life)
- [ ] Each rune has clear, passive effect
- [ ] Effects align with Minesweeper deduction mechanics

### US-3: Rune Inventory
**As a** player
**I want** to equip up to 3 runes during a run
**So that** I can customize my build

**Acceptance Criteria:**
- [ ] Player state tracks equipped runes (max 3)
- [ ] Runes persist until run ends (death or win)
- [ ] Runes cleared on new run start
- [ ] Can replace equipped rune when at capacity (picking new rune swaps out old)

### US-4: Floor Shop Integration
**As a** player
**I want** to choose a rune reward in the floor shop after clearing a floor
**So that** I can build my run strategically

**Acceptance Criteria:**
- [ ] "Rune Rewards" section appears in floor shop
- [ ] Shows 3 random rune options per floor
- [ ] Player picks 1 rune for FREE (not purchased with gold)
- [ ] Selected rune auto-equips to available slot
- [ ] If at 3 runes, shows option to replace or skip
- [ ] Rune section distinct from purchasable items section

### US-5: Rune Effect Processing
**As a** player
**I want** my equipped runes to apply their effects automatically
**So that** I benefit from my choices without manual activation

**Acceptance Criteria:**
- [ ] Passive effects apply continuously
- [ ] onReveal effects trigger when revealing tiles
- [ ] onFloorStart effects trigger at level start
- [ ] onDamage effects trigger when taking damage
- [ ] Effects stack appropriately for duplicate runes (if stackable)

### US-6: Rune Display
**As a** player
**I want** to see my equipped runes in the sidebar
**So that** I know what bonuses I have active

**Acceptance Criteria:**
- [ ] RunesPanel shows equipped runes with icons
- [ ] Shows rune name on hover/tooltip
- [ ] Empty slots shown as dashed placeholders
- [ ] Visual distinction from shop buffs (if both displayed)

---

## Technical Requirements

### TR-1: Data Model

```typescript
// src/types/rune.ts
export type RuneCategory = 'information' | 'defense' | 'economy' | 'utility';
export type RuneRarity = 'common' | 'uncommon' | 'rare' | 'legendary';
export type RuneTrigger = 'passive' | 'onReveal' | 'onFloorStart' | 'onDamage';

export interface RuneEffect {
  trigger: RuneTrigger;
  description: string;
  magnitude?: number;
}

export interface RuneDefinition {
  id: string;
  name: string;
  description: string;
  category: RuneCategory;
  rarity: RuneRarity;
  icon: string;  // Emoji or icon component name
  effect: RuneEffect;
  stackable: boolean;
}
```

### TR-2: State Management

```typescript
// Extend PlayerState in src/types/player.ts
export interface PlayerState {
  // ... existing fields
  equippedRunes: string[];  // Rune IDs, max 3
}

// Extend RunState in src/types/game.ts
export interface RunState {
  // ... existing fields
  availableRuneRewards: string[];  // 3 random rune IDs for current shop
}
```

### TR-3: Store Actions

```typescript
// Add to gameStore
equipRune: (runeId: string) => void;
replaceRune: (oldRuneId: string, newRuneId: string) => void;
generateRuneRewards: () => void;  // Generate 3 random runes for shop
clearRuneRewards: () => void;
```

### TR-4: Effect Processing Hooks

- `applyPassiveRuneEffects()` - Called during game state updates
- `triggerOnRevealRunes()` - Called in revealCell action
- `triggerOnFloorStartRunes()` - Called in startLevel action
- `triggerOnDamageRunes()` - Called when player takes damage

---

## Initial Rune Definitions (POC)

### Information Category
1. **Scout's Eye** (Common) - onFloorStart: Reveal 2 random safe tiles at floor start
2. **Oracle's Sight** (Uncommon) - onReveal: 10% chance to also reveal an adjacent safe tile

### Defense Category
3. **Stone Skin** (Common) - passive: First damage each floor is reduced by 1
4. **Lucky Charm** (Uncommon) - onDamage: 20% chance to negate damage completely

### Economy Category
5. **Midas Touch** (Common) - passive: +25% gold from all sources
6. **Treasure Sense** (Uncommon) - onFloorStart: Mark 1 high-value tile (shows gold icon)

### Utility Category
7. **Swift Feet** (Common) - passive: Auto-flag adjacent cells when number is satisfied
8. **Second Chance** (Rare) - onDamage: Once per run, survive fatal damage with 1 HP

---

## UI Components

### FloorShop Enhancement
- Add "Rune Rewards" section header
- Show 3 RuneCard components in a row
- "Select" button on each card (not "Buy")
- Visual indicator for "FREE" vs purchasable items

### RuneCard Component
- Similar to ShopItemCard but with rune-specific styling
- Category icon/color coding
- Rarity border (gold for rare, etc.)
- Effect description

### RunesPanel Update
- Rename from "Active Runes" to "Equipped Runes" for clarity
- Show equipped runes with custom rune icons (not emoji)
- Keep 3-slot layout

---

## Constitution Compliance

| Principle | How This Phase Complies |
|-----------|------------------------|
| I. Information Is Power | Scout's Eye, Oracle's Sight, Treasure Sense focus on revealing information |
| V. Passive Mastery | All rune effects are passive - no buttons or cooldowns |
| IV. Resource Tension | Rune choices create opportunity cost (can only pick 1 of 3) |
| VII. Move Fast | 8 runes is enough to prove system, can expand later |

---

## Dependencies

- Phase 2020 (Floor Shop) - Must be complete ✅
- Phase 2040 (Meta Shop) - Provides patterns for shop UI ✅

## Out of Scope

- Rune synergies/combos (future phase)
- Rune leveling/upgrading
- Permanent rune collection
- More than 8 runes
- Custom rune icons (use emoji for POC)
