---
phase: '2040'
name: meta-shop
status: not_started
created: 2026-01-14
---

# 2040 - Meta Shop

**Goal**: Build the end-of-run shop for permanent upgrades.

## Scope

- Meta shop UI modal
- Display available upgrades
- Show current levels and costs
- Purchase flow
- Appears after death
- New Run button

## Deliverables

| File                                  | Description             |
| ------------------------------------- | ----------------------- |
| `src/components/shop/MetaShop.tsx`    | Meta shop modal         |
| `src/components/shop/UpgradeItem.tsx` | Upgrade display         |
| `src/components/shop/UpgradeGrid.tsx` | Grid layout             |
| `src/pages/GamePage.tsx`              | Updated: meta shop flow |

## Verification Gate

- [ ] Meta shop appears after death
- [ ] Shows remaining gold from run
- [ ] Displays all permanent upgrades
- [ ] Shows current level / max level
- [ ] Can purchase upgrades
- [ ] Gold persists for next run
- [ ] New Run starts fresh run with upgrades applied

## Estimated Complexity

**Low** - Similar to floor shop, different items.

## UI Flow

```
Death → Show all monsters → 2s delay → Meta Shop Modal
  ↓
Spend gold on upgrades
  ↓
Click "New Run" → Start new run with upgrades
```

## Notes

- Display run stats (floor reached, gold earned)
- Show high score comparison
- Consider "skip" option (save gold for later)
