---
phase: '2020'
name: floor-shop
status: not_started
created: 2026-01-14
---

# 2020 - Floor Shop

**Goal**: Build the between-floor shop for run-lasting power-ups.

## Scope

- Shop UI modal
- Item catalog (HP, shields, buffs)
- Gold spending
- Item purchase flow
- Shop appears after each floor
- Continue button to proceed

## Deliverables

| File                                | Description               |
| ----------------------------------- | ------------------------- |
| `src/components/shop/FloorShop.tsx` | Shop modal                |
| `src/components/shop/ShopItem.tsx`  | Purchasable item          |
| `src/components/shop/ItemGrid.tsx`  | Item layout               |
| `src/data/shopItems.ts`             | Item definitions          |
| `src/stores/gameStore.ts`           | Updated: purchasing logic |

## Verification Gate

- [ ] Shop appears after clearing floor
- [ ] Items display with name, cost, description
- [ ] Can purchase if enough gold
- [ ] Gold deducted on purchase
- [ ] Can't purchase if insufficient gold
- [ ] Purchased items apply effect
- [ ] Continue button advances to next floor

## Estimated Complexity

**Medium** - UI + logic integration.

## Shop Items (MVP)

| Item          | Cost | Effect                |
| ------------- | ---- | --------------------- |
| Heal Potion   | 30g  | +1 HP                 |
| Max HP Up     | 80g  | +1 Max HP             |
| Shield Orb    | 40g  | +1 Shield             |
| Gold Magnet   | 60g  | 2x gold next floor    |
| Reveal Scroll | 50g  | Reveal 5 random tiles |

## Notes

- Port items from existing POC
- Randomize shop selection (3-4 items)
- Add reroll option (10g)
