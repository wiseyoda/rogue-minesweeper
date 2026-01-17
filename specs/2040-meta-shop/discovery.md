# Discovery: Phase 2040 - Shop Polish & First Click Safety

**Phase**: 2040
**Date**: 2026-01-15
**Status**: Discovery Complete

---

## Codebase Examination

### Existing Shop Components

| Component | Location | Purpose | Polish Level |
|-----------|----------|---------|--------------|
| `FloorShop.tsx` | `src/components/shop/` | Between-floor item shop | Basic |
| `ShopItemCard.tsx` | `src/components/shop/` | Floor shop item card | Basic |
| `UpgradeShopModal.tsx` | `src/components/ui/` | Permanent upgrade shop | Basic |
| `WinModal.tsx` | `src/components/ui/` | Level complete stats | Basic |
| `Panel.tsx` | `src/components/ui/` | Design system panel | **Reference** |

### Panel Component (Design Standard)

The `Panel.tsx` component implements the correct design system:
- Gold corner accents with hover animation
- Proper gradient backgrounds
- Inset shadows for depth
- Uses CSS custom properties from mockup

**All shop modals should use Panel internally for consistency.**

### Current Shop Issues

#### FloorShop.tsx
- No animated corners (Panel not used)
- Missing SVG icons for items
- No purchase animation/feedback
- Basic gold counter without animation
- Items have basic styling, not matched to mockup

#### ShopItemCard.tsx
- Rarity colors are good
- Missing icons (text only)
- No hover/click animations
- Border is 2px (mockup uses 3px)
- No inset shadow depth

#### UpgradeShopModal.tsx
- Not using Panel component
- Missing corner accents
- No purchase animation
- Basic button styling
- Level display is functional but plain
- 5 upgrades in 2-column grid - consider layout

### First Click Safety Gap (BL-001)

**Problem**: The `firstClickSafety` upgrade can be purchased but has NO game effect.

**Flow Analysis**:
```
User purchases upgrade → playerStats.firstClickSafety = true ✓
Run starts → flag set on playerStats ✓
Player clicks monster → takeDamage() called ✗ (should check flag!)
```

**Implementation Location**: `src/stores/gameStore.ts` lines 250-260

**Current Code (line 256)**:
```typescript
takeDamage(1);
```

**Missing Check**:
```typescript
if (playerStats.firstClickSafety && run.firstMonsterHit === false) {
  // Flag the cell instead of taking damage
  run.firstMonsterHit = true;
  toggleFlag(position);
  return;
}
```

**New State Needed**: `run.firstMonsterHit: boolean` to track if this safety has been used.

---

## Design System Reference

From `.specify/reference/ui-mockup-definitive.html`:

### Colors to Use
```css
--stone-800: #1e1e30    /* Panel background start */
--stone-850: #18182a    /* Panel background end */
--stone-700: #2a2a40    /* Card background */
--gold: #d0a020         /* Accent, borders */
--gold-dark: #806000    /* Shadows */
--bone: #c4b8a0         /* Primary text */
--bone-light: #e8dcc4   /* Emphasized text */
```

### Panel Structure (from mockup)
```css
.panel {
  background: linear-gradient(135deg, var(--stone-800) 0%, var(--stone-850) 100%);
  border: 3px solid var(--stone-600);
  box-shadow:
    inset 2px 2px 0 var(--stone-500),
    inset -2px -2px 0 var(--abyss),
    0 8px 0 var(--void),
    0 12px 24px rgba(0, 0, 0, 0.6);
}
```

### Timing Tokens
- `--tick: 50ms` - Instant feedback
- `--beat: 100ms` - Quick transitions
- `--breath: 200ms` - Standard animations
- `--pulse: 400ms` - Noticeable effects

---

## User Feedback

From screenshots provided by user:
1. Both shops are "meh" - functional but not polished
2. Need SVG icons instead of text-only
3. Should match quality of main game UI
4. Animated corners like Panel component
5. Purchase feedback animations

---

## Scope Confirmation

Based on discovery, Phase 2040 should:

### Must Have (P0)
1. **BL-001 Fix**: First Click Safety game logic
2. **FloorShop Polish**: Use Panel, add icons, purchase feedback
3. **UpgradeShopModal Polish**: Use Panel, better layout, purchase feedback

### Should Have (P1)
4. **Reusable ShopItemCard**: With icon slot and animations
5. **UpgradeCard refactor**: Better visual treatment for maxed/locked states
6. **SVG Icons**: Create shop icon set (heal, shield, gold, scroll, etc.)

### Nice to Have (P2)
7. Run stats in UpgradeShopModal
8. Death animation delay before shop
9. High score comparison display

---

## Dependencies

- Panel component exists and is well-implemented
- Button component exists
- CSS custom properties are defined in app styles
- No new npm packages needed

---

## Next Steps

1. Proceed to SPECIFY step with this scope
2. Focus on P0 and P1 items
3. P2 items can be deferred to Phase 6010 (visual-juice)
