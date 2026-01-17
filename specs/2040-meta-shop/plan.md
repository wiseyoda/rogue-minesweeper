# Implementation Plan: Shop Polish & First Click Safety

**Phase**: 2040
**Version**: 1.0
**Date**: 2026-01-15

---

## Overview

This plan describes the technical implementation for polishing both shop UIs and implementing the First Click Safety game logic.

---

## Phase A: First Click Safety (BL-001)

**Priority**: P0 - Must complete first as it's a critical bug fix

### A1: Type Updates

**File**: `src/types/game.ts`

Add `firstMonsterHit` to `RunState`:

```typescript
interface RunState {
  // ... existing fields
  firstMonsterHit: boolean;  // NEW: Tracks if first click safety has been used
}
```

### A2: Store Initialization

**File**: `src/stores/gameStore.ts`

In `startNewRun()`, initialize the new field:

```typescript
firstMonsterHit: false,
```

### A3: Safety Logic Implementation

**File**: `src/stores/gameStore.ts`

In `revealCell()` function, before calling `takeDamage()`:

```typescript
// Check first click safety
if (hitMonster) {
  const { firstClickSafety } = get().playerStats;
  const { firstMonsterHit } = get().run;

  if (firstClickSafety && !firstMonsterHit) {
    // Safety triggered! Flag instead of damage
    set((state) => {
      state.run.firstMonsterHit = true;
    });
    toggleFlag(position);
    // TODO: Add message "First Click Safety saved you!"
    return;
  }

  // Normal damage
  takeDamage(1);
}
```

### A4: Test Coverage

**File**: `src/stores/__tests__/gameStore.firstClickSafety.test.ts`

Tests to write:
1. Safety triggers when flag is true and first monster
2. Safety doesn't trigger when flag is false
3. Safety only triggers once per run
4. Second monster takes damage normally

---

## Phase B: Shop Icon System

**Priority**: P1 - Foundation for visual polish

### B1: Create Icon Components

**File**: `src/components/icons/ShopIcons.tsx`

Create inline SVG icons for all shop items and upgrades:

```typescript
// Shop item icons (24x24)
export const HealPotionIcon = ({ size = 24 }) => { /* SVG */ };
export const MaxHPUpIcon = ({ size = 24 }) => { /* SVG */ };
export const ShieldOrbIcon = ({ size = 24 }) => { /* SVG */ };
export const GoldMagnetIcon = ({ size = 24 }) => { /* SVG */ };
export const RevealScrollIcon = ({ size = 24 }) => { /* SVG */ };

// Upgrade icons (20x20)
export const VitalityIcon = ({ size = 20 }) => { /* SVG */ };
export const FortuneIcon = ({ size = 20 }) => { /* SVG */ };
export const ResilienceIcon = ({ size = 20 }) => { /* SVG */ };
export const FirstClickSafetyIcon = ({ size = 20 }) => { /* SVG */ };
export const PreparationIcon = ({ size = 20 }) => { /* SVG */ };
```

### B2: Icon Color Mapping

Icons should use design system colors:
- Heal/HP icons: `var(--blood)` / `var(--blood-bright)`
- Shield icons: `var(--ice)` / `var(--ice-bright)`
- Gold icons: `var(--gold)` / `var(--gold-bright)`
- Magic icons: `var(--mystic)` / `var(--mystic-bright)`
- Buff icons: `var(--venom)` / `var(--venom-bright)`

---

## Phase C: FloorShop Polish

**Priority**: P0 - Primary visual deliverable

### C1: Wrap in Panel Component

**File**: `src/components/shop/FloorShop.tsx`

Replace outer div styling with Panel:

```typescript
import { Panel } from '../ui';

// In render:
<Panel className="max-w-2xl w-full mx-4">
  {/* existing content */}
</Panel>
```

### C2: Update ShopItemCard

**File**: `src/components/shop/ShopItemCard.tsx`

Add icon prop and display:

```typescript
interface ShopItemCardProps {
  item: ShopItem;
  icon?: React.ReactNode;  // NEW
  canAfford: boolean;
  isPurchased: boolean;
  onPurchase: () => void;
}
```

Add animation states:
- Hover: `transform: scale(1.02)`
- Press: `transform: scale(0.98)`
- Purchase: Flash gold border, fade to purchased state

### C3: Icon Mapping in FloorShop

Map item IDs to icons:

