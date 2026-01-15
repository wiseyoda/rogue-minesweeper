# Specification: Floor Shop

**Version**: 1.0.0
**Created**: 2026-01-15
**Phase**: 2020-floor-shop
**Status**: Draft

---

## Overview

Build the between-floor shop for run-lasting power-ups. After completing each floor, players enter a shop modal where they can spend gold on items that provide immediate or next-floor effects.

### Goals

1. Provide a meaningful gold sink for run progression
2. Create strategic decisions through item selection
3. Enable build variety through diverse item effects
4. Establish shop UI patterns for future expansion

### Non-Goals

- Permanent/meta upgrades (Phase 2040)
- Rune slots or equippable abilities (Phase 2030)
- Item stacking or inventory management
- Shop theming or NPC dialogue

---

## User Stories

### US-01: Basic Shopping Flow

**As a** player who just cleared a floor,
**I want to** see my stats and enter a shop,
**So that** I can spend gold before continuing.

**Acceptance Criteria**:
- WinModal shows "Enter Shop" button after stats
- Clicking "Enter Shop" opens FloorShop modal
- FloorShop shows available items with costs
- "Continue" button in shop proceeds to next floor

### US-02: Purchase Items

**As a** player with gold,
**I want to** buy items that help my run,
**So that** I can get stronger as I progress.

**Acceptance Criteria**:
- Items display name, description, cost
- Can purchase if gold >= cost
- Gold deducted immediately on purchase
- Item effect applied immediately or queued for next floor
- Cannot purchase same item twice in same shop

### US-03: Insufficient Gold Feedback

**As a** player without enough gold,
**I want to** see which items I can't afford,
**So that** I know to save up or skip.

**Acceptance Criteria**:
- Items I can't afford appear visually dimmed
- Cannot click/purchase unaffordable items
- Gold cost shown in red if insufficient

### US-04: Shop Reroll

**As a** player who doesn't like the current selection,
**I want to** pay to reroll the shop,
**So that** I can find better items.

**Acceptance Criteria**:
- Reroll button visible with cost (10g)
- Clicking reroll generates new item selection
- Reroll button disabled if can't afford

---

## Functional Requirements

### FR-01: Shop Modal Display

The FloorShop modal MUST:
- Display 3-4 randomly selected items
- Show player's current gold balance
- Show item grid with purchase buttons
- Include "Continue" button to proceed
- Include "Reroll" button with cost

### FR-02: Item Data Structure

Shop items MUST use existing `ShopItem` interface:
```typescript
interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  rarity?: ItemRarity;
  apply: (state: PlayerState, stats: PlayerStats) => void;
}
```

### FR-03: Item Catalog (MVP)

| ID | Name | Cost | Rarity | Effect |
|----|------|------|--------|--------|
| heal-potion | Heal Potion | 30g | common | +1 HP (up to max) |
| max-hp-up | Max HP Up | 80g | uncommon | +1 Max HP, +1 HP |
| shield-orb | Shield Orb | 40g | common | +1 Shield |
| gold-magnet | Gold Magnet | 60g | uncommon | 2x gold next floor |
| reveal-scroll | Reveal Scroll | 50g | uncommon | Reveal 5 random safe tiles |

### FR-04: Shop Generation

- Select 3-4 items randomly from catalog
- Weight selection by rarity (common 60%, uncommon 25%, rare 10%, legendary 5%)
- No duplicate items in same shop
- Store generated items in run state

### FR-05: Purchase Flow

1. Player clicks item purchase button
2. Verify gold >= cost
3. Deduct gold from player
4. Apply item effect via `item.apply()`
5. Mark item as purchased (disable in UI)
6. Update UI to reflect changes

### FR-06: Reroll Mechanic

- Reroll cost: 10 gold (constant)
- Reroll regenerates entire shop selection
- Previously purchased items NOT restored
- Reroll count unlimited (while gold permits)

### FR-07: Phase Transition

- Entering shop: phase = 'shopping' (already set by floor clear)
- Exiting shop: calls `startLevel(run.level + 1)`
- Shop state cleared on exit

