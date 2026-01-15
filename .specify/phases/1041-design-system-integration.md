---
phase: '1041'
name: design-system-integration
status: not_started
created: 2026-01-15
---

# 1041 - Design System Integration

**Goal**: Implement the definitive UI mockup design into the React application.

## Source of Truth

📄 **`.specify/reference/ui-mockup-definitive.html`** - Open in browser for visual reference.

## Current State

The app currently uses:
- Light parchment theme with Cinzel/Merriweather fonts
- Top-positioned horizontal HUD
- Simple flat tiles with rounded corners
- No atmosphere effects

## Target State

Match the mockup exactly:
- **Dark void theme** with stone textures
- **Press Start 2P** as the ONLY font
- **Sidebar layout** (DM Panel, Vitals Panel, Runes Panel)
- **40px 3D beveled tiles** with no rounded corners
- **Atmosphere layers** (brick pattern, vignette, particles, scanlines)
- **Mystic purple (#7030b0)** as brand color

## Scope

### 1. Design Tokens (`src/styles/tokens.css`)

Extract all CSS custom properties from mockup:

```css
:root {
  /* Colors - Void/Stone Scale */
  --void: #05050a;
  --stone-900: #0f0d0a;
  --stone-800: #1a1814;
  --stone-700: #28241e;
  --stone-600: #3a352c;
  --stone-500: #524a3e;

  /* Colors - Semantic */
  --bone: #c4b8a0;
  --bone-dim: #8a8070;
  --blood: #cc2020;
  --blood-dark: #801010;
  --gold: #d0a020;
  --gold-dim: #906810;
  --mystic: #7030b0;
  --mystic-dim: #502080;

  /* Number Colors */
  --num-1: #6090d0;
  --num-2: #50a050;
  --num-3: #cc2020;
  --num-4: #8040a0;
  --num-5: #a04040;
  --num-6: #40a0a0;
  --num-7: #202020;
  --num-8: #606060;

  /* Timing */
  --tick: 50ms;
  --beat: 100ms;
  --breath: 200ms;
  --pulse: 400ms;
  --wave: 800ms;

  /* Scale */
  --tile: 40px;
  --gap: 2px;
  --unit: 4px;
}
```

### 2. Atmosphere Components

Create fixed-position background layers:

| Component | z-index | Description |
|-----------|---------|-------------|
| `BrickPattern.tsx` | 0 | SVG brick pattern background |
| `Vignette.tsx` | 1 | Radial gradient darkening edges |
| `MysticAura.tsx` | 2 | Breathing purple glow from center |
| `ParticleField.tsx` | 3 | Floating dust particles (CSS animation) |
| `Scanlines.tsx` | 4 | Subtle CRT scanline effect |

### 3. Layout Restructure

Change from top-HUD to sidebar layout:

```
┌─────────────────────────────────────────────────────┐
│ [Atmosphere Layers - fixed position]                │
├──────────────────────────────┬──────────────────────┤
│                              │  ┌────────────────┐  │
│                              │  │  DM PANEL      │  │
│                              │  │  (animated eye)│  │
│      GAME BOARD              │  ├────────────────┤  │
│      (centered)              │  │  VITALS PANEL  │  │
│                              │  │  HP / Shield   │  │
│                              │  │  Gold / Floor  │  │
│                              │  ├────────────────┤  │
│                              │  │  RUNES PANEL   │  │
│                              │  │  (slots)       │  │
│                              │  └────────────────┘  │
├──────────────────────────────┴──────────────────────┤
│  [ACTION BUTTONS] Descend / New Delve / Settings    │
└─────────────────────────────────────────────────────┘
```

### 4. Component Updates

| Component | Changes |
|-----------|---------|
| `Tile.tsx` | 3D bevel, no border-radius, new colors, 40px size |
| `NumberDisplay.tsx` | Use `--num-N` colors from tokens |
| `HealthBar.tsx` | Segmented bar (not continuous), pulse when critical |
| `GoldCounter.tsx` | SVG coin icon from mockup, gold color |
| `HUD.tsx` → `Sidebar.tsx` | Vertical layout, panel-based |
| `GameBoard.tsx` | CSS Grid with `--tile` and `--gap` sizing |
| `App.tsx` | New layout structure, remove old styling |

### 5. Typography Update

- Remove Cinzel and Merriweather
- Add Press Start 2P (Google Fonts)
- Update all text to use single font
- Establish size scale: 12px/10px/8px/7px/6px/5px

### 6. Icon Components

Extract SVG icons from mockup into React components:

- `icons/Heart.tsx`
- `icons/Shield.tsx`
- `icons/Coin.tsx`
- `icons/Flag.tsx`
- `icons/Skull.tsx`
- `icons/Exit.tsx`

## Deliverables

| File | Description |
|------|-------------|
| `src/styles/tokens.css` | CSS custom properties |
| `src/styles/animations.css` | Keyframe animations |
| `src/components/atmosphere/BrickPattern.tsx` | Background layer |
| `src/components/atmosphere/Vignette.tsx` | Edge darkening |
| `src/components/atmosphere/MysticAura.tsx` | Breathing glow |
| `src/components/atmosphere/ParticleField.tsx` | Floating particles |
| `src/components/atmosphere/Scanlines.tsx` | CRT effect |
| `src/components/atmosphere/index.ts` | Exports |
| `src/components/sidebar/DMPanel.tsx` | Animated eye panel |
| `src/components/sidebar/VitalsPanel.tsx` | HP/Shield/Gold/Floor |
| `src/components/sidebar/RunesPanel.tsx` | Rune slots |
| `src/components/sidebar/Sidebar.tsx` | Container |
| `src/components/sidebar/index.ts` | Exports |
| `src/components/ui/Panel.tsx` | Reusable panel with corner accents |
| `src/components/ui/Button.tsx` | Primary/Secondary variants |
| `src/components/ui/SegmentedBar.tsx` | HP bar component |
| `src/components/icons/*.tsx` | SVG icon components |
| `src/index.css` | Updated with new theme |
| `src/App.tsx` | New layout structure |

## Verification Gate

Visual verification against mockup:

- [ ] Dark void background visible
- [ ] Brick pattern visible (subtle)
- [ ] Vignette darkens edges
- [ ] Mystic aura breathes from center
- [ ] Particles float upward
- [ ] Scanlines visible (subtle)
- [ ] Press Start 2P font loads and displays
- [ ] Sidebar on right side with three panels
- [ ] DM panel has animated eye
- [ ] Vitals panel shows segmented HP bar
- [ ] Tiles are 40px with 3D bevel
- [ ] Tiles have NO rounded corners
- [ ] Number colors match mockup (1=blue, 2=green, etc.)
- [ ] Gold accents use #d0a020
- [ ] Mystic purple (#7030b0) appears on active states
- [ ] Buttons have proper styling

## Estimated Complexity

**High** - Major UI overhaul affecting most components.

## Implementation Order

1. **Tokens first** - Create tokens.css and animations.css
2. **Update index.css** - Replace old theme with new tokens + font
3. **Atmosphere layers** - Create and test each layer
4. **Panel component** - Reusable base for sidebar panels
5. **Icon components** - Extract all SVGs
6. **Sidebar panels** - DM, Vitals, Runes
7. **Update Tile** - 3D bevel, colors, sizing
8. **Update App layout** - New structure
9. **Polish** - Timing, transitions, details

## Notes

- **DO NOT** use emoji for icons
- **DO NOT** add border-radius to tiles
- **DO NOT** use any font other than Press Start 2P
- **DO NOT** use external texture URLs
- **DO** match mockup colors exactly
- **DO** use CSS custom properties throughout
- **DO** use timing tokens for all animations
