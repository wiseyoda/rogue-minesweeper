# Requirements Checklist: Floor Shop

**Purpose**: Verify all functional requirements from spec.md are properly defined
**Created**: 2026-01-15
**Feature**: specs/2020-floor-shop/spec.md

## Functional Requirements

- [x] REQ-001 FR-01: FloorShop modal displays 3-4 randomly selected items
- [x] REQ-002 FR-01: FloorShop shows player's current gold balance
- [x] REQ-003 FR-01: FloorShop includes Continue button
- [x] REQ-004 FR-01: FloorShop includes Reroll button with cost
- [x] REQ-005 FR-02: Shop items use existing `ShopItem` interface
- [x] REQ-006 FR-03: Heal Potion item implemented (30g, +1 HP)
- [x] REQ-007 FR-03: Max HP Up item implemented (80g, +1 Max HP)
- [x] REQ-008 FR-03: Shield Orb item implemented (40g, +1 Shield)
- [x] REQ-009 FR-03: Gold Magnet item implemented (60g, 2x gold)
- [x] REQ-010 FR-03: Reveal Scroll item implemented (50g, reveal 5 tiles)
- [x] REQ-011 FR-04: Shop generation selects 3-4 items randomly
- [x] REQ-012 FR-04: Shop generation weights by rarity
- [x] REQ-013 FR-04: No duplicate items in same shop
- [x] REQ-014 FR-05: Purchase verifies gold >= cost
- [x] REQ-015 FR-05: Purchase deducts gold from player
- [x] REQ-016 FR-05: Purchase applies item effect
- [x] REQ-017 FR-05: Purchased items disabled in UI
- [x] REQ-018 FR-06: Reroll costs 10 gold
- [x] REQ-019 FR-06: Reroll regenerates shop selection
- [x] REQ-020 FR-07: Continue button calls startLevel(level + 1)

## Technical Requirements

- [x] REQ-021 TR-01: `src/components/shop/FloorShop.tsx` created
- [x] REQ-022 TR-01: `src/components/shop/ShopItemCard.tsx` created
- [x] REQ-023 TR-01: `src/components/shop/index.ts` barrel export created
- [x] REQ-024 TR-01: `src/data/shopItems.ts` created with item definitions
- [x] REQ-025 TR-02: WinModal updated with "Enter Shop" button
- [x] REQ-026 TR-02: GameContainer renders FloorShop modal
- [x] REQ-027 TR-03: gameStore has generateShop action
- [x] REQ-028 TR-03: gameStore has purchaseItem action
- [x] REQ-029 TR-03: gameStore has rerollShop action

## User Story Acceptance

- [x] REQ-030 US-01: WinModal shows Enter Shop button
- [x] REQ-031 US-01: FloorShop opens when Enter Shop clicked
- [x] REQ-032 US-02: Can purchase items with sufficient gold
- [x] REQ-033 US-02: Item effects apply correctly
- [x] REQ-034 US-03: Unaffordable items visually dimmed
- [x] REQ-035 US-03: Cannot click unaffordable items
- [x] REQ-036 US-04: Reroll button works with 10g cost

## Testing Requirements

- [x] REQ-037 Unit tests for shopItems.ts
- [x] REQ-038 Unit tests for gameStore shop actions
- [x] REQ-039 Component tests for FloorShop
- [x] REQ-040 Component tests for ShopItemCard

## Notes

- Check items off as completed: `[x]`
- Items are numbered sequentially for easy reference
- Link to relevant code locations when marking complete
