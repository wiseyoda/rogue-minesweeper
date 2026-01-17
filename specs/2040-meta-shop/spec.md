# Specification: Shop Polish & First Click Safety

**Phase**: 2040
**Version**: 1.0
**Date**: 2026-01-15
**Status**: Draft

---

## Overview

Polish both shop UIs to match the main game's visual quality and implement the missing First Click Safety upgrade logic.

### Problem Statement

1. Both shop UIs (FloorShop and UpgradeShopModal) are functional but visually "meh" compared to the polished main game
2. The First Click Safety upgrade can be purchased but has no game effect (BL-001)
3. Shops don't use the Panel component with animated corners
4. No icons - text only for items

### Goals

1. **Visual Parity**: Make shops look as polished as the main game
2. **BL-001 Fix**: First Click Safety actually works when purchased
3. **Consistency**: Use Panel component and design system throughout
4. **Feedback**: Add purchase animations and visual feedback

### Non-Goals

- New shop items or upgrades (future phases)
- Run stats display in UpgradeShopModal (defer to 6010)
- Death animation delay (defer to 6010)
- High score comparison (defer to 6010)
- Sound effects (Phase 6020)

---

## Requirements

### R1: First Click Safety Implementation (BL-001)

**Priority**: P0 - Critical

#### R1.1: Track First Monster Hit
- Add `firstMonsterHit: boolean` to RunState type
- Initialize to `false` in `startNewRun()`
- Persists for entire run (resets on new run)

#### R1.2: Check Safety on Monster Reveal
- In `revealCell()` when monster hit:
  - Check if `playerStats.firstClickSafety === true`
  - Check if `run.firstMonsterHit === false`
  - If both true: flag the cell instead of taking damage
  - Set `run.firstMonsterHit = true`
  - Show message: "First Click Safety saved you!"

#### R1.3: Test Coverage
- Unit tests for first click safety logic
- Test that safety only applies once per run
- Test that safety doesn't apply if not purchased

---

### R2: FloorShop Visual Polish

**Priority**: P0 - Critical

#### R2.1: Use Panel Component
- Wrap shop modal content in `<Panel>` component
- Animated gold corners should display on hover

#### R2.2: Add SVG Icons to Items
- Create icon components for each shop item:
  - Heal Potion: Red potion bottle
  - Max HP Up: Red heart with plus
  - Shield Orb: Blue shield bubble
  - Gold Magnet: Yellow magnet with coins
  - Reveal Scroll: Purple scroll with eye
- Icons should be 24x24px inline SVGs

#### R2.3: Purchase Feedback
- On successful purchase:
  - Brief gold flash on item
  - Item fades to "purchased" state
  - Gold counter animates (count down)

#### R2.4: Styling Improvements
- Use 3px borders (mockup standard)
- Proper inset shadows for depth
- Rarity border colors match design system
- Gold counter matches header styling

---

### R3: UpgradeShopModal Visual Polish

**Priority**: P0 - Critical

#### R3.1: Use Panel Component
- Wrap modal content in `<Panel>` component
- Animated corners on hover

#### R3.2: Add SVG Icons to Upgrades
- Create icon for each upgrade:
  - Vitality: Red heart
  - Fortune: Gold coins
  - Resilience: Blue shield
  - First Click Safety: Purple magic circle
  - Preparation: Green potion set
- Icons should be 20x20px inline SVGs

#### R3.3: Improved Level Display
- Show filled/empty pips for leveled upgrades
- Show lock/unlock icon for unlockable upgrades
- Maxed upgrades have distinct "MAX" badge

#### R3.4: Purchase Feedback
- On successful purchase:
  - Upgrade card glows briefly
  - Level pips animate (one fills in)
  - Gold counter animates

#### R3.5: Layout Improvements
- 2-column grid is fine for 5 items
- Better spacing between cards
- Continue button more prominent (primary style)

---

### R4: Shop Icon System

**Priority**: P1 - Important

#### R4.1: Create Icon Components
- `src/components/icons/ShopIcons.tsx`
- All icons as inline SVG React components
- Consistent 24x24 viewBox
- Use design system colors (gold, blood, ice, mystic, venom)

#### R4.2: Icon Props
- `size?: number` - defaults to 24
- `className?: string` - for additional styling

---

### R5: ShopItemCard Improvements

**Priority**: P1 - Important

#### R5.1: Icon Integration
- Add optional `icon` prop
- Display icon above item name
- Icon color matches rarity

#### R5.2: Animation
- Hover scale effect
- Press effect (slight shrink)
- Transition timing uses `--breath` (200ms)

---

## User Stories

### US1: Player Purchases First Click Safety
**As a** player who purchased First Click Safety upgrade
**I want** my first monster hit to be flagged instead of damaging me
**So that** the upgrade I bought actually provides value

**Acceptance Criteria**:
- First monster click flags the cell
- I don't lose HP on first monster
- Message confirms safety activated
- Second monster hit deals normal damage
- Safety resets each run

### US2: Player Views Polished Floor Shop
**As a** player entering the floor shop
**I want** the shop to look as polished as the main game
**So that** the experience feels cohesive and premium

**Acceptance Criteria**:
- Panel with animated gold corners
- Icons for each shop item
- Purchase provides visual feedback
- Colors match design system

### US3: Player Views Polished Upgrade Shop
**As a** player in the upgrade shop after death
**I want** the shop to look polished and professional
**So that** I feel my progression matters

**Acceptance Criteria**:
- Panel with animated gold corners
- Icons for each upgrade
- Level pips show progress
- Purchase animates smoothly

---

## Technical Considerations

### State Changes

Add to `RunState` in `src/types/game.ts`:
```typescript
firstMonsterHit: boolean;
```

### Component Changes

| Component | Change |
|-----------|--------|
| `FloorShop.tsx` | Wrap in Panel, add icons |
| `ShopItemCard.tsx` | Add icon prop, animations |
| `UpgradeShopModal.tsx` | Wrap in Panel, add icons, level pips |
| `gameStore.ts` | First click safety logic |

### New Components

| Component | Purpose |
|-----------|---------|
| `ShopIcons.tsx` | SVG icons for shop items |
| `UpgradeIcons.tsx` | SVG icons for upgrades (or same file) |

---

## Design References

- Primary: `.specify/reference/ui-mockup-definitive.html`
- Panel styling: `src/components/ui/Panel.tsx`
- Colors: CSS custom properties in `src/styles/globals.css`

---

## Success Criteria

1. First Click Safety upgrade works as described
2. Both shops use Panel component with animated corners
3. All items/upgrades have icons
4. Purchase provides visual feedback
5. All existing tests pass
6. New tests for first click safety pass
7. No visual regressions to main game
