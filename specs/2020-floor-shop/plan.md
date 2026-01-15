# Implementation Plan: Floor Shop

**Version**: 1.0.0
**Created**: 2026-01-15
**Phase**: 2020-floor-shop
**Spec**: specs/2020-floor-shop/spec.md

---

## Technical Context

### Existing Infrastructure

The codebase already has shop-related type infrastructure:

| File | Relevant Types |
|------|----------------|
| `src/types/item.ts` | `ShopItem`, `ItemRarity`, `RARITY_WEIGHTS`, `ShopItemPool` |
| `src/types/player.ts` | `PlayerState`, `NextLevelBuffs`, `ActiveBuffs` |
| `src/stores/gameStore.ts` | `addGold()`, `addShield()`, `setPhase()` |

### Integration Points

- `GameContainer.tsx` manages modal display based on `run.phase`
- `WinModal` shows when `phase === 'shopping'`
- `startLevel(n)` handles floor transition
- Gold bonus already awarded when entering shopping phase

---

## Architecture

### State Design

```typescript
// Add to RunState in types/game.ts
interface RunState {
  // ... existing fields
  shopItems: ShopItem[];      // Current shop selection
  purchasedIds: string[];     // Items bought this shop visit
  showShop: boolean;          // Whether shop modal is open
}
```

### Component Tree

```
GameContainer
├── WinModal (showShop === false)
│   ├── Stats display
│   └── "Enter Shop" button → setShowShop(true)
└── FloorShop (showShop === true)
    ├── Header (gold display)
    ├── ShopItemCard[] (3-4 items)
    ├── Reroll button
    └── Continue button → startLevel(n+1)
```

### Data Flow

```
1. Floor cleared → setPhase('shopping') → gold bonus added
2. WinModal shows → user clicks "Enter Shop"
3. generateShop() called → shopItems populated
4. FloorShop renders with items
5. User purchases → purchaseItem(id) → gold deducted, effect applied
6. User clicks Continue → startLevel(level + 1)
```

---

## Implementation Phases

### Phase A: Data Layer (Foundation)

Create item definitions and shop generation logic.

**Files**:
- `src/data/shopItems.ts` - Item catalog and generation

**Approach**:
- Define SHOP_ITEMS constant array with all items
- Implement `generateShopItems(count)` using rarity weights
- Export item lookup by ID

### Phase B: Store Extensions

Add shop state and actions to gameStore.

**Files**:
- `src/stores/types.ts` - Add ShopState types
- `src/stores/gameStore.ts` - Add shop actions

**New Actions**:
```typescript
generateShop(): void     // Populate shopItems with random selection
purchaseItem(id): void   // Deduct gold, apply effect, track purchase
rerollShop(): void       // Pay 10g, regenerate items
setShowShop(show): void  // Toggle shop modal visibility
```

### Phase C: UI Components

Build shop modal and item cards.

**Files**:
- `src/components/shop/ShopItemCard.tsx` - Individual item display
- `src/components/shop/FloorShop.tsx` - Shop modal container
- `src/components/shop/index.ts` - Barrel export

**Component Design**:

ShopItemCard:
```typescript
interface ShopItemCardProps {
  item: ShopItem;
  canAfford: boolean;
  isPurchased: boolean;
  onPurchase: () => void;
}
```

FloorShop:
```typescript
interface FloorShopProps {
  items: ShopItem[];
  gold: number;
  purchasedIds: string[];
  onPurchase: (id: string) => void;
  onReroll: () => void;
  onContinue: () => void;
}
```

### Phase D: Integration

Wire components into existing game flow.

**Files**:
- `src/components/ui/WinModal.tsx` - Add "Enter Shop" button
- `src/components/game/GameContainer.tsx` - Render FloorShop

**Flow Changes**:
1. WinModal gets `onEnterShop` prop
2. GameContainer tracks `showShop` state
3. FloorShop rendered when `showShop && phase === 'shopping'`

### Phase E: Testing

Add unit and component tests.

**Files**:
- `src/data/__tests__/shopItems.test.ts`
- `src/stores/__tests__/gameStore.shop.test.ts`
- `src/components/shop/__tests__/FloorShop.test.tsx`
- `src/components/shop/__tests__/ShopItemCard.test.tsx`

---

## Item Effect Implementations

### Heal Potion (heal-potion)
```typescript
apply: (state) => {
  state.lives = Math.min(state.lives + 1, state.maxLives);
}
```

### Max HP Up (max-hp-up)
```typescript
apply: (state) => {
  state.maxLives += 1;
  state.lives += 1; // Also heal 1
}
```

### Shield Orb (shield-orb)
```typescript
apply: (state) => {
  state.shields += 1;
}
```

### Gold Magnet (gold-magnet)
```typescript
apply: (state) => {
  state.nextLevelBuffs.goldMagnet = true;
}
```

### Reveal Scroll (reveal-scroll)
```typescript
apply: (state) => {
  state.nextLevelBuffs.revealTiles = (state.nextLevelBuffs.revealTiles || 0) + 5;
}
```

---

## Constitution Compliance Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Information Is Power | ✅ | Reveal Scroll provides information advantage |
| II. Dungeon Is Alive | N/A | No DM integration this phase |
| III. Emergent Complexity | ✅ | Simple shop, expandable later |
| IV. Resource Tension | ✅ | Gold scarcity creates meaningful choices |
| V. Passive Mastery | ✅ | All items are passive effects |
| VI. Juice Is Holistic | ⚠️ | Basic polish, can enhance later |
| VII. Move Fast | ✅ | MVP with 5 items |

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| NextLevelBuffs not consumed | Medium | Medium | Verify in startLevel |
| Rarity weights don't feel right | Low | Low | Tune after playtesting |
| Shop feels sparse | Low | Low | Add more items in future phase |

---

## Dependencies

### Internal
- `src/types/item.ts` - ShopItem interface
- `src/types/player.ts` - PlayerState, NextLevelBuffs
- `src/components/ui/Panel.tsx` - Modal styling
- `src/components/ui/Button.tsx` - Action buttons

### External
- None - all dependencies already in project

---

## Testing Strategy

### Unit Tests
- Shop generation produces correct count
- Rarity weights respected over many samples
- Purchase action deducts gold correctly
- Item effects modify state correctly

### Component Tests
- ShopItemCard renders all states
- FloorShop handles purchase clicks
- Disabled state prevents interaction

### Integration Tests
- Full flow: win → shop → purchase → continue
- Reroll regenerates items
- NextLevelBuffs applied on level start

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-15 | Initial plan |
