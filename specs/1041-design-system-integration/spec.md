# Specification: Phase 1041 - Design System Integration

## Overview

**Goal**: Implement the definitive UI mockup design into the React application, transforming from the current light parchment theme to the dark void/stone dungeon aesthetic.

**Source of Truth**: `.specify/reference/ui-mockup-definitive.html` (open in browser for visual reference)
**Reference Files**: `.specify/reference/design-system/` (split CSS files for agent access)

## Current vs Target State

| Aspect | Current | Target |
|--------|---------|--------|
| Theme | Light parchment (#fef3c7) | Dark void (#05050a) |
| Fonts | Cinzel + Merriweather | Press Start 2P only |
| Layout | Top horizontal HUD | Sidebar (DM + Vitals + Runes) |
| Tiles | 32px, rounded corners, flat | 40px, square, 3D bevel |
| Atmosphere | None | 5 layers (brick, vignette, aura, particles, scanlines) |
| Branding | Generic fantasy | Mystic purple (#7030b0) signature |

## Scope

### In Scope

1. **Design Tokens** - CSS custom properties for all colors, timing, and scale values
2. **Foundation Styles** - Font loading, reset, body styling
3. **Atmosphere Layers** - 5 fixed-position background effects
4. **Layout Restructure** - Two-column grid with sidebar
5. **Panel Component** - Reusable panel with animated corner accents
6. **Tile Styling** - 3D bevel effect, no rounded corners, 40px size
7. **Sidebar Panels** - DM Panel (visual), Vitals Panel, Runes Panel
8. **Button Styling** - Primary (gold 3D) and secondary styles
9. **Icon Components** - SVG icons extracted from mockup
10. **Number Colors** - Tile number colors matching mockup

### Out of Scope

- DM message logic (visual only, static placeholder text)
- Rune slot functionality (visual only)
- Shop/inventory integration
- Sound effects
- Touch gesture enhancements

## Technical Approach

### CSS Strategy: Hybrid

- **CSS Custom Properties**: For design tokens (colors, timing, scale) and complex animations
- **Tailwind Utilities**: For layout (grid, flex, spacing) and responsive design
- **Component Styles**: Scoped CSS or CSS-in-JS for component-specific styling

### File Structure

```
src/
├── styles/
│   ├── tokens.css           # Design tokens (from 01-tokens.css)
│   └── animations.css       # Keyframe animations
├── components/
│   ├── atmosphere/
│   │   ├── BrickPattern.tsx
│   │   ├── Vignette.tsx
│   │   ├── MysticAura.tsx
│   │   ├── ParticleField.tsx
│   │   ├── Scanlines.tsx
│   │   └── index.ts
│   ├── sidebar/
│   │   ├── DMPanel.tsx
│   │   ├── VitalsPanel.tsx
│   │   ├── RunesPanel.tsx
│   │   ├── Sidebar.tsx
│   │   └── index.ts
│   ├── ui/
│   │   ├── Panel.tsx        # Reusable panel with corners
│   │   ├── Button.tsx       # Primary/secondary variants
│   │   ├── SegmentedBar.tsx # HP bar component
│   │   └── ...
│   ├── icons/
│   │   ├── Flag.tsx
│   │   ├── Skull.tsx
│   │   ├── Coin.tsx
│   │   ├── Shield.tsx
│   │   ├── Heart.tsx
│   │   └── index.ts
│   └── game/
│       ├── Tile.tsx         # Updated styling
│       ├── NumberDisplay.tsx # Updated colors
│       └── ...
└── index.css                # Updated with new theme
```

## User Stories

### US1: Developer Views Atmospheric Dungeon
**As a** player
**I want** to see an atmospheric dark dungeon environment
**So that** I feel immersed in the roguelike experience

**Acceptance Criteria**:
- [ ] Dark void background (#05050a) visible
- [ ] Brick pattern visible (subtle, ~40% opacity)
- [ ] Vignette darkens edges
- [ ] Mystic aura breathes from center (8s cycle)
- [ ] 8 particles float upward continuously
- [ ] Scanlines visible but subtle

### US2: Developer Sees Updated Game Layout
**As a** player
**I want** the game to have a sidebar layout
**So that** I can see my stats while focusing on the board

**Acceptance Criteria**:
- [ ] Two-column grid: game board (left), sidebar (right)
- [ ] Sidebar width: 280px
- [ ] Responsive: single column on screens < 860px
- [ ] Panel components have gold corner accents that expand on hover

### US3: Developer Sees Updated Tiles
**As a** player
**I want** tiles to look tactile and pixel-art styled
**So that** interactions feel satisfying

**Acceptance Criteria**:
- [ ] Tiles are 40px x 40px
- [ ] NO border-radius on tiles
- [ ] 3D bevel effect: light top-left, dark bottom-right
- [ ] Hover: lifts up 2px with shadow
- [ ] Active: presses down 3px, inverted bevel
- [ ] Flagged: gold border with glow
- [ ] Question: mystic purple border with wobble animation
- [ ] Number colors match mockup (1=blue, 2=green, 3=red, etc.)

### US4: Developer Sees DM Panel
**As a** player
**I want** to see the Dungeon Master watching me
**So that** the game feels alive and mysterious

**Acceptance Criteria**:
- [ ] DM Panel has mystic purple border
- [ ] Animated eye with radial gradient (purple colors)
- [ ] Eye slowly looks around (6s cycle)
- [ ] "WATCHING" status with blinking dot
- [ ] Placeholder message text (italic, bone-light color)

### US5: Developer Sees Vitals Panel
**As a** player
**I want** to see my health and resources clearly
**So that** I can make strategic decisions

**Acceptance Criteria**:
- [ ] Segmented health bar (not continuous gradient)
- [ ] Health segments pulse when critical (< 25%)
- [ ] Gold counter with coin icon
- [ ] Shield counter with shield icon
- [ ] Resource cards hover to highlight

### US6: Developer Sees Runes Panel
**As a** player
**I want** to see my active buffs/runes
**So that** I know what abilities are available

**Acceptance Criteria**:
- [ ] Panel header with diamond accent
- [ ] Rune cards with icon + name + description
- [ ] Active runes have mystic glow
- [ ] Empty slots shown with dashed border
- [ ] Cards expand icon slightly on hover

### US7: Developer Uses New Buttons
**As a** player
**I want** buttons to feel tactile
**So that** my choices feel consequential

**Acceptance Criteria**:
- [ ] Primary button: gold gradient with 3D shadow
- [ ] Primary hover: lifts up with glow
- [ ] Primary active: presses down
- [ ] Shine sweep effect on hover
- [ ] Secondary button: stone gray, subtle

### US8: Developer Sees Consistent Typography
**As a** player
**I want** all text to use the pixel art font
**So that** the aesthetic is cohesive

**Acceptance Criteria**:
- [ ] Press Start 2P loaded from Google Fonts
- [ ] ALL text uses Press Start 2P
- [ ] No Cinzel or Merriweather references
- [ ] Font sizes match mockup scale

## Non-Functional Requirements

### NFR1: Performance
- Atmosphere layers must not impact game performance
- Use CSS animations (GPU-accelerated) over JS animations
- Particles use CSS animation, not JS

### NFR2: Accessibility
- Maintain existing aria-labels on tiles
- Ensure color contrast meets WCAG AA for text
- Animations respect prefers-reduced-motion

### NFR3: Maintainability
- Design tokens centralized in single CSS file
- Component-scoped styles, no global style conflicts
- Clear file naming matching reference docs

## Constraints

1. **Single Font**: Press Start 2P ONLY - no other fonts allowed
2. **No Border Radius**: Tiles must be square with hard edges
3. **Inline SVGs**: All icons as inline SVG, no external URLs
4. **Self-Contained**: No external texture URLs (data URIs for patterns)
5. **Brand Color**: Mystic purple (#7030b0) as signature accent

## Dependencies

- Google Fonts: Press Start 2P (CDN load)
- Existing: Zustand store (no changes needed)
- Existing: Tailwind v4 (keep for layout utilities)

## Success Metrics

Visual verification against mockup:
1. Side-by-side comparison shows matching appearance
2. All atmosphere layers visible and animating
3. Tiles match exact 3D bevel styling
4. Sidebar panels match mockup layout
5. All text uses Press Start 2P font
6. Mystic purple appears in correct locations