```typescript
const ITEM_ICONS: Record<string, React.FC> = {
  'heal-potion': HealPotionIcon,
  'max-hp-up': MaxHPUpIcon,
  'shield-orb': ShieldOrbIcon,
  'gold-magnet': GoldMagnetIcon,
  'reveal-scroll': RevealScrollIcon,
};
```

### C4: Styling Updates

- Use 3px borders (match mockup)
- Add proper inset shadows
- Update gold counter styling

---

## Phase D: UpgradeShopModal Polish

**Priority**: P0 - Primary visual deliverable

### D1: Wrap in Panel Component

**File**: `src/components/ui/UpgradeShopModal.tsx`

Replace outer div styling with Panel:

```typescript
import { Panel } from './Panel';

// In render:
<Panel className="max-w-md w-full mx-4">
  {/* existing content */}
</Panel>
```

### D2: Update UpgradeCard

Add icon display and level pips:

```typescript
interface UpgradeCardProps {
  upgradeId: string;
  upgrade: PermanentUpgrade;
  icon?: React.ReactNode;  // NEW
  gold: number;
  onPurchase: (id: string) => void;
}
```

### D3: Level Pips Component

Create visual progress indicator:

```typescript
const LevelPips = ({ current, max }: { current: number; max: number }) => (
  <div className="flex gap-1">
    {Array.from({ length: max }, (_, i) => (
      <span
        key={i}
        style={{
          width: '6px',
          height: '6px',
          background: i < current ? 'var(--gold)' : 'var(--stone-600)',
          border: '1px solid var(--stone-500)',
        }}
      />
    ))}
  </div>
);
```

### D4: Icon Mapping

Map upgrade IDs to icons:

```typescript
const UPGRADE_ICONS: Record<string, React.FC> = {
  vitality: VitalityIcon,
  fortune: FortuneIcon,
  resilience: ResilienceIcon,
  firstClickSafety: FirstClickSafetyIcon,
  preparation: PreparationIcon,
};
```

### D5: Purchase Animation

On successful purchase:
1. Card border flashes gold
2. Level pip animates (fills in)
3. Gold counter animates (counts down)

---

## Phase E: Testing & Integration

### E1: Unit Tests

- First Click Safety logic tests
- Shop icon component rendering
- Level pips component

### E2: Integration Tests

- Full purchase flow with visual feedback
- Multiple purchases in session

### E3: Visual Regression Check

- Screenshot comparison with existing UI
- Verify no regressions to main game board

---

## Implementation Order

```
Phase A: First Click Safety (BL-001)
├── A1: Type updates
├── A2: Store initialization
├── A3: Safety logic
└── A4: Tests

Phase B: Icon System
├── B1: Create icon components
└── B2: Color mapping

Phase C: FloorShop Polish
├── C1: Panel wrapper
├── C2: ShopItemCard updates
├── C3: Icon mapping
└── C4: Styling

Phase D: UpgradeShopModal Polish
├── D1: Panel wrapper
├── D2: UpgradeCard updates
├── D3: Level pips
├── D4: Icon mapping
└── D5: Purchase animation

Phase E: Testing
├── E1: Unit tests
├── E2: Integration tests
└── E3: Visual check
```

---

## Files Changed

| File | Change Type | Description |
|------|-------------|-------------|
| `src/types/game.ts` | Modify | Add `firstMonsterHit` to RunState |
| `src/stores/gameStore.ts` | Modify | First click safety logic |
| `src/components/icons/ShopIcons.tsx` | Create | SVG icon components |
| `src/components/shop/FloorShop.tsx` | Modify | Panel wrapper, styling |
| `src/components/shop/ShopItemCard.tsx` | Modify | Icon prop, animations |
| `src/components/ui/UpgradeShopModal.tsx` | Modify | Panel wrapper, icons, level pips |
| `src/stores/__tests__/gameStore.firstClickSafety.test.ts` | Create | Safety logic tests |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Breaking existing shop logic | Keep functionality intact, only add styling |
| Performance with SVG icons | Use inline SVGs, memo components |
| Inconsistent styling | Use Panel component and design system vars |
| Tests breaking | Run full test suite after each phase |

---

## Success Criteria

- [ ] First Click Safety works as expected
- [ ] Both shops use Panel component
- [ ] All items/upgrades have icons
- [ ] Purchase animations work
- [ ] All tests pass
- [ ] No visual regressions
