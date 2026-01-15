# Implementation Plan: Phase 1041 - Design System Integration

## Technical Context

### Current Architecture
- **UI Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 with `@theme` block
- **State**: Zustand with granular selectors
- **Layout**: Centered vertical stack with horizontal HUD

### Target Architecture
- **Styling**: Hybrid - CSS custom properties for tokens/animations + Tailwind for layout
- **Layout**: Two-column grid (game board + sidebar)
- **Theme**: Dark void with stone textures and mystic purple accents

### Constitution Compliance Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Information Is Power | N/A | No gameplay changes |
| II. The Dungeon Is Alive | ✅ Aligns | Living atmosphere, watching eye |
| III. Emergent Complexity | N/A | No gameplay changes |
| IV. Resource Tension | N/A | No gameplay changes |
| V. Passive Mastery | N/A | No gameplay changes |
| VI. Juice Is Holistic | ✅ Aligns | Focus on visual polish |
| VII. Move Fast | ✅ Aligns | Scoped to visual only |

**No constitution violations identified.**

## Implementation Strategy

### Approach: Bottom-Up Foundation

Build from tokens up to complete layout:

1. **Foundation Layer** (tokens, fonts, reset)
2. **Component Layer** (reusable building blocks)
3. **Feature Layer** (sidebar panels, updated tiles)
4. **Integration Layer** (App restructure, atmosphere)

### Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Tailwind conflicts with CSS custom properties | Medium | High | Test hybrid approach early, prefer CSS for complex effects |
| Performance impact from atmosphere layers | Low | Medium | Use CSS animations only, no JS timers |
| Font loading delay | Low | Low | Add `display=swap` to font import |
| Existing tests break | High | Low | Update snapshots, visual changes expected |

## Detailed Implementation Steps

### Phase A: Foundation (Setup)

#### A1. Create Design Tokens

**File**: `src/styles/tokens.css`

Extract from `.specify/reference/design-system/01-tokens.css`:
- All color custom properties (void, stone, bone, blood, gold, mystic, venom, ice)
- Number colors (--num-1 through --num-8)
- Timing tokens (tick, beat, breath, pulse, wave)
- Scale tokens (tile, gap, unit)

```css
:root {
  /* Colors */
  --void: #05050a;
  /* ... all tokens ... */
}
```

#### A2. Create Animation Definitions

**File**: `src/styles/animations.css`

Extract keyframes from reference files:
- `aura-breathe` (mystic aura)
- `particle-float` (dust particles)
- `eye-look` (DM eye movement)
- `status-blink` (status indicator)
- `flag-planted` (flag bounce)
- `question-wobble` (question mark)
- `hit-shake` (monster hit)
- `health-critical` (low HP pulse)
- `float-away` (damage numbers)

#### A3. Update Foundation Styles

**File**: `src/index.css`

Changes:
- Import tokens.css and animations.css
- Remove Cinzel/Merriweather font references
- Load Press Start 2P from Google Fonts
- Update body: background, font-family, cursor
- Add custom scrollbar styling
- Apply pixel rendering mode

### Phase B: Atmosphere Components

#### B1. Create BrickPattern Component

**File**: `src/components/atmosphere/BrickPattern.tsx`

Fixed-position SVG pattern background at z-index 0, 40% opacity.

#### B2. Create Vignette Component

**File**: `src/components/atmosphere/Vignette.tsx`

Fixed-position radial gradient at z-index 1.

#### B3. Create MysticAura Component

**File**: `src/components/atmosphere/MysticAura.tsx`

Fixed-position breathing glow at z-index 1, centered, 8s animation cycle.

#### B4. Create ParticleField Component

**File**: `src/components/atmosphere/ParticleField.tsx`

8 particles with staggered animation delays, floating upward.

#### B5. Create Scanlines Component

**File**: `src/components/atmosphere/Scanlines.tsx`

Fixed-position repeating linear gradient at z-index 100.

#### B6. Create Atmosphere Index

**File**: `src/components/atmosphere/index.ts`

Export all atmosphere components.

### Phase C: UI Building Blocks

#### C1. Create Panel Component

**File**: `src/components/ui/Panel.tsx`

Props: `children`, `className`, `variant` (default/dm)

Features:
- Gradient background
- 3D box shadow
- Four corner accent spans
- Hover effect expands corners

#### C2. Create SegmentedBar Component

**File**: `src/components/ui/SegmentedBar.tsx`

Props: `current`, `max`, `variant` (health/shield), `critical`

Features:
- Flexbox of segments
- Filled/empty state based on current/max
- Critical animation when applicable

#### C3. Create Button Component

**File**: `src/components/ui/Button.tsx`

Props: `variant` (primary/secondary), `children`, standard button props

Features:
- 3D bevel effect
- Hover lift with glow
- Active press down
- Shine sweep effect

### Phase D: Icon Components

#### D1. Create Icon Components

**Files**: `src/components/icons/*.tsx`

