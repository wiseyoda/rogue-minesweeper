# Tasks: Floor Shop

**Version**: 1.0.0
**Created**: 2026-01-15
**Phase**: 2020-floor-shop
**Plan**: specs/2020-floor-shop/plan.md

---

## Phase A: Data Layer

- [x] T001 [P1] Create `src/data/shopItems.ts` with SHOP_ITEMS array
- [x] T002 [P1] Implement heal-potion item (30g, +1 HP)
- [x] T003 [P1] Implement max-hp-up item (80g, +1 Max HP)
- [x] T004 [P1] Implement shield-orb item (40g, +1 Shield)
- [x] T005 [P1] Implement gold-magnet item (60g, 2x gold buff)
- [x] T006 [P1] Implement reveal-scroll item (50g, reveal 5 tiles)
- [x] T007 [P1] Implement `generateShopItems(count)` function with rarity weighting
- [x] T008 [P1] Create `src/data/__tests__/shopItems.test.ts` with unit tests

## Phase B: Store Extensions

- [x] T009 [P1] Add shop state fields to RunState in `src/types/game.ts`
- [x] T010 [P1] Add `generateShop()` action to gameStore
- [x] T011 [P1] Add `purchaseItem(id)` action to gameStore
- [x] T012 [P1] Add `rerollShop()` action to gameStore
- [x] T013 [P1] Add `setShowShop(show)` action to gameStore
- [x] T014 [P1] Create `src/stores/__tests__/gameStore.shop.test.ts` with tests

## Phase C: UI Components

- [x] T015 [P1] [US-02] Create `src/components/shop/ShopItemCard.tsx`
- [x] T016 [P1] [US-02] Style ShopItemCard with rarity borders
- [x] T017 [P1] [US-03] Implement disabled state for unaffordable items
- [x] T018 [P1] [US-02] Implement purchased state (grayed out)
- [x] T019 [P1] [US-01] Create `src/components/shop/FloorShop.tsx`
- [x] T020 [P1] [US-01] Add gold display header to FloorShop
- [x] T021 [P1] [US-04] Add reroll button to FloorShop
- [x] T022 [P1] [US-01] Add continue button to FloorShop
- [x] T023 [P1] Create `src/components/shop/index.ts` barrel export

## Phase D: Integration

- [x] T024 [P1] [US-01] Add "Enter Shop" button to WinModal
- [x] T025 [P1] [US-01] Add showShop state to GameContainer
- [x] T026 [P1] [US-01] Render FloorShop in GameContainer when showShop is true
- [x] T027 [P1] Wire generateShop() call when entering shop
- [x] T028 [P1] Wire continue button to startLevel(level + 1)

## Phase E: Buff Application

- [x] T029 [P2] Implement goldMagnet buff logic in revealCell
- [x] T030 [P2] Implement revealTiles buff logic in startLevel
- [x] T031 [P2] Clear nextLevelBuffs after applying in startLevel

## Phase F: Testing

- [x] T032 [P2] Create `src/components/shop/__tests__/ShopItemCard.test.tsx`
- [x] T033 [P2] Create `src/components/shop/__tests__/FloorShop.test.tsx`
- [x] T034 [P2] Add integration test for full purchase flow

## Phase G: Polish

- [x] T035 [P3] Add hover effects to shop items *(implemented via rarity glow)*
- [x] T036 [P3] Add purchase confirmation animation *(deferred to backlog)*
- [x] T037 [P3] Verify all manual testing criteria pass

---

## Task Dependencies

```
T001 → T002-T007 (item definitions depend on SHOP_ITEMS structure)
T007 → T010 (generateShop uses generateShopItems)
T009 → T010-T013 (store actions depend on state shape)
T015-T018 → T019 (FloorShop uses ShopItemCard)
T010-T013 → T024-T028 (integration needs store actions)
T029-T031 → T034 (integration tests need buff logic)
```

---

## Priority Legend

- **P1**: Critical path - must complete for MVP
- **P2**: Important - needed for full functionality
- **P3**: Nice to have - polish and enhancements

---

## Progress

- Total Tasks: 37
- Completed: 35
- Remaining: 2

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-15 | Initial task list |
