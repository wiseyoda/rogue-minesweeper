# Discovery: Phase 2020 - Floor Shop

**Created**: 2026-01-15
**Phase**: 2020-floor-shop

## Codebase Examination

### Existing Type Infrastructure

The codebase already has comprehensive shop-related types:

#### `src/types/item.ts`
- `ShopItem` interface with `id`, `name`, `description`, `cost`, `rarity`, `apply()`
- `ItemRarity` type: `'common' | 'uncommon' | 'rare' | 'legendary'`
- `RARITY_WEIGHTS` for random selection
- `ShopItemPool` for organizing items by rarity
- `ShopItemDisplay` with CSS class helpers

#### `src/types/player.ts`
- `ActiveBuffs` for current-level effects (goldMagnet, steadyHand, etc.)
- `NextLevelBuffs` for purchased effects (revealTiles, shields, etc.)
- `PlayerState.gold` for currency tracking

#### `src/types/shop.ts`
- `PermanentUpgrade` types for meta-shop (not this phase)
- Upgrade cost calculation utilities

### Current Game Flow

1. **Phase Transition**: When floor is cleared, `setPhase('shopping')` is called
2. **Gold Bonus**: Floor bonus (`level * 10`) already awarded in `setPhase`
3. **WinModal**: Currently shows stats and "Continue" button
4. **Continue**: Calls `startLevel(run.level + 1)` directly

### Integration Points

- `GameContainer.tsx:72`: Shows WinModal when `phase === 'shopping'`
- `gameStore.ts:197`: `setPhase('shopping')` awards gold bonus
- `gameStore.ts:185`: `addGold()` action exists
- `gameStore.ts:191`: `addShield()` action exists

### Missing Components

No shop UI components exist yet:
- `src/components/shop/` directory doesn't exist
- `src/data/shopItems.ts` doesn't exist
- No purchasing logic in gameStore

### Design Reference

From mockup (`ui-mockup-definitive.html`):
- "ENTER SHOP" button exists in sidebar
- Uses existing Panel styling and Button components
- Gold color theme for shop elements

## User Intent Clarifications

### Scope from Phase Definition

From `.specify/phases/2020-floor-shop.md`:
- Shop UI modal
- Item catalog (HP, shields, buffs)
- Gold spending
- Item purchase flow
- Shop appears after each floor
- Continue button to proceed

### MVP Items Defined

| Item          | Cost | Effect                |
| ------------- | ---- | --------------------- |
| Heal Potion   | 30g  | +1 HP                 |
| Max HP Up     | 80g  | +1 Max HP             |
| Shield Orb    | 40g  | +1 Shield             |
| Gold Magnet   | 60g  | 2x gold next floor    |
| Reveal Scroll | 50g  | Reveal 5 random tiles |

### Additional Notes
- Randomize shop selection (3-4 items per shop)
- Add reroll option (10g)

## Architecture Decisions

### Flow Options

**Option A: Integrated in WinModal (Simpler)**
- Add shop items below stats in WinModal
- Single modal handles both win summary and shopping

**Option B: Separate FloorShop Modal (Phase def recommends)**
- WinModal shows stats + "Enter Shop" button
- FloorShop modal appears with item grid
- Continue button in FloorShop

**Recommendation**: Option B - matches phase definition deliverables

### Item Application

Items should apply their effects via:
1. `ShopItem.apply(playerState, playerStats)` - already defined in types
2. Game store actions: `addGold`, `addShield`, or new actions for buffs

### Shop Generation

Random shop using existing `RARITY_WEIGHTS` from `src/types/item.ts`:
- common: 60%, uncommon: 25%, rare: 10%, legendary: 5%
- Select 3-4 items per shop
- Reroll replaces current selection

## Constraints

1. Must use existing `ShopItem` interface
2. Must integrate with `PlayerState.nextLevelBuffs`
3. Must follow design system (Panel, Button components)
4. Phase `'shopping'` already exists - use it

## Questions for User

None identified - phase definition is comprehensive and matches existing type system.
