---
phase: '2040'
name: meta-shop
status: not_started
created: 2026-01-14
updated: 2026-01-15
---

# 2040 - Shop Polish & First Click Safety

**Goal**: Polish both shop UIs to match the main game's visual quality and implement the missing First Click Safety upgrade logic.

## Context

Phase 2030 already implemented the core upgrade shop functionality. This phase focuses on:
1. **Visual polish** - Bring shops up to the design standard of the main game
2. **BL-001 hotfix** - Implement missing First Click Safety game logic
3. **Store refinement** - Ensure stores are clean and well-tested

## Scope

### Visual Polish (Primary Focus)
- Floor Shop (`WinModal` / shop UI) visual upgrade to match mockup
- Upgrade Shop (`UpgradeShopModal`) visual upgrade to match mockup
- Add SVG icons for shop items and upgrades
- Implement panel styling with animated corners
- Apply stone/bone/gold color palette from design system
- Add proper shadows, depth, and atmospheric effects
- Purchase animations and feedback

### BL-001: First Click Safety Implementation
- Implement game logic in `gameStore.ts` to check `firstClickSafety` flag
- When first monster hit: flag instead of damage (if upgrade purchased)
- Track first monster hit per run (separate from first click)

### Store Polish
- Review and clean up gameStore shop integration
- Ensure proper TypeScript types and documentation
- Add any missing test coverage

## Deliverables

| File | Description |
| ---- | ----------- |
| `src/components/ui/FloorShopModal.tsx` | Polished floor shop modal |
| `src/components/ui/UpgradeShopModal.tsx` | Updated: polished styling |
| `src/components/ui/ShopItemCard.tsx` | Reusable shop item component |
| `src/components/ui/UpgradeCard.tsx` | Reusable upgrade component |
| `src/components/icons/ShopIcons.tsx` | SVG icons for shop items |
| `src/stores/gameStore.ts` | Updated: firstClickSafety logic |
| `src/stores/__tests__/gameStore.firstClickSafety.test.ts` | Tests for safety logic |

## Verification Gate

- [ ] Floor Shop matches mockup design quality
- [ ] Upgrade Shop matches mockup design quality
- [ ] SVG icons display for all items
- [ ] Panel styling with animated corners
- [ ] Purchase has visual feedback
- [ ] First Click Safety upgrade actually works (flags first monster)
- [ ] All 5 permanent upgrades function correctly
- [ ] Tests pass for firstClickSafety

## Estimated Complexity

**Medium** - UI polish + game logic fix.

## Design References

See `.specify/reference/ui-mockup-definitive.html` for:
- Panel styling (`.panel` class with corners)
- Color palette (stone, bone, gold, mystic, blood)
- Typography (Press Start 2P, 10px base)
- Timing tokens (--tick, --beat, --breath, --pulse, --wave)
- Shadow system (inset highlights, drop shadows)

## Notes

- Keep functionality intact - this is polish only
- Reference existing Panel component for consistency
- Use CSS custom properties from design system
- No new dependencies needed