- `Flag.tsx` - Gold flag for flagged tiles
- `Skull.tsx` - Monster/death indicator
- `Coin.tsx` - Gold coin for currency
- `Shield.tsx` - Shield/defense icon
- `Heart.tsx` - HP/health icon
- `index.ts` - Export all icons

### Phase E: Sidebar Panels

#### E1. Create DMPanel Component

**File**: `src/components/sidebar/DMPanel.tsx`

Features:
- Mystic purple border and gradient
- Animated eye with radial gradient
- Eye movement animation (6s cycle)
- "WATCHING" status with blink
- Placeholder message text

#### E2. Create VitalsPanel Component

**File**: `src/components/sidebar/VitalsPanel.tsx`

Props: `health`, `maxHealth`, `gold`, `shields`, `floor`

Features:
- SegmentedBar for health
- Resource cards for gold/shields
- Hover effects

#### E3. Create RunesPanel Component

**File**: `src/components/sidebar/RunesPanel.tsx`

Props: `buffs` (from store)

Features:
- Header with diamond accent
- Rune cards for active buffs
- Empty slot placeholders
- Mystic glow on active

#### E4. Create Sidebar Container

**File**: `src/components/sidebar/Sidebar.tsx`

Composes DMPanel + VitalsPanel + RunesPanel in vertical stack.

#### E5. Create Sidebar Index

**File**: `src/components/sidebar/index.ts`

Export all sidebar components.

### Phase F: Tile Updates

#### F1. Update Tile Component Styling

**File**: `src/components/game/Tile.tsx`

Changes:
- Remove Tailwind rounded classes
- Add 3D bevel border-color styling
- Update background colors to stone scale
- Add hover lift effect
- Add active press effect
- Add state-specific styling (flagged, question, hit)
- Update size to 40px

#### F2. Update NumberDisplay Colors

**File**: `src/components/game/NumberDisplay.tsx`

Changes:
- Use --num-N custom properties
- Add text-shadow glow effect

#### F3. Update GameBoard Container

**File**: `src/components/game/GameBoard.tsx`

Changes:
- Apply tile-grid styling
- Update gap to use --gap token
- Add board area background styling

### Phase G: Layout Integration

#### G1. Update App Layout

**File**: `src/App.tsx`

Changes:
- Add atmosphere layers to root
- Create two-column grid structure
- Replace HUD with Sidebar
- Update title styling (22px, blood color, diamond accents)
- Update button styling
- Remove instruction text (or move to footer)

#### G2. Update GameContainer

**File**: `src/components/game/GameContainer.tsx`

Changes:
- Wrap board in Panel component
- Add board-area styling
- Update modal styling if needed

### Phase H: Polish

#### H1. Add prefers-reduced-motion Support

All animation components should check for reduced motion preference.

#### H2. Test Responsive Layout

Verify single-column layout at < 860px breakpoint.

#### H3. Update Tests

- Update snapshot tests
- Verify aria-labels preserved
- Test responsive breakpoint

## File Change Summary

### New Files (22)

```
src/styles/
├── tokens.css
└── animations.css

src/components/atmosphere/
├── BrickPattern.tsx
├── Vignette.tsx
├── MysticAura.tsx
├── ParticleField.tsx
├── Scanlines.tsx
└── index.ts

src/components/sidebar/
├── DMPanel.tsx
├── VitalsPanel.tsx
├── RunesPanel.tsx
├── Sidebar.tsx
└── index.ts

src/components/ui/
├── Panel.tsx
├── SegmentedBar.tsx
└── Button.tsx

src/components/icons/
├── Flag.tsx
├── Skull.tsx
├── Coin.tsx
├── Shield.tsx
├── Heart.tsx
└── index.ts
```

### Modified Files (6)

```
src/index.css
src/App.tsx
src/components/game/Tile.tsx
src/components/game/NumberDisplay.tsx
src/components/game/GameBoard.tsx
src/components/game/GameContainer.tsx
```

### Potentially Modified (tests)

```
src/components/**/__tests__/*.test.tsx (snapshot updates)
```

## Dependencies

No new npm dependencies required. Uses:
- Google Fonts CDN (Press Start 2P)
- Existing Tailwind CSS
- Existing React patterns

## Testing Strategy

1. **Visual Testing**: Side-by-side comparison with mockup
2. **Snapshot Updates**: Expected for all visual components
3. **Accessibility Check**: Verify aria-labels preserved
4. **Performance Check**: Verify no FPS drops from atmosphere
5. **Responsive Check**: Test 860px breakpoint

## Success Criteria

- [ ] All atmosphere layers visible and animating
- [ ] Tiles match mockup exactly (40px, square, 3D bevel)
- [ ] Press Start 2P font loads and displays
- [ ] Sidebar with DM/Vitals/Runes panels visible
- [ ] DM eye animates
- [ ] Health bar is segmented, not continuous
- [ ] Number colors match mockup
- [ ] Gold/mystic accents in correct locations
- [ ] No console errors
- [ ] Responsive layout works at breakpoint