---

## Technical Requirements

### TR-01: New Files

| File | Purpose |
|------|---------|
| `src/components/shop/FloorShop.tsx` | Main shop modal component |
| `src/components/shop/ShopItemCard.tsx` | Individual item display |
| `src/components/shop/index.ts` | Barrel export |
| `src/data/shopItems.ts` | Item definitions and shop generator |

### TR-02: Modified Files

| File | Change |
|------|--------|
| `src/components/ui/WinModal.tsx` | Add "Enter Shop" button |
| `src/components/game/GameContainer.tsx` | Add FloorShop modal rendering |
| `src/stores/gameStore.ts` | Add shop state and purchase action |
| `src/stores/types.ts` | Add shop state types |

### TR-03: Store Extensions

Add to `gameStore`:
```typescript
interface ShopState {
  items: ShopItem[];
  purchasedIds: Set<string>;
}

// Actions
generateShop: () => void;
purchaseItem: (itemId: string) => boolean;
rerollShop: () => boolean;
```

### TR-04: Component Hierarchy

```
GameContainer
├── Panel > GameBoard
├── WinModal (phase === 'shopping' && !showShop)
│   └── "Enter Shop" button
└── FloorShop (phase === 'shopping' && showShop)
    ├── Header (current gold)
    ├── ItemGrid
    │   └── ShopItemCard (x4)
    ├── Reroll button
    └── Continue button
```

---

## UI/UX Requirements

### UX-01: Visual Design

- Follow design system (Panel, Button components)
- Gold accent color for shop theme
- Item cards with rarity-colored borders
- Disabled state for unaffordable/purchased items

### UX-02: Item Card Layout

```
┌─────────────────────────┐
│  [Icon/Rarity Border]   │
│                         │
│     Item Name           │
│   Effect description    │
│                         │
│   ┌─────────────────┐   │
│   │  Purchase 40g   │   │
│   └─────────────────┘   │
└─────────────────────────┘
```

### UX-03: Shop Modal Layout

```
┌───────────────────────────────────┐
│         FLOOR SHOP                │
│         Gold: 150                 │
├───────────────────────────────────┤
│  ┌────┐  ┌────┐  ┌────┐  ┌────┐  │
│  │Item│  │Item│  │Item│  │Item│  │
│  │ 1  │  │ 2  │  │ 3  │  │ 4  │  │
│  └────┘  └────┘  └────┘  └────┘  │
├───────────────────────────────────┤
│   [Reroll 10g]    [Continue →]    │
└───────────────────────────────────┘
```

---

## Testing Requirements

### Unit Tests

- `shopItems.ts`: Item definitions valid, apply functions work
- `gameStore`: Shop generation, purchase, reroll actions
- `FloorShop.tsx`: Renders items, handles clicks
- `ShopItemCard.tsx`: Display states (affordable, unaffordable, purchased)

### Integration Tests

- Full purchase flow: gold deducted, effect applied
- Reroll: new items generated, gold deducted
- Continue: advances to next floor

### Manual Testing

- [ ] Shop appears after clearing floor
- [ ] Items display correctly with costs
- [ ] Can purchase affordable items
- [ ] Cannot purchase unaffordable items
- [ ] Effects apply correctly (HP, shields, buffs)
- [ ] Reroll generates new selection
- [ ] Continue advances to next floor

---

## Constitution Compliance

| Principle | Alignment |
|-----------|-----------|
| IV. Resource Tension | Shop creates meaningful gold spending decisions |
| VII. Move Fast | MVP with 5 items, extensible for future |
| I. Information Is Power | Reveal Scroll aligns with information theme |

---

## Dependencies

- Phase 2010 (Floor Progression): Gold bonus provides shop currency
- Existing types: `ShopItem`, `PlayerState`, `ItemRarity`
- Existing components: `Panel`, `Button`, `WinModal`

---

## Open Questions

None - scope is well-defined from phase definition.

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-15 | Initial specification |
